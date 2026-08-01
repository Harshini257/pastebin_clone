# Pastebin Clone

A full-stack PasteBin-style application built with React, Vite, Express, and MongoDB.

## Features

- Create, edit, delete, and view code pastes
- Syntax highlighting using `react-syntax-highlighter`
- Light/Dark theme toggle
- Language selection for each paste
- Search pastes by title
- Local frontend state updates to avoid redundant refetches

## Repository Structure

- `backend/`
  - `server.js` — Express API server
  - `models/Paste.js` — Mongoose schema
  - `controllers/pasteController.js` — CRUD handlers
  - `routes/pasteRoutes.js` — API routes
  - `config/swagger.js` — Swagger setup
- `frontend/`
  - `src/` — React application source
  - `public/` — static assets
  - `vite.config.js` — Vite config
- `docker-compose.yml` — optional Docker development setup
- `architecture.md` — architecture documentation

## Prerequisites

- Node.js 20+ (recommended)
- npm
- MongoDB running locally or accessible via connection string

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Harshini257/pastebin_clone.git
   cd pastebin
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure backend environment:
   - Create `backend/.env`
   - Add a MongoDB connection string, for example:
     ```env
     MONGODB_URI=mongodb://localhost:27017/pastebin
     PORT=5000
     ```

## Running Locally

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite in your browser.

## Production Build

```bash
cd frontend
npm run build
```

Serve the built frontend using a static server or integrate it with the backend.

## Docker (Optional)

If you want to use Docker:

```bash
docker compose up --build
```

## Notes

- Do not commit `backend/.env` or other sensitive environment files.
- The frontend and backend are separate projects, so run both servers during local development.

## License

This project is available under the ISC license.
