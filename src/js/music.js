/* ============================================================
   MUSIC
   Floating playlist pill. The Spotify iFrame API is loaded only
   on the first open, and playback starts when the panel opens.
   ============================================================ */
import { $ } from './utils.js';

export function initMusicPlayer() {
  const root = $('#music');
  if (!root) return;

  const toggle = $('#music-toggle');
  const panel = $('#music-panel');
  const close = $('#music-close');
  const frame = $('#music-frame');
  if (!toggle || !panel || !close || !frame) return;

  const embedUrl = frame.dataset.src;
  const playlistUrl = frame.dataset.url;
  let controller = null;
  let apiLoading = false;
  let fallbackUsed = false;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setPlaying = playing => root.classList.toggle('is-playing', playing);

  function createIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = 'Spotify playlist';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    frame.append(iframe);
  }

  // If the API cannot load, keep the player usable without autoplay.
  function mountFallback() {
    if (fallbackUsed) return;
    fallbackUsed = true;
    createIframe();
  }

  function mountPlayer() {
    if (controller || apiLoading || fallbackUsed) return;
    apiLoading = true;

    window.onSpotifyIframeApiReady = IFrameAPI => {
      const mount = document.createElement('div');
      frame.append(mount);

      IFrameAPI.createController(
        mount,
        { url: playlistUrl, width: '100%', height: 352 },
        embed => {
          controller = embed;
          apiLoading = false;
          const iframe = frame.querySelector('iframe');
          if (iframe) iframe.title = 'Spotify playlist';
          // Only start audio while the panel is actually open.
          embed.addListener('ready', () => {
            if (isOpen()) embed.play();
          });
          // The equalizer follows the real player state, including the
          // controls inside the Spotify embed.
          embed.addListener('playback_started', () => setPlaying(true));
          embed.addListener('playback_update', event => setPlaying(!event.data.isPaused));
        }
      );
    };

    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = () => {
      apiLoading = false;
      mountFallback();
    };
    document.body.append(script);
  }

  function open() {
    if (isOpen()) return;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    close.focus();
    mountPlayer();
    if (controller) controller.play();
  }

  function closePanel(returnFocus = true) {
    if (!isOpen()) return;
    if (controller) controller.pause();
    setPlaying(false);
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (isOpen()) closePanel();
    else open();
  });

  close.addEventListener('click', () => closePanel());

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanel();
  });

  document.addEventListener('click', event => {
    if (isOpen() && !root.contains(event.target)) closePanel(false);
  });
}
