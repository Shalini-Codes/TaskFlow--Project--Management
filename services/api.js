/* ==========================================================================
   TaskFlow Unified REST API Service Layer
   ========================================================================== */

import { config } from './config.js';
import { storage, STORAGE_KEYS, INITIAL_USERS } from '../utils/storage.js';

class ApiService {
  constructor() {
    this.baseUrl = storage.get(STORAGE_KEYS.MOCK_API_URL) || config.mockApiBaseUrl || '';
  }

  setBaseUrl(url) {
    this.baseUrl = url ? url.trim().replace(/\/+$/, '') : '';
    storage.set(STORAGE_KEYS.MOCK_API_URL, this.baseUrl);
  }

  getBaseUrl() {
    return this.baseUrl || config.mockApiBaseUrl || '';
  }

  async request(endpoint, options = {}) {
    const activeBaseUrl = this.getBaseUrl();
    const cleanEndpoint = endpoint.split('?')[0];

    if (!activeBaseUrl) {
      if (cleanEndpoint.startsWith('/tasks')) {
        throw new Error('MockAPI Base URL is missing! Please add MOCK_API_BASE_URL in env.js or configure it in Account Settings.');
      }
      return this.handleUsersFallback(endpoint, options);
    }

    try {
      const response = await fetch(`${activeBaseUrl}${endpoint}`, {
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
      if (cleanEndpoint.startsWith('/users')) {
        // If users endpoint fails on remote API (e.g. users resource not created on MockAPI), fallback to static team members
        return this.handleUsersFallback(endpoint, options);
      }
      console.error(`MockAPI fetch failed for ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  handleUsersFallback(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const parts = endpoint.split('/').filter(Boolean);

    if (method === 'GET') {
      const users = storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
      if (parts.length === 2) {
        const user = users.find((u) => u.id === parts[1]);
        return user || { id: parts[1], name: 'Unassigned', avatar: '' };
      }
      return users;
    }
    return INITIAL_USERS;
  }
}

export const api = new ApiService();

