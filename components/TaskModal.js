/* ==========================================================================
   TaskFlow Task Modal Component (Create & Edit)
   ========================================================================== */

import { validateTaskForm } from '../utils/validators.js';

export class TaskModal {
  constructor({ users = [], onSave }) {
    this.users = users;
    this.onSave = onSave;
    this.task = null; // null for Create mode, object for Edit mode
    this.modalEl = null;
  }

  open(task = null) {
    this.task = task;
    this.render();
    document.body.appendChild(this.modalEl);

    // Trigger open animation
    requestAnimationFrame(() => {
      this.modalEl.classList.add('active');
    });

    this.bindEvents();
  }

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    setTimeout(() => {
      this.modalEl.remove();
      this.modalEl = null;
    }, 250);
  }

  render() {
    const isEdit = !!this.task;
    const title = isEdit ? 'Edit Task' : 'Create New Task';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button type="button" class="btn-icon close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form id="task-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="task-title">Title <span style="color:var(--accent-rose)">*</span></label>
              <input type="text" id="task-title" name="title" class="input" placeholder="e.g. Implement user authentication" value="${this.task?.title || ''}">
              <div class="form-error" id="error-title"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="task-description">Description</label>
              <textarea id="task-description" name="description" class="textarea" rows="3" placeholder="Provide additional details or subtasks...">${this.task?.description || ''}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="task-status">Status</label>
                <select id="task-status" name="status" class="select">
                  <option value="todo" ${this.task?.status === 'todo' ? 'selected' : ''}>To Do</option>
                  <option value="in_progress" ${this.task?.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                  <option value="done" ${this.task?.status === 'done' ? 'selected' : ''}>Done</option>
                </select>
                <div class="form-error" id="error-status"></div>
              </div>

              <div class="form-group">
                <label class="form-label" for="task-priority">Priority</label>
                <select id="task-priority" name="priority" class="select">
                  <option value="low" ${this.task?.priority === 'low' ? 'selected' : ''}>Low</option>
                  <option value="medium" ${this.task?.priority === 'medium' || !this.task ? 'selected' : ''}>Medium</option>
                  <option value="high" ${this.task?.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
                <div class="form-error" id="error-priority"></div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="task-assignee">Assignee</label>
                <select id="task-assignee" name="assigneeId" class="select">
                  ${this.users.map(u => `
                    <option value="${u.id}" ${this.task?.assigneeId === u.id ? 'selected' : ''}>${u.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="task-due-date">Due Date</label>
                <input type="date" id="task-due-date" name="dueDate" class="input" value="${this.task?.dueDate || ''}">
                <div class="form-error" id="error-dueDate"></div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary submit-btn">
              ${isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    `;

    this.modalEl = modal;
  }

  bindEvents() {
    const closeBtn = this.modalEl.querySelector('.close-btn');
    const cancelBtn = this.modalEl.querySelector('.cancel-btn');
    const form = this.modalEl.querySelector('#task-form');

    closeBtn.addEventListener('click', () => this.close());
    cancelBtn.addEventListener('click', () => this.close());
    
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        title: form.title.value,
        description: form.description.value,
        status: form.status.value,
        priority: form.priority.value,
        assigneeId: form.assigneeId.value,
        dueDate: form.dueDate.value
      };

      // Clear existing errors
      this.modalEl.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      this.modalEl.querySelectorAll('.input, .select').forEach(el => el.classList.remove('error'));

      const validation = validateTaskForm(formData);
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([field, msg]) => {
          const errEl = this.modalEl.querySelector(`#error-${field}`);
          const inputEl = this.modalEl.querySelector(`[name="${field}"]`);
          if (errEl) errEl.textContent = msg;
          if (inputEl) inputEl.classList.add('error');
        });
        return;
      }

      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        await this.onSave(formData, this.task?.id);
        this.close();
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = this.task ? 'Save Changes' : 'Create Task';
      }
    });
  }
}
