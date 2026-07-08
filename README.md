# JanSahayak AI — AI-Powered Smart Constituency Development Planner & MP Command Center

<div align="center">
<a href="https://jansahayak-ai.netlify.app">
<img src="/images/Banner.png" alt="JanSahayak AI Banner" />
</a>
</div>

<div align="center">

[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Apache ECharts](https://img.shields.io/badge/ECharts-Visual_Analytics-AA0000?style=for-the-badge&logo=apache&logoColor=white)](https://echarts.apache.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Empowering Members of Parliament with data-driven constituency development planning, AI grievance management, and budget optimization.**

[🌐 Live App](https://jansahayak-ai.netlify.app) · [📖 Documentation](https://github.com/unkown812/janhayak-ai) · [🐛 Report Bug](https://github.com/unkown812/janhayak-ai/issues)

</div>

---

## Overview

JanSahayak AI is a **smart constituency development planner** built for the **Build with AI: Code for Communities** Hackathon. It provides Members of Parliament (MPs) and local administrators with:

- **Multilingual AI grievance filing** — citizens submit complaints via voice or text in Hindi/English
- **GIS constituency command center** — interactive maps showing complaint hotspots and department backlogs
- **MPLAD budget optimizer** — drag-and-drop project prioritization with ₹1 Cr budget cap
- **AI strategic advisor** — Gemini-powered health scoring, bottleneck analysis, and budget recommendations
- **Quality control** — track resolution times, re-open rates, and contractor maintenance reports

### Key Problem Solved

> MPs receive development requests through public meetings, letters, social media, and grievance portals — but there's no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand. JanSahayak AI solves this with an AI-driven platform.

---

## Features

| Feature | Description |
|:---|:---|
| 🗣️ **Multilingual Voice Grievances** | Hindi/English speech-to-text via Web Speech API + Google Gemini translation |
| 🗺️ **GIS Constituency Map** | Interactive Leaflet/OpenStreetMap with color-coded grievance pins |
| 📊 **KPI Analytics Dashboard** | Apache ECharts widgets: trends, department backlogs, budget utilization |
| 🎯 **MPLAD Budget Optimizer** | Drag-and-drop prioritization, ₹1 Cr budget cap, Gantt timelines |
| 🤖 **AI Strategic Advisor** | Health scores, trade-off analysis, administrative directives |
| 📱 **Citizen Portal** | File grievances, track status, upvote community issues |
| 🔒 **Quality Control** | Resolution tracking, re-open rates, work order management |
| 🎪 **Demo Simulator** | Monsoon, water pipeline, and election scenario simulations |

---

## Technology Stack

| Technology | Purpose |
|:---|:---|
| **React 19** | Virtual DOM, hooks, conditional routing |
| **Vite 8** | Fast bundler, HMR, build tool |
| **Firebase Auth + Firestore** | Authentication and real-time database |
| **Google Gemini 2.5 Flash** | AI translation, strategic advisory |
| **Leaflet + OpenStreetMap** | GIS constituency mapping |
| **Apache ECharts** | Data visualizations |
| **HTML5 Web Speech API** | Voice input |
| **dnd-kit** | Drag-and-drop |
| **Lucide React** | SVG icons |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Quick Start

```bash
git clone https://github.com/unkown812/janhayak-ai.git
cd janhayak-ai
npm install
cp .env.example .env   # Add your API keys
npm run dev             # Open http://localhost:5173
```

### Required Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_DATABASE_URL=your_project.firebaseio.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Project Structure

```
JanSahayak-AI/
├── index.html                 # SEO meta tags, Open Graph, Google Fonts
├── vite.config.js             # Vite config with code splitting
├── public/
│   ├── robots.txt             # Search engine crawling rules
│   ├── sitemap.xml            # XML sitemap
│   ├── llms.txt               # AI/LLM context file
│   ├── favicon.svg
│   ├── hero.png               # Hero image / README banner
│   └── og-image.png           # Open Graph social card (soon)
└── src/
    ├── main.jsx               # Entry point with structured data injection
    ├── App.jsx                # Root with SPA routing via state
    ├── App.css
    ├── index.css              # Design system (HSL variables, glassmorphism)
    ├── firebase.js            # Firebase initialization
    ├── seo/
    │   └── structuredData.js  # JSON-LD structured data injection
    ├── context/
    │   └── AppContext.jsx
    └── components/
        ├── LandingPage.jsx    # SEO-optimized landing
        ├── AboutPage.jsx      # Project details
        ├── Header.jsx
        ├── Footer.jsx         # Navigation with internal linking
        ├── CitizenPortal.jsx
        ├── ConstituencyMap.jsx
        ├── KpiGrid.jsx
        ├── GrievanceTable.jsx
        ├── DetailPanel.jsx
        ├── Optimizer.jsx
        ├── AiAdvisor.jsx
        ├── SocialIngestor.jsx
        ├── QualityDashboard.jsx
        ├── TrendingIssues.jsx
        ├── EventSimulator.jsx
        └── LoginPortal.jsx
```

---

## Repository Topics

`constituency-development` `ai-government` `grievance-management` `mp-dashboard` `civic-tech` `india-governance` `mp lad-fund` `voice-grievances` `gemini-ai` `firebase` `react` `gis-mapping` `budget-optimization` `constituency-planning`

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ for <strong>Code for Communities</strong> Hackathon
</div>