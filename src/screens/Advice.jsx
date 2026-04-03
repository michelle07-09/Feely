import { useEffect } from 'react'
import useStore from '../store/useStore'
import { getAdvice, ADVICE_FALLBACK } from '../lib/claude'
import { insertEntry } from '../lib/supabase'
import { combineText, splitParagraphs } from '../lib/utils'
import styles from './Advice.module.css'

export default function Advice() {
  const {
    checkin, journalText, transcript,
    advice, adviceStatus, currentEntryId,
    setAdvice, setAdviceLoading, setAdviceError,
    updateEntry, navigate, resetCheckin,
  } = useStore()

  const { emoji, emojiLabel, energy, topics, feelingWord } = checkin

  useEffect(() => {
    if (adviceStatus !== 'idle') return
    fetchAdvice()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchAdvice() {
    setAdviceLoading()
    const combined = combineText(journalText, transcript)

    // Update the already-saved entry with journal text right away
    if (currentEntryId) {
      updateEntry(currentEntryId, { journal_text: combined })
    }

    try {
      const text = await getAdvice({
        emoji, emojiLabel, energy, topics, feelingWord,
        journalText: combined,
      })
      setAdvice(text)

      // Update the existing entry with AI advice
      if (currentEntryId) {
        updateEntry(currentEntryId, { ai_advice: text })
      }

      // Also save to Supabase
      insertEntry({
        mood_emoji:   emoji,
        energy,
        topics,
        feeling_word: feelingWord,
        journal_text: combined,
        ai_advice:    text,
      })
    } catch (err) {
      console.error('[Feely] advice error:', err)
      setAdvice(ADVICE_FALLBACK)
      setAdviceError()
    }
  }

  if (adviceStatus === 'loading') {
    return (
      <div className="page anim-in">
        <div className={styles.loadingWrap}>
          <span className={styles.loadEmoji}>{emoji ?? '💛'}</span>
          <h2 style={{ marginTop: 14, marginBottom: 8 }}>Reading your heart…</h2>
          <p className="muted">Crafting your personal insight</p>
          <div className="card" style={{ marginTop: 28, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}>
              <div className="bounce-dots">
                <div className="bounce-dot" />
                <div className="bounce-dot" />
                <div className="bounce-dot" />
              </div>
              <span className="muted" style={{ fontSize: '0.84rem' }}>Thinking…</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const paragraphs = splitParagraphs(advice)

  return (
    <div className="page anim-in">
      {/* Header */}
      <div className={styles.top}>
        <span className={styles.emoji}>{emoji ?? '💛'}</span>
        <h2>Your feelings matter</h2>
        <div className="pill-row" style={{ justifyContent: 'center', marginTop: 10 }}>
          {energy   && <span className="pill">⚡ {energy}/5</span>}
          {feelingWord && <span className="pill">{feelingWord}</span>}
          {(topics ?? []).map(t => <span key={t} className="pill">{t}</span>)}
        </div>
      </div>

      {/* Advice card */}
      <div className={styles.adviceCard}>
        <div className={styles.adviceTag}>
          <span>✦</span>
          <span className="label-tag lavender">Your personal insight</span>
        </div>
        <div className={styles.adviceBody}>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {/* Journal echo */}
      {(journalText || transcript) && (
        <div className="card">
          <p className="sec-label mb-8">Your journal entry</p>
          <p className="muted" style={{ fontSize: '0.88rem' }}>
            {combineText(journalText, transcript)}
          </p>
        </div>
      )}

      <div className="nav-row" style={{ marginTop: 8 }}>
        <button className="btn btn-secondary" onClick={() => { resetCheckin(); navigate('checkin', 'anim-left') }}>
          Check in again
        </button>
        <button className="btn btn-primary" onClick={() => navigate('history')}>
          See journal 📖
        </button>
      </div>
    </div>
  )
}
