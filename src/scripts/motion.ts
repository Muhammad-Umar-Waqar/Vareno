import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Smooth scroll with Lenis ───────────────────────────────────────────────
function initSmoothScroll() {
  if (reduce) {
    document.documentElement.classList.add('reduced-motion');
    return null;
  }

  // Disable Lenis on touch devices and mobile screens (< 992px)
  // Native touch scrolling is 120Hz hardware-accelerated with 0ms TBT!
  const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992;
  if (isTouch) {
    return null;
  }

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
    autoRaf: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -16 });
    });
  });

  return lenis;
}

// ── Hero parallax — BG image scrolls slower than the page ─────────────────
function initHeroParallax() {
  if (reduce) return;

  const bgImg = document.getElementById('vh-bg-img') as HTMLElement | null;
  const hero  = document.getElementById('vh-hero');
  if (!bgImg || !hero) return;

  // Parallax: image moves up 12% as hero scrolls out
  gsap.to(bgImg, {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Right panels — subtle vertical offset stagger for depth
  const panelMain = document.getElementById('vh-panel-main');
  const panelSm1  = document.getElementById('vh-panel-sm1');
  const panelSm2  = document.getElementById('vh-panel-sm2');

  if (panelMain) {
    gsap.to(panelMain, {
      y: -18,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2 },
    });
  }
  if (panelSm1) {
    gsap.to(panelSm1, {
      y: -8,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
    });
  }
  if (panelSm2) {
    gsap.to(panelSm2, {
      y: -28,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
  }

  // Stat bar fades in after hero enters
  const statbar = document.getElementById('vh-statbar');
  if (statbar) {
    gsap.from(statbar, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1,
    });
  }

  // Scroll hint fades out as user scrolls
  const scrollHint = document.getElementById('vh-scroll');
  if (scrollHint) {
    gsap.to(scrollHint, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '20% top',
        scrub: true,
      },
    });
  }
}

// ── Hero text entrance ─────────────────────────────────────────────────────
function initHeroEntrance() {
  if (reduce) return;

  const left = document.getElementById('vh-left');
  if (!left) return;

  const eyebrow = left.querySelector('.vh-eyebrow');
  const lines   = left.querySelectorAll('.vh-title-line');
  const sub     = left.querySelector('.vh-sub');
  const ctaRow  = left.querySelector('.vh-cta-row');

  const tl = gsap.timeline({ delay: 0.1 });

  if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' });
  if (lines.length) {
    tl.from(lines, {
      y: 50,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power4.out',
    }, '-=0.3');
  }
  if (sub)    tl.from(sub,    { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
  if (ctaRow) tl.from(ctaRow, { y: 20, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4');

  // Right panels slide in from right
  const panels = document.getElementById('vh-panels');
  if (panels) {
    tl.from(panels, { x: 60, opacity: 0, duration: 1, ease: 'power3.out' }, 0.4);
  }
}

// ── Scroll reveals with GSAP stagger ──────────────────────────────────────
function initReveals() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  if (reduce) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Group siblings so they stagger together
  const groups = new Map<Element, HTMLElement[]>();
  items.forEach((el) => {
    const parent = el.parentElement ?? document.body;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent)!.push(el);
  });

  groups.forEach((siblings) => {
    siblings.forEach((el, idx) => {
      // Set initial invisible state via GSAP (not CSS) to avoid conflicts
      gsap.set(el, { y: 42, opacity: 0 });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: idx * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  });

  // Refresh after a short delay so elements in viewport on load animate in
  setTimeout(() => ScrollTrigger.refresh(), 300);
}

// ── 3-D card tilt on mousemove ─────────────────────────────────────────────
function initCardTilt() {
  if (reduce) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = document.querySelectorAll<HTMLElement>('.card-link');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      gsap.to(card, {
        '--tilt-x': `${-dy * 7}deg`,
        '--tilt-y': `${dx * 7}deg`,
        '--glow-x': `${((e.clientX - rect.left) / rect.width) * 100}%`,
        '--glow-y': `${((e.clientY - rect.top) / rect.height) * 100}%`,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        '--tilt-x': '0deg',
        '--tilt-y': '0deg',
        '--glow-x': '50%',
        '--glow-y': '50%',
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    });
  });
}

// ── Inner page mast / hero parallax ───────────────────────────────────────
function initMastParallax() {
  if (reduce) return;
  const hero = document.querySelector('.ip-hero');
  const img  = hero?.querySelector('.ip-hero-img');
  if (!hero || !img) return;

  gsap.fromTo(
    img,
    { yPercent: -4 },
    {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    },
  );
}

// ── Init ──────────────────────────────────────────────────────────────────
initHeroEntrance();

const runDeferred = () => {
  initSmoothScroll();
  initHeroParallax();
  initMastParallax();
  initReveals();
  initCardTilt();
};

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runDeferred, { timeout: 1000 });
  } else {
    setTimeout(runDeferred, 120);
  }
}


// ── Appended: Carousel drag + Sticky Features progress ───────────────────
// (this file is imported in Base.astro and runs on every page)

// ── Apple-style carousel — drag scroll ───────────────────────────────────
(function initCarousel() {
  const wrap = document.getElementById('cc-wrap') as HTMLElement | null;
  const track = document.getElementById('cc-track') as HTMLElement | null;
  const dots = document.querySelectorAll<HTMLButtonElement>('.cc-dot');
  if (!wrap || !track) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    wrap.classList.add('is-dragging');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });

  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('is-dragging'); });
  wrap.addEventListener('mouseup',    () => { isDown = false; wrap.classList.remove('is-dragging'); });

  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Update dots on scroll
  wrap.addEventListener('scroll', () => {
    const cards = track.querySelectorAll<HTMLElement>('.cc-card');
    const center = wrap.scrollLeft + wrap.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === closest));
  }, { passive: true });

  // Dot click scrolls to card
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = track.querySelectorAll<HTMLElement>('.cc-card');
      const card = cards[i];
      if (card) wrap.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    });
  });
})();

// ── Sticky features — progress bar driven by GSAP ScrollTrigger ──────────
(function initStickyFeatures() {
  const outer = document.getElementById('sf-outer');
  const right = document.getElementById('sf-right');
  const progressFill = document.getElementById('sf-progress');
  const activeNum = document.getElementById('sf-active-num');
  if (!outer || !right) return;

  const items = right.querySelectorAll<HTMLElement>('.sf-item');
  if (!items.length) return;

  // Use IntersectionObserver to detect which item is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = parseInt((entry.target as HTMLElement).dataset.sfItem ?? '0');
        // Update progress bar
        if (progressFill) progressFill.style.height = `${((idx + 1) / items.length) * 100}%`;
        // Update active number
        if (activeNum) activeNum.textContent = String(idx + 1).padStart(2, '0');
        // Highlight active item
        items.forEach((item, i) => item.classList.toggle('is-active', i === idx));
      });
    },
    { rootMargin: '-30% 0px -30% 0px', threshold: 0.1 },
  );

  items.forEach((item) => observer.observe(item));
})();
