# HireSmart ATS

A full-stack AI-powered Applicant Tracking System built for industrial training.

**Stack:** React (Vite) + Tailwind CSS · Node.js + Express · MongoDB · Google Gemini AI

## Features

- Role-based auth (Candidate / Recruiter)
- Job posting, browsing, search
- Resume PDF upload + automatic text extraction
- Gemini AI ATS scoring (match score, matched/missing skills, summary)
- Candidate ranking by score
- Status pipeline: Applied → Shortlisted → Interview → Hired / Rejected
- Recruiter dashboard with stats

## Quick Start (Local)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
# Optional: create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open http://localhost:5173

## Environment Variables (Backend)

| Key | Description |
|-----|-------------|
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Any long random string |
| GEMINI_API_KEY | From https://aistudio.google.com |
| PORT | 5000 (default) |

## Deployment

- **Frontend:** Vercel (set env `VITE_API_URL` to your Render backend URL + `/api`)
- **Backend:** Render (set the 3 env vars above)
- **Database:** MongoDB Atlas (free M0 cluster)

## Project Structure

```
backend/
  models/       User, Job, Application
  routes/       auth, jobs, applications
  middleware/   JWT auth + roles
  utils/        Gemini analysis
frontend/
  src/
    pages/      All screens
    components/ Navbar, ScoreRing, StatusBadge
    context/    Auth
```

## Colour Palette (easy to change)

Defined in `frontend/tailwind.config.js` and CSS variables in `src/index.css`.

Primary navy: `#1B3A57` · Accent: `#D9622B` · Background: `#F6F5F2`

---

Built as part of Industrial Training submission.
