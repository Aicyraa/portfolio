/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
import { $$, reduceMotion } from './utils.js';

export function initReveal() {
  const revealItems = $$('[data-reveal]');

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach(item => reveal.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in'));
  }
}
