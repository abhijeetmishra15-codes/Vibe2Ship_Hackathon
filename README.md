<div align="center">

```
 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ 
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║      ██║   
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝  
                                                                                  
                    ██╗  ██╗███████╗██████╗  ██████╗                             
                    ██║  ██║██╔════╝██╔══██╗██╔═══██╗                            
                    ███████║█████╗  ██████╔╝██║   ██║                            
                    ██╔══██║██╔══╝  ██╔══██╗██║   ██║                            
                    ██║  ██║███████╗██║  ██║╚██████╔╝                            
                    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝                            
```

### 🏙️ AI-Powered Civic Issue Reporting — Built for Citizens, Trusted by Municipalities

<br/>

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **Community Hero** bridges the gap between citizens and municipalities — turning scattered civic complaints into structured, AI-triaged, trackable resolutions.

<br/>

[🚀 Get Started](#-setup-instructions) · [🏗️ Architecture](#️-architecture) · [✨ Features](#-features) · [🗄️ Schema](#️-database-schema) · [🔒 Security](#-security)

</div>

---

## 🌟 Why Community Hero?

Most cities still handle civic complaints via phone calls, paper forms, or social media chaos. **Community Hero** replaces all of that with a single, intelligent platform:

| Without Community Hero | With Community Hero |
|---|---|
| 📞 Citizens call helplines, wait on hold | 📍 Citizens drop a pin and submit in 30 seconds |
| 📝 Manual data entry by staff | 🤖 AI categorizes, scores severity & detects duplicates |
| 🗂️ Issues lost in spreadsheets | ⚡ Real-time dashboard with live status updates |
| 🕐 Weeks to acknowledge a pothole | 🏆 Gamified accountability speeds resolution |
| ❌ No feedback loop for citizens | ✅ Citizens track issue lifecycle end-to-end |

---

## ✨ Features

<details>
<summary><b>📍 Map-Based Reporting</b></summary>
<br/>
Citizens drop a precise pin on an interactive Leaflet map when submitting an issue. No more vague addresses — every report carries exact geolocation metadata, enabling heatmap analysis and proximity-based duplicate detection.
</details>

<details>
<summary><b>🤖 AI Issue Assistant (Powered by Gemini 2.5 Flash)</b></summary>
<br/>

- **✍️ Draft Improvement** — Automatically rewrites user-submitted titles and descriptions into professional, structured language suitable for municipal review.
- **🧠 Smart Analysis** — Categorizes issues (Pothole / Water Leak / Garbage / etc.), assigns severity (`Low` → `Critical`), and routes to the responsible department.
- **🔍 Duplicate Detection** — Cross-references visual data and coordinates to surface and link duplicate reports, keeping the feed clean.
- **🚨 Fake Report Scoring** — Scores each submission for spam indicators, protecting the system's integrity.
- **💬 Context-Aware Copilot** — A conversational assistant with full platform context, capable of summarizing issues and answering status queries.
</details>

<details>
<summary><b>📸 Media Uploads</b></summary>
<br/>
Citizens can attach photos and videos as evidence. Media is stored securely in Supabase Storage with per-bucket access policies.
</details>

<details>
<summary><b>🔒 Role-Based Access Control</b></summary>
<br/>

| Role | Permissions |
|---|---|
| 👤 **Citizen** | Submit issues, comment, vote, track own reports |
| 🔍 **Verifier** | Verify or reject pending issues, add notes |
| 🛡️ **Admin** | Full access: resolve, generate reports, manage users |
</details>

<details>
<summary><b>🏆 Gamification & Leaderboards</b></summary>
<br/>
An XP-based points system rewards meaningful participation. Citizens earn points for submitting verified issues, verifiers earn for timely reviews, and badges like **"Civic Star"** and **"Pothole Buster"** are awarded automatically based on thresholds. Leaderboards update in real-time via Supabase Realtime.
</details>

<details>
<summary><b>⚡ Real-Time Dashboards</b></summary>
<br/>
Supabase Realtime WebSocket channels broadcast database mutations directly to the frontend, instantly invalidating React Query caches. The moment an issue is verified or resolved, every connected client updates — no polling, no refresh needed.
</details>

---

## 🏗️ Architecture

### System Execution Flow

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         COMMUNITY HERO — SYSTEM FLOW                           ║
╚══════════════════════════════════════════════════════════════════════════════════╝

 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                        👤  CITIZEN / VERIFIER / ADMIN                       │
 └─────────────────────┬──────────────────────────────┬───────────────────────┘
                       │                              │
                  [Submits Issue]              [Views Dashboard /
                  [Attaches Media]              Leaderboard / Map]
                       │                              │
                       ▼                              ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                  🖥️  REACT 19 + VITE FRONTEND                               │
 │                                                                             │
 │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
 │   │ React Router │  │   Zustand    │  │ TanStack     │  │ React Hook   │  │
 │   │  (Routing)   │  │ (Auth/Toast) │  │   Query      │  │ Form + Zod   │  │
 │   └──────────────┘  └──────────────┘  └──────┬───────┘  └──────────────┘  │
 │   ┌──────────────┐  ┌──────────────┐         │                             │
 │   │React Leaflet │  │  Recharts +  │         │ Cache Invalidation          │
 │   │  (Map UI)    │  │Framer Motion │         │ on Realtime Events          │
 │   └──────────────┘  └──────────────┘         │                             │
 └──────────────────────────────────────────────┼─────────────────────────────┘
                       │                         │
          ┌────────────┼─────────────┐           │
          │            │             │           │
   [Auth] │    [DB R/W]│    [Storage]│           │ [Realtime WS]
          │            │             │           │
          ▼            ▼             ▼           ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         ⚡  SUPABASE PLATFORM                               │
 │                                                                             │
 │  ┌─────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐  │
 │  │  Supabase   │  │  PostgreSQL Database     │  │   Supabase Storage     │  │
 │  │    Auth     │  │                         │  │   (issue-media bucket) │  │
 │  │             │  │  ┌───────────────────┐  │  └────────────────────────┘  │
 │  │  JWT Tokens │  │  │ profiles          │  │                              │
 │  │  Role Store │  │  │ issues            │  │  ┌────────────────────────┐  │
 │  └─────────────┘  │  │ issue_comments    │  │  │  Supabase Realtime     │  │
 │                   │  │ issue_votes       │  │  │                        │  │
 │                   │  │ issue_verif...    │  │  │  WebSocket Channels:   │  │
 │                   │  │ issue_ai_analysis │  │  │  • issues feed         │  │
 │                   │  │ resolution_reports│  │  │  • leaderboard         │  │
 │                   │  └───────────────────┘  │  │  • profiles            │  │
 │                   │                         │  └────────────────────────┘  │
 │                   │  RLS Policies ✅         │                              │
 │                   │  Triggers & RPCs ✅      │                              │
 │                   └─────────────────────────┘                              │
 └──────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                          [AI Analysis Trigger]
                          (on issue submission)
                                    │
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                   🦕  SUPABASE EDGE FUNCTIONS (Deno)                        │
 │                                                                             │
 │                     ai-civic-agent                                         │
 │                                                                             │
 │   1. Verify Supabase JWT  ──► Reject if invalid                            │
 │   2. Fetch issue data + media URLs                                         │
 │   3. Build structured prompt with context                                  │
 │   4. Send to Gemini API  ──────────────────────────────────────────┐       │
 │   5. Parse & validate response                                     │       │
 │   6. Write to issue_ai_analysis table ◄────────────────────────────┘       │
 └──────────────────────────────────────────────────────────────────────────-──┘
                                    │
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                     ✨  GOOGLE GEMINI 2.5 FLASH API                         │
 │                                                                             │
 │   Inputs:  Issue text + Image/Video URLs + Platform context                │
 │                                                                             │
 │   Outputs:                                                                  │
 │   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐  │
 │   │ Category &      │ │ Duplicate        │ │ Fake Score &               │  │
 │   │ Severity Level  │ │ Detection        │ │ Copilot Response           │  │
 │   │ (Low→Critical)  │ │ (linked IDs)     │ │ (natural language)         │  │
 │   └─────────────────┘ └─────────────────┘ └─────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘
```

### Issue Lifecycle State Machine

```
                         ┌─────────────────┐
                         │   📝  DRAFT      │  ← Citizen writes title + desc
                         └────────┬────────┘
                                  │  Submit + Media Upload
                                  ▼
                         ┌─────────────────┐
                         │  ⏳  PENDING     │  ← AI analysis runs in background
                         └────────┬────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               │                  │                  │
               ▼                  ▼                  ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │  ✅  VERIFIED   │  │  ❌  REJECTED   │  │  🔁  DUPLICATE  │
    │  (Verifier OK)  │  │  (Spam/Fake)    │  │  (Linked to     │
    └────────┬────────┘  └─────────────────┘  │   existing)     │
             │                                └─────────────────┘
             │  Admin resolves
             ▼
    ┌─────────────────┐
    │  🏁  RESOLVED   │  ← Resolution report + proof image filed
    └─────────────────┘
             │
             ▼
    Points awarded to citizen, verifier & admin 🏆
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router |
| State | Zustand (auth, toasts, notifications) |
| Server State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Maps | React Leaflet |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styles | Tailwind CSS 3.4 |

### Backend & AI
| Layer | Technology |
|---|---|
| BaaS | Supabase (Auth, DB, Storage, Realtime) |
| Database | PostgreSQL with Row Level Security |
| Realtime | Supabase Realtime (WebSockets) |
| Serverless | Supabase Edge Functions (Deno runtime) |
| AI Model | Google Gemini 2.5 Flash |
| File Storage | Supabase Storage (`issue-media` bucket) |

---

## 🗄️ Database Schema

```
┌──────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│   profiles   │       │      issues      │       │  issue_ai_analysis  │
├──────────────┤       ├──────────────────┤       ├─────────────────────┤
│ id (UUID) PK │──┐    │ id (UUID) PK     │──┐    │ issue_id (UUID) FK  │
│ full_name    │  │    │ title            │  │    │ category            │
│ role         │  └───►│ created_by (FK)  │  │    │ severity            │
│ points       │       │ description      │  └───►│ duplicate_ids[]     │
│ badges[]     │       │ location         │       │ fake_score          │
└──────────────┘       │ status           │       │ image_analysis      │
                       │ media_urls[]     │       │ improved_title      │
                       └──────────────────┘       │ improved_desc       │
                                │                 └─────────────────────┘
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
        ┌──────────────┐ ┌──────────┐ ┌───────────────────┐
        │issue_comments│ │issue_vot-│ │issue_verifications│
        ├──────────────┤ │  es      │ ├───────────────────┤
        │ id           │ ├──────────┤ │ id                │
        │ issue_id FK  │ │issue_id  │ │ issue_id FK       │
        │ user_id FK   │ │user_id   │ │ verifier_id FK    │
        │ content      │ └──────────┘ │ action            │
        │ created_at   │             │ notes             │
        └──────────────┘             └───────────────────┘

        ┌──────────────────────────┐
        │    resolution_reports    │
        ├──────────────────────────┤
        │ id                       │
        │ issue_id FK              │
        │ resolved_by FK           │
        │ notes                    │
        │ proof_image_url          │
        │ resolved_at              │
        └──────────────────────────┘
```

---

## 🚀 Setup Instructions

<<<<<<< HEAD
=======
### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) account
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for Edge Functions)

