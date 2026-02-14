
export type Transaction = {
  source: string
  cardLast4?: string
  date: string
  merchant: string
  description?: string
  amount: number
  currency?: string
  voucher?: string | number
  notes?: string
  categoryId?: string
  categoryName?: string
  confidence?: number
  isRecurring?: boolean
  isRecurringCandidate?: boolean
  needsUser?: boolean
}

export type Category = {
  category_id: string
  parent_category: string
  category_name: string
  short_desc?: string
  allowed_recurring: 'yes'|'no'|'both'
  is_active?: boolean
}

export type AliasRule = {
  alias: string
  canonical_category: string
  match_type: 'equals'|'contains'|'regex'
  allowed_recurring_override?: 'yes'|'no'|'both'|null
  is_active?: boolean
  notes?: string
}

export type UserRule = {
  id: string
  field: 'merchant'|'description'
  match_type: 'equals'|'contains'|'regex'
  pattern: string
  category_id: string
  amount_min?: number|null
  amount_max?: number|null
  card_last4?: string|null
  priority: number
  created_at: string
}
