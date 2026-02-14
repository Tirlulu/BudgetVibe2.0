
import type { Transaction, Category, AliasRule, UserRule } from '@/types'

export function uniqueCards(tx: Transaction[]) { return Array.from(new Set(tx.map(t=>t.cardLast4).filter(Boolean))) as string[] }

export function filterByCards(tx: Transaction[], cards: string[]) { if (!cards || cards.length===0) return tx; return tx.filter(t => !t.cardLast4 || cards.includes(t.cardLast4)) }

export function groupByMonth(tx: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of tx) { const m = t.date.slice(0,7); map.set(m, (map.get(m) ?? 0) + t.amount) }
  return Array.from(map.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([month, total])=>({month, total}))
}

export function sumByCategory(tx: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of tx) { const k = t.categoryName ?? 'ללא קטגוריה'; map.set(k, (map.get(k) ?? 0) + t.amount) }
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).map(([category, total])=>({category, total}))
}

export function findRecurring(tx: Transaction[]) {
  const map = new Map<string, Set<string>>()
  for (const t of tx) { const key = `${t.merchant}|${t.amount.toFixed(2)}`; const m = t.date.slice(0,7); if (!map.has(key)) map.set(key, new Set()); map.get(key)!.add(m) }
  return Array.from(map.entries()).filter(([, months])=>months.size>=2).map(([key, months])=>{ const [merchant, amount] = key.split('|'); return { merchant, amount: Number(amount), months: Array.from(months).sort() } })
}

export function matchText(text: string, pattern: string, type: 'equals'|'contains'|'regex'){ const s=(text||'').toLowerCase(); const p=pattern.toLowerCase(); if(type==='equals') return s===p; if(type==='contains') return s.includes(p); try{ if(type==='regex') return new RegExp(pattern,'i').test(text||'') }catch{} return false }

export function decideCategory(categories: Category[], aliases: AliasRule[], rules: UserRule[], t: Transaction): {categoryId?: string, categoryName?: string, confidence: number, matchedRule?: string} {
  const norm = (x:string|undefined)=> (x||'').trim()
  const mName = norm(t.merchant)
  const desc = norm(t.description)
  // 1) user rules (specific → general by priority)
  const user = [...rules].sort((a,b)=>a.priority-b.priority).find(r=>{
    const fieldVal = r.field==='merchant'? mName : desc
    if (!matchText(fieldVal, r.pattern, r.match_type)) return false
    if (r.card_last4 && t.cardLast4 && r.card_last4!==t.cardLast4) return false
    if (r.amount_min!=null && t.amount<r.amount_min) return false
    if (r.amount_max!=null && t.amount>r.amount_max) return false
    return true
  })
  if (user){ const cat = categories.find(c=>c.category_id===user.category_id); if (cat) return { categoryId: cat.category_id, categoryName: cat.category_name, confidence: 0.95, matchedRule: user.id } }
  // 2) aliases (equals → contains)
  const aliasEq = aliases.find(a=>a.is_active!==false && a.match_type==='equals' && matchText(mName, a.alias, 'equals'))
  if (aliasEq){ const cat = categories.find(c=>c.category_name===aliasEq.canonical_category); if (cat) return { categoryId: cat.category_id, categoryName: cat.category_name, confidence: 0.85 } }
  const aliasCont = aliases.find(a=>a.is_active!==false && a.match_type==='contains' && matchText(mName, a.alias, 'contains'))
  if (aliasCont){ const cat = categories.find(c=>c.category_name===aliasCont.canonical_category); if (cat) return { categoryId: cat.category_id, categoryName: cat.category_name, confidence: 0.8 } }
  // 3) keywords fallback (very light touch)
  const kw = [
    {k:'netflix', c:'תקשורת/מדיה'}, {k:'youtube', c:'תקשורת/מדיה'}, {k:'pango', c:'רכב – דלק/אביזרים/חניה'}, {k:'bit', c:'בלתי מתוכננות/מזומן ללא מעקב'},
    {k:'insurance', c:'ביטוחים'}, {k:'איילון', c:'ביטוחים'}, {k:'חשמל', c:'דיור ומיסים'}
  ]
  const hit = kw.find(x=> (mName.toLowerCase().includes(x.k) || desc.toLowerCase().includes(x.k)))
  if (hit){ const cat = categories.find(c=>c.category_name===hit.c); if (cat) return { categoryId: cat.category_id, categoryName: cat.category_name, confidence: 0.6 } }
  return { confidence: 0.0 }
}
