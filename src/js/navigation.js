/* ============================================================
   NAVIGATION
   Scroll progress, nav state, goal path, back-to-top,
   scrollspy and the mobile menu.
   ============================================================ */
import { $, $$, clamp, reduceMotion } from './utils.js';

export function initNavigation() {
  const progress = $('#progress');
  const nav = $('#nav');
  const toTop = $('#to-top');
  const goals = $('.goals');
  const goalsFill = $('#goals-fill');
  let scrollQueued = false;

  function onScrollFrame() {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;

    if (progress) progress.style.transform = `scaleX(${maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0})`;
    if (nav) nav.classList.toggle('scrolled', y > 32);
    if (toTop) toTop.classList.toggle('show', y > 620);

    // Draw the career path as the list travels through the viewport.
    if (goals && goalsFill) {
      const rect = goals.getBoundingClientRect();
      const travelled = window.innerHeight * 0.8 - rect.top;
      const distance = rect.height + window.innerHeight * 0.35;
      const amount = reduceMotion.matches ? 1 : clamp(travelled / distance, 0, 1);
      goalsFill.style.transform = `scaleY(${amount})`;
    }
    scrollQueued = false;
  }

  function requestScrollFrame() {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(onScrollFrame);
    }
  }

  addEventListener('scroll', requestScrollFrame, { passive: true });
  addEventListener('resize', requestScrollFrame, { passive: true });
  onScrollFrame();

  /* Sections without a nav link clear the highlight. */
  const navLinks = $$('.links a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const match = navLinks.find(link => link.hash === `#${entry.target.id}`);
        navLinks.forEach(link => {
          const on = link === match;
          link.classList.toggle('on', on);
          if (on) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    $$('main section').forEach(section => spy.observe(section));
  }

  /* Mobile menu */
  const burger = $('#burger');
  const links = $('#links');

  function setMenu(open) {
    if (!burger || !links) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('open', open);
  }

  if (burger && links && nav) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    links.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target)) setMenu(false);
    });
  }
}
