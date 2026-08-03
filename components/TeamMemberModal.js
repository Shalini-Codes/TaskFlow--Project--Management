/* ==========================================================================
   TaskFlow Team Member Modal Component (Create New Member)
   ========================================================================== */

import { userService } from '../services/userService.js';
import { Toast } from './Toast.js';

export class TeamMemberModal {
  constructor({ onSave }) {
    this.onSave = onSave;
    this.modalEl = null;
  }

  open() {
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
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Add Team Member</h2>
          <button type="button" class="btn-icon close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form id="team-member-form">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="member-name">Full Name <span style="color:var(--accent-rose)">*</span></label>
              <input type="text" id="member-name" name="name" class="input" placeholder="e.g. Emily Watson" required>
              <div class="form-error" id="error-member-name"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="member-email">Email Address <span style="color:var(--accent-rose)">*</span></label>
              <input type="email" id="member-email" name="email" class="input" placeholder="emily.watson@taskflow.io" required>
              <div class="form-error" id="error-member-email"></div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="member-role">Role / Job Title</label>
                <select id="member-role" name="role" class="select">
                  <option value="Lead Developer">Lead Developer</option>
                  <option value="Fullstack Engineer">Fullstack Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="QA Specialist">QA Specialist</option>
                  <option value="DevOps Lead">DevOps Lead</option>
                  <option value="Team Member" selected>Team Member</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="member-department">Department</label>
                <select id="member-department" name="department" class="select">
                  <option value="Engineering" selected>Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="QA & Testing">QA & Testing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="member-avatar">Profile Photo / Avatar URL <span style="font-weight:normal; color:var(--text-tertiary)">(Optional)</span></label>
              <input type="url" id="member-avatar" name="avatar" class="input" placeholder="https://images.unsplash.com/... or leave blank for auto avatar">
              <span style="font-size: var(--font-xs); color: var(--text-tertiary); margin-top: 0.25rem; display: block;">
                If left empty, an avatar will be generated automatically.
              </span>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary submit-btn">Add Team Member</button>
          </div>
        </form>
      </div>
    `;

    this.modalEl = modal;
  }

  bindEvents() {
    const closeBtn = this.modalEl.querySelector('.close-btn');
    const cancelBtn = this.modalEl.querySelector('.cancel-btn');
    const form = this.modalEl.querySelector('#team-member-form');

    closeBtn.addEventListener('click', () => this.close());
    cancelBtn.addEventListener('click', () => this.close());

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const role = form.role.value;
      const department = form.department.value;
      const avatarInput = form.avatar.value.trim();

      if (!name || !email) {
        Toast.error('Please enter name and email.');
        return;
      }

      const avatar = avatarInput || '';

      const submitBtn = form.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding...';

      try {
        const newMember = await userService.addUser({
          name,
          email,
          role,
          department,
          avatar
        });

        Toast.success(`Added ${newMember.name} to the team!`);
        if (this.onSave) await this.onSave(newMember);
        this.close();
      } catch (err) {
        Toast.error('Failed to add team member');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Team Member';
      }
    });
  }
}
