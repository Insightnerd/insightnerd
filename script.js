// InsightNerd — site interactions
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Dark mode toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = null; // no localStorage in this environment; session-only preference
  let theme = 'light';

  function applyTheme(t){
    theme = t;
    if (t === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
  // Respect system preference on load
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }
  themeToggle.addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Reading progress bar ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeader(){
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop(){
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Scroll spy for TOC ---------- */
  const sections = Array.from(document.querySelectorAll('.content-section[id]'));
  const tocLinks = Array.from(document.querySelectorAll('[data-toc]'));
  function updateScrollSpy(){
    let currentId = sections[0] && sections[0].id;
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => observer.observe(el));

  /* ---------- Combined scroll handler ---------- */
  function onScroll(){
    updateProgress();
    updateHeader();
    updateBackToTop();
    updateScrollSpy();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.style.display === 'flex';
    mainNav.style.display = isOpen ? '' : 'flex';
    mainNav.style.flexDirection = 'column';
    mainNav.style.position = 'absolute';
    mainNav.style.top = '64px';
    mainNav.style.left = '0';
    mainNav.style.right = '0';
    mainNav.style.background = 'var(--surface)';
    mainNav.style.padding = '16px 24px';
    mainNav.style.borderBottom = '1px solid var(--border)';
  });

  /* ---------- Search / filter across tool cards ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const toolCards = Array.from(document.querySelectorAll('.tool-card'));

  searchToggle.addEventListener('click', () => {
    searchPanel.classList.toggle('open');
    if (searchPanel.classList.contains('open')) searchInput.focus();
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      toolCards.forEach(card => card.classList.remove('hidden'));
      searchResults.textContent = '';
      return;
    }
    let matches = 0;
    toolCards.forEach(card => {
      const haystack = (card.dataset.tags + ' ' + card.querySelector('h3').textContent).toLowerCase();
      const isMatch = haystack.includes(query);
      card.classList.toggle('hidden', !isMatch);
      if (isMatch) matches++;
    });
    searchResults.textContent = matches === 0
      ? `No tools match "${searchInput.value}".`
      : `${matches} tool${matches === 1 ? '' : 's'} match "${searchInput.value}".`;
  });

  /* ---------- Newsletter form (front-end only demo) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterNote.textContent = "You're on the list — thanks for subscribing!";
    newsletterForm.reset();
  });

});
