/* ==========================================================================
   TaskFlow Storage Utility & Mock Data Seed
   ========================================================================== */

const STORAGE_KEYS = {
  THEME: 'taskflow_theme',
  TASKS: 'taskflow_tasks',
  USERS: 'taskflow_users',
  VIEW_MODE: 'taskflow_view_mode',
  MOCK_API_URL: 'taskflow_api_url',
  CURRENT_USER: 'taskflow_current_user'
};

export const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Alex Morgan',
    email: 'alex.morgan@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    department: 'Engineering',
    role: 'Lead Developer'
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah.chen@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    department: 'Product',
    role: 'Product Manager'
  },
  {
    id: 'u3',
    name: 'Marcus Vance',
    email: 'marcus.v@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    department: 'Design',
    role: 'UI/UX Designer'
  },
  {
    id: 'u4',
    name: 'Elena Rostova',
    email: 'elena.r@taskflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'QA & Testing',
    role: 'QA Automation Lead'
  }
];

export const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Architect REST API Service Layer',
    description: 'Build robust fetch wrapper supporting GET, POST, PUT, DELETE operations with fallback storage.',
    status: 'done',
    priority: 'high',
    assigneeId: 'u1',
    dueDate: '2026-08-05',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 't2',
    title: 'Implement Kanban Drag & Drop',
    description: 'Add HTML5 drag and drop event listeners to allow cards to be moved seamlessly between columns.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'u2',
    dueDate: '2026-08-08',
    createdAt: '2026-08-01T11:30:00Z'
  },
  {
    id: 't3',
    title: 'Design Dark Theme Token System',
    description: 'Define HSL color variables in variables.css and theme.css for light/dark mode persistence.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'u3',
    dueDate: '2026-08-04',
    createdAt: '2026-08-01T09:15:00Z'
  },
  {
    id: 't4',
    title: 'Add Toast Notification Manager',
    description: 'Create floating notifications for API success, validation errors, and deletion confirmations.',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'u1',
    dueDate: '2026-08-10',
    createdAt: '2026-08-01T12:00:00Z'
  },
  {
    id: 't5',
    title: 'Mobile Sidebar Drawer Navigation',
    description: 'Ensure smooth responsive drawer toggle for tablet and mobile viewports below 1024px.',
    status: 'todo',
    priority: 'low',
    assigneeId: 'u4',
    dueDate: '2026-08-12',
    createdAt: '2026-08-01T12:45:00Z'
  }
];

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignore storage write errors (e.g. private browsing storage quota)
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  initSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      this.set(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.set(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
  }
};

export { STORAGE_KEYS };
