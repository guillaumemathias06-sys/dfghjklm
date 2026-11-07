(function () {
  'use strict';

  // Apparition des blocs : si le script du site n'a pas pris la main, on le fait ici.
  var els = Array.prototype.slice.call(document.querySelectorAll('.la-anniv [data-r]'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add('in'); });
  }

  // En-tête opaque au défilement (si le script du site est absent).
  var hdr = document.getElementById('hdr');
  if (hdr && !window.__laAnnivHdr) {
    window.__laAnnivHdr = true;
    var f = function () { hdr.classList.toggle('solid', (window.scrollY || 0) > 60); };
    window.addEventListener('scroll', f, { passive: true });
    f();
  }

  // Invitation : partager, copier, imprimer.
  var box = document.querySelector('.inv-actions');
  if (box) {
    var url = box.getAttribute('data-share-url');
    var text = box.getAttribute('data-share-text');
    var msg = document.getElementById('invMsg');
    var say = function (t) { if (msg) { msg.textContent = t; } };
    var copy = function () {
      var done = function () { say('Lien copié. Collez-le dans un message aux parents des invités.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text + ' ' + url).then(done, function () { say('Copiez ce lien : ' + url); });
      } else {
        say('Copiez ce lien : ' + url);
      }
    };
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-inv]');
      if (!b) { return; }
      var a = b.getAttribute('data-inv');
      if (a === 'print') { window.print(); }
      if (a === 'copy') { copy(); }
      if (a === 'share') {
        if (navigator.share) {
          navigator.share({ title: document.title, text: text, url: url }).catch(function (err) { if (!err || err.name !== 'AbortError') { copy(); } });
        } else {
          copy();
        }
      }
    });
  }
})();
