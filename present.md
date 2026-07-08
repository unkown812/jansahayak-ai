# JanSahayak AI — Hackathon Pitch Slide Deck

---

## Slide 1: JanSahayak AI (Title Slide)
### Smart Web GIS & Live AI Constituency Planner

*   **Subtitle:** Empowering Members of Parliament (MPs) with data-driven constituent planning.
*   **Hackathon Focus:** *People's Priorities (AI for Constituency Development Planning)* track.
*   **Live App:** [Jansahayak AI](https://jansahayak-ai.netlify.app)
*   **GitHub:** https://github.com/unkown812/JanSahayak-AI
*   *Presenter Name & Team Credentials*

---

## Slide 2: The Core Problem Statement
### The MP's Decision Dilemma

> "MPs receive development requests through public meetings, letters, social media, grievance portals, and direct representations — while local development plans contain dozens of competing proposed projects. There's no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand."

*   **The Bottlenecks:**
    *   **Chaotic Formats:** Citizens report in unstructured dialects/languages.
    *   **No Spatial Context:** Wards are too large; exact hotspots are missed.
    *   **Ad-hoc Decisions:** Projects are approved without budget compliance or real data.

---

## Slide 3: The Dilemma We Solve
### School Upgrades vs. Vocational Training

*   **The Question:** If two groups demand funding, how does an MP choose?
    *   **Case A:** Upgrade a crowded school?
    *   **Case B:** Build a vocational training center?
*   **The JanSahayak Solution:**
    *   We cross-reference citizen requests with **live demographics & public datasets** (e.g. school travel distances vs. local youth unemployment rates).
    *   **Google Gemini** conducts an objective trade-off evaluation to rank projects by community impact.

---

## Slide 4: System Architecture
### The Four Core Product Pillars

1.  **Multilingual Intake & Map Pinning:** Citizens drop exact GPS pins and report in Hindi or regional dialects.
2.  **Live GIS Zonal Command Center:** Interactive Bhubaneswar map showing real-time grievance hotspot pins and department backlogs.
3.  **AI Strategic Advisor:** Aggregates database rows and runs Gemini-driven trade-off roadmaps based on sector gaps.
4.  **MPLAD Resource Optimizer:** Drag-and-drop prioritization conforming to the ₹1.0Cr budget cap with sequential Gantt timelines.

---

## Slide 5: Pillar 1 — Citizen Intake
### Multilingual Reports & Geocoded Coordinates

*   **HTML5 Web Speech Integration:** Citizens record voice notes in Hindi/regional languages.
*   **Gemini Translation Refiner:** Automatically transcribes, translates to English, extracts the sector category, and estimates severity.
*   **Google Maps Geocoding:** Citizens click the map, search landmarks, or share browser GPS to pin their exact latitude/longitude.
*   **Supabase Database Sync:** Details and coordinates are saved instantly in real-time.

---

## Slide 6: Pillar 2 — Zonal Command Center
### Live Diagnostics & Actionable Directives

*   **GIS Diagnostic Map:** Interactive map centered on Bhubaneswar plotting coordinates-based severity pins.
*   **Analytical KPIs:** Apache ECharts horizontal grids and donut charts showing category backlogs.
*   **AI Letter Writer:** Gemini drafts official directives (e.g., to the Municipal Commissioner) and SMS updates to citizens in 1 click.
*   **Authentication:** Guarded by secure Supabase Auth and Google OAuth redirection.

---

## Slide 7: Pillar 3 — AI Strategic Advisor
### Sector Gaps & Budget Trade-Off briefings

*   **The Engine:** Powered by live queries to **Google Gemini 2.5 Flash-Lite**.
*   **Data Aggregation:** Scans active grievances and scheduled projects directly from the Supabase database.
*   **Demographic Correlation:** Weighs feedback against census benchmarks (e.g. *school travel distance* vs *unemployment rate*).
*   **The Output:** Generates a formatted markdown Strategic Roadmap assessing a **Constituency Health Score** and recommending budget divisions.

---

## Slide 8: Pillar 4 — Resource Optimizer
### Budget Cap Auditing & Gantt Timelines

*   **dnd-kit Drag-and-Drop:** Administrators drag project cards to sort execution priority.
*   **₹1.0Cr Budget Ceiling:** Tracks total costs against the MPLAD budget cap, flashing red alerts during overruns.
*   **Sequential Gantt Planner:** Automatically calculates start/end dates sequentially based on card priority.
*   **Official Municipal Dispatch Printer:** Formats and prints official Government Work Orders complete with seal letterheads.

---

## Slide 9: The Technology Stack
### Unified, Modern Framework Integration

*   **Frontend:** React 19 & Vite (HMR, fast bundle, Outfits/Inter typography).
*   **AI Core:** Google Gemini 2.5 Flash-Lite API (translation, letter writing, roadmap generation).
*   **GIS Engine:** Google Maps JavaScript SDK (geolocated markers, search boxes, geolocation).
*   **Database & Auth:** Supabase PostgreSQL & Supabase Auth (Google OAuth).
*   **Analytics:** Apache ECharts & ReactECharts.
*   **Styling:** Custom CSS Glassmorphism.

## Slide 10: Summary & Project Credits
### Transforming Governance, One Pin at a Time

*   **Key Impacts:**
    *   **Democratizing Development:** Moves civic planning from arbitrary decisions to live citizen priorities.
    *   **100% Budget Compliance:** Built-in MPLAD cap guards against municipal resource overruns.
    *   **Closed-Loop Accountability:** Auto-generated dispatches secure transparent municipal actions.
*   **Team Roles & Contributions:**
    *   *AI Engineering:* Live translation & Gemini-based strategic briefing compilers.
    *   *GIS Mapping:* Geocoded pinpointing, address markers, and constituency visualizations.
    *   *Database & Deployment:* Supabase integration and production hosting.
*   **Q&A Session:** *Open for Questions & Strategic Feedback.*
