# Deploy Solvio: Frontend on Vercel + Backend on Render

Deploy the **backend** (Node/Express) on **Render** and the **frontend** (React/Vite) on **Vercel**. You need:

- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Cloudinary**: For resume uploads (you already have this)
- **Render**: Backend (Web Service)
- **Vercel**: Frontend (static)

---

## Part 1: Backend on Render

1. Go to [Render](https://render.com) and sign in (e.g. with GitHub).
2. Click **New → Web Service**.
3. Connect your repo: `mohitgithub7568/Solvio-main` (or your fork).
4. Configure:
   - **Name**: `solvio-backend` (or any name).
   - **Root Directory**: `backend`.
   - **Runtime**: Node.
   - **Build Command**: `npm install`.
   - **Start Command**: `npm start`.
5. Under **Environment**, add these variables:

   | Key | Value |
   |-----|--------|
   | `DATABASE_CONNECTION_URL` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string (e.g. from [randomkeygen](https://randomkeygen.com)) |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
   | `FRONTEND_URL` | Your Vercel app URL (e.g. `https://solvio.vercel.app`) — optional, for CORS |

   Do **not** set `PORT`; Render sets it automatically.

6. Click **Create Web Service** and wait for the first deploy.
7. Copy your backend URL (e.g. `https://solvio-backend.onrender.com`). You need it for the frontend.

---

## Part 2: Frontend on Vercel

1. Go to [Vercel](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New → Project** and import your repo (`Solvio-main` or your fork).
3. Configure the project:
   - **Root Directory**: Click **Edit** and set to `frontend` (not the repo root).
   - **Framework Preset**: Vite (Vercel usually detects it).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default for Vite).
4. **Environment Variables**: Add **before** the first deploy:

   | Name | Value |
   |------|--------|
   | `VITE_BACKEND_URL` | Your Render backend URL (e.g. `https://solvio-backend.onrender.com`) |

   **Important**: No trailing slash. Vite bakes this in at **build time**, so you must set it **before** the first deploy. If you add or change it later, you must **redeploy** (Deployments → ⋮ on latest → Redeploy) so a new build picks it up.

5. Click **Deploy**. Wait for the build to finish.
6. Copy your frontend URL (e.g. `https://solvio-xxx.vercel.app` or your custom domain).

---

## Part 3: CORS (Backend ↔ Vercel)

The backend uses `cors()` so all origins are allowed; your Vercel frontend will work without changes.

To restrict CORS to your frontend only, set **FRONTEND_URL** on Render (backend) to your Vercel URL (e.g. `https://solvio.vercel.app`). The app is already set up to use it when present.

---

## Part 4: MongoDB Atlas

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account and a free cluster.
2. **Database Access** → Add a database user (username + password). Save the password.
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
4. **Database** → **Connect** → **Drivers** → copy the connection string.
5. In the string, replace `<password>` with your database user password.
6. Use this full string as `DATABASE_CONNECTION_URL` in Render (backend environment variables).

---

## Part 5: Optional – Seed the database

To add sample jobs and data:

- **From your machine**: In the repo, run `cd backend && npm run seed` with a local `.env` that has `DATABASE_CONNECTION_URL` set to the **same** Atlas database URL you use on Render.

---

## Summary

| Part | Where | URL / Config |
|------|--------|--------------|
| Backend API | Render (Web Service) | e.g. `https://solvio-backend.onrender.com` |
| Frontend app | Vercel | e.g. `https://solvio.vercel.app` |
| Database | MongoDB Atlas | Connection string in Render env as `DATABASE_CONNECTION_URL` |

**Order of operations:**

1. Deploy **backend on Render** first and copy its URL.
2. Set **`VITE_BACKEND_URL`** on Vercel to that URL, then deploy the **frontend on Vercel**.
3. (Optional) Set **`FRONTEND_URL`** on Render to your Vercel URL for stricter CORS.

Never put real secrets in the repo; use environment variables in Render and Vercel only.

---

## Troubleshooting: "Failed to fetch jobs" on Vercel

This usually means the frontend cannot reach your backend. Fix in this order:

1. **Set `VITE_BACKEND_URL` on Vercel**  
   Project → **Settings** → **Environment Variables** → add `VITE_BACKEND_URL` = your Render backend URL (e.g. `https://solvio-backend.onrender.com`). No trailing slash.

2. **Redeploy the frontend**  
   Vite only reads env vars at **build time**. After adding or changing `VITE_BACKEND_URL`, trigger a new build: **Deployments** → ⋮ on the latest deployment → **Redeploy**. Wait for the build to finish.

3. **Confirm the backend is up**  
   Open your Render backend URL in a browser (e.g. `https://solvio-backend.onrender.com`). You should see something like "api is working". If Render’s free tier put the service to sleep, the first request may be slow; refresh and try again.

4. **Check CORS**  
   If the backend is up but the browser still blocks requests, add **FRONTEND_URL** on Render (backend env) and set it to your exact Vercel URL (e.g. `https://your-app.vercel.app`).
