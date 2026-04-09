/* ================================================================
   SINODOL — scripts.js
   Animaciones, interacciones y comportamiento UI
================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. CUSTOM CURSOR
  ────────────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth trailing ring
    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Hover state on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .faq-question, .stat-card, .pricing-card, .dual-card, .testimonial-card, .benefit-card'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorRing.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorRing.classList.remove('hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '0.55';
    });
  }

  /* ──────────────────────────────────────────────
     2. SCROLL PROGRESS BAR
  ────────────────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ──────────────────────────────────────────────
     3. NAVBAR — scroll class
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ──────────────────────────────────────────────
     4. SCROLL REVEAL — IntersectionObserver
  ────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ──────────────────────────────────────────────
     5. FAQ ACCORDION
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ──────────────────────────────────────────────
     6. STAT CARD NUMBER COUNTER ANIMATION
  ────────────────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    const start     = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Trigger counter on stat cards that have numeric content
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el   = entry.target;
          const text = el.textContent.trim();
          if (text === '100%') {
            animateCounter(el, 100, '%', 1400);
          }
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => counterObserver.observe(el));

  /* ──────────────────────────────────────────────
     7. SMOOTH SCROLL for anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH   = navbar ? navbar.offsetHeight : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────────
     8. MARQUEE — trust bar (seamless)
  ────────────────────────────────────────────── */
  (function () {
    const track = document.querySelector('.trust-track');
    const group = document.querySelector('.trust-group');
    if (!track || !group) return;

    let x = 0;
    const speed = 0.6;

    function tick() {
      x -= speed;
      if (Math.abs(x) >= group.offsetWidth) x = 0;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();

  /* ──────────────────────────────────────────────
     9. UNIFIED SCROLL HANDLER
  ────────────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateScrollProgress();
  updateNavbar();

  /* ──────────────────────────────────────────────
     10. PRICING CARD micro-animation on hover (tilt)
  ────────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.pricing-card:not(.featured), .testimonial-card, .stat-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 4;
      const rotY   =  dx * 4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.19,1,0.22,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, border-color 0.4s ease';
    });
  });

  /* ──────────────────────────────────────────────
     11. WHATSAPP BUTTON — entrance animation delay
  ────────────────────────────────────────────── */
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    waFloat.style.opacity   = '0';
    waFloat.style.transform = 'scale(0.5)';
    setTimeout(() => {
      waFloat.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      waFloat.style.opacity    = '1';
      waFloat.style.transform  = 'scale(1)';
    }, 1800);
  }

  /* ──────────────────────────────────────────────
     12. PAGE LOAD — stagger sections after hero
  ────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

})();