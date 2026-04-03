import { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { fetchEntries } from '../lib/supabase'
import styles from './Profile.module.css'

const MOOD_LABELS = {
  '😊':'Happy','😌':'Calm','🥰':'Loved','😎':'Confident',
  '😔':'Sad','😰':'Anxious','😤':'Frustrated','😶':'Numb',
  '🥺':'Tender','😴':'Tired','🤔':'Confused','🌊':'Overwhelmed',
}

export default function Profile() {
  const { entries, setEntries, entriesLoaded, resetCheckin, navigate } = useStore()
  const [name, setName]     = useState(localStorage.getItem('fy_name') ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]   = useState(name)

  useEffect(() => {
    if (!entriesLoaded) fetchEntries().then(setEntries)
  }, [entriesLoaded, setEntries])

  function saveName() {
    const trimmed = draft.trim()
    setName(trimmed)
    localStorage.setItem('fy_name', trimmed)
    setEditing(false)
  }

  // ── Stats ──
  const total    = entries.length
  const avgEnergy = total
    ? (entries.reduce((s, e) => s + (e.energy ?? 0), 0) / total).toFixed(1)
    : '—'

  // Most common mood emoji
  const moodCount = {}
  entries.forEach(e => { if (e.mood_emoji) moodCount[e.mood_emoji] = (moodCount[e.mood_emoji] ?? 0) + 1 })
  const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]

  // Most common topic
  const topicCount = {}
  entries.forEach(e => (e.topics ?? []).forEach(t => { topicCount[t] = (topicCount[t] ?? 0) + 1 }))
  const topTopic = Object.entries(topicCount).sort((a, b) => b[1] - a[1])[0]

  // Streak — consecutive days with entries
  const streak = calcStreak(entries)

  // Last 7 moods for the mini timeline
  const recent7 = entries.slice(0, 7).reverse()

  return (
    <div className="page anim-in">
      {/* ── Avatar + name ── */}
      <div className={styles.hero}>
        <div className={styles.avatar}>
          {name ? name[0].toUpperCase() : '🌸'}
        </div>

        {editing ? (
          <div className={styles.nameEdit}>
            <input
              className={styles.nameInput}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="Your name"
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={saveName}>Save</button>
          </div>
        ) : (
          <div className={styles.nameRow}>
            <h2 className={styles.nameText}>{name || 'Hey, you 👋'}</h2>
            <button className={styles.editBtn} onClick={() => { setDraft(name); setEditing(true) }}>
              ✏️
            </button>
          </div>
        )}

        <p className="muted" style={{ fontSize: '0.82rem', marginTop: 4 }}>
          Your feelings journal
        </p>

        {streak > 0 && (
          <div className={styles.streakBadge}>🔥 {streak}-day streak</div>
        )}
      </div>

      {/* ── Stats grid ── */}
      <div className={styles.statsGrid}>
        <StatCard value={total}      label="entries"     emoji="📓" color="coral" />
        <StatCard value={avgEnergy}  label="avg energy"  emoji="⚡" color="honey" />
        <StatCard value={topMood ? topMood[0] : '—'}  label={topMood ? MOOD_LABELS[topMood[0]] ?? 'top mood' : 'top mood'} emoji="" color="lavender" big />
        <StatCard value={topTopic ? topTopic[0] : '—'} label="top topic" emoji="🏷️" color="mint" />
      </div>

      {/* ── Mood timeline ── */}
      {recent7.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <p className="sec-label mb-12">Last {recent7.length} check-ins</p>
          <div className={styles.timeline}>
            {recent7.map((e, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.timelineEmoji}>{e.mood_emoji ?? '💛'}</span>
                <div
                  className={styles.timelineBar}
                  style={{ height: `${(e.energy ?? 3) * 10}px` }}
                />
                <span className={styles.timelineEnergy}>{e.energy ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feeling words cloud ── */}
      {total > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <p className="sec-label mb-12">Your feeling words</p>
          <div className={styles.wordCloud}>
            {Object.entries(
              entries.reduce((acc, e) => {
                if (e.feeling_word) acc[e.feeling_word] = (acc[e.feeling_word] ?? 0) + 1
                return acc
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([word, count]) => (
                <span
                  key={word}
                  className={styles.wordChip}
                  style={{ fontSize: `${Math.min(0.72 + count * 0.1, 1.1)}rem` }}
                >
                  {word}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: 8 }}
        onClick={() => { resetCheckin(); navigate('checkin', 'anim-left') }}
      >
        ✨ New Check-in
      </button>
    </div>
  )
}

function StatCard({ value, label, emoji, color, big }) {
  return (
    <div className={`${styles.statCard} ${styles['stat_' + color]}`}>
      <div className={`${styles.statValue} ${big ? styles.statBig : ''}`}>
        {emoji && <span>{emoji}</span>} {value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function calcStreak(entries) {
  if (!entries.length) return 0
  const days = [...new Set(
    entries.map(e => new Date(e.created_at).toDateString())
  )]
  let streak = 0
  let cursor = new Date()
  cursor.setHours(0,0,0,0)
  for (const day of days) {
    const d = new Date(day)
    d.setHours(0,0,0,0)
    const diff = Math.round((cursor - d) / 86400000)
    if (diff <= 1) { streak++; cursor = d }
    else break
  }
  return streak
}
