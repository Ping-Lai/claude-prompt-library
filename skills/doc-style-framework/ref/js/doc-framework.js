/* ================================================================
   DOC FRAMEWORK JS — doc-framework.js
   功能：sidebar 開關、theme 切換、active nav、scroll spy
   ================================================================ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const sidebar      = document.getElementById('doc-sidebar');
  const overlay      = document.getElementById('sidebar-overlay');
  const btnHamburger = document.getElementById('btn-hamburger');
  const btnCollapse  = document.getElementById('btn-collapse');
  const btnExpand    = document.getElementById('btn-expand');
  const btnTheme     = document.getElementById('btn-theme');
  const themeIcon    = document.getElementById('theme-icon');
  const themeLabel   = document.getElementById('theme-label');
  const navItems     = document.querySelectorAll('.nav-item[data-target]');

  /* ================================================================
     SIDEBAR — DESKTOP collapse/expand
     ================================================================ */
  function isMobile() { return window.innerWidth <= 768; }

  function collapseDesktop() {
    sidebar.classList.add('collapsed');
    if (btnExpand) btnExpand.style.display = 'flex';
    localStorage.setItem('sidebar', 'collapsed');
  }

  function expandDesktop() {
    sidebar.classList.remove('collapsed');
    if (btnExpand) btnExpand.style.display = 'none';
    localStorage.setItem('sidebar', 'expanded');
  }

  if (btnCollapse) {
    btnCollapse.addEventListener('click', () => {
      if (sidebar.classList.contains('collapsed')) expandDesktop();
      else collapseDesktop();
    });
  }

  if (btnExpand) {
    btnExpand.addEventListener('click', expandDesktop);
  }

  /* Restore desktop state */
  if (!isMobile()) {
    const saved = localStorage.getItem('sidebar');
    if (saved === 'collapsed') collapseDesktop();
    else if (btnExpand) btnExpand.style.display = 'none';
  }

  /* ================================================================
     SIDEBAR — MOBILE overlay open/close
     ================================================================ */
  function openMobile() {
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnHamburger) {
    btnHamburger.addEventListener('click', () => {
      if (sidebar.classList.contains('mobile-open')) closeMobile();
      else openMobile();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobile);
  }

  /* Close mobile sidebar when nav item clicked */
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isMobile()) closeMobile();
    });
  });

  /* ================================================================
     THEME TOGGLE
     ================================================================ */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon)  themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
    localStorage.setItem('theme', theme);
  }

  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* Restore theme */
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  /* ================================================================
     SCROLL SPY — highlight active nav item
     ================================================================ */
  const sections = [];
  navItems.forEach(item => {
    const id = item.getAttribute('data-target');
    const el = document.getElementById(id);
    if (el) sections.push({ el, item });
  });

  function onScroll() {
    const scrollY = window.scrollY + 80;
    let current = sections[0];
    sections.forEach(s => {
      if (s.el.offsetTop <= scrollY) current = s;
    });
    navItems.forEach(n => n.classList.remove('active'));
    if (current) current.item.classList.add('active');
  }

  if (sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ================================================================
     RESIZE — reset mobile state on desktop
     ================================================================ */
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobile();
      if (btnExpand) {
        const saved = localStorage.getItem('sidebar');
        btnExpand.style.display = saved === 'collapsed' ? 'flex' : 'none';
      }
    }
  });

})();
