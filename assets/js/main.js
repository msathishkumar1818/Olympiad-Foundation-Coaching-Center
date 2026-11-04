/**
 * ============================================================================
 * OLYMPIAD FOUNDATION COACHING CENTER - MAIN JAVASCRIPT SYSTEM
 * Pure Vanilla JS | Accessible | Responsive | Production-Ready
 * ============================================================================
 */

(function () {
  'use strict';

  // State Management
  const STORAGE_KEYS = {
    THEME: 'olympiad_theme',
    DIR: 'olympiad_dir'
  };

  // --- 1. DARK MODE CONTROLLER (#000000 MANDATORY) ---
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    applyTheme(isDark);

    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentlyDark = document.documentElement.classList.contains('dark');
        applyTheme(!currentlyDark);
      });
    });
  }

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(icon => {
      icon.style.display = isDark ? 'inline-block' : 'none';
    });
    moonIcons.forEach(icon => {
      icon.style.display = isDark ? 'none' : 'inline-block';
    });
  }

  // --- 2. RTL / LTR CONTROLLER ---
  function initRTL() {
    const savedDir = localStorage.getItem(STORAGE_KEYS.DIR) || 'ltr';
    applyDir(savedDir);

    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.dir || 'ltr';
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDir(nextDir);
      });
    });
  }

  function applyDir(dir) {
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEYS.DIR, dir);

    const rtlLabels = document.querySelectorAll('.rtl-indicator-label');
    rtlLabels.forEach(label => {
      label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  // --- 3. BRANDED PRELOADER CONTROLLER ---
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hideLoader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 500);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 350);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 350));
      // Fallback timeout in case assets hang
      setTimeout(hideLoader, 2500);
    }
  }

  // --- 4. HEADER STICKY & SCROLL LISTENER ---
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 5. CLICK-ONLY DESKTOP DROPDOWN (NO HOVER) ---
  function initDesktopDropdown() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains('open');

        // Close any other open dropdowns first
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            const otherTrigger = d.querySelector('.dropdown-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          dropdown.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          dropdown.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          const trigger = dropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('open');
          const trigger = dropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // --- 6. MOBILE MENU & ACCORDION SYSTEM ---
  function initMobileMenu() {
    const openBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-drawer-close');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-drawer a');

    if (!overlay) return;

    // Helper to ensure all mobile accordions (Home submenu) are collapsed by default
    const resetAccordions = () => {
      const accordions = overlay.querySelectorAll('.mobile-accordion');
      accordions.forEach(acc => {
        acc.classList.remove('open');
        const trigger = acc.querySelector('.mobile-accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    };

    const openMenu = () => {
      resetAccordions(); // Always start in closed state when drawer opens
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      resetAccordions(); // Cleanly reset accordions on close
    };

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeMenu();
      }
    });

    // Close mobile drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeMenu();
      }
    });

    // Automatically close mobile menu and restore scroll when transitioning to desktop (> 1080px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080 && overlay.classList.contains('open')) {
        closeMenu();
      }
    });

    // Clicking ANY nav link must close the mobile menu
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Mobile Accordion (Home Submenu click only - never auto-opens)
    const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
    accordionTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentAccordion = btn.closest('.mobile-accordion');
        if (parentAccordion) {
          parentAccordion.classList.toggle('open');
          const expanded = parentAccordion.classList.contains('open');
          btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
      });
    });
  }

  // --- 7. SCROLL TO TOP CONTROLLER ---
  function initScrollTop() {
    const scrollBtn = document.getElementById('scroll-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 8. ACTIVE NAVIGATION DETECTOR ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');

        // If it's a desktop dropdown child, mark parent active too
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          const trigger = parentDropdown.querySelector('.dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }

        // If it's a mobile accordion sub-link, mark accordion trigger button active too (without opening content)
        const parentAccordion = link.closest('.mobile-accordion');
        if (parentAccordion) {
          const trigger = parentAccordion.querySelector('.mobile-accordion-trigger');
          if (trigger) trigger.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- 9. DASHBOARD TAB CONTROLLER (SIDEBAR SWITCHING) ---
  function initDashboardTabs() {
    const sidebarButtons = document.querySelectorAll('.sidebar-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-content');
    const mobileSidebarToggles = document.querySelectorAll('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (!sidebarButtons.length) return;

    const toggleSidebar = (shouldOpen) => {
      if (!sidebar) return;
      const isOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open', isOpen);
      if (backdrop) backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = (isOpen && window.innerWidth < 1024) ? 'hidden' : '';
    };

    function activateTab(tabId) {
      sidebarButtons.forEach(btn => {
        const isTarget = btn.getAttribute('data-tab') === tabId;
        btn.classList.toggle('active', isTarget);
      });

      tabPanels.forEach(panel => {
        const isTarget = panel.id === `tab-${tabId}`;
        panel.classList.toggle('active', isTarget);
      });

      window.location.hash = tabId;

      // Close mobile sidebar after selecting tab
      toggleSidebar(false);
    }

    sidebarButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = btn.getAttribute('data-tab');
        if (tabId) activateTab(tabId);
      });
    });

    // Check initial URL hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(`tab-${initialHash}`)) {
      activateTab(initialHash);
    }

    // Mobile sidebar toggle buttons (both header trigger and drawer close)
    if (mobileSidebarToggles.length && sidebar) {
      mobileSidebarToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSidebar();
        });
      });
    }

    // Close when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        toggleSidebar(false);
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
        toggleSidebar(false);
      }
    });
  }

  // --- 10. AUTHENTICATION & PASSWORD CONTROLLERS ---
  function initAuthTabs() {
    const tabButtons = document.querySelectorAll('.auth-tab-btn[data-auth-tab]');
    const signInForm = document.getElementById('signInForm');
    const registerForm = document.getElementById('registerForm');

    if (tabButtons.length) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const targetTab = btn.getAttribute('data-auth-tab');
          if (signInForm && registerForm) {
            if (targetTab === 'register') {
              signInForm.classList.add('hidden');
              registerForm.classList.remove('hidden');
            } else {
              signInForm.classList.remove('hidden');
              registerForm.classList.add('hidden');
            }
          }
        });
      });
    }

    // Password visibility toggle
    const togglePassBtn = document.getElementById('togglePassword');
    const passInput = document.getElementById('authPassword');
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPassword = passInput.getAttribute('type') === 'password';
        passInput.setAttribute('type', isPassword ? 'text' : 'password');
      });
    }
  }

  // --- 11. PROGRAMS PAGE DIVISION TABS ---
  function initProgramTabs() {
    const tabBtns = document.querySelectorAll('.program-tab-btn');
    const tabPanels = document.querySelectorAll('.program-tab-panel');

    if (tabBtns.length && tabPanels.length) {
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab');

          tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          tabPanels.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('hidden', 'true');
          });

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          const activePanel = document.getElementById(targetId);
          if (activePanel) {
            activePanel.classList.add('active');
            activePanel.removeAttribute('hidden');
          }
        });
      });
    }
  }

  // --- INITIALIZE ALL MODULES ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initPreloader();
    initHeaderScroll();
    initDesktopDropdown();
    initMobileMenu();
    initScrollTop();
    highlightActiveNav();
    initDashboardTabs();
    initAuthTabs();
    initProgramTabs();
  });
})();

