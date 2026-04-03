import { useRef, useEffect, useCallback } from 'react'
import useStore from '../store/useStore'
import { JOURNAL_PROMPTS } from '../constants/data'
import { createRecognition, isSpeechSupported } from '../lib/voice'
import styles from './Journal.module.css'

export default function Journal() {
  const {
    checkin,
    journalText, setJournalText,
    transcript, setTranscript,
    isRecording, setRecording,
    navigate, showToast,
  } = useStore()

  const { emoji, emojiLabel, energy, topics, feelingWord } = checkin
  const recRef = useRef(null)
  const taRef  = useRef(null)

  // Cleanup on unmount
  useEffect(() => () => recRef.current?.stop(), [])

  const handleToggleRec = useCallback(() => {
    if (isRecording) {
      recRef.current?.stop()
      recRef.current = null
      setRecording(false)
      return
    }

    if (!isSpeechSupported()) {
      showToast('🎙️ Voice not supported in this browser')
      return
    }

    const rec = createRecognition({
      onResult: (text) => setTranscript(text),
      onError:  ()     => { setRecording(false); recRef.current = null },
      onEnd:    ()     => { if (isRecording) rec.start() },
    })

    if (!rec) return
    recRef.current = rec
    rec.start()
    setRecording(true)
  }, [isRecording, setRecording, setTranscript, showToast])

  function insertPrompt(p) {
    const cur  = journalText
    const next = cur ? `${cur}\n\n${p} ` : `${p} `
    setJournalText(next)
    taRef.current?.focus()
  }

  function handleSubmit() {
    recRef.current?.stop()
    setRecording(false)
    navigate('advice', 'anim-left')
  }

  return (
    <div className="page anim-in">
      {/* Mood strip */}
      <div className={styles.moodStrip}>
        <span className={styles.moodEmoji}>{emoji ?? '💛'}</span>
        <div>
          <div className={styles.moodName}>{emojiLabel ?? 'Your mood'}{feelingWord ? ` · ${feelingWord}` : ''}</div>
          <div className={styles.moodSub}>
            Energy {energy ?? '?'}/5 · {topics?.join(', ') || 'General'}
          </div>
        </div>
      </div>

      {/* Writing prompts */}
      <p className="sec-label mb-8">Quick prompts</p>
      <div className={styles.promptScroll}>
        {JOURNAL_PROMPTS.map(p => (
          <button key={p} className={styles.promptChip} onClick={() => insertPrompt(p)}>
            💬 {p}
          </button>
        ))}
      </div>

      {/* Text area */}
      <div className={styles.journalBox}>
        <textarea
          ref={taRef}
          className={styles.ta}
          placeholder="Let it all out… no judgment here 🌿"
          value={journalText}
          onChange={e => setJournalText(e.target.value)}
          rows={6}
        />
        <div className={styles.taFooter}>
          <span className={styles.charCount}>{journalText.length} chars</span>
          <button
            className={`${styles.voiceBtn} ${isRecording ? styles.rec : ''}`}
            onClick={handleToggleRec}
          >
            {isRecording
              ? <><span className={styles.recDot} /> Stop</>
              : '🎙️ Voice'
            }
          </button>
        </div>
      </div>

      {/* Voice transcript */}
      {transcript && (
        <div className={styles.transcriptBox}>
          <span className={styles.transcriptLabel}>Voice note</span>
          <p>{transcript}</p>
        </div>
      )}

      <div className="nav-row">
        <button className="btn btn-secondary" onClick={() => navigate('checkin', 'anim-right')}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Get my advice 🌟
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'var(--text-soft)', marginTop: 10 }}>
        Writing is optional — advice is always waiting
      </p>
    </div>
  )
}
