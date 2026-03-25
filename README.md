# JobTracker — Job Application Tracker

A modern, interactive single-page React web app for tracking job applications through your entire pipeline — from Applied to Offer. Supports **Google Sign-In** for cloud sync via Firebase.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28?logo=firebase)

## ✨ Features

- **Kanban Board** — Drag-and-drop cards between status columns (Applied → OA → Phone Screen → Technical → Onsite → Offer / Rejected / Ghosted)
- **Table View** — Sortable & filterable list with bulk status updates
- **Dashboard** — Stats cards, pie chart (status distribution), bar chart (applications over time)
- **Google Sign-In** — OAuth via Firebase to sync data across devices
- **Cloud Persistence** — Firestore stores your data so it's always available
- **Offline Mode** — Works without signing in using localStorage
- **Full CRUD** — Add, edit, delete applications via a slide-over form
- **Resume Upload** — Upload PDFs with inline preview
- **Job Description Storage** — Paste full JDs so you have them even if listings go down
- **Search & Filter** — By company/role, status, job type, and date range
- **Import / Export** — JSON and CSV export, JSON import
- **Dark Mode** — Toggle with system preference detection
- **Keyboard Shortcuts** — `N` new app, `/` focus search, `Esc` close modals
- **Follow-up Alerts** — Flags applications with no status change in 7+ days
- **Responsive** — Works on desktop and mobile

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Firebase Setup (for Cloud Sync)

To enable Google Sign-In and cloud data sync:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Sign-in method → **Google**
3. Create a **Firestore Database** (start in test mode)
4. Go to **Project Settings** → General → Your apps → Add a **Web app**
5. Copy the config values and create a `.env` file:

```bash
cp .env.example .env
```

Then fill in your values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000
```

> **Note:** The app works without Firebase config — just click "Continue without signing in" to use localStorage only.

## 📦 Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Firebase](https://firebase.google.com) | Auth (Google) + Firestore (cloud DB) |
| [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) | Drag-and-drop |
| [Recharts](https://recharts.org) | Charts (pie, bar) |
| [Lucide React](https://lucide.dev) | Icons |

## 🗂 Project Structure

```
src/
├── components/
│   ├── ApplicationModal.jsx   # Add/Edit form (slide-over)
│   ├── Dashboard.jsx          # Stats + charts
│   ├── FilterBar.jsx          # Search & filter controls
│   ├── JobDescriptionPanel.jsx# Full JD viewer
│   ├── KanbanBoard.jsx        # Drag-and-drop board
│   ├── LoginPage.jsx          # Google Sign-In page
│   ├── StatusBadge.jsx        # Color-coded status pill
│   └── TableView.jsx          # Sortable table + bulk actions
├── context/
│   ├── AuthContext.jsx        # Firebase Auth state
│   └── ApplicationContext.jsx # Global state + Firestore sync
├── utils/
│   ├── helpers.js             # ID gen, date math, import/export
│   └── firestoreAdapter.js    # Firestore CRUD operations
├── firebase.js                # Firebase config & initialization
├── constants.js               # Status enums, colors, defaults
├── App.jsx                    # App shell, nav, routing
├── main.jsx                   # Entry point + auth gate
└── index.css                  # Tailwind config + custom theme
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open new application form |
| `/` | Focus search bar |
| `Esc` | Close any open modal/panel |

## 📤 Data Portability

- **Export JSON** — Full data backup, re-importable
- **Export CSV** — Open in Excel/Google Sheets
- **Import JSON** — Restore from a previous export

## 📄 License

MIT
