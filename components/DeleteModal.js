/* ==========================================================================
   TaskFlow Delete Confirmation Modal Component
   ========================================================================== */

export class DeleteModal {
  constructor({ onConfirm }) {
    this.onConfirm = onConfirm;
    this.modalEl = null;
    this.itemId = null;
    this.itemTitle = '';
    this.modalTitle = 'Delete Task';
    this.message = 'Are you sure you want to delete this task?';
    this.confirmText = 'Delete Task';
  }

  open(id, itemTitle, options = {}) {
    this.itemId = id;
    this.itemTitle = itemTitle;
    this.modalTitle = options.modalTitle || 'Delete Task';
    this.message = options.message || 'Are you sure you want to delete this task?';
    this.confirmText = options.confirmText || 'Delete Task';

    this.render();
    document.body.appendChild(this.modalEl);

    requestAnimationFrame(() => {
      this.modalEl.classList.add('active');
    });

    this.bindEvents();
  }

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('active');
    setTimeout(() => {
      if (this.modalEl && this.modalEl.parentNode) {
        this.modalEl.remove();
      }
      this.modalEl = null;
    }, 250);
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container" style="max-width: 440px;">
        <div class="modal-header">
          <h2 class="modal-title" style="color: var(--accent-rose); display: flex; align-items: center; gap: 0.5rem;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            ${this.modalTitle}
          </h2>
          <button type="button" class="btn-icon close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); font-size: var(--font-sm); margin-bottom: 0.5rem;">
            ${this.message}
          </p>
          <div style="background-color: var(--bg-hover); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: var(--font-sm); color: var(--text-primary); border-left: 3px solid var(--accent-rose);">
            "${this.itemTitle}"
          </div>
          <p style="color: var(--text-tertiary); font-size: var(--font-xs); margin-top: 0.75rem;">
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
          <button type="button" class="btn btn-danger confirm-btn">${this.confirmText}</button>
        </div>
      </div>
    `;

    this.modalEl = modal;
  }

  bindEvents() {
    const closeBtn = this.modalEl.querySelector('.close-btn');
    const cancelBtn = this.modalEl.querySelector('.cancel-btn');
    const confirmBtn = this.modalEl.querySelector('.confirm-btn');

    closeBtn.addEventListener('click', () => this.close());
    cancelBtn.addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Removing...';
      try {
        await this.onConfirm(this.itemId);
        this.close();
      } catch (err) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = this.confirmText;
      }
    });
  }
}
