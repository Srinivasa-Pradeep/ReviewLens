# ReviewLens

> Turn thousands of reviews into insights in seconds.

ReviewLens is an AI-powered review analytics platform designed for both B2C Consumers (Buyers) and E-commerce Businesses (Sellers). Built with a high-end dark glassmorphism aesthetic, it parses raw review texts, crawls URL targets, or processes multi-megabyte CSV datasets to yield immediate summaries, buying verdicts, complaint priority lists, and feature roadmap recommendations.

---

## Architectural Overview

```
                          +-------------------------+
                          |      User Client        |
                          +------------+------------+
                                       |
                                       | (HTTPS / REST)
                                       v
                          +-------------------------+
                          |   Next.js App Router    |
                          | (React 19, Recharts,    |
                          |      Framer Motion)     |
                          +------------+------------+
                                       |
                                       | (API Requests)
                                       v
                          +-------------------------+
                          |    Python FastAPI       |
                          |   (Uvicorn Backend)     |
                          +------------+------------+
                                       |
                   +-------------------+-------------------+
                   v                                       v
       +-----------------------+               +-----------------------+
       |   Ingestion Engine    |               |  AI Analysis Layer    |
       | (Pandas, Tiktoken     |               | (Instructor / OpenAI  |
       |   Safe Budgeter)      |               |  Structured Outputs)  |
       +-----------------------+               +-----------------------+
                   |                                       |
                   +-------------------+-------------------+
                                       v
                          +-------------------------+
                          |  Database Persistence   |
                          |  (SQLAlchemy Async,     |
                          |  SQLite/Postgres Pool)  |
                          +-------------------------+
```

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic v2, Instructor, Tiktoken, Pandas
- **Database**: PostgreSQL (Production) / SQLite with SQLAlchemy & `aiosqlite` (Local Fallback)
- **AI Engine**: OpenAI API (utilizing JSON Mode and Structured Output schemas)

---

## Folder Structure

```
reviewlens/
├── backend/               # FastAPI application
│   ├── .venv/             # Python virtual environment
│   ├── main.py            # API entry point & routes
│   ├── ingestion.py       # Pandas CSV parsers & Tokenizer
│   ├── analyzer.py        # OpenAI extraction & mock system
│   ├── database.py        # SQLAlchemy async connection config
│   ├── models.py          # SQLAlchemy tables mapped definitions
│   └── schemas.py         # Pydantic v2 domain schemas
├── frontend/              # Next.js TypeScript application
│   ├── src/
│   │   ├── app/           # Next.js App Router (Layouts/Pages)
│   │   │   ├── dashboard/ # Stateful Buyer vs. Seller dashboards
│   │   │   └── page.tsx   # Upload & Ingestion Landing View
│   │   └── components/    # Reusable UI Header & Help Modals
│   ├── package.json       # Node package configurations
│   └── tsconfig.json      # TypeScript configurations
└── .gitignore             # Root git ignore profiles
```

---

## Setup & Local Running

Ensure you have Python 3.9+ and Node.js v20+ installed.

### 1. Running the Backend Server
```bash
cd backend
source .venv/bin/activate

# (Optional) Export your OpenAI API key for live structured extraction
export OPENAI_API_KEY="your-openai-api-key"

uvicorn main:app --reload --port 8000
```
*App database (`reviewlens.db`) initializes automatically. Serves endpoints at `http://localhost:8000`.*

### 2. Running the Frontend Server
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
*Launches Next.js dev portal at `http://localhost:3000`.*

---

## Dual-Mode Features

### Buyer Mode
- ** definitive Buying Verdict**: Dynamic glowing verdict badges ("Strong Buy", "Buy with Caution", "Only Buy on Discount", "Avoid") to indicate buying feasibility.
- **Sentiment Overview**: Recharts donut visualizations displaying positive, neutral, and negative ratio metrics.
- **Top Pros & Cons**: Ranked pros/cons containing frequency bars.
- **Thematic Scores**: Visual dimensions detailing Build Quality, Value, and Usability.

### Seller Mode
- **Ranked Complaint Matrix**: Tracks product faults, customer volume, and severity rating.
- **Root Cause Journey**: Chronological vertical diagnostics timeline trackingDay 1 unboxing problems through month 3 degradation.
- **Strategic Fix Lists**: Prioritized recommendation lists (Immediate Fixes, Roadmap, Competitor Gaps).

---

## Deployment to Vercel

The Next.js App Router is optimized for direct hosting on Vercel:

1. **Deploying via Vercel CLI**:
   ```bash
   cd frontend
   npx vercel login
   npx vercel
   ```
2. **Environment Variables**:
   Configure Next.js to point to your live FastAPI production backend endpoint by setting standard configuration routes (e.g. updating API query endpoints in `page.tsx` and `dashboard/page.tsx` to read from `process.env.NEXT_PUBLIC_API_URL`).
