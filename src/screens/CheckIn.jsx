import useStore from '../store/useStore'
import { EMOJIS, TOPICS, FEELING_WORDS, CHECKIN_STEPS } from '../constants/data'
import styles from './CheckIn.module.css'

export default function CheckIn() {
  const {
    checkin, navigate,
    setCheckinField, toggleTopic,
    nextStep, prevStep,
    completeCheckin,
  } = useStore()

  const { step, emoji, energy, topics, feelingWord } = checkin

  const canProceed = [
    !!emoji,
    !!energy,
    topics.length > 0,
    !!feelingWord,
  ][step]

  function handleNext() {
    if (step < 3) nextStep()
    else {
      completeCheckin()   // save entry immediately
      navigate('journal', 'anim-left')
    }
  }

  return (
    <div className="page anim-in">
      {/* Progress bar */}
      <div className={styles.progressBar}>
        {CHECKIN_STEPS.map((_, i) => (
          <div
            key={i}
            className={`${styles.seg} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}
          />
        ))}
      </div>

      <p className="label-tag coral" style={{ marginBottom: 6 }}>
        {CHECKIN_STEPS[step].label}
      </p>
      <h2 className={styles.question}>{CHECKIN_STEPS[step].question}</h2>

      {step === 0 && (
        <div className={styles.emojiGrid}>
          {EMOJIS.map(({ e, l }) => (
            <button
              key={e}
              className={`${styles.emojiOpt} ${emoji === e ? styles.sel : ''}`}
              onClick={() => setCheckinField('emoji', e) || setCheckinField('emojiLabel', l)}
            >
              <span className={styles.emojiE}>{e}</span>
              <span className={styles.emojiL}>{l}</span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <>
          <div className={styles.energyRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                className={`${styles.energyOpt} ${energy === n ? styles.sel : ''}`}
                onClick={() => setCheckinField('energy', n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className={styles.energyLabels}>
            <span className="label-tag">🔋 Low</span>
            <span className="label-tag">⚡ High</span>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.tagCloud}>
            {TOPICS.map(t => (
              <button
                key={t}
                className={`${styles.tagChip} ${topics.includes(t) ? styles.sel : ''}`}
                onClick={() => toggleTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-soft)', marginTop: 6 }}>
            Pick all that apply
          </p>
        </>
      )}

      {step === 3 && (
        <div className={styles.feelGrid}>
          {FEELING_WORDS.map(w => (
            <button
              key={w}
              className={`${styles.feelOpt} ${feelingWord === w ? styles.sel : ''}`}
              onClick={() => setCheckinField('feelingWord', w)}
            >
              {w}
            </button>
          ))}
        </div>
      )}

      <div className="nav-row">
        {step > 0 && (
          <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
        )}
        <button
          className={`btn btn-primary ${!canProceed ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!canProceed}
        >
          {step < 3 ? 'Continue →' : 'Write it out ✍️'}
        </button>
      </div>
    </div>
  )
}
