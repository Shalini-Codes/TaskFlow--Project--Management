# TaskFlow – Project Management Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

**TaskFlow** is an interactive, production-grade Single Page Application (SPA) project management dashboard modeled after modern engineering tools like Trello and Linear. Built purely with **semantic HTML5, modern vanilla CSS3, and ES6 JavaScript modules**, it operates without external framework dependencies or bundler overhead.

The application delivers a complete project workflow featuring a native HTML5 Drag & Drop Kanban board, full Task CRUD operations, real-time debounced search, status and priority filtering, dual workspace views (Kanban Board vs. List Table), dark mode persistence, and a responsive mobile drawer navigation system.

---

## 🌟 Key Features

- **Interactive Kanban Drag-and-Drop**: 3-column workflow board (`To Do`, `In Progress`, `Done`) utilizing the native HTML5 Drag and Drop API (`dragstart`, `dragover`, `dragleave`, `drop`) for instant status column updates.
- **Complete Task CRUD Operations**: Create, view, update, and delete tasks via custom modal dialogs equipped with client-side form validation (title, description, status, priority, assignee, due date).
- **Dual Workspace Views**: Switch seamlessly between a visual **Kanban Board** and a structured **List View Table**.
- **Real-Time Search & Multi-Filtering**: Instant debounced search filtering by task title/description paired with status (`All`, `To Do`, `In Progress`, `Done`) and priority (`All`, `High`, `Medium`, `Low`) dropdown filters.
- **Analytics Dashboard**: Real-time project completion rate, total tasks, in-progress velocity, high-priority alert cards, visual progress bar, and a recent task activity stream.
- **Team Workload Directory**: Team directory grid showcasing user avatars, department tags, contact emails, and active assigned workload counters.
- **Persistent Light / Dark Mode**: Custom HSL color token system supporting instant light/dark theme toggling saved in `localStorage`.
- **Fully Responsive Architecture**: Mobile drawer sidebar with backdrop blur overlay, auto-stacking form grids, and touch-friendly scroll wrappers optimized across mobile, tablet, laptop, and desktop viewports.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic elements (`<main>`, `<aside>`, `<nav>`, `<header>`), accessibility standards (a11y), native Drag & Drop API.
- **CSS3**: Custom Properties (CSS variables for HSL design tokens), CSS Grid, Flexbox, Glassmorphism (`backdrop-filter`), smooth keyframe transitions, responsive media queries.
- **Vanilla JavaScript (ES6 Modules)**: Client-side Single Page Application (SPA) hash routing, `async/await` fetch handler, event delegation, and modular state management.

---

## 🔐 Authentication & Data Storage Architecture

