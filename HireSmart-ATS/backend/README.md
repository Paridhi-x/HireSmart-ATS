# HireSmart ATS - Backend

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill values
3. `npm run dev` or `npm start`

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Jobs
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs (recruiter)
- PUT /api/jobs/:id
- DELETE /api/jobs/:id
- GET /api/jobs/recruiter/my-jobs

### Applications
- POST /api/applications (candidate + resume PDF)
- GET /api/applications/my
- GET /api/applications/job/:jobId
- PUT /api/applications/:id/status
- GET /api/applications/dashboard
