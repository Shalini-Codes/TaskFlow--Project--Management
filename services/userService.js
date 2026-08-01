/* ==========================================================================
   TaskFlow User Service API Methods
   ========================================================================== */

import { api } from './api.js';

export const userService = {
  async getUsers() {
    return await api.request('/users');
  },

  async getUserById(id) {
    return await api.request(`/users/${id}`);
  }
};
