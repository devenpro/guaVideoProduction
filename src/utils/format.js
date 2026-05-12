/**
 * VPM Format/Parse/Badge Utilities
 *
 * Pure (or near-pure) helper functions used across part1/part2a/part2b.
 * Exports each function on the existing window._vpm* names for backward compat.
 * Also exposes them grouped under window._vpm.utils.
 *
 * MUST load AFTER constants.js + state.js, BEFORE vpm-part1.js.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var CLIP_TYPES = Constants.CLIP_TYPES;
  var VIDEO_MODELS = Constants.VIDEO_MODELS;
  var VIDEO_STATUSES = Constants.VIDEO_STATUSES;
  var AI_CLIP_STATUSES = Constants.AI_CLIP_STATUSES;
  var NON_AI_CLIP_STATUSES = Constants.NON_AI_CLIP_STATUSES;
  var TEMPLATE_CLIP_STATUSES = Constants.TEMPLATE_CLIP_STATUSES;
  var LOOK_ROLES = Constants.LOOK_ROLES;

function esc(str) { if (!str) return ''; var el = document.createElement('span'); el.textContent = str; return el.innerHTML; }
function truncate(str, len) { if (!str || str.length <= len) return str || ''; return str.substring(0, len) + '\u2026'; }
function stripHtml(html) { if (!html) return ''; var tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }
function countWords(html) { var text = stripHtml(html).trim(); if (!text) return 0; return text.split(/\s+/).length; }
function formatDuration(seconds) { if (!seconds || seconds <= 0) return '0s'; if (seconds < 60) return seconds + 's'; var m = Math.floor(seconds / 60); var s = seconds % 60; return m + 'm' + (s > 0 ? ' ' + s + 's' : ''); }
function formatDurationLong(seconds) { if (!seconds || seconds <= 0) return '0 seconds'; if (seconds < 60) return seconds + ' second' + (seconds !== 1 ? 's' : ''); var m = Math.floor(seconds / 60); var s = seconds % 60; return m + ' minute' + (m !== 1 ? 's' : '') + (s > 0 ? ' ' + s + 's' : ''); }
function formatDate(iso) { if (!iso) return '\u2014'; try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } }
function formatRelativeTime(iso) { if (!iso) return ''; var diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000); if (diff < 60) return 'just now'; if (diff < 3600) return Math.floor(diff / 60) + 'm ago'; if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'; return Math.floor(diff / 86400) + 'd ago'; }
function formatNumber(n) { if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(1) + 'K'; return String(n); }
function estimateDurationFromWords(wordCount, wpm) { return Math.ceil((wordCount / (wpm || 150)) * 60); }
function getMaxWordsForDuration(seconds, wpm) { return Math.floor(((seconds || 60) / 60) * (wpm || 150)); }
function getClipScriptOverflow(clip) {
  if (!clip || !clip.script_text) return null;
  var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
  var maxWords = getMaxWordsForDuration(clip.duration || 8, wpm);
  var actualWords = countWords(clip.script_text);
  if (actualWords <= maxWords) return null;
  return { actualWords: actualWords, maxWords: maxWords, overflowWords: actualWords - maxWords, duration: clip.duration || 8, wpm: wpm };
}

// --- Duration control utilities ---
function getSmartClipDuration(clipType) {
  var ct = CLIP_TYPES[clipType] || {};
  if (ct.track === 'ai') {
    var modelId = (S.meta && S.meta.aiPreferences) ? S.meta.aiPreferences.videoModel : '';
    var cfg = getModelDurationConfig(modelId);
    if (cfg.defaultDuration) return cfg.defaultDuration;
  }
  return ct.defaultDuration || 8;
}

function getModelDurationConfig(modelId) {
  var model = VIDEO_MODELS[modelId || ''];
  if (!model) { for (var k in VIDEO_MODELS) { if (VIDEO_MODELS[k].isDefault) { model = VIDEO_MODELS[k]; modelId = k; break; } } }
  if (!model) return { defaultDuration: 8, minDuration: 2, maxDuration: 120, durations: [], durationStep: 1, notes: '' };
  var overrides = (S.meta && S.meta.settings && S.meta.settings.video_model_overrides) ? S.meta.settings.video_model_overrides[modelId] : null;
  return {
    id: modelId, label: model.label || modelId,
    defaultDuration: (overrides && overrides.defaultDuration) || model.defaultDuration || 8,
    minDuration: (overrides && overrides.minDuration) || model.minDuration || 2,
    maxDuration: (overrides && overrides.maxDuration) || model.maxDuration || 120,
    durations: model.durations || [], durationStep: model.durationStep || 1, notes: model.notes || ''
  };
}

function snapToModelDuration(duration, modelId) {
  var cfg = getModelDurationConfig(modelId);
  return Math.max(cfg.minDuration, Math.min(cfg.maxDuration, Math.round(duration)));
}

function validateClipDuration(clip) {
  var ct = CLIP_TYPES[clip.type] || {};
  if (ct.track !== 'ai') return { valid: true, warning: '', snapped: clip.duration || 0 };
  var modelId = (clip.prompt_set && clip.prompt_set.video && clip.prompt_set.video.prompt) ? clip.prompt_set.video.prompt.model : ((S.meta && S.meta.aiPreferences) ? S.meta.aiPreferences.videoModel : '');
  var dur = clip.duration || 8;
  var cfg = getModelDurationConfig(modelId);
  var snapped = snapToModelDuration(dur, modelId);
  if (dur < cfg.minDuration) {
    return { valid: false, warning: dur + 's below minimum ' + cfg.minDuration + 's for ' + cfg.label, snapped: cfg.minDuration, model: cfg.label };
  }
  if (dur > cfg.maxDuration) {
    return { valid: false, warning: dur + 's exceeds maximum ' + cfg.maxDuration + 's for ' + cfg.label, snapped: cfg.maxDuration, model: cfg.label };
  }
  return { valid: true, warning: '', snapped: dur, model: cfg.label };
}

// --- Icon helper ---
function icon(name, className) {
  className = className || '';
  var icons = {
    'search':'fa-magnifying-glass','magnifying-glass':'fa-magnifying-glass','lightbulb':'fa-lightbulb','file-lines':'fa-file-lines',
    'sparkles':'fa-sparkles','download':'fa-download','upload':'fa-upload','cloud-arrow-up':'fa-cloud-arrow-up','hand-pointer':'fa-hand-pointer',
    'circle':'fa-circle','circle-check':'fa-circle-check','check':'fa-check','loader':'fa-spinner fa-spin',
    'film':'fa-film','image':'fa-image','images':'fa-images',
    'pen':'fa-pen','pencil':'fa-pencil','trash':'fa-trash-can','copy':'fa-copy','plus':'fa-plus','xmark':'fa-xmark',
    'chevron-down':'fa-chevron-down','chevron-right':'fa-chevron-right','chevron-left':'fa-chevron-left','chevron-up':'fa-chevron-up','arrow-right':'fa-arrow-right','arrow-left':'fa-arrow-left',
    'clock':'fa-clock','clock-rotate-left':'fa-clock-rotate-left','bullseye':'fa-bullseye',
    'bolt':'fa-bolt','play':'fa-play','circle-stop':'fa-circle-stop','gear':'fa-gear','gears':'fa-gears','sliders':'fa-sliders',
    'info':'fa-circle-info','circle-info':'fa-circle-info','warning':'fa-triangle-exclamation','circle-exclamation':'fa-circle-exclamation',
    'star':'fa-star','video':'fa-video','camera':'fa-camera','globe':'fa-globe','link':'fa-link',
    'users':'fa-users','user':'fa-user','user-tie':'fa-user-tie','user-check':'fa-user-check',
    'eye':'fa-eye','eye-slash':'fa-eye-slash','list':'fa-list','bars':'fa-bars',
    'palette':'fa-palette','wand-magic-sparkles':'fa-wand-magic-sparkles','arrows-rotate':'fa-arrows-rotate',
    'layer-group':'fa-layer-group','lock':'fa-lock','share-nodes':'fa-share-nodes','tags':'fa-tags',
    'briefcase':'fa-briefcase','clipboard-list':'fa-clipboard-list','scissors':'fa-scissors','fire':'fa-fire',
    'building':'fa-building','panorama':'fa-panorama',
    'microphone-lines':'fa-microphone-lines','volume-xmark':'fa-volume-xmark',
    'clapperboard':'fa-clapperboard','rocket':'fa-rocket','compass-drafting':'fa-compass-drafting',
    'chart-bar':'fa-chart-bar','desktop':'fa-desktop','heading':'fa-heading','bookmark':'fa-bookmark',
    'spinner':'fa-spinner','floppy-disk':'fa-floppy-disk',
    'crown':'fa-crown','face-smile':'fa-face-smile','mug-saucer':'fa-mug-saucer',
    'person-walking':'fa-person-walking','seedling':'fa-seedling','plane':'fa-plane',
    'youtube':'fa-youtube','instagram':'fa-instagram','facebook':'fa-facebook','linkedin':'fa-linkedin',
    'microchip':'fa-microchip','robot':'fa-robot','code':'fa-code',
    'mobile':'fa-mobile-screen-button','square':'fa-square',
    'grip-vertical':'fa-grip-vertical','align-left':'fa-align-left'
  };
  var faClass = icons[name] || 'fa-' + name;
  return '<i class="fas ' + faClass + (className ? ' ' + className : '') + ' vpm-icon"></i>';
}

function generateId(prefix) { return prefix + '_' + Math.random().toString(36).substr(2, 8); }

// --- Robust AI Response Parser ---
// Handles: markdown blocks, text wrapping, trailing commas, single quotes,
// escaped newlines, multiple objects, string-aware brace matching
function parseAIResponse(text) {
  if (!text || typeof text !== 'string') return null;
  // Step 1: Strip markdown code blocks
  var cleaned = text.replace(/```(?:json|JSON|js|javascript)?\s*\n?/gi, '').replace(/```\s*/g, '').trim();
  // Step 2: Direct parse (happy path)
  try { return JSON.parse(cleaned); } catch (e) {}
  // Step 3: Fix common LLM JSON errors and retry
  var fixed = _fixLLMJson(cleaned);
  try { return JSON.parse(fixed); } catch (e) {}
  // Step 4: String-aware extraction — find first { or [ respecting quoted strings
  var extracted = _extractJsonBlock(cleaned);
  if (extracted) {
    try { return JSON.parse(extracted); } catch (e) {}
    var fixedExtracted = _fixLLMJson(extracted);
    try { return JSON.parse(fixedExtracted); } catch (e) {}
  }
  // Step 5: Last resort — try to find any JSON-like substring
  var lastResort = _lastResortExtract(cleaned);
  if (lastResort) { try { return JSON.parse(lastResort); } catch (e) {} }
  console.warn('[VPM] parseAIResponse failed. Raw text:', text.substring(0, 500));
  return null;
}

