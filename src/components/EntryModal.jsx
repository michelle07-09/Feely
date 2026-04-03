import { useEffect } from 'react'
import { fmtDate, splitParagraphs } from '../lib/utils'
import styles from './EntryModal.module.css'

export default function EntryModal({ entry, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!entry) return null

  const adviceParagraphs = splitParagraphs(entry.ai_advice)
  const topics = Array.isArray(entry.topics) ? entry.topics : []

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} />

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.emoji}>{entry.mood_emoji ?? '💛'}</span>
            <div>
              <div className={styles.title}>{entry.feeling_word ?? 'A feeling'}</div>
              <div className={styles.date}>{fmtDate(entry.created_at, true)}</div>
            </div>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        {adviceParagraphs.length > 0 && (
          <div className={styles.adviceCard}>
            <div className={styles.adviceTag}>
              <span>✦</span>
              <span className="label-tag lavender">Your Insight</span>
            </div>
            <div className={styles.adviceBody}>
              {adviceParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        )}

        {entry.journal_text && (
          <div className="card">
            <p className="sec-label mb-8">Journal entry</p>
            <p className="muted" style={{ fontSize: '0.88rem' }}>{entry.journal_text}</p>
          </div>
        )}

        <div className="pill-row mt-8">
          {entry.energy && <span className="pill">⚡ {entry.energy}/5</span>}
          {topics.map(t => <span key={t} className="pill">{t}</span>)}
        </div>
      </div>
    </div>
  )
}
