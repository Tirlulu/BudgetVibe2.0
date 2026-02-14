
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import customParse from 'dayjs/plugin/customParseFormat'
import type { Transaction } from '@/types'

dayjs.extend(customParse)

function findHeaderRow(ws: XLSX.WorkSheet): number {
  const ref = ws['!ref']
  if (!ref) return 0
  const range = XLSX.utils.decode_range(ref)
  for (let r = range.s.r; r <= Math.min(range.e.r, 20); r++) {
    const rowVals: string[] = []
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell) rowVals.push(String(cell.v))
    }
    if (rowVals.some(v => String(v).includes('תאריך רכישה'))) return r
    if (rowVals.some(v => /date|תאריך|רכישה/i.test(String(v)))) return r
  }
  return 0
}

export async function parseStatementFiles(files: File[]): Promise<Transaction[]> {
  const out: Transaction[] = []
  for (const f of files) {
    const buf = await f.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const firstSheet = wb.SheetNames[0]
    if (!firstSheet) continue
    const ws = wb.Sheets[firstSheet]
    if (!ws || !ws['!ref']) continue
    const headerRow = findHeaderRow(ws)
    const data = XLSX.utils.sheet_to_json<any>(ws, { header: 1, range: headerRow }) as any[]
    if (!data.length) continue
    const headers = (data[0] || []).map((h: unknown) => String(h ?? ''))
    const rows = data.slice(1)

    const col = {
      date: headers.findIndex(h => /תאריך רכישה|date|תאריך|רכישה/i.test(h)),
      merchant: headers.findIndex(h => /שם בית עסק|merchant|עסק|תיאור/i.test(h)),
      amountCharge: headers.findIndex(h => /סכום חיוב|amount|חיוב|סכום/i.test(h)),
      voucher: headers.findIndex(h => /שובר|voucher|מס'/i.test(h)),
      notes: headers.findIndex(h => /פירוט נוסף|notes|הערות/i.test(h)),
      currency: headers.findIndex(h => /מטבע חיוב|מטבע|currency/i.test(h))
    }
    if (col.amountCharge === -1) continue

    const cardMatch = f.name.match(/^(\d{4})_/)
    const cardLast4 = cardMatch ? cardMatch[1] : undefined

    for (const row of rows) {
      const amount = Number(row[col.amountCharge])
      if (!amount || isNaN(amount)) continue
      const rawDate = row[col.date]
      const date = dayjs(String(rawDate), ['DD.MM.YYYY','DD.MM.YY','YYYY-MM-DD'], 'he', true)
      const merchant = String(row[col.merchant ?? 0] ?? '').trim()
      const description = String(row[col.notes >= 0 ? col.notes : 0] ?? '').trim() || undefined
      out.push({
        source: f.name,
        cardLast4,
        date: (date.isValid() ? date.toDate() : new Date(String(rawDate))).toISOString(),
        merchant,
        description,
        amount,
        currency: col.currency >= 0 ? String(row[col.currency] ?? '₪') : '₪',
        voucher: col.voucher >= 0 ? row[col.voucher] : undefined,
      })
    }
  }
  const dedup = new Map<string, Transaction>()
  for (const t of out) { const key = `${t.source}|${t.date.slice(0,10)}|${t.merchant}|${t.amount}|${t.voucher ?? ''}`; dedup.set(key, t) }
  return Array.from(dedup.values())
}
