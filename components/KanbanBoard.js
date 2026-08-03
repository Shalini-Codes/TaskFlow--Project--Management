/* ==========================================================================
   TaskFlow Kanban Board Component & HTML5 Drag & Drop Controller
   ========================================================================== */

import { formatDate, isOverdue } from '../utils/dateFormatter.js';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export class KanbanBoard {
  constructor({ users = [], onTaskMove, onEditTask, onDeleteTask }) {
    this.users = users;
    this.onTaskMove = onTaskMove;
    this.onEditTask = onEditTask;
    this.onDeleteTask = onDeleteTask;
    this.viewMode = 'kanban'; // 'kanban' or 'list'
    this.draggedTaskId = null;
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  getUser(userId) {
    return this.users.find((u) => u.id === userId) || { name: 'Unassigned', avatar: '' };
  }

  renderTaskCard(task) {
    const user = this.getUser(task.assigneeId);
    const overdue = isOverdue(task.dueDate, task.status);
    const initials = getInitials(user.name);
    const avatarUrl = (user.avatar && user.avatar.trim() && !user.avatar.includes('ui-avatars.com')) ? user.avatar.trim() : '';

    return `
      <div class="task-card" draggable="true" data-id="${task.id}" id="card-${task.id}">
        <div class="card-header">
          <span class="badge badge-priority-${task.priority}">${task.priority} priority</span>
          <div class="card-actions" style="display: flex; gap: 0.2rem;">
            <button class="btn-icon edit-task-btn" data-id="${task.id}" aria-label="Edit task" title="Edit task">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button class="btn-icon delete-task-btn" data-id="${task.id}" aria-label="Delete task" title="Delete task" style="color: var(--accent-rose);">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <h3 class="card-title">${task.title}</h3>
        ${task.description ? `<p class="card-description">${task.description}</p>` : ''}

        <div class="card-footer">
          <div class="card-due-date ${overdue ? 'overdue' : ''}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>${overdue ? 'Overdue: ' : ''}${formatDate(task.dueDate)}</span>
          </div>

          <div class="avatar" title="Assigned to ${user.name}" style="position: relative; overflow: hidden; background: var(--primary-100); color: var(--primary-700); font-weight: 700;">
            ${avatarUrl ? `
              <img src="${avatarUrl}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;position:absolute;inset:0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:var(--font-xs);">${initials}</span>
            ` : `
              <span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:var(--font-xs);">${initials}</span>
            `}
          </div>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="card empty-workspace-card" style="text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.25rem;">
        <div style="width: 4.5rem; height: 4.5rem; border-radius: 50%; background: var(--primary-100); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          ✨
        </div>
        <div style="max-width: 440px;">
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No tasks in your workspace</h2>
          <p style="font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6;">Your workspace is currently empty. Get started by creating your first task using the button below.</p>
        </div>
        <button id="empty-state-create-task-btn" class="btn btn-primary" style="padding: 0.75rem 1.75rem; font-size: var(--font-base); font-weight: 700;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          <span>Create Task</span>
        </button>
      </div>
    `;
  }

  renderKanbanView(tasks) {
    if (tasks.length === 0) return this.renderEmptyState();

    const columns = [
      { id: 'todo', title: 'To Do', icon: '📝' },
      { id: 'in_progress', title: 'In Progress', icon: '⚡' },
      { id: 'done', title: 'Done', icon: '✅' }
    ];

    return `
      <div class="kanban-board">
        ${columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return `
            <div class="kanban-column" data-status="${col.id}">
              <div class="column-header">
                <div class="column-title">
                  <span>${col.icon}</span>
                  <span>${col.title}</span>
                </div>
                <span class="column-count">${colTasks.length}</span>
              </div>
              <div class="task-list" data-status="${col.id}">
                ${colTasks.length > 0 ? colTasks.map((t) => this.renderTaskCard(t)).join('') : `
                  <div style="padding: 2rem 1rem; text-align: center; color: var(--text-tertiary); font-size: var(--font-xs); border: 2px dashed var(--border-light); border-radius: var(--radius-lg);">
                    No tasks in ${col.title}
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderListView(tasks) {
    if (tasks.length === 0) return this.renderEmptyState();

    return `
      <div class="task-table-wrapper">
        <table class="task-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map((task) => {
              const user = this.getUser(task.assigneeId);
              const overdue = isOverdue(task.dueDate, task.status);
              const initials = getInitials(user.name);
              const avatarUrl = (user.avatar && user.avatar.trim() && !user.avatar.includes('ui-avatars.com')) ? user.avatar.trim() : '';

              return `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${task.title}</div>
                    ${task.description ? `<div style="font-size: var(--font-xs); color: var(--text-tertiary);">${task.description.substring(0, 60)}...</div>` : ''}
                  </td>
                  <td><span class="badge badge-status-${task.status}">${task.status.replace('_', ' ')}</span></td>
                  <td><span class="badge badge-priority-${task.priority}">${task.priority}</span></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <div class="avatar" style="width: 24px; height: 24px; position: relative; overflow: hidden; background: var(--primary-100); color: var(--primary-700); font-weight: 700;">
                        ${avatarUrl ? `
                          <img src="${avatarUrl}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;position:absolute;inset:0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                          <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:var(--font-xs);">${initials}</span>
                        ` : `
                          <span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:var(--font-xs);">${initials}</span>
                        `}
                      </div>
                      <span style="font-size: var(--font-xs);">${user.name}</span>
                    </div>
                  </td>
                  <td class="${overdue ? 'overdue' : ''}" style="${overdue ? 'color: var(--accent-rose); font-weight: 600;' : ''}">
                    ${formatDate(task.dueDate)}
                  </td>
                  <td style="text-align: right;">
                    <button class="btn-icon edit-task-btn" data-id="${task.id}" aria-label="Edit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="btn-icon delete-task-btn" data-id="${task.id}" aria-label="Delete" style="color: var(--accent-rose);">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  render(tasks = []) {
    return this.viewMode === 'kanban' ? this.renderKanbanView(tasks) : this.renderListView(tasks);
  }

  bindEvents(container) {
    const emptyStateBtn = container.querySelector('#empty-state-create-task-btn');
    if (emptyStateBtn) {
      emptyStateBtn.addEventListener('click', () => {
        if (this.onEditTask) this.onEditTask(null);
      });
    }

    // Action Buttons (Edit & Delete)
    container.querySelectorAll('.edit-task-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.onEditTask(id);
      });
    });

    container.querySelectorAll('.delete-task-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.onDeleteTask(id);
      });
    });

    // HTML5 Drag & Drop Listeners (only active in Kanban mode)
    if (this.viewMode === 'kanban') {
      const cards = container.querySelectorAll('.task-card');
      const columns = container.querySelectorAll('.kanban-column');

      cards.forEach((card) => {
        card.addEventListener('dragstart', (e) => {
          this.draggedTaskId = card.getAttribute('data-id');
          card.classList.add('dragging');
          e.dataTransfer.setData('text/plain', this.draggedTaskId);
          e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
          this.draggedTaskId = null;
          columns.forEach((c) => c.classList.remove('drag-over'));
        });
      });

      columns.forEach((column) => {
        column.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', () => {
          column.classList.remove('drag-over');
        });

        column.addEventListener('drop', (e) => {
          e.preventDefault();
          column.classList.remove('drag-over');
          const targetStatus = column.getAttribute('data-status');
          const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;

          if (taskId && targetStatus) {
            this.onTaskMove(taskId, targetStatus);
          }
        });
      });
    }
  }
}
