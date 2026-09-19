# MediTrack — Complete Beginner Setup Guide

This guide assumes you know nothing about terminals, Git, or servers. Follow it
top to bottom. Every step tells you **WHERE** to do it, **DO THIS** (exact
command/action), **EXPECTED RESULT**, and **IF IT FAILS**.

All the project code has already been written for you (in the `meditrack/`
folder). This guide is about installing the tools, running the code, and putting
it on GitHub.

---

## Stage 0 — Install the required tools

### 0.1 Install Node.js (runs the backend and builds the frontend)

**WHERE:** Your computer's web browser.

**DO THIS:** Go to https://nodejs.org and download the **LTS** version for your
operating system. Run the installer, click Next through all steps, accept
defaults.

**EXPECTED RESULT:** Node.js is installed.

**Verify it:**

**WHERE:** Terminal (Git Bash on Windows, Terminal on Mac).

**DO THIS:**
```bash
node -v
npm -v
```

**EXPECTED RESULT:** Two version numbers print, e.g. `v20.11.0` and `10.2.4`.

**IF IT FAILS:** "command not found" → restart your terminal/computer after
installing (Node needs to update your system PATH). If it still fails, reinstall
Node and make sure "Add to PATH" was checked during install.

### 0.2 Install Git

**WHERE:** Browser.

**DO THIS:** Download from https://git-scm.com/downloads and install with
default options. On Windows this also installs **Git Bash**, which is the
terminal you'll use for all commands below.

**Verify it:**

**WHERE:** Git Bash / Terminal.

**DO THIS:**
```bash
git --version
```

**EXPECTED RESULT:** Something like `git version 2.44.0`.

**IF IT FAILS:** Restart your terminal. Reinstall if the command still isn't found.

### 0.3 Create a GitHub account

**WHERE:** Browser.

**DO THIS:** Go to https://github.com and sign up if you don't have an account.

### 0.4 Install MongoDB

You have two options. **Option A (recommended for beginners) needs no local
installation.**

#### Option A — MongoDB Atlas (free cloud database)

**WHERE:** Browser.

**DO THIS:**
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free "M0" cluster (accept all defaults, pick any cloud region close to you).
3. When prompted, create a database user: choose a username and password
   (write the password down — you'll need it soon).
4. Under "Network Access," click "Add IP Address" → "Allow access from anywhere"
   (`0.0.0.0/0`). This is fine for a student project.
5. Click "Connect" on your cluster → "Drivers" → copy the connection string.
   It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the ones you created, and add a
   database name before the `?`, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/meditrack?retryWrites=true&w=majority
   ```
   **This full string is your `MONGO_URI`.** You'll paste it into a `.env` file
   in Stage 2.

**EXPECTED RESULT:** You have a connection string that starts with `mongodb+srv://`.

**IF IT FAILS:** "Authentication failed" later on usually means the password in
the connection string is wrong, or has special characters that need URL-encoding
(e.g. `@` becomes `%40`). Simplest fix: create a new database user with a
simple alphanumeric password.

#### Option B — Install MongoDB locally

**WHERE:** Browser, then Terminal.

**DO THIS:** Download MongoDB Community Server from
https://www.mongodb.com/try/download/community, install with defaults (it
installs as a background service on Windows/Mac automatically).

**Your `MONGO_URI` in this case is:**
```
mongodb://127.0.0.1:27017/meditrack
```

**IF IT FAILS:** "ECONNREFUSED" when starting the backend later means MongoDB
isn't running — on Windows, search "Services", find "MongoDB Server", right
click → Start. On Mac, run `brew services start mongodb-community`.

---

## Stage 1 — Get the project onto your computer

If you already have the `meditrack` folder (downloaded from this chat), skip to
Stage 2 and just note its location. Otherwise, once it's pushed to GitHub, this
is how a teammate would download it:

**WHERE:** Terminal, inside the folder where you keep your projects (e.g. `Desktop`).

**DO THIS:**
```bash
cd Desktop
git clone https://github.com/YOUR_USERNAME/meditrack.git
cd meditrack
```

**EXPECTED RESULT:** A `meditrack` folder appears containing `backend/` and `frontend/`.

