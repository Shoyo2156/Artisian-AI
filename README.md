# Artisan AI

From Craft to Commerce, Powered by AI. This is a Smart India Hackathon 2026 project: an AI-powered virtual business manager for artisans.

The React frontend is already built. This repository now also includes a FastAPI + MySQL backend that matches the existing screens (login, product wizard, marketplace, buyer requests, analytics, profile, and notifications).

Demo AI endpoints return realistic placeholder data. They are **not** a trained ML model and they do **not** call Gemini/OpenAI yet.

## Frontend (already working)

**Prerequisites:** Node.js

Vite is configured to run on **port 3000**.

```cmd
npm install
npm run dev
```

Open http://localhost:3000

Demo login (pre-filled on the login screen):

- Mobile: `9876543210`
- Password: `artisan123`

## Backend setup (Windows CMD)

### 1. Create the MySQL database

Install MySQL if needed, start the MySQL service, then in MySQL:

```sql
CREATE DATABASE artisan_ai;
```

### 2. Configure environment

```cmd
cd backend
copy .env.example .env
```

Edit `backend\.env` and set your MySQL user/password:

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/artisan_ai
SECRET_KEY=change-this-secret
FRONTEND_ORIGIN=http://localhost:3000
```

Do not commit real secrets.

### 3. Create a virtual environment and install packages

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Start the API

From the `backend` folder, with the venv activated:

```cmd
uvicorn main:app --reload --port 8000
```

Then open:

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

On first start the app creates tables and seeds demo data:

- 1 artisan (Radha Devi)
- 6 products
- 3 buyer requests
- notifications

If MySQL is not running, the API logs a warning and uses a local SQLite file (`backend/artisan_ai.db`) so you can still open `/docs`. For the SIH demo, use MySQL.

Optional re-seed (only fills an empty database):

```cmd
python seed.py
```

## Run frontend + backend together

Terminal 1:

```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Terminal 2:

```cmd
npm run dev
```

The frontend calls `http://localhost:8000/api`. If the API is down, screens still use the built-in demo data so `npm run dev` keeps working.

## Useful API paths

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/products`
- `GET|PUT|DELETE /api/products/{id}`
- `POST /api/products/{id}/publish`
- `GET /api/marketplace?search=&category=&region=`
- `POST|GET /api/buyer-requests`
- `PATCH /api/buyer-requests/{id}/status`
- `GET /api/analytics/overview`
- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `GET|PUT /api/profile`
- `POST /api/uploads/product-image`
- `POST /api/pricing/recommend`
- `POST /api/ai/catalog` (demo)
- `POST /api/ai/story` (demo)
- `POST /api/ai/enhance-image` (demo)
- `POST /api/ai/transcribe` (demo)
