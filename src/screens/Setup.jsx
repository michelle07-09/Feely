import { useState } from 'react'
import useStore from '../store/useStore'
import { saveCredentials, hasCredentials } from '../lib/supabase'
import styles from './Setup.module.css'

const SQL = `create table feelings (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamptz default now(),
  mood_emoji   text,
  energy       int,
  topics       text[],
  feeling_word text,
  journal_text text,
  ai_advice    text
);`

export default function Setup() {
  const { navigate, showToast } = useStore()
  const [url, setUrl] = useState(localStorage.getItem('fy_url') ?? '')
  const [key, setKey] = useState(localStorage.getItem('fy_key') ?? '')
  const [copied, setCopied] = useState(false)

  const connected = hasCredentials()

  function handleSave() {
    if (!url || !key) { showToast('⚠️ Both fields are required'); return }
    saveCredentials(url, key)
    showToast('✅ Supabase connected!')
    navigate('landing')
  }

  function copySQL() {
    navigator.clipboard.writeText(SQL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="page anim-in">
      <div className={styles.hero}>
        <span className={styles.icon}>🌸</span>
        <h1 className="display">Connect <span className="accent">Feely</span></h1>
        <p className="muted mt-8">
          Link your Supabase project to save your feelings journal permanently across devices.
        </p>
        {connected && (
          <div className={styles.badge}>✓ Supabase connected</div>
        )}
      </div>

      {/* SQL step */}
      <div className="card">
        <p className="sec-label mb-8">Step 1 — Create the table</p>
        <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 12 }}>
          Open your Supabase project → SQL Editor → paste and run:
        </p>
        <div className={styles.sqlBlock}>
          <pre>{SQL}</pre>
          <button className={styles.copyBtn} onClick={copySQL}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Credentials */}
      <div className="card">
        <p className="sec-label mb-12">Step 2 — Paste your credentials</p>
        <label className="sec-label">Project URL</label>
        <input
          className="input mt-4"
          type="url"
          placeholder="https://xxxxx.supabase.co"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <label className="sec-label">Anon / Public Key</label>
        <input
          className="input mt-4"
          type="text"
          placeholder="eyJhbGciOiJIUzI1NiJ9..."
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <button className="btn btn-primary btn-full mt-4" onClick={handleSave}>
          Save &amp; Connect ✓
        </button>
        <button className="btn btn-ghost btn-full mt-8" onClick={() => navigate('landing')}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}
