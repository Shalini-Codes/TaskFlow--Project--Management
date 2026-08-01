# TaskFlow – Project Management Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

**TaskFlow** is a lightweight, responsive, production-quality single-page application (SPA) project management dashboard modeled after modern engineering tools like Trello and Linear. It is built strictly using **vanilla HTML5, CSS3, and ES6 JavaScript modules** without external framework overhead.

The application features an interactive 3-column Kanban board with native HTML5 Drag & Drop, complete Task CRUD operations, real-time debounced search, status and priority filtering, dual view modes (Kanban Board vs. List Table), dark mode persistence, and a resilient API service layer with local storage fallbacks.

---

## ⚡ Main Features

- **Interactive Kanban Board**: 3-column layout (`To Do`, `In Progress`, `Done`) featuring native HTML5 Drag & Drop event handling for effortless task status updates.
- **Task CRUD Management**: Create, view, edit, and delete tasks using custom modal dialogs equipped with client-side form validation (title, description, status, priority, assignee, due date).
- **Dual View Modes**: Switch seamlessly between a visual **Kanban Board** and a structured **List View Table**.
- **Real-Time Search & Multi-Filtering**: Instant debounced search filtering by task title/description combined with status and priority dropdown filters.
- **Analytical Dashboard**: Overview cards tracking total tasks, in-progress velocity, completion rates, high-priority alerts, progress progress bar, and a recent task activity stream.
- **Team Member Directory**: Team directory grid displaying avatars, department tags, contact emails, and active workload assignment counters.
- **Persistent Dark Theme**: Smooth theme transition between Light and Dark mode using HSL design tokens, saved persistently in `localStorage`.
- **Resilient API Architecture**: Unified HTTP client supporting REST API integration (MockAPI.io standard) with an automatic offline fallback to `localStorage` and seeded mock data.
- **Simulated Auth & Profile Switcher**: Fast demo user switching between team member profiles (e.g. Alex Morgan - Dev Lead, Sarah Chen - Product Manager) with dynamic avatar and header updates.
- **Responsive Design**: Collapsible mobile drawer sidebar and dynamic layouts optimized for desktop, tablet, and mobile viewports.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic document structure, accessibility standards (a11y), native HTML5 Drag and Drop API.
- **CSS3**: Custom Properties (CSS Variables for HSL design tokens), CSS Grid, Flexbox, Glassmorphism (`backdrop-filter`), smooth keyframe animations, responsive media queries.
- **Vanilla JavaScript (ES6+ Modules)**: Modular file structure (`services`, `components`, `pages`, `utils`), client-side Single Page Application (SPA) hash routing, `async/await` fetch handler, and event delegation.

---

## 📂 Project Folder Structure

```
TaskFlow/
├── index.html                  # Main semantic HTML5 entry document
├── app.js                      # Main SPA router & application orchestrator
├── README.md                   # Project documentation
├── styles/
│   ├── variables.css           # HSL design tokens & CSS custom properties
│   ├── main.css                # Base CSS reset & app layout grid
│   ├── components.css          # Buttons, inputs, modals, toasts, card styles
│   ├── kanban.css              # Kanban columns, drag targets & list view
│   └── theme.css               # Light & Dark theme transition rules
├── services/
│   ├── api.js                  # Unified REST API service wrapper & fallback logic
│   ├── taskService.js          # Task domain API operations
│   └── userService.js          # User directory API operations
├── utils/
│   ├── debounce.js             # High-performance search input debouncing
│   ├── dateFormatter.js        # Relative/absolute date formatting & overdue checks
│   ├── validators.js           # Form validation functions
│   └── storage.js              # LocalStorage helper & initial seed data
├── components/
│   ├── Navbar.js               # Top header navigation bar & search
│   ├── Sidebar.js              # Navigation sidebar & mobile drawer
│   ├── KanbanBoard.js          # Kanban board & drag-and-drop controller
│   ├── TaskModal.js            # Task creation & editing modal dialog
│   ├── DeleteModal.js          # Deletion confirmation dialog
│   ├── Toast.js                # Notification manager (success/error/info/warning)
│   └── SkeletonLoader.js       # Animated loading placeholders
└── pages/
    ├── LoginView.js            # Simulated login page
    ├── DashboardView.js        # Analytics dashboard & recent activity
    ├── TasksView.js            # Tasks Kanban/List workspace page
    ├── TeamView.js             # Team member workload directory
    └── ProfileView.js          # User profile & endpoint configuration page
```

---

## 🚀 How to Run the Project Locally

No Node.js build step or bundler installation is required. You can serve the static files using any local web server:

### Method 1: Using Python (Recommended)
1. Open your terminal in the project directory:
   ```cmd
   cd c:\Users\A\OneDrive\Desktop\TaskFlow
   ```
2. Start Python's built-in HTTP server:
   ```cmd
   python -m http.server 8080
   ```
3. Open your browser and navigate to **`http://localhost:8080`**.

### Method 2: Using Node.js / npx
```cmd
npx http-server -p 8080
```

### Method 3: VS Code Live Server
1. Open the `TaskFlow` directory in VS Code.
2. Right-click [`index.html`](file:///c:/Users/A/OneDrive/Desktop/TaskFlow/index.html) and select **"Open with Live Server"**.

---

## 💻 Current Functionality & Architecture

- **Client-Side SPA Routing**: Uses clean URL hash routing (`#dashboard`, `#tasks`, `#team`, `#profile`, `#login`).
- **Data Persistence**: Data is stored and updated dynamically in browser `localStorage`.
- **MockAPI.io Connection (Optional)**: In **Settings & Profile**, users can enter a live MockAPI.io project URL (e.g. `https://64a123.mockapi.io/api/v1`) to route tasks and user requests to a live REST endpoint.
- **Simulated Auth**: The login page simulates user session switching for demo purposes. *(Note: Authentication is frontend-simulated for presentation and does not connect to a production backend auth service).*

---

## 📸 Screenshots

| Dashboard Overview | Kanban Workspace |
|:---:|:---:|
| ![Dashboard Overview](screenshots/dashboard.png) | ![Kanban Board](screenshots/tasks-board.png) |

| Team Directory | Dark Mode Theme |
|:---:|:---:|
| ![Team Directory](screenshots/team-directory.png) | ![Dark Mode](screenshots/dark-mode.png) |

---

## 🔮 Future Improvements

- [ ] **Production Backend Auth**: Integrate real backend authentication (Firebase Auth, Supabase Auth, or JWT with Node.js/Express).
- [ ] **Database Persistence**: Connect to a live production database (Cloud Firestore, PostgreSQL, or MongoDB).
- [ ] **Real-Time Collaboration**: Add WebSocket support (Socket.io) for live multi-user board updates.
- [ ] **Advanced Drag & Drop**: Enable custom vertical reordering of task cards within individual columns.
- [ ] **Subtasks & File Attachments**: Support checklist subtasks and document attachment uploads.

---

## ✍️ Author

**TaskFlow Developer**
- **GitHub**: [https://github.com/Shalini-Codes](https://github.com/Shalini-Codes)
- **Project Repository**: [Shalini-Codes/TaskFlow--Project--Management](https://github.com/Shalini-Codes/TaskFlow--Project--Management)

---

*Built with passion for clean code and frontend craftsmanship.*
