/* ==========================================================================
   TaskFlow Profile & Settings View Component
   ========================================================================== */

import { storage, STORAGE_KEYS } from '../utils/storage.js';
import { api } from '../services/api.js';
import { Toast } from '../components/Toast.js';
import { authService } from '../services/authService.js';

export class ProfileView {
  constructor({ onThemeToggle }) {
    this.onThemeToggle = onThemeToggle;
  }

  getCurrentUser() {
    return authService.getCurrentUser() || {
      name: 'Alex Morgan',
      email: 'alex.morgan@taskflow.io',
      department: 'Engineering',
      role: 'Lead Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    };
  }

  render() {
    const currentUser = this.getCurrentUser();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = currentTheme === 'dark';
    const currentApiUrl = api.getBaseUrl();

    return `
      <div style="max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.75rem;">
        <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800;">User Profile & Settings</h2>

        <!-- Profile Details Card -->
        <div class="card" style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="avatar" style="width: 80px; height: 80px; border-radius: 50%;">
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700;">${currentUser.name}</h3>
            <p style="color: var(--primary-500); font-weight: 600; font-size: var(--font-sm);">${currentUser.role || 'Member'}</p>
            <p style="color: var(--text-tertiary); font-size: var(--font-xs); margin-top: 0.2rem;">${currentUser.email} • ${currentUser.department}</p>
          </div>
        </div>

        <!-- Preferences Form -->
        <div class="card">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem;">Workspace Preferences</h3>

          <!-- Dark Mode Toggle Row -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: var(--font-sm);">Appearance Theme</div>
              <div style="font-size: var(--font-xs); color: var(--text-tertiary);">Switch between Light and Dark interface modes</div>
            </div>
            <button id="profile-theme-btn" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem;">
              <span>${isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            </button>
          </div>

          <!-- MockAPI Configuration Row -->
          <form id="api-config-form" style="margin-top: 1.25rem;">
            <div class="form-group">
              <label class="form-label" for="mock-api-url">MockAPI.io Base Endpoint URL</label>
              <div style="font-size: var(--font-xs); color: var(--text-tertiary); margin-bottom: 0.4rem;">
                Enter your custom MockAPI project endpoint (e.g. <code>https://66xxxx.mockapi.io/api/v1</code>) for Task CRUD management.
              </div>
              <input type="url" id="mock-api-url" name="apiUrl" class="input" placeholder="https://66xxxx.mockapi.io/api/v1" value="${currentApiUrl}">
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">Save API Endpoint</button>
          </form>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const themeBtn = container.querySelector('#profile-theme-btn');
    const apiForm = container.querySelector('#api-config-form');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.onThemeToggle();
      });
    }

    if (apiForm) {
      apiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = apiForm.apiUrl.value;
        api.setBaseUrl(url);
        Toast.success(url ? 'MockAPI endpoint updated successfully!' : 'Cleared MockAPI URL');
      });
    }
  }

}
