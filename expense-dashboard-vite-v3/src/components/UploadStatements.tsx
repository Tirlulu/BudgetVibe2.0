import { useRef, useState } from 'react'
import { parseStatementFiles } from '@/lib/parseStatements'
import { useStore } from '@/store/useStore'

export default function UploadStatements() {
  const ref = useRef<HTMLInputElement>(null)
  const addTx = useStore(s => s.addTx)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setMessage(null)
    try {
      const rows = await parseStatementFiles(Array.from(files))
      addTx(rows)
      if (ref.current) ref.current.value = ''
      if (rows.length === 0) {
        setMessage({ type: 'err', text: 'לא נמצאו עסקאות בקובץ. בדוק שהקובץ מכיל כותרות: תאריך רכישה, שם בית עסק, סכום חיוב (או דומים).' })
      } else {
        setMessage({ type: 'ok', text: `נוספו ${rows.length.toLocaleString()} עסקאות` })
      }
    } catch (e) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : 'שגיאה בקריאת הקובץ' })
    }
  }

  return (
    <div className="card">
      <h3>העלאת דוחות אשראי (‎.xlsx)</h3>
      <p className="muted">שם קובץ מומלץ: <code>XXXX_mm_yyyy.xlsx</code> לזיהוי הכרטיס.</p>
      <div className="spacer" />
      <input ref={ref} type="file" accept=".xlsx,.xls" multiple onChange={(e) => onFiles(e.target.files)} />
      {message && (
        <p className={message.type === 'ok' ? 'upload-ok' : 'upload-err'} style={{ marginTop: 8 }}>
          {message.text}
        </p>
      )}
    </div>
  )
}