---

## Stage 2 — Configure and run the backend

**WHERE:** Terminal.

**DO THIS:**
```bash
cd meditrack/backend
npm install
```

**EXPECTED RESULT:** A `node_modules` folder is created and you see a summary
like "added 90 packages".

**IF IT FAILS:** "npm not found" → Node.js isn't installed correctly, redo Stage 0.1.

### Create your `.env` file

**WHERE:** Inside `meditrack/backend/`, using any text editor (VS Code, Notepad, etc.)
or the terminal.

**DO THIS (terminal method):**
```bash
cp .env.example .env
```
Then open the new `.env` file in a text editor and fill in real values:

**PASTE THIS (edit the values, don't paste as-is):**
```
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/meditrack?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_you_make_up_yourself
```

- `MONGO_URI` — paste the connection string you got in Stage 0.4.
- `JWT_SECRET` — type any long, random string (e.g. mash your keyboard for 40
  characters). This is used to sign login tokens; it must stay secret and
  should never be committed to GitHub.

**EXPECTED RESULT:** A `.env` file exists in `backend/` with your real values.

### Start the backend server

**WHERE:** Terminal, inside `meditrack/backend/`.

**DO THIS:**
```bash
npm run dev
```

**EXPECTED RESULT:** You see:
```
MongoDB connected
MediTrack API server running on port 5000
```
Leave this terminal window open and running.

**IF IT FAILS:**
- `MongoDB connection error` → double-check `MONGO_URI` in `.env` (see Stage 0.4 troubleshooting).
- `Error: Cannot find module 'express'` → you skipped `npm install`; run it.
- `EADDRINUSE: port 5000 already in use` → another program is using port 5000.
  Change `PORT=5000` to `PORT=5001` in `.env`, and update `VITE_API_URL` in the
  frontend `.env` (Stage 3) to match.

### Quick manual test of the backend

**WHERE:** Browser.

**DO THIS:** Visit http://localhost:5000/api/health

**EXPECTED RESULT:** You see JSON like `{"status":"ok","message":"MediTrack API is running"}`.

---

## Stage 3 — Configure and run the frontend

**WHERE:** Open a **second, new** terminal window (keep the backend one running).

**DO THIS:**
```bash
cd meditrack/frontend
npm install
```

**EXPECTED RESULT:** `node_modules` created, packages installed.

**Create the `.env` file:**

**DO THIS:**
```bash
cp .env.example .env
```
The default value is already correct for local development:
```
VITE_API_URL=http://localhost:5000/api
```
(Only change this if you changed the backend's `PORT` above.)

**Start the frontend:**

**DO THIS:**
```bash
npm run dev
```

**EXPECTED RESULT:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**IF IT FAILS:**
- `'vite' is not recognized` → run `npm install` again inside `frontend/`.
- Blank white page in browser → open the browser console (F12) and check for a
  red error; it's almost always a typo'd import path.

### Test the whole app end-to-end

**WHERE:** Browser.

**DO THIS:** Visit http://localhost:5173, click "Register", create a fake
account (fake name/email, any password 6+ characters), and you should land on
the Dashboard. Try adding a medicine, an appointment, and a health record.

**EXPECTED RESULT:** Data you add appears in the tables immediately, and
persists after refreshing the page (it's saved in MongoDB).

**IF IT FAILS:** "Network Error" in the browser → the backend isn't running or
`VITE_API_URL` doesn't match the backend's actual port. Check both terminals.

---

## Stage 4 — Push the project to GitHub

### 4.1 Create the repository on GitHub

**WHERE:** Browser, on github.com.

**DO THIS:** Click the "+" icon (top right) → "New repository". Name it
`meditrack`. Leave it public or private, your choice. **Do NOT** check "Add a
README" (you already have one). Click "Create repository". Keep this page open
— it shows the commands you'll need next.

### 4.2 Initialize Git locally and push

**WHERE:** Terminal, inside the root `meditrack/` folder (the one containing
both `backend/` and `frontend/`).

**DO THIS (run one line at a time):**
```bash
cd meditrack
git init
git add .
git commit -m "Initial commit: MediTrack full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meditrack.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your actual GitHub username. GitHub will prompt
you to sign in the first time (usually via a browser popup).

**EXPECTED RESULT:** Terminal shows upload progress, then something like
`branch 'main' set up to track 'origin/main'`. Refresh the GitHub repository
page in your browser — your files now appear there.

**IF IT FAILS:**
- `fatal: not a git repository` → you're in the wrong folder; `cd` into `meditrack/` first.
- `remote origin already exists` → run `git remote remove origin` then repeat the `git remote add origin ...` line.
- `Support for password authentication was removed` → GitHub needs a Personal
  Access Token instead of your password, or use the GitHub Desktop app / `gh auth login` (via GitHub CLI) to sign in.
- `.env` files show up on GitHub → **stop and fix this immediately**: delete
  the repo file via `git rm --cached backend/.env frontend/.env`, confirm
  `.env` is listed in both `.gitignore` files, commit, and push again. Then
  rotate your `JWT_SECRET` and Mongo password since they were exposed.

### 4.3 Everyday Git workflow (for ongoing changes)

**WHERE:** Terminal, inside `meditrack/`.

**DO THIS**, every time you make changes you want saved:
```bash
git add .
git commit -m "Describe what you changed"
git push
```

**EXPECTED RESULT:** Changes appear on GitHub after `git push`.

---

## Stage 5 — Two-person (or three-person) team workflow

### Roles

**Person 1 — Frontend** works only inside `frontend/`: pages, components,
forms, styling, routing.

**Person 2 — Backend** works only inside `backend/`: models, controllers,
routes, authentication, database.

**Person 3 (optional)** — testing, writing documentation, finding and reporting
bugs, and handling deployment (Stage 6). **The app is 100% complete and usable
with just Person 1 and Person 2** — Person 3 makes it more polished but isn't
required.

### How they work together without conflicts

**WHERE:** Both people work from the same GitHub repository, each using their
own branch.

**DO THIS (each person, in their own terminal):**
```bash
git clone https://github.com/YOUR_USERNAME/meditrack.git
cd meditrack
git checkout -b frontend-work     # Person 1
git checkout -b backend-work      # Person 2
```

Each person commits and pushes their own branch:
```bash
git add .
git commit -m "Add appointment form validation"
git push -u origin frontend-work
```

### Merging the work

**WHERE:** GitHub website.

**DO THIS:** Once a person's part is working, they open a "Pull Request" on
GitHub from their branch into `main`, and the other teammate reviews and clicks
"Merge". Because the frontend only touches files in `frontend/` and the
backend only touches files in `backend/`, there's almost never a conflict.

**EXPECTED RESULT:** `main` on GitHub contains both people's finished work.

**IF IT FAILS:** If GitHub shows a merge conflict, it means both people edited
the exact same lines of the exact same file (rare with this folder split).
Open the flagged file, GitHub will show `<<<<<<<` markers around the
conflicting lines — manually pick which version to keep, delete the markers,
then commit again.

---

## Stage 6 — Testing checklist

Go through this list manually before considering the project "done":

- [ ] Can register a new account
- [ ] Can't register with an email that's already used (shows an error)
- [ ] Can log in with correct credentials
- [ ] Can't log in with wrong password (shows an error)
- [ ] Refreshing the page keeps you logged in
- [ ] Logging out and trying to visit `/` redirects to `/login`
- [ ] Can add, edit, and delete a medicine
- [ ] Marking a medicine inactive updates its badge and the dashboard count
- [ ] Can add, edit, and delete an appointment
- [ ] Changing appointment status updates its badge
- [ ] Can add, edit, and delete a health record
- [ ] Dashboard "Recent Health Records" table updates after adding a record
- [ ] Can upload a document and see it listed with correct name/size/date
- [ ] Can open an uploaded document via its "View" link
- [ ] Can delete a document
- [ ] Creating a second account and confirming it does NOT see the first
      account's medicines/appointments/records/documents
- [ ] App looks usable on a narrow (mobile-width) browser window

---

## Stage 7 — Common errors and fixes (reference)

| Error | Likely Cause | Fix |
|---|---|---|
| `MongoDB connection error` | Wrong `MONGO_URI` or DB not running | Recheck `.env`; for Atlas, check IP allowlist and password |
| `Not authorized, no token` | Frontend request missing JWT | Make sure you're logged in; check `localStorage` has `meditrack_token` |
| `Not authorized, token failed` | Token expired or `JWT_SECRET` changed | Log out and log back in |
| `Network Error` in browser | Backend not running, or wrong port in `VITE_API_URL` | Confirm backend terminal is running and ports match |
| `CORS` error in browser console | Backend `cors()` missing or backend not restarted | Confirm `app.use(cors())` is in `server.js`; restart backend |
| Blank page after `npm run dev` | JS error in a component | Open browser DevTools console (F12), fix the reported file/line |
| `EADDRINUSE` | Something already using that port | Change `PORT` in backend `.env` (and matching frontend `VITE_API_URL`) |
| Upload fails with 400 | No file selected, or file over 5MB | Pick a smaller file; the demo limit is 5MB |

---

## Stage 8 — Deployment (optional, if you want a live link)

This is optional and not required for grading a student project, but here's the
simplest practical path:

### Backend → Render.com (free tier)

**WHERE:** Browser, https://render.com

**DO THIS:**
1. Sign up, click "New" → "Web Service", connect your GitHub `meditrack` repo.
2. Set "Root Directory" to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables in Render's dashboard: `MONGO_URI`, `JWT_SECRET`,
   `PORT` (Render sets its own `PORT` automatically — you can leave yours as a
   fallback since `server.js` uses `process.env.PORT || 5000`).
5. Deploy. Render gives you a URL like `https://meditrack-backend.onrender.com`.

**IF IT FAILS:** Check Render's build/deploy logs tab — it shows the same
error messages you'd see locally.

### Frontend → Vercel or Netlify (free tier)

**WHERE:** Browser, https://vercel.com (or netlify.com)

**DO THIS:**
1. Sign up, "Add New Project", import your `meditrack` GitHub repo.
2. Set "Root Directory" to `frontend`.
3. Build command: `npm run build`. Output directory: `dist`.
4. Add environment variable `VITE_API_URL` = your Render backend URL + `/api`
   (e.g. `https://meditrack-backend.onrender.com/api`).
5. Deploy.

**EXPECTED RESULT:** A live URL like `https://meditrack.vercel.app` that works
from any device.

**IF IT FAILS:** "Network Error" on the live site usually means `VITE_API_URL`
wasn't set correctly, or the backend's CORS needs to allow your frontend's
domain — for a student project, the wide-open `cors()` in `server.js` already
allows this.

---

## Stage 9 — Talking points for a college presentation

- **Problem it solves:** People forget medicine schedules, appointment details,
  and lose track of health documents scattered across paper and phone photos.
  MediTrack centralizes all of it in one simple, secure, personal dashboard.
- **Architecture:** A classic three-tier MERN-style stack — React frontend
  talks to an Express REST API, which reads/writes a MongoDB database via
  Mongoose models.
- **Security:** Passwords are never stored in plain text (bcrypt hashing);
  every request to protected data is authenticated with a JWT; every database
  query is scoped to the logged-in user so no one can see another user's data.
- **What each person built:** (fill in with your own contributions, see below)
- **Limitations acknowledged honestly:** This is a demo/learning project — file
  uploads are stored on local disk rather than a production file store, there's
  no email verification or password reset flow, and it should not be used to
  store real medical information.
- **Possible future work:** password reset via email, medicine reminder
  notifications, calendar sync for appointments, exporting records as PDF.

### Contribution summary template

Fill this in honestly based on who did what:

- **Person 1 (Frontend):** Built all React pages and components in
  `frontend/src`, implemented routing and protected routes, built the
  dashboard, forms, and tables for medicines/appointments/records/documents,
  and wrote the application's CSS/responsive layout.
- **Person 2 (Backend):** Designed the MongoDB schemas in `backend/models`,
  built JWT authentication and password hashing, wrote all REST API
  controllers and routes with per-user ownership checks, and set up the Express
  server and file upload handling.
- **Person 3 (optional):** Tested the full app against the Stage 6 checklist,
  wrote/edited this documentation, and handled deployment to Render/Vercel.
