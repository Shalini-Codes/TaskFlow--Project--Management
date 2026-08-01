/* ==========================================================================
   TaskFlow Team View Component
   ========================================================================== */

import { userService } from '../services/userService.js';
import { taskService } from '../services/taskService.js';
import { Toast } from '../components/Toast.js';

export class TeamView {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.isLoading = true;
  }

  async loadData() {
    this.isLoading = true;
    try {
      [this.users, this.tasks] = await Promise.all([
        userService.getUsers(),
        taskService.getTasks()
      ]);
    } catch (err) {
      Toast.error('Failed to load team directory');
    } finally {
      this.isLoading = false;
    }
  }

  getAssignedTasksCount(userId) {
    return this.tasks.filter((t) => t.assigneeId === userId && t.status !== 'done').length;
  }

  render() {
    if (this.isLoading) {
      return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${Array(4).fill(0).map(() => `
            <div class="card" style="height: 180px;">
              <div class="skeleton" style="height: 48px; width: 48px; border-radius: 50%; margin-bottom: 1rem;"></div>
              <div class="skeleton" style="height: 18px; width: 60%; margin-bottom: 0.5rem;"></div>
              <div class="skeleton" style="height: 14px; width: 40%;"></div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Team Directory</h2>
            <p style="font-size: var(--font-sm); color: var(--text-secondary);">Active workspace contributors and workload distribution</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          ${this.users.map((user) => {
            const activeCount = this.getAssignedTasksCount(user.id);
            return `
              <div class="card" style="display: flex; flex-direction: column; gap: 1rem; position: relative;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <img src="${user.avatar}" alt="${user.name}" class="avatar" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover;">
                    <div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${user.name}</h3>
                      <span style="font-size: var(--font-xs); color: var(--primary-500); font-weight: 600;">${user.role || 'Team Member'}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.4rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: var(--font-xs); color: var(--text-secondary);">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    <span>Department: <strong>${user.department}</strong></span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: var(--font-xs); color: var(--text-secondary);">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <span>${user.email}</span>
                  </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); margin-top: auto;">
                  <span style="font-size: var(--font-xs); color: var(--text-tertiary);">Active Workload</span>
                  <span class="badge" style="background: var(--primary-100); color: var(--primary-700); font-weight: 700;">${activeCount} active task${activeCount === 1 ? '' : 's'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {}
}
