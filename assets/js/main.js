document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dark mode ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  let theme = 'light';

  function applyTheme(t) {
    theme = t;
    if (t === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Progress bar ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? ((scrollTop / docHeight) * 100) + '%' : '0%';
  }

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Scroll spy for TOC ---------- */
  const sections = Array.from(document.querySelectorAll('.content-section[id]'));
  const tocLinks = Array.from(document.querySelectorAll('[data-toc]'));
  function updateScrollSpy() {
    if (!sections.length) return;
    let currentId = sections[0].id;
    const scrollPos = window.scrollY + 120;
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    }
    tocLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.content-section, .tool-card');
  if (revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }

  /* ---------- Combined scroll ---------- */
  function onScroll() {
    updateProgress();
    updateHeader();
    updateBackToTop();
    updateScrollSpy();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav (CSS class-based) ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  function closeNav() {
    if (mainNav) mainNav.classList.remove('open');
    if (navToggle) navToggle.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openNav() {
    if (mainNav) mainNav.classList.add('open');
    if (navToggle) navToggle.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) closeNav(); else openNav();
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) closeNav();
    });
  }

  /* ---------- Search / filter ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const toolCards = Array.from(document.querySelectorAll('.tool-card'));

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      searchPanel.classList.toggle('open');
      if (searchPanel.classList.contains('open') && searchInput) searchInput.focus();
    });
  }

  if (searchInput && toolCards.length) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        toolCards.forEach(card => card.classList.remove('hidden'));
        if (searchResults) searchResults.textContent = '';
        return;
      }
      let matches = 0;
      toolCards.forEach(card => {
        const h3 = card.querySelector('h3');
        const haystack = (card.dataset.tags + ' ' + (h3 ? h3.textContent : '')).toLowerCase();
        const isMatch = haystack.includes(query);
        card.classList.toggle('hidden', !isMatch);
        if (isMatch) matches++;
      });
      if (searchResults) {
        searchResults.textContent = matches === 0
          ? 'No tools match "' + searchInput.value + '".'
          : matches + ' tool' + (matches === 1 ? '' : 's') + ' match "' + searchInput.value + '".';
      }
    });
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newsletterNote) newsletterNote.textContent = "You're on the list — thanks for subscribing!";
      newsletterForm.reset();
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactNote = document.getElementById('contactNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (contactNote) contactNote.textContent = "Thanks for your message! We'll get back to you soon.";
      contactForm.reset();
    });
  }

  /* ---------- Share / Copy link ---------- */
  const shareCopyBtn = document.getElementById('shareCopyBtn');
  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareCopyBtn.classList.add('copied');
        const toast = document.createElement('div');
        toast.className = 'share-copy-toast show';
        toast.textContent = 'Link copied to clipboard';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      } catch {
        // fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    });
  }

});
