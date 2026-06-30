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


<div align="center">

Built with ❤️ for citizens and municipalities everywhere.

**[⬆ Back to top](#)**
>>>>>>> 44ddb84 (ready to push)

</div>
