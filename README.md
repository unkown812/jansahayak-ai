# JanSahayak AI — Smart Constituency Development Planner

<div align="center">

[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![CSS3 Style](https://img.shields.io/badge/CSS3-Vanilla_Zinc-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Apache ECharts](https://img.shields.io/badge/ECharts-Apache_Visuals-AA0000?style=for-the-badge&logo=apache&logoColor=white)](https://echarts.apache.org/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-HTML5_Speech-EFD81D?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![dnd-kit](https://img.shields.io/badge/%40dnd--kit-Drag_--_Drop-FF5722?style=for-the-badge)](https://dndkit.com/)
[![Gemini AI Integration](https://img.shields.io/badge/Gemini_AI-Google_DeepMind-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Render Deploy](https://img.shields.io/badge/Render-Live_Static_Site-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://JanSahayak-ai.onrender.com)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 Live Site
Access the hosted simulation here: **[https://JanSahayak-ai.onrender.com](https://JanSahayak-ai.onrender.com)**

---

## 📅 Hackathon Context
JanSahayak AI was specifically built for the **Build with AI: Code for Communities** Hackathon (supported by Google Cloud) on the **Hack2Skill** platform.

*   **Track:** People's Priorities (AI for Constituency Development Planning)

### **The Problem**
> "MPs receive development requests through public meetings, letters, social media, grievance portals, and direct representations — while local development plans contain dozens of competing proposed projects. There's no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand (for example, comparing requests for school upgrades against enrollment and travel-distance data versus a proposed vocational centre)."

### **The Challenge**
> "Build a multilingual AI platform where citizens can submit development suggestions via voice, text, photos, or messaging apps. The system should analyze submissions to surface recurring themes, map demand hotspots, and combine citizen feedback with demographic data, infrastructure gaps, local development plans, and public datasets — to recommend and rank high-priority development works an MP can act on."

---

## 💡 How JanSahayak AI Solves This
JanSahayak AI bridges the gap between constituency feedback and municipal resource scheduling through four key interfaces:

### 1. Home Page
*   Provides an immediate summary of the platform's pillars.
*   Enables clear call-to-actions to route users to either the **Citizen Portal** or the secure **Command Center**.

### 2. About Page
*   Integrates the hackathon details, problem statements, and technical details verbatim.
*   Lays out the technical architecture and tech stack choices clearly.

### 3. Citizen Portal (Inclusive Input)
*   **Web Speech Recognition:** Supports voice dictation in **Hindi (हिंदी)** and **English (India)** using HTML5 Speech APIs.
*   **AI Transcription & Translation Refiner:** Automatically transcribes voice complaints. If dictation is done in Hindi, the mock-AI engine translates it into structured English, infers the relevant department/sector (Infrastructure, Water Supply, Sanitation, Public Health, Heritage/Tourism, Transport), and grades the ticket's urgency level.

### 4. Command Center Dashboard (Spatial & Analytic Planning)
*   **Secure Access Gate:** Access to administrative pages is locked behind a glassmorphic simulated login window (`admin` / `password` or a single-click Demo login) to protect official constituency data.
*   **Interactive 6-Ward SVG Map:** Displays color-coded wards indicating grievance density and satisfaction indices. Overlays interactive coordinates representing localized citizen complaints.
*   **Visual Charts Grid (Apache ECharts):** Displays weekly trends, department distribution bars, and budget allocation donuts that recalculate live.
*   **Official Directives Generator:** Slide-out panel allows the MP to review translations, draft official directives (simulated streaming text), and export complaints into formal projects.
*   **Resource Optimizer:** Utilizes drag-and-drop sequencing (via `@dnd-kit`) to sort projects. Automatically alerts the administrator when projects exceed the ₹1.0Cr MP Local Area Development fund limit and charts active works sequentially on a Gantt timeline.

---

## 📂 Project Repository Structure

Below is the directory and file tree of the JanSahayak AI codebase, detailing the responsibility of each file:

```text
JanSahayak-AI/
├── index.html                   # HTML template containing Google Font preconnects and SEO Meta / OG Tags
├── vite.config.js               # Vite configurations for React and bundler compiling
├── package.json                 # Project dependencies, build tasks, and metadata configurations
├── src/
│   ├── main.jsx                 # Client entry point mounting App to the DOM
│   ├── App.jsx                  # Main component handling state-driven page routing and viewport layouts
│   ├── index.css                # Global CSS variables, scrollbars, glass-effects, and mobile stacking rules
│   │
│   ├── context/
│   │   └── AppContext.jsx       # State Provider managing grievances, budgets, login/logout, theme, and simulator hooks
│   │
│   └── components/
│       ├── Header.jsx           # Top navbar with ticker alert marquee, theme toggle, and settings modal
│       ├── Footer.jsx           # Bottom footer containing navigation tabs, hackathon links, and copyrights
│       ├── LandingPage.jsx      # Portal gateway hero section with descriptive pillars and CTA buttons
│       ├── AboutPage.jsx        # Project case-study outlining the verbatim problem statement and tech details
│       ├── LoginPortal.jsx      # Glassmorphic admin sign-in portal with prefilled demo credentials
│       ├── CitizenPortal.jsx    # Grievance filing panel with speech recognition and AI Translation refiners
│       ├── ConstituencyMap.jsx  # Interactive SVG representation of 6 wards with hover overlays and pinpoint coords
│       ├── KpiGrid.jsx          # KPI analytics panel rendering ECharts sparklines and budget donuts
│       ├── GrievanceTable.jsx   # List panel with search filters, sorting, pagination, and mobile column hiding
│       ├── DetailPanel.jsx      # Inspector card with streaming directive generators and work order creators
│       ├── Optimizer.jsx        # Project scheduling queue with drag-and-drop handles and Gantt charts
│       └── EventSimulator.jsx   # Sticky trigger drawer to simulate monsoon storms or utility pipe failures
```

---

## 🛠️ Detailed Technology Stack & Rationale

We selected a lean, modern stack to ensure maximum performance, offline capability, and beautiful visuals:

| Technology / Library | Usage in JanSahayak AI | Rationale for Choice |
| :--- | :--- | :--- |
| **React 19** | Virtual DOM rendering, state hooks, conditional routing. | Offers top-tier performance, declarative components, and updates DOM nodes with minimal paint cost. |
| **Vite** | Bundler compiling, Hot Module Replacement (HMR). | Scaffolds build assets in milliseconds, providing an extremely fast developer inner loop. |
| **Vanilla CSS3** | Custom typography, dark/light themes, HSL variables, responsive media queries, and animations. | Ensures total layout flexibility without importing bulky utility frameworks (like Tailwind). Key rules stack tables, overlay sidebars, and stack Gantt charts on mobile viewports. |
| **Apache ECharts** | Mini KPI trend line graphs, departmental distribution charts, and budget donut charts. | Provides vector canvas-based, high-performance visualizations that automatically adjust canvas scaling on window resizing. |
| **HTML5 Web Speech API** | Client-side speech-to-text transcription for Hindi and English voices in the Citizen Portal. | Leverages native browser engine capability, eliminating the need for expensive third-party speech API call limits. |
| **dnd-kit** | Prioritized project ordering handles in the Resource Optimizer. | Modular pointer/touch listener sensors that render physics-based draggable elements with zero layout shift. |
| **Lucide React** | Consistent UI icons (Shields, Keys, Maps, Dials, Alert flags). | Fully customizable SVG vectors that scale sharply across mobile and retina displays. |
| **Render CDNs** | Live cloud static web hosting. | Automatically trigger builds on git pushes, deploying minified files on a global server network. |

---

## 🎨 Design System & Aesthetics
*   **Modern Zinc theme:** Styled with dark and light variants that are toggled on the fly.
*   **Glassmorphic components:** Cards utilize a high-quality HSL background blur, transparent border colors, and soft gradient glows.
*   **Micro-animations:** Glow pulses, sliding panels, and streaming characters make the dashboard feel alive.
*   **Responsiveness First:** Custom media queries ensure layouts stack cleanly on mobile viewports:
    *   Secondary table columns hide automatically on mobile, keeping tables clean.
    *   Gantt project names stack vertically on top of progress bars on screens below `600px` to maximize space.
    *   Detail slideouts expand to full-screen overlays to prevent text squishing.

---

## ⚙️ Getting Started & Setup

### **Prerequisites**
Ensure you have **Node.js** (v18+) and **npm** installed.

### **1. Clone Repository**
```bash
git clone https://github.com/SahooShuvranshu/JanSahayak-AI.git
cd JanSahayak-AI
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables (API Keys)**
To enable the live Google Maps integration and the real Gemini AI streams, configure your local environment keys:

1. **Create a `.env` File:**
   Duplicate the provided template file `.env.example` in the root directory and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Add Your Keys:**
   Open `.env` and paste your actual keys:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourGoogleMapsApiKeyHere
   ```

#### **How to obtain your keys:**
*   **Google Gemini API Key:**
    1. Visit [Google AI Studio](https://aistudio.google.com/).
    2. Log in with your Google account.
    3. Click **"Get API key"** at the top left.
    4. Click **"Create API Key"** and copy the generated key.
*   **Google Maps JavaScript API Key:**
    1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2. Search for and enable the **"Maps JavaScript API"** on your project.
    3. Navigate to **APIs & Services** > **Credentials**.
    4. Click **Create Credentials** > **API key** and copy it. *(Recommended: Restrict the key to 'Maps JavaScript API' in credentials settings).*

---

### **4. Run Development Server**
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### **5. Compile Production Build**
```bash
npm run build
```
The optimized minified production assets will be output in the `dist/` directory.

---

## 🔒 License
Distributed under the MIT License. See `LICENSE` for more information.
