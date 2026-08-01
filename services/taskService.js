/* ==========================================================================
   TaskFlow Task Service API Methods
   ========================================================================== */

import { api } from './api.js';

export const taskService = {
  async getTasks(filters = {}) {
    const tasks = await api.request('/tasks');
    
    // Apply client-side search and filtering
    return tasks.filter((task) => {
      // Search Title/Description
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status Filter
      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }

      // Priority Filter
      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      return true;
    });
  },

  async getTaskById(id) {
    return await api.request(`/tasks/${id}`);
  },

  async createTask(taskData) {
    return await api.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateTask(id, updateData) {
    return await api.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async deleteTask(id) {
    return await api.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};
