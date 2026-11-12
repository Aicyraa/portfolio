/* ============================================================
   PORTRAIT
   Pointer tilt, glare, katana slash and the quote cycle.
   ============================================================ */
import { $, canTilt, reduceMotion } from './utils.js';

const lines = [
  'Sharpen the mind before the blade, and the code before the commit.',
  'Fall seven times, commit eight; the eighth attempt is where the build finally passes.',
  'The error message is a teacher. Read it twice, then read the stack trace once more.',
  'A quiet terminal hides a busy mind, and a clean diff hides a long afternoon.',
  'Walk the path even when the build is red; the next green run is the only answer.'
];

export function initPortrait() {
  const portrait = $('#portrait');
  const quote = $('#quote');
  let lineIndex = 0;

  if (!portrait) return;

  const frame = $('.frame', portrait);
  const slash = $('.slash path', portrait);
  const flash = $('.flash', portrait);
  const tip = $('.portrait-tip', portrait);

  function dismissTip() {
    if (tip) tip.classList.add('is-gone');
  }

  if (canTilt.matches && !reduceMotion.matches) {
    portrait.addEventListener('pointermove', event => {
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portrait.style.setProperty('--ry', `${x * 8}deg`);
      portrait.style.setProperty('--rx', `${-y * 8}deg`);
      portrait.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      portrait.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    portrait.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--rx', '0deg');
      portrait.style.setProperty('--ry', '0deg');
    });
  }

  function drawBlade() {
    dismissTip();
    if (frame && slash && flash && !reduceMotion.matches) {
      // Web Animations API: independent transform properties compose with the CSS tilt.
      slash.animate(
        [
          { strokeDashoffset: 1, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, offset: 0.55 },
          { strokeDashoffset: -1, opacity: 0 }
        ],
        { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
      flash.animate(
        [{ opacity: 0.86 }, { opacity: 0 }],
        { duration: 280, easing: 'ease-out' }
      );
      frame.animate(
        [
          { translate: '0 0' }, { translate: '-4px 2px' }, { translate: '4px -2px' },
          { translate: '-2px 1px' }, { translate: '0 0' }
        ],
        { duration: 230, easing: 'ease-out' }
      );
    }
    if (quote) quote.textContent = `${lines[lineIndex++ % lines.length]}`;
  }

  portrait.addEventListener('click', drawBlade);
  portrait.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      drawBlade();
    }
  });
}
