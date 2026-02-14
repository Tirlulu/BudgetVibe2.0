
import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { filterByCards, decideCategory } from '@/lib/utils'

export function useClassifiedTx(){
  const { tx, categories, aliases, userRules, selectedCards } = useStore()
  return useMemo(()=>{
    return filterByCards(tx, selectedCards).map(t=>{
      const { categoryId, categoryName, confidence } = decideCategory(categories, aliases, userRules, t)
      return { ...t, categoryId, categoryName, confidence, needsUser: !categoryId }
    })
  }, [tx, categories, aliases, userRules, selectedCards])
}
