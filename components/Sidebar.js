/* ==========================================================================
   TaskFlow Sidebar Component
   ========================================================================== */

import { storage, STORAGE_KEYS } from '../utils/storage.js';

export class Sidebar {
  constructor({ activeRoute = 'dashboard', onNavigate }) {
    this.activeRoute = activeRoute;
    this.onNavigate = onNavigate;
    this.isOpen = false;
  }

  setActiveRoute(route) {
    this.activeRoute = route;
    const items = document.querySelectorAll('.sidebar .nav-item');
    items.forEach((item) => {
      const href = item.getAttribute('href').replace('#', '');
      if (href === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  toggleMobile() {
    const sidebarEl = document.querySelector('.sidebar');
    const backdropEl = document.querySelector('.sidebar-backdrop');
    if (sidebarEl) {
      this.isOpen = !this.isOpen;
      sidebarEl.classList.toggle('open', this.isOpen);
      if (backdropEl) backdropEl.classList.toggle('active', this.isOpen);
    }
  }

  closeMobile() {
    const sidebarEl = document.querySelector('.sidebar');
    const backdropEl = document.querySelector('.sidebar-backdrop');
    if (sidebarEl && this.isOpen) {
      this.isOpen = false;
      sidebarEl.classList.remove('open');
      if (backdropEl) backdropEl.classList.remove('active');
    }
  }

  render() {
    const navItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`
      },
      {
        id: 'tasks',
        label: 'Tasks Board',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
      },
      {
        id: 'team',
        label: 'Team Directory',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
      },
      {
        id: 'profile',
        label: 'Settings & Profile',
        icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
      }
    ];

    return `
      <div class="sidebar-backdrop"></div>
      <aside class="sidebar">
        <div class="sidebar-header">
          <a href="#dashboard" class="brand-logo">
            <div class="brand-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span>TaskFlow</span>
          </a>
        </div>

        <nav class="sidebar-nav">
          ${navItems.map((item) => `
            <a href="#${item.id}" class="nav-item ${this.activeRoute === item.id ? 'active' : ''}">
              ${item.icon}
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <a href="#login" class="nav-item" style="color: var(--accent-rose);">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Log Out</span>
          </a>
        </div>
      </aside>
    `;
  }

  bindEvents(container) {
    const navLinks = container.querySelectorAll('.sidebar .nav-item');
    const backdropEl = container.querySelector('.sidebar-backdrop');

    if (backdropEl) {
      backdropEl.addEventListener('click', () => this.closeMobile());
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const route = link.getAttribute('href').replace('#', '');
        if (route === 'login') {
          storage.remove(STORAGE_KEYS.CURRENT_USER);
        } else {
          this.setActiveRoute(route);
          if (this.onNavigate) this.onNavigate(route);
        }
        this.closeMobile();
      });
    });
  }
}
