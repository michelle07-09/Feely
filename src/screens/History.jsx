import { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { fetchEntries } from '../lib/supabase'
import { fmtDate } from '../lib/utils'
import EntryModal from '../components/EntryModal'
import styles from './History.module.css'

export default function History() {
  const { entries, setEntries, entriesLoaded, resetCheckin, navigate } = useStore()
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(!entriesLoaded)

  useEffect(() => {
    if (!entriesLoaded) {
      fetchEntries()
        .then(rows => {
          // Merge: keep local entries that aren't in Supabase yet
          const { entries: localEntries } = useStore.getState()
          const remoteIds = new Set(rows.map(r => r.id))
          const localOnly = localEntries.filter(e => !remoteIds.has(e.id))
          setEntries([...localOnly, ...rows])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [entriesLoaded, setEntries])

  function handleCheckin() {
    resetCheckin()
    navigate('checkin', 'anim-left')
  }

  return (
    <div className="page anim-in">
      <div className={styles.top}>
        <h2>My Journal</h2>
        {entries.length > 0 && (
          <p className="muted mt-4">{entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}</p>
        )}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'48px 0' }}>
          <div className="bounce-dots">
            <div className="bounce-dot" /><div className="bounce-dot" /><div className="bounce-dot" />
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📓</div>
          <p className="muted">No entries yet.<br />Check in to start your feelings journal!</p>
          <button className="btn btn-primary mt-16" onClick={handleCheckin}>
            Start Check-in ✨
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {entries.map((e, i) => (
            <EntryCard key={e.id ?? i} entry={e} onClick={() => setSelected(e)} />
          ))}
        </div>
      )}

      {selected && (
        <EntryModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function EntryCard({ entry, onClick }) {
  const topics = Array.isArray(entry.topics) ? entry.topics : []
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <span className={styles.cardEmoji}>{entry.mood_emoji ?? '💛'}</span>
          <div>
            <div className={styles.cardName}>{entry.feeling_word ?? 'A feeling'}</div>
            <div className={styles.cardSub}>{topics.join(', ')}</div>
          </div>
        </div>
        <span className={styles.cardDate}>{fmtDate(entry.created_at)}</span>
      </div>
      {entry.ai_advice && (
        <p className={styles.cardPreview}>{entry.ai_advice}</p>
      )}
    </div>
  )
}
