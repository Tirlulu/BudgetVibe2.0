
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts'
import { sumByCategory } from '@/lib/utils'
import { useClassifiedTx } from '@/components/useClassifiedTx'

export default function CategoryBreakdown(){
  const rows = useClassifiedTx()
  const data = sumByCategory(rows)
  return (
    <div className="card"> 
      <h3>התפלגות לפי קטגוריות</h3>
      <div style={{height:300}}>
        <ResponsiveContainer width="100%" height="100%"> 
          <BarChart data={data} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="category" tick={{fill:'#aaa'}} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis tick={{fill:'#aaa'}} />
            <Tooltip contentStyle={{background:'#111', border:'1px solid #222'}} />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
