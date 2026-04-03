const CLAUDE_API = 'https://api.anthropic.com/v1/messages'
const MODEL      = 'claude-sonnet-4-20250514'

/**
 * Build the advice prompt from a check-in context.
 */
function buildAdvicePrompt({ emoji, emojiLabel, energy, topics, feelingWord, journalText }) {
  return `You are a warm, empathetic friend and gentle life coach.
Someone has just shared their feelings with you through a mood check-in.

Here's what they shared:
- Mood: ${emoji} ${emojiLabel ?? ''}
- Energy: ${energy ?? '?'} out of 5
- This feeling is connected to: ${topics?.join(', ') || 'general life'}
- In one word they feel: ${feelingWord ?? '—'}
- What they wrote: "${journalText || '(no journal entry)'}"

Write a warm, personal response in 2–3 short paragraphs.
Speak directly to them as a caring friend — not a therapist.

1. First paragraph: genuinely validate what they're feeling. Name the emotion specifically — don't be vague.
2. Second paragraph: offer a gentle insight or reframe. Don't dismiss the feeling. Surprise them with a perspective they might not have considered.
3. Third paragraph: suggest ONE small, concrete action they can do today — something that fits the energy level they've described. Keep it realistic and kind.

Rules:
- Conversational, human, warm tone
- No bullet points, no numbered lists
- No therapy jargon or generic affirmations like "you've got this"
- Be specific to what they actually shared
- If they seem low energy, suggest something gentle
- End with a line that feels like a friend signing off`
}

/**
 * Fetch personalized advice from Claude.
 * @param {Object} checkinData
 * @returns {Promise<string>} advice text
 */
export async function getAdvice(checkinData) {
  const prompt = buildAdvicePrompt(checkinData)

  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text

  if (!text) throw new Error('Empty response from Claude')
  return text
}

/**
 * Fallback message when the API fails.
 */
export const ADVICE_FALLBACK =
  "I couldn't connect right now — but everything you shared matters. " +
  "Take a breath. Sit with what you're feeling for a moment, without judging it. " +
  "You're doing better than you think. 💛"
