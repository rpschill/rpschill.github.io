/**
 * main.js — Progressive Enhancement
 * ryanschill.co
 *
 * Modules:
 *   Theme     — OS default + user toggle, persists to localStorage
 *   Headline  — Animated rotating word in hero
 *   Nav       — Mobile toggle, active page marking
 *   Cursor    — Custom cursor on fine-pointer devices
 *   Progress  — Reading progress bar on article pages
 */

'use strict';


/* =============================================================
   THEME
   Reads OS preference first, then localStorage override.
   data-theme="light|dark" on <html> drives all CSS.
   ============================================================= */

const Theme = (() => {
  const KEY  = 'rps-theme';
  const root = document.documentElement;
  const mql  = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      const iconLight = btn.querySelector('.theme-toggle__icon--light');
      const iconDark  = btn.querySelector('.theme-toggle__icon--dark');
      if (iconLight && iconDark) {
        iconLight.style.display = theme === 'dark' ? 'flex' : 'none';
        iconDark.style.display  = theme === 'dark' ? 'none' : 'flex';
      }
    }
  };

  // Initial state: saved preference wins, else follow OS
  const saved = localStorage.getItem(KEY);
  apply(saved || (mql.matches ? 'dark' : 'light'));

  // React to OS changes only when no saved preference
  mql.addEventListener('change', (e) => {
    if (!localStorage.getItem(KEY)) apply(e.matches ? 'dark' : 'light');
  });

  // Exposed toggle — called by the button's onclick
  window.toggleTheme = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    apply(next);
  };
})();


/* =============================================================
   HEADLINE ROTATOR
   "Crafted [code / prose / images]" — slide-up transition,
   Web Animations API, respects prefers-reduced-motion.
   ============================================================= */

const Headline = (() => {
  const rotator = document.getElementById('hero-rotator');
  if (!rotator) return;

  // Hide static fallback now that JS is running
  const fallback = rotator.querySelector('.hero__rotator-fallback');
  if (fallback) fallback.style.display = 'none';

  const WORDS    = ['code.', 'prose.', 'images.'];
  const HOLD     = 2200;  // ms each word is visible
  const DURATION = 500;   // ms transition

  // Respect user motion preference
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reducedMotion) {
    // Show all three words as static comma list
    rotator.textContent = 'code, prose & images.';
    rotator.style.fontStyle  = 'italic';
    rotator.style.color      = 'var(--hero-accent-color)';
    return;
  }

  // Build word spans
  const spans = WORDS.map((word, i) => {
    const span = document.createElement('span');
    span.className  = 'hero__rotator-word';
    span.textContent = word;
    span.setAttribute('aria-hidden', 'true');
    rotator.appendChild(span);
    return span;
  });

  // Update aria-label so screen readers get full text
  rotator.setAttribute('aria-label', 'code, prose, and images.');

  // Measure widest word → set min-width so layout never shifts
  const setWidth = () => {
    spans.forEach(s => {
      s.style.position = 'static';
      s.style.opacity  = '1';
    });
    const max = Math.max(...spans.map(s => s.offsetWidth));
    spans.forEach(s => {
      s.style.position = 'absolute';
      s.style.opacity  = '0';
    });
    rotator.style.minWidth = max + 'px';
  };

  let current  = 0;
  let timer    = null;
  let anims    = []; // track in-flight animations so we can cancel them

  const easing     = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const exitFrames  = [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-0.35em)' },
  ];
  const enterFrames = [
    { opacity: 0, transform: 'translateY(0.45em)' },
    { opacity: 1, transform: 'translateY(0)' },
  ];
  const opts = { duration: DURATION, easing, fill: 'forwards' };

  // Force all spans to a clean known state — only `index` is visible
  const reset = (index) => {
    // Cancel any animations still running
    anims.forEach(a => { try { a.cancel(); } catch (_) {} });
    anims = [];
    spans.forEach((s, i) => {
      s.style.opacity   = i === index ? '1' : '0';
      s.style.transform = 'translateY(0)';
    });
    current = index;
  };

  const step = () => {
    const next    = (current + 1) % WORDS.length;
    const curEl   = spans[current];
    const nextEl  = spans[next];

    // Defensively ensure only current word is showing before we animate
    spans.forEach((s, i) => {
      if (i !== current) s.style.opacity = '0';
    });

    const exitAnim = curEl.animate(exitFrames, opts);
    anims.push(exitAnim);

    exitAnim.onfinish = () => {
      curEl.style.opacity = '0';
      nextEl.style.opacity = '0';
      const enterAnim = nextEl.animate(enterFrames, opts);
      anims.push(enterAnim);
      enterAnim.onfinish = () => {
        nextEl.style.opacity = '1';
        anims = anims.filter(a => a !== enterAnim);
        // Schedule next step only after this transition fully completes
        timer = setTimeout(step, HOLD);
      };
      anims = anims.filter(a => a !== exitAnim);
    };

    current = next;
  };

  // Page Visibility API — reset cleanly when tab regains focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Tab hidden: cancel timer and any running animations immediately
      clearTimeout(timer);
      anims.forEach(a => { try { a.cancel(); } catch (_) {} });
      anims = [];
    } else {
      // Tab visible again: snap to a clean state and restart
      reset(current);
      timer = setTimeout(step, HOLD);
    }
  });

  // Kick off
  const init = () => {
    setWidth();
    reset(0);
    timer = setTimeout(step, HOLD);
  };

  // Wait for fonts so width measurement is accurate
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();


/* =============================================================
   NAVIGATION
   Mobile toggle + active page link marking.
   ============================================================= */

const Nav = (() => {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const open  = () => {
    links.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    links.classList.contains('is-open') ? close() : open();
  });

  // Close on nav link click or outside click
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) close();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Mark active page
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  links.querySelectorAll('a').forEach(a => {
    const aPath = new URL(a.href, window.location.origin)
      .pathname.replace(/\/$/, '') || '/';
    if (aPath === path) a.setAttribute('aria-current', 'page');
  });
})();


/* =============================================================
   CUSTOM CURSOR
   Fine-pointer (non-touch) devices only.
   Small dot follows mouse with lerp smoothing.
   Expands on interactive elements.
   ============================================================= */

const Cursor = (() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mx = 0, my = 0, cx = 0, cy = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    cx = lerp(cx, mx, 0.15);
    cy = lerp(cy, my, 0.15);
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  };

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });

  const INTERACTIVE = 'a, button, [role="button"], label[for], .card--lift';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE)) dot.classList.add('cursor--large');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTIVE)) dot.classList.remove('cursor--large');
  });

  requestAnimationFrame(tick);
})();


/* =============================================================
   READING PROGRESS
   Thin ember bar at top of viewport, only on article pages.
   ============================================================= */

const ReadingProgress = (() => {
  const article = document.querySelector('.article-content');
  if (!article) return;

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  bar.setAttribute('aria-label', 'Reading progress');

  const style = document.createElement('style');
  style.textContent = `
    .reading-progress {
      position: fixed; top: 0; left: 0; height: 3px;
      width: 0%; background: var(--color-accent);
      z-index: var(--z-top); transition: width 100ms linear;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
  document.body.prepend(bar);

  const update = () => {
    const { top, height } = article.getBoundingClientRect();
    const scrolled = Math.max(0, -top);
    const total    = height - window.innerHeight;
    const pct      = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* =============================================================
   COPY EMAIL
   Used on contact page.
   ============================================================= */

window.copyEmail = async (email, btn) => {
  try {
    await navigator.clipboard.writeText(email);
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  } catch {
    const range = document.createRange();
    range.selectNode(btn.previousElementSibling);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
};
