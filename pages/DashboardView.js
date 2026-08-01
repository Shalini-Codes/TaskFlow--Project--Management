/* ==========================================================================
   TaskFlow Dashboard View Component
   ========================================================================== */

import { taskService } from '../services/taskService.js';
import { userService } from '../services/userService.js';
import { getRelativeTime, formatDate } from '../utils/dateFormatter.js';
import { Toast } from '../components/Toast.js';

export class DashboardView {
  constructor({ onNavigateToTasks, onOpenTaskModal }) {
    this.onNavigateToTasks = onNavigateToTasks;
    this.onOpenTaskModal = onOpenTaskModal;
    this.tasks = [];
    this.users = [];
    this.isLoading = true;
  }

  async loadData() {
    this.isLoading = true;
    try {
      [this.tasks, this.users] = await Promise.all([
        taskService.getTasks(),
        userService.getUsers()
      ]);
    } catch (err) {
      Toast.error('Failed to load dashboard metrics');
    } finally {
      this.isLoading = false;
    }
  }

  getUser(userId) {
    return this.users.find((u) => u.id === userId) || { name: 'Unassigned', avatar: '' };
  }

  render() {
    if (this.isLoading) {
      return `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            ${Array(4).fill(0).map(() => `
              <div class="card" style="height: 110px;">
                <div class="skeleton" style="height: 16px; width: 60%; margin-bottom: 1rem;"></div>
                <div class="skeleton" style="height: 32px; width: 40%;"></div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const totalTasks = this.tasks.length;
    const todoTasks = this.tasks.filter((t) => t.status === 'todo').length;
    const inProgressTasks = this.tasks.filter((t) => t.status === 'in_progress').length;
    const doneTasks = this.tasks.filter((t) => t.status === 'done').length;
    const highPriorityTasks = this.tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const recentTasks = [...this.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        <!-- Banner Header -->
        <div class="card" style="background: linear-gradient(135deg, var(--primary-600), var(--accent-purple)); color: #fff; padding: 1.75rem; border: none; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem;">Project Status Overview</h2>
            <p style="opacity: 0.9; font-size: var(--font-sm);">Tracking project velocity and upcoming deadlines</p>
          </div>
          <button id="dash-new-task-btn" class="btn" style="background: #ffffff; color: var(--primary-700); font-weight: 700;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            <span>Create New Task</span>
          </button>
        </div>

        <!-- Metric Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div class="card" style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: var(--primary-100); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              📋
            </div>
            <div>
              <div style="font-size: var(--font-xs); color: var(--text-secondary); font-weight: 600;">Total Tasks</div>
              <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${totalTasks}</div>
            </div>
          </div>

          <div class="card" style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: var(--status-in-progress-bg); color: var(--status-in-progress); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              ⚡
            </div>
            <div>
              <div style="font-size: var(--font-xs); color: var(--text-secondary); font-weight: 600;">In Progress</div>
              <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${inProgressTasks}</div>
            </div>
          </div>

          <div class="card" style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: var(--status-done-bg); color: var(--status-done); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              ✅
            </div>
            <div>
              <div style="font-size: var(--font-xs); color: var(--text-secondary); font-weight: 600;">Completed</div>
              <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${doneTasks}</div>
            </div>
          </div>

          <div class="card" style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: var(--radius-lg); background: var(--priority-high-bg); color: var(--priority-high); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              🚨
            </div>
            <div>
              <div style="font-size: var(--font-xs); color: var(--text-secondary); font-weight: 600;">High Priority Alerts</div>
              <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">${highPriorityTasks}</div>
            </div>
          </div>
        </div>

        <!-- Completion Progress & Recent Activity Split -->
        <div class="dashboard-split-grid">
          <!-- Completion Rate Card -->
          <div class="card">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Project Completion</h3>
            <div style="text-align: center; margin: 1.5rem 0;">
              <div style="font-family: var(--font-heading); font-size: 3rem; font-weight: 800; color: var(--primary-500);">${completionRate}%</div>
              <div style="font-size: var(--font-xs); color: var(--text-tertiary); margin-top: 0.2rem;">${doneTasks} of ${totalTasks} tasks resolved</div>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-hover); border-radius: var(--radius-full); overflow: hidden;">
              <div style="width: ${completionRate}%; height: 100%; background: linear-gradient(90deg, var(--primary-500), var(--accent-emerald)); border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
            </div>
          </div>

          <!-- Recent Activity Stream -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700;">Recent Task Feed</h3>
              <a href="#tasks" id="view-all-tasks-link" style="font-size: var(--font-xs); color: var(--primary-500); font-weight: 600;">View All Tasks →</a>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.875rem;">
              ${recentTasks.map((t) => {
                const user = this.getUser(t.assigneeId);
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-hover); border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="avatar" style="width: 32px; height: 32px;">
                        ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;">` : user.name.charAt(0)}
                      </div>
                      <div>
                        <div style="font-size: var(--font-sm); font-weight: 600; color: var(--text-primary);">${t.title}</div>
                        <div style="font-size: var(--font-xs); color: var(--text-tertiary);">Assigned to ${user.name} • ${getRelativeTime(t.createdAt)}</div>
                      </div>
                    </div>
                    <span class="badge badge-status-${t.status}">${t.status.replace('_', ' ')}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const newTaskBtn = container.querySelector('#dash-new-task-btn');
    const viewAllLink = container.querySelector('#view-all-tasks-link');

    if (newTaskBtn) {
      newTaskBtn.addEventListener('click', () => this.onOpenTaskModal());
    }

    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.onNavigateToTasks();
      });
    }
  }
}
