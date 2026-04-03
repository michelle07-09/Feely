# 🌸 Feely — Your Feelings Journal

> A cozy, beautifully animated feelings journal that helps you check in with yourself, write freely, and receive warm AI-powered advice.

### 🌐 [Live Demo → feely-michelle07-09s-projects.vercel.app](https://feely-michelle07-09s-projects.vercel.app)

---

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-orange)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude-AI_Advice-blueviolet)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎭 **4-Step Check-In** | Emoji mood → Energy level (1–5) → Topic tags → Feeling word |
| 📝 **Journal Writing** | Free-text with tap-to-insert writing prompts |
| 🎙️ **Voice Recording** | Live speech-to-text via Web Speech API |
| 🤖 **AI Advice** | Warm, 2–3 paragraph personalized insight from Claude |
| 💾 **Supabase Persistence** | All entries saved to Postgres |
| 📖 **Journal History** | Browse past entries with detail modal |
| 🎨 **Beautiful Animations** | Blob morphing, spring physics, staggered reveals |
| 📱 **Mobile-Friendly** | Responsive design with bottom navigation |

## 🖼️ App Flow

```
🏡 Landing  →  ✨ Check-In (4 steps)  →  📝 Journal  →  🌟 AI Advice  →  📖 History
```

1. **Check In** — Pick your mood emoji, rate your energy, choose life topics, and name your feeling
2. **Journal** — Write freely or use quick prompts; optionally record a voice note
3. **Get Advice** — Claude reads your check-in & journal, then gives a warm, personalized response
4. **Review** — Browse your journal history and reflect on past entries

## 🛠️ Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| State Management | Zustand |
| Database | Supabase (Postgres) |
| AI Advice | Claude (claude-sonnet-4) |
| Voice Input | Web Speech API |
| Styling | CSS Modules + CSS Custom Properties |
| Typography | Fraunces + Nunito (Google Fonts) |

## 📁 Project Structure

```
feely/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                   ← screen router
    ├── main.jsx                  ← React entry
    ├── styles/
    │   └── globals.css           ← CSS vars, resets, animations
    ├── constants/
    │   └── data.js               ← emoji, topic, feeling-word arrays
    ├── lib/
    │   ├── supabase.js           ← DB: insert, fetch, delete entries
    │   ├── claude.js             ← AI: getAdvice, prompt builder
    │   ├── voice.js              ← Web Speech wrapper
    │   └── utils.js              ← date formatting, text helpers
    ├── store/
    │   └── useStore.js           ← Zustand global state + actions
    ├── components/
    │   ├── BlobBackground.jsx    ← animated gradient blobs
    │   ├── BottomNav.jsx         ← persistent bottom navigation
    │   ├── Toast.jsx             ← notification toast
    │   └── EntryModal.jsx        ← entry detail bottom sheet
    └── screens/
        ├── Landing.jsx           ← home with recent entry preview
        ├── CheckIn.jsx           ← 4-step mood wizard
        ├── Journal.jsx           ← text + voice journaling
        ├── Advice.jsx            ← AI advice display + save
        ├── History.jsx           ← past entries list
        ├── Profile.jsx           ← user profile
        └── Setup.jsx             ← Supabase credentials setup
```

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/michelle07-09/Feely.git
cd Feely
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## 🗄️ Supabase Setup

Create a `feelings` table in your Supabase project → SQL Editor:

```sql
CREATE TABLE feelings (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT now(),
  mood_emoji   TEXT,
  energy       INT,
  topics       TEXT[],
  feeling_word TEXT,
  journal_text TEXT,
  ai_advice    TEXT
);
```

## 📋 Notes

- 🎙️ Voice recording requires Chrome, Edge, or Safari (Web Speech API)
- 🤖 Claude API is called from the browser — for production, proxy through a backend to secure your API key
- 💾 Check-in data is saved locally immediately, so no data loss even if AI advice fails

## 📄 License

MIT © [michelle07-09](https://github.com/michelle07-09)

---

<p align="center">
  Made with 💛 and a lot of feelings
</p>
