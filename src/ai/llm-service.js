/**
 * VPM LLM Service + AI Action System
 *
 * Combined module — LLMService (8 providers, fetch/abort/extract) and the AI
 * Action System (registry, preflight modal, progress overlay, retry wrapper).
 * Kept together because LLMService.callAI() references _aiAbortController and
 * _hideAIProgress that live in the action-system closure.
 *
 * Registers on window._vpm:
 *   - llmService  (the LLMService API)
 *   - aiActions   ({ AI_ACTIONS, _openAIActionModal, _showAIProgress, _hideAIProgress,
 *                    _cancelAI, _buildCustomBlock, _launchAI, _callAIWithRetry,
 *                    _hasRequiredKeys, _extractArray })
 *
 * Reads from window (set by part1 before this file runs):
 *   - window._vpmState  (S)
 *   - window._vpmIcon, _vpmEsc, _vpmTruncate, _vpmToast, _vpmParseJSON,
 *     _vpmSyncToTextarea, _vpmOpenModal, _vpmCloseModal
 *
 * MUST load AFTER vpm-part1.js (which sets the window._vpm* helpers).
 */
(function ($, Drupal) {
  'use strict';

  // ============================================================
  // Dependency capture — pulled from window at parse time.
  // ============================================================
  var S = window._vpmState;
  var icon = window._vpmIcon, esc = window._vpmEsc, truncate = window._vpmTruncate;
  var toast = window._vpmToast, parseJSON = window._vpmParseJSON;
  var syncToTextarea = window._vpmSyncToTextarea;
  var openModal = window._vpmOpenModal, closeModal = window._vpmCloseModal;

// ============================================================
// SECTION 2: LLMService (8 AI Providers)
// ============================================================

var AI_ENDPOINTS = {
  'gemini':      'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
  'claude':      'https://api.anthropic.com/v1/messages',
  'openai':      'https://api.openai.com/v1/chat/completions',
  'grok':        'https://api.x.ai/v1/chat/completions',
  'groq':        'https://api.groq.com/openai/v1/chat/completions',
  'nvidia':      'https://integrate.api.nvidia.com/v1/chat/completions',
  'huggingface': 'https://router.huggingface.co/v1/chat/completions',
  'openrouter':  'https://openrouter.ai/api/v1/chat/completions'
};

var LLMService = (function() {
  var _config = null, _providerMap = {}, _initialized = false;

  function init() {
    _config = null; _providerMap = {};
    var $cfg = $('.llm-config-data'), raw = null;
    if ($cfg.length) { try { raw = JSON.parse($cfg.text().trim()); } catch(e) {} }
    _config = raw;
    if (_config && _config.providers) {
      for (var i = 0; i < _config.providers.length; i++) {
        var p = _config.providers[i]; if (!p.active) continue;
        var activeModels = (p.models || []).filter(function(m) { return m.active; });
        if (!activeModels.length) continue;
        _providerMap[p.id] = { id: p.id, label: p.label || p.id, api_key: p.api_key || '', activeModels: activeModels };
      }
    }
    _initialized = true;
    console.log('[VPM] LLMService: ' + Object.keys(_providerMap).length + ' active providers');
    // Observe for async-loaded config if no providers found
    if (!Object.keys(_providerMap).length) _observeLLMConfig();
  }

  function _observeLLMConfig() {
    try {
      var _llmObserver = new MutationObserver(function() {
        var $cfg = $('.llm-config-data');
        if (!$cfg.length) return;
        _llmObserver.disconnect();
        init();
        if (isConfigured()) {
          console.log('[VPM] LLMService: providers loaded via observer');
          if (window._vpmRender) window._vpmRender();
        }
      });
      _llmObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(function() { _llmObserver.disconnect(); }, 30000);
    } catch (e) { console.warn('[VPM] LLM observer failed:', e); }
  }

  function reinit() { init(); }

  function isConfigured() { return Object.keys(_providerMap).length > 0; }
  function getActiveProviders() { return Object.keys(_providerMap).map(function(id) { return _providerMap[id]; }); }
  function getActiveModels(pid) { var p = _providerMap[pid]; return p ? p.activeModels : []; }

  function getDefault() {
    var providers = getActiveProviders(); if (!providers.length) return null;
    var prefs = (S.meta && S.meta.aiPreferences) || {};
    if (prefs.appDefault && prefs.appDefault.provider && _providerMap[prefs.appDefault.provider]) {
      return { provider: prefs.appDefault.provider, model: prefs.appDefault.model, api_key: _providerMap[prefs.appDefault.provider].api_key };
    }
    var fp = providers[0];
    return { provider: fp.id, model: fp.activeModels[0].id, api_key: fp.api_key };
  }

  function resolveSelection(actionId) {
    var prefs = (S.meta && S.meta.aiPreferences) || {};
    var _resolveModelCfg = function(pid, mid) {
      var p = _providerMap[pid]; if (!p) return null;
      var cfg = { provider: pid, model: mid, api_key: p.api_key, temperature: 1.0, max_tokens: 8192 };
      // Find model-specific settings
      for (var mi = 0; mi < p.activeModels.length; mi++) {
        if (p.activeModels[mi].id === mid) {
          if (p.activeModels[mi].temperature !== undefined) cfg.temperature = p.activeModels[mi].temperature;
          if (p.activeModels[mi].max_tokens) cfg.max_tokens = p.activeModels[mi].max_tokens;
          break;
        }
      }
      return cfg;
    };
    if (actionId && prefs.perAction && prefs.perAction[actionId]) {
      var pa = prefs.perAction[actionId];
      if (_providerMap[pa.provider]) return _resolveModelCfg(pa.provider, pa.model);
    }
    if (prefs.lastProvider && _providerMap[prefs.lastProvider]) return _resolveModelCfg(prefs.lastProvider, prefs.lastModel);
    return getDefault();
  }

  function savePreference(actionId, pid, mid) {
    S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences.perAction = S.meta.aiPreferences.perAction || {};
    S.meta.aiPreferences.lastProvider = pid; S.meta.aiPreferences.lastModel = mid;
    if (actionId) S.meta.aiPreferences.perAction[actionId] = { provider: pid, model: mid };
    syncToTextarea();
  }

  function renderInlinePicker(actionId) {
    if (!isConfigured()) return '<span class="vpm-text-sm vpm-text-muted">' + icon('warning') + ' No AI configured</span>';
    var sel = resolveSelection(actionId), providers = getActiveProviders();
    var html = '<span class="vpm-ai-picker" data-action-id="' + esc(actionId) + '">';
    html += '<select class="vpm-select vpm-select-sm vpm-ai-provider-select" data-action-id="' + esc(actionId) + '">';
    for (var i = 0; i < providers.length; i++) { var p = providers[i]; html += '<option value="' + esc(p.id) + '"' + (sel && sel.provider === p.id ? ' selected' : '') + '>' + esc(p.label) + '</option>'; }
    html += '</select>';
    var curProv = sel ? _providerMap[sel.provider] : providers[0];
    var models = curProv ? curProv.activeModels : [];
    html += '<select class="vpm-select vpm-select-sm vpm-ai-model-select" data-action-id="' + esc(actionId) + '">';
    for (var j = 0; j < models.length; j++) { var m = models[j]; html += '<option value="' + esc(m.id) + '"' + (sel && sel.model === m.id ? ' selected' : '') + ' data-temp="' + (m.temperature !== undefined ? m.temperature : 1.0) + '" data-tokens="' + (m.max_tokens || 8192) + '">' + esc(m.label || m.id) + '</option>'; }
    html += '</select></span>';
    return html;
  }

  function _getSelFromPicker(actionId) {
    var $prov = $('.vpm-ai-provider-select[data-action-id="' + actionId + '"]');
    if (!$prov.length) return resolveSelection(actionId);
    var pid = $prov.val(), mid = $('.vpm-ai-model-select[data-action-id="' + actionId + '"]').val();
    var $opt = $('.vpm-ai-model-select[data-action-id="' + actionId + '"] option:selected');
    return { provider: pid, model: mid, temperature: parseFloat($opt.data('temp')) || 1.0, max_tokens: parseInt($opt.data('tokens'), 10) || 8192, api_key: _providerMap[pid] ? _providerMap[pid].api_key : '' };
  }

  function callAI(prompt, onSuccess, onError, actionId, systemPrompt, overrides) {
    var cfg = _getSelFromPicker(actionId || '');
    if (!cfg || !cfg.api_key) { if (onError) onError('No AI configured. Add API keys in Settings \u2192 AI Providers.'); return; }
    if (overrides) { for (var ok in overrides) cfg[ok] = overrides[ok]; }
    var provider = cfg.provider, model = cfg.model, apiKey = cfg.api_key;
    var endpoint = AI_ENDPOINTS[provider]; if (!endpoint) { if (onError) onError('Unknown provider'); return; }
    systemPrompt = systemPrompt || '';
    var body, headers;
    switch (provider) {
      case 'gemini':
        endpoint = endpoint.replace('{MODEL}', model) + '?key=' + apiKey;
        headers = { 'Content-Type': 'application/json' };
        body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: cfg.max_tokens, temperature: cfg.temperature, topP: 0.95, responseMimeType: 'application/json' } };
        if (systemPrompt) body.system_instruction = { parts: [{ text: systemPrompt }] };
        break;
      case 'claude':
        headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
        body = { model: model, max_tokens: cfg.max_tokens, messages: [{ role: 'user', content: prompt }] };
        if (cfg.temperature !== undefined) body.temperature = cfg.temperature;
        if (systemPrompt) body.system = systemPrompt;
        break;
      default:
        headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
        if (provider === 'openrouter') { headers['HTTP-Referer'] = window.location.origin; headers['X-Title'] = 'VPM Video Production'; }
        body = { model: model, max_tokens: cfg.max_tokens, messages: [{ role: 'user', content: prompt }], temperature: cfg.temperature };
        if (systemPrompt) body.messages = [{ role: 'system', content: systemPrompt }].concat(body.messages);
        if (provider === 'groq' && body.temperature === 0) body.temperature = 0.01;
    }
    var fetchOpts = { method: 'POST', headers: headers, body: JSON.stringify(body) };
    if (_aiAbortController && _aiAbortController.signal) fetchOpts.signal = _aiAbortController.signal;
    fetch(endpoint, fetchOpts)
      .then(function(res) { if (!res.ok) return res.text().then(function(t) { var m = 'API ' + res.status; try { m = JSON.parse(t).error.message || m; } catch(e) {} throw new Error(m); }); return res.json(); })
      .then(function(data) {
        var text = _extractText(provider, data);
        console.log('[VPM] AI (' + provider + '/' + model + '):', text.substring(0, 200));
        if (actionId) savePreference(actionId, provider, model);
        _hideAIProgress();
        if (onSuccess) onSuccess(text);
      })
      .catch(function(err) {
        _hideAIProgress();
        if (err.name === 'AbortError') { console.log('[VPM] AI call aborted'); return; }
        console.error('[VPM] AI error:', err);
        if (onError) onError(err.message || 'Request failed');
      });
  }

  function _extractText(provider, data) {
    try {
      if (provider === 'gemini') return (data.candidates && data.candidates[0] && data.candidates[0].content) ? data.candidates[0].content.parts.map(function(p) { return p.text || ''; }).join('') : JSON.stringify(data);
      if (provider === 'claude') return data.content ? data.content.filter(function(c) { return c.type === 'text'; }).map(function(c) { return c.text; }).join('') : '';
      return (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content || '' : '';
    } catch(e) { return JSON.stringify(data); }
  }

  return { init: init, reinit: reinit, isConfigured: isConfigured, getActiveProviders: getActiveProviders, getActiveModels: getActiveModels, getDefault: getDefault, resolveSelection: resolveSelection, savePreference: savePreference, renderInlinePicker: renderInlinePicker, callAI: callAI };
})();


// ============================================================
// SECTION 4: AI ACTION SYSTEM — Registry, Preflight, Progress
// ============================================================

var AI_ACTIONS = {
  'analyze-idea':         { label: 'Analyze Video Idea',         icon: 'lightbulb',           size: 'big' },
  'generate-research':    { label: 'Generate Research Brief',    icon: 'magnifying-glass',    size: 'big' },
  'generate-blueprint':   { label: 'Generate Blueprint',         icon: 'compass-drafting',    size: 'big' },
  'generate-script':      { label: 'Generate Script',            icon: 'file-lines',          size: 'big' },
  'enhance-script':       { label: 'Enhance Script Section',     icon: 'wand-magic-sparkles', size: 'small' },
  'generate-clips':       { label: 'Generate Clip Breakdown',    icon: 'clapperboard',        size: 'big' },
  'analyze-studio':       { label: 'Analyze Studio Needs',       icon: 'palette',             size: 'big' },
  'generate-scenes':      { label: 'Generate Scenes',            icon: 'image',               size: 'big' },
  'generate-prompt':      { label: 'Generate Image Prompt',      icon: 'image',               size: 'small' },
  'generate-video':       { label: 'Generate Video Prompt',      icon: 'film',                size: 'small' },
  'improve-brief':        { label: 'Improve Production Brief',   icon: 'clipboard-list',      size: 'small' },
  'generate-metadata':    { label: 'Generate YouTube Metadata',  icon: 'youtube',             size: 'big' },
  'generate-chapters':    { label: 'Generate Chapters',          icon: 'clock',               size: 'small' },
  'generate-thumbnails':  { label: 'Generate Thumbnail Ideas',   icon: 'image',               size: 'big' },
  'regen-research':       { label: 'Regenerate Research Section', icon: 'magnifying-glass',   size: 'small' },
  'regen-thumbnail':      { label: 'Regenerate Thumbnail Idea',  icon: 'image',               size: 'small' },
  'extract-preferences':  { label: 'Extract Preferences from Idea', icon: 'wand-magic-sparkles', size: 'big' }
};

var _aiProgressActive = false, _aiProgressTimer = null, _aiProgressStartTime = 0, _aiAbortController = null;

function _openAIActionModal(actionId, context, onConfirm) {
  var action = AI_ACTIONS[actionId] || { label: actionId, icon: 'sparkles' };
  var stg = (S.meta && S.meta.settings) || {};
  if (!stg.show_ai_preflight) { var li = ((S.meta.aiPreferences || {}).lastCustomInstructions || {})[actionId] || ''; onConfirm(li); return; }
  if (!LLMService.isConfigured()) { toast('No AI configured. Add API keys in Settings \u2192 AI Providers.', 'warning'); return; }
  var lastInstr = ((S.meta.aiPreferences || {}).lastCustomInstructions || {})[actionId] || '';
  var globalInstr = stg.ai_global_instructions || '';
  var html = '<div class="vpm-ai-preflight">';
  html += '<div class="vpm-ai-preflight-header"><div class="vpm-ai-preflight-icon">' + icon(action.icon) + '</div>';
  html += '<div><div class="vpm-ai-preflight-title">' + esc(action.label) + '</div></div></div>';
  if (context) html += '<div class="vpm-ai-preflight-ctx"><span class="vpm-text-xs vpm-text-muted">' + icon('info') + ' ' + esc(context) + '</span></div>';
  if (globalInstr) html += '<div class="vpm-ai-preflight-global">' + icon('globe') + ' <span class="vpm-text-xs vpm-text-muted">' + esc(truncate(globalInstr, 120)) + '</span></div>';
  html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('robot') + ' AI Model</label>' + LLMService.renderInlinePicker(actionId) + '</div>';
  html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('pen') + ' Custom Instructions <span class="vpm-text-muted" style="font-weight:400">(optional)</span></label>';
  html += '<textarea class="vpm-textarea" id="vpmAICustomInstr" rows="3" placeholder="e.g. Focus on beginners, keep tone casual\u2026">' + esc(lastInstr) + '</textarea></div>';
  html += '</div>';
  openModal(action.label, html, { size: 'md', saveLabel: icon('sparkles') + ' Generate', onSave: function() {
    var ci = ($('#vpmAICustomInstr').val() || '').trim();
    S.meta.aiPreferences = S.meta.aiPreferences || {};
    S.meta.aiPreferences.lastCustomInstructions = S.meta.aiPreferences.lastCustomInstructions || {};
    S.meta.aiPreferences.lastCustomInstructions[actionId] = ci;
    // CRITICAL: Save the selected provider/model BEFORE modal closes (fixes model switching bug)
    var $prov = $('.vpm-ai-provider-select[data-action-id="' + actionId + '"]');
    var $model = $('.vpm-ai-model-select[data-action-id="' + actionId + '"]');
    if ($prov.length && $prov.val()) {
      LLMService.savePreference(actionId, $prov.val(), $model.val() || '');
    }
    syncToTextarea(); closeModal();
    onConfirm(ci);
  }});
}

function _showAIProgress(actionId, isBig) {
  _hideAIProgress();
  var action = AI_ACTIONS[actionId] || { label: actionId, icon: 'sparkles' };
  _aiProgressActive = true; _aiProgressStartTime = Date.now();
  _aiAbortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var html = '<div class="vpm-ai-overlay' + (isBig ? ' vpm-ai-overlay-full' : ' vpm-ai-overlay-inline') + '" id="vpmAIOverlay">';
  html += '<div class="vpm-ai-overlay-inner"><div class="vpm-ai-spinner"></div>';
  html += '<div class="vpm-ai-overlay-label">' + esc(action.label) + '</div>';
  html += '<div class="vpm-ai-overlay-timer" id="vpmAITimer">Working\u2026 0s</div>';
  html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="cancel-ai">' + icon('xmark') + ' Cancel</button>';
  html += '</div></div>';
  if (isBig) $('body').append(html);
  else { var $c = $('#vpmContent'); if ($c.length) { $c.css('position', 'relative'); $c.append(html); } else $('body').append(html); }
  _aiProgressTimer = setInterval(function() { var e = Math.floor((Date.now() - _aiProgressStartTime) / 1000); $('#vpmAITimer').text('Working\u2026 ' + e + 's'); }, 1000);
  setTimeout(function() { $('#vpmAIOverlay').addClass('vpm-ai-overlay-visible'); }, 10);
}

function _hideAIProgress() {
  _aiProgressActive = false;
  if (_aiProgressTimer) { clearInterval(_aiProgressTimer); _aiProgressTimer = null; }
  var $o = $('#vpmAIOverlay');
  if ($o.length) { $o.removeClass('vpm-ai-overlay-visible'); setTimeout(function() { $o.remove(); $('#vpmContent').css('position', ''); }, 200); }
  _aiAbortController = null;
}

function _cancelAI() { if (_aiAbortController) { try { _aiAbortController.abort(); } catch(e) {} } _hideAIProgress(); toast('AI action cancelled', 'info'); }

function _buildCustomBlock(actionId, ci) {
  var parts = [];
  var gi = ((S.meta && S.meta.settings) || {}).ai_global_instructions || '';
  if (gi) parts.push('--- GLOBAL INSTRUCTIONS ---\n' + gi);
  if (ci) parts.push('--- CUSTOM INSTRUCTIONS ---\n' + ci);
  return parts.length ? '\n\n' + parts.join('\n\n') : '';
}

function _launchAI(actionId, ctx, fn) { _openAIActionModal(actionId, ctx, function(ci) { fn(ci); }); }

// --- Auto-retry AI call wrapper ---
// First attempt: normal call. If parseAIResponse fails, retry once with strict JSON-only prompt.
function _callAIWithRetry(prompt, systemPrompt, actionId, progressId, isBig, onParsed, requiredKeys, opts) {
  opts = opts || {};
  _showAIProgress(progressId || actionId, isBig);
  LLMService.callAI(prompt, function(text) {
    var r = parseJSON(text);
    if (r && _hasRequiredKeys(r, requiredKeys)) { onParsed(r); return; }
    // Retry with strict prompt
    console.warn('[VPM] Parse failed on first attempt, retrying with strict prompt. Raw:', text ? text.substring(0, 300) : '(empty)');
    var retryPrompt = 'CRITICAL: The previous response was not valid JSON. Return ONLY a valid JSON object. No explanation, no markdown, no text before or after the JSON.\n\n' + prompt;
    LLMService.callAI(retryPrompt, function(text2) {
      var r2 = parseJSON(text2);
      if (r2 && _hasRequiredKeys(r2, requiredKeys)) { onParsed(r2); return; }
      // Both attempts failed
      console.error('[VPM] Parse failed after retry. Raw:', text2 ? text2.substring(0, 500) : '(empty)');
      toast('AI returned unparseable response. Check console for raw output.', 'error');
    }, function(err) { toast('AI retry error: ' + err, 'error'); }, actionId, systemPrompt, opts);
  }, function(err) { toast('AI error: ' + err, 'error'); }, actionId, systemPrompt, opts);
}

function _hasRequiredKeys(obj, keys) {
  if (!keys || !keys.length) return !!obj;
  for (var i = 0; i < keys.length; i++) {
    var val = obj[keys[i]];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
  }
  return true;
}

// Normalize AI response shape: handles {sections:[...]}, {script:{sections:[...]}}, or [...]
function _extractArray(result, key) {
  if (!result) return null;
  // Direct key
  if (result[key] && Array.isArray(result[key])) return result[key];
  // Nested one level: {script: {sections: [...]}}
  for (var k in result) {
    if (result[k] && typeof result[k] === 'object' && result[k][key] && Array.isArray(result[k][key])) return result[k][key];
  }
  // Root is array
  if (Array.isArray(result)) return result;
  return null;
}

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.llmService = LLMService;
  window._vpm.aiActions = {
    AI_ACTIONS: AI_ACTIONS,
    _openAIActionModal: _openAIActionModal,
    _showAIProgress: _showAIProgress,
    _hideAIProgress: _hideAIProgress,
    _cancelAI: _cancelAI,
    _buildCustomBlock: _buildCustomBlock,
    _launchAI: _launchAI,
    _callAIWithRetry: _callAIWithRetry,
    _hasRequiredKeys: _hasRequiredKeys,
    _extractArray: _extractArray
  };
})(jQuery, Drupal);
