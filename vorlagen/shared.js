// Gemeinsame Funktionen für alle Vorlagen:
// - Leiste "Zurück zur Übersicht" (ausblendbar über ?clean)
// - Farbwähler für die Akzentfarbe (setzt --accent und --accent-ink)
// - sanfte Einblend-Animation für Elemente mit .rv
(function () {
  var params = new URLSearchParams(location.search);
  var clean = params.has('clean');

  var colors = [
    { name: 'Graphit', c: '#2b2b2b', ink: '#ffffff' },
    { name: 'Sand', c: '#b49a78', ink: '#1d1a16' },
    { name: 'Salbei', c: '#7d8c78', ink: '#ffffff' },
    { name: 'Nachtblau', c: '#2f3e55', ink: '#ffffff' },
    { name: 'Terrakotta', c: '#b0613f', ink: '#ffffff' },
    { name: 'Weinrot', c: '#7a2430', ink: '#ffffff' },
    { name: 'Petrol', c: '#2d5f63', ink: '#ffffff' }
  ];

  function setAccent(col) {
    document.documentElement.style.setProperty('--accent', col.c);
    document.documentElement.style.setProperty('--accent-ink', col.ink);
    try { localStorage.setItem('vorlage-accent', JSON.stringify(col)); } catch (e) {}
    document.querySelectorAll('.vs-sw').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.c === col.c);
    });
  }

  var css = '' +
    '.vs-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;' +
    'padding:10px 16px;background:rgba(20,20,20,.92);backdrop-filter:blur(8px);color:#f2f0ec;font:500 13px/1.3 Inter,system-ui,sans-serif}' +
    '.vs-bar a{color:#f2f0ec;text-decoration:none;opacity:.85;display:flex;align-items:center;gap:8px}.vs-bar a:hover{opacity:1}' +
    '.vs-cols{display:flex;align-items:center;gap:8px}.vs-cols span{opacity:.7;margin-right:4px}' +
    '.vs-sw{width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;padding:0;transition:transform .2s}' +
    '.vs-sw:hover{transform:scale(1.15)}.vs-sw[aria-pressed=true]{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.25)}' +
    'body{padding-bottom:52px}' +
    '.rv{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s ease}.rv.in{opacity:1;transform:none}' +
    '@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}' +
    '@media (max-width:560px){.vs-name{display:none}}';
  if (clean) css = css.replace(/\.vs-bar\{/, '.vs-bar{display:none!important;').replace('body{padding-bottom:52px}', '');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  document.addEventListener('DOMContentLoaded', function () {
    if (!clean) {
      var bar = document.createElement('div');
      bar.className = 'vs-bar';
      bar.innerHTML = '<a href="../index.html#vorlagen">← <span>Alle Vorlagen</span></a>' +
        '<span class="vs-name">' + (document.body.dataset.vorlage || '') + '</span>' +
        '<div class="vs-cols"><span>Farbe testen</span></div>';
      var holder = bar.querySelector('.vs-cols');
      colors.forEach(function (col) {
        var b = document.createElement('button');
        b.className = 'vs-sw';
        b.style.background = col.c;
        b.title = col.name;
        b.setAttribute('aria-label', 'Akzentfarbe ' + col.name);
        b.dataset.c = col.c;
        b.onclick = function () { setAccent(col); };
        holder.appendChild(b);
      });
      document.body.appendChild(bar);
      try {
        var saved = JSON.parse(localStorage.getItem('vorlage-accent'));
        if (saved && saved.c) setAccent(saved);
      } catch (e) {}
    }

    var els = document.querySelectorAll('.rv');
    if (clean || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
    }

    document.querySelectorAll('form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Danke – wir melden uns!'; b.disabled = true; }
      });
    });
  });
})();
