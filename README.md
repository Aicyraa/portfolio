# portfolio

Personal portfolio for Darlwyn Jee F. Daguman (Aicyraa). One page, plain HTML, CSS and vanilla JavaScript.

## Structure

```
index.html          Markup only (inline SVG sprite stays with the markup)
src/css/            Styles split by page section, loaded in dependency order
  base.css            tokens and global base styles
  navigation.css      nav bar, progress bar and back-to-top
  hero.css            hero and portrait
  about.css           about section
  skills.css          nobori banner wall
  education.css       education record
  projects.css        project cards, device frames and lightbox
  goals.css           career goal path
  contact.css         contact board and footer
  motion.css          reveal and motion rules
  responsive.css      breakpoints and reduced-motion fallbacks
src/js/             ES modules, one feature per file
  boot.js             sets the `js` class before first paint
  main.js             entry point that initialises each feature
  navigation.js       scroll progress, nav state, goal path, scrollspy, menu
  reveal.js           intersection-based reveal
  portrait.js         tilt, katana slash, quote cycle and the one-time tip
  projects.js         device-frame screenshots and the FLIP lightbox
  contact.js          client-side form validation
  utils.js            shared selectors and media queries
assets/
  pfp.jpeg            portrait illustration
  projects/           real screenshots of the four deployed projects
```

## Serving

The JavaScript uses ES modules, so open the page through a local server rather than `file://`:

```sh
python3 -m http.server 8765
```

Then visit <http://127.0.0.1:8765/index.html>.
