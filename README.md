# TaskFlow – Project Management Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

🚀 **Live Application**: [https://shalini-taskflow.netlify.app/](https://shalini-taskflow.netlify.app/)

**TaskFlow** is a Single Page Application (SPA) project management dashboard modeled after task tracking tools like Trello and Linear. Built using semantic HTML5, vanilla CSS3, ES6 JavaScript modules, **Firebase Authentication**, and **MockAPI REST API**, TaskFlow provides task management features including a native HTML5 drag-and-drop Kanban board.

---

## 🌟 Features

- **Task CRUD Operations**: Create, view, update, and delete tasks through modal forms and confirmation dialogs connected to a REST API.
- **Interactive Kanban Drag-and-Drop**: 3-column workflow board (`To Do`, `In Progress`, `Done`) utilizing the native HTML5 Drag and Drop API (`dragstart`, `dragover`, `dragleave`, `drop`) to change task status.
- **Dual Workspace Views**: Toggle between a visual **Kanban Board** and a structured **List Table View**.
- **Search & Filtering**: Real-time debounced search by task title or description, paired with status (`All`, `To Do`, `In Progress`, `Done`) and priority (`All`, `High`, `Medium`, `Low`) dropdown filters.
- **Dashboard Analytics**: Metrics overview calculating total task count, in-progress count, completed count, high-priority alerts, progress indicator, and a recent task feed.
- **Authentication**:
  - **Firebase Google OAuth**: Real Google popup authentication via Firebase Auth (`signInWithPopup`).
  - **Demo Account Sign-In**: Client-side demo login (Alex Morgan - Dev Lead, Sarah Chen - PM) utilizing `localStorage` for testing without Google credentials.
- **Team Workload Directory**: Team list view displaying user avatars, role, department, email, and active assigned task counts.
- **Persistent Light / Dark Theme**: HSL color variables supporting light/dark theme switching, stored in `localStorage`.
- **Responsive Mobile Layout**: Mobile drawer sidebar navigation, stacking form inputs, and responsive grid layouts for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags (`<main>`, `<aside>`, `<nav>`, `<header>`), accessibility attributes, and native Drag & Drop API.
- **CSS3**: Custom Properties (HSL design tokens), CSS Grid, Flexbox, Glassmorphism (`backdrop-filter`), keyframe animations, and media queries.
- **Vanilla JavaScript (ES6 Modules)**: Client-side hash router, `async/await` fetch handler, modular component structure, and event delegation.
- **Firebase Authentication**: Google OAuth popup authentication (`signInWithPopup`) and auth state listeners (`onAuthStateChanged`) via Firebase Web SDK v10.
- **MockAPI REST API**: Remote REST endpoint (`/tasks`) handling `GET`, `POST`, `PUT`, and `DELETE` requests.
- **Netlify**: Web hosting with automated environment variable injection during deployment (`generate-env.js`).

---

## 🏗️ Architecture & Project Structure

TaskFlow is organized into modular JavaScript files separating UI components, page views, API services, and utilities.

```
TaskFlow/
├── index.html                  # HTML5 entry file & DOM mount point
├── app.js                      # Application entrypoint & SPA hash router
├── generate-env.js             # Node script to inject Netlify build env vars into env.js
├── env.example.js              # Template for environment configuration
├── env.js                      # Generated or local environment variables
├── README.md                   # Project documentation
├── styles/
│   ├── variables.css           # CSS design tokens (HSL color variables)
│   ├── main.css                # Base CSS reset & layout structure
│   ├── components.css          # UI controls, buttons, forms, modals, toasts, cards
│   ├── kanban.css              # Kanban board layout, cards, & list view table
│   └── theme.css               # Light & Dark theme transition rules
├── services/
│   ├── api.js                  # HTTP request service client & fallback handler
│   ├── taskService.js          # REST API integration for task CRUD operations
│   ├── userService.js          # User directory retrieval service
│   ├── authService.js          # Firebase Auth integration & session management
│   ├── firebase.js             # Firebase Web SDK initialization
│   └── config.js               # Environment configuration reader
├── utils/
│   ├── debounce.js             # Input debouncing helper for search
│   ├── dateFormatter.js        # Date formatting, relative time, & overdue calculation
│   ├── validators.js           # Client-side form validation rules
│   └── storage.js              # LocalStorage helper & seed data fallbacks
├── components/
│   ├── Navbar.js               # Header navbar, search bar, & theme toggle
│   ├── Sidebar.js              # Navigation sidebar & mobile drawer controller
│   ├── KanbanBoard.js          # Kanban board & drag-and-drop controller
│   ├── TaskModal.js            # Task creation and edit modal component
│   ├── DeleteModal.js          # Deletion confirmation modal component
│   ├── Toast.js                # Toast notification system
│   └── SkeletonLoader.js       # Animated loading placeholders
└── pages/
    ├── LoginView.js            # Login page supporting Google Auth & demo sign-in
    ├── DashboardView.js        # Metrics overview & recent activity feed
    ├── TasksView.js            # Kanban and List workspace view
    ├── TeamView.js             # Team member directory & workload summary
    └── ProfileView.js          # User profile view & MockAPI URL configuration
```

---

## 💡 What I Implemented & Learned

Key technical implementation details and learnings from this project include:

- **Asynchronous REST API Integration**: Implemented an API service layer using `async/await` to handle `GET`, `POST`, `PUT`, and `DELETE` requests to MockAPI, complete with error catching and fallbacks.
- **Native Drag-and-Drop API**: Built a Kanban interface using HTML5 drag-and-drop events (`dragstart`, `dragover`, `dragleave`, `drop`) without relying on third-party drag-and-drop libraries.
- **Dual Authentication Flows**: Integrated real Firebase Authentication for Google OAuth sign-in while implementing a client-side `localStorage` session mechanism for quick demo access.
- **Modular Single Page Architecture**: Implemented custom hash-based routing and a modular component structure using native ES6 JavaScript modules.
- **CSS Design Token System**: Designed an adaptable UI using HSL CSS variables for theme management (light/dark mode) and responsive layout patterns.

---

## 💻 Local Setup Instructions

To run TaskFlow locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shalini-Codes/TaskFlow--Project--Management.git
   cd TaskFlow--Project--Management
   ```

2. **Set Up Environment Variables** (Optional for local testing):
   Copy `env.example.js` to `env.js` and insert your Firebase and MockAPI credentials:
   ```bash
   cp env.example.js env.js
   ```

3. **Serve the project locally**:
   - Using Python:
     ```bash
     python -m http.server 8080
     ```
   - Using Node.js (`http-server`):
     ```bash
     npx http-server -p 8080
     ```

4. **Open in browser**:
   Navigate to `http://localhost:8080`.

---

## ✍️ Author & Portfolio

**Shalini-Codes**
- **Live Application**: [https://shalini-taskflow.netlify.app/](https://shalini-taskflow.netlify.app/)
- **GitHub Profile**: [https://github.com/Shalini-Codes](https://github.com/Shalini-Codes)
- **Repository**: [https://github.com/Shalini-Codes/TaskFlow--Project--Management](https://github.com/Shalini-Codes/TaskFlow--Project--Management)
