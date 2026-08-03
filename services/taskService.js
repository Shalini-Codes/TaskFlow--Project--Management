/* ==========================================================================
   TaskFlow Task Service API - MockAPI.io REST Integration
   ========================================================================== */

import { api } from './api.js';
import { authService } from './authService.js';

export const taskService = {
  // Read / Query tasks from MockAPI REST API (GET /tasks)
  async getTasks(filters = {}) {
    const rawTasks = await api.request('/tasks', { method: 'GET' });

    if (!Array.isArray(rawTasks)) {
      return [];
    }

    const tasks = rawTasks.map((t, idx) => ({
      id: String(t.id != null ? t.id : (idx + 1)),
      title: t.title || 'Untitled Task',
      description: t.description || '',
      status: t.status || 'todo',
      priority: t.priority || 'medium',
      assigneeId: t.assigneeId || t.assignee || 'u1',
      dueDate: t.dueDate || new Date().toISOString().split('T')[0],
      createdAt: t.createdAt || new Date().toISOString(),
      userId: t.userId || ''
    }));


    // User Task Isolation: Scope tasks for authenticated users with a specific uid
    const currentUser = authService.getCurrentUser();
    const currentUserId = currentUser?.uid || currentUser?.id;
    const isDemoUser = !currentUser?.uid && (currentUserId === 'u1' || currentUserId === 'u2' || currentUserId === 'u3' || currentUserId === 'u4');

    const userTasks = tasks.filter(task => {
      if (isDemoUser) return true; // Demo accounts see pre-seeded workspace tasks
      if (currentUser?.uid) return task.userId === currentUser.uid;
      return true;
    });

    // Apply client-side search and status/priority filters
    return userTasks.filter((task) => {
      if (filters.search) {
        const qStr = filters.search.toLowerCase();
        const matchesTitle = (task.title || '').toLowerCase().includes(qStr);
        const matchesDesc = (task.description || '').toLowerCase().includes(qStr);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }

      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      return true;
    });
  },

  // Get single task by ID from MockAPI REST API (GET /tasks/:id)
  async getTaskById(id) {
    const data = await api.request(`/tasks/${id}`, { method: 'GET' });
    if (!data) return null;
    return {
      id: String(data.id),
      ...data,
      assigneeId: data.assigneeId || data.assignee || 'u1'
    };
  },

  // Create new task document via MockAPI REST API (POST /tasks)
  async createTask(taskData) {
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.uid || currentUser?.id || 'demo_user';

    const payload = {
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || taskData.assignee || 'u1',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      userId: userId
    };

    return await api.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Update existing task via MockAPI REST API (PUT /tasks/:id)
  async updateTask(id, updateData) {
    const payload = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updateData.assigneeId || updateData.assignee) {
      payload.assigneeId = updateData.assigneeId || updateData.assignee;
    }

    return await api.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  // Delete task via MockAPI REST API (DELETE /tasks/:id)
  async deleteTask(id) {
    await api.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
    return { success: true, id };
  }
};

