# MediTrack

MediTrack is a personal health-organization web application. It helps a user keep
track of their own medicines, doctor appointments, health records, and medical
documents in one place.

**MediTrack is a personal organization tool. It is not a diagnostic system and does
not give medical advice. Do not enter real, sensitive medical data while testing —
use fake/sample data.**

## Features

- **Authentication** — register, login, logout, JWT-protected routes, hashed passwords
- **Dashboard** — active medicine count, upcoming appointments, recent records, quick actions
- **Medicines** — add/edit/delete, dosage, frequency, time, instructions, start/end dates, active/inactive
- **Appointments** — add/edit/delete, doctor, specialty, date/time, location, notes, status
- **Health Records** — add/edit/delete, title, type, date, doctor, notes
- **Documents** — upload/view/delete files with stored metadata (name, type, size, date)
- **Profile & Settings** — basic account info and logout

Every piece of data is tied to the logged-in user's account. One user can never see
or modify another user's data.

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React (Vite), React Router, Axios, CSS |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB with Mongoose                |
| Authentication | JWT + bcryptjs                       |
| File uploads   | Multer (local disk storage, demo-only) |

## Project Structure

```
meditrack/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas (User, Medicine, Appointment, HealthRecord, Document)
│   ├── middleware/auth.js        # JWT auth middleware
│   ├── controllers/              # Business logic per feature
│   ├── routes/                   # Express route definitions
│   ├── uploads/                  # Uploaded document files (created at runtime)
│   ├── server.js                 # App entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Configured Axios instance
│   │   ├── context/AuthContext.jsx
│   │   ├── components/           # Layout, ProtectedRoute
│   │   ├── pages/                # Login, Register, Dashboard, Medicines, Appointments, HealthRecords, Documents, Profile, Settings
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── SETUP_GUIDE.md                # Step-by-step beginner instructions
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api`. Endpoints other than `/auth/register` and
`/auth/login` require an `Authorization: Bearer <token>` header.

| Method | Endpoint               | Description                       |
|--------|------------------------|------------------------------------|
| POST   | /auth/register         | Create a new account               |
| POST   | /auth/login            | Log in, returns a JWT              |
| GET    | /auth/me               | Get the logged-in user's profile   |
| GET    | /medicines              | List your medicines                |
| POST   | /medicines              | Add a medicine                     |
| PUT    | /medicines/:id          | Update a medicine                  |
| DELETE | /medicines/:id          | Delete a medicine                  |
| GET    | /appointments           | List your appointments             |
| POST   | /appointments           | Add an appointment                 |
| PUT    | /appointments/:id       | Update an appointment              |
| DELETE | /appointments/:id       | Delete an appointment              |
| GET    | /health-records         | List your health records           |
| POST   | /health-records         | Add a health record                |
| PUT    | /health-records/:id     | Update a health record             |
| DELETE | /health-records/:id     | Delete a health record             |
| GET    | /documents              | List your documents                |
| POST   | /documents              | Upload a document (multipart/form-data, field name `file`) |
| DELETE | /documents/:id          | Delete a document                  |

## Quick Start

See **SETUP_GUIDE.md** for full, beginner-friendly, step-by-step instructions
(including installing Node.js, MongoDB, Git, and pushing to GitHub).

Short version, once dependencies are installed:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env      # then edit .env with your own JWT_SECRET
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Team & Roles

This project is split so two people can build it independently and merge cleanly.

- **Person 1 — Frontend**: React pages, components, routing, forms, styling (everything in `frontend/`)
- **Person 2 — Backend**: Express server, MongoDB models, authentication, REST APIs (everything in `backend/`)
- **Person 3 (optional)**: Testing, integration, documentation, bug fixing, deployment

The app is fully functional with just Person 1 and Person 2. See `SETUP_GUIDE.md`
for the full breakdown and merge process.

## Security Notes (student-project level)

- Passwords are hashed with bcrypt before being stored — plain text passwords are
  never saved.
- Routes that read or change user data require a valid JWT.
- Every database query for medicines, appointments, records, and documents filters
  by the logged-in user's ID, and ownership is re-checked before update/delete.
- Secrets (`JWT_SECRET`, `MONGO_URI`) live in `.env` files, which are excluded from
  Git via `.gitignore`.
- This is a learning project. Do not use it to store real medical information.
