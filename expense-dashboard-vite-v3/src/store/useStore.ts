
import { create } from 'zustand'
import type { Transaction, Category, AliasRule, UserRule } from '@/types'

function loadRules(): UserRule[] {
  try { return JSON.parse(localStorage.getItem('user_rules')||'[]') } catch { return [] }
}
function saveRules(r: UserRule[]) { localStorage.setItem('user_rules', JSON.stringify(r)) }

function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36) }

export const useStore = create<{
  tx: Transaction[]
  categories: Category[]
  aliases: AliasRule[]
  selectedCards: string[]
  userRules: UserRule[]
  setTx: (rows: Transaction[]) => void
  addTx: (rows: Transaction[]) => void
  clearTx: () => void
  setSelected: (cards: string[]) => void
  setCatalog: (cats: Category[], als: AliasRule[]) => void
  addRule: (r: Omit<UserRule,'id'|'created_at'>) => void
  deleteRule: (id: string) => void
  }>((set)=>({
    tx: [], categories: [], aliases: [], selectedCards: [], userRules: loadRules(),
    setTx: (rows)=> set({ tx: rows }),
    addTx: (rows)=> set((state)=>({ tx: [...state.tx, ...rows] })),
    clearTx: ()=> set({ tx: [] }),
    setSelected: (cards)=> set({ selectedCards: cards }),
    setCatalog: (cats, als)=> set({ categories: cats, aliases: als }),
    addRule: (r)=> set((state)=>{ const rule={...r, id: uid(), created_at: new Date().toISOString()}; const next=[...state.userRules, rule]; saveRules(next); return { userRules: next } }),
    deleteRule: (id)=> set((state)=>{ const next=state.userRules.filter(x=>x.id!==id); saveRules(next); return { userRules: next } })
  }))
