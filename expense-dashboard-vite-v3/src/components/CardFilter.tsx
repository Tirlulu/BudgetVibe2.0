
import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { uniqueCards } from '@/lib/utils'

export default function CardFilter(){
  const tx = useStore(s=>s.tx)
  const selected = useStore(s=>s.selectedCards)
  const setSelected = useStore(s=>s.setSelected)
  const cards = uniqueCards(tx)

  useEffect(()=>{ if (selected.length===0 && cards.length>0) setSelected(cards) },[tx])

  const toggle = (card: string) => { if (selected.includes(card)) setSelected(selected.filter(c=>c!==card)); else setSelected([...selected, card]) }

  if (cards.length===0) return null
  return (
    <div className="card"> 
      <h3>סינון לפי כרטיס</h3>
      <div className="checkbox-list">
        {cards.map(c => (<label key={c}><input type="checkbox" checked={selected.includes(c)} onChange={()=>toggle(c)} />כרטיס • {c}</label>))}
      </div>
    </div>
  )
}
