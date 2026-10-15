/* Kirra Services V2 — interactions */
(function () {
  'use strict';
  var doc = document, body = doc.body, win = window;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  var header = $('.header');
  function onScroll() { header.classList.toggle('scrolled', win.scrollY > 40); }

  /* ---------- full-screen menu ---------- */
  var mo = $('#mo'), menuBtn = $('.menu-btn'), closeBtn = $('.mo__close');
  var prims = $$('.mo__p', mo).filter(function (b) { return b.tagName === 'BUTTON'; }), lastFocus = null;
  var wide = function () { return win.innerWidth >= 900; };
  function setPanel(btn, toggle) {
    var was = btn.classList.contains('is-open');
    prims.forEach(function (b) { b.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); });
    if (!(toggle && was)) { btn.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
  }
  function openMenu() {
    lastFocus = doc.activeElement; body.classList.add('menu-open'); menuBtn.setAttribute('aria-expanded', 'true');
    if (wide() && !prims.some(function (b) { return b.classList.contains('is-open'); })) setPanel(prims[0], false);
    setTimeout(function () { closeBtn.focus(); }, 60);
  }
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  prims.forEach(function (b) {
    b.addEventListener('click', function () { setPanel(b, !wide()); });
    b.addEventListener('mouseenter', function () { if (wide()) setPanel(b, false); });
    b.addEventListener('focus', function () { if (wide()) setPanel(b, false); });
  });
  $$('a', mo).forEach(function (a) { a.addEventListener('click', closeMenu); });
  doc.addEventListener('keydown', function (e) {
    if (!body.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'Tab') {
      var f = $$('a, button', mo).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
    }
  });

  /* ---------- hero slider (homepage only) ---------- */
  if ($('.hcopy')) (function () {
  var hero = $('#hero'), hbg = $$('.hs-bg figure'), hcopy = $$('.hcopy'), hbars = $$('.hbars button'), hno = $('#heroNo');
  var hidx = 0, htimer = null, hpaused = reduce, HDUR = 7000, pauseBtn = $('.round--pause');
  hero.style.setProperty('--hdur', (HDUR / 1000) + 's');
  function heroShow(i) {
    hidx = (i + hcopy.length) % hcopy.length;
    hbg.forEach(function (f, k) { f.classList.toggle('is-active', k === hidx); });
    hcopy.forEach(function (c, k) { c.classList.toggle('is-active', k === hidx); c.setAttribute('aria-hidden', k === hidx ? 'false' : 'true'); });
    hbars.forEach(function (b, k) { b.classList.remove('is-active'); b.classList.toggle('is-done', k < hidx); b.setAttribute('aria-current', k === hidx ? 'true' : 'false'); });
    void hero.offsetWidth; // restart the bar animation
    if (hbars[hidx]) hbars[hidx].classList.add('is-active');
    if (hno) hno.textContent = pad(hidx + 1);
  }
  function heroPlay() { clearTimeout(htimer); if (!hpaused) htimer = setTimeout(function () { heroShow(hidx + 1); heroPlay(); }, HDUR); }
  function setPaused(p) {
    hpaused = p; hero.classList.toggle('paused', p);
    pauseBtn.setAttribute('aria-pressed', String(p)); pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    $('use', pauseBtn).setAttribute('href', p ? '#i-play' : '#i-pause');
    heroPlay();
  }
  hbars.forEach(function (b, k) { b.addEventListener('click', function () { heroShow(k); heroPlay(); }); });
  $('.round--prev', hero).addEventListener('click', function () { heroShow(hidx - 1); heroPlay(); });
  $('.round--next', hero).addEventListener('click', function () { heroShow(hidx + 1); heroPlay(); });
  pauseBtn.addEventListener('click', function () { setPaused(!hpaused); });
  // pause while the visitor is using the form
  $('#hero-form-card').addEventListener('focusin', function () { if (!hpaused) { clearTimeout(htimer); hero.classList.add('paused'); } });
  $('#hero-form-card').addEventListener('focusout', function () { if (!hpaused) { hero.classList.remove('paused'); heroShow(hidx); heroPlay(); } });
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) clearTimeout(htimer); else heroPlay(); });
  heroShow(0); setPaused(hpaused);
  })();

  /* ---------- tabs ---------- */
  // each tab list is independent (inner pages can have several)
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function selectTab(t, focus) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { selectTab(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { selectTab(tabs[(k + n + tabs.length) % tabs.length], true); e.preventDefault(); }
      });
    });
  });

  /* ---------- count-up ---------- */
  var counters = $$('[data-count]');
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var end = +el.getAttribute('data-count'), start = end > 1000 && end < 2100 ? end - 40 : 0, t0 = null, dur = 1600;
    var fmt = function (v) { return end >= 1000 && end !== 2017 ? v.toLocaleString('en-AU') : String(v); };
    if (reduce) { el.textContent = fmt(end); return; }
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(start + (end - start) * e)); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(end); }
    requestAnimationFrame(step);
    setTimeout(function () { el.textContent = fmt(end); }, dur + 200); // fallback if rAF is throttled
  }

  /* ---------- headline mask reveals ---------- */
  function eachWord(root, fn) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) { if (!t) return; frag.appendChild(/^\s+$/.test(t) ? doc.createTextNode(t) : fn(t)); });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(root);
  }
  var masks = $$('h2, .hcopy h1, .hcopy .d, .phero h1');
  masks.forEach(function (h) { var i = 0; eachWord(h, function (t) { var o = doc.createElement('span'); o.className = 'rw'; var s = doc.createElement('span'); s.textContent = t; s.style.setProperty('--i', i++); o.appendChild(s); return o; }); });
  $$('.hcopy, .phero__copy').forEach(function (c) { c.classList.add('in'); });

  /* ---------- reveals ---------- */
  var rv = $$('.rv').concat($$('h2'));
  function sweep() {
    var vh = win.innerHeight;
    rv.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in'); });
    counters.forEach(function (el) { if (!el.dataset.done && el.getBoundingClientRect().top < vh * 0.9) countUp(el); });
  }
  if ('IntersectionObserver' in win) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---------- sliders ---------- */
  $$('[data-slider]').forEach(function (sl) {
    var track = $('.strack', sl); if (!track) return;
    var slides = $$('.slide', track), center = sl.hasAttribute('data-center');
    var sec = sl.closest('section'), ctl = sec ? $('[data-ctl]', sec) : null;
    var prev = ctl && $('.arrow--prev', ctl), next = ctl && $('.arrow--next', ctl), count = ctl && $('.scount', ctl);
    var bar = $('.sbar i', sl), idx = 0;
    function padL() { return parseFloat(getComputedStyle(track).paddingLeft) || 0; }
    function nearest() {
      var tr = track.getBoundingClientRect(), ref = center ? tr.left + tr.width / 2 : tr.left + padL(), best = 0, bd = 1e9;
      slides.forEach(function (s, k) { var r = s.getBoundingClientRect(), p = center ? r.left + r.width / 2 : r.left, d = Math.abs(p - ref); if (d < bd) { bd = d; best = k; } });
      return best;
    }
    function targetFor(k) {
      var tr = track.getBoundingClientRect(), r = slides[k].getBoundingClientRect();
      return track.scrollLeft + (center ? (r.left + r.width / 2) - (tr.left + tr.width / 2) : r.left - (tr.left + padL()));
    }
    function update() {
      idx = nearest();
      var max = track.scrollWidth - track.clientWidth, x = track.scrollLeft;
      if (bar) { var view = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1, pct = max > 0 ? x / max : 0; bar.style.width = Math.max(10, Math.min(100, view * 100)) + '%'; bar.style.transform = 'translateX(' + (pct * (100 / Math.max(view, 0.1) - 100)) + '%)'; }
      if (center) slides.forEach(function (s, k) { s.classList.toggle('is-center', k === idx); });
      if (prev) prev.disabled = center ? idx <= 0 : x <= 2;
      if (next) next.disabled = center ? idx >= slides.length - 1 : x >= max - 2;
      if (count) count.textContent = pad(Math.min(slides.length, idx + 1)) + ' / ' + pad(slides.length);
    }
    function go(k) { k = Math.max(0, Math.min(slides.length - 1, k)); track.scrollTo({ left: targetFor(k), behavior: reduce ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(idx + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(idx - 1); e.preventDefault(); } });
    win.addEventListener('resize', update);
    var down = false, sx = 0, s0 = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || track.scrollWidth <= track.clientWidth + 4) return; down = true; moved = 0; sx = e.clientX; s0 = track.scrollLeft; });
    win.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) { track.classList.add('dragging'); track.scrollLeft = s0 - dx; } });
    win.addEventListener('pointerup', function () { if (!down) return; down = false; if (track.classList.contains('dragging')) { track.classList.remove('dragging'); go(nearest()); } });
    track.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    $$('img', track).forEach(function (i) { i.setAttribute('draggable', 'false'); });
    update();
    win.addEventListener('load', function () { if (center) { track.scrollLeft = targetFor(0); } update(); });
  });

  /* ---------- video facades ---------- */
  $$('.vcard[data-yt] .vcard__play').forEach(function (b) {
    b.addEventListener('click', function () {
      var fig = b.closest('.vcard'), id = fig.getAttribute('data-yt'), f = doc.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = b.getAttribute('aria-label').replace('Play video: ', '');
      f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
      b.replaceWith(f);
    });
  });

  /* ---------- marquees ---------- */
  $$('[data-marq]').forEach(function (m) {
    var row = $('.marq__row', m); if (!row) return;
    Array.prototype.slice.call(row.children).forEach(function (c) { var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); $$('img', k).forEach(function (i) { i.alt = ''; }); row.appendChild(k); });
  });

  /* ---------- forms (mockup) ---------- */
  $$('form[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', f).forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.style.borderColor = bad ? '#E48200' : ''; if (bad) ok = false; });
      if (!ok) return;
      var card = f.closest('.form-card');
      if (card) card.classList.add('sent'); else f.innerHTML = '<p><strong style="color:#fff">Thanks, you\'re subscribed (mockup).</strong></p>';
    });
  });

  /* ---------- interactive map (Leaflet; Esri dark canvas — keyless, works from file://) ---------- */
  var offices = {
    canberra:  { name: 'Canberra (head office)', addr: '1/19 Barry Drive, Turner ACT 2612', ll: [-35.2655, 149.1300], hq: true, dir: 'left' },
    darwin:    { name: 'Darwin', addr: 'Level 4 and 5, 66 Smith St, Darwin City NT 0800', ll: [-12.4634, 130.8456] },
    melbourne: { name: 'Melbourne', addr: 'Level 19, 180 Lonsdale St, Melbourne VIC 3000', ll: [-37.8115, 144.9680] },
    sydney:    { name: 'Sydney', addr: '60 Martin Pl, Sydney NSW 2000', ll: [-33.8680, 151.2111] },
    brisbane:  { name: 'Brisbane', addr: '470 Pauls Terrace, Fortitude Valley QLD 4006', ll: [-27.4570, 153.0340] },
    perth:     { name: 'Perth', addr: 'Level 29, 221 St Georges Terrace, Perth WA 6000', ll: [-31.9567, 115.8572] }
  };
  var info = $('#mapinfo'), chips = $$('.mchip'), map, pendingOffice = null;
  var onLocations = /locations\.html/.test(win.location.pathname);
  function showOffice(key, fly) {
    var o = offices[key]; if (!o || !info) return;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-office') === key ? 'true' : 'false'); });
    info.innerHTML = '<strong>' + o.name + '</strong>' + o.addr + '<br><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Kirra Services ' + o.addr) + '" target="_blank" rel="noopener">Get directions</a> &nbsp;·&nbsp; <a href="' + (onLocations ? '' : 'locations.html') + '#' + key + '">' + o.name.split(' (')[0] + ' office details</a>';
    if (map && fly) map.flyTo(o.ll, 11, { duration: 1.4 });
    if (!map && fly) pendingOffice = key;
  }
  win.kirraShowOffice = function (key) { showOffice(key, true); };
  chips.forEach(function (c) { c.addEventListener('click', function () { showOffice(c.getAttribute('data-office'), true); }); });
  showOffice('canberra', false);
  function initMap() {
    var el = $('#kirra-map'); if (!win.L) return;
    el.innerHTML = '';
    map = L.map(el, { scrollWheelZoom: false }).setView([-27, 134], win.innerWidth < 700 ? 3 : 4);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles &copy; Esri, HERE, Garmin, OpenStreetMap contributors' }).addTo(map);
    Object.keys(offices).forEach(function (k) {
      var o = offices[k];
      var icon = L.divIcon({ className: '', html: '<div class="pin' + (o.hq ? ' pin--hq' : '') + '"></div>', iconSize: o.hq ? [26, 26] : [18, 18], iconAnchor: o.hq ? [13, 13] : [9, 9] });
      var m = L.marker(o.ll, { icon: icon, title: o.name, keyboard: true }).addTo(map);
      m.bindTooltip(o.name.split(' (')[0], { permanent: true, direction: o.dir || 'right', offset: [o.dir ? -14 : 12, 0], className: 'pin-label' });
      m.on('click', function () { showOffice(k, true); });
    });
    if (pendingOffice) { map.setView(offices[pendingOffice].ll, 11); pendingOffice = null; }
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
  }
  var mapEl = $('#map'), mapStarted = false;
  function startMap() {
    if (mapStarted) return; mapStarted = true;
    if (win.L) { initMap(); return; }
    var css = doc.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; doc.head.appendChild(css);
    var s = doc.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = initMap;
    s.onerror = function () { var f = $('.map-fallback'); if (f) f.textContent = 'The map could not load. Find us at 1/19 Barry Drive, Turner ACT 2612.'; };
    doc.head.appendChild(s);
  }
  function checkMap() { if (mapEl && !mapStarted &&mapEl.getBoundingClientRect().top < win.innerHeight + 700) startMap(); }

  /* ---------- scroll loop (timer-throttled; no rAF dependency) ---------- */
  var lastRun = 0, trail = null;
  function runScroll() { lastRun = Date.now(); onScroll(); sweep(); checkMap(); }
  win.addEventListener('scroll', function () { if (Date.now() - lastRun > 40) runScroll(); else { clearTimeout(trail); trail = setTimeout(runScroll, 60); } }, { passive: true });
  win.addEventListener('resize', runScroll);
  win.addEventListener('load', runScroll);
  runScroll();
})();

