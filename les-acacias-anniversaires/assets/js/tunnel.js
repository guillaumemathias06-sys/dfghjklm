/* Tunnel de réservation des anniversaires – Les Acacias */
(function () {
  'use strict';

  var C = window.LA_ANNIV;
  var app = document.getElementById('tnApp');
  if (!C || !app) { return; }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var euros = function (n) {
    n = Math.round(Number(n || 0) * 100) / 100;
    return n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
  };
  var hh = function (t) { // "14:30" -> "14h30"
    if (!t) { return ''; }
    var p = t.split(':');
    return parseInt(p[0], 10) + 'h' + (p[1] && p[1] !== '00' ? p[1] : '');
  };
  var toDate = function (ymd) { return new Date(ymd + 'T12:00:00'); };
  var dateFr = function (ymd, opts) {
    try {
      return toDate(ymd).toLocaleDateString('fr-FR', opts || { weekday: 'long', day: 'numeric', month: 'long' });
    } catch (e) { return ymd; }
  };
  var ucfirst = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var ymOf = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
  var addMonths = function (ym, n) {
    var p = ym.split('-'), d = new Date(+p[0], +p[1] - 1 + n, 1);
    return ymOf(d);
  };
  var byId = function (list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  };
  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>',
    pizza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 20c6 3 14 3 20 0z"/><path d="M5 14.5c4.5 1.5 9.5 1.5 14 0"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="16" r="1"/><circle cx="9" cy="17" r="1"/></svg>',
    ballon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 3v4M16 10l4.5-1.5M14.5 14.5 17 19M9.5 14.5 7 19M8 10 3.5 8.5"/></svg>',
    sachet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
    extra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/></svg>',
    party: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01"/><path d="m22 2-2.2.8a2.9 2.9 0 0 0-1.8 3.3c.2.9-.5 1.9-1.5 1.9h-.4L15 8"/><path d="M11 13c1.9 1.9 2.4 4.2 1.7 4.8-.6.7-2.9.2-4.8-1.7s-2.4-4.2-1.7-4.8c.6-.7 2.9-.2 4.8 1.7z"/></svg>'
  };

  var STEPS = [
    { id: 'formule', label: 'Formule' },
    { id: 'univers', label: 'Univers' },
    { id: 'date', label: 'Date' },
    { id: 'invites', label: 'Invités' },
    { id: 'options', label: 'Options' },
    { id: 'coord', label: 'Coordonnées' }
  ];
  var KEY = 'la_anniv_tunnel_v1';

  /* ---------------- État ---------------- */

  var fresh = function () {
    return {
      step: 0, max: 0,
      formule: 'complet', univers: '',
      date: '', heure: '',
      enfants: Math.min(C.enfantsMax, Math.max(C.enfantsMin, 10)),
      age: '', prenom: '',
      options: { pizza: 0, ballon: 0, sachet: 0, extra: 0 },
      contact: { nom: '', tel: '', email: '', infos: '', source: '', parent_present: '' },
      accepte: false,
      t0: Date.now(), saved: Date.now()
    };
  };
  var st = fresh();
  try {
    var raw = window.sessionStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && o.saved && Date.now() - o.saved < 86400000) { st = Object.assign(fresh(), o); st.accepte = false; }
    }
  } catch (e) { /* stockage indisponible */ }

  var pre = C.pre || {};
  if (pre.formule && byId(C.formules, pre.formule)) { st.formule = pre.formule; st.step = Math.max(st.step, 1); }
  if (pre.univers && byId(C.univers, pre.univers)) { st.univers = pre.univers; if (pre.formule) { st.step = Math.max(st.step, 2); } }
  st.max = Math.max(st.max, st.step);
  if (pre.formule || pre.univers) {
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) { /* ignore */ }
  }

  var save = function () {
    st.saved = Date.now();
    try { window.sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ }
  };

  /* ---------------- Disponibilités ---------------- */

  var months = {};       // "2026-11" -> { jours: {...}, prochaine: "..." }
  var loading = {};
  var cal = st.date ? st.date.slice(0, 7) : ymOf(toDate(C.aujourdhui));
  var minYm = ymOf(toDate(C.aujourdhui));
  var lastDay = toDate(C.aujourdhui); lastDay.setDate(lastDay.getDate() + (C.horizon || 120));
  var maxYm = ymOf(lastDay);

  var fetchMonth = function (ym, force) {
    if (months[ym] && !force) { return Promise.resolve(months[ym]); }
    if (loading[ym] && !force) { return loading[ym]; }
    loading[ym] = fetch(C.api + '/dispos?mois=' + ym, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(function (r) { if (!r.ok) { throw new Error('http'); } return r.json(); })
      .then(function (d) { months[ym] = d; delete loading[ym]; return d; })
      .catch(function (e) { delete loading[ym]; throw e; });
    return loading[ym];
  };

  var slotOf = function () {
    if (!st.date || !st.heure) { return null; }
    var m = months[st.date.slice(0, 7)];
    var list = m && m.jours && m.jours[st.date];
    if (!list) { return null; }
    for (var i = 0; i < list.length; i++) { if (list[i].h === st.heure) { return list[i]; } }
    return null;
  };

  /* ---------------- Prix ---------------- */

  var price = function () {
    var f = byId(C.formules, st.formule) || C.formules[0];
    var O = {}; C.options.forEach(function (o) { O[o.id] = o; });
    var lines = [{ label: 'Formule ' + f.nom, sub: 'Jusqu’à ' + C.enfantsMax + ' enfants', total: f.prix }];
    var o = st.options;
    if (o.pizza > 0) { lines.push({ label: O.pizza.nom, sub: o.pizza + ' × ' + euros(O.pizza.prix), total: o.pizza * O.pizza.prix }); }
    if (o.ballon) { lines.push({ label: O.ballon.nom, total: O.ballon.prix }); }
    if (o.sachet) { lines.push({ label: O.sachet.nom, sub: st.enfants + ' × ' + euros(O.sachet.prix), total: st.enfants * O.sachet.prix }); }
    if (o.extra) { lines.push({ label: O.extra.nom, total: O.extra.prix }); }
    var total = lines.reduce(function (a, l) { return a + l.total; }, 0);
    var acompte = Math.min(total, C.acompte || 0);
    return { lines: lines, total: total, acompte: acompte, solde: total - acompte };
  };

  /* ---------------- Rendu ---------------- */

  var panel = $('#tnPanel'), errBox = $('#tnErr'), nav = $('#tnNav');
  var btnBack = $('#tnBack'), btnNext = $('#tnNext'), barNext = $('#tnBarNext');
  var recapIn = $('#tnRecapIn'), stepsEl = $('#tnSteps');

  var showErr = function (msg) {
    if (!msg) { errBox.hidden = true; errBox.innerHTML = ''; return; }
    errBox.innerHTML = Array.isArray(msg) ? msg.map(esc).join('<br>') : esc(msg);
    errBox.hidden = false;
  };

  var renderSteps = function () {
    stepsEl.innerHTML = STEPS.map(function (s, i) {
      var cls = i === st.step ? 'on' : (i < st.step || i <= st.max ? 'done' : '');
      var can = i <= st.max && i !== st.step && st.step < STEPS.length;
      return '<li class="' + cls + '"' + (i === st.step ? ' aria-current="step"' : '') + '>' +
        (can ? '<button type="button" data-go="' + i + '">' : '<span>') +
        '<b>' + (i < st.step ? ICON.check : (i + 1)) + '</b><em>' + esc(s.label) + '</em>' +
        (can ? '</button>' : '</span>') + '</li>';
    }).join('');
  };

  var head = function (n, title, lead) {
    return '<p class="tn-k">Étape ' + n + ' sur ' + STEPS.length + '</p><h2 class="tn-h2">' + title + '</h2>' + (lead ? '<p class="tn-lead">' + lead + '</p>' : '');
  };

  var V = {};

  V.formule = function () {
    return head(1, 'Quelle formule&nbsp;?', 'Un prix pour tout le groupe, jusqu’à ' + C.enfantsMax + ' enfants, enfant fêté inclus.') +
      '<div class="tn-choices tn-plans" role="radiogroup" aria-label="Formule">' +
      C.formules.map(function (f) {
        var on = st.formule === f.id;
        return '<label class="tn-choice tn-plan' + (on ? ' on' : '') + (f.badge ? ' hi' : '') + '">' +
          '<input type="radio" name="formule" value="' + esc(f.id) + '"' + (on ? ' checked' : '') + '>' +
          (f.badge ? '<span class="tn-badge">' + ICON.star + esc(f.badge) + '</span>' : '') +
          '<span class="tn-plan-top"><b class="tn-plan-n">' + esc(f.nom) + '</b><b class="tn-plan-p">' + euros(f.prix) + '</b></span>' +
          '<span class="tn-plan-per">soit ' + euros(Math.round(f.prix / C.enfantsMax * 100) / 100) + ' par enfant pour ' + C.enfantsMax + '</span>' +
          '<span class="tn-plan-l">' + esc(f.accroche) + '</span>' +
          '<ul class="tn-ul">' + f.inclus.map(function (x) { return '<li>' + ICON.check + esc(x) + '</li>'; }).join('') +
          (f.apporte ? '<li class="no"><span>–</span>' + esc(f.apporte) + '</li>' : '') + '</ul>' +
          '<span class="tn-radio" aria-hidden="true"></span>' +
          '</label>';
      }).join('') + '</div>';
  };

  V.univers = function () {
    return head(2, 'Quel univers pour la fête&nbsp;?', 'Les deux se jouent sur notre terrain de foot à 5, avec un animateur dédié.') +
      '<div class="tn-choices tn-unis" role="radiogroup" aria-label="Univers">' +
      C.univers.map(function (u) {
        var on = st.univers === u.id;
        return '<label class="tn-choice tn-uni' + (on ? ' on' : '') + '">' +
          '<input type="radio" name="univers" value="' + esc(u.id) + '"' + (on ? ' checked' : '') + '>' +
          (u.img ? '<span class="tn-uni-ph"><img src="' + esc(u.img) + '" alt="" loading="lazy"></span>' : '<span class="tn-uni-ph ph"></span>') +
          '<span class="tn-uni-b"><b class="tn-uni-n">' + esc(u.nom) + '</b>' +
          '<span class="tn-uni-l">' + esc(u.accroche) + '</span>' +
          '<ul class="tn-ul">' + u.points.map(function (x) { return '<li>' + ICON.check + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<span class="tn-uni-for">' + esc(u.pour) + '</span></span>' +
          '<span class="tn-radio" aria-hidden="true"></span>' +
          '</label>';
      }).join('') + '</div>';
  };

  V.date = function () {
    return head(3, 'Choisissez la date', (C.jours ? 'Les fêtes ont lieu ' + esc(C.jours) + '. ' : '') + 'Les créneaux affichés sont libres.') +
      '<div class="tn-date">' +
      '<div class="tn-cal" id="tnCal"><p class="tn-loading">Chargement des disponibilités…</p></div>' +
      '<div class="tn-slots" id="tnSlots"></div>' +
      '</div>';
  };

  var calHtml = function (ym, data) {
    var p = ym.split('-'), y = +p[0], m = +p[1] - 1;
    var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    var offset = (first.getDay() + 6) % 7; // lundi en premier
    var title = ucfirst(first.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
    var jours = (data && data.jours) || {};
    var h = '<div class="tn-cal-h"><button type="button" class="tn-cal-nav" data-cal="-1" aria-label="Mois précédent"' + (ym <= minYm ? ' disabled' : '') + '>' + ICON.left + '</button>' +
      '<b>' + esc(title) + '</b>' +
      '<button type="button" class="tn-cal-nav" data-cal="1" aria-label="Mois suivant"' + (ym >= maxYm ? ' disabled' : '') + '>' + ICON.right + '</button></div>';
    h += '<div class="tn-cal-g" role="grid"><span class="dn">lun</span><span class="dn">mar</span><span class="dn">mer</span><span class="dn">jeu</span><span class="dn">ven</span><span class="dn">sam</span><span class="dn">dim</span>';
    for (var i = 0; i < offset; i++) { h += '<span></span>'; }
    var nFree = 0;
    for (var d = 1; d <= days; d++) {
      var ymd = ym + '-' + pad(d);
      var slots = jours[ymd];
      var free = slots ? slots.filter(function (s) { return s.ok; }).length : 0;
      nFree += free;
      var cls = 'd', dis = true, lab = '';
      if (slots && free) { cls += ' free'; dis = false; lab = free + ' créneau' + (free > 1 ? 'x' : '') + ' libre' + (free > 1 ? 's' : ''); }
      else if (slots) { cls += ' full'; lab = 'complet'; }
      if (ymd === st.date) { cls += ' on'; }
      if (ymd === C.aujourdhui) { cls += ' today'; }
      h += '<button type="button" class="' + cls + '" data-day="' + ymd + '"' + (dis ? ' disabled' : '') +
        ' aria-label="' + esc(dateFr(ymd) + (lab ? ', ' + lab : ', pas de fête ce jour')) + '"' + (ymd === st.date ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
    }
    h += '</div><p class="tn-cal-leg"><span><i class="free"></i>Disponible</span><span><i class="full"></i>Complet</span></p>';
    if (!nFree && data && data.prochaine && data.prochaine.slice(0, 7) !== ym) {
      h += '<p class="tn-next-av">Plus de créneau libre ce mois-ci. Prochaine disponibilité&nbsp;: <button type="button" data-jump="' + esc(data.prochaine) + '">' + esc(dateFr(data.prochaine)) + '</button></p>';
    } else if (!nFree && data && !data.prochaine) {
      h += '<p class="tn-next-av">Aucun créneau en ligne pour le moment. Appelez-nous au <a href="tel:' + esc(String(C.tel).replace(/\s/g, '')) + '">' + esc(C.tel) + '</a>.</p>';
    }
    return h;
  };

  var slotsHtml = function () {
    if (!st.date) {
      return '<div class="tn-slots-empty">' + ICON.party + '<p>Sélectionnez un jour dans le calendrier pour voir les horaires.</p></div>';
    }
    var m = months[st.date.slice(0, 7)];
    var list = (m && m.jours && m.jours[st.date]) || [];
    var h = '<p class="tn-slots-t">' + esc(ucfirst(dateFr(st.date))) + '</p>';
    if (!list.length) { return h + '<p class="tn-muted">Pas de fête possible ce jour.</p>'; }
    h += '<div class="tn-slot-l" role="radiogroup" aria-label="Horaire">';
    list.forEach(function (s) {
      var on = st.heure === s.h;
      h += '<button type="button" class="tn-slot' + (on ? ' on' : '') + '" data-slot="' + esc(s.h) + '" role="radio" aria-checked="' + on + '"' + (s.ok ? '' : ' disabled') + '>' +
        '<b>' + hh(s.h) + ' – ' + hh(s.fin) + '</b><span>' + (s.ok ? (s.pizza ? 'Option pizza possible' : 'Disponible') : 'Complet') + '</span></button>';
    });
    return h + '</div><p class="tn-muted tn-small">Accueil des invités 10 minutes avant. Durée&nbsp;: ' + esc(C.dureeTxt) + (st.options.extra ? ' + 30 min' : '') + '.</p>';
  };

  var drawCal = function () {
    var box = $('#tnCal'); if (!box) { return; }
    var ym = cal;
    if (!months[ym]) { box.innerHTML = '<p class="tn-loading">Chargement des disponibilités…</p>'; }
    fetchMonth(ym).then(function (d) {
      if (cal !== ym || !$('#tnCal')) { return; }
      $('#tnCal').innerHTML = calHtml(ym, d);
      $('#tnSlots').innerHTML = slotsHtml();
    }).catch(function () {
      if ($('#tnCal')) { $('#tnCal').innerHTML = '<p class="tn-err-in">Impossible de charger les disponibilités. Vérifiez votre connexion et <button type="button" data-retry>réessayez</button>.</p>'; }
    });
    $('#tnSlots').innerHTML = slotsHtml();
  };

  V.invites = function () {
    var ages = '';
    for (var a = C.ageMin; a <= C.ageMax; a++) { ages += '<option value="' + a + '"' + (String(st.age) === String(a) ? ' selected' : '') + '>' + a + ' ans</option>'; }
    return head(4, 'La star et ses invités', '') +
      '<div class="tn-form">' +
      '<label class="tn-f"><span>Prénom de l’enfant fêté</span><input type="text" id="fPrenom" maxlength="40" autocomplete="off" value="' + esc(st.prenom) + '" placeholder="Ex. Léo"></label>' +
      '<label class="tn-f"><span>Âge qu’il ou elle va fêter</span><select id="fAge"><option value="">Choisir</option>' + ages + '</select></label>' +
      '</div>' +
      '<div class="tn-count">' +
      '<div><b>Nombre d’enfants</b><span>Enfant fêté inclus · ' + C.enfantsMin + ' à ' + C.enfantsMax + ' enfants</span></div>' +
      '<div class="tn-stepper" role="group" aria-label="Nombre d’enfants">' +
      '<button type="button" data-kids="-1" aria-label="Un enfant de moins"' + (st.enfants <= C.enfantsMin ? ' disabled' : '') + '>−</button>' +
      '<output id="fKids" aria-live="polite">' + st.enfants + '</output>' +
      '<button type="button" data-kids="1" aria-label="Un enfant de plus"' + (st.enfants >= C.enfantsMax ? ' disabled' : '') + '>+</button>' +
      '</div></div>' +
      '<p class="tn-hint">Plus de ' + C.enfantsMax + ' enfants&nbsp;? Appelez-nous au <a href="tel:' + esc(String(C.tel).replace(/\s/g, '')) + '">' + esc(C.tel) + '</a>&nbsp;: nous étudions une organisation avec un deuxième animateur.</p>';
  };

  V.options = function () {
    var slot = slotOf() || {};
    var f = byId(C.formules, st.formule);
    var html = head(5, 'Les petits plus', 'Facultatif&nbsp;: ajoutez ce qui fera plaisir. Vous pouvez passer cette étape.');
    if (st.formule === 'essentiel' && f && f.apporte) {
      html += '<p class="tn-note">' + ICON.party + '<span>Formule Essentiel&nbsp;: ' + esc(f.apporte.charAt(0).toLowerCase() + f.apporte.slice(1)) + '.</span></p>';
    }
    html += '<div class="tn-opts">';
    C.options.forEach(function (o) {
      var val = st.options[o.id] || 0;
      var dis = (o.id === 'pizza' && !slot.pizza) || (o.id === 'extra' && !slot.extra);
      var why = o.id === 'pizza' ? 'Proposé pour les fêtes dont le goûter a lieu entre ' + C.pizza[0] + ' et ' + C.pizza[1] + '. Choisissez un créneau du matin pour en profiter.' : 'Le terrain est déjà réservé juste après votre créneau.';
      var unit = o.unite ? ' <i>/ ' + esc(o.unite) + '</i>' : '';
      var ctrl;
      if (o.type === 'qte') {
        ctrl = '<div class="tn-stepper sm" role="group" aria-label="' + esc(o.nom) + '">' +
          '<button type="button" data-opt="' + o.id + '" data-d="-1" aria-label="Retirer"' + (dis || val <= 0 ? ' disabled' : '') + '>−</button>' +
          '<output>' + val + '</output>' +
          '<button type="button" data-opt="' + o.id + '" data-d="1" aria-label="Ajouter"' + (dis || val >= 40 ? ' disabled' : '') + '>+</button></div>';
      } else {
        ctrl = '<button type="button" class="tn-toggle' + (val ? ' on' : '') + '" data-opt="' + o.id + '" aria-pressed="' + (!!val) + '"' + (dis ? ' disabled' : '') + '>' + (val ? ICON.check + 'Ajouté' : 'Ajouter') + '</button>';
      }
      var priceTxt = o.type === 'enfant'
        ? '+' + euros(o.prix) + unit + ' <small>soit ' + euros(o.prix * st.enfants) + ' pour ' + st.enfants + '</small>'
        : '+' + euros(o.prix) + unit;
      html += '<div class="tn-opt' + (val ? ' on' : '') + (dis ? ' dis' : '') + '">' +
        '<span class="tn-opt-i">' + (ICON[o.id] || '') + '</span>' +
        '<div class="tn-opt-b"><b>' + esc(o.nom) + '</b><span>' + esc(dis ? why : o.desc) + '</span><span class="tn-opt-p">' + priceTxt + '</span></div>' +
        '<div class="tn-opt-c">' + ctrl + '</div></div>';
    });
    if (st.options.pizza > 0 && st.options.pizza < Math.ceil(st.enfants / 3)) {
      html += '<p class="tn-hint">Repère&nbsp;: comptez environ une pizza pour 2 à 3 enfants.</p>';
    }
    return html + '</div>';
  };

  V.coord = function () {
    var c = st.contact;
    var cgv = C.cgv ? ' et les <a href="' + esc(C.cgv) + '" target="_blank" rel="noopener">conditions de réservation</a>' : '';
    return head(6, 'Vos coordonnées', 'Pour vous envoyer la confirmation, l’invitation à partager et vous joindre si besoin.') +
      '<div class="tn-form">' +
      '<label class="tn-f full"><span>Nom et prénom du parent</span><input type="text" id="cNom" autocomplete="name" value="' + esc(c.nom) + '"></label>' +
      '<label class="tn-f"><span>Téléphone</span><input type="tel" id="cTel" autocomplete="tel" inputmode="tel" value="' + esc(c.tel) + '" placeholder="06 00 00 00 00"></label>' +
      '<label class="tn-f"><span>E-mail</span><input type="email" id="cEmail" autocomplete="email" value="' + esc(c.email) + '" placeholder="vous@exemple.fr"></label>' +
      '<label class="tn-f full"><span>Allergies, régime, infos utiles <em>(facultatif)</em></span><textarea id="cInfos" rows="3" placeholder="Ex. un invité allergique aux fruits à coque">' + esc(c.infos) + '</textarea></label>' +
      '<label class="tn-f"><span>Parent présent pendant la fête <em>(facultatif)</em></span><input type="text" id="cPresent" value="' + esc(c.parent_present) + '" placeholder="Prénom et téléphone"></label>' +
      '<label class="tn-f"><span>Vous nous avez connus par <em>(facultatif)</em></span><select id="cSource">' +
      ['', 'Mon enfant est au club', 'Un autre anniversaire', 'Bouche-à-oreille', 'Instagram / Facebook', 'Google', 'Affiche au club', 'Autre'].map(function (x) {
        return '<option value="' + esc(x) + '"' + (c.source === x ? ' selected' : '') + '>' + (x ? esc(x) : 'Choisir') + '</option>';
      }).join('') + '</select></label>' +
      '<div class="hp" aria-hidden="true"><label>Ne pas remplir<input type="text" id="cSite" tabindex="-1" autocomplete="off"></label></div>' +
      '</div>' +
      (C.meteo ? '<div class="tn-meteo"><b>Météo</b><p>' + esc(C.meteo) + '</p></div>' : '') +
      '<label class="tn-check"><input type="checkbox" id="cOk"' + (st.accepte ? ' checked' : '') + '><span>J’ai lu la règle météo' + cgv + '. Je comprends que la réservation est confirmée après le règlement de l’acompte' + (C.acompte ? ' de ' + euros(Math.min(C.acompte, price().total)) : '') + '.</span></label>';
  };

  var recap = function () {
    var f = byId(C.formules, st.formule), u = byId(C.univers, st.univers), slot = slotOf();
    var p = price();
    var row = function (k, v, step) {
      return '<div class="tn-r"><span>' + k + '</span><b>' + (v || '<i>À choisir</i>') + '</b>' +
        (v && step <= st.max && st.step < STEPS.length ? '<button type="button" data-go="' + step + '" aria-label="Modifier : ' + k + '">Modifier</button>' : '') + '</div>';
    };
    var h = '<p class="tn-recap-t">Votre fête</p>';
    h += row('Formule', f ? esc(f.nom) : '', 0);
    h += row('Univers', u ? esc(u.nom) : '', 1);
    h += row('Date', st.date && slot ? esc(ucfirst(dateFr(st.date))) + '<br>' + hh(st.heure) + ' – ' + hh(st.options.extra ? addMin(slot.fin, 30) : slot.fin) : '', 2);
    h += row('Invités', st.max >= 3 ? st.enfants + ' enfants' + (st.prenom ? '<br>pour ' + esc(st.prenom) + (st.age ? ', ' + st.age + ' ans' : '') : '') : '', 3);
    h += '<div class="tn-lines">' + p.lines.map(function (l) {
      return '<div class="tn-l"><span>' + esc(l.label) + (l.sub ? '<small>' + esc(l.sub) + '</small>' : '') + '</span><b>' + euros(l.total) + '</b></div>';
    }).join('') + '</div>';
    h += '<div class="tn-tot"><span>Total</span><b>' + euros(p.total) + '</b></div>';
    if (p.acompte > 0) {
      h += '<div class="tn-dep"><span>Acompte à la réservation</span><b>' + euros(p.acompte) + '</b></div>' +
        '<div class="tn-dep"><span>Solde le jour J</span><b>' + euros(p.solde) + '</b></div>';
    }
    h += '<p class="tn-reassure"><span>' + ICON.check + 'Un animateur dédié au groupe</span><span>' + ICON.check + 'Report gratuit en cas de pluie</span></p>';
    recapIn.innerHTML = h;
    $('#tnBarTotal').textContent = euros(p.total);
  };
  var addMin = function (t, n) {
    var p = t.split(':'), m = (+p[0]) * 60 + (+p[1]) + n;
    return pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  };

  var render = function (focus) {
    showErr('');
    var s = STEPS[st.step];
    panel.innerHTML = V[s.id]();
    panel.setAttribute('data-step', s.id);
    renderSteps();
    recap();
    btnBack.hidden = st.step === 0;
    var last = st.step === STEPS.length - 1;
    var label = last ? 'Envoyer ma demande' : (s.id === 'options' && !hasOpts() ? 'Continuer sans option' : 'Continuer');
    btnNext.textContent = label; barNext.textContent = last ? 'Envoyer' : 'Continuer';
    if (s.id === 'date') { drawCal(); }
    save();
    if (focus) {
      var h2 = $('.tn-h2', panel);
      if (h2) { h2.setAttribute('tabindex', '-1'); h2.focus({ preventScroll: true }); }
      var top = $('.tn-top');
      var y = (top ? top.getBoundingClientRect().bottom : panel.getBoundingClientRect().top) + window.scrollY - 110;
      if (window.scrollY > y) { window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); }
    }
  };
  var hasOpts = function () { var o = st.options; return o.pizza || o.ballon || o.sachet || o.extra; };

  /* ---------------- Validation ---------------- */

  var readFields = function () {
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : null; };
    if (STEPS[st.step].id === 'invites') {
      st.prenom = (g('fPrenom') || '').trim();
      st.age = g('fAge') ? parseInt(g('fAge'), 10) : '';
    }
    if (STEPS[st.step].id === 'coord') {
      st.contact.nom = (g('cNom') || '').trim();
      st.contact.tel = (g('cTel') || '').trim();
      st.contact.email = (g('cEmail') || '').trim();
      st.contact.infos = g('cInfos') || '';
      st.contact.source = g('cSource') || '';
      st.contact.parent_present = (g('cPresent') || '').trim();
      var ok = document.getElementById('cOk'); st.accepte = !!(ok && ok.checked);
    }
  };

  var mark = function (id) { var el = document.getElementById(id); if (el) { el.closest('.tn-f, .tn-check').classList.add('bad'); } return id; };

  var validate = function () {
    readFields();
    var id = STEPS[st.step].id, errs = [], first = null;
    $$('.bad', panel).forEach(function (e) { e.classList.remove('bad'); });
    var need = function (cond, msg, field) { if (!cond) { errs.push(msg); if (field) { mark(field); first = first || field; } } };
    if (id === 'formule') { need(!!byId(C.formules, st.formule), 'Choisissez une formule.'); }
    if (id === 'univers') { need(!!byId(C.univers, st.univers), 'Choisissez un univers pour la fête.'); }
    if (id === 'date') {
      var s = slotOf();
      need(!!st.date, 'Choisissez un jour dans le calendrier.');
      if (st.date) { need(!!(s && s.ok), 'Choisissez un horaire disponible.'); }
    }
    if (id === 'invites') {
      need(st.prenom.length > 0, 'Indiquez le prénom de l’enfant fêté.', 'fPrenom');
      need(!!st.age, 'Indiquez l’âge qu’il ou elle va fêter.', 'fAge');
    }
    if (id === 'coord') {
      var c = st.contact;
      need(c.nom.length > 1, 'Indiquez votre nom.', 'cNom');
      need(c.tel.replace(/\D/g, '').length >= 9, 'Indiquez un numéro de téléphone valide.', 'cTel');
      need(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email), 'Indiquez une adresse e-mail valide.', 'cEmail');
      need(st.accepte, 'Cochez la case pour accepter les conditions de réservation.', 'cOk');
    }
    if (errs.length) {
      showErr(errs);
      if (first) { var el = document.getElementById(first); if (el) { el.focus(); } }
      return false;
    }
    return true;
  };

  /* ---------------- Navigation ---------------- */

  var go = function (i) {
    readFields();
    st.step = Math.max(0, Math.min(STEPS.length - 1, i));
    st.max = Math.max(st.max, st.step);
    render(true);
  };

  var next = function () {
    if (!validate()) { return; }
    if (st.step === STEPS.length - 1) { submit(); return; }
    go(st.step + 1);
  };

  btnNext.addEventListener('click', next);
  barNext.addEventListener('click', next);
  btnBack.addEventListener('click', function () { go(st.step - 1); });

  $('#tnBarSum').addEventListener('click', function () {
    var open = document.body.classList.toggle('tn-sheet');
    this.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('tn-sheet')) { document.body.classList.remove('tn-sheet'); }
  });

  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'formule') { st.formule = t.value; render(); }
    if (t.name === 'univers') { st.univers = t.value; render(); }
    if (t.id === 'fAge') { st.age = parseInt(t.value, 10) || ''; }
    if (t.id === 'cOk') { st.accepte = t.checked; }
    if (t.closest && t.closest('.tn-form')) { readFields(); save(); }
  });
  app.addEventListener('input', function (e) {
    if (e.target.closest('.tn-form')) { readFields(); save(); }
    var c = e.target.closest('.tn-f.bad, .tn-check.bad'); if (c) { c.classList.remove('bad'); }
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, [data-go]');
    if (!t || !app.parentNode.contains(t)) { return; }

    if (t.hasAttribute('data-go')) {
      document.body.classList.remove('tn-sheet');
      go(parseInt(t.getAttribute('data-go'), 10));
      return;
    }
    if (t.hasAttribute('data-cal')) {
      cal = addMonths(cal, parseInt(t.getAttribute('data-cal'), 10));
      drawCal();
      return;
    }
    if (t.hasAttribute('data-retry')) { drawCal(); return; }
    if (t.hasAttribute('data-jump')) {
      var d = t.getAttribute('data-jump');
      cal = d.slice(0, 7); st.date = d; st.heure = '';
      drawCal();
      return;
    }
    if (t.hasAttribute('data-day')) {
      st.date = t.getAttribute('data-day');
      st.heure = '';
      var list = (months[cal] && months[cal].jours[st.date]) || [];
      var free = list.filter(function (s) { return s.ok; });
      if (free.length === 1) { st.heure = free[0].h; }
      $$('.tn-cal-g .d', panel).forEach(function (b) {
        var on = b.getAttribute('data-day') === st.date;
        b.classList.toggle('on', on);
        if (on) { b.setAttribute('aria-pressed', 'true'); } else { b.removeAttribute('aria-pressed'); }
      });
      $('#tnSlots').innerHTML = slotsHtml();
      fixOptions(); recap(); save(); showErr('');
      if (window.innerWidth < 860) { var sl = $('#tnSlots'); if (sl) { sl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }
      return;
    }
    if (t.hasAttribute('data-slot')) {
      st.heure = t.getAttribute('data-slot');
      $('#tnSlots').innerHTML = slotsHtml();
      fixOptions(); recap(); save(); showErr('');
      return;
    }
    if (t.hasAttribute('data-kids')) {
      st.enfants = Math.max(C.enfantsMin, Math.min(C.enfantsMax, st.enfants + parseInt(t.getAttribute('data-kids'), 10)));
      readFields(); render();
      return;
    }
    if (t.hasAttribute('data-opt')) {
      var id = t.getAttribute('data-opt');
      if (t.hasAttribute('data-d')) {
        st.options[id] = Math.max(0, Math.min(40, (st.options[id] || 0) + parseInt(t.getAttribute('data-d'), 10)));
      } else {
        st.options[id] = st.options[id] ? 0 : 1;
      }
      render();
    }
  });

  // Un créneau sans pizza ou sans prolongation possible retire l'option correspondante.
  var fixOptions = function () {
    var s = slotOf();
    if (!s || !s.pizza) { st.options.pizza = 0; }
    if (!s || !s.extra) { st.options.extra = 0; }
  };

  /* ---------------- Envoi ---------------- */

  var sending = false;
  var submit = function () {
    if (sending) { return; }
    sending = true;
    btnNext.disabled = barNext.disabled = true;
    btnNext.textContent = 'Envoi en cours…';
    var payload = {
      formule: st.formule, univers: st.univers, date: st.date, heure: st.heure,
      enfants: st.enfants, age: st.age, prenom_enfant: st.prenom,
      options: st.options, contact: st.contact, accepte: st.accepte,
      t0: st.t0, site_web: ($('#cSite') || {}).value || ''
    };
    fetch(C.api + '/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, d: d }; });
    }).then(function (res) {
      sending = false;
      btnNext.disabled = barNext.disabled = false;
      var d = res.d || {};
      if (res.status === 201 && d.ok) { done(d); return; }
      if (d.champs && d.champs.indexOf('creneau') > -1) {
        delete months[st.date.slice(0, 7)];
        st.heure = '';
        go(2);
        showErr(d.erreurs);
        return;
      }
      render();
      showErr(d.erreurs || d.message || 'L’envoi n’a pas abouti. Réessayez ou appelez-nous au ' + C.tel + '.');
    }).catch(function () {
      sending = false;
      btnNext.disabled = barNext.disabled = false;
      render();
      showErr('Connexion impossible. Vérifiez votre réseau et réessayez, ou appelez-nous au ' + C.tel + '.');
    });
  };

  var done = function (d) {
    try { window.sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    st.step = STEPS.length;
    stepsEl.innerHTML = STEPS.map(function (s) { return '<li class="done"><span><b>' + ICON.check + '</b><em>' + esc(s.label) + '</em></span></li>'; }).join('');
    nav.hidden = true;
    $('#tnBar').hidden = true;
    document.body.classList.add('tn-done');
    var pay = d.paiement
      ? '<a class="btn btn-pri" href="' + esc(d.paiement) + '" target="_blank" rel="noopener">Payer l’acompte de ' + euros(d.prix.acompte) + '</a>'
      : '';
    var payTxt = d.prix.acompte > 0
      ? (d.paiement
        ? 'Le créneau est bloqué pour vous' + (d.expiration ? ' pendant ' + d.expiration + ' h' : '') + '. Réglez l’acompte de <b>' + euros(d.prix.acompte) + '</b> pour confirmer la fête.'
        : 'Le créneau est bloqué pour vous. Nous vous appelons très vite pour confirmer et régler l’acompte de <b>' + euros(d.prix.acompte) + '</b>.')
      : 'Le créneau est bloqué pour vous. Nous vous appelons très vite pour confirmer.';
    panel.innerHTML = '<div class="tn-ok">' +
      '<span class="tn-ok-i">' + ICON.check + '</span>' +
      '<p class="tn-k">Demande n° ' + esc(d.ref) + '</p>' +
      '<h2 class="tn-h2" tabindex="-1">C’est noté pour ' + esc(st.prenom) + '&nbsp;!</h2>' +
      '<p class="tn-lead">' + esc(ucfirst(d.date_txt)) + ', ' + esc(d.horaire) + '. ' + payTxt + '</p>' +
      '<div class="tn-ok-a">' + pay + '<a class="btn btn-line" href="' + esc(d.invitation) + '">Voir l’invitation à partager</a></div>' +
      '<p class="tn-muted">Un e-mail récapitulatif vient de vous être envoyé à ' + esc(st.contact.email) + '. Pensez à vérifier vos courriers indésirables.</p>' +
      '</div>';
    showErr('');
    recap();
    var h2 = $('.tn-h2', panel); if (h2) { h2.focus(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.dataLayer) { window.dataLayer.push({ event: 'anniversaire_demande', value: d.prix.total, currency: 'EUR' }); }
  };

  /* ---------------- Démarrage ---------------- */

  // Précharge le mois affiché (et le suivant) pour que l'étape date soit instantanée.
  fetchMonth(cal).then(function () {
    if (STEPS[st.step] && STEPS[st.step].id !== 'date') { recap(); }
    fixOptions();
  }).catch(function () {});
  fetchMonth(addMonths(cal, 1)).catch(function () {});
  render(false);
})();