---

### Step 1 — Clone & Install

```bash
git clone https://github.com/your-username/community-hero.git
cd community-hero
npm install
```

---

### Step 2 — Configure Environment

Create a `.env` file in the project root:

```env
# ── Frontend (Vite) ──────────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ── Backend (set in Supabase Dashboard → Edge Functions) ──
# GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ **Never commit your `.env` file.** The `GEMINI_API_KEY` is stored as a Supabase secret and never exposed to the frontend.

---

### Step 3 — Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com/dashboard)

2. **Run the SQL migrations** in your Supabase SQL Editor (Project → SQL Editor):

```sql
-- Run these in order:
-- 1. supabase_setup.sql  → Creates profiles, issues, RLS, triggers, storage policies
-- 2. ai_migration.sql    → Creates issue_ai_analysis table
```

3. **Create a public storage bucket** named exactly `issue-media`:
   - Go to **Storage → Create Bucket**
   - Name: `issue-media`
   - Public: ✅ enabled

---

### Step 4 — Deploy Edge Functions

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Set secrets (Gemini API key)
supabase secrets set GEMINI_API_KEY=your_google_gemini_api_key

# Deploy the AI agent function
supabase functions deploy ai-civic-agent
```

---

### Step 5 — Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```
✓ Ready in 800ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

## 🔒 Security
>>>>>>> 44ddb84 (ready to push)

