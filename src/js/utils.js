/* ============================================================
   HELPERS
   Shared selectors, math helpers and user-preference queries.
   ============================================================ */
export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
export const canTilt = matchMedia('(hover: hover) and (pointer: fine)');
