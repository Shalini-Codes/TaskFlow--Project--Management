/* ==========================================================================
   TaskFlow Tasks View (Kanban & List Workspace)
   ========================================================================== */

import { taskService } from '../services/taskService.js';
import { userService } from '../services/userService.js';
import { KanbanBoard } from '../components/KanbanBoard.js';
import { TaskModal } from '../components/TaskModal.js';
import { DeleteModal } from '../components/DeleteModal.js';
import { SkeletonLoader } from '../components/SkeletonLoader.js';
import { Toast } from '../components/Toast.js';
import { debounce } from '../utils/debounce.js';

export class TasksView {
  constructor() {
    this.tasks = [];
    this.users = [];
    this.isLoading = true;
    this.viewMode = 'kanban';
    this.filters = {
      search: '',
      status: 'all',
      priority: 'all'
    };

    this.kanbanBoard = null;
    this.taskModal = null;
    this.deleteModal = null;
  }

  async loadData() {
    this.isLoading = true;
    try {
      [this.tasks, this.users] = await Promise.all([
        taskService.getTasks(this.filters),
        userService.getUsers()
      ]);
    } catch (err) {
      Toast.error('Failed to load tasks from API');
    } finally {
      this.isLoading = false;
    }
  }

  async handleTaskMove(taskId, newStatus) {
    try {
      // Optimistic UI Update
      this.tasks = this.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      this.refreshBoard();

      await taskService.updateTask(taskId, { status: newStatus });
      Toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      Toast.error('Failed to update task status');
      await this.loadData();
      this.refreshBoard();
    }
  }

  async handleOpenTaskModal(task = null) {
    if (!this.users || this.users.length === 0) {
      try {
        this.users = await userService.getUsers();
      } catch (err) {
        console.error('Failed to load users for task modal:', err);
      }
    }

    this.taskModal = new TaskModal({
      users: this.users,
      onSave: async (formData, editId) => {
        if (editId) {
          await taskService.updateTask(editId, formData);
          Toast.success('Task updated successfully');
        } else {
          await taskService.createTask(formData);
          Toast.success('New task created');
        }
        await this.loadData();
        this.refreshBoard();
      }
    });
    this.taskModal.open(task);
  }

  handleOpenDeleteModal(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    this.deleteModal = new DeleteModal({
      onConfirm: async (id) => {
        await taskService.deleteTask(id);
        Toast.success('Task deleted');
        await this.loadData();
        this.refreshBoard();
      }
    });
    this.deleteModal.open(taskId, task.title);
  }

  refreshBoard() {
    const boardContainer = document.getElementById('kanban-board-container');
    if (!boardContainer) return;

    if (!this.kanbanBoard) {
      this.kanbanBoard = new KanbanBoard({
        users: this.users,
        onTaskMove: (id, status) => this.handleTaskMove(id, status),
        onEditTask: (id) => {
          const task = this.tasks.find((t) => t.id === id);
          this.handleOpenTaskModal(task);
        },
        onDeleteTask: (id) => this.handleOpenDeleteModal(id)
      });
    }

    this.kanbanBoard.setViewMode(this.viewMode);
    boardContainer.innerHTML = this.kanbanBoard.render(this.tasks);
    this.kanbanBoard.bindEvents(boardContainer);
  }

  render() {
    return `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Workspace Filter Controls Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1rem 1.25rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-xl);">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <!-- Status Filter -->
            <select id="filter-status" class="select" style="width: auto; padding-right: 2rem;">
              <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="todo" ${this.filters.status === 'todo' ? 'selected' : ''}>To Do</option>
              <option value="in_progress" ${this.filters.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
              <option value="done" ${this.filters.status === 'done' ? 'selected' : ''}>Done</option>
            </select>

            <!-- Priority Filter -->
            <select id="filter-priority" class="select" style="width: auto; padding-right: 2rem;">
              <option value="all" ${this.filters.priority === 'all' ? 'selected' : ''}>All Priorities</option>
              <option value="high" ${this.filters.priority === 'high' ? 'selected' : ''}>High Priority</option>
              <option value="medium" ${this.filters.priority === 'medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="low" ${this.filters.priority === 'low' ? 'selected' : ''}>Low Priority</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- View Mode Switcher -->
            <div style="display: flex; background: var(--bg-hover); padding: 0.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
              <button id="view-mode-kanban" class="btn-icon ${this.viewMode === 'kanban' ? 'active' : ''}" style="${this.viewMode === 'kanban' ? 'background:var(--bg-surface); box-shadow:var(--shadow-xs);' : ''}" title="Kanban Board View">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button id="view-mode-list" class="btn-icon ${this.viewMode === 'list' ? 'active' : ''}" style="${this.viewMode === 'list' ? 'background:var(--bg-surface); box-shadow:var(--shadow-xs);' : ''}" title="List Table View">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
              </button>
            </div>

            <!-- New Task Trigger -->
            <button id="tasks-create-btn" class="btn btn-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <!-- Board / Table View Root -->
        <div id="kanban-board-container">
          ${this.isLoading ? (this.viewMode === 'kanban' ? SkeletonLoader.renderKanbanSkeleton() : SkeletonLoader.renderTableSkeleton()) : ''}
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const statusSelect = container.querySelector('#filter-status');
    const prioritySelect = container.querySelector('#filter-priority');
    const kanbanBtn = container.querySelector('#view-mode-kanban');
    const listBtn = container.querySelector('#view-mode-list');
    const createBtn = container.querySelector('#tasks-create-btn');

    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        this.filters.status = e.target.value;
        await this.loadData();
        this.refreshBoard();
      });
    }

    if (prioritySelect) {
      prioritySelect.addEventListener('change', async (e) => {
        this.filters.priority = e.target.value;
        await this.loadData();
        this.refreshBoard();
      });
    }

    if (kanbanBtn) {
      kanbanBtn.addEventListener('click', () => {
        this.viewMode = 'kanban';
        this.refreshBoard();
      });
    }

    if (listBtn) {
      listBtn.addEventListener('click', () => {
        this.viewMode = 'list';
        this.refreshBoard();
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', () => this.handleOpenTaskModal());
    }

    // Render Board when view is populated
    if (!this.isLoading) {
      this.refreshBoard();
    }
  }

  setSearchQuery(query) {
    this.filters.search = query;
    const debouncedSearch = debounce(async () => {
      await this.loadData();
      this.refreshBoard();
    }, 250);
    debouncedSearch();
  }
}
