import { create } from 'zustand'

/**
 * Feely global state — managed with Zustand.
 *
 * Screens: 'landing' | 'setup' | 'checkin' | 'journal' | 'advice' | 'history'
 * Animations: '' | 'anim-in' | 'anim-left' | 'anim-right'
 */
const useStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────
  screen: 'landing',
  anim:   'anim-in',

  navigate(screen, anim = 'anim-in') {
    set({ screen, anim })
  },

  // ── Check-in wizard ──────────────────────────────────
  checkin: {
    step:         0,
    emoji:        null,
    emojiLabel:   null,
    energy:       null,
    topics:       [],
    feelingWord:  null,
  },

  setCheckinField(field, value) {
    set(s => ({ checkin: { ...s.checkin, [field]: value } }))
  },

  toggleTopic(topic) {
    const topics = get().checkin.topics
    const next   = topics.includes(topic)
      ? topics.filter(t => t !== topic)
      : [...topics, topic]
    set(s => ({ checkin: { ...s.checkin, topics: next } }))
  },

  nextStep() {
    const step = get().checkin.step
    if (step < 3) set(s => ({ checkin: { ...s.checkin, step: step + 1 } }))
  },

  prevStep() {
    const step = get().checkin.step
    if (step > 0) set(s => ({ checkin: { ...s.checkin, step: step - 1 } }))
  },

  resetCheckin() {
    set({
      checkin: { step: 0, emoji: null, emojiLabel: null, energy: null, topics: [], feelingWord: null },
      journalText:  '',
      transcript:   '',
      advice:       '',
      adviceStatus: 'idle',  // 'idle' | 'loading' | 'done' | 'error'
      currentEntryId: null,
    })
  },

  // ── Complete check-in & save entry immediately ────────
  currentEntryId: null,

  completeCheckin() {
    const { checkin } = get()
    const localId = `local_${Date.now()}`
    const entry = {
      id:           localId,
      created_at:   new Date().toISOString(),
      mood_emoji:   checkin.emoji,
      energy:       checkin.energy,
      topics:       checkin.topics,
      feeling_word: checkin.feelingWord,
      journal_text: '',
      ai_advice:    null,
    }
    set(s => ({
      entries: [entry, ...s.entries],
      currentEntryId: localId,
    }))
  },

  updateEntry(id, updates) {
    set(s => ({
      entries: s.entries.map(e =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }))
  },

  // ── Journal ──────────────────────────────────────────
  journalText: '',
  transcript:  '',

  setJournalText(v)  { set({ journalText: v }) },
  setTranscript(v)   { set({ transcript: v })  },

  // ── Voice ────────────────────────────────────────────
  isRecording: false,
  setRecording(v) { set({ isRecording: v }) },

  // ── Advice ───────────────────────────────────────────
  advice:       '',
  adviceStatus: 'idle',   // 'idle' | 'loading' | 'done' | 'error'

  setAdvice(text)       { set({ advice: text, adviceStatus: 'done' }) },
  setAdviceLoading()    { set({ adviceStatus: 'loading' }) },
  setAdviceError()      { set({ adviceStatus: 'error' }) },

  // ── Entries (local mirror of Supabase) ───────────────
  entries: [],
  entriesLoaded: false,

  setEntries(entries)   { set({ entries, entriesLoaded: true }) },
  prependEntry(entry)   { set(s => ({ entries: [entry, ...s.entries] })) },
  removeEntry(id)       { set(s => ({ entries: s.entries.filter(e => e.id !== id) })) },

  // ── Toast ─────────────────────────────────────────────
  toast: { visible: false, message: '' },
  _toastTimer: null,

  showToast(message, ms = 2600) {
    const timer = get()._toastTimer
    if (timer) clearTimeout(timer)
    const next = setTimeout(() => set({ toast: { visible: false, message: '' } }), ms)
    set({ toast: { visible: true, message }, _toastTimer: next })
  },
}))

export default useStore
