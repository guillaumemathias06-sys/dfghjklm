/**
 * ImmoInvest – Core Orchestrator
 * Menus, jobs, I/O, and sheet wiring.
 */

const SHEET = {
  CONFIG: 'Config',
  RAW: 'Raw',
  CLEAN: 'Clean',
  KPIS: 'KPIs',
  DASH: 'Dashboard',
  CONTACTS: 'Contacts',
  LOGS: 'Logs',
};

function setup() {
  SpreadsheetApp.getActive().addMenu('🔎 ImmoInvest', [
    { name: '1) Rafraîchir annonces (toutes sources)', functionName: 'jobRefreshAll' },
    { name: '2) Recalculer KPIs + couleurs', functionName: 'jobScoreAndColorize' },
    { name: '3) Générer emails (brouillons)', functionName: 'jobGenerateEmails' },
    { name: 'Outils > Nettoyer doublons', functionName: 'toolDeduplicate' },
    { name: 'Outils > Réparer formats', functionName: 'toolFixFormats' },
  ]);
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('INSTALL_TS')) {
    props.setProperty('INSTALL_TS', new Date().toISOString());
    props.setProperty('USER_AGENT', 'Mozilla/5.0 (AppsScript ImmoInvest)');
  }
}

function jobRefreshAll() {
  const cfg = readConfig_();
  const raw = getSheet_(SHEET.RAW);
  const logs = getSheet_(SHEET.LOGS);
  const sources = (cfg.sources || []).filter(s => s.enabled);

  log_(logs, 'START jobRefreshAll', JSON.stringify({sources: sources.map(s=>s.name)}));

  for (const s of sources) {
    try {
      const rows = fetchSource_(s, cfg);
      appendRaw_(raw, rows);
      Utilities.sleep(500); // throttle
    } catch (e) {
      log_(logs, `ERROR source ${s.name}`, String(e.stack || e));
    }
  }
  toolDeduplicate();
  clean_();
  log_(logs, 'END jobRefreshAll', new Date().toISOString());
}

function jobScoreAndColorize() {
  computeKPIs_();
  colorizeDashboard_();
}

function jobGenerateEmails() {
  const sh = getSheet_(SHEET.DASH);
  const range = sh.getDataRange().getValues();
  const header = range.shift();
  const idx = colIndex_(header);
  const rows = range.filter(r => r[idx('À contacter ?')] === 'Oui');
  for (const r of rows) {
    const payload = {
      titre: r[idx('Titre')],
      ville: r[idx('Ville')],
      prix: r[idx('Prix')],
      surface: r[idx('Surface m²')],
      lien: r[idx('URL')],
      contact: r[idx('Contact / Tel')],
      type: r[idx('Stratégie TOP')],
    };
    EmailTemplates_createDraft_(payload);
  }
}

