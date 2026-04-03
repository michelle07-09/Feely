import { useEffect } from 'react'
import useStore from '../store/useStore'
import { fetchEntries } from '../lib/supabase'
import { fmtDate } from '../lib/utils'
import styles from './Landing.module.css'

export default function Landing() {
  const { navigate, resetCheckin, entries, setEntries, entriesLoaded } = useStore()

  useEffect(() => {
    if (!entriesLoaded) {
      fetchEntries().then(rows => {
        const { entries: localEntries } = useStore.getState()
        const remoteIds = new Set(rows.map(r => r.id))
        const localOnly = localEntries.filter(e => !remoteIds.has(e.id))
        if (localOnly.length || rows.length) setEntries([...localOnly, ...rows])
      })
    }
  }, [entriesLoaded, setEntries])

  function handleCheckin() {
    resetCheckin()
    navigate('checkin', 'anim-left')
  }

  const latest = entries[0] ?? null

  return (
    <div className={`page anim-in`}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          feely
        </div>

        {entries.length > 0 && (
          <div className={styles.streak}>
            🔥 {entries.length} feeling{entries.length !== 1 ? 's' : ''} logged
          </div>
        )}

        <div className={styles.floatRow}>
          {['😊','💛','🌸','😔','✨'].map((e, i) => (
            <span key={e} className={styles.floatEmoji} style={{ animationDelay: `${-i * 0.6}s` }}>
              {e}
            </span>
          ))}
        </div>

        <h1 className="display">
          Hey, how's your <span className="accent">heart</span> today?
        </h1>
        <p className="muted mt-12">
          A cozy space to check in with yourself, journal freely, and get a warm nudge in the right direction.
        </p>

        <div className={styles.actions}>
          <button className="btn btn-primary btn-full" style={{ fontSize: '1rem', padding: '15px' }} onClick={handleCheckin}>
            ✨ Check In Now
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('history')}>
            📖 My Journal
          </button>
        </div>
      </div>

      {latest && (
        <div className={styles.recentWrap}>
          <p className="sec-label mb-8">Most recent</p>
          <div
            className={styles.recentCard}
            onClick={() => navigate('history')}
            role="button"
            tabIndex={0}
          >
            <div className={styles.recentTop}>
              <div className={styles.recentLeft}>
                <span className={styles.recentEmoji}>{latest.mood_emoji ?? '💛'}</span>
                <div>
                  <div className={styles.recentName}>{latest.feeling_word ?? 'A feeling'}</div>
                  <div className={styles.recentSub}>
                    {Array.isArray(latest.topics) ? latest.topics.join(', ') : ''}
                  </div>
                </div>
              </div>
              <span className={styles.recentDate}>{fmtDate(latest.created_at)}</span>
            </div>
            {latest.ai_advice && (
              <p className={styles.recentPreview}>{latest.ai_advice}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
