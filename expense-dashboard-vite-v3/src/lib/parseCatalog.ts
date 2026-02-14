import * as XLSX from 'xlsx'
import type { Category, AliasRule } from '@/types'

function pick<T extends Record<string, unknown>>(row: T, ...keys: string[]): string {
  const lower = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  const rowKeys = Object.keys(row)
  for (const key of keys) {
    const k = rowKeys.find(rk => lower(rk) === lower(key) || lower(rk).replace(/_/g, ' ') === lower(key))
    if (k != null && row[k] != null) return String(row[k]).trim()
  }
  return ''
}

function rowToCategory(row: Record<string, unknown>, index: number): Category {
  const category_id = pick(row, 'category_id', 'Category ID', 'category id', 'id', 'מזהה') || String(index + 1)
  const category_name = pick(row, 'category_name', 'Category Name', 'category name', 'name', 'שם קטגוריה', 'קטגוריה')
  const parent_category = pick(row, 'parent_category', 'Parent Category', 'parent category', 'parent', 'קטגוריה אב')
  const allowed = pick(row, 'allowed_recurring', 'Allowed Recurring', 'recurring') as 'yes'|'no'|'both'
  const isActive = row['is_active'] ?? row['Is Active'] ?? row['is active']
  const is_active = isActive === false || String(isActive).toLowerCase() === 'no' ? false : true
  return {
    category_id: category_id || `cat_${index}`,
    category_name: category_name || category_id || 'ללא שם',
    parent_category: parent_category || '',
    allowed_recurring: allowed === 'yes' || allowed === 'no' || allowed === 'both' ? allowed : 'both',
    is_active,
  }
}

export async function parseCatalog(file: File): Promise<{cats: Category[], aliases: AliasRule[]}> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const catsWs = wb.Sheets['CategoryMaster'] ?? wb.Sheets[wb.SheetNames[0]]
  const alWs = wb.Sheets['CategoryAliases'] ?? wb.Sheets[wb.SheetNames[1]]
  if (!catsWs) throw new Error('קובץ ללא גיליונות. נדרש גיליון "CategoryMaster" או גיליון ראשון עם קטגוריות.')
  const rawCats = XLSX.utils.sheet_to_json<Record<string, unknown>>(catsWs)
  const cats: Category[] = Array.isArray(rawCats) ? rawCats.map((row, i) => rowToCategory(row, i)) : []
  const rawAliases = alWs ? XLSX.utils.sheet_to_json<Record<string, unknown>>(alWs) : []
  const aliases: AliasRule[] = Array.isArray(rawAliases) ? rawAliases.map(a => ({
    alias: pick(a, 'alias', 'Alias'),
    canonical_category: pick(a, 'canonical_category', 'Canonical Category', 'category'),
    match_type: (pick(a, 'match_type', 'Match Type') as 'equals'|'contains'|'regex') || 'contains',
    is_active: a['is_active'] !== false && String(a['is_active']).toLowerCase() !== 'no',
  })).filter(a => a.alias && a.canonical_category) : []
  return { cats, aliases }
}
