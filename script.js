/* =========================================================
   PORTFOLIO SCRIPT (plain JavaScript, no libraries)
   What this file does:
   1. Small helpers and the toast message
   2. Header style when you scroll
   3. Mobile menu open/close
   4. Highlight the current section in the navigation
   5. Reveal elements as they scroll into view
   6. Placeholder links (explain themselves instead of doing nothing)
   7. Copy email address
   8. Resume preview open/close
   9. Placeholder highlight toggle and footer year
   10. Dark / light theme (saved in localStorage)
   11. Motion: headline word reveals, project image parallax, scroll progress, sliding nav bar, back-to-top
   Smooth scrolling is done ONLY in style.css (scroll-behavior + scroll-padding-top).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Helpers ---------- */
  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toastEl = $('#toast');
  var toastTimer;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 4500);
  }

  /* ---------- 2. Header style when scrolled ---------- */
  var header = $('#site-header');
  var progressEl = $('#scroll-progress');
  var toTop = $('#to-top');
  var heroEl = $('#home');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 16);
      // reading progress along the bottom of the header
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressEl) progressEl.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
      // back-to-top button appears after scrolling down a little
      if (toTop) toTop.classList.toggle('is-show', y > 600);
      updateParallax();
      updateActiveNav();
      ticking = false;
    });
  }

  /* ---------- 3. Mobile menu ---------- */
  var toggle = $('#nav-toggle');
  var nav = $('#site-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var firstLink = $('a', nav);
      if (firstLink) setTimeout(function () { firstLink.focus({ preventScroll: true }); }, 60);
    }
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  // Close after choosing a link (the browser then scrolls to the section)
  $$('a', nav).forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });
  // Escape closes the menu and returns focus to the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  // Tap outside the menu to close it
  document.addEventListener('click', function (event) {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setMenu(false);
    }
  });
  // If the window grows to desktop width, reset the menu
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- 4. Current section in the navigation ---------- */
  var navLinks = $$('a[href^="#"]', nav);
  var sections = $$('main section[id]');
  var currentId = '';

  // A soft pill glides behind the current link on desktop (it is created here so it only exists when JS works)
  var desktopNav = window.matchMedia('(min-width: 861px)');
  var pill = document.createElement('span');
  pill.className = 'nav-pill';
  pill.setAttribute('aria-hidden', 'true');
  nav.appendChild(pill);

  function movePill() {
    var link = $('a[aria-current="true"]', nav);
    if (!link || !desktopNav.matches) { pill.classList.remove('is-ready'); return; }
    pill.style.setProperty('--x', link.offsetLeft + 'px');
    pill.style.setProperty('--w', link.offsetWidth + 'px');
    pill.classList.add('is-ready');
  }

  function setActive(id) {
    if (id === currentId) return;
    currentId = id;
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    movePill();
  }

  // The current section is the last one whose top has passed 40% of the way down the screen.
  function updateActiveNav() {
    var line = window.innerHeight * 0.4;
    var found = sections[0] ? sections[0].id : '';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) found = section.id;
    });
    // At the very bottom of the page, the last section is current.
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length) found = sections[sections.length - 1].id;
    setActive(found);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { onScroll(); movePill(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
  onScroll();

  /* ---------- 4b. Headline word reveal ----------
     Each word is wrapped so it can slide up out of a clipped line. The text stays real text (spaces kept),
     so screen readers and copy/paste are unaffected. */
  function splitWords(el) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    text.split(' ').forEach(function (word, i, all) {
      var outer = document.createElement('span');
      outer.className = 'w';
      var inner = document.createElement('span');
      inner.className = 'wi';
      inner.style.setProperty('--k', i);
      inner.textContent = word;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  var splitEls = $$('[data-split], .split-hero');
  splitEls.forEach(splitWords);

  // The hero headline plays as soon as fonts are ready (no waiting on scrolling)
  var heroTitle = $('.split-hero');
  if (heroTitle) {
    var playHero = function () { window.requestAnimationFrame(function () { heroTitle.classList.add('is-split-visible'); }); };
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(playHero); setTimeout(playHero, 900); } else { playHero(); }
  }

  /* ---------- 4c. Project image parallax (only images near the screen are updated) ---------- */
  var parallaxImgs = $$('[data-parallax]');
  var parallaxLive = [];
  function updateParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    parallaxLive.forEach(function (img) {
      var box = img.parentElement.getBoundingClientRect();
      var progress = (box.top + box.height / 2 - vh / 2) / vh; // about -1 to 1
      img.style.setProperty('--py', (progress * -18).toFixed(1) + 'px');
    });
  }
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var parallaxObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = parallaxLive.indexOf(entry.target);
        if (entry.isIntersecting && i === -1) parallaxLive.push(entry.target);
        if (!entry.isIntersecting && i !== -1) parallaxLive.splice(i, 1);
      });
      updateParallax();
    }, { rootMargin: '10% 0px' });
    parallaxImgs.forEach(function (img) { parallaxObserver.observe(img); });
  }

  /* ---------- 5. Scroll reveal ---------- */
  var revealItems = $$('.reveal, .reveal-media, .skill-group, .link-list li').concat(splitEls.filter(function (el) { return el !== heroTitle; }));
  function showItem(el) { el.classList.add(el.hasAttribute('data-split') ? 'is-split-visible' : 'is-visible'); }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(showItem);
  } else {
    var observer = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Items that appear together get a small stagger (0, 1, 2, ...)
        entry.target.style.setProperty('--i', Math.min(batch, 5));
        showItem(entry.target);
        batch += 1;
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 6. Placeholder links ---------- */
  // Any link that still has data-placeholder explains what to replace instead of leading nowhere.
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[data-placeholder]') : null;
    if (!link) return;
    event.preventDefault();
    showToast('Placeholder link: add ' + link.getAttribute('data-placeholder') + ' in index.html.');
  });

  /* ---------- 7. Copy email address ---------- */
  var copyBtn = $('#copy-email');
  var emailLink = $('#email-link');
  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', function () {
      if (emailLink.hasAttribute('data-placeholder')) {
        showToast('Placeholder link: add your email address in index.html.');
        return;
      }
      var address = emailLink.getAttribute('href').replace(/^mailto:/i, '').split('?')[0];
      var done = function () { showToast('Copied ' + address); };
      var fail = function () { showToast('Could not copy automatically. Address: ' + address); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(done, fail);
      } else {
        fail();
      }
    });
  }

  /* ---------- 8. Resume preview ---------- */
  var viewerBtn = $('#viewer-toggle');
  var viewer = $('#resume-viewer');
  if (viewerBtn && viewer) {
    var viewerInner = $('.viewer-inner', viewer);
    var pdfObject = $('#resume-object');
    var viewerLabel = $('.viewer-label', viewerBtn);

    viewerBtn.addEventListener('click', function () {
      var open = !viewer.classList.contains('is-open');
      viewer.classList.toggle('is-open', open);
      viewerBtn.setAttribute('aria-expanded', String(open));
      viewerLabel.textContent = open ? 'Hide preview' : 'Preview here';
      if (open) {
        viewerInner.removeAttribute('inert');
        // The PDF is only loaded the first time the viewer opens
        if (!pdfObject.getAttribute('data')) pdfObject.setAttribute('data', pdfObject.getAttribute('data-src'));
        setTimeout(function () {
          viewer.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }, 200);
      } else {
        viewerInner.setAttribute('inert', '');
      }
    });
  }

  /* ---------- 9. Placeholder highlight toggle and footer year ---------- */
  var phToggle = $('#ph-toggle');
  if (phToggle) {
    phToggle.addEventListener('click', function () {
      var highlighted = document.body.classList.contains('show-placeholders');
      document.body.classList.toggle('show-placeholders', !highlighted);
      phToggle.setAttribute('aria-pressed', String(!highlighted));
      phToggle.textContent = highlighted
        ? 'Preview mode. Click to highlight placeholders again.'
        : 'Placeholders highlighted. Click to preview without them.';
    });
  }

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------- 10. Dark / light theme ----------
     The saved choice (or the visitor's system setting) is applied by a tiny script in <head>
     before the page paints. This code keeps the button, labels, and storage in sync. */
  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#071a1d' : '#eef2f0');
    if (themeBtn) {
      var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.setAttribute('title', label);
    }
  }

  function saveTheme(theme) {
    try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked: the theme still changes, it just will not be remembered */ }
  }

  // Switch with a circular reveal where the browser supports it, a soft fade elsewhere, and no motion if reduced motion is on
  function changeTheme(next, x, y) {
    if (reduceMotion) { applyTheme(next); return; }
    if (document.startViewTransition) {
      var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var transition = document.startViewTransition(function () { applyTheme(next); });
      transition.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 600, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () { /* if the animation cannot start, the theme has still changed */ });
    } else {
      root.classList.add('theme-fade');
      applyTheme(next);
      setTimeout(function () { root.classList.remove('theme-fade'); }, 500);
    }
  }

  applyTheme(currentTheme()); // make the button label match the theme chosen in <head>

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      var rect = themeBtn.getBoundingClientRect();
      saveTheme(next);
      changeTheme(next, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  // If the visitor never chose a theme, follow their system setting when it changes
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (systemDark.addEventListener) {
    systemDark.addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (saved !== 'dark' && saved !== 'light') applyTheme(e.matches ? 'dark' : 'light');
    });
  }

})();
