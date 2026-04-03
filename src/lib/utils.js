/**
 * Format an ISO date string for display.
 * @param {string} iso
 * @param {boolean} long  — include time
 */
export function fmtDate(iso, long = false) {
  if (!iso) return ''
  const d    = new Date(iso)
  const now  = new Date()
  const diff = Math.floor((now - d) / 86_400_000)

  if (long) {
    return d.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff <  7)  return `${diff}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Split advice text into paragraphs for rendering.
 */
export function splitParagraphs(text) {
  return (text ?? '').split(/\n\n+/).map(p => p.trim()).filter(Boolean)
}

/**
 * Combine journal text + voice transcript into a single string.
 */
export function combineText(journalText, transcript) {
  const parts = [journalText?.trim(), transcript?.trim()].filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return `${parts[0]}\n\nVoice note: ${parts[1]}`
}
