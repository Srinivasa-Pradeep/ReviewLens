# ReviewLens

> Turn thousands of product reviews into insights in seconds.

**Live Demo**: [frontend-two-xi-fq8vsng9ss.vercel.app](https://frontend-two-xi-fq8vsng9ss.vercel.app)

ReviewLens is an AI-powered review analytics platform designed for both B2C Consumers (Buyers) and E-commerce Businesses (Sellers). Built with a premium, high-end Apple-style dark glassmorphism aesthetic, it parses raw review texts, crawls URL targets, or processes CSV datasets to yield immediate summaries, buying verdicts, complaint priority lists, and feature roadmap recommendations.

The project is structured as a **Unified Serverless Next.js Web Application**, running entirely on Next.js serverless routes and using the browser's `localStorage` for fast, lightweight data persistence.

---

## Architectural Overview

```
                          +-------------------------+
                          |      User Client        |
                          +------------+------------+
                                       |
                                       | (Client UI Interactions)
                                       v
                          +-------------------------+
                          |   Next.js App Router    |
                          | (React 19, Recharts,    |
                          |      Framer Motion)     |
                          +------------+------------+
                                       |
                    +------------------+------------------+
                    | (Local Ingestion API Requests)      | (Direct Storage Access)
                    v                                     v
        +-----------------------+             +-----------------------+
        | Next.js API Router    |             |  Browser LocalStorage |
        | (Serverless Routes    |             | (Stateless Caching &  |
        |  for URL/CSV/Text)    |             |  Analysis History)    |
        +-----------+-----------+             +-----------------------+
                    |
                    v
        +-----------------------+
        |  AI Analysis Engine   |
        | (Scrapers, Fallback   |
        |  Structured Outputs)  |
        +-----------------------+
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS Variables, Lucide Icons
- **Animations**: Framer Motion
- **Visuals**: Recharts (Sentiment distributions)
- **Data Model**: Browser `localStorage` (fully client-side, zero-database setup!)
- **Crawlers**: Standard Node `fetch` with HTML text parsers

---

## Folder Structure

```
reviewlens/
├── frontend/              # Next.js TypeScript application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── app/           # App Router
│   │   │   ├── api/       # Serverless Ingestion Endpoints (URL, Text, CSV)
│   │   │   ├── dashboard/ # Stateful Buyer & Seller Dashboards
│   │   │   ├── page.tsx   # Redesigned minimalist Apple Ingestion console
│   │   │   └── globals.css# Global styling definitions & custom variables
│   │   ├── components/    # Common UI elements (Header, Help Modal)
│   │   └── lib/           # Scrapers & classification rules
│   ├── package.json       # Node package configurations
│   └── tsconfig.json      # TypeScript configurations
├── README.md              # Root project documentation
└── .gitignore             # Root git ignore profiles
```

---

## Setup & Local Running

Ensure you have Node.js v20+ installed.

### Start the Application
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Dual-Mode Features

### Buyer Mode
- **Definitive Buying Verdict**: Dynamic glowing verdict badges ("Strong Buy", "Buy with Caution", "Only Buy on Discount", "Avoid") to indicate buying feasibility.
- **Sentiment Overview**: Recharts donut visualizations displaying positive, neutral, and negative ratio metrics.
- **Top Pros & Cons**: Ranked pros/cons containing frequency bars.
- **Thematic Scores**: Visual dimensions detailing Build Quality, Value, and Usability.

### Seller Mode
- **Ranked Complaint Matrix**: Tracks product faults, customer volume, and severity rating.
- **Root Cause Journey**: Chronological vertical diagnostics timeline tracking Day 1 unboxing problems through month 3 degradation.
- **Strategic Fix Lists**: Prioritized recommendation lists (Immediate Fixes, Roadmap, Competitor Gaps).

---

## Deployment to Vercel

The Next.js App Router is optimized for direct hosting on Vercel:

1. **Deploying via Vercel CLI**:
   ```bash
   cd frontend
   ```
2. Run deployment:
   ```bash
   npx vercel
   ```
