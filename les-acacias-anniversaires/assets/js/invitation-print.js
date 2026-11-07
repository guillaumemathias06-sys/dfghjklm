/* Cartons d'invitation à imprimer (PDF) – Les Acacias */
(function () {
  'use strict';

  var D = window.LA_INV;
  var box = document.getElementById('invPrint');
  if (!D || !box) { return; }

  // Carton au format A6 portrait, 300 dpi (105 × 148 mm).
  var W = 1240, H = 1748;
  var C = {
    blue: '#2A5BE6', deep: '#1C3FB0', ink: '#0B1B3F', muted: '#4A5B7F', ice: '#F4F8FF',
    sky: '#BFD6FF', surface2: '#E6EEFF', accent: '#1F45BD', yellow: '#FFB000', yellowInk: '#3B2600', green: '#7CFFB0'
  };
  var DISPLAY = '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif';
  var BODY = '"Instrument Sans", "Helvetica Neue", Arial, sans-serif';

  var $ = function (id) { return document.getElementById(id); };
  var msg = $('ipMsg');
  var say = function (t) { if (msg) { msg.textContent = t; } };

  /* ---------- Chargement des polices et images ---------- */

  var loadImg = function (src) {
    return new Promise(function (res) {
      if (!src) { res(null); return; }
      var im = new Image();
      if (src.indexOf('data:') !== 0) { im.crossOrigin = 'anonymous'; }
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.src = src;
    });
  };
  var fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([
      document.fonts.load('800 100px "Bricolage Grotesque"'),
      document.fonts.load('600 40px "Instrument Sans"'),
      document.fonts.load('400 40px "Instrument Sans"'),
      document.fonts.load('700 40px "Instrument Sans"')
    ]).catch(function () {})
    : Promise.resolve();
  var assets = Promise.all([loadImg(D.photo), loadImg(D.logo), fontsReady]);

  /* ---------- Outils de dessin ---------- */

  var rr = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  var star = function (ctx, cx, cy, r, color, rot) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot || 0);
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rad = i % 2 ? r * 0.45 : r;
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  };
  var spaced = function (ctx, text, x, y, spacing) { // texte centré avec espacement des lettres
    var chars = text.split(''), widths = chars.map(function (c) { return ctx.measureText(c).width; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + spacing * (chars.length - 1);
    var cx = x - total / 2;
    ctx.textAlign = 'left';
    chars.forEach(function (c, i) { ctx.fillText(c, cx, y); cx += widths[i] + spacing; });
    ctx.textAlign = 'center';
  };
  var wrap = function (ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else { line = t; }
    });
    if (line) { lines.push(line); }
    return lines;
  };
  var fitFont = function (ctx, text, weight, family, max, min, maxW) {
    var size = max;
    do { ctx.font = weight + ' ' + size + 'px ' + family; size -= 4; } while (ctx.measureText(text).width > maxW && size > min);
    return size + 4;
  };
  var cover = function (ctx, im, x, y, w, h, focusY) {
    var s = Math.max(w / im.width, h / im.height);
    var sw = w / s, sh = h / s;
    var sx = (im.width - sw) / 2, sy = (im.height - sh) * (focusY == null ? 0.5 : focusY);
    ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h);
  };

  /* ---------- Le carton ---------- */

  var draw = function (cv, guest, opts, photo, logo) {
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var M = 70; // marge intérieure
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    // Fond
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);

    // Bandeau de couleurs en haut
    var cols = [C.blue, C.yellow, C.green, C.sky];
    for (var i = 0, x = 0; x < W; i++, x += 62) { ctx.fillStyle = cols[i % 4]; ctx.fillRect(x, 0, 62, 26); }

    // Photo
    var py = 70, ph = 430;
    ctx.save();
    rr(ctx, M, py, W - 2 * M, ph, 48); ctx.clip();
    if (photo) {
      cover(ctx, photo, M, py, W - 2 * M, ph, 0.6);
      var g = ctx.createLinearGradient(0, py + ph * 0.45, 0, py + ph);
      g.addColorStop(0, 'rgba(28,63,176,0)'); g.addColorStop(1, 'rgba(28,63,176,.55)');
      ctx.fillStyle = g; ctx.fillRect(M, py, W - 2 * M, ph);
    } else {
      var g2 = ctx.createLinearGradient(0, py, 0, py + ph);
      g2.addColorStop(0, C.blue); g2.addColorStop(1, C.deep);
      ctx.fillStyle = g2; ctx.fillRect(M, py, W - 2 * M, ph);
    }
    ctx.restore();

    // Univers sur la photo
    ctx.font = '700 38px ' + BODY;
    var ut = D.univers, uw = ctx.measureText(ut).width + 64;
    rr(ctx, M + 34, py + ph - 96, uw, 64, 32); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.fillStyle = C.accent; ctx.textAlign = 'left'; ctx.fillText(ut, M + 34 + 32, py + ph - 51); ctx.textAlign = 'center';

    // Pastille âge
    var bx = W - M - 110, by = py + ph - 50, br = 108;
    ctx.save();
    ctx.translate(bx, by); ctx.rotate(-0.14);
    ctx.beginPath(); ctx.arc(0, 0, br, 0, Math.PI * 2); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
    ctx.fillStyle = C.yellowInk;
    ctx.font = '800 ' + (String(D.age).length > 1 ? 104 : 120) + 'px ' + DISPLAY; ctx.fillText(String(D.age), 0, 22);
    ctx.font = '700 34px ' + BODY; ctx.fillText('ans', 0, 66);
    ctx.restore();

    // Étoiles décoratives
    star(ctx, 120, 600, 34, '#FFE3A1', 0.2);
    star(ctx, W - 110, 680, 24, '#FFE3A1', -0.3);

    // Titre
    var y = py + ph + 128;
    ctx.fillStyle = C.accent; ctx.font = '700 34px ' + BODY;
    spaced(ctx, 'TU ES INVITÉ·E À L’ANNIVERSAIRE DE', W / 2, y, 4);

    // Prénom
    var ns = fitFont(ctx, D.prenom, '800', DISPLAY, 210, 90, W - 2 * M - 40);
    y += ns * 0.95 + 10;
    ctx.fillStyle = C.blue; ctx.font = '800 ' + ns + 'px ' + DISPLAY;
    ctx.fillText(D.prenom, W / 2, y);

    // Accroche
    y += 64;
    ctx.fillStyle = C.muted; ctx.font = '400 36px ' + BODY;
    wrap(ctx, D.accroche + ' Puis goûter et bougies !', W - 2 * M - 120).slice(0, 2).forEach(function (l) { ctx.fillText(l, W / 2, y); y += 46; });

    // Blocs d'infos
    y += 14;
    var rows = [
      ['QUAND', [D.date, D.heure], [false, true]],
      ['OÙ', ['Les Acacias'].concat(wrap((ctx.font = '400 34px ' + BODY, ctx), D.adresse, W - 2 * M - 300)), [true]],
      ['À PRÉVOIR', ['Tenue de sport, baskets et une gourde'], []]
    ];
    rows.forEach(function (r) {
      var lines = r[1], hRow = 40 + lines.length * 44;
      rr(ctx, M, y, W - 2 * M, hRow, 26); ctx.fillStyle = C.ice; ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = C.accent; ctx.font = '700 28px ' + BODY;
      ctx.fillText(r[0], M + 32, y + 56);
      lines.forEach(function (l, k) {
        ctx.fillStyle = C.ink; ctx.font = (r[2][k] ? '700 ' : '400 ') + '34px ' + BODY;
        ctx.fillText(l, M + 270, y + 56 + k * 44);
      });
      ctx.textAlign = 'center';
      y += hRow + 14;
    });

    // Pour : … (prénom de l'invité ou ligne à remplir)
    y += 46;
    ctx.textAlign = 'left';
    ctx.fillStyle = C.ink; ctx.font = '700 36px ' + BODY;
    ctx.fillText('Pour :', M + 10, y);
    var px = M + 10 + ctx.measureText('Pour :').width + 18;
    if (guest) {
      ctx.fillStyle = C.blue; ctx.font = '800 50px ' + DISPLAY;
      ctx.fillText(guest, px, y + 2);
    } else {
      ctx.strokeStyle = C.sky; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(px, y + 6); ctx.lineTo(W - M - 10, y + 6); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.textAlign = 'center';

    // Réponse
    y += 64;
    ctx.fillStyle = C.ink; ctx.font = '600 32px ' + BODY;
    var rsvp;
    if (opts.tel && opts.avant) { rsvp = 'Réponds avant le ' + opts.avant + ' au ' + opts.tel; }
    else if (opts.tel) { rsvp = 'Réponds aux parents de ' + D.prenom + ' au ' + opts.tel; }
    else if (opts.avant) { rsvp = 'Réponds aux parents de ' + D.prenom + ' avant le ' + opts.avant; }
    else { rsvp = 'Merci de confirmer ta présence aux parents de ' + D.prenom + '.'; }
    wrap(ctx, rsvp, W - 2 * M).forEach(function (l) { ctx.fillText(l, W / 2, y); y += 42; });

    // Pied : logo + club
    var fy = H - 70;
    ctx.font = '600 28px ' + BODY;
    var ft = 'Tennis · Padel · Foot à 5 — Les Acacias', fw = ctx.measureText(ft).width;
    var lw = logo ? 52 : 0, gap = logo ? 16 : 0, sx = (W - (lw + gap + fw)) / 2;
    if (logo) {
      ctx.save(); rr(ctx, sx, fy - 40, lw, lw, 12); ctx.clip(); ctx.drawImage(logo, sx, fy - 40, lw, lw); ctx.restore();
    }
    ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.fillText(ft, sx + lw + gap, fy - 4); ctx.textAlign = 'center';
    return cv;
  };

  /* ---------- Formulaire ---------- */

  var opts = function () {
    return { tel: ($('ipTel').value || '').trim(), avant: ($('ipAvant').value || '').trim() };
  };
  var names = function () {
    return ($('ipNames').value || '').split(/\n|,/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 40);
  };
  var syncCount = function () {
    var n = names().length;
    if (n) { $('ipCount').value = n; }
  };

  var preview = $('ipCanvas');
  var t = null;
  var refresh = function () {
    clearTimeout(t);
    t = setTimeout(function () {
      assets.then(function (a) {
        var big = draw(document.createElement('canvas'), names()[0] || '', opts(), a[0], a[1]);
        var ctx = preview.getContext('2d');
        ctx.clearRect(0, 0, preview.width, preview.height);
        ctx.drawImage(big, 0, 0, preview.width, preview.height);
      });
    }, 150);
  };
  ['ipNames', 'ipTel', 'ipAvant'].forEach(function (id) { $(id).addEventListener('input', function () { if (id === 'ipNames') { syncCount(); } refresh(); }); });
  refresh();

  var saveBlob = function (blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };

  // Image seule (pour l'envoyer par message)
  $('ipImg').addEventListener('click', function () {
    assets.then(function (a) {
      var cv = draw(document.createElement('canvas'), names()[0] || '', opts(), a[0], a[1]);
      cv.toBlob(function (b) { saveBlob(b, D.fichier + '.jpg'); say('Image téléchargée.'); }, 'image/jpeg', 0.92);
    });
  });

  // PDF à imprimer
  $('ipPdf').addEventListener('click', function () {
    var lib = window.jspdf && window.jspdf.jsPDF;
    if (!lib) { say('Le générateur de PDF n’a pas pu se charger. Rechargez la page.'); return; }
    var btn = this;
    btn.disabled = true; say('Préparation du PDF…');
    assets.then(function (a) {
      var per = parseInt($('ipFormat').value, 10) || 4;
      var list = names();
      var count = list.length || Math.max(1, Math.min(40, parseInt($('ipCount').value, 10) || 1));
      var o = opts();
      var pdf = new lib({ unit: 'mm', format: 'a4', orientation: per === 2 ? 'landscape' : 'portrait', compress: true });
      var PW = pdf.internal.pageSize.getWidth(), PH = pdf.internal.pageSize.getHeight();
      // Emplacements (mm) selon le format
      var slots;
      if (per === 4) { slots = [[0, 0, 105, 148.5], [105, 0, 105, 148.5], [0, 148.5, 105, 148.5], [105, 148.5, 105, 148.5]]; }
      else if (per === 2) { slots = [[0, 0, 148.5, 210], [148.5, 0, 148.5, 210]]; }
      else { slots = [[0, 0, PW, PH]]; }

      var blank = null, cv = document.createElement('canvas');
      for (var i = 0; i < count; i++) {
        var k = i % per;
        if (i && !k) { pdf.addPage(); }
        var guest = list[i] || '';
        var data, alias;
        if (guest) {
          data = draw(cv, guest, o, a[0], a[1]).toDataURL('image/jpeg', 0.9); alias = 'c' + i;
        } else {
          blank = blank || draw(cv, '', o, a[0], a[1]).toDataURL('image/jpeg', 0.9); data = blank; alias = 'blank';
        }
        var sl = slots[k];
        pdf.addImage(data, 'JPEG', sl[0], sl[1], sl[2], sl[3], alias, 'FAST');
        // Traits de coupe
        if (k === slots.length - 1 || i === count - 1) {
          pdf.setDrawColor(190, 200, 220); pdf.setLineWidth(0.2); pdf.setLineDashPattern([2, 2], 0);
          if (per === 4) { pdf.line(105, 0, 105, PH); pdf.line(0, 148.5, PW, 148.5); }
          if (per === 2) { pdf.line(148.5, 0, 148.5, PH); }
          pdf.setLineDashPattern([], 0);
        }
      }
      pdf.setProperties({ title: 'Invitation – anniversaire de ' + D.prenom, creator: 'Les Acacias' });
      saveBlob(pdf.output('blob'), D.fichier + '.pdf');
      var pages = Math.ceil(count / per);
      say(count + ' carton' + (count > 1 ? 's' : '') + ' sur ' + pages + ' page' + (pages > 1 ? 's' : '') + ' A4. Imprimez à 100 % (taille réelle), puis découpez le long des pointillés.');
      btn.disabled = false;
    }).catch(function () { btn.disabled = false; say('Le PDF n’a pas pu être créé. Réessayez.'); });
  });
})();
