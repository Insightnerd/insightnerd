/* ==========================================================================
   InsightNerd — Premium motion layer (GSAP + ScrollTrigger)
   --------------------------------------------------------------------------
   Safety model:
   • If the visitor prefers reduced motion  → do nothing (content stays visible).
   • If GSAP / ScrollTrigger failed to load → do nothing (content stays visible).
   All initial "hidden" states are set HERE via gsap.set(), never in CSS, so a
   missing script can never leave content permanently invisible.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    if (reduced) return;                       // respect user preference
    if (!window.gsap || !window.ScrollTrigger) return;  // graceful no-op

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    var EASE = 'power3.out';

    /* ---------------------------------------------------------------
       1. Hero entrance — cinematic staggered rise
       --------------------------------------------------------------- */
    var heroInner = document.querySelector('.home-hero-inner, .hero-inner');
    if (heroInner) {
      var heroBits = heroInner.querySelectorAll(
        '.eyebrow, h1, .home-hero-sub, .hero-sub, .hero-meta, .home-hero-actions, .hero-actions'
      );
      if (heroBits.length) {
        gsap.set(heroBits, { opacity: 0, y: 34 });
        gsap.to(heroBits, {
          opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.12, delay: 0.1
        });
      }
    }

    /* ---------------------------------------------------------------
       2. Hero background parallax (grid drifts slower than scroll)
       --------------------------------------------------------------- */
    document.querySelectorAll('.home-hero-grid, .hero-grid').forEach(function (grid) {
      var host = grid.closest('.home-hero, .hero');
      if (!host) return;
      gsap.to(grid, {
        yPercent: 28, ease: 'none',
        scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true }
      });
    });
    // Hero content drifts up + fades slightly as you scroll past it
    if (heroInner) {
      gsap.to(heroInner, {
        yPercent: -12, opacity: 0.55, ease: 'none',
        scrollTrigger: {
          trigger: heroInner.closest('.home-hero, .hero') || heroInner,
          start: 'top top', end: 'bottom top', scrub: true
        }
      });
    }

    /* ---------------------------------------------------------------
       3. Batched scroll reveals — cards & sections rise + fade in
       (staggered per row as each batch enters the viewport)
       --------------------------------------------------------------- */
    // NOTE: .content-section and .tool-card are intentionally excluded —
    // main.js already reveals those via IntersectionObserver. Avoid double-animation.
    var revealSelectors = [
      '.trust-stat', '.featured-card', '.topic-card', '.why-card',
      '.post-card', '.related-card', '.newsletter',
      '.category-header', '.category-hero', '.page-content > *', '.error-inner'
    ];
    var revealEls = document.querySelectorAll(revealSelectors.join(','));

    if (revealEls.length) {
      gsap.set(revealEls, { opacity: 0, y: 40 });
      ScrollTrigger.batch(revealEls, {
        start: 'top 88%',
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.09, overwrite: true
          });
        }
      });
    }

    /* ---------------------------------------------------------------
       4. Section-heading underline draws in on view
       --------------------------------------------------------------- */
    document.querySelectorAll('.section-heading').forEach(function (h) {
      ScrollTrigger.create({
        trigger: h, start: 'top 85%',
        onEnter: function () { h.classList.add('in-view'); }
      });
    });

    /* ---------------------------------------------------------------
       5. Animated number counters (trust strip / any [data-count])
       --------------------------------------------------------------- */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.round(obj.val) + suffix; }
          });
        }
      });
    });

    /* ---------------------------------------------------------------
       6. Magnetic buttons + light-follow glow
       --------------------------------------------------------------- */
    var fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
    if (fine) {
      document.querySelectorAll('.btn').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
        var yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var mx = e.clientX - r.left, my = e.clientY - r.top;
          xTo((mx - r.width / 2) * 0.3);
          yTo((my - r.height / 2) * 0.3);
          btn.style.setProperty('--mx', mx + 'px');
          btn.style.setProperty('--my', my + 'px');
        });
        btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
      });
    }

    /* ---------------------------------------------------------------
       7. Card tilt on hover (subtle 3D) for topic/post cards
       --------------------------------------------------------------- */
    if (fine) {
      document.querySelectorAll('.topic-card, .post-card, .why-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
          gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 700,
            duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    }

    // Recalculate trigger positions once fonts/images settle
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
