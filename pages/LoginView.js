/* ==========================================================================
   TaskFlow Login View (Simulated Auth Page)
   ========================================================================== */

import { validateLoginForm } from '../utils/validators.js';
import { storage, STORAGE_KEYS, INITIAL_USERS } from '../utils/storage.js';

export class LoginView {
  constructor({ onLoginSuccess }) {
    this.onLoginSuccess = onLoginSuccess;
  }

  render() {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, var(--primary-100), var(--bg-app)); padding: 1.5rem;">
        <div class="card" style="width: 100%; max-width: 440px; padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);">
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="brand-icon" style="width: 3.25rem; height: 3.25rem; margin: 0 auto 1rem; border-radius: var(--radius-lg); font-size: 1.5rem;">
              ⚡
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">Welcome to TaskFlow</h1>
            <p style="font-size: var(--font-sm); color: var(--text-secondary); margin-top: 0.25rem;">Sign in to access your project workspace</p>
          </div>

          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input type="email" id="login-email" name="email" class="input" placeholder="alex.morgan@taskflow.io" value="alex.morgan@taskflow.io">
              <div class="form-error" id="login-error-email"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" id="login-password" name="password" class="input" placeholder="••••••••" value="demo123">
              <div class="form-error" id="login-error-password"></div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.75rem; font-size: var(--font-base);">
              Sign In to Workspace
            </button>
          </form>

          <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); text-align: center;">
            <p style="font-size: var(--font-xs); color: var(--text-tertiary); margin-bottom: 0.75rem;">Or log in as a demo user:</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-secondary demo-user-btn" data-id="u1" style="font-size: var(--font-xs); padding: 0.35rem 0.75rem;">
                Alex (Dev Lead)
              </button>
              <button class="btn btn-secondary demo-user-btn" data-id="u2" style="font-size: var(--font-xs); padding: 0.35rem 0.75rem;">
                Sarah (PM)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const form = container.querySelector('#login-form');
    const demoBtns = container.querySelectorAll('.demo-user-btn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;

        container.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
        container.querySelectorAll('.input').forEach((el) => el.classList.remove('error'));

        const validation = validateLoginForm(email, password);
        if (!validation.isValid) {
          Object.entries(validation.errors).forEach(([field, msg]) => {
            const errEl = container.querySelector(`#login-error-${field}`);
            const inputEl = container.querySelector(`[name="${field}"]`);
            if (errEl) errEl.textContent = msg;
            if (inputEl) inputEl.classList.add('error');
          });
          return;
        }

        const users = storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
        const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || users[0];
        storage.set(STORAGE_KEYS.CURRENT_USER, user);
        this.onLoginSuccess(user);
      });
    }

    demoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-id');
        const users = storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
        const user = users.find((u) => u.id === userId) || users[0];
        storage.set(STORAGE_KEYS.CURRENT_USER, user);
        this.onLoginSuccess(user);
      });
    });
  }
}
