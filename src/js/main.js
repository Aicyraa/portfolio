/* ============================================================
   ENTRY POINT
   Wires the independent features together once the DOM is parsed.
   ============================================================ */
import { $ } from './utils.js';
import { initNavigation } from './navigation.js';
import { initReveal } from './reveal.js';
import { initPortrait } from './portrait.js';
import { initContactForm } from './contact.js';
import { initProjectLightbox } from './projects.js';
import { initMusicPlayer } from './music.js';

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

initNavigation();
initReveal();
initPortrait();
initContactForm();
initProjectLightbox();
initMusicPlayer();
