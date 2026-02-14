
import { useClassifiedTx } from '@/components/useClassifiedTx'

export default function KPIs(){
  const rows = useClassifiedTx()
  const total = rows.reduce((s,r)=>s+r.amount,0)
  const unresolved = rows.filter(r=>r.needsUser).length
  const withCat = rows.filter(r=>!r.needsUser).length
  return (
    <div className="kpis">
      <div className="kpi"><div className="muted">סה"כ עסקאות</div><div style={{fontSize:24}}>{rows.length.toLocaleString()}</div></div>
      <div className="kpi"><div className="muted">סה"כ הוצאה</div><div style={{fontSize:24}}>{total.toLocaleString(undefined,{maximumFractionDigits:2})} ₪</div></div>
      <div className="kpi"><div className="muted">מסווגות</div><div style={{fontSize:24}}>{withCat.toLocaleString()}</div></div>
      <div className="kpi"><div className="muted">דורשות סיווג</div><div style={{fontSize:24,color:'#fca5a5'}}>{unresolved.toLocaleString()}</div></div>
    </div>
  )
}