function toolDeduplicate() {
  const sh = getSheet_(SHEET.RAW);
  const values = sh.getDataRange().getValues();
  const header = values.shift();
  const idx = colIndex_(header);
  const seen = new Set();
  const out = [header];
  for (const r of values) {
    const key = r[idx('URL')];
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  sh.clearContents();
  sh.getRange(1,1,out.length,out[0].length).setValues(out);
}

function toolFixFormats() {
  const sh = getSheet_(SHEET.CLEAN);
  const values = sh.getDataRange().getValues();
  const header = values.shift();
  const idx = colIndex_(header);
  for (const r of values) {
    r[idx('Prix')] = toNumber_(r[idx('Prix')]);
    r[idx('Surface m²')] = toNumber_(r[idx('Surface m²')]);
    r[idx('Pièces')] = toNumber_(r[idx('Pièces')]);
  }
  const out = [header, ...values];
  sh.clearContents();
  sh.getRange(1,1,out.length,out[0].length).setValues(out);
}

/* ---- Internals ---- */

function readConfig_() {
  const sh = getSheet_(SHEET.CONFIG);
  const map = {};
  const data = sh.getDataRange().getValues();
  const header = data.shift();
  const idx = colIndex_(header);
  const rows = data.map(r => header.reduce((o, k, i) => (o[k]=r[i], o), {}));

  // Sources
  const sources = rows.filter(r => r.Section === 'SOURCE' && r.Actif === 'Oui').map(r => ({
    name: r.Nom,
    enabled: r.Actif === 'Oui',
    type: r.Type,              // 'leboncoin', 'seloger', 'pap', 'custom'
    url: r.URL,
    pages: Number(r.Pages || 1),
    city: r.Ville || '',
  }));

  // Hypothèses & paramètres
  const H = Object.fromEntries(rows.filter(r => r.Section === 'HYP').map(r => [r.Nom, r.Valeur]));
  const TAX = Object.fromEntries(rows.filter(r => r.Section === 'TAX').map(r => [r.Nom, r.Valeur]));

  return { sources, H, TAX };
}

function fetchSource_(s, cfg) {
  const agent = PropertiesService.getScriptProperties().getProperty('USER_AGENT') || 'Mozilla/5.0';
  const headers = { 'User-Agent': agent };
  let rows = [];
  for (let p=1; p<=s.pages; p++) {
    const pageUrl = s.url.replace('{{page}}', String(p));
    const html = UrlFetchApp.fetch(pageUrl, { muteHttpExceptions: true, headers }).getContentText();
    const parsed = Scrapers_parse_(s.type, html, pageUrl);
    rows = rows.concat(parsed);
    Utilities.sleep(400);
  }
  return rows;
}

function appendRaw_(sh, rows) {
  if (!rows || !rows.length) return;
  const header = ['Source','URL','Titre','Ville','Prix','Surface','Pieces','DPE','Date','JSON'];
  const existing = sh.getDataRange().getValues();
  if (existing.length === 1 && existing[0][0] === '') {
    sh.getRange(1,1,1,header.length).setValues([header]);
  }
  const out = rows.map(r => [
    r.source || '',
    r.url || '',
    r.title || '',
    r.city || '',
    r.price || '',
    r.surface || '',
    r.rooms || '',
    r.dpe || '',
    r.date || '',
    JSON.stringify(r || {}),
  ]);
  sh.getRange(sh.getLastRow()+1, 1, out.length, header.length).setValues(out);
}

function clean_() {
  const raw = getSheet_(SHEET.RAW).getDataRange().getValues();
  const header = raw.shift();
  const idx = colIndex_(header);
  const outH = ['URL','Source','Titre','Ville','Prix','Surface m²','Pièces','DPE','Date','Contact / Tel'];
  const out = [outH];
  raw.forEach(r => {
    out.push([
      r[idx('URL')],
      r[idx('Source')],
      r[idx('Titre')],
      r[idx('Ville')],
      toNumber_(r[idx('Prix')]),
      toNumber_(r[idx('Surface')]),
      toNumber_(r[idx('Pieces')]),
      r[idx('DPE')],
      r[idx('Date')],
      '', // contact
    ]);
  });
  const sh = getSheet_(SHEET.CLEAN);
  sh.clearContents();
  sh.getRange(1,1,out.length,out[0].length).setValues(out);
}

function computeKPIs_() {
  KPIs_compute_();
}

function colorizeDashboard_() {
  const sh = getSheet_(SHEET.DASH);
  const range = sh.getDataRange();
  const rules = range.getConditionalFormatRules() || [];
  // Simple color rule example on Score
  const scoreCol =  sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].indexOf('Score') + 1;
  if (scoreCol > 0) {
    const green = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(80).setBackground('#c6efce').setRanges([sh.getRange(2,scoreCol,sh.getLastRow()-1,1)]).build();
    const red = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(40).setBackground('#ffc7ce').setRanges([sh.getRange(2,scoreCol,sh.getLastRow()-1,1)]).build();
    rules.push(green, red);
    sh.setConditionalFormatRules(rules);
  }
}

/* ---- Utils ---- */

function getSheet_(name){ return SpreadsheetApp.getActive().getSheetByName(name); }
function colIndex_(header){ return (key)=> header.indexOf(key); }
function toNumber_(v){ if (typeof v === 'number') return v; if (!v) return null; var s=String(v).replace(/[^\d,.-]/g,'').replace(',','.'); return Number(s); }
function log_(sh, action, details){ sh.appendRow([new Date(), action, details || '']); }