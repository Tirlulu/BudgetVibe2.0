import { useRef, useState } from 'react'
import { parseCatalog } from '@/lib/parseCatalog'
import { useStore } from '@/store/useStore'

export default function UploadCatalog() {
  const ref = useRef<HTMLInputElement>(null)
  const setCatalog = useStore(s => s.setCatalog)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const onFile = async (f?: File) => {
    if (!f) return
    setMessage(null)
    try {
      const { cats, aliases } = await parseCatalog(f)
      setCatalog(cats, aliases)
      if (ref.current) ref.current.value = ''
      setMessage({ type: 'ok', text: `נטענו ${cats.length} קטגוריות, ${aliases.length} מיפויים` })
    } catch (e) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : 'שגיאה בקריאת הקובץ' })
    }
  }

  return (
    <div className="card">
      <h3>טעינת קטגוריות/מיפויים</h3>
      <p className="muted">בחר קובץ <code>קטגוריות_מאוחדות_טיוטה.xlsx</code> או גרסה ערוכה שלך.</p>
      <div className="spacer" />
      <input ref={ref} type="file" accept=".xlsx,.xls" onChange={(e) => onFile(e.target.files?.[0])} />
      {message && (
        <p className={message.type === 'ok' ? 'upload-ok' : 'upload-err'} style={{ marginTop: 8 }}>
          {message.text}
        </p>
      )}
    </div>
  )
}
