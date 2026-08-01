/* ==========================================================================
   TaskFlow Login View (Simulated Auth Page)
   ========================================================================== */

import { validateLoginForm } from '../utils/validators.js';
import { storage, STORAGE_KEYS, INITIAL_USERS } from '../utils/storage.js';
import { authService } from '../services/authService.js';
import { Toast } from '../components/Toast.js';

export class LoginView {
  constructor({ onLoginSuccess }) {
    this.onLoginSuccess = onLoginSuccess;
  }

  render() {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at top right, var(--primary-100), var(--bg-app)); padding: 1.5rem;">
        <div class="card" style="width: 100%; max-width: 440px; padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);">
          <div style="text-align: center; margin-bottom: 1.75rem;">
            <div class="brand-icon" style="width: 3.25rem; height: 3.25rem; margin: 0 auto 1rem; border-radius: var(--radius-lg); font-size: 1.5rem;">
              ⚡
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--text-primary);">Welcome to TaskFlow</h1>
            <p style="font-size: var(--font-sm); color: var(--text-secondary); margin-top: 0.25rem;">Sign in to access your project workspace</p>
          </div>

          <!-- Firebase Google Sign-In Button -->
          <button type="button" id="google-login-btn" class="btn btn-secondary" style="width: 100%; padding: 0.75rem; font-size: var(--font-sm); display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: 1px solid var(--border-light); margin-bottom: 1.25rem; background: var(--bg-surface); color: var(--text-primary); font-weight: 600;">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; color: var(--text-tertiary); font-size: var(--font-xs);">
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            <span>OR DEMO SIGN IN</span>
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
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

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.75rem; padding: 0.75rem; font-size: var(--font-base);">
              Sign In to Workspace
            </button>
          </form>

          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); text-align: center;">
            <p style="font-size: var(--font-xs); color: var(--text-tertiary); margin-bottom: 0.5rem;">Or log in as a demo user:</p>
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
    const googleBtn = container.querySelector('#google-login-btn');
    const form = container.querySelector('#login-form');
    const demoBtns = container.querySelectorAll('.demo-user-btn');

    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        try {
          googleBtn.disabled = true;
          googleBtn.style.opacity = '0.7';
          const user = await authService.loginWithGoogle();
          Toast.success(`Welcome back, ${user.name}!`);
          this.onLoginSuccess(user);
        } catch (err) {
          googleBtn.disabled = false;
          googleBtn.style.opacity = '1';
          Toast.error(err.message || 'Google Sign-In failed');
        }
      });
    }

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
