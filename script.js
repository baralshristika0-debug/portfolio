/* ============================================================
   THE DIGITAL IDENTITY PROJECT — interactions
   1) Terminal "boot sequence" typing effect in the hero
   2) Mobile nav toggle
   3) Smooth-scroll nav (native CSS handles most of it — this
      adds the active-link + offset correction + menu close)
   4) Dynamic project filter
   5) Scroll-reveal for sections
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) Terminal boot sequence ---------- */
  const bootLines = [
    'establishing secure session...',
    'resolving identity...',
    'access_level: PUBLIC_PORTFOLIO',
  ];
  const typedEl = document.getElementById('typed-line');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = 'identity_verified: Shristika Baral';
    } else {
      let lineIndex = 0;
      let charIndex = 0;
      const staticList = document.getElementById('boot-log');

      function typeNext() {
        if (lineIndex < bootLines.length) {
          const current = bootLines[lineIndex];
          if (charIndex <= current.length) {
            typedEl.textContent = current.slice(0, charIndex);
            charIndex++;
            setTimeout(typeNext, 18);
          } else {
            // commit finished line to the static log, start next line
            const li = document.createElement('div');
            li.className = 'line';
            li.innerHTML = `<span class="prompt">&gt;</span><span class="status-ok">${current} [ok]</span>`;
            staticList.appendChild(li);
            lineIndex++;
            charIndex = 0;
            typedEl.textContent = '';
            setTimeout(typeNext, 200);
          }
        } else {
          typedEl.textContent = 'identity_verified: Shristika Baral';
        }
      }
      setTimeout(typeNext, 400);
    }
  }

  /* ---------- 2) Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.statusbar nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3) Smooth scroll (with sticky-header offset) ---------- */
  const header = document.querySelector('.statusbar');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 4) Dynamic project filter ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags || '';
        const match = filter === 'all' || tags.split(' ').includes(filter);
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- 5) Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- contact form (demo only — no backend) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'message_sent [ok]';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2200);
    });
  }
}); 