Community Hero is built with a **security-first** architecture:

| Mechanism | Description |
|---|---|
| 🔐 **Row Level Security** | All PostgreSQL tables enforce RLS. Only authenticated users can insert. Mutations are gated by role (`created_by`, `verifier`, `admin`). |
| 🛡️ **Trigger Protection** | Profile points cannot be modified by frontend clients directly. A DB trigger (`protect_profile_points`) intercepts all point mutations and routes them through a secure RPC (`increment_points`). |
| 🔑 **JWT Verification** | The `ai-civic-agent` Edge Function validates the Supabase JWT on every request, rejecting unauthorized calls before any AI processing occurs. |
| 🪣 **Storage Policies** | The `issue-media` bucket has per-object access policies — only the authenticated uploader or admins can delete their media. |

---

<<<<<<< HEAD

=======
## 🌍 Deployment

### Frontend — Vercel (Recommended)

```bash
# Option A: CLI
npx vercel --prod

# Option B: Connect GitHub repo to vercel.com
# Build Command:  npm run build
# Output Dir:     dist
# Environment Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### Frontend — Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend — Supabase (Already hosted)

```bash
# Redeploy Edge Functions after any changes
supabase functions deploy ai-civic-agent

# Verify deployment
supabase functions list
```

---

## 🔮 Roadmap

- [ ] **📱 Mobile App** — React Native / Capacitor wrapper with native camera and offline reporting
- [ ] **🗺️ AI Heatmaps** — Auto-generated monthly municipal hotspot maps from `issue_ai_analysis` data
- [ ] **📄 AI Report Generation** — Monthly PDF summaries for municipal councils, auto-generated by Gemini
- [ ] **🔔 Push Notifications** — Citizens notified when their issue status changes
- [ ] **♾️ Infinite Scroll** — Paginated issue feed with virtual rendering for large datasets
- [ ] **🗜️ Image Compression** — Client-side image compression before upload to reduce storage costs
- [ ] **🔐 Advanced RLS** — Restrict `issue_ai_analysis` writes strictly to Service Role, blocking all client-side mutations

---

## 🤝 Contributing

Community Hero is open for contributions! Here's how:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/community-hero.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes, then commit
git commit -m "feat: add your feature description"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) format for all commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for full terms.

---

<div align="center">

Built with ❤️ for citizens and municipalities everywhere.

**[⬆ Back to top](#)**
>>>>>>> 44ddb84 (ready to push)

</div>
