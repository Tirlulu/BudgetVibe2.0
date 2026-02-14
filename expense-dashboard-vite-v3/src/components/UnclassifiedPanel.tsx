
import { useMemo, useState } from 'react'
import { useClassifiedTx } from '@/components/useClassifiedTx'
import { useStore } from '@/store/useStore'

export default function UnclassifiedPanel(){
  const rows = useClassifiedTx()
  const { categories, addRule } = useStore()
  const [selection, setSelection] = useState<Record<string,string>>({})
  const need = useMemo(()=> rows.filter(r=>r.needsUser).slice(0,100), [rows])

  const onSave = ()=>{
    Object.entries(selection).forEach(([key, cat])=>{
      const [merchant, cardLast4] = key.split('|')
      addRule({ field:'merchant', match_type:'equals', pattern: merchant, category_id: cat, amount_min:null, amount_max:null, card_last4: cardLast4 || null, priority: 50 })
    })
    setSelection({})
    alert('נשמרו כללי מיפוי: '+Object.keys(selection).length)
  }

  if (need.length===0) return null
  return (
    <div className="card"> 
      <h3>דורש סיווג (עד 100 ראשונים)</h3>
      <table className="table"> 
        <thead><tr><th>בית עסק</th><th>כרטיס</th><th>תיאור</th><th>סכום</th><th>קטגוריה</th></tr></thead>
        <tbody>
          {need.map((r,idx)=>{
            const key = `${r.merchant}|${r.cardLast4||''}`
            return (
              <tr key={idx}>
                <td>{r.merchant}</td><td>{r.cardLast4}</td><td className="small">{r.description}</td><td>{r.amount.toFixed(2)}</td>
                <td>
                  <select value={selection[key]||''} onChange={e=> setSelection({...selection, [key]: e.target.value})}>
                    <option value="">בחר קטגוריה…</option>
                    {categories.filter(c=>c.is_active!==false).map(c=> <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="spacer"></div>
      <button className="primary" onClick={onSave}>שמור כללי מיפוי</button>
      <p className="muted small">נשמר לכללי משתמש (LocalStorage). אפשר למחוק/לערוך ב"ניהול חוקים".</p>
    </div>
  )
}
