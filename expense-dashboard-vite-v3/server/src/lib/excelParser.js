/**
 * Parse credit card statement Excel (Hebrew headers).
 * Expects: תאריך רכישה | שם בית עסק | סכום עסקה | מטבע עסקה | סכום חיוב | מטבע חיוב | מס' שובר | פירוט נוסף
 */

import * as XLSX from 'xlsx';

const DATE_HEADER = 'תאריך רכישה';
const MERCHANT_HEADER = 'שם בית עסק';
const AMOUNT_HEADER = 'סכום חיוב';
const CURRENCY_HEADER = 'מטבע חיוב';

const REQUIRED_HEADERS_FOR_ROW = [DATE_HEADER, MERCHANT_HEADER, AMOUNT_HEADER];

const MAX_HEADER_SCAN_ROWS = 25;

function trimCell(value) {
  if (value == null) return '';
  return String(value).trim();
}

function rowContainsRequiredHeaders(row) {
  const cells = row.map(trimCell);
  for (const h of REQUIRED_HEADERS_FOR_ROW) {
    if (!cells.includes(h)) return false;
  }
  return true;
}

function findHeaderRow(rows) {
  const end = Math.min(rows.length, MAX_HEADER_SCAN_ROWS);
  for (let r = 0; r < end; r++) {
    const row = rows[r] || [];
    const normalized = Array.isArray(row) ? row : [];
    if (rowContainsRequiredHeaders(normalized)) return r;
  }
  return -1;
}

function getColumnIndex(headerRow, headerName) {
  const row = headerRow || [];
  for (let c = 0; c < row.length; c++) {
    if (trimCell(row[c]) === headerName) return c;
  }
  return -1;
}

function parseDateDDMMYY(value) {
  const s = trimCell(value);
  if (!s) return null;
  const parts = s.split(/[.\-/]/);
  if (parts.length < 3) return null;
  let d = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10) - 1;
  let y = parseInt(parts[2], 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  if (y < 100) y += 2000;
  const date = new Date(y, m, d);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function normalizeMerchant(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCurrency(value) {
  const s = trimCell(value);
  if (!s) return 'ILS';
  if (s === '₪' || s.includes('₪') || /shekel|שקל|ils/i.test(s)) return 'ILS';
  return s;
}

/**
 * Parse Excel buffer; return array of { purchaseDate, merchantRaw, merchant, amount, currency }.
 */
export function parseCreditCardExcel(buffer) {
  const result = [];
  try {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = wb.SheetNames && wb.SheetNames[0];
    if (!sheetName) return result;
    const ws = wb.Sheets[sheetName];
    if (!ws || !ws['!ref']) return result;

    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (!rows.length) return result;

    const headerRowIndex = findHeaderRow(rows);
    if (headerRowIndex < 0) return result;

    const headerRow = rows[headerRowIndex] || [];
    const dateCol = getColumnIndex(headerRow, DATE_HEADER);
    const merchantCol = getColumnIndex(headerRow, MERCHANT_HEADER);
    const amountCol = getColumnIndex(headerRow, AMOUNT_HEADER);
    const currencyCol = getColumnIndex(headerRow, CURRENCY_HEADER);

    if (dateCol < 0 || merchantCol < 0 || amountCol < 0) return result;

    for (let r = headerRowIndex + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row)) continue;
      const isEmpty = row.every((cell) => cell == null || String(cell).trim() === '');
      if (isEmpty) break;

      const amountVal = row[amountCol];
      const amount = typeof amountVal === 'number' ? amountVal : parseFloat(String(amountVal ?? '').replace(/,/g, ''));
      if (isNaN(amount) || amount === 0) continue;

      const purchaseDate = parseDateDDMMYY(row[dateCol]);
      if (!purchaseDate) continue;

      const merchantRaw = trimCell(row[merchantCol] ?? '');
      const merchant = normalizeMerchant(merchantRaw);
      const currency = currencyCol >= 0 ? normalizeCurrency(row[currencyCol]) : 'ILS';

      result.push({
        purchaseDate,
        merchantRaw,
        merchant,
        amount,
        currency,
      });
    }
  } catch (err) {
    console.error('excelParser error:', err?.message ?? err);
  }
  return result;
}
