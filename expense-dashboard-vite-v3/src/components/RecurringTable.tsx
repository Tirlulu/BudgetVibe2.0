
import { useClassifiedTx } from '@/components/useClassifiedTx'
import { findRecurring } from '@/lib/utils'

export default function RecurringTable(){
  const rows = useClassifiedTx()
  const data = findRecurring(rows)
  return (
    <div className="card"> 
      <h3>חיובים חוזרים (אותו בית עסק ואותו סכום)</h3>
      <table className="table"> 
        <thead><tr><th>בית עסק</th><th>סכום (₪)</th><th>חודשים</th></tr></thead>
        <tbody>
          {data.map((r,idx)=> (<tr key={idx}><td>{r.merchant}</td><td>{r.amount.toFixed(2)}</td><td>{r.months.join(', ')}</td></tr>))}
          {data.length===0 && <tr><td colSpan={3} className="muted">אין עדיין זיהוי חיובים חוזרים.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
