/* ==========================================================================
   TaskFlow Navbar Component
   ========================================================================== */

import { storage, STORAGE_KEYS } from '../utils/storage.js';

export class Navbar {
  constructor({ onThemeToggle, onMobileSidebarToggle, onSearch }) {
    this.onThemeToggle = onThemeToggle;
    this.onMobileSidebarToggle = onMobileSidebarToggle;
    this.onSearch = onSearch;
  }

  getCurrentUser() {
    return storage.get(STORAGE_KEYS.CURRENT_USER, {
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
  }

  render(title = 'Dashboard') {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = currentTheme === 'dark';
    const currentUser = this.getCurrentUser();

    return `
      <header class="navbar">
        <div class="navbar-left">
          <button class="btn-icon mobile-menu-btn" aria-label="Toggle Sidebar Menu">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="22" height="22">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h1 class="page-title">${title}</h1>
        </div>

        <div class="navbar-right">
          <div class="nav-search">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" id="global-search-input" placeholder="Search tasks, descriptions..." aria-label="Search tasks">
          </div>

          <button class="btn-icon theme-toggle-btn" aria-label="Toggle Light/Dark Theme" title="Toggle Dark/Light Mode">
            ${isDark ? `
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            ` : `
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            `}
          </button>

          <a href="#profile" class="user-profile-pill" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.25rem 0.6rem; border-radius: var(--radius-full); background: var(--bg-hover);">
            <img src="${currentUser.avatar}" alt="${currentUser.name}" class="avatar" style="width: 28px; height: 28px;">
            <span style="font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); display: var(--display-user-name, inline);">${currentUser.name}</span>
          </a>
        </div>
      </header>
    `;
  }

  bindEvents(container) {
    const themeBtn = container.querySelector('.theme-toggle-btn');
    const menuBtn = container.querySelector('.mobile-menu-btn');
    const searchInput = container.querySelector('#global-search-input');

    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.onThemeToggle());
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.onMobileSidebarToggle());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.onSearch(e.target.value));
    }
  }
}
