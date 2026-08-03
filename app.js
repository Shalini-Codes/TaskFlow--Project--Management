/* ==========================================================================
   TaskFlow Application Router & Master Controller
   ========================================================================== */

import { storage, STORAGE_KEYS } from './utils/storage.js';
import { authService } from './services/authService.js';
import { Sidebar } from './components/Sidebar.js';
import { Navbar } from './components/Navbar.js';
import { LoginView } from './pages/LoginView.js';
import { DashboardView } from './pages/DashboardView.js';
import { TasksView } from './pages/TasksView.js';
import { TeamView } from './pages/TeamView.js';
import { ProfileView } from './pages/ProfileView.js';

class TaskFlowApp {
  constructor() {
    this.currentRoute = 'dashboard';
    this.sidebar = null;
    this.navbar = null;
    this.currentPageView = null;

    storage.initSeedData();
    this.initTheme();
    this.initAuthListener();
    this.initRouter();
  }

  initTheme() {
    const savedTheme = storage.get(STORAGE_KEYS.THEME, 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  initAuthListener() {
    authService.onAuthStateChanged((user) => {
      this.handleRoute();
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);

    // Re-render navbar to update theme icon
    this.renderShell();
  }

  initRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'dashboard';
  }

  async handleRoute() {
    this.currentRoute = this.getRouteFromHash();
    const currentUser = authService.getCurrentUser();

    // If user lands on login view and is authenticated, send to dashboard
    if (this.currentRoute === 'login') {
      if (currentUser && currentUser.uid) {
        window.location.hash = 'dashboard';
        return;
      }
      this.navbar = null;
      document.getElementById('sidebar-container').innerHTML = '';
      document.getElementById('navbar-container').innerHTML = '';
      document.querySelector('.main-wrapper').style.marginLeft = '0';
      this.renderView();
      return;
    }

    // Protect Dashboard and workspace routes: If no active session, redirect to login page
    if (!currentUser) {
      window.location.hash = 'login';
      return;
    }

    // Reset layout for main app views
    document.querySelector('.main-wrapper').style.marginLeft = '';
    this.renderShell();
    await this.renderView();
  }

  renderShell() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const navbarContainer = document.getElementById('navbar-container');

    if (!this.sidebar) {
      this.sidebar = new Sidebar({
        activeRoute: this.currentRoute,
        onNavigate: (route) => {
          window.location.hash = route;
        }
      });
    } else {
      this.sidebar.setActiveRoute(this.currentRoute);
    }

    if (!this.navbar) {
      this.navbar = new Navbar({
        onThemeToggle: () => this.toggleTheme(),
        onSidebarToggle: () => this.sidebar.toggle(),
        onMobileSidebarToggle: () => this.sidebar.toggle(),
        onSearch: (query) => {
          if (this.currentRoute !== 'tasks') {
            window.location.hash = 'tasks';
          }
          if (this.currentPageView && this.currentPageView.setSearchQuery) {
            this.currentPageView.setSearchQuery(query);
          }
        }
      });
    }

    const titleMap = {
      dashboard: 'Dashboard Overview',
      tasks: 'Tasks & Kanban Workspace',
      team: 'Team Members Directory',
      profile: 'Account Settings & Preferences'
    };

    sidebarContainer.innerHTML = this.sidebar.render();
    this.sidebar.bindEvents(sidebarContainer);

    navbarContainer.innerHTML = this.navbar.render(titleMap[this.currentRoute] || 'TaskFlow');
    this.navbar.bindEvents(navbarContainer);
  }

  async renderView() {
    const mainContent = document.getElementById('main-content');

    switch (this.currentRoute) {
      case 'login':
        this.currentPageView = new LoginView({
          onLoginSuccess: () => {
            window.location.hash = 'dashboard';
          }
        });
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);
        break;

      case 'dashboard':
        this.currentPageView = new DashboardView({
          onNavigateToTasks: () => {
            window.location.hash = 'tasks';
          },
          onOpenTaskModal: () => {
            this.pendingOpenTaskModal = true;
            window.location.hash = 'tasks';
          }
        });
        mainContent.innerHTML = this.currentPageView.render();
        await this.currentPageView.loadData();
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);
        break;

      case 'tasks':
        this.currentPageView = new TasksView();
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);
        await this.currentPageView.loadData();
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);

        if (this.pendingOpenTaskModal) {
          this.pendingOpenTaskModal = false;
          await this.currentPageView.handleOpenTaskModal();
        }
        break;

      case 'team':
        this.currentPageView = new TeamView();
        mainContent.innerHTML = this.currentPageView.render();
        await this.currentPageView.loadData();
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);
        break;

      case 'profile':
        this.currentPageView = new ProfileView({
          onThemeToggle: () => this.toggleTheme()
        });
        mainContent.innerHTML = this.currentPageView.render();
        this.currentPageView.bindEvents(mainContent);
        break;

      default:
        window.location.hash = 'dashboard';
        break;
    }
  }
}

// Instantiate App
new TaskFlowApp();
