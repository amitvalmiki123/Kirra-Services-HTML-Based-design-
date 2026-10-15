/* Kirra Services V3: office directory + map (Leaflet, Esri light grey base + labels; keyless, works from file://) */
(function () {
  'use strict';
  var root = document.getElementById('offices-map'); if (!root) return;
  var doc = document, win = window;
  var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var offices = [
    { key: 'canberra',  name: 'Canberra',  hq: true, addr: '1/19 Barry Drive, Turner ACT 2612', ll: [-35.2655, 149.1300], left: true },
    { key: 'darwin',    name: 'Darwin',    addr: 'Level 4 and 5, 66 Smith St, Darwin City NT 0800', ll: [-12.4634, 130.8456] },
    { key: 'melbourne', name: 'Melbourne', addr: 'Level 19, 180 Lonsdale St, Melbourne VIC 3000', ll: [-37.8115, 144.9680] },
    { key: 'sydney',    name: 'Sydney',    addr: '60 Martin Pl, Sydney NSW 2000', ll: [-33.8680, 151.2111], left: true },
    { key: 'brisbane',  name: 'Brisbane',  addr: '470 Pauls Terrace, Fortitude Valley QLD 4006', ll: [-27.4570, 153.0340], left: true },
    { key: 'perth',     name: 'Perth',     addr: 'Level 29, 221 St Georges Terrace, Perth WA 6000', ll: [-31.9567, 115.8572] }
  ];
  var byKey = {}; offices.forEach(function (o, i) { o.no = (i < 9 ? '0' : '') + (i + 1); byKey[o.key] = o; });
  var items = Array.prototype.slice.call(root.querySelectorAll('.oitem'));
  var card = root.querySelector('.ocard'), allBtn = root.querySelector('.omap__all');
  var map = null, markers = {}, bounds = null, active = 'canberra';

  function renderCard(o) {
    var q = encodeURIComponent('Kirra Services, ' + o.addr);
    card.innerHTML =
      '<p class="ocard__k"><span>' + o.no + '</span>' + (o.hq ? 'Head office' : 'Office') + '</p>' +
      '<h3>' + o.name + '</h3>' +
      '<p class="ocard__a">' + o.addr + '</p>' +
      '<div class="ocard__btns"><a class="btn btn--cta" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + q + '" target="_blank" rel="noopener">Get directions</a>' +
      '<a class="btn btn--ghost" href="tel:+61261966999">+61 2 6196 6999</a></div>' +
      '<a class="ocard__more" href="locations.html#' + o.key + '">' + o.name + ' office details →</a>';
  }
  function pin(o, on) {
    return L.divIcon({ className: 'opin-wrap', html: '<span class="opin' + (on ? ' is-on' : '') + '"><b>' + o.no + '</b></span>', iconSize: [40, 40], iconAnchor: [20, 48], tooltipAnchor: [0, -28] });
  }
  // keep the pins clear of the office card (top-left on desktop) and the button (top-right)
  function fitOpts() { var wide = win.innerWidth >= 1000; return { paddingTopLeft: [wide ? 36 : 30, wide ? 70 : 60], paddingBottomRight: [wide ? 36 : 30, 30] }; }
  function select(key, fly) {
    var o = byKey[key]; if (!o) return;
    active = key;
    items.forEach(function (b) { var on = b.getAttribute('data-office') === key; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    renderCard(o);
    if (!map) return;
    offices.forEach(function (x) { markers[x.key].setIcon(pin(x, x.key === key)); markers[x.key].setZIndexOffset(x.key === key ? 1000 : 0); });
    if (fly) map.flyTo(o.ll, 13, { duration: reduce ? 0 : 1.3 });
  }
  items.forEach(function (b) { b.addEventListener('click', function () { select(b.getAttribute('data-office'), true); }); });
  allBtn.addEventListener('click', function () { if (map) map.flyToBounds(bounds, Object.assign(fitOpts(), { duration: reduce ? 0 : 1.2 })); });
  select('canberra', false);

  function init() {
    var el = doc.getElementById('omap'); if (!win.L || !el) return;
    el.innerHTML = '';
    map = L.map(el, { scrollWheelZoom: false, zoomControl: false, minZoom: 3 });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    var esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
    L.tileLayer(esri + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles &copy; Esri, HERE, Garmin, OpenStreetMap contributors' }).addTo(map);
    L.tileLayer(esri + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, minZoom: 9 }).addTo(map);
    bounds = L.latLngBounds(offices.map(function (o) { return o.ll; }));
    map.fitBounds(bounds, fitOpts());
    offices.forEach(function (o) {
      var m = L.marker(o.ll, { icon: pin(o, o.key === active), title: o.name + (o.hq ? ' head office' : ' office'), keyboard: true, riseOnHover: true }).addTo(map);
      m.bindTooltip(o.name + (o.hq ? ' · HQ' : ''), { direction: o.left ? 'left' : 'right', offset: [o.left ? -18 : 18, 0], className: 'olabel', permanent: true });
      m.on('click', function () { select(o.key, true); });
      markers[o.key] = m;
    });
    map.on('click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
    select(active, false);
  }
  var started = false;
  function start() {
    if (started) return; started = true;
    if (win.L) { init(); return; }
    var css = doc.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; doc.head.appendChild(css);
    var s = doc.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = init;
    s.onerror = function () { var f = root.querySelector('.map-fallback'); if (f) f.textContent = 'The map could not load. Find us at 1/19 Barry Drive, Turner ACT 2612.'; };
    doc.head.appendChild(s);
  }
  function near() { if (!started && root.getBoundingClientRect().top < win.innerHeight + 700) start(); }
  win.addEventListener('scroll', near, { passive: true });
  win.addEventListener('load', near);
  near();
})();
