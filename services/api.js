/* ==========================================================================
   TaskFlow Unified REST API Service Layer
   ========================================================================== */

import { storage, STORAGE_KEYS, INITIAL_TASKS, INITIAL_USERS } from '../utils/storage.js';

class ApiService {
  constructor() {
    storage.initSeedData();
    this.baseUrl = storage.get(STORAGE_KEYS.MOCK_API_URL, '');
  }

  setBaseUrl(url) {
    this.baseUrl = url ? url.trim().replace(/\/+$/, '') : '';
    storage.set(STORAGE_KEYS.MOCK_API_URL, this.baseUrl);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async request(endpoint, options = {}) {
    // If MockAPI base URL is set, try fetching remote REST API
    if (this.baseUrl) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        // Fallthrough to local fallback handling below
      }
    }

    // Local Storage Mock API Fallback implementation
    return this.handleLocalFallback(endpoint, options);
  }

  async handleLocalFallback(endpoint, options = {}) {
    // Simulate realistic 200ms network delay
    await new Promise((res) => setTimeout(res, 200));

    const method = (options.method || 'GET').toUpperCase();
    const cleanEndpoint = endpoint.split('?')[0];

    // TASKS Resource Routing
    if (cleanEndpoint.startsWith('/tasks')) {
      let tasks = storage.get(STORAGE_KEYS.TASKS, INITIAL_TASKS);
      const parts = cleanEndpoint.split('/').filter(Boolean);

      if (method === 'GET') {
        if (parts.length === 2) {
          // GET /tasks/:id
          const task = tasks.find((t) => t.id === parts[1]);
          if (!task) throw new Error('Task not found');
          return task;
        }
        return tasks;
      }

      if (method === 'POST') {
        // POST /tasks
        const body = JSON.parse(options.body || '{}');
        const newTask = {
          id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          title: body.title || 'Untitled Task',
          description: body.description || '',
          status: body.status || 'todo',
          priority: body.priority || 'medium',
          assigneeId: body.assigneeId || 'u1',
          dueDate: body.dueDate || '',
          createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        storage.set(STORAGE_KEYS.TASKS, tasks);
        return newTask;
      }

      if (method === 'PUT' || method === 'PATCH') {
        // PUT /tasks/:id
        const id = parts[1];
        const body = JSON.parse(options.body || '{}');
        let updatedTask = null;
        tasks = tasks.map((t) => {
          if (t.id === id) {
            updatedTask = { ...t, ...body };
            return updatedTask;
          }
          return t;
        });
        if (!updatedTask) throw new Error('Task not found for update');
        storage.set(STORAGE_KEYS.TASKS, tasks);
        return updatedTask;
      }

      if (method === 'DELETE') {
        // DELETE /tasks/:id
        const id = parts[1];
        tasks = tasks.filter((t) => t.id !== id);
        storage.set(STORAGE_KEYS.TASKS, tasks);
        return { success: true, id };
      }
    }

    // USERS Resource Routing
    if (cleanEndpoint.startsWith('/users')) {
      let users = storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
      const parts = cleanEndpoint.split('/').filter(Boolean);

      if (method === 'GET') {
        if (parts.length === 2) {
          const user = users.find((u) => u.id === parts[1]);
          if (!user) throw new Error('User not found');
          return user;
        }
        return users;
      }
    }

    throw new Error(`Unsupported Mock API route: ${method} ${endpoint}`);
  }
}

export const api = new ApiService();
