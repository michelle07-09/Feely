import { createClient } from '@supabase/supabase-js'

// ── Hardcoded — never exposed to users ──────────────────
const SUPABASE_URL = 'https://hskhvgywobqjctbgikwx.supabase.co'
const SUPABASE_KEY = 'sb_publishable_rNWjO7jeiP9-LloW7sdzYg__rELu32S'

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Insert one feelings entry.
 */
export async function insertEntry(entry) {
  const { data, error } = await db
    .from('feelings')
    .insert([entry])
    .select()
    .single()

  if (error) { console.error('[Feely] insert:', error.message); return null }
  return data
}

/**
 * Fetch the most recent 40 entries, newest first.
 */
export async function fetchEntries() {
  const { data, error } = await db
    .from('feelings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(40)

  if (error) { console.error('[Feely] fetch:', error.message); return [] }
  return data ?? []
}

/**
 * Delete a single entry by id.
 */
export async function deleteEntry(id) {
  const { error } = await db.from('feelings').delete().eq('id', id)
  if (error) console.error('[Feely] delete:', error.message)
}

/**
 * Save credentials to localStorage (for the Setup screen UI).
 */
export function saveCredentials(url, key) {
  localStorage.setItem('fy_url', url)
  localStorage.setItem('fy_key', key)
}

/**
 * Check if credentials are available (hardcoded, so always true).
 */
export function hasCredentials() {
  return true
}