function _fixLLMJson(s) {
  // Fix trailing commas: ,] or ,}
  s = s.replace(/,(\s*[\]}])/g, '$1');
  // Fix single quotes around keys/values (simple cases)
  s = s.replace(/(['"])?(\w+)(['"])?\s*:\s*'([^']*)'/g, '"$2": "$4"');
  // Fix unquoted keys: { key: "value" } → { "key": "value" }
  s = s.replace(/{\s*(\w+)\s*:/g, '{"$1":');
  s = s.replace(/,\s*(\w+)\s*:/g, ',"$1":');
  // Fix escaped newlines inside strings (literal \n not \\n)
  s = s.replace(/\n/g, '\\n');
  // Fix control characters
  s = s.replace(/[\x00-\x1F\x7F]/g, function(c) { return c === '\n' || c === '\r' || c === '\t' ? c : ''; });
  return s;
}

function _extractJsonBlock(text) {
  // Find first { or [ that starts a JSON block, respecting quoted strings
  var firstBrace = -1, firstBracket = -1;
  var inStr = false, escape = false;
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{' && firstBrace < 0) firstBrace = i;
    if (ch === '[' && firstBracket < 0) firstBracket = i;
    if (firstBrace >= 0 && firstBracket >= 0) break;
  }
  var start = -1;
  if (firstBrace >= 0 && (firstBracket < 0 || firstBrace < firstBracket)) start = firstBrace;
  else if (firstBracket >= 0) start = firstBracket;
  if (start < 0) return null;
  // String-aware brace matching
  var open = text[start], close = open === '{' ? '}' : ']';
  var depth = 0; inStr = false; escape = false;
  for (var j = start; j < text.length; j++) {
    var c = text[j];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === open) depth++;
    if (c === close) { depth--; if (depth === 0) return text.substring(start, j + 1); }
  }
  return null;
}

function _lastResortExtract(text) {
  // Try regex to find {...} or [...] patterns
  var m = text.match(/(\{[\s\S]*\})/);
  if (m) { var fixed = _fixLLMJson(m[1]); try { JSON.parse(fixed); return fixed; } catch(e) {} }
  m = text.match(/(\[[\s\S]*\])/);
  if (m) { var fixed2 = _fixLLMJson(m[1]); try { JSON.parse(fixed2); return fixed2; } catch(e) {} }
  return null;
}

// Keep legacy name as alias for backward compat
function parseJSON(text) { return parseAIResponse(text); }
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
function isEmpty(obj) { return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0); }
function debounce(fn, delay) { var t; return function() { var c = this, a = arguments; clearTimeout(t); t = setTimeout(function() { fn.apply(c, a); }, delay); }; }

function logActivity(type, description) {
  S.activity.unshift({ id: generateId('act'), type: type, description: description, timestamp: new Date().toISOString(), user_id: S.user.id || '0', user_name: S.user.name || 'system' });
  if (S.activity.length > 200) S.activity = S.activity.slice(0, 200);
}
function getFilteredActivity() {
  var list = S.activity || [], f = S.activityFilter;
  if (f.type) list = list.filter(function(a) { return a.type === f.type; });
  if (f.search) { var q = f.search.toLowerCase(); list = list.filter(function(a) { return (a.description || '').toLowerCase().indexOf(q) > -1; }); }
  return list;
}

// --- Badges ---
function badge(text, bg, fg) { fg = fg || bg; return '<span class="vpm-badge" style="background:' + bg + '15;color:' + fg + '">' + esc(text) + '</span>'; }
function statusBadge(status) { var c = VIDEO_STATUSES[status] || { label: status, color: '#6b7280', icon: 'circle' }; return '<span class="vpm-status-badge"><span class="vpm-status-dot" style="background:' + c.color + '"></span>' + esc(c.label) + '</span>'; }
function clipTypeBadge(clipType) { var ct = CLIP_TYPES[clipType] || { label: clipType, icon: 'film', color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + ct.color + '15;color:' + ct.color + '">' + icon(ct.icon) + ' ' + esc(ct.label) + '</span>'; }
function trackBadge(track) { var tc = { ai: { l: 'AI', c: '#7c3aed', i: 'robot' }, 'non-ai': { l: 'Non-AI', c: '#e37400', i: 'camera' }, template: { l: 'Template', c: '#9ca3af', i: 'copy' } }; var t = tc[track] || tc.ai; return '<span class="vpm-badge" style="background:' + t.c + '15;color:' + t.c + '">' + icon(t.i) + ' ' + esc(t.l) + '</span>'; }
function clipStatusBadge(status, track) { var sm = (track === 'non-ai') ? NON_AI_CLIP_STATUSES : (track === 'template') ? TEMPLATE_CLIP_STATUSES : AI_CLIP_STATUSES; var cs = sm[status] || { label: status, color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + cs.color + '15;color:' + cs.color + '">' + esc(cs.label) + '</span>'; }
function sourceBadge(source) { return source === 'brand' ? '<span class="vpm-source-badge vpm-source-brand">' + icon('building') + ' Brand</span>' : '<span class="vpm-source-badge vpm-source-video">' + icon('video') + ' Custom</span>'; }
function roleBadge(roleId) { var r = LOOK_ROLES[roleId] || { label: roleId, color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + r.color + '15;color:' + r.color + '">' + esc(r.label) + '</span>'; }
function progressBar(pct, color) { color = color || 'var(--vpm-primary)'; return '<div class="vpm-progress-bar"><div class="vpm-progress-fill" style="width:' + pct + '%;background:' + color + '"></div></div>'; }
function _getEntityPrimaryImage(entity) { if (!entity || !entity.reference_images) return ''; for (var i = 0; i < entity.reference_images.length; i++) { if (entity.reference_images[i].url) return entity.reference_images[i].url; } return entity.thumbnail_url || ''; }

  // ============================================================
  // EXPORTS — preserve existing window._vpm* API
  // ============================================================
  window._vpmEsc = esc;
  window._vpmTruncate = truncate;
  window._vpmStripHtml = stripHtml;
  window._vpmCountWords = countWords;
  window._vpmFormatDuration = formatDuration;
  window._vpmFormatDurationLong = formatDurationLong;
  window._vpmFormatDate = formatDate;
  window._vpmFormatRelativeTime = formatRelativeTime;
  window._vpmFormatNumber = formatNumber;
  window._vpmEstimateDuration = estimateDurationFromWords;
  window._vpmGetMaxWordsForDuration = getMaxWordsForDuration;
  window._vpmGetClipScriptOverflow = getClipScriptOverflow;
  window._vpmGetSmartClipDuration = getSmartClipDuration;
  window._vpmGetModelDurationConfig = getModelDurationConfig;
  window._vpmSnapToModelDuration = snapToModelDuration;
  window._vpmValidateClipDuration = validateClipDuration;
  window._vpmIcon = icon;
  window._vpmGenerateId = generateId;
  window._vpmParseAIResponse = parseAIResponse;
  window._vpmParseJSON = parseJSON;
  window._vpmDeepClone = deepClone;
  window._vpmIsEmpty = isEmpty;
  window._vpmDebounce = debounce;
  window._vpmLogActivity = logActivity;
  window._vpmGetFilteredActivity = getFilteredActivity;
  window._vpmBadge = badge;
  window._vpmStatusBadge = statusBadge;
  window._vpmClipTypeBadge = clipTypeBadge;
  window._vpmTrackBadge = trackBadge;
  window._vpmClipStatusBadge = clipStatusBadge;
  window._vpmSourceBadge = sourceBadge;
  window._vpmRoleBadge = roleBadge;
  window._vpmProgressBar = progressBar;
  window._vpmGetEntityPrimaryImage = _getEntityPrimaryImage;

  // New unified namespace
  window._vpm = window._vpm || {};
  window._vpm.utils = {
    esc: esc, truncate: truncate, stripHtml: stripHtml, countWords: countWords,
    formatDuration: formatDuration, formatDurationLong: formatDurationLong,
    formatDate: formatDate, formatRelativeTime: formatRelativeTime, formatNumber: formatNumber,
    icon: icon, generateId: generateId, parseAIResponse: parseAIResponse, parseJSON: parseJSON,
    deepClone: deepClone, isEmpty: isEmpty, debounce: debounce, logActivity: logActivity,
    badge: badge, statusBadge: statusBadge, clipTypeBadge: clipTypeBadge
  };
})();