/* main menu dropdowns: click / tap / keyboard (hover handled in CSS) */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.mainnav .has-dd'));
  function closeAll(except) { items.forEach(function (li) { if (li !== except) { li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false'); } }); }
  items.forEach(function (li) {
    var btn = li.firstElementChild;
    if (btn.tagName !== 'BUTTON') return; // inner-page menu: the label is a link to the parent page; hover/focus opens the dropdown
    btn.addEventListener('click', function () { var open = !li.classList.contains('open'); closeAll(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.mainnav')) closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var o = document.querySelector('.mainnav .has-dd.open'); closeAll(); if (o) o.firstElementChild.focus(); } });
})();

/* ===================== inner pages ===================== */
(function () {
  'use strict';
  var doc = document, win = window;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* sticky "on this page" bar: highlight the section in view */
  var bar = $('.subnav__list');
  if (bar) {
    var links = $$('a[href^="#"]', bar), secs = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); });
    var current = null;
    var spy = function () {
      var line = (parseFloat(getComputedStyle(doc.documentElement).getPropertyValue('--hdr-h')) || 80) + 110, k = -1;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) k = i; });
      var a = links[k] || null;
      if (a === current) return;
      if (current) current.classList.remove('is-active');
      current = a;
      if (a) {
        a.classList.add('is-active');
        var l = a.offsetLeft - bar.offsetLeft, target = l - (bar.clientWidth - a.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, target), behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    var t = null;
    win.addEventListener('scroll', function () { if (!t) t = setTimeout(function () { t = null; spy(); }, 80); }, { passive: true });
    win.addEventListener('load', spy); spy();
  }

  /* jobs board: live filter by keyword + location */
  var jform = $('#jfilter');
  if (jform) {
    var kw = $('#jf-kw', jform), loc = $('#jf-loc', jform), rows = $$('.jrow'), jchips = $$('.jchip[data-loc]'), count = $('.jcount'), empty = $('.jempty');
    var apply = function () {
      var q = kw.value.trim().toLowerCase(), l = loc.value, n = 0;
      rows.forEach(function (r) {
        var ok = (!q || r.textContent.toLowerCase().indexOf(q) > -1) && (!l || (r.getAttribute('data-loc') || '').indexOf(l) > -1);
        r.hidden = !ok; if (ok) n++;
      });
      jchips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-loc') === l)); });
      count.textContent = n + (n === 1 ? ' role' : ' roles') + (q || l ? ' match your search' : ' open right now');
      empty.hidden = n > 0;
    };
    var p = new URLSearchParams(win.location.search);
    if (p.get('kw')) kw.value = p.get('kw');
    if (p.get('loc')) loc.value = p.get('loc');
    kw.addEventListener('input', apply);
    loc.addEventListener('change', apply);
    jform.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    jchips.forEach(function (c) { c.addEventListener('click', function () { loc.value = c.getAttribute('data-loc'); apply(); }); });
    apply();
  }

  /* vendor finder: search + A–Z */
  var vq = $('#vq');
  if (vq) {
    var items = $$('.vlist li'), letters = $$('.vletters button'), vcount = $('.vcount'), vempty = $('.vempty'), letter = '';
    var vapply = function () {
      var q = vq.value.trim().toLowerCase(), n = 0;
      items.forEach(function (li) {
        var name = li.textContent.toLowerCase();
        var ok = (!q || name.indexOf(q) > -1) && (!letter || name.charAt(0) === letter || (letter === '#' && !/[a-z]/.test(name.charAt(0))));
        li.hidden = !ok; if (ok) n++;
      });
      letters.forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-l') || '') === letter)); });
      vcount.textContent = 'Showing ' + n + ' of ' + items.length + ' vendors';
      vempty.hidden = n > 0;
    };
    vq.addEventListener('input', vapply);
    letters.forEach(function (b) { b.addEventListener('click', function () { letter = b.getAttribute('data-l') || ''; vapply(); }); });
    vapply();
  }

  /* Kirra Academy: filter courses by stream */
  var cf = $$('.cfilter .jchip');
  if (cf.length) {
    var courses = $$('.course');
    cf.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat');
        cf.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        courses.forEach(function (c) { c.hidden = cat !== 'all' && (' ' + c.getAttribute('data-cat') + ' ').indexOf(' ' + cat + ' ') < 0; });
      });
    });
  }

  /* local time at each office (DST handled by the browser) */
  var clocks = $$('[data-tz]');
  if (clocks.length && win.Intl) {
    var tick = function () {
      clocks.forEach(function (el) {
        try { el.textContent = new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: el.getAttribute('data-tz') }).format(new Date()).replace(/\s/g, ' '); } catch (e) {}
      });
    };
    tick(); setInterval(tick, 30000);
  }

  /* "Show on map" buttons fly the map to that office */
  $$('[data-show-office]').forEach(function (b) {
    b.addEventListener('click', function () {
      var key = b.getAttribute('data-show-office'), m = doc.getElementById('map');
      if (m) m.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(function () { if (win.kirraShowOffice) win.kirraShowOffice(key); }, reduce ? 0 : 700);
    });
  });

  /* "Enquire about …" buttons pre-fill the Get in Touch form */
  $$('[data-enquire]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var topic = b.getAttribute('data-enquire'), sel = $('#cf-topic'), msg = $('#cf-msg');
      if (!sel) return;
      e.preventDefault();
      var opt = $$('option', sel).filter(function (o) { return o.textContent === topic; })[0];
      if (!opt) { opt = doc.createElement('option'); opt.textContent = topic; sel.appendChild(opt); }
      sel.value = topic;
      if (msg && !msg.value) msg.placeholder = 'Tell us a little about your ' + topic.toLowerCase() + ' needs…';
      $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(function () { var n = $('#cf-name'); if (n) n.focus({ preventScroll: true }); }, reduce ? 0 : 800);
    });
  });
})();
