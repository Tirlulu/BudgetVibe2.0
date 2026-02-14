
import { useStore } from '@/store/useStore'

export default function RulesTable(){
  const { userRules, deleteRule, categories } = useStore()
  const nameOf = (id?:string)=> categories.find(c=>c.category_id===id)?.category_name || id
  return (
    <div className="card"> 
      <h3>ניהול חוקים (משתמש)</h3>
      <table className="table"> 
        <thead><tr><th>שדה</th><th>סוג התאמה</th><th>תבנית</th><th>כרטיס</th><th>טווח סכום</th><th>קטגוריה</th><th>עדיפות</th><th></th></tr></thead>
        <tbody>
          {userRules.map(r=> (
            <tr key={r.id}>
              <td>{r.field}</td><td>{r.match_type}</td><td className="small">{r.pattern}</td><td>{r.card_last4||''}</td>
              <td className="small">{r.amount_min||''}–{r.amount_max||''}</td><td>{nameOf(r.category_id)}</td><td>{r.priority}</td>
              <td><button onClick={()=>deleteRule(r.id)}>מחק</button></td>
            </tr>
          ))}
          {userRules.length===0 && <tr><td colSpan={8} className="muted">אין חוקים עדיין.</td></tr>}
        </tbody>
      </table>
      <p className="muted small">חוקים נשמרים מקומית (LocalStorage). בעת פריסה לתצורת שרת, ניתן לשמור בבסיס נתונים.</p>
    </div>
  )
}
