# Data Engineering Blog Platform

A professional blog with an AI-powered editor for writing and publishing data engineering, AI/ML, and reporting content.

## Architecture

```
├── frontend/          # React SPA → Vercel (free tier)
├── backend/           # Express API → Render (free tier)
└── docs/              # Documentation
```

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Vite
- **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL (Neon)
- **AI Editor**: DeepSeek API for post editing and refinement

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://...   # Neon PostgreSQL
ADMIN_API_KEY=your-secret-key   # Protect the admin panel
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000
```

## Admin Panel

Visit `/admin` and enter your `ADMIN_API_KEY` to access:
- **Post Management**: Create, edit, delete blog posts
- **AI Editor**: Use DeepSeek to edit and improve posts
- **Publishing Workflow**: Draft → AI Edit → Review → Publish

### AI Editor Setup

1. Log in to the admin panel with your API key
2. Enter your DeepSeek API key on the login page
3. Write or edit a post, click "AI Edit", describe what you want changed
4. Review the side-by-side diff, accept or reject changes
5. Set status to "published" and save to make it live

## Database

Uses PostgreSQL via [Neon](https://neon.tech) (free tier). Run migrations:

```bash
cd backend
npm run db:push
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add env var `VITE_API_URL` pointing to Render backend URL

### Backend (Render)
1. Create a new Web Service pointing to the repo
2. Root directory: `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm run db:push && npm start`
5. Add env vars: `DATABASE_URL`, `ADMIN_API_KEY`, `CORS_ORIGIN`, `NODE_ENV=production`

## License

MIT
