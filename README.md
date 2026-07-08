# JanSahayak AI — Smart Constituency Development Planner

<div align="center">

[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![CSS3 Style](https://img.shields.io/badge/CSS3-Vanilla_Zinc-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Apache ECharts](https://img.shields.io/badge/ECharts-Apache_Visuals-AA0000?style=for-the-badge&logo=apache&logoColor=white)](https://echarts.apache.org/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-HTML5_Speech-EFD81D?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![dnd-kit](https://img.shields.io/badge/%40dnd--kit-Drag_--_Drop-FF5722?style=for-the-badge)](https://dndkit.com/)
[![Gemini AI Integration](https://img.shields.io/badge/Gemini_AI-Google_DeepMind-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Render Deploy](https://img.shields.io/badge/Render-Live_Static_Site-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://JanSahayak-ai.onrender.com)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## Live Site
Access the hosted simulation here: **https://jansahayak-ai.netlify.app**

---

## Hackathon Context
JanSahayak AI was built for the **Build with AI: Code for Communities** Hackathon (supported by Google Cloud) on the **Hack2Skill** platform.

*   **Track:** People's Priorities (AI for Constituency Development Planning)

### The Problem
> "MPs receive development requests through public meetings, letters, social media, grievance portals, and direct representations — while local development plans contain dozens of competing proposed projects. There's no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand."

### The Challenge
> "Build a multilingual AI platform where citizens can submit development suggestions via voice, text, photos, or messaging apps. The system should analyze submissions to surface recurring themes, map demand hotspots, and combine citizen feedback with demographic data, infrastructure gaps, local development plans, and public datasets — to recommend and rank high-priority development works an MP can act on."

---

## How JanSahayak AI Solves This

### 1. Citizen Portal (Inclusive Input)
*   **Multilingual Voice Grievance Filing** — HTML5 Web Speech API supports dictation in **Hindi (hi-IN)** and **English (India)**.
*   **AI Transcription & Translation** — Google Gemini 2.5 Flash translates Hindi grievances into structured English, infers department/sector (Infrastructure, Water Supply, Sanitation, Public Health, Heritage/Tourism, Transport), and grades urgency.
*   **Geolocation** — Pin-drop on a Leaflet map (OpenStreetMap), GPS location sharing, or landmark search via Nominatim geocoder.
*   **Community Support** — Citizens can support/upvote grievances, track their own tickets, and report quality issues on resolved work.
*   **Trending Issues** — Real-time view of most-supported grievances across the constituency.

### 2. MP Command Center Dashboard (5 Workspaces)

| Workspace | Description |
| :--- | :--- |
| **Grievance Command Panel** | KPI grid (satisfaction rate, active grievances, budget utilization, work projects, quality control), interactive Leaflet map with color-coded pins, searchable/filterable grievance table with pagination, detail inspector panel with status management. |
| **Resource Optimizer** | Drag-and-drop project prioritization (via `@dnd-kit`), budget cap enforcement (₹1.0 Cr / 100 Lakhs), auto-sort by community priority, Gantt chart timeline visualization, AI auto-project planner. |
| **AI Strategic Advisor** | Generates a full strategic constituency briefing using Gemini API — health score, bottleneck analysis, budget recommendations with trade-off analysis, and administrative directives. |
| **Social Gripe Ingestor** | Sample social media posts that can be ingested as formal grievances with AI-powered structuring. |
| **Quality Control Dashboard** | Tracks re-open rates, resolution times, maintenance reports; allows work order creation for flagged issues. |

### 3. Demo Event Simulator
Floating trigger that simulates monsoon storms, water pipeline failures, or election scenarios — injecting mock grievances into the system for demonstration.

---

## Project Repository Structure

```text
JanSahayak-AI/
├── index.html                   # HTML template with SEO meta tags, Open Graph, Google Fonts
├── vite.config.js               # Vite config with React plugin
├── package.json                 # Dependencies, scripts, metadata
├── .env.example                 # Environment variable template
├── .firebaserc                  # Firebase project alias (jansahayak-ai-45d04)
├── firebase.json                # Firebase config (Firestore asia-south1, Auth providers)
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore composite indexes
├── .oxlintrc.json               # Oxlint linter configuration
├── LICENSE                      # MIT License
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Root component with page routing
│   ├── App.css                  # App-level styles
│   ├── index.css                # Global CSS (HSL variables, glassmorphism, responsive rules)
│   ├── firebase.js              # Firebase init (Auth + Firestore)
│   │
│   ├── context/
│   │   └── AppContext.jsx       # Global state: grievances, budgets, auth, theme, simulator
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   └── components/
│       ├── Header.jsx           # Sticky nav with theme toggle, Gemini status, settings
│       ├── Footer.jsx           # Multi-column footer with navigation & hackathon links
│       ├── LandingPage.jsx      # Hero section with feature cards & CTAs
│       ├── AboutPage.jsx        # Hackathon context, problem, solution, tech stack
│       ├── LoginPortal.jsx      # Glassmorphic admin sign-in (Google OAuth / demo bypass)
│       ├── CitizenPortal.jsx    # Grievance filing: voice, text, map pin-drop
│       ├── ConstituencyMap.jsx  # Interactive Leaflet map with color-coded pins
│       ├── KpiGrid.jsx          # KPI analytics: ECharts sparklines, bar charts, donuts
│       ├── GrievanceTable.jsx   # Searchable, sortable, paginated grievance list
│       ├── DetailPanel.jsx      # Inspector card with status management & work orders
│       ├── Optimizer.jsx        # Drag-and-drop project queue + Gantt timeline
│       ├── AiAdvisor.jsx        # AI strategic briefing: health score, bottlenecks, directives
│       ├── SocialIngestor.jsx   # Social media post ingestion as formal grievances
│       ├── QualityDashboard.jsx # Re-open rates, resolution times, maintenance tracking
│       ├── TrendingIssues.jsx   # Most-supported grievances across the constituency
│       └── EventSimulator.jsx   # Floating trigger for demo scenarios
│
├── firebase/
│   ├── firestore.rules          # (symlink/copy) Security rules
│   └── firestore.indexes.json   # (symlink/copy) Index definitions
│
├── supabase/                    # Reference PostgreSQL schema (informational only)
│   ├── schema.sql
│   └── rls_policies.sql
│
└── dist/                        # Production build output (generated)
```

---

## Technology Stack & Rationale

| Technology | Usage | Rationale |
| :--- | :--- | :--- |
| **React 19** | Virtual DOM, hooks, conditional routing | Top-tier performance, declarative UI, minimal paint cost |
| **Vite 8** | Bundler, HMR, build tool | Millisecond-scaffold builds, fast developer inner loop |
| **Vanilla CSS3** | Custom typography, dark/light themes, HSL variables, glassmorphism | Full layout flexibility without bulky utility frameworks |
| **Apache ECharts** | KPI sparklines, department bar charts, budget donuts | Vector canvas visualizations that auto-scale on window resize |
| **Leaflet + react-leaflet** | Interactive constituency map with grievance pins | Lightweight, free (OpenStreetMap), no API key required |
| **HTML5 Web Speech API** | Client-side Hindi & English speech-to-text | Native browser capability, no third-party API costs |
| **dnd-kit** | Drag-and-drop project prioritization | Modular pointer/touch sensors with zero layout shift |
| **Firebase Auth** | Google OAuth + email/password sign-in | Managed auth with built-in security rules |
| **Firebase Firestore** | Real-time grievance, project, and user data | Live syncing across sessions without a backend server |
| **Google Gemini 2.5 Flash** | AI transcription, translation, strategic advisory, directive generation | Low-latency, multilingual capable, cost-efficient |
| **react-markdown + remark-gfm** | AI report rendering | Safe markdown rendering for AI-generated briefings |
| **Lucide React** | Consistent SVG icon set | Sharp, scalable vectors across all screen densities |
| **Oxlint** | Rust-based linter | Blazing-fast linting with zero config overhead |
| **Render CDNs** | Static site hosting | Auto-deploy on git push, global CDN |

---

## Design System & Aesthetics
*   **Zinc theme** — Dark and light variants toggled on the fly.
*   **Glassmorphic components** — High-quality HSL background blur, transparent borders, soft gradient glows.
*   **Micro-animations** — Glow pulses, sliding panels, streaming text for the AI advisor.
*   **Responsiveness First** — Custom media queries:
    *   Table columns hide automatically on mobile.
    *   Gantt project names stack vertically on screens under 600px.
    *   Detail slideouts expand to full-screen overlays.

---

## Getting Started & Setup

### Prerequisites
**Node.js** (v18+) and **npm** installed.

### 1. Clone Repository
```bash
git clone https://github.com/unkown812/janhayak-ai.git
cd JanSahayak-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Duplicate `.env.example` to `.env` and populate with your keys:

```bash
cp .env.example .env
```

**Required variables:**
```env
VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_DATABASE_URL=your_project.firebaseio.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### How to obtain keys:
*   **Gemini API Key:** [Google AI Studio](https://aistudio.google.com/) → Get API key → Create API key.
*   **Firebase Config:** [Firebase Console](https://console.firebase.google.com/) → Project settings → General → Your apps → Web app → Copy the config object.

> **Note:** Maps use Leaflet + OpenStreetMap (free, no API key). A Google Maps key is no longer required.

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)**.

### 5. Other Commands
```bash
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # Run Oxlint
```

---

## License
Distributed under the MIT License. See `LICENSE` for more information.
