
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from 'recharts'
import { groupByMonth } from '@/lib/utils'
import { useClassifiedTx } from '@/components/useClassifiedTx'

export default function MonthlyTotalsChart(){
  const rows = useClassifiedTx()
  const data = groupByMonth(rows)
  return (
    <div className="card"> 
      <h3>סה"כ חיוב חודשי</h3>
      <div style={{height:300}}>
        <ResponsiveContainer width="100%" height="100%"> 
          <LineChart data={data} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="month" tick={{fill:'#aaa'}} />
            <YAxis tick={{fill:'#aaa'}} />
            <Tooltip contentStyle={{background:'#111', border:'1px solid #222'}} />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
