import UploadStatements from '@/components/UploadStatements'
import UploadCatalog from '@/components/UploadCatalog'
import CardFilter from '@/components/CardFilter'
import KPIs from '@/components/KPIs'
import UnclassifiedPanel from '@/components/UnclassifiedPanel'
import CategoryBreakdown from '@/components/CategoryBreakdown'
import MonthlyTotalsChart from '@/components/MonthlyTotalsChart'
import RulesTable from '@/components/RulesTable'
import RecurringTable from '@/components/RecurringTable'

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>לוח הוצאות</h1>
      </header>
      <div className="cards">
        <UploadStatements />
        <UploadCatalog />
      </div>
      <CardFilter />
      <div className="spacer" />
      <KPIs />
      <div className="spacer" />
      <MonthlyTotalsChart />
      <div className="spacer" />
      <CategoryBreakdown />
      <div className="spacer" />
      <UnclassifiedPanel />
      <div className="spacer" />
      <RulesTable />
      <div className="spacer" />
      <RecurringTable />
    </div>
  )
}
