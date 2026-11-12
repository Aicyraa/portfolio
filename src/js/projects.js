/* ============================================================
   PROJECT LIGHTBOX
   A shared-element (FLIP) transition from the device frame in the
   page to a centred, enlarged view. No dependencies.
   ============================================================ */
import { $, $$, reduceMotion } from './utils.js';

const ease = 'cubic-bezier(.2,.75,.2,1)';

export function initProjectLightbox() {
  const lightbox = $('#lightbox');
  const media = $('#lightbox-media');
  const caption = $('#lightbox-caption');
  const closeButton = $('#lightbox-close');
  if (!lightbox || !media || !closeButton) return;

  const triggers = $$('[data-zoom]');
  let activeTrigger = null;
  let clone = null;
  let open = false;
  let originalPadding = '';

  function bounds(sourceRect) {
    const margin = 18;
    const captionSpace = 58;
    const maxWidth = Math.min(innerWidth - margin * 2, 1240);
    const maxHeight = innerHeight - captionSpace - margin * 2;
    const aspect = sourceRect.width / sourceRect.height;
    let width = maxWidth;
    let height = width / aspect;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspect;
    }
    return {
      left: (innerWidth - width) / 2,
      top: Math.max(margin, (innerHeight - captionSpace - height) / 2),
      width,
      height
    };
  }

  function lockScroll() {
    originalPadding = document.body.style.paddingRight;
    const gap = innerWidth - document.documentElement.clientWidth;
    document.body.classList.add('lightbox-open');
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  }

  function unlockScroll() {
    document.body.classList.remove('lightbox-open');
    document.body.style.paddingRight = originalPadding;
  }

  function show(trigger) {
    if (open) return;
    const device = trigger.querySelector('.device');
    if (!device) return;

    const first = device.getBoundingClientRect();
    clone = device.cloneNode(true);
    clone.classList.add('is-clone');
    clone.style.cssText = [
      'position:fixed',
      'margin:0',
      'max-width:none',
      'z-index:1',
      `left:${first.left}px`,
      `top:${first.top}px`,
      `width:${first.width}px`,
      `height:${first.height}px`
    ].join(';');
    clone.querySelectorAll('img').forEach(image => {
      image.loading = 'eager';
      image.draggable = false;
    });

    media.replaceChildren(clone);
    caption.textContent = trigger.dataset.title || 'Project screenshot';
    lightbox.hidden = false;
    lockScroll();
    open = true;
    activeTrigger = trigger;

    const startRadius = getComputedStyle(device).borderRadius;
    const end = bounds(first);
    const endRadius = device.classList.contains('device--phone') ? '34px' : '10px';
    const frames = [
      { left: `${first.left}px`, top: `${first.top}px`, width: `${first.width}px`, height: `${first.height}px`, borderRadius: startRadius },
      { left: `${end.left}px`, top: `${end.top}px`, width: `${end.width}px`, height: `${end.height}px`, borderRadius: endRadius }
    ];

    const finish = () => {
      if (!clone) return;
      clone.style.left = `${end.left}px`;
      clone.style.top = `${end.top}px`;
      clone.style.width = `${end.width}px`;
      clone.style.height = `${end.height}px`;
      clone.style.borderRadius = endRadius;
    };

    if (reduceMotion.matches) {
      finish();
    } else {
      const animation = clone.animate(frames, { duration: 460, easing: ease, fill: 'both' });
      animation.addEventListener('finish', () => {
        finish();
        animation.cancel();
      });
    }

    closeButton.focus({ preventScroll: true });
  }

  function hide() {
    if (!open || !clone) return;
    const trigger = activeTrigger;
    const device = trigger ? trigger.querySelector('.device') : null;
    const last = device ? device.getBoundingClientRect() : null;

    const cleanup = () => {
      media.replaceChildren();
      lightbox.hidden = true;
      unlockScroll();
      open = false;
      clone = null;
      activeTrigger = null;
      if (trigger) trigger.focus({ preventScroll: true });
    };

    if (!last || reduceMotion.matches) {
      cleanup();
      return;
    }

    const currentRadius = getComputedStyle(clone).borderRadius;
    const current = getComputedStyle(clone);
    const animation = clone.animate(
      [
        {
          left: current.left,
          top: current.top,
          width: current.width,
          height: current.height,
          borderRadius: currentRadius
        },
        {
          left: `${last.left}px`,
          top: `${last.top}px`,
          width: `${last.width}px`,
          height: `${last.height}px`,
          borderRadius: getComputedStyle(device).borderRadius
        }
      ],
      { duration: 340, easing: ease, fill: 'both' }
    );
    animation.addEventListener('finish', cleanup);
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => show(trigger));
  });

  $('[data-lightbox-close]', lightbox)?.addEventListener('click', hide);
  closeButton.addEventListener('click', hide);

  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
      return;
    }
    // The close button is the only focusable control inside the dialog.
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });
}