### Data Storage & REST API Service
- **Storage Layer**: Task and team data is stored locally in browser `localStorage` under keys `taskflow_tasks` and `taskflow_users`, initialized on boot with realistic seed data arrays ([`utils/storage.js`](file:///c:/Users/A/OneDrive/Desktop/TaskFlow/utils/storage.js)).
- **REST API Adapter**: Built with a unified HTTP service client ([`services/api.js`](file:///c:/Users/A/OneDrive/Desktop/TaskFlow/services/api.js)) supporting standard REST operations (`GET`, `POST`, `PUT`, `DELETE`). If a custom endpoint URL is provided in Settings (e.g. MockAPI.io), TaskFlow seamlessly routes requests to the remote REST API.

### Authentication System
- **Demo Session Auth**: Features a client-side demo authentication system with persistent session state stored in `localStorage.setItem('taskflow_current_user')`.
- **Demo Account Switching**: Users can log in as **Alex Morgan** (Lead Developer) or **Sarah Chen** (Product Manager). The top-right navbar pill, avatar, and settings view dynamically reflect the logged-in user's profile information.
- **Session Protection & Logout**: Unauthenticated route visits automatically redirect to `#login`. Clicking **Log Out** in the sidebar explicitly clears the session and returns to the login screen.

---

## 📱 Responsive Design

TaskFlow is fully audited and responsive across all device breakpoints:
- **Mobile (320px – 640px)**: Sidebar transitions to a slide-out drawer with a blurred backdrop overlay. Form inputs stack vertically, modals auto-fit within screen height boundaries, and mobile search/header typography scales down gracefully.
- **Tablet (641px – 1024px)**: Dashboard split grids stack vertically, and the Kanban board provides smooth touch scrolling (`-webkit-overflow-scrolling: touch`).
- **Laptop & Desktop (1025px+)**: Expanded multi-column grid layout with fixed sidebar navigation and high-density workspace views.

---

## 📂 Project Structure

```
TaskFlow/
├── index.html                  # Main semantic HTML5 entry document
├── app.js                      # Application bootstrapper & SPA router
├── README.md                   # Project documentation
├── styles/
│   ├── variables.css           # HSL color palette & design tokens
│   ├── main.css                # Base reset & app layout grid
│   ├── components.css          # Buttons, inputs, modals, toasts, cards
│   ├── kanban.css              # Kanban board, drag targets & table view
│   └── theme.css               # Light & Dark theme transition rules
├── services/
│   ├── api.js                  # Unified REST API service wrapper & fallback logic
│   ├── taskService.js          # Task domain API operations
│   └── userService.js          # User directory API operations
├── utils/
│   ├── debounce.js             # High-performance search input debouncing
│   ├── dateFormatter.js        # Relative/absolute date formatting & overdue checks
│   ├── validators.js           # Form validation rules
│   └── storage.js              # LocalStorage helper & initial seed data
├── components/
│   ├── Navbar.js               # Header navigation & search input
│   ├── Sidebar.js              # Responsive sidebar & mobile drawer
│   ├── KanbanBoard.js          # Kanban board & drag-and-drop controller
│   ├── TaskModal.js            # Task creation & editing modal dialog
│   ├── DeleteModal.js          # Deletion confirmation dialog
│   ├── Toast.js                # Notification manager (success/error/info/warning)
│   └── SkeletonLoader.js       # Animated loading placeholders
├── pages/
│   ├── LoginView.js            # Demo authentication page
│   ├── DashboardView.js        # Analytics dashboard & activity feed
│   ├── TasksView.js            # Tasks Kanban & List view workspace
│   ├── TeamView.js             # Team member workload directory
│   └── ProfileView.js          # Profile & endpoint settings page
└── screenshots/                # Application preview screenshots
    ├── dashboard.png
    ├── tasks-board.png
    ├── team-directory.png
    └── dark-mode.png
```

---

## 💻 Installation & Setup Instructions

No Node.js compilation, npm installation, or build tools are required. You can run TaskFlow locally using any HTTP server:

### Option 1: Using Python (Recommended)
1. Open your terminal in the project directory:
   ```cmd
   cd c:\Users\A\OneDrive\Desktop\TaskFlow
   ```
2. Start Python's built-in HTTP server:
   ```cmd
   python -m http.server 8080
   ```
3. Open your web browser and navigate to **`http://localhost:8080`**.

### Option 2: Using Node.js / npx
```cmd
npx http-server -p 8080
```

### Option 3: VS Code Live Server
1. Open the [`TaskFlow`](file:///c:/Users/A/OneDrive/Desktop/TaskFlow) folder in VS Code.
2. Right-click [`index.html`](file:///c:/Users/A/OneDrive/Desktop/TaskFlow/index.html) and select **"Open with Live Server"**.

---

## 📖 Usage Guide

1. **Sign In**: On the login page, click **Alex (Dev Lead)** or **Sarah (PM)** to sign in.
2. **Dashboard**: View overall project completion velocity, total task statistics, and recent activity updates.
3. **Kanban Workspace**:
   - Drag and drop task cards between **To Do**, **In Progress**, and **Done** columns.
   - Click **"+ Add Task"** to create a new task.
   - Click the pencil or trash icons on any card to edit or delete the task.
   - Use the view toggle to switch between **Kanban Board** and **List Table**.
4. **Search & Filter**: Type keywords into the header search bar or use the **Status** and **Priority** dropdown filters.
5. **Team Directory**: View team members, department tags, contact emails, and active assigned workloads.
6. **Dark Mode**: Click the Sun/Moon icon in the top header to toggle between light and dark themes.

---

## 🌐 Deployment

TaskFlow is optimized for zero-configuration deployment on **GitHub Pages**:

1. Push your repository to GitHub:
   ```cmd
   git add .
   git commit -m "Deploy production-ready TaskFlow application"
   git push origin main
   ```
2. Navigate to your repository on GitHub ➔ **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.
5. Your app will be live at `https://<your-username>.github.io/<repository-name>/`.

---

## 📸 Screenshots

| Dashboard Overview | Kanban Workspace |
|:---:|:---:|
| ![Dashboard Overview](screenshots/dashboard.png) | ![Kanban Workspace](screenshots/tasks-board.png) |

| Team Directory | Dark Mode Theme |
|:---:|:---:|
| ![Team Directory](screenshots/team-directory.png) | ![Dark Mode Theme](screenshots/dark-mode.png) |

---

## ✍️ Author & Portfolio

**Shalini-Codes**
- **GitHub**: [https://github.com/Shalini-Codes](https://github.com/Shalini-Codes)
- **Repository**: [Shalini-Codes/TaskFlow--Project--Management](https://github.com/Shalini-Codes/TaskFlow--Project--Management)

---

*Crafted with precision, clean modular architecture, and modern web engineering best practices.*
