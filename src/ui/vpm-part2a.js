/**
 * AI Video Production Manager v1.0 - Part 2A: CRUD & Editing Engine
 *
 * Phase 2: Modal system, undo/redo, Start stage (mode selector, preferences,
 * prompt input), Blueprint stage (section editor, duration allocation).
 * Future phases add: Script, Studio, Clips, Publish renderers.
 *
 * Registers: startFull, blueprintFull + setup*Events
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  // ============================================================
  // SECTION 1: INIT & IMPORTS
  // ============================================================

  var S, render, navigateToStage, toast, generateId, buildMaps, syncToTextarea;
  var logActivity, esc, deepClone, icon, truncate, stripHtml, debounce, isEmpty, countWords;
  var formatDate, formatRelativeTime, formatDuration, formatDurationLong, formatNumber;
  var badge, statusBadge, clipTypeBadge, trackBadge, clipStatusBadge;
  var sourceBadge, roleBadge, progressBar, estimateDuration, parseJSON;
  var getSmartClipDuration, getModelDurationConfig, snapToModelDuration, validateClipDuration;
  var canAccessStage, isStageComplete, getStageProgress;
  var evaluateClipStatus, maybeAdvanceClipStatus, recomputeClipTimings, recomputeScriptDurations;
  var createDefaultClip, createEmptyPromptSet, createEmptyFrame, createEmptyPrompt, createDefaultNonAiPlanning;
  var createDefaultLook, createDefaultEnvironment, createDefaultScene, createDefaultBodySection;
  var ensurePromptSet, ensureNonAiPlanning, ensureProductionConfig;
  var renderClipList, renderClipCard, renderTimelineBar, renderNavButtons, renderProductionProgress;
  var getEntityPrimaryImage, parseGalleries, queueGalleryUpload, triggerGalleryRemove;
  var getStageOrder, setNested, _csColor, _refreshSidebarNav;
  var normalizeClipType, createLightweightClip;
  var getClipPrerequisites, getClipScriptOverflow, getMaxWordsForDuration;
  var Constants;

  var _checkCount = 0;
  var checkInterval = setInterval(function() {
    _checkCount++;
    if (window._vpmState && window._vpmState.initialized) { clearInterval(checkInterval); initPart2A(); }
    else if (_checkCount > 250) {
      clearInterval(checkInterval);
      console.error('[VPM] Part 2A: Timed out waiting for Part 1');
    }
  }, 100);

  function initPart2A() {
    console.log('[VPM] Initializing Part 2A...');

    // Import all Part 1 exports
    S = window._vpmState;
    render = window._vpmRender; navigateToStage = window._vpmNavigateToStage;
    toast = window._vpmToast; generateId = window._vpmGenerateId;
    buildMaps = window._vpmBuildMaps; syncToTextarea = window._vpmSyncToTextarea;
    logActivity = window._vpmLogActivity;
    esc = window._vpmEsc; deepClone = window._vpmDeepClone; icon = window._vpmIcon;
    truncate = window._vpmTruncate; stripHtml = window._vpmStripHtml;
    debounce = window._vpmDebounce; isEmpty = window._vpmIsEmpty; countWords = window._vpmCountWords;
    formatDate = window._vpmFormatDate; formatRelativeTime = window._vpmFormatRelativeTime;
    formatDuration = window._vpmFormatDuration; formatDurationLong = window._vpmFormatDurationLong;
    formatNumber = window._vpmFormatNumber; estimateDuration = window._vpmEstimateDuration;
    parseJSON = window._vpmParseJSON; getSmartClipDuration = window._vpmGetSmartClipDuration;
    getModelDurationConfig = window._vpmGetModelDurationConfig;
    snapToModelDuration = window._vpmSnapToModelDuration;
    validateClipDuration = window._vpmValidateClipDuration;
    badge = window._vpmBadge; statusBadge = window._vpmStatusBadge;
    clipTypeBadge = window._vpmClipTypeBadge; trackBadge = window._vpmTrackBadge;
    clipStatusBadge = window._vpmClipStatusBadge;
    sourceBadge = window._vpmSourceBadge; roleBadge = window._vpmRoleBadge;
    progressBar = window._vpmProgressBar;
    canAccessStage = window._vpmCanAccessStage; isStageComplete = window._vpmIsStageComplete;
    getStageProgress = window._vpmGetStageProgress;
    evaluateClipStatus = window._vpmEvaluateClipStatus; maybeAdvanceClipStatus = window._vpmMaybeAdvanceClipStatus;
    recomputeClipTimings = window._vpmRecomputeClipTimings;
    recomputeScriptDurations = window._vpmRecomputeScriptDurations;
    createDefaultClip = window._vpmCreateDefaultClip;
    createEmptyPromptSet = window._vpmCreateEmptyPromptSet;
    createEmptyFrame = window._vpmCreateEmptyFrame;
    createEmptyPrompt = window._vpmCreateEmptyPrompt;
    createDefaultNonAiPlanning = window._vpmCreateDefaultNonAiPlanning;
    createDefaultLook = window._vpmCreateDefaultLook;
    createDefaultEnvironment = window._vpmCreateDefaultEnvironment;
    createDefaultScene = window._vpmCreateDefaultScene;
    createDefaultBodySection = window._vpmCreateDefaultBodySection;
    ensurePromptSet = window._vpmEnsurePromptSet;
    ensureNonAiPlanning = window._vpmEnsureNonAiPlanning;
    ensureProductionConfig = window._vpmEnsureProductionConfig;
    renderClipList = window._vpmRenderClipList; renderClipCard = window._vpmRenderClipCard;
    renderTimelineBar = window._vpmRenderTimelineBar; renderNavButtons = window._vpmRenderNavButtons;
    renderProductionProgress = window._vpmRenderProductionProgress;
    getEntityPrimaryImage = window._vpmGetEntityPrimaryImage;
    parseGalleries = window._vpmParseGalleries;
    queueGalleryUpload = window._vpmQueueGalleryUpload;
    triggerGalleryRemove = window._vpmTriggerGalleryRemove;
    getStageOrder = window._vpmGetStageOrder;
    setNested = window._vpmSetNested;
    _csColor = window._vpmCsColor;
    _refreshSidebarNav = window._vpmRefreshSidebarNav;
    normalizeClipType = window._vpmNormalizeClipType;
    createLightweightClip = window._vpmCreateLightweightClip;
    getClipPrerequisites = window._vpmGetClipPrerequisites;
    getClipScriptOverflow = window._vpmGetClipScriptOverflow;
    getMaxWordsForDuration = window._vpmGetMaxWordsForDuration;
    Constants = window._vpmConstants;

    // Register renderers (all stages + utilities)
    var R = window._vpmRenderers;
    R.startFull = renderStartFull;
    R.researchFull = renderResearchFull;
    R.blueprintFull = renderBlueprintFull;
    R.scriptFull = renderScriptFull;
    R.studioFull = renderStudioFull;
    R.clipsFull = renderClipsFull;
    R.publishFull = renderPublishFull;
    R.activityFull = renderActivityFull;

    setupPart2AEvents();
    _snapshotFull('Initial state');
    loadTiptap();
    $(document).on('vpm:beforeRender', function() { _destroyAllEditors(); });
    if (render) render();
    window._vpmPart2AReady = true;
    console.log('[VPM] Part 2A v1.0 initialized (all stages + utilities)');
  }


  // ============================================================
  // SECTION 2: MODAL SYSTEM
  // ============================================================

  var currentModal = null;

  function openModal(title, content, options) {
    options = options || {}; closeModal();
    var size = options.size || 'md';
    var html = '<div class="vpm-modal-backdrop"><div class="vpm-modal vpm-modal-' + size + '">';
    html += '<div class="vpm-modal-header"><h3>' + title + '</h3><button class="vpm-btn-icon vpm-modal-close" data-action="close-modal">' + icon('xmark') + '</button></div>';
    html += '<div class="vpm-modal-body">' + content + '</div>';
    if (options.footer !== false) {
      html += '<div class="vpm-modal-footer"><button class="vpm-btn vpm-btn-outline" data-action="close-modal">Cancel</button>';
      html += '<button class="vpm-btn vpm-btn-primary" data-action="modal-save">' + (options.saveLabel || 'Save') + '</button></div>';
    }
    html += '</div></div>';
    $('body').append(html); currentModal = options;
    setTimeout(function() { $('.vpm-modal-backdrop').addClass('vpm-modal-visible'); }, 10);
  }

  function closeModal() { $('.vpm-modal-backdrop').remove(); currentModal = null; }

  function openConfirmDialog(opts) {
    var html = '<div class="vpm-confirm-backdrop"><div class="vpm-confirm-dialog">';
    html += '<h3>' + esc(opts.title || 'Confirm') + '</h3><p>' + esc(opts.message || 'Are you sure?') + '</p>';
    html += '<div class="vpm-confirm-actions"><button class="vpm-btn vpm-btn-outline" data-action="confirm-cancel">Cancel</button>';
    html += '<button class="vpm-btn ' + (opts.danger ? 'vpm-btn-danger' : 'vpm-btn-primary') + '" data-action="confirm-ok">' + esc(opts.confirmLabel || 'Confirm') + '</button></div></div></div>';
    $('body').append(html);
    $(document).off('click.vpm2a-cok').on('click.vpm2a-cok', '[data-action="confirm-ok"]', function() { _closeConfirm(); if (opts.onConfirm) opts.onConfirm(); });
    $(document).off('click.vpm2a-ccn').on('click.vpm2a-ccn', '[data-action="confirm-cancel"]', function() { _closeConfirm(); });
  }

  function _closeConfirm() { $('.vpm-confirm-backdrop').remove(); $(document).off('click.vpm2a-cok click.vpm2a-ccn'); }

  function collectModalFields() {
    var data = {};
    $('.vpm-modal-body [data-field]').each(function() {
      var $f = $(this);
      data[$f.data('field')] = $f.is(':checkbox') ? $f.is(':checked') : $f.val();
    });
    return data;
  }


  // ============================================================
  // SECTION 3: UNDO/REDO
  // ============================================================

  function _snapshotFull(label) {
    S.undoStack = S.undoStack || [];
    S.undoStack.push({ label: label || '', data: deepClone(S.data), meta: deepClone(S.meta), activity: deepClone(S.activity) });
    if (S.undoStack.length > 50) S.undoStack.shift();
    S.redoStack = [];
  }

  // Override Part 1's stub
  window._vpmSnapshot = _snapshotFull;

  function undo() {
    if (!S.undoStack || S.undoStack.length <= 1) { toast('Nothing to undo', 'info'); return; }
    S.redoStack = S.redoStack || [];
    S.redoStack.push(S.undoStack.pop());
    var prev = S.undoStack[S.undoStack.length - 1];
    S.data = deepClone(prev.data); S.meta = deepClone(prev.meta); S.activity = deepClone(prev.activity);
    buildMaps(); syncToTextarea(); render();
    toast('Undone', 'info');
  }

  function redo() {
    if (!S.redoStack || !S.redoStack.length) { toast('Nothing to redo', 'info'); return; }
    var next = S.redoStack.pop();
    S.undoStack.push(next);
    S.data = deepClone(next.data); S.meta = deepClone(next.meta); S.activity = deepClone(next.activity);
    buildMaps(); syncToTextarea(); render();
    toast('Redone', 'info');
  }

  function _copyToClipboard(text) {
    if (navigator.clipboard) { navigator.clipboard.writeText(text).catch(function() { _fallbackCopy(text); }); }
    else { _fallbackCopy(text); }
    toast('Copied to clipboard', 'success');
  }
  function _fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {} document.body.removeChild(ta);
  }


  // ============================================================
  // SECTION 4: TIPTAP LOADING & N-SECTION EDITORS
  // ============================================================

  var _tiptapReady = false;
  var _tiptapEditors = {}; // keyed by section.id
  var _tiptapSyncTimer = null;

  function loadTiptap() {
    if (window.TiptapBundle || window.tiptap) { _tiptapReady = true; console.log('[VPM] Tiptap already loaded'); return; }
    // Try multiple CDN sources
    var sources = [
      'https://goultraai.com/libraries/tiptap/tiptap-bundle.js'
    ];
    function tryLoad(idx) {
      if (idx >= sources.length) { console.error('[VPM] All Tiptap sources failed'); toast('Script editor failed to load', 'error'); return; }
      var script = document.createElement('script');
      script.src = sources[idx];
      script.onload = function() { _tiptapReady = true; console.log('[VPM] Tiptap loaded from source ' + idx); if (S.currentStage === 'script') render(); };
      script.onerror = function() { console.warn('[VPM] Tiptap source ' + idx + ' failed, trying next...'); tryLoad(idx + 1); };
      document.head.appendChild(script);
    }
    tryLoad(0);
  }

  function _initSectionEditor(key, containerId, getContent, setContent) {
    _destroySectionEditor(key);
    var bundle = window.TiptapBundle || window.tiptap;
    if (!bundle || !bundle.Editor) return;
    var el = document.getElementById(containerId);
    if (!el) return;
    var sc = S.data.script || {};
    _tiptapEditors[key] = new bundle.Editor({
      element: el,
      extensions: [bundle.StarterKit],
      content: getContent() || '',
      editable: !sc.finalized,
      onUpdate: function(arg) {
        var html = arg.editor.getHTML();
        var wc = countWords(arg.editor.getText());
        setContent(html, wc);
        S.dirty = true;
        if (_tiptapSyncTimer) clearTimeout(_tiptapSyncTimer);
        _tiptapSyncTimer = setTimeout(function() {
          recomputeScriptDurations();
          syncToTextarea();
          _updateScriptStatsUI();
        }, 800);
      }
    });
  }

  function _destroySectionEditor(key) {
    if (_tiptapEditors[key]) { try { _tiptapEditors[key].destroy(); } catch(e) {} _tiptapEditors[key] = null; }
  }

  function _destroyAllEditors() {
    for (var k in _tiptapEditors) { if (_tiptapEditors[k]) _destroySectionEditor(k); }
    _tiptapEditors = {};
  }

  function _initAllScriptEditors() {
    if (!_tiptapReady) return;
    setTimeout(function() {
      var sc = S.data.script || {};
      var sections = sc.sections || [];
      for (var i = 0; i < sections.length; i++) {
        (function(sec) {
          _initSectionEditor(sec.id, 'vpmScriptSection_' + sec.id,
            function() { return sec.content || ''; },
            function(html, wc) { sec.content = html; sec.word_count = wc; }
          );
        })(sections[i]);
      }
    }, 50);
  }

  function _flushAllEditors() {
    var sc = S.data.script || {};
    var sections = sc.sections || [];
    for (var k in _tiptapEditors) {
      if (!_tiptapEditors[k]) continue;
      var html = _tiptapEditors[k].getHTML();
      var wc = countWords(_tiptapEditors[k].getText());
      var sec = sections.find(function(s) { return s.id === k; });
      if (sec) { sec.content = html; sec.word_count = wc; }
    }
    recomputeScriptDurations();
  }

  function _updateScriptStatsUI() {
    var sc = S.data.script || {};
    var $s = $('#vpmScriptStats');
    if ($s.length) {
      var td = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;
      $s.html(
        '<span class="vpm-text-sm vpm-text-muted">' + formatNumber(sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</span>' +
        '<span class="vpm-text-sm vpm-text-muted">Target: ' + formatDuration(td) + '</span>'
      );
      // Update progress bar
      var $bar = $('#vpmScriptProgressFill');
      if ($bar.length) {
        var pct = Math.min(100, Math.round(((sc.estimated_duration || 0) / Math.max(td, 1)) * 100));
        $bar.css('width', pct + '%');
      }
      // Update per-section stats
      var sections = sc.sections || [];
      for (var i = 0; i < sections.length; i++) {
        var $secStats = $('[data-section-stats="' + sections[i].id + '"]');
        if ($secStats.length) {
          $secStats.html(
            (sections[i].word_count || 0) + 'w \u00B7 ~' + formatDuration(sections[i].estimated_duration || 0)
          );
        }
      }
    }
  }


  // ============================================================
  // SECTION 5: START VIEW — FULL
  // ============================================================

  function renderStartFull() {
    var st = S.data.start || {};
    // Determine current start step
    if (!S.startStep) {
      S.startStep = (st.processed || st.import_source) ? 'preferences' : 'import';
    }
    var html = '<div class="vpm-view"><div class="vpm-start-container">';
    // Step indicator bar
    html += _renderStartStepBar();
    // Route to sub-renderer
    switch (S.startStep) {
      case 'preferences': html += _renderStartPreferences(); break;
      case 'review':      html += _renderStartReview(); break;
      default:            html += _renderStartImport(); break;
    }
    html += '</div></div>';
    return html;
  }

  // --- Step indicator bar ---
  function _renderStartStepBar() {
    var steps = [
      { key: 'import', label: 'Import', icon: 'file-import' },
      { key: 'preferences', label: 'Preferences', icon: 'gears' },
      { key: 'review', label: 'Review & Launch', icon: 'rocket' }
    ];
    var stepOrder = ['import', 'preferences', 'review'];
    var currentIdx = stepOrder.indexOf(S.startStep || 'import');
    var html = '<div class="vpm-start-steps">';
    for (var i = 0; i < steps.length; i++) {
      var isDone = i < currentIdx;
      var isCurrent = i === currentIdx;
      html += '<div class="vpm-start-step' + (isDone ? ' vpm-start-step-done' : '') + (isCurrent ? ' vpm-start-step-active' : '') + '" data-action="start-goto-step" data-step="' + steps[i].key + '">';
      html += '<div class="vpm-start-step-num">' + (isDone ? icon('circle-check') : (i + 1)) + '</div>';
      html += '<div class="vpm-start-step-label">' + icon(steps[i].icon) + ' ' + esc(steps[i].label) + '</div>';
      html += '</div>';
      if (i < steps.length - 1) html += '<div class="vpm-start-step-connector' + (isDone ? ' vpm-start-step-connector-done' : '') + '"></div>';
    }
    html += '</div>';
    return html;
  }

  // --- Step 1: Import ---
  function _renderStartImport() {
    var st = S.data.start || {};
    var html = '';

    // Hero
    html += '<div class="vpm-start-hero"><div class="vpm-start-icon">' + icon('file-import') + '</div>';
    html += '<h1 class="vpm-start-title">Import Video Plan</h1>';
    html += '<p class="vpm-start-desc">Import your video plan from YouTube Planner or another planning tool to begin production.</p></div>';

    // If already imported, show banner to continue
    if (st.import_source) {
      html += '<div class="vpm-info-banner vpm-info-banner-success" style="display:flex;align-items:center;gap:12px">';
      html += icon('circle-check') + ' <span><strong>Data imported from Video Planner</strong>';
      var mapped = st.import_source.fields_mapped || [];
      if (mapped.length) html += ' — ' + mapped.length + ' fields mapped';
      html += '</span>';
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="start-goto-step" data-step="preferences" style="margin-left:auto">' + icon('arrow-right') + ' Continue to Preferences</button>';
      html += '</div>';
    }

    // Import panel (inline, not modal)
    html += '<div class="vpm-panel vpm-start-import-panel">';
    html += '<div class="vpm-panel-title">' + icon('file-import') + ' Import Video Planner JSON</div>';

    // Tabs
    html += '<div class="vpm-inner-tabs" style="margin-bottom:16px">';
    html += '<button class="vpm-inner-tab' + (S._startImportTab !== 'upload' ? ' vpm-inner-tab-active' : '') + '" data-action="start-import-tab" data-tab="paste">' + icon('clipboard') + ' Paste JSON</button>';
    html += '<button class="vpm-inner-tab' + (S._startImportTab === 'upload' ? ' vpm-inner-tab-active' : '') + '" data-action="start-import-tab" data-tab="upload">' + icon('upload') + ' Upload File</button>';
    html += '</div>';

    // Paste area
    html += '<div class="vpm-import-tab-pane"' + (S._startImportTab === 'upload' ? ' style="display:none"' : '') + ' data-start-import-tab="paste">';
    html += '<textarea class="vpm-textarea" id="vpmStartImportJson" rows="14" style="font-family:var(--vpm-font-mono);font-size:12px" placeholder=\'Paste your Video Planner JSON here...\n\n{\n  "title": "...",\n  "description": "...",\n  "audience": "...",\n  "tone": "...",\n  "script_sections": [...],\n  "research": { ... }\n}\'></textarea>';
    html += '</div>';

    // Upload area
    html += '<div class="vpm-import-tab-pane"' + (S._startImportTab !== 'upload' ? ' style="display:none"' : '') + ' data-start-import-tab="upload">';
    html += '<div class="vpm-upload-zone" id="vpmStartUploadZone">';
    html += '<div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
    html += '<p>Drop a .json file here or click to browse</p>';
    html += '<p class="vpm-text-muted vpm-text-xs">Max 500KB</p>';
    html += '<input type="file" accept=".json,application/json" id="vpmStartFileInput" style="display:none">';
    html += '</div></div>';

    // Preview
    html += '<div id="vpmStartImportPreview" style="margin-top:12px"></div>';

    // Action
    html += '<div style="margin-top:16px;text-align:right">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-lg" data-action="start-execute-import">' + icon('file-import') + ' Import & Continue to Preferences</button>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  // --- Step 2: Preferences ---
  function _renderStartPreferences() {
    var st = S.data.start || {};
    var prefs = st.preferences || {};
    var html = '';

    // Import summary banner
    if (st.import_source) {
      html += '<div class="vpm-info-banner" style="display:flex;align-items:center;gap:8px">' + icon('circle-check');
      html += ' <strong>' + esc(S.data.video.title || 'Video Plan Imported') + '</strong>';
      var mapped = st.import_source.fields_mapped || [];
      if (mapped.length) html += ' <span class="vpm-text-muted">\u2014 ' + mapped.length + ' fields mapped</span>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-import" style="margin-left:auto">' + icon('xmark') + ' Clear Import</button></div>';
    }

    // --- Mode Selector ---
    html += '<div class="vpm-panel vpm-start-mode-panel">';
    html += '<div class="vpm-panel-title">' + icon('rocket') + ' Workflow Mode</div>';
    html += '<div class="vpm-mode-cards">';
    html += '<div class="vpm-mode-card' + (S.mode === 'standard' ? ' vpm-mode-card-active' : '') + '" data-action="set-mode" data-mode="standard">';
    html += '<div class="vpm-mode-card-head"><span class="vpm-mode-dot vpm-mode-dot-std"></span><strong>Standard</strong><span class="vpm-mode-card-badge">5 stages</span></div>';
    html += '<p class="vpm-mode-card-desc">Quick & focused workflow for straightforward videos</p>';
    html += '<div class="vpm-mode-card-stages">Start \u2192 Blueprint \u2192 Script \u2192 Clips \u2192 Publish</div></div>';
    html += '<div class="vpm-mode-card' + (S.mode === 'advanced' ? ' vpm-mode-card-active' : '') + '" data-action="set-mode" data-mode="advanced">';
    html += '<div class="vpm-mode-card-head"><span class="vpm-mode-dot vpm-mode-dot-adv"></span><strong>Advanced</strong><span class="vpm-mode-card-badge vpm-mode-card-badge-adv">7 stages</span></div>';
    html += '<p class="vpm-mode-card-desc">Full pipeline with Research + Studio for visual control</p>';
    html += '<div class="vpm-mode-card-stages">Start \u2192 Research \u2192 Blueprint \u2192 Script \u2192 Studio \u2192 Clips \u2192 Publish</div></div>';
    html += '</div></div>';

    // --- Preferences Panel ---
    html += '<div class="vpm-panel vpm-start-prefs">';
    html += '<div class="vpm-panel-title">' + icon('gears') + ' Video Preferences</div>';
    html += '<div class="vpm-prefs-grid">';

    // Language
    html += _prefGroup('Language', 'file-lines', false,
      _chipBar(Constants.LANGUAGES, prefs.language || 'english', 'preferences.language'));

    // Audio Mode (expanded cards)
    html += _prefGroup('Audio Mode', 'microphone-lines', true, _audioModeCards(prefs.audio_mode || 'ai-audio-with-video'));

    // Voice Profile (conditional)
    var audioModeDef = Constants.AUDIO_MODES[prefs.audio_mode || 'ai-audio-with-video'] || {};
    if (audioModeDef.supportsVoiceProfile) {
      html += _prefGroup('Voice Profile', 'user', true, _voiceProfileEditor(prefs.voice_profile || {}));
    }

    // Video Style (NEW)
    html += _prefGroup('Video Style', 'palette', true, _videoStyleCards(prefs.video_style || ''));

    // Platform — multi-select
    html += _prefGroup('Target Platforms', 'share-nodes', true, _platformMultiSelect(prefs.platforms || [prefs.platform || 'youtube']));

    // Aspect Ratio
    html += _prefGroup('Aspect Ratio', 'image', false, _aspectCards(prefs.aspect_ratio || '16:9'));

    // Target Duration (enhanced)
    html += _prefGroup('Target Duration', 'clock', true, _enhancedDurationControl(prefs.target_duration || 120));

    // Production Mode
    html += _prefGroup('Production Mode', 'film', true, _prodModeCards(prefs.production_mode || 'full-ai'));

    // Presenter Preference
    html += _prefGroup('Presenter Preference', 'user', true,
      _chipBar(Constants.PRESENTER_PREFS, prefs.presenter_preference || 'ai-only', 'preferences.presenter_preference'));

    html += '</div></div>';

    // --- Model Selection ---
    html += _renderModelSelectionPanel(prefs);

    // --- Seedance Audio Direction (when Seedance is primary) ---
    var _primaryVMPref = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    if (_primaryVMPref === 'seedance') {
      html += _renderSeedanceAudioDirectionPanel(prefs);
    }

    // --- Brand Library Selection ---
    html += _renderBrandLibrarySelectionPanel();

    // --- Template Clips Option ---
    var _inclTpl = prefs.include_templates;
    html += '<div class="vpm-panel" style="padding:var(--vpm-space-3)">';
    html += '<div class="vpm-flex-between">';
    html += '<div><strong class="vpm-text-sm">' + icon('layer-group') + ' Include Template Clips</strong>';
    html += '<div class="vpm-text-xs vpm-text-muted">Auto-insert branded intro, outro & chapter titles when generating clips</div></div>';
    html += '<label class="vpm-toggle-switch"><input type="checkbox" data-action="toggle-include-templates"' + (_inclTpl !== false ? ' checked' : '') + '> <span class="vpm-text-sm">' + (_inclTpl !== false ? 'On' : 'Off') + '</span></label>';
    html += '</div></div>';

    // --- Clip Type Selection (collapsible) ---
    html += '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title" data-action="toggle-clip-types" style="cursor:pointer">' + icon('film') + ' Clip Types ';
    html += '<span class="vpm-text-muted vpm-text-xs">(optional \u2014 auto-selected from production mode if skipped)</span>';
    var selectedTypes = st.selected_clip_types || [];
    if (selectedTypes.length) html += ' ' + badge(selectedTypes.length + ' selected', '#0d904f');
    html += '<span style="margin-left:auto">' + icon(S._clipTypesExpanded ? 'chevron-up' : 'chevron-down') + '</span></div>';
    if (S._clipTypesExpanded) {
      var tracks = { ai: [], 'non-ai': [], template: [] };
      for (var ctk in Constants.CLIP_TYPES) tracks[Constants.CLIP_TYPES[ctk].track].push(ctk);
      var trackLabels = { ai: 'AI Track', 'non-ai': 'Non-AI Track', template: 'Template Track' };
      for (var trk in trackLabels) {
        html += '<div style="margin-top:10px"><div class="vpm-text-label" style="margin-bottom:6px">' + esc(trackLabels[trk]) + '</div>';
        html += '<div class="vpm-chip-bar" style="flex-wrap:wrap">';
        for (var ti = 0; ti < tracks[trk].length; ti++) {
          var ctKey = tracks[trk][ti];
          var ct = Constants.CLIP_TYPES[ctKey];
          var isSelected = selectedTypes.indexOf(ctKey) >= 0;
          html += '<button class="vpm-chip' + (isSelected ? ' vpm-chip-active' : '') + '" data-action="toggle-clip-type" data-value="' + esc(ctKey) + '" style="border-color:' + ct.color + '">';
          html += icon(ct.icon) + ' ' + esc(ct.label) + '</button>';
        }
        html += '</div></div>';
      }
      html += '<div style="margin-top:10px">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="auto-select-clip-types">' + icon('sparkles') + ' Auto-select from Production Mode</button>';
      if (selectedTypes.length) html += ' <button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-clip-types">' + icon('xmark') + ' Clear All</button>';
      html += '</div>';
    }
    html += '</div>';

    // Navigation
    html += '<div class="vpm-start-nav-buttons">';
    html += '<button class="vpm-btn vpm-btn-outline" data-action="start-goto-step" data-step="import">' + icon('arrow-left') + ' Back to Import</button>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-lg" data-action="start-goto-step" data-step="review">' + icon('arrow-right') + ' Review & Launch</button>';
    html += '</div>';

    return html;
  }

  // --- Step 3: Review & Launch ---
  function _renderStartReview() {
    var st = S.data.start || {};
    var prefs = st.preferences || {};
    var html = '';

    html += '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('rocket') + ' Ready to Launch</div>';

    html += '<div class="vpm-review-grid">';
    html += _reviewRow('Title', S.data.video.title || 'Untitled');
    html += _reviewRow('Description', truncate(S.data.video.description || '', 120) || '\u2014');
    html += _reviewRow('Workflow Mode', S.mode === 'advanced' ? 'Advanced (7 stages)' : 'Standard (5 stages)');
    html += _reviewRow('Language', (Constants.LANGUAGES[prefs.language] || {}).label || prefs.language || 'English');
    html += _reviewRow('Audio Mode', (Constants.AUDIO_MODES[prefs.audio_mode] || {}).label || prefs.audio_mode);
    if (prefs.voice_profile && (prefs.voice_profile.style || prefs.voice_profile.custom_description)) {
      var vpParts = [];
      if (prefs.voice_profile.gender) vpParts.push(prefs.voice_profile.gender);
      if (prefs.voice_profile.style) vpParts.push(prefs.voice_profile.style);
      if (prefs.voice_profile.accent) vpParts.push(prefs.voice_profile.accent + ' accent');
      html += _reviewRow('Voice Profile', vpParts.join(', ') || prefs.voice_profile.custom_description || '\u2014');
    }
    html += _reviewRow('Video Style', (Constants.VIDEO_STYLES[prefs.video_style] || {}).label || prefs.video_style || 'Not set');
    var platLabels = (prefs.platforms || [prefs.platform || 'youtube']).map(function(p) { return (Constants.PLATFORMS[p] || {}).label || p; });
    html += _reviewRow('Platforms', platLabels.join(', '));
    html += _reviewRow('Aspect Ratio', (Constants.ASPECT_RATIOS[prefs.aspect_ratio] || {}).label || prefs.aspect_ratio || '16:9');
    html += _reviewRow('Target Duration', formatDuration(prefs.target_duration || 120));
    html += _reviewRow('Production Mode', (Constants.PRODUCTION_MODES[prefs.production_mode] || {}).label || prefs.production_mode);
    html += _reviewRow('Presenter', (Constants.PRESENTER_PREFS[prefs.presenter_preference] || {}).label || prefs.presenter_preference);

    // Model selection
    var primaryVM = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    html += _reviewRow('Video Model', (Constants.VIDEO_MODELS[primaryVM] || {}).label || primaryVM);
    // Seedance audio direction (shown when Seedance is primary)
    if (primaryVM === 'seedance') {
      var sadLabel = ((Constants.SEEDANCE_AUDIO_DIRECTIONS || {})[prefs.seedance_audio_direction || 'voice-ambient'] || {}).label || 'Option A: Voice + Ambient';
      html += _reviewRow('Seedance Audio', sadLabel);
    }
    var primaryIM = prefs.primary_image_model || (S.meta.aiPreferences || {}).imageModel || 'imagen-3';
    html += _reviewRow('Image Model', (Constants.IMAGE_MODELS[primaryIM] || {}).label || primaryIM);

    // Import coverage
    if (st.import_source) {
      var fields = st.import_source.fields_mapped || [];
      html += _reviewRow('Imported Data', fields.join(', ') || 'No fields mapped');
    }
    html += '</div>';

    // Launch button
    var nextStage = S.mode === 'advanced' ? 'research' : 'blueprint';
    html += '<div style="text-align:center;margin-top:20px">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-lg" data-action="start-launch" style="min-width:300px">' + icon('rocket') + ' Launch \u2014 Continue to ' + (Constants.APP_STAGES[nextStage] || {}).label + '</button>';
    html += '</div>';
    html += '</div>';

    // Navigation
    html += '<div class="vpm-start-nav-buttons">';
    html += '<button class="vpm-btn vpm-btn-outline" data-action="start-goto-step" data-step="preferences">' + icon('arrow-left') + ' Back to Preferences</button>';
    html += '</div>';

    return html;
  }

  function _reviewRow(label, value) {
    return '<div class="vpm-review-row"><div class="vpm-review-label">' + esc(label) + '</div><div class="vpm-review-value">' + esc(value || '\u2014') + '</div></div>';
  }

  // --- New Start Helpers ---

  // Expanded audio mode cards
  function _audioModeCards(selected) {
    var html = '<div class="vpm-audio-mode-cards">';
    for (var k in Constants.AUDIO_MODES) {
      var am = Constants.AUDIO_MODES[k];
      var isActive = selected === k;
      html += '<div class="vpm-audio-mode-card' + (isActive ? ' vpm-audio-mode-active' : '') + '" data-action="set-pref" data-path="preferences.audio_mode" data-value="' + esc(k) + '">';
      html += '<div class="vpm-audio-mode-head">';
      html += '<div class="vpm-audio-mode-icon">' + icon(am.icon) + '</div>';
      html += '<div class="vpm-audio-mode-label">' + esc(am.label) + '</div>';
      if (am.priority === 1) html += '<span class="vpm-badge-recommended">Recommended</span>';
      html += '</div>';
      html += '<div class="vpm-audio-mode-desc">' + esc(am.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // Voice profile editor
  function _voiceProfileEditor(profile) {
    var html = '<div class="vpm-voice-profile-grid">';
    // Gender
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Gender</label><div class="vpm-chip-bar">';
    for (var g in Constants.VOICE_GENDERS) {
      html += '<button class="vpm-chip' + (profile.gender === g ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="gender" data-value="' + g + '">' + esc(Constants.VOICE_GENDERS[g]) + '</button>';
    }
    html += '</div></div>';
    // Age Range
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Age Range</label><div class="vpm-chip-bar">';
    for (var a in Constants.VOICE_AGE_RANGES) {
      html += '<button class="vpm-chip' + (profile.age_range === a ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="age_range" data-value="' + a + '">' + esc(Constants.VOICE_AGE_RANGES[a]) + '</button>';
    }
    html += '</div></div>';
    // Style
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Voice Style</label><div class="vpm-chip-bar" style="flex-wrap:wrap">';
    for (var s in Constants.VOICE_STYLES) {
      html += '<button class="vpm-chip' + (profile.style === s ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="style" data-value="' + s + '">' + esc(Constants.VOICE_STYLES[s]) + '</button>';
    }
    html += '</div></div>';
    // Accent
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Accent</label><div class="vpm-chip-bar" style="flex-wrap:wrap">';
    for (var ac in Constants.VOICE_ACCENTS) {
      html += '<button class="vpm-chip' + (profile.accent === ac ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="accent" data-value="' + ac + '">' + esc(Constants.VOICE_ACCENTS[ac]) + '</button>';
    }
    html += '</div></div>';
    // Custom description
    html += '<div class="vpm-voice-field vpm-voice-field-full"><label class="vpm-text-label">Custom Voice Description</label>';
    html += '<textarea class="vpm-textarea" rows="2" data-action="set-voice-profile-text" data-field="custom_description" placeholder="e.g. Deep, warm male voice with a slight Southern accent, conversational pace...">' + esc(profile.custom_description || '') + '</textarea>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  // Video style cards
  function _videoStyleCards(selected) {
    var html = '<div class="vpm-video-style-cards">';
    for (var k in Constants.VIDEO_STYLES) {
      var vs = Constants.VIDEO_STYLES[k];
      var isActive = selected === k;
      html += '<div class="vpm-video-style-card' + (isActive ? ' vpm-video-style-active' : '') + '" data-action="set-pref" data-path="preferences.video_style" data-value="' + esc(k) + '">';
      html += '<div class="vpm-video-style-icon">' + icon(vs.icon) + '</div>';
      html += '<div class="vpm-video-style-label">' + esc(vs.label) + '</div>';
      html += '<div class="vpm-video-style-desc">' + esc(vs.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    // Custom textarea if custom selected
    if (selected === 'custom') {
      var customHint = ((S.data.start || {}).preferences || {}).custom_style_keywords || '';
      html += '<textarea class="vpm-textarea" rows="2" data-action="set-custom-style" placeholder="Enter your custom style keywords..." style="margin-top:8px">' + esc(customHint) + '</textarea>';
    }
    return html;
  }

  // Platform multi-select
  function _platformMultiSelect(selectedPlatforms) {
    var html = '<div class="vpm-platform-cards vpm-platform-multi">';
    for (var k in Constants.PLATFORMS) {
      var p = Constants.PLATFORMS[k];
      var isActive = selectedPlatforms.indexOf(k) >= 0;
      html += '<div class="vpm-platform-card' + (isActive ? ' vpm-platform-active' : '') + '" data-action="toggle-platform" data-value="' + esc(k) + '">';
      html += '<div class="vpm-platform-check">' + (isActive ? icon('square-check') : icon('square')) + '</div>';
      html += '<div class="vpm-platform-name">' + icon(p.icon) + ' ' + esc(p.label) + '</div>';
      html += '<div class="vpm-platform-meta">' + esc(p.defaultAspect) + ' \u00B7 ' + p.durationRange[0] + '-' + p.durationRange[1] + 's</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // Enhanced duration control with slider + input + presets
  function _enhancedDurationControl(value) {
    var presets = [30, 60, 120, 300, 600];
    var html = '<div class="vpm-dur-combo">';
    html += '<input type="range" class="vpm-dur-slider" min="5" max="600" value="' + value + '" data-action="set-duration">';
    html += '<div class="vpm-dur-combo-row">';
    html += '<div class="vpm-dur-input-wrap"><input type="number" class="vpm-dur-input" min="5" max="600" value="' + value + '" data-action="set-duration-input"> <span class="vpm-text-muted">seconds</span></div>';
    html += '<span class="vpm-dur-human">' + formatDuration(value) + '</span>';
    html += '</div>';
    html += '<div class="vpm-dur-presets">';
    for (var pi = 0; pi < presets.length; pi++) {
      var pv = presets[pi];
      html += '<button class="vpm-chip' + (value === pv ? ' vpm-chip-active' : '') + '" data-action="set-duration-preset" data-value="' + pv + '">' + formatDuration(pv) + '</button>';
    }
    html += '</div></div>';
    return html;
  }

  // Model selection panel
  function _renderModelSelectionPanel(prefs) {
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('microchip') + ' AI Models</div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Select models available for this project. The primary model is used by default for generation.</p>';

    // Video models
    html += '<div class="vpm-text-label" style="margin:12px 0 8px">' + icon('film') + ' Video Generation Models</div>';
    html += '<div class="vpm-model-cards">';
    var selVMs = prefs.selected_video_models || [];
    var primaryVM = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    for (var vk in Constants.VIDEO_MODELS) {
      var vm = Constants.VIDEO_MODELS[vk];
      var isSel = selVMs.indexOf(vk) >= 0 || selVMs.length === 0; // All selected if none explicitly set
      var isPrimary = primaryVM === vk;
      html += '<div class="vpm-model-card' + (isSel ? ' vpm-model-active' : '') + (isPrimary ? ' vpm-model-primary' : '') + '" data-action="toggle-video-model" data-value="' + esc(vk) + '">';
      html += '<div class="vpm-model-head">' + icon(vm.icon) + ' <strong>' + esc(vm.label) + '</strong>';
      if (isPrimary) html += ' <span class="vpm-badge-primary">Primary</span>';
      if (vk === 'seedance') html += ' <span class="vpm-badge" style="background:#0d904f20;color:#0d904f;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600">Recommended</span>';
      html += '</div>';
      if (vk === 'seedance') html += '<div class="vpm-model-meta" style="color:var(--vpm-info,#1a73e8)">' + icon('layer-group') + ' Primary \u2014 Ingredients & Text to Video</div>';
      else if (vk === 'google-veo-3.1') html += '<div class="vpm-model-meta" style="color:var(--vpm-text-muted,#6b7280)">' + icon('images') + ' Secondary \u2014 Frames to Video (reference image required)</div>';
      html += '<div class="vpm-model-meta">' + esc(vm.notes) + '</div>';
      html += '<div class="vpm-model-meta">Duration: ' + vm.minDuration + '-' + vm.maxDuration + 's</div>';
      if (isSel && !isPrimary) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-xs" data-action="set-primary-video-model" data-value="' + esc(vk) + '">Set as Primary</button>';
      html += '</div>';
    }
    html += '</div>';

    // Image models
    html += '<div class="vpm-text-label" style="margin:16px 0 8px">' + icon('image') + ' Image Generation Models</div>';
    html += '<div class="vpm-model-cards">';
    var selIMs = prefs.selected_image_models || [];
    var primaryIM = prefs.primary_image_model || (S.meta.aiPreferences || {}).imageModel || 'imagen-3';
    for (var ik in Constants.IMAGE_MODELS) {
      var im = Constants.IMAGE_MODELS[ik];
      var isISel = selIMs.indexOf(ik) >= 0 || selIMs.length === 0;
      var isIPrimary = primaryIM === ik;
      html += '<div class="vpm-model-card' + (isISel ? ' vpm-model-active' : '') + (isIPrimary ? ' vpm-model-primary' : '') + '" data-action="toggle-image-model" data-value="' + esc(ik) + '">';
      html += '<div class="vpm-model-head">' + icon(im.icon) + ' <strong>' + esc(im.label) + '</strong>';
      if (isIPrimary) html += ' <span class="vpm-badge-primary">Primary</span>';
      html += '</div>';
      if (isISel && !isIPrimary) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-xs" data-action="set-primary-image-model" data-value="' + esc(ik) + '">Set as Primary</button>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  // Seedance Audio Direction panel (campaign-level, shown when Seedance 2.0 is primary)
  function _renderSeedanceAudioDirectionPanel(prefs) {
    var selected = prefs.seedance_audio_direction || 'voice-ambient';
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('seedling') + ' Seedance Audio Direction</div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Campaign-level audio approach for Seedance 2.0 clips. Determines how voice, ambient, and music are handled in generated prompts.</p>';
    html += '<div class="vpm-audio-dir-cards" style="display:flex;flex-direction:column;gap:8px">';
    var dirs = Constants.SEEDANCE_AUDIO_DIRECTIONS || {};
    for (var dk in dirs) {
      var dd = dirs[dk];
      var isA = selected === dk;
      html += '<div class="vpm-audio-mode-card' + (isA ? ' vpm-audio-mode-active' : '') + '" data-action="set-pref" data-path="preferences.seedance_audio_direction" data-value="' + esc(dk) + '" style="cursor:pointer">';
      html += '<div class="vpm-audio-mode-head">';
      html += '<div class="vpm-audio-mode-icon">' + icon(dd.icon) + '</div>';
      html += '<div class="vpm-audio-mode-label">' + esc(dd.label) + '</div>';
      if (isA) html += '<div class="vpm-audio-mode-check" style="margin-left:auto;color:var(--vpm-success,#0d904f)">' + icon('circle-check') + '</div>';
      html += '</div>';
      html += '<div class="vpm-audio-mode-desc vpm-text-sm vpm-text-muted">' + esc(dd.description) + '</div>';
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  // Brand Library Selection panel
  function _renderBrandLibrarySelectionPanel() {
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.characters.length && !bs.looks.length && !bs.environments.length)) return '';

    var useBrand = S.data.start.use_brand_library !== false;
    var selections = ((S.data.start || {}).brand_selections || {});
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-flex-between">';
    html += '<div class="vpm-panel-title">' + icon('building') + ' Brand Library</div>';
    html += '<label class="vpm-toggle-switch"><input type="checkbox" data-action="toggle-brand-library"' + (useBrand ? ' checked' : '') + '> <span class="vpm-text-sm">' + (useBrand ? 'Enabled' : 'Disabled') + '</span></label>';
    html += '</div>';
    if (!useBrand) {
      html += '<p class="vpm-text-muted vpm-text-sm">Brand library items will not be used for this video. Only video-specific assets will be available.</p></div>';
      return html;
    }
    html += '<div class="vpm-flex-between" style="margin-top:8px">';
    html += '<p class="vpm-text-muted vpm-text-sm" style="margin:0">Select which brand resources to use for this video.</p>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-brand">' + icon('sparkles') + ' AI Suggest</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="select-all-brand">' + icon('check-double') + ' All</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-brand-selection">' + icon('xmark') + ' Clear</button>';
    html += '</div></div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Select which brand resources to use for this video. Unselected items will not appear in Studio.</p>';

    if (bs.looks.length) {
      html += _brandSelGroup('Looks / Avatars', 'user-check', bs.looks, selections.selected_look_ids || [], 'look');
    }
    if (bs.environments.length) {
      html += _brandSelGroup('Environments', 'panorama', bs.environments, selections.selected_environment_ids || [], 'environment');
    }
    if (bs.scenes.length) {
      html += _brandSelGroup('Scenes', 'image', bs.scenes, selections.selected_scene_ids || [], 'scene');
    }
    if (bs.characters.length) {
      html += _brandSelGroup('Characters', 'users', bs.characters, selections.selected_character_ids || [], 'character');
    }
    html += '</div>';
    return html;
  }

  function _brandSelGroup(label, iconName, items, selectedIds, entityType) {
    var html = '<div class="vpm-brand-sel-group">';
    html += '<div class="vpm-brand-sel-label">' + icon(iconName) + ' ' + esc(label) + ' <span class="vpm-text-muted">(' + items.length + ')</span></div>';
    html += '<div class="vpm-brand-sel-list">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isSel = selectedIds.indexOf(item.id) >= 0;
      html += '<label class="vpm-brand-sel-item' + (isSel ? ' vpm-brand-sel-active' : '') + '">';
      html += '<input type="checkbox" class="vpm-brand-check" data-action="toggle-brand-resource" data-entity-type="' + entityType + '" data-entity-id="' + esc(item.id) + '"' + (isSel ? ' checked' : '') + '>';
      html += '<span class="vpm-brand-sel-name">' + esc(item.name || 'Unnamed') + '</span>';
      var frag = item.prompt_fragment || item.combined_prompt_fragment || '';
      if (frag) html += '<span class="vpm-brand-sel-desc">' + esc(truncate(frag, 50)) + '</span>';
      html += '</label>';
    }
    html += '</div></div>';
    return html;
  }

  // --- Start stage helpers ---

  function _prefGroup(label, iconName, isFull, content) {
    return '<div class="vpm-pref-group' + (isFull ? ' vpm-pref-full' : '') + '"><div class="vpm-pref-label">' + icon(iconName) + ' ' + esc(label) + '</div>' + content + '</div>';
  }

  function _chipBar(items, selected, path) {
    var html = '<div class="vpm-chip-bar">';
    for (var k in items) {
      var item = items[k];
      var isActive = selected === k;
      html += '<button class="vpm-chip' + (isActive ? ' vpm-chip-active' : '') + '" data-action="set-pref" data-path="' + esc(path) + '" data-value="' + esc(k) + '">';
      if (item.icon) html += icon(item.icon) + ' ';
      html += esc(item.label) + '</button>';
    }
    html += '</div>';
    return html;
  }

  function _platformCards(selected) {
    var html = '<div class="vpm-platform-cards">';
    for (var k in Constants.PLATFORMS) {
      var p = Constants.PLATFORMS[k];
      var isActive = selected === k;
      html += '<div class="vpm-platform-card' + (isActive ? ' vpm-platform-active' : '') + '" data-action="set-platform" data-value="' + esc(k) + '">';
      html += '<div class="vpm-platform-name">' + icon(p.icon) + ' ' + esc(p.label) + '</div>';
      html += '<div class="vpm-platform-meta">' + esc(p.defaultAspect) + ' \u00B7 ' + p.durationRange[0] + '-' + p.durationRange[1] + 's</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _aspectCards(selected) {
    var html = '<div class="vpm-aspect-cards">';
    for (var k in Constants.ASPECT_RATIOS) {
      var ar = Constants.ASPECT_RATIOS[k];
      var isActive = selected === k;
      // Simple preview proportions
      var w = 40, h = Math.round(40 * (ar.height / ar.width));
      if (h > 50) { h = 50; w = Math.round(50 * (ar.width / ar.height)); }
      html += '<div class="vpm-aspect-card' + (isActive ? ' vpm-aspect-active' : '') + '" data-action="set-pref" data-path="preferences.aspect_ratio" data-value="' + esc(k) + '">';
      html += '<div class="vpm-aspect-preview" style="width:' + w + 'px;height:' + h + 'px"></div>';
      html += '<div class="vpm-aspect-label">' + esc(ar.shortLabel) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _durationControl(value) {
    return '<div class="vpm-dur-control">' +
      '<input type="range" class="vpm-dur-slider" min="5" max="600" value="' + value + '" data-action="set-duration">' +
      '<div class="vpm-dur-display"><span class="vpm-dur-value">' + value + 's</span>' +
      '<span class="vpm-dur-human">' + formatDuration(value) + '</span></div></div>';
  }

  function _prodModeCards(selected) {
    var html = '<div class="vpm-prod-cards">';
    for (var k in Constants.PRODUCTION_MODES) {
      var pm = Constants.PRODUCTION_MODES[k];
      var isActive = selected === k;
      html += '<div class="vpm-prod-card' + (isActive ? ' vpm-prod-active' : '') + '" data-action="set-pref" data-path="preferences.production_mode" data-value="' + esc(k) + '">';
      html += '<div class="vpm-prod-icon">' + icon(pm.icon) + '</div>';
      html += '<div class="vpm-prod-label">' + esc(pm.label) + '</div>';
      html += '<div class="vpm-prod-desc">' + esc(pm.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 5B: VIDEO PLANNER IMPORT — PARSER, MAPPER & MODAL
  // ============================================================

  // --- Validation ---

  function _validatePlannerJSON(obj) {
    var errors = [], warnings = [];
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return { valid: false, errors: ['Not a valid JSON object'], warnings: [], coverage: {} };
    }
    if (!obj.title && !obj.description && !obj.script_sections) {
      errors.push('No recognizable video planner fields found (need title, description, or script_sections)');
    }
    var coverage = {
      hasTitle: !!(obj.title || obj.description),
      hasAudience: !!obj.audience,
      hasTone: !!obj.tone,
      hasResearch: !!(obj.research && (obj.research.pain_points || obj.research.keywords)),
      hasSections: !!(obj.script_sections && obj.script_sections.length),
      hasScript: false,
      hasClipTypes: !!(obj.clip_types && obj.clip_types.length),
      hasTags: !!(obj.tags && obj.tags.length),
      hasProductionNotes: !!obj.production_notes,
      hasVisualStyle: !!obj.visual_style
    };
    if (coverage.hasSections) {
      var withContent = 0;
      for (var i = 0; i < obj.script_sections.length; i++) {
        if (obj.script_sections[i].content && obj.script_sections[i].content.trim().length > 20) withContent++;
      }
      coverage.hasScript = withContent > 0 && withContent >= obj.script_sections.length * 0.5;
    }
    if (obj.ratio && !_mapPlannerRatio(obj.ratio)) warnings.push('Unknown ratio "' + obj.ratio + '", defaulting to 16:9');
    if (obj.tone && !_mapPlannerTone(obj.tone)) warnings.push('Unknown tone "' + obj.tone + '", using closest match');
    return { valid: errors.length === 0, errors: errors, warnings: warnings, coverage: coverage };
  }

  // --- Mapping helpers ---

  function _mapPlannerRatio(ratio) {
    if (!ratio) return null;
    var r = ratio.trim().toLowerCase();
    var map = { '16:9': '16:9', '9:16': '9:16', '1:1': '1:1', '4:5': '4:5',
      'landscape': '16:9', 'portrait': '9:16', 'square': '1:1', 'vertical': '9:16', 'horizontal': '16:9' };
    return map[r] || null;
  }

  function _mapPlannerTone(tone) {
    if (!tone) return null;
    var t = tone.toLowerCase().trim();
    var toneMap = Constants.PLANNER_TONE_MAP || {};
    // Direct match
    if (toneMap[t]) return toneMap[t];
    // Split on separator and try parts
    var parts = t.split(/\s*[—\-:]+\s*/);
    for (var pi = 0; pi < parts.length; pi++) {
      var p = parts[pi].trim();
      if (toneMap[p]) return toneMap[p];
      // Partial match
      for (var k in toneMap) {
        if (p.indexOf(k) >= 0 || k.indexOf(p) >= 0) return toneMap[k];
      }
    }
    // Direct match against TONES keys
    for (var tk in Constants.TONES) {
      if (t.indexOf(tk) >= 0) return tk;
    }
    return 'professional';
  }

  function _mapPlannerAudience(audience) {
    if (!audience) return '';
    return audience.replace(/^(beginner|intermediate|advanced|expert)\s*[—\-:]+\s*/i, '').trim() || audience;
  }

  function _inferProductionMode(planner) {
    var notes = (planner.production_notes || '').toLowerCase();
    if (notes.indexOf('screen recording') >= 0 || notes.indexOf('screen capture') >= 0 || notes.indexOf('screencast') >= 0) return 'screen-recording';
    if (notes.indexOf('live action') >= 0 || notes.indexOf('camera') >= 0 || notes.indexOf('filming') >= 0) return 'live-action';
    if (planner.clip_types && planner.clip_types.length) {
      var hasAI = false, hasNonAI = false;
      for (var ci = 0; ci < planner.clip_types.length; ci++) {
        var ct = normalizeClipType(planner.clip_types[ci]);
        var ctDef = Constants.CLIP_TYPES[ct];
        if (ctDef) {
          if (ctDef.track === 'ai') hasAI = true;
          if (ctDef.track === 'non-ai') hasNonAI = true;
        }
      }
      if (hasAI && hasNonAI) return 'hybrid';
      if (hasAI && !hasNonAI) return 'full-ai';
      if (!hasAI && hasNonAI) return 'screen-recording';
    }
    return 'hybrid';
  }

  // --- Main mapper ---

  function _mapPlannerToVPM(planner) {
    var result = {
      start: { preferences: {} },
      video: {},
      research: null,
      blueprint: { title: '', description: '', sections: [], style_notes: '', tone: '', target_audience: '' },
      script: null,
      clipTypes: []
    };

    // --- Preferences ---
    if (planner.ratio) result.start.preferences.aspect_ratio = _mapPlannerRatio(planner.ratio) || '16:9';
    if (planner.target_duration) {
      result.start.preferences.target_duration = parseInt(planner.target_duration, 10) || (planner.total_duration || 120);
    } else if (planner.total_duration) {
      result.start.preferences.target_duration = planner.total_duration;
    }
    result.start.preferences.production_mode = _inferProductionMode(planner);
    result.start.raw_input = planner.description || planner.title || '';

    // --- Video metadata ---
    result.video.title = planner.title || '';
    result.video.description = planner.description || '';
    result.video.target_audience = _mapPlannerAudience(planner.audience || '');
    result.video.tone = _mapPlannerTone(planner.tone || '');
    result.video.keywords = (planner.tags || []).slice();
    if (planner.ratio) result.video.aspect_ratio = _mapPlannerRatio(planner.ratio) || '16:9';
    if (planner.target_duration || planner.total_duration) {
      result.video.duration_target = parseInt(planner.target_duration, 10) || planner.total_duration || 120;
    }

    // --- Blueprint ---
    result.blueprint.title = planner.title || '';
    result.blueprint.description = planner.description || '';
    result.blueprint.tone = result.video.tone;
    result.blueprint.target_audience = result.video.target_audience;
    var styleNotes = [];
    if (planner.production_notes) styleNotes.push(planner.production_notes);
    if (planner.visual_style) styleNotes.push('Visual style: ' + planner.visual_style);
    if (planner.angle) styleNotes.push('Angle: ' + planner.angle);
    if (planner.hook) styleNotes.push('Hook: ' + planner.hook);
    if (planner.series) styleNotes.push('Series: ' + planner.series);
    if (planner.format) styleNotes.push('Format: ' + planner.format);
    result.blueprint.style_notes = styleNotes.join('\n');

    // Map script_sections to blueprint sections (and script if content)
    var sectionIds = [];
    if (planner.script_sections && planner.script_sections.length) {
      for (var i = 0; i < planner.script_sections.length; i++) {
        var ps = planner.script_sections[i];
        var secId = generateId('sec');
        sectionIds.push(secId);
        result.blueprint.sections.push({
          id: secId,
          label: ps.title || ps.type_label || ('Section ' + (i + 1)),
          duration: ps.estimated_duration || 0,
          key_points: [],
          visual_notes: ps.notes || '',
          order: i + 1
        });
      }
    }

    // --- Script (only if sections have substantial content) ---
    var validation = _validatePlannerJSON(planner);
    if (validation.coverage.hasScript) {
      result.script = { sections: [], total_word_count: 0, estimated_duration: 0 };
      var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) ? S.meta.settings.words_per_minute : 150;
      for (var si = 0; si < planner.script_sections.length; si++) {
        var pSec = planner.script_sections[si];
        var sId = sectionIds[si] || generateId('sec');
        var content = pSec.content || '';
        // Wrap plain text in <p> tags if not already HTML
        if (content && content.indexOf('<') === -1) {
          content = '<p>' + esc(content).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
        }
        var wc = pSec.word_count || countWords(content);
        var ed = pSec.estimated_duration || estimateDuration(wc, wpm);
        result.script.sections.push({
          id: sId,
          label: pSec.title || pSec.type_label || (result.blueprint.sections[si] ? result.blueprint.sections[si].label : 'Section ' + (si + 1)),
          content: content,
          word_count: wc,
          estimated_duration: ed,
          order: si + 1,
          notes: pSec.notes || ''
        });
        result.script.total_word_count += wc;
        result.script.estimated_duration += ed;
      }
    }

    // --- Research (enhanced: extract from metadata + explicit research field) ---
    result.research = {};
    // From explicit research field
    if (planner.research) {
      if (planner.research.pain_points && planner.research.pain_points.length) {
        result.research.audience_insights = planner.research.pain_points.map(function(p) {
          return (p.priority ? '[' + p.priority.toUpperCase() + '] ' : '') + p.text;
        }).join('\n');
      }
      if (planner.research.keywords && planner.research.keywords.length) {
        result.research.content_strategy = 'Target Keywords:\n' + planner.research.keywords.map(function(k) {
          return '- ' + k.keyword + (k.volume ? ' (volume: ' + k.volume + ')' : '') + (k.competition ? ' [competition: ' + k.competition + ']' : '');
        }).join('\n');
      }
    }
    // Enrich from planner metadata if not already populated
    if (!result.research.audience_insights && planner.audience) {
      var aParts = ['Target Audience: ' + planner.audience];
      if (planner.description) aParts.push('Context: ' + planner.description.substring(0, 300));
      result.research.audience_insights = aParts.join('\n');
    }
    if (!result.research.content_strategy) {
      var cParts = [];
      if (planner.tone) cParts.push('Tone: ' + planner.tone);
      if (planner.format) cParts.push('Format: ' + planner.format);
      if (planner.angle) cParts.push('Angle: ' + planner.angle);
      if (cParts.length) result.research.content_strategy = cParts.join('\n');
    }
    if (planner.hook) {
      result.research.trending_angles = 'Hook: ' + planner.hook;
    }
    // Set to null if nothing was populated
    var _hasResearch = result.research.audience_insights || result.research.content_strategy || result.research.trending_angles || result.research.competitor_analysis;
    if (!_hasResearch) result.research = null;

    // --- Clip types ---
    if (planner.clip_types && planner.clip_types.length) {
      result.clipTypes = [];
      for (var cti = 0; cti < planner.clip_types.length; cti++) {
        var normalized = normalizeClipType(planner.clip_types[cti]);
        if (normalized && Constants.CLIP_TYPES[normalized]) result.clipTypes.push(normalized);
      }
    }

    return result;
  }

  // --- Smart stage determination ---

  function _determineLandingStage(coverage) {
    if (coverage.hasScript) return 'script';
    if (coverage.hasSections) return 'blueprint';
    if (coverage.hasResearch && S.mode === 'advanced') return 'research';
    if (coverage.hasTitle) return 'blueprint';
    return 'start';
  }

  // --- Import modal ---

  function _openPlannerImport() {
    var html = '<div class="vpm-planner-import">';

    // Inner tabs
    html += '<div class="vpm-inner-tabs" style="margin-bottom:16px">';
    html += '<button class="vpm-inner-tab vpm-inner-tab-active" data-action="planner-import-tab" data-tab="paste">' + icon('clipboard') + ' Paste JSON</button>';
    html += '<button class="vpm-inner-tab" data-action="planner-import-tab" data-tab="upload">' + icon('upload') + ' Upload File</button>';
    html += '</div>';

    // Paste tab
    html += '<div class="vpm-import-tab-pane" data-import-tab="paste">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Paste your Video Planner JSON</label>';
    html += '<textarea class="vpm-textarea" id="vpmPlannerJsonInput" rows="10" style="font-family:var(--vpm-font-mono);font-size:11px" placeholder=\'{"title":"...","description":"...","script_sections":[...],"research":{...}}\'></textarea></div>';
    html += '</div>';

    // Upload tab (hidden initially)
    html += '<div class="vpm-import-tab-pane" data-import-tab="upload" style="display:none">';
    html += '<div class="vpm-upload-zone" id="vpmPlannerUploadZone" style="cursor:pointer">';
    html += '<div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
    html += '<p>Drop a .json file here or click to browse</p>';
    html += '<input type="file" accept=".json,application/json" id="vpmPlannerFileInput" style="display:none">';
    html += '</div></div>';

    // Preview area (populated after parse)
    html += '<div id="vpmPlannerPreview" style="display:none"></div>';

    html += '</div>';

    openModal(icon('file-import') + ' Import from Video Planner', html, {
      size: 'lg',
      saveLabel: icon('file-import') + ' Import & Map',
      onSave: function() { _executePlannerImport(); }
    });
  }

  // --- Preview renderer ---

  function _renderPlannerPreview(planner, validation, targetSelector) {
    var $target = $(targetSelector || '#vpmPlannerPreview');
    var html = '';

    if (validation.errors.length) {
      html += '<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' ' + esc(validation.errors.join('; ')) + '</div>';
      $target.html(html).show();
      return;
    }

    if (validation.warnings.length) {
      html += '<div class="vpm-info-banner" style="margin-bottom:8px">' + icon('circle-info') + ' ' + esc(validation.warnings.join('; ')) + '</div>';
    }

    var c = validation.coverage;

    html += '<div class="vpm-panel" style="margin-top:12px"><div class="vpm-panel-title">' + icon('compass-drafting') + ' Import Preview</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';

    var items = [
      { label: 'Title', ok: c.hasTitle, val: planner.title ? truncate(planner.title, 50) : '' },
      { label: 'Audience', ok: c.hasAudience, val: planner.audience ? truncate(planner.audience, 50) : '' },
      { label: 'Tone', ok: c.hasTone, val: planner.tone || '' },
      { label: 'Blueprint Sections', ok: c.hasSections, val: c.hasSections ? (planner.script_sections.length + ' sections') : '' },
      { label: 'Full Script', ok: c.hasScript, val: c.hasScript ? ((planner.total_word_count || '?') + ' words') : '' },
      { label: 'Research Data', ok: c.hasResearch, val: '' },
      { label: 'Clip Types', ok: c.hasClipTypes, val: c.hasClipTypes ? planner.clip_types.join(', ') : '' },
      { label: 'Tags / Keywords', ok: c.hasTags, val: c.hasTags ? planner.tags.join(', ') : '' },
      { label: 'Production Notes', ok: c.hasProductionNotes, val: '' },
      { label: 'Visual Style', ok: c.hasVisualStyle, val: planner.visual_style || '' }
    ];

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html += '<div style="display:flex;align-items:center;gap:6px;padding:4px 0">';
      html += '<span style="color:' + (it.ok ? 'var(--vpm-success)' : 'var(--vpm-gray-400)') + '">' + icon(it.ok ? 'circle-check' : 'circle') + '</span>';
      html += '<span class="vpm-text-sm"><strong>' + esc(it.label) + '</strong>';
      if (it.val) html += ' — ' + esc(it.val);
      html += '</span></div>';
    }
    html += '</div>';

    // Landing stage recommendation
    var landingStage = _determineLandingStage(c);
    var stageLabel = (Constants.APP_STAGES[landingStage] || {}).label || landingStage;
    html += '<div class="vpm-info-banner" style="margin-top:12px">' + icon('rocket') + ' After import, you\'ll land on the <strong>' + esc(stageLabel) + '</strong> stage to review and continue.</div>';
    html += '</div>';

    $target.html(html).show();
  }

  // --- Import execution ---

  function _executePlannerImport() {
    var json = ($('#vpmPlannerJsonInput').val() || '').trim();
    if (!json) { toast('Paste or upload JSON first', 'warning'); return; }

    var parsed = parseJSON(json);
    if (!parsed) { toast('Invalid JSON — check syntax', 'error'); return; }

    var validation = _validatePlannerJSON(parsed);
    if (!validation.valid) { toast(validation.errors[0], 'error'); return; }

    var mapped = _mapPlannerToVPM(parsed);
    var coverage = validation.coverage;

    // Snapshot before import
    _snapshotFull('Before planner import');

    // --- Apply Start ---
    if (!S.data.start) S.data.start = {};
    S.data.start.raw_input = mapped.start.raw_input || S.data.start.raw_input || '';
    if (!S.data.start.preferences) S.data.start.preferences = {};
    var mp = mapped.start.preferences;
    if (mp.aspect_ratio) S.data.start.preferences.aspect_ratio = mp.aspect_ratio;
    if (mp.target_duration) S.data.start.preferences.target_duration = mp.target_duration;
    if (mp.production_mode) S.data.start.preferences.production_mode = mp.production_mode;
    S.data.start.import_source = {
      type: 'video-planner',
      imported_at: new Date().toISOString(),
      fields_mapped: Object.keys(coverage).filter(function(k) { return coverage[k]; })
    };

    // --- Apply Video metadata ---
    var vm = mapped.video;
    if (vm.title) S.data.video.title = vm.title;
    if (vm.description) S.data.video.description = vm.description;
    if (vm.target_audience) S.data.video.target_audience = vm.target_audience;
    if (vm.tone) S.data.video.tone = vm.tone;
    if (vm.keywords && vm.keywords.length) S.data.video.keywords = vm.keywords;
    if (vm.aspect_ratio) S.data.video.aspect_ratio = vm.aspect_ratio;
    if (vm.duration_target) S.data.video.duration_target = vm.duration_target;
    // Copy preferences to video (same pattern as process-idea handler)
    var prefs = S.data.start.preferences;
    S.data.video.language = prefs.language || 'english';
    S.data.video.platform = prefs.platform || 'youtube';
    S.data.video.aspect_ratio = prefs.aspect_ratio || S.data.video.aspect_ratio || '16:9';
    S.data.video.duration_target = prefs.target_duration || S.data.video.duration_target || 120;
    S.data.video.production_mode = prefs.production_mode || S.data.video.production_mode || 'full-ai';
    S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
    if (!S.data.video.created) S.data.video.created = new Date().toISOString();
    S.data.video.modified = new Date().toISOString();

    // --- Apply Blueprint ---
    if (mapped.blueprint && mapped.blueprint.sections.length) {
      S.data.blueprint.title = mapped.blueprint.title || S.data.blueprint.title;
      S.data.blueprint.description = mapped.blueprint.description || S.data.blueprint.description;
      S.data.blueprint.tone = mapped.blueprint.tone || S.data.blueprint.tone;
      S.data.blueprint.target_audience = mapped.blueprint.target_audience || S.data.blueprint.target_audience;
      S.data.blueprint.style_notes = mapped.blueprint.style_notes || S.data.blueprint.style_notes;
      S.data.blueprint.sections = mapped.blueprint.sections;
      // Do NOT auto-confirm — let user review
    }

    // --- Apply Script ---
    if (mapped.script && mapped.script.sections.length) {
      S.data.script.sections = mapped.script.sections;
      S.data.script.total_word_count = mapped.script.total_word_count;
      S.data.script.estimated_duration = mapped.script.estimated_duration;
      // Do NOT auto-finalize — let user review
    }

    // --- Apply Research ---
    if (mapped.research) {
      if (!S.data.research) S.data.research = {};
      if (mapped.research.audience_insights) S.data.research.audience_insights = mapped.research.audience_insights;
      if (mapped.research.content_strategy) S.data.research.content_strategy = mapped.research.content_strategy;
      if (mapped.research.competitor_analysis) S.data.research.competitor_analysis = mapped.research.competitor_analysis;
      if (mapped.research.trending_angles) S.data.research.trending_angles = mapped.research.trending_angles;
      var _anyResearch = mapped.research.audience_insights || mapped.research.content_strategy || mapped.research.competitor_analysis || mapped.research.trending_angles;
      if (_anyResearch) {
        S.data.research.generated = true;
        S.data.research.generated_at = S.data.research.generated_at || new Date().toISOString();
      }
    }

    // --- Apply Clip Types ---
    if (mapped.clipTypes.length) {
      S.data.start.selected_clip_types = mapped.clipTypes;
    }

    // Mark start as processed
    S.data.start.processed = true;
    S.data.start.processed_at = new Date().toISOString();

    // Auto-switch to advanced mode if research data exists
    if (coverage.hasResearch && S.mode !== 'advanced') {
      S.mode = 'advanced';
      S.data.start.mode = 'advanced';
    }

    // Log, snapshot, sync, render
    logActivity('planner_imported', 'Imported from Video Planner: ' + truncate(mapped.video.title || 'Untitled', 50));
    _snapshotFull('After planner import');
    buildMaps();
    syncToTextarea();
    closeModal();

    // Smart navigation
    var landingStage = _determineLandingStage(coverage);
    navigateToStage(landingStage);

    // Summary toast
    var importedParts = [];
    if (coverage.hasTitle) importedParts.push('title');
    if (coverage.hasSections) importedParts.push('blueprint');
    if (coverage.hasScript) importedParts.push('script');
    if (coverage.hasResearch) importedParts.push('research');
    toast('Imported: ' + importedParts.join(', ') + '. Review and fill any gaps.', 'success');
  }


  // ============================================================
  // SECTION 6: RESEARCH VIEW — FULL (Advanced mode only)
  // ============================================================

  function renderResearchFull() {
    var res = S.data.research || {};
    var sources = res.sources || [];

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('magnifying-glass') + ' Research</h2>';
    html += '<p class="vpm-view-subtitle">AI-powered content research for better videos</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-research">' + icon('sparkles') + ' Generate Research Brief</button>';
    if (res.generated) html += '<span class="vpm-text-success vpm-text-sm">' + icon('circle-check') + ' Generated ' + formatRelativeTime(res.generated_at || '') + '</span>';
    html += '</div></div>';

    // Info banner if no idea yet
    if (!S.data.start.raw_input && !res.generated) {
      html += '<div class="vpm-info-banner">' + icon('info') + ' Enter your video idea in the Start stage first. AI uses your prompt + preferences to generate targeted research.</div>';
    }

    // Empty state
    if (!res.generated && !res.audience_insights && !res.competitor_analysis && !res.content_strategy && !res.trending_angles) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('magnifying-glass') + '</div>';
      html += '<h3>Research Your Topic</h3>';
      html += '<p>AI analyzes your video idea to uncover audience insights, competitor gaps, trending angles, and a content strategy.</p>';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-research">' + icon('sparkles') + ' Generate Research Brief</button>';
      html += '<div class="vpm-research-step-hints">';
      var hints = ['Audience insights','Competitor analysis','Trending angles','Content strategy'];
      for (var hi = 0; hi < hints.length; hi++) html += '<div class="vpm-research-step-hint"><span class="vpm-research-step-num">' + (hi+1) + '</span> ' + esc(hints[hi]) + '</div>';
      html += '</div></div>';
    } else {
      // 4 research panels in 2x2 grid
      var panels = [
        { key: 'audience_insights',   label: 'Audience Insights',   icon: 'users',            color: '#1a73e8', desc: 'Target demographics, pain points, search intent, viewing habits' },
        { key: 'competitor_analysis', label: 'Competitor Analysis',  icon: 'chart-bar',        color: '#7c3aed', desc: 'Top-performing videos, content gaps, positioning opportunities' },
        { key: 'trending_angles',     label: 'Trending Angles',     icon: 'bolt',             color: '#e37400', desc: 'Current trends, hot topics, viral hooks, seasonal relevance' },
        { key: 'content_strategy',    label: 'Content Strategy',    icon: 'compass-drafting', color: '#0d904f', desc: 'Recommended approach, structure, hooks, differentiation' }
      ];

      html += '<div class="vpm-research-grid">';
      for (var pi = 0; pi < panels.length; pi++) {
        var p = panels[pi];
        var content = res[p.key] || '';
        html += '<div class="vpm-research-panel" style="border-top-color:' + p.color + '">';
        html += '<div class="vpm-research-panel-head">';
        html += '<div class="vpm-research-panel-icon" style="background:' + p.color + '12;color:' + p.color + '">' + icon(p.icon) + '</div>';
        html += '<div class="vpm-research-panel-title">' + esc(p.label) + '</div>';
        html += '<div class="vpm-btn-row" style="margin-left:auto">';
        html += '<button class="vpm-btn-icon-sm" data-action="ai-regenerate-research-section" data-section="' + p.key + '" title="Regenerate">' + icon('sparkles') + '</button>';
        html += '<button class="vpm-btn-icon-sm" data-action="edit-research-section" data-section="' + p.key + '" title="Edit">' + icon('pen') + '</button>';
        html += '<button class="vpm-btn-icon-sm" data-action="copy-prompt" data-text="' + esc(content) + '" title="Copy">' + icon('copy') + '</button>';
        html += '</div></div>';
        html += '<div class="vpm-research-panel-desc">' + esc(p.desc) + '</div>';
        if (content) {
          html += '<div class="vpm-research-panel-content" data-research-section="' + p.key + '">';
          html += '<div class="vpm-research-text">' + _formatResearchContent(content) + '</div>';
          html += '<textarea class="vpm-research-inline-edit vpm-textarea" data-action="inline-edit-research" data-section="' + p.key + '" rows="6" style="display:none">' + esc(typeof content === 'string' ? content : '') + '</textarea>';
          html += '</div>';
        } else {
          html += '<div class="vpm-research-panel-empty">';
          html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-regenerate-research-section" data-section="' + p.key + '">' + icon('sparkles') + ' Generate ' + esc(p.label) + '</button>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }

    // --- Reference Sources ---
    html += '<div class="vpm-panel"><div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin:0">' + icon('link') + ' Reference Sources</span>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="add-research-source">' + icon('plus') + ' Add Source</button></div>';
    if (sources.length) {
      for (var si = 0; si < sources.length; si++) {
        var src = sources[si];
        html += '<div class="vpm-research-source">';
        html += '<div class="vpm-research-source-info">';
        if (src.url) html += '<a href="' + esc(src.url) + '" target="_blank" class="vpm-research-source-url">' + icon('link') + ' ' + esc(truncate(src.title || src.url, 60)) + '</a>';
        else html += '<span class="vpm-text-sm">' + esc(src.title || 'Untitled') + '</span>';
        if (src.type) html += ' ' + badge(src.type, src.type === 'competitor' ? '#7c3aed' : src.type === 'reference' ? '#1a73e8' : src.type === 'inspiration' ? '#e37400' : '#6b7280');
        if (src.notes) html += '<div class="vpm-text-xs vpm-text-muted">' + esc(src.notes) + '</div>';
        html += '</div>';
        html += '<button class="vpm-btn-icon-sm" data-action="delete-research-source" data-idx="' + si + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
        html += '</div>';
      }
    } else {
      html += '<p class="vpm-text-sm vpm-text-muted" style="text-align:center;padding:8px">No sources yet. Add competitor videos, articles, or references to guide AI research.</p>';
    }
    html += '</div>';

    html += renderNavButtons('Start', 'Continue to Blueprint', 'blueprint');
    html += '</div>';
    return html;
  }

  function _formatResearchContent(text) {
    if (!text) return '';
    // Safety: ensure we have a string (prevents [object Object])
    if (typeof text !== 'string') {
      if (typeof text === 'object') {
        if (text.content) text = text.content;
        else if (text.text) text = text.text;
        else try { text = JSON.stringify(text, null, 2); } catch(e) { text = String(text); }
      } else { text = String(text); }
    }
    var h = esc(text);
    // Format markdown-like lists
    h = h.replace(/^[-•]\s/gm, '\u2022 ');
    h = h.replace(/^\d+\.\s/gm, function(m) { return '<strong>' + m.trim() + '</strong> '; });
    h = h.replace(/\n\n+/g, '</p><p>');
    h = h.replace(/\n/g, '<br>');
    return '<p>' + h + '</p>';
  }


  // ============================================================
  // SECTION 7: BLUEPRINT VIEW — FULL
  // ============================================================

  function renderBlueprintFull() {
    var bp = S.data.blueprint || {};
    var v = S.data.video || {};
    var sections = bp.sections || [];
    var totalDur = 0;
    for (var i = 0; i < sections.length; i++) totalDur += (sections[i].duration || 0);
    var targetDur = v.duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('compass-drafting') + ' Blueprint</h2>';
    html += '<p class="vpm-view-subtitle">Plan your video structure & sections</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-blueprint">' + icon('sparkles') + ' Generate Blueprint</button>';
    if (bp.confirmed) html += '<span class="vpm-text-success">' + icon('circle-check') + ' Confirmed</span>';
    html += '</div></div>';

    // --- Video Overview (inline editable) ---
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('info') + ' Video Overview</div>';
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
    html += '<input class="vpm-input" data-action="save-bp-field" data-path="blueprint.title" value="' + esc(bp.title || '') + '" placeholder="Video title\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Duration</label>';
    html += '<div class="vpm-input-display">' + formatDuration(targetDur) + ' (' + targetDur + 's)</div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Audience</label>';
    html += '<input class="vpm-input" data-action="save-bp-field" data-path="blueprint.target_audience" value="' + esc(bp.target_audience || '') + '" placeholder="Who is this video for?"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Tone</label>';
    html += '<select class="vpm-select" data-action="save-bp-field" data-path="blueprint.tone">';
    html += '<option value="">Select\u2026</option>';
    for (var tid in Constants.TONES) {
      html += '<option value="' + tid + '"' + (bp.tone === tid ? ' selected' : '') + '>' + esc(Constants.TONES[tid].label) + '</option>';
    }
    html += '</select></div>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label>';
    html += '<textarea class="vpm-textarea" data-action="save-bp-field" data-path="blueprint.description" rows="2" placeholder="Brief overview of what this video covers\u2026">' + esc(bp.description || '') + '</textarea></div>';
    html += '</div>';

    // --- Duration Allocation Bar ---
    if (sections.length > 0) {
      html += '<div class="vpm-panel vpm-bp-dur-panel">';
      html += '<div class="vpm-flex-between vpm-mb-sm"><span class="vpm-text-label">Duration Allocation</span>';
      html += '<span class="vpm-text-sm' + (totalDur > targetDur ? ' vpm-text-error' : ' vpm-text-success') + '">' + totalDur + 's / ' + targetDur + 's target</span></div>';
      html += '<div class="vpm-bp-dur-track">';
      var _durColors = ['#d3e4fd', '#e8f0fe', '#d3e4fd', '#e8f0fe', '#ceead6', '#d3e4fd', '#fef7e0', '#e8f0fe', '#ceead6', '#f3e8ff'];
      for (var di = 0; di < sections.length; di++) {
        var sec = sections[di];
        var durPct = targetDur > 0 ? Math.max(2, Math.round((sec.duration / targetDur) * 100)) : 10;
        html += '<div class="vpm-bp-dur-seg" style="flex:' + (sec.duration || 1) + ';background:' + _durColors[di % _durColors.length] + '" title="' + esc(sec.label) + ': ' + (sec.duration || 0) + 's">';
        html += '<span>' + (sec.duration || 0) + 's</span></div>';
      }
      html += '</div>';
      html += progressBar(Math.min(100, Math.round((totalDur / targetDur) * 100)), totalDur > targetDur ? 'var(--vpm-error)' : 'var(--vpm-primary)');
      html += '</div>';
    }

    // --- Section Cards ---
    html += '<div class="vpm-bp-sections">';
    html += '<div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin-bottom:0">' + icon('list') + ' Sections</span>';
    html += '<span class="vpm-badge vpm-badge-outline">' + sections.length + ' sections</span></div>';

    if (!sections.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('compass-drafting') + '</div>';
      html += '<h3>No Sections Yet</h3><p>Click "Generate Blueprint" to auto-create sections from your video idea, or add sections manually below.</p></div>';
    }

    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      html += '<div class="vpm-bp-card" data-section-idx="' + si + '">';
      html += '<div class="vpm-bp-card-left">';
      html += '<span class="vpm-bp-drag" title="Drag to reorder">' + icon('grip-vertical') + '</span>';
      html += '<span class="vpm-bp-num">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-bp-card-body">';
      // Header row: label + duration + actions
      html += '<div class="vpm-bp-card-head">';
      html += '<input class="vpm-bp-card-label-input" value="' + esc(sec.label || '') + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="label" placeholder="Section name">';
      html += '<div class="vpm-bp-card-dur-input"><input class="vpm-input vpm-input-sm vpm-bp-dur-input-field" type="number" min="1" max="600" value="' + (sec.duration || 0) + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="duration" style="width:60px">s</div>';
      html += '<div class="vpm-bp-card-actions">';
      if (si > 0) html += '<button class="vpm-btn-icon-sm" data-action="move-bp-section" data-idx="' + si + '" data-dir="up" title="Move up">' + icon('chevron-up') + '</button>';
      if (si < sections.length - 1) html += '<button class="vpm-btn-icon-sm" data-action="move-bp-section" data-idx="' + si + '" data-dir="down" title="Move down">' + icon('chevron-down') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-bp-section" data-idx="' + si + '" title="Delete section" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
      html += '</div></div>';
      // Key points
      html += '<div class="vpm-bp-card-field"><textarea class="vpm-textarea vpm-bp-card-textarea" data-action="save-bp-section-field" data-idx="' + si + '" data-field="key_points" rows="2" placeholder="Key points, topics to cover\u2026">' + esc(Array.isArray(sec.key_points) ? sec.key_points.join('\n') : (sec.key_points || '')) + '</textarea></div>';
      // Visual notes
      html += '<div class="vpm-bp-card-visual">' + icon('image') + ' <input class="vpm-bp-visual-input" value="' + esc(sec.visual_notes || '') + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="visual_notes" placeholder="Visual approach notes\u2026"></div>';
      html += '</div></div>';
    }

    // Add section button
    html += '<button class="vpm-bp-add-btn" data-action="add-bp-section">' + icon('plus') + ' Add Section</button>';
    html += '</div>';

    // Style notes
    html += '<div class="vpm-panel"><div class="vpm-form-group"><label class="vpm-form-label">Global Style Notes</label>';
    html += '<textarea class="vpm-textarea" data-action="save-bp-field" data-path="blueprint.style_notes" rows="2" placeholder="Overall visual style, color palette, reference videos\u2026">' + esc(bp.style_notes || '') + '</textarea></div></div>';

    // Confirm button
    html += '<div class="vpm-bp-confirm">';
    if (bp.confirmed) {
      html += '<div class="vpm-info-banner">' + icon('circle-check') + ' Blueprint confirmed on ' + formatDate(bp.confirmed_at) + '. <button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="unlock-blueprint">' + icon('lock') + ' Unlock & Edit</button></div>';
    } else {
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-full" data-action="confirm-blueprint"' + (sections.length < 1 ? ' disabled' : '') + '>' + icon('check') + ' Confirm Blueprint</button>';
    }
    html += '</div>';

    var prevStage = S.mode === 'advanced' ? 'Research' : 'Start';
    html += renderNavButtons(prevStage, 'Continue to Script', 'script');
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 7: SCRIPT VIEW — FULL (N-section Tiptap editors)
  // ============================================================

  function renderScriptFull() {
    var sc = S.data.script || {};
    var sections = sc.sections || [];
    var td = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('file-lines') + ' Script</h2>';
    html += '<p class="vpm-view-subtitle">' + sections.length + ' sections from Blueprint</p></div><div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-script">' + icon('sparkles') + ' AI Generate</button>';
    var versions = sc.versions || [];
    if (versions.length > 0) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="show-script-versions">' + icon('clock-rotate-left') + ' Versions (' + versions.length + ')</button>';
    if (sc.finalized) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="unlock-script">' + icon('lock') + ' Unlock</button>';
      html += '<span class="vpm-text-success vpm-text-sm">' + icon('circle-check') + ' Finalized</span>';
    } else {
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="finalize-script"' + (!sc.total_word_count ? ' disabled' : '') + '>' + icon('check') + ' Finalize</button>';
    }
    html += '</div></div>';

    // --- Stats Bar ---
    html += '<div class="vpm-panel vpm-panel-sm"><div class="vpm-flex-between" id="vpmScriptStats">';
    html += '<span class="vpm-text-sm vpm-text-muted">' + formatNumber(sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</span>';
    html += '<span class="vpm-text-sm vpm-text-muted">Target: ' + formatDuration(td) + '</span>';
    html += '</div>';
    var durPct = Math.min(100, Math.round(((sc.estimated_duration || 0) / Math.max(td, 1)) * 100));
    html += '<div class="vpm-progress-bar"><div class="vpm-progress-fill" id="vpmScriptProgressFill" style="width:' + durPct + '%;background:' + (durPct > 100 ? 'var(--vpm-warning)' : 'var(--vpm-primary)') + '"></div></div>';
    html += '</div>';

    // --- Empty State ---
    if (!sections.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('file-lines') + '</div>';
      html += '<h3>No Script Sections</h3>';
      html += '<p>Confirm your Blueprint to auto-create script sections, or add sections manually below.</p>';
      html += '<div class="vpm-btn-row" style="justify-content:center">';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-script">' + icon('sparkles') + ' AI Generate Script</button>';
      html += '<button class="vpm-btn vpm-btn-outline" data-action="add-script-section">' + icon('plus') + ' Add Section</button>';
      html += '</div></div>';
    }

    // --- Tiptap loading indicator ---
    if (sections.length && !_tiptapReady) {
      html += '<div class="vpm-panel"><div class="vpm-ai-processing"><div class="vpm-ai-processing-animation">';
      html += '<div class="vpm-ai-pulse"></div><div class="vpm-ai-pulse vpm-ai-pulse-2"></div><div class="vpm-ai-pulse vpm-ai-pulse-3"></div>';
      html += '</div><p class="vpm-text-muted vpm-text-sm" style="margin-top:8px">Loading script editor\u2026</p></div></div>';
    }

    // --- Section Editors ---
    var _sectionColors = ['#1a73e8', '#7c3aed', '#0891b2', '#0d904f', '#e37400', '#d93025', '#9333ea', '#1a73e8', '#0891b2', '#0d904f'];
    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      var sColor = _sectionColors[si % _sectionColors.length];

      html += '<div class="vpm-script-section" style="border-left-color:' + sColor + '" data-section-id="' + sec.id + '">';

      // Section header
      html += '<div class="vpm-script-section-head">';
      html += '<div class="vpm-script-section-left">';
      html += '<span class="vpm-script-badge" style="background:' + sColor + '">' + esc(sec.label || 'Section ' + (si + 1)) + '</span>';
      html += '<span class="vpm-text-xs vpm-text-muted" data-section-stats="' + sec.id + '">' + (sec.word_count || 0) + 'w \u00B7 ~' + formatDuration(sec.estimated_duration || 0) + '</span>';
      html += '</div>';
      html += '<div class="vpm-script-section-actions">';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-xs" data-action="ai-generate-section-script" data-section-id="' + sec.id + '" title="' + (sec.word_count ? 'Regenerate script for this section' : 'Generate script for this section') + '">' + icon('sparkles') + (sec.word_count ? ' Regen' : ' Generate') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="ai-enhance-section" data-section-id="' + sec.id + '" title="AI Enhance">' + icon('wand-magic-sparkles') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="edit-section-label" data-section-id="' + sec.id + '" title="Rename">' + icon('pen') + '</button>';
      if (si > 0) html += '<button class="vpm-btn-icon-sm" data-action="move-script-section-up" data-section-id="' + sec.id + '" title="Move up">' + icon('chevron-up') + '</button>';
      if (si < sections.length - 1) html += '<button class="vpm-btn-icon-sm" data-action="move-script-section-down" data-section-id="' + sec.id + '" title="Move down">' + icon('chevron-down') + '</button>';
      if (sections.length > 1) html += '<button class="vpm-btn-icon-sm" data-action="remove-script-section" data-section-id="' + sec.id + '" title="Delete section" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
      html += '</div></div>';

      // Notes (collapsible)
      if (sec.notes) {
        html += '<div class="vpm-script-section-notes">' + icon('info') + ' <span class="vpm-text-xs vpm-text-muted">' + esc(sec.notes) + '</span></div>';
      }

      // Tiptap editor container
      html += '<div class="vpm-tiptap-container' + (sc.finalized ? ' vpm-tiptap-finalized' : '') + '" id="vpmScriptSection_' + sec.id + '"></div>';

      html += '</div>';
    }

    // --- Add Section Button ---
    if (sections.length > 0 && !sc.finalized) {
      html += '<button class="vpm-script-add-btn" data-action="add-script-section">' + icon('plus') + ' Add Section</button>';
    }

    // --- Finalized Banner ---
    if (sc.finalized) {
      html += '<div class="vpm-info-banner" style="margin-top:var(--vpm-space-4)">' + icon('lock') + ' Script finalized on ' + formatDate(sc.finalized_at) + '. Click "Unlock" to resume editing.</div>';
    }

    // --- Navigation ---
    var nextLabel, nextStage;
    if (S.mode === 'advanced') { nextLabel = 'Continue to Studio'; nextStage = 'studio'; }
    else { nextLabel = 'Continue to Clips'; nextStage = 'clips'; }
    html += renderNavButtons('Blueprint', nextLabel, nextStage);
    html += '</div>';

    // Trigger Tiptap init after DOM is ready
    setTimeout(function() { _initAllScriptEditors(); }, 100);

    return html;
  }


  // ============================================================
  // SECTION 8: STUDIO VIEW — FULL (5-tab)
  // ============================================================

  function renderStudioFull() {
    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('palette') + ' Studio</h2>';
    html += '<p class="vpm-view-subtitle">Looks, environments & scenes for visual consistency</p></div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script</button></div>';
    // Tabs
    html += '<div class="vpm-inner-tabs">';
    for (var tabId in Constants.STUDIO_TABS) {
      var tab = Constants.STUDIO_TABS[tabId]; var isActive = S.currentStudioTab === tabId;
      html += '<button class="vpm-inner-tab' + (isActive ? ' vpm-inner-tab-active' : '') + '" data-action="studio-tab" data-tab="' + tabId + '">' + icon(tab.icon) + ' ' + esc(tab.label) + '</button>';
    }
    html += '</div>';
    switch (S.currentStudioTab) {
      case 'overview':     html += _studioOverviewTab(); break;
      case 'looks':        html += _studioLooksTab(); break;
      case 'environments': html += _studioEnvironmentsTab(); break;
      case 'scenes':       html += _studioScenesTab(); break;
      case 'library':      html += _studioBrandLibraryTab(); break;
      default: html += _studioOverviewTab();
    }
    html += renderNavButtons('Script', 'Continue to Clips', 'clips');
    html += '</div>';
    return html;
  }

  // --- Overview Tab ---
  function _studioRequirementsPanel() {
    var reqs = S.studioReqs || {};
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return (c.track || (Constants.CLIP_TYPES[c.type] || {}).track) === 'ai'; });
    if (!aiClips.length) return '';

    var html = '<div class="vpm-panel vpm-studio-reqs-panel">';
    html += '<div class="vpm-flex-between vpm-mb-sm">';
    html += '<span class="vpm-panel-title" style="margin:0">' + icon('bullseye') + ' Asset Requirements</span>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Generate Missing Assets</button>';
    if ((reqs.unassigned_clips || []).length) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-auto-assign">' + icon('wand-magic-sparkles') + ' Auto-Assign</button>';
    html += '</div></div>';

    var rows = [
      { label: 'Character Looks', iconN: 'user-check', needed: (reqs.clips_needing_look || []).length, existing: reqs.existing_looks || 0 },
      { label: 'Environments', iconN: 'panorama', needed: (reqs.clips_needing_env || []).length, existing: reqs.existing_envs || 0 },
      { label: 'Unassigned Clips', iconN: 'circle-exclamation', needed: (reqs.unassigned_clips || []).length, existing: 0 }
    ];
    html += '<div class="vpm-studio-req-rows">';
    for (var ri = 0; ri < rows.length; ri++) {
      var rw = rows[ri];
      var status = rw.needed === 0 ? 'ok' : 'missing';
      html += '<div class="vpm-studio-req-row vpm-studio-req-' + status + '">';
      html += '<div class="vpm-studio-req-icon">' + icon(rw.iconN) + '</div>';
      html += '<div class="vpm-studio-req-info"><strong>' + esc(rw.label) + '</strong> ';
      if (rw.needed > 0) html += '<span class="vpm-text-warning">' + rw.needed + ' clip' + (rw.needed !== 1 ? 's' : '') + ' need assignment</span>';
      else html += '<span class="vpm-text-success">' + icon('check') + ' All assigned</span>';
      if (rw.existing > 0) html += ' <span class="vpm-text-xs vpm-text-muted">(' + rw.existing + ' available)</span>';
      html += '</div></div>';
    }
    html += '</div>';

    // Progress
    var totalN = aiClips.length;
    var assigned = totalN - (reqs.unassigned_clips || []).length;
    var pct = totalN > 0 ? Math.round((assigned / totalN) * 100) : 100;
    html += progressBar(pct);
    html += '</div>';
    return html;
  }

  function _studioOverviewTab() {
    var sr = S.meta.studioRequirements || {};
    var bs = S.brandStudio || {};
    var html = '';

    // Brand Library status
    if (bs.loaded) {
      html += '<div class="vpm-studio-brand-bar">';
      html += '<div class="vpm-studio-brand-left">' + icon('building') + ' <strong>Brand Studio Library</strong>';
      if (bs.brandInfo && bs.brandInfo.name) html += ' \u2014 ' + esc(bs.brandInfo.name);
      html += '<span class="vpm-studio-loaded">' + icon('check') + ' Loaded</span></div>';
      html += '<div class="vpm-studio-brand-counts">';
      if (bs.characters.length) html += '<span>' + bs.characters.length + ' Characters</span>';
      if (bs.outfits.length) html += '<span>' + bs.outfits.length + ' Outfits</span>';
      if (bs.looks.length) html += '<span>' + bs.looks.length + ' Looks</span>';
      if (bs.environments.length) html += '<span>' + bs.environments.length + ' Envs</span>';
      if (bs.scenes.length) html += '<span>' + bs.scenes.length + ' Scenes</span>';
      html += '</div></div>';
    }

    // Asset Requirements Panel (AI-first)
    html += _studioRequirementsPanel();

    // Stats row
    html += '<div class="vpm-studio-stats">';
    var statItems = [
      { label: 'Looks / Avatars', icon: 'user-check', brand: (bs.looks || []).length, custom: (S.meta.lookLibrary || []).length },
      { label: 'Environments', icon: 'panorama', brand: (bs.environments || []).length, custom: (S.meta.environmentLibrary || []).length },
      { label: 'Scenes', icon: 'image', brand: (bs.scenes || []).length, custom: (S.meta.sceneLibrary || []).length }
    ];
    for (var si = 0; si < statItems.length; si++) {
      var st = statItems[si]; var total = st.brand + st.custom;
      html += '<div class="vpm-studio-stat-card"><div class="vpm-studio-stat-icon">' + icon(st.icon) + '</div>';
      html += '<div class="vpm-studio-stat-num">' + total + '</div>';
      html += '<div class="vpm-studio-stat-label">' + esc(st.label) + '</div>';
      html += '<div class="vpm-studio-stat-break"><span class="vpm-studio-stat-brand">' + st.brand + ' brand</span><span class="vpm-studio-stat-custom">' + st.custom + ' custom</span></div></div>';
    }
    html += '</div>';

    // Visual Pipeline
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('zap') + ' Visual Pipeline</div>';
    html += '<div class="vpm-pipeline">';
    var pipeNodes = [
      { icon: 'user-check', label: 'Look / Avatar', sub: 'Visual identity', cls: 'accent' },
      { op: '+' },
      { icon: 'panorama', label: 'Environment', sub: 'Location & lighting', cls: '' },
      { op: '=' },
      { icon: 'image', label: 'Scene', sub: 'Reusable template', cls: 'primary' },
      { op: '\u2192' },
      { icon: 'film', label: 'Clip Frames', sub: 'AI-generated', cls: 'success' }
    ];
    for (var pi = 0; pi < pipeNodes.length; pi++) {
      var pn = pipeNodes[pi];
      if (pn.op) { html += '<div class="vpm-pipe-op">' + pn.op + '</div>'; }
      else {
        html += '<div class="vpm-pipe-node' + (pn.cls ? ' vpm-pipe-' + pn.cls : '') + '">';
        html += '<div class="vpm-pipe-icon">' + icon(pn.icon) + '</div>';
        html += '<strong>' + esc(pn.label) + '</strong><small>' + esc(pn.sub) + '</small></div>';
      }
    }
    html += '</div></div>';

    // AI analysis
    if (sr.total_needed) {
      html += '<div class="vpm-panel"><div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin:0">' + icon('sparkles') + ' AI Analysis</span>';
      html += badge((sr.total_created || 0) + '/' + sr.total_needed + ' ready', sr.total_draft > 0 ? '#e37400' : '#0d904f');
      html += '</div>' + progressBar(Math.round(((sr.total_created || 0) / sr.total_needed) * 100));
      if (sr.total_draft > 0) html += '<div class="vpm-info-banner vpm-info-warning" style="margin-top:8px">' + icon('warning') + ' ' + sr.total_draft + ' draft entities need review</div>';
      html += '</div>';
    }

    return html;
  }

  // --- Looks / Avatars Tab ---
  function _studioLooksTab() {
    var brandLooks = S.brandStudio.looks || [];
    var videoLooks = S.meta.lookLibrary || [];
    var total = brandLooks.length + videoLooks.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('user-check') + ' Looks / Avatars (' + total + ')</h3>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-look">' + icon('plus') + ' Create Look</button></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Look = Character + Outfit.</strong> Looks define the visual identity of people in your video. Brand looks are read-only; create custom copies to edit.</div></div>';

    // Brand section
    if (brandLooks.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandLooks.length + '</span></div>';
      html += '<div class="vpm-entity-grid">';
      for (var bi = 0; bi < brandLooks.length; bi++) html += _renderEntityCard(brandLooks[bi], bi, 'look', true);
      html += '</div>';
    }

    // Custom section
    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoLooks.length + '</span></div>';
    html += '<div class="vpm-entity-grid">';
    for (var vi = 0; vi < videoLooks.length; vi++) html += _renderEntityCard(videoLooks[vi], vi, 'look', false);
    html += '<div class="vpm-entity-card vpm-entity-card-add" data-action="add-look">' + icon('plus') + '<span>New Look</span></div>';
    html += '</div>';
    return html;
  }

  // --- Environments Tab ---
  function _studioEnvironmentsTab() {
    var brandEnvs = S.brandStudio.environments || [];
    var videoEnvs = S.meta.environmentLibrary || [];
    var total = brandEnvs.length + videoEnvs.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('panorama') + ' Environments (' + total + ')</h3>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-environment">' + icon('plus') + ' Create Environment</button></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Environments</strong> define locations, lighting, and atmosphere. Combine with a Look to create a Scene.</div></div>';

    if (brandEnvs.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandEnvs.length + '</span></div>';
      html += '<div class="vpm-entity-grid">';
      for (var bi = 0; bi < brandEnvs.length; bi++) html += _renderEntityCard(brandEnvs[bi], bi, 'environment', true);
      html += '</div>';
    }

    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoEnvs.length + '</span></div>';
    html += '<div class="vpm-entity-grid">';
    for (var vi = 0; vi < videoEnvs.length; vi++) html += _renderEntityCard(videoEnvs[vi], vi, 'environment', false);
    html += '<div class="vpm-entity-card vpm-entity-card-add" data-action="add-environment">' + icon('plus') + '<span>New Environment</span></div>';
    html += '</div>';
    return html;
  }

  // --- Scenes Tab ---
  function _studioScenesTab() {
    var brandScenes = S.brandStudio.scenes || [];
    var videoScenes = S.meta.sceneLibrary || [];
    var total = brandScenes.length + videoScenes.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('image') + ' Scenes (' + total + ')</h3>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-scene">' + icon('plus') + ' Create Scene</button>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-scenes">' + icon('sparkles') + ' Auto-Generate</button></div></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Scene = Look + Environment</strong> with camera direction. Assign scenes to clip frames for consistent visual generation.</div></div>';

    // Brand scenes
    if (brandScenes.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandScenes.length + '</span></div>';
      html += '<div class="vpm-scene-list">';
      for (var bi = 0; bi < brandScenes.length; bi++) html += _renderSceneCard(brandScenes[bi], bi, true);
      html += '</div>';
    }

    // Video scenes
    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoScenes.length + '</span></div>';
    html += '<div class="vpm-scene-list">';
    for (var vi = 0; vi < videoScenes.length; vi++) html += _renderSceneCard(videoScenes[vi], vi, false);
    html += '<div class="vpm-scene-card vpm-scene-card-add" data-action="add-scene">' + icon('plus') + ' Create New Scene</div>';
    html += '</div>';
    return html;
  }

  function _renderSceneCard(sc, idx, isBrand) {
    var env = sc.environment_id ? S.envMap[sc.environment_id] : (sc.environment ? sc.environment : null);
    var lookNames = [];
    var lookIds = sc.look_ids || (sc.looks ? sc.looks.map(function(l) { return l.look_id; }) : []);
    for (var i = 0; i < lookIds.length; i++) { var lk = S.lookMap[lookIds[i]]; if (lk) lookNames.push(lk.name || 'Unnamed Look'); }

    var html = '<div class="vpm-scene-card' + (isBrand ? ' vpm-scene-card-brand' : '') + (sc._draft ? ' vpm-scene-card-draft' : '') + '">';
    html += '<div class="vpm-scene-card-head"><span class="vpm-scene-name">' + esc(sc.name || 'Unnamed') + '</span>';
    if (isBrand) html += sourceBadge('brand');
    else html += sourceBadge('video');
    if (sc._draft) html += ' <span class="vpm-text-warning vpm-text-xs" style="font-weight:600">Draft</span>';
    if (sc.suggested_duration || sc.duration) html += '<span class="vpm-scene-dur">' + (sc.suggested_duration || sc.duration || 0) + 's</span>';
    html += '</div>';

    // Composition formula
    html += '<div class="vpm-scene-compose">';
    if (lookNames.length) html += '<span class="vpm-scene-part vpm-scene-look-part">' + icon('user-check') + ' ' + esc(lookNames.join(', ')) + '</span><span class="vpm-scene-op">+</span>';
    html += '<span class="vpm-scene-part vpm-scene-env-part">' + icon('panorama') + ' ' + esc(env ? (env.name || 'Unnamed Env') : (sc.environment ? sc.environment.name : 'No environment')) + '</span>';
    html += '</div>';

    // Camera direction
    if (sc.camera_direction) html += '<div class="vpm-scene-camera">' + icon('camera') + ' ' + esc(sc.camera_direction) + '</div>';

    // Actions
    html += '<div class="vpm-scene-actions">';
    if (isBrand) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-brand-scene" data-idx="' + idx + '">' + icon('copy') + ' Copy to Video</button>';
    } else {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-scene" data-idx="' + idx + '">' + icon('pen') + ' Edit</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-scene" data-idx="' + idx + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    }
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(_buildScenePrompt(sc)) + '">' + icon('copy') + ' Prompt</button>';
    html += '</div></div>';
    return html;
  }

  function _buildScenePrompt(sc) {
    var parts = [];
    var lookIds = sc.look_ids || (sc.looks ? sc.looks.map(function(l) { return l.look_id; }) : []);
    for (var i = 0; i < lookIds.length; i++) { var lk = S.lookMap[lookIds[i]]; if (lk && (lk.combined_prompt_fragment || lk.prompt_fragment)) parts.push(lk.combined_prompt_fragment || lk.prompt_fragment); }
    var env = sc.environment_id ? S.envMap[sc.environment_id] : (sc.environment || null);
    if (env && env.prompt_fragment) parts.push(env.prompt_fragment);
    if (sc.camera_direction) parts.push(sc.camera_direction);
    if (sc.scene_notes) parts.push(sc.scene_notes);
    return parts.join(', ');
  }

  // --- Brand Library Tab ---
  function _studioBrandLibraryTab() {
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.characters.length && !bs.looks.length && !bs.environments.length)) {
      return '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('building') + '</div><h3>No Brand Library</h3><p>No brand studio library found on this page. Add a <code>.brand-studio-library</code> element to the page template, or import entities manually.</p></div>';
    }

    var html = '<div class="vpm-panel"><div class="vpm-flex-between"><div>';
    html += '<h3 style="margin:0">' + icon('building') + ' ' + esc(bs.brandInfo ? bs.brandInfo.name : 'Brand Library') + '</h3>';
    html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:2px">Loaded from <code>.brand-studio-library</code> on page</div>';
    html += '</div><div class="vpm-btn-row"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="reload-brand-library">' + icon('arrows-rotate') + ' Reload</button></div></div></div>';

    // Collections
    if (bs.collections && bs.collections.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('layer-group') + ' Collections (' + bs.collections.length + ')</div>';
      html += '<div class="vpm-coll-grid">';
      for (var ci = 0; ci < bs.collections.length; ci++) {
        var col = bs.collections[ci];
        html += '<div class="vpm-coll-card"><div class="vpm-coll-name">' + esc(col.name || 'Unnamed') + '</div>';
        var entityCount = (col.character_ids || []).length + (col.look_ids || []).length + (col.environment_ids || []).length + (col.scene_ids || []).length;
        html += '<div class="vpm-coll-count">' + entityCount + ' entities</div>';
        if (col.tags && col.tags.length) { html += '<div class="vpm-coll-tags">'; for (var ti = 0; ti < col.tags.length; ti++) html += '<span class="vpm-tag-pill">' + esc(col.tags[ti]) + '</span>'; html += '</div>'; }
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Characters summary
    if (bs.characters.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('users') + ' Characters (' + bs.characters.length + ')</div>';
      html += '<div class="vpm-lib-list">';
      for (var chi = 0; chi < bs.characters.length; chi++) {
        var ch = bs.characters[chi];
        html += '<div class="vpm-lib-row"><div class="vpm-lib-thumb vpm-lib-thumb-char">' + icon('users') + '</div>';
        html += '<div class="vpm-lib-info"><div class="vpm-lib-name">' + esc(ch.name || 'Unnamed') + '</div>';
        if (ch.role) html += '<div class="vpm-lib-meta">' + roleBadge(ch.role) + '</div>';
        html += '</div>';
        var pf = ch.prompt_fragment || '';
        if (pf) html += '<div class="vpm-lib-prompt">' + esc(truncate(pf, 60)) + '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Outfits summary
    if (bs.outfits.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('shirt') + ' Outfits (' + bs.outfits.length + ')</div>';
      html += '<div class="vpm-lib-list">';
      for (var oi = 0; oi < bs.outfits.length; oi++) {
        var o = bs.outfits[oi];
        html += '<div class="vpm-lib-row"><div class="vpm-lib-thumb vpm-lib-thumb-outfit">' + icon('shirt') + '</div>';
        html += '<div class="vpm-lib-info"><div class="vpm-lib-name">' + esc(o.name || 'Unnamed') + '</div>';
        html += '<div class="vpm-lib-meta">' + esc(o.category || '') + '</div></div>';
        var opf = o.prompt_fragment || '';
        if (opf) html += '<div class="vpm-lib-prompt">' + esc(truncate(opf, 60)) + '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    return html;
  }


  // ============================================================
  // SECTION 9: ENTITY CARD RENDERER (reusable)
  // ============================================================

  function _renderEntityCard(entity, idx, entityType, isBrand) {
    var primaryImg = getEntityPrimaryImage(entity);
    var html = '<div class="vpm-entity-card' + (isBrand ? ' vpm-entity-card-brand' : '') + (entity._draft ? ' vpm-entity-card-draft' : '') + '">';
    html += '<div class="vpm-entity-img' + (entityType === 'look' ? ' vpm-entity-img-look' : entityType === 'environment' ? ' vpm-entity-img-env' : '') + '">';
    if (primaryImg) html += '<img src="' + esc(primaryImg) + '">';
    else html += icon(entityType === 'look' ? 'user-check' : entityType === 'environment' ? 'panorama' : 'image');
    if (entity._draft) html += '<span class="vpm-entity-draft-badge">' + icon('warning') + ' Draft</span>';
    html += '</div><div class="vpm-entity-info">';
    html += '<h4 class="vpm-entity-name">' + esc(entity.name || 'Unnamed') + '</h4>';
    // Badges
    var badges = '';
    if (entity.source) badges += sourceBadge(entity.source);
    if (entity.role && entityType === 'look') badges += ' ' + roleBadge(entity.role);
    if (entity.type && entityType === 'environment') badges += ' <span class="vpm-text-xs vpm-text-muted">' + esc(entity.type) + '</span>';
    if (badges) html += '<div style="margin-top:3px">' + badges + '</div>';
    // Prompt
    var pf = entity.prompt_fragment || entity.combined_prompt_fragment || '';
    if (pf) html += '<div class="vpm-entity-prompt">' + esc(truncate(pf, 80)) + '</div>';
    // Actions
    html += '<div class="vpm-btn-row" style="margin-top:6px">';
    if (isBrand) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-brand-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '">' + icon('copy') + ' Copy</button>';
    } else {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '">' + icon('pen') + '</button>';
      if (pf) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(pf) + '">' + icon('copy') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    }
    html += '</div></div></div>';
    return html;
  }

  function _getEntityLib(type) {
    switch (type) {
      case 'look': return S.meta.lookLibrary;
      case 'environment': return S.meta.environmentLibrary;
      case 'scene': return S.meta.sceneLibrary;
      default: return null;
    }
  }

  function _galleryTypeForEntity(entityType) {
    return entityType === 'look' ? 'looks' : entityType === 'environment' ? 'environments' : 'looks';
  }


  // ============================================================
  // SECTION 10: IMAGE PICKER — Reusable (entity edit modals)
  // ============================================================

  function _renderImagePicker(galleryType, entityType, idx, refImages) {
    var gallery = (S.galleries || {})[galleryType] || [];
    var primaryUrl = '';
    var refs = refImages || [];
    for (var ri = 0; ri < refs.length; ri++) { if (refs[ri].url) { primaryUrl = refs[ri].url; break; } }

    var html = '<div class="vpm-image-picker" data-gallery-type="' + esc(galleryType) + '" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">';
    html += '<label class="vpm-form-label">' + icon('image') + ' Reference Image</label>';
    if (primaryUrl) {
      html += '<div class="vpm-image-preview"><img src="' + esc(primaryUrl) + '" class="vpm-image-preview-img">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="remove-entity-image" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">' + icon('xmark') + ' Remove</button></div>';
    }
    html += '<div class="vpm-btn-row" style="margin:8px 0">';
    html += '<button class="vpm-btn vpm-btn-sm vpm-btn-primary" data-action="upload-entity-image" data-gallery-type="' + esc(galleryType) + '" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">' + icon('upload') + ' Upload</button>';
    if (gallery.length) html += '<button class="vpm-btn vpm-btn-sm vpm-btn-outline" data-action="browse-entity-gallery" data-gallery-type="' + esc(galleryType) + '">' + icon('images') + ' Gallery (' + gallery.length + ')</button>';
    html += '</div>';
    if (gallery.length) {
      html += '<div class="vpm-image-thumbstrip">';
      for (var gi = 0; gi < Math.min(gallery.length, 8); gi++) {
        var isSel = primaryUrl === gallery[gi].url;
        html += '<div class="vpm-image-thumb' + (isSel ? ' vpm-image-thumb-selected' : '') + '" data-action="select-entity-image" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '" data-gallery-idx="' + gi + '" data-gallery-type="' + esc(galleryType) + '"><img src="' + esc(gallery[gi].url) + '"></div>';
      }
      html += '</div>';
    }
    html += '<div style="margin-top:6px;display:flex;gap:6px;align-items:center"><span class="vpm-text-xs vpm-text-muted">or</span>';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1" data-action="save-entity-image-url" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '" value="' + esc(primaryUrl) + '" placeholder="Paste image URL\u2026"></div>';
    html += '</div>';
    return html;
  }

  function _setEntityImage(entityType, idx, url, fid) {
    var lib = _getEntityLib(entityType);
    var entity = lib ? lib[idx] : null;
    if (!entity) return;
    entity.reference_images = url ? [{ url: url, type: 'primary', gallery_fid: fid || '', set_at: new Date().toISOString() }] : [];
    entity.modified = new Date().toISOString();
    syncToTextarea();
    var $picker = $('.vpm-image-picker[data-entity-type="' + entityType + '"][data-entity-idx="' + idx + '"]');
    if ($picker.length) { var galType = $picker.data('gallery-type'); $picker.replaceWith(_renderImagePicker(galType, entityType, idx, entity.reference_images)); }
    toast(url ? 'Image set' : 'Image removed', url ? 'success' : 'info');
  }


  // ============================================================
  // SECTION 11: ENTITY EDIT MODALS (Look, Environment, Scene)
  // ============================================================

  function _openLookEditModal(idx, look) {
    var isNew = !look;
    if (isNew) look = createDefaultLook();
    var bs = S.brandStudio || {};
    var allChars = bs.characters || [];
    var allOutfits = bs.outfits || [];

    var html = '<div class="vpm-info-banner" style="margin-bottom:12px">' + icon('sparkles') + ' <strong>Look = Character + Outfit.</strong> Select components or write a combined prompt directly.</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Look Name</label><input class="vpm-input" data-field="name" value="' + esc(look.name || '') + '" placeholder="e.g. Professional Presenter"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Role</label><select class="vpm-select" data-field="role">';
    for (var rk in Constants.LOOK_ROLES) html += '<option value="' + rk + '"' + (look.role === rk ? ' selected' : '') + '>' + esc(Constants.LOOK_ROLES[rk].label) + '</option>';
    html += '</select></div>';
    // Character + Outfit selectors (from brand library)
    if (allChars.length) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('users') + ' Character (from Brand)</label><select class="vpm-select" data-field="character_id"><option value="">— None —</option>';
      for (var ci = 0; ci < allChars.length; ci++) html += '<option value="' + esc(allChars[ci].id) + '"' + (look.character_id === allChars[ci].id ? ' selected' : '') + '>' + esc(allChars[ci].name) + '</option>';
      html += '</select></div>';
    }
    if (allOutfits.length) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('shirt') + ' Outfit (from Brand)</label><select class="vpm-select" data-field="outfit_id"><option value="">— None —</option>';
      for (var oi = 0; oi < allOutfits.length; oi++) html += '<option value="' + esc(allOutfits[oi].id) + '"' + (look.outfit_id === allOutfits[oi].id ? ' selected' : '') + '>' + esc(allOutfits[oi].name) + '</option>';
      html += '</select></div>';
    }
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Combined Prompt Fragment</label><textarea class="vpm-textarea" data-field="combined_prompt_fragment" rows="3" placeholder="Full visual description for AI prompts. Leave blank to auto-combine from Character + Outfit.">' + esc(look.combined_prompt_fragment || '') + '</textarea></div>';
    // Image picker
    if (!isNew && idx >= 0) {
      html += _renderImagePicker('looks', 'look', idx, look.reference_images);
    }

    openModal(isNew ? 'Create Look' : 'Edit Look', html, { size: 'lg', saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      look.name = data.name || look.name || 'Unnamed';
      look.role = data.role || look.role;
      look.character_id = data.character_id || '';
      look.outfit_id = data.outfit_id || '';
      var cpf = data.combined_prompt_fragment || '';
      if (!cpf) {
        // Auto-combine
        var parts = [];
        if (look.character_id) { var ch = (bs.characters || []).find(function(c) { return c.id === look.character_id; }); if (ch && ch.prompt_fragment) parts.push(ch.prompt_fragment); }
        if (look.outfit_id) { var out = (bs.outfits || []).find(function(o) { return o.id === look.outfit_id; }); if (out && out.prompt_fragment) parts.push(out.prompt_fragment); }
        cpf = parts.join(', ');
      }
      look.combined_prompt_fragment = cpf;
      look.modified = new Date().toISOString();
      look.status = 'ready';
      if (isNew) { S.meta.lookLibrary = S.meta.lookLibrary || []; S.meta.lookLibrary.push(look); logActivity('look_created', 'Created look: ' + look.name); }
      else { S.meta.lookLibrary[idx] = look; logActivity('look_edited', 'Edited look: ' + look.name); }
      _snapshotFull(isNew ? 'Create look' : 'Edit look'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Look ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }

  function _openEnvironmentEditModal(idx, env) {
    var isNew = !env;
    if (isNew) env = createDefaultEnvironment();
    var html = '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Name</label><input class="vpm-input" data-field="name" value="' + esc(env.name || '') + '" placeholder="e.g. Modern Office — Daylight"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type">';
    for (var et in Constants.ENVIRONMENT_TYPES) html += '<option value="' + et + '"' + (env.type === et ? ' selected' : '') + '>' + esc(Constants.ENVIRONMENT_TYPES[et].label) + '</option>';
    html += '</select></div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label><textarea class="vpm-textarea" data-field="description" rows="2" placeholder="Physical description of the location\u2026">' + esc(env.description || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Prompt Fragment</label><textarea class="vpm-textarea" data-field="prompt_fragment" rows="3" placeholder="Concise visual description for AI prompts\u2026">' + esc(env.prompt_fragment || '') + '</textarea></div>';
    if (!isNew && idx >= 0) html += _renderImagePicker('environments', 'environment', idx, env.reference_images);
    openModal(isNew ? 'Create Environment' : 'Edit Environment', html, { saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      env.name = data.name || env.name || 'Unnamed'; env.type = data.type || env.type;
      env.description = data.description || ''; env.prompt_fragment = data.prompt_fragment || '';
      env.modified = new Date().toISOString(); env.status = 'ready';
      if (isNew) { S.meta.environmentLibrary = S.meta.environmentLibrary || []; S.meta.environmentLibrary.push(env); logActivity('environment_created', 'Created: ' + env.name); }
      else { S.meta.environmentLibrary[idx] = env; }
      _snapshotFull(isNew ? 'Create env' : 'Edit env'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Environment ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }

  function _openSceneEditModal(idx, scene) {
    var isNew = !scene;
    if (isNew) scene = createDefaultScene();
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Scene Name</label>';
    html += '<input class="vpm-input" data-field="name" value="' + esc(scene.name || '') + '" placeholder="e.g. Presenter in Modern Office"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' Environment</label>';
    html += '<select class="vpm-select" data-field="environment_id"><option value="">— Select —</option>';
    for (var ei = 0; ei < S.allEnvironments.length; ei++) { var env = S.allEnvironments[ei]; html += '<option value="' + esc(env.id) + '"' + (scene.environment_id === env.id ? ' selected' : '') + '>' + esc(env.name) + (env.source === 'brand' ? ' (brand)' : '') + '</option>'; }
    html += '</select></div>';
    // Look checkboxes
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Looks</label>';
    var currentLookIds = scene.look_ids || (scene.looks ? scene.looks.map(function(l) { return l.look_id; }) : []);
    if (S.allLooks.length) {
      for (var li = 0; li < S.allLooks.length; li++) { var lk = S.allLooks[li]; var isChecked = currentLookIds.indexOf(lk.id) > -1;
        html += '<label style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:13px;cursor:pointer"><input type="checkbox" class="vpm-scene-look-check" value="' + esc(lk.id) + '"' + (isChecked ? ' checked' : '') + '> ' + esc(lk.name) + (lk.source === 'brand' ? ' (brand)' : '') + '</label>'; }
    } else html += '<p class="vpm-text-sm vpm-text-muted">No looks available. Create one in the Looks tab first.</p>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('camera') + ' Camera Direction</label>';
    html += '<input class="vpm-input" data-field="camera_direction" value="' + esc(scene.camera_direction || '') + '" placeholder="e.g. Medium shot, slow dolly-in"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" data-field="suggested_duration" min="1" max="120" value="' + (scene.suggested_duration || 8) + '"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes</label>';
    html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="Scene description, mood, action notes\u2026">' + esc(scene.notes || scene.scene_notes || '') + '</textarea></div>';
    openModal(isNew ? 'Create Scene' : 'Edit Scene', html, { saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      scene.name = data.name || scene.name || 'Unnamed';
      scene.environment_id = data.environment_id || '';
      scene.camera_direction = data.camera_direction || '';
      scene.suggested_duration = parseInt(data.suggested_duration, 10) || 8;
      scene.notes = data.notes || '';
      scene.look_ids = [];
      $('.vpm-scene-look-check:checked').each(function() { scene.look_ids.push($(this).val()); });
      scene.modified = new Date().toISOString(); scene.status = 'ready';
      if (isNew) { S.meta.sceneLibrary = S.meta.sceneLibrary || []; S.meta.sceneLibrary.push(scene); logActivity('scene_created', 'Created: ' + scene.name); }
      else { S.meta.sceneLibrary[idx] = scene; }
      _snapshotFull(isNew ? 'Create scene' : 'Edit scene'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Scene ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }


  // ============================================================
  // SECTION 12: CLIPS VIEW — FULL (Split layout)
  // ============================================================

  function renderClipsFull() {
    var clips = S.data.clips || [];
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    var totalDur = 0; for (var di = 0; di < clips.length; di++) totalDur += (clips[di].duration || 0);
    var targetDur = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;
    var pct = Math.round((done / Math.max(clips.length, 1)) * 100);

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('film') + ' Clips</h2>';
    html += '<p class="vpm-view-subtitle">' + clips.length + ' clips \u00B7 ' + formatDuration(totalDur) + ' / ' + formatDuration(targetDur) + ' target \u00B7 ' + pct + '% complete</p></div>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-generate-clips" title="Generates all sections at once \u2014 for large videos, generate section by section">' + icon('sparkles') + ' Generate All Sections</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="add-clip-modal">' + icon('plus') + ' Add Clip</button></div></div>';

    // Per-track progress bars (Phase G)
    html += '<div class="vpm-clips-track-progress">';
    var tracks = [
      { key: 'ai', label: 'AI', total: S.clipStats.totalAI, done: S.clipStats.aiDone, color: 'var(--vpm-accent)' },
      { key: 'non-ai', label: 'Non-AI', total: S.clipStats.totalNonAI, done: S.clipStats.nonAiDone, color: 'var(--vpm-info)' },
      { key: 'template', label: 'Template', total: S.clipStats.totalTemplate, done: S.clipStats.templateDone, color: 'var(--vpm-text-muted)' }
    ];
    for (var tp = 0; tp < tracks.length; tp++) {
      var tr = tracks[tp]; var tPct = tr.total ? Math.round((tr.done / tr.total) * 100) : 0;
      html += '<div class="vpm-track-progress-item">';
      html += '<div class="vpm-track-progress-label">' + trackBadge(tr.key) + ' <span>' + tr.done + '/' + tr.total + '</span></div>';
      html += '<div class="vpm-track-progress-bar"><div class="vpm-track-progress-fill" style="width:' + tPct + '%;background:' + tr.color + '"></div></div>';
      html += '</div>';
    }
    // Duration bar
    var durPct = Math.min(100, Math.round((totalDur / Math.max(targetDur, 1)) * 100));
    var durOver = totalDur > targetDur;
    html += '<div class="vpm-track-progress-item">';
    html += '<div class="vpm-track-progress-label">' + icon('clock') + ' <span>' + formatDuration(totalDur) + ' / ' + formatDuration(targetDur) + '</span></div>';
    html += '<div class="vpm-track-progress-bar"><div class="vpm-track-progress-fill" style="width:' + durPct + '%;background:' + (durOver ? 'var(--vpm-warning)' : 'var(--vpm-primary)') + '"></div></div>';
    html += '</div></div>';

    html += renderTimelineBar(clips);

    // Empty state — only when NO clips AND no blueprint sections
    var _hasBpSections = ((S.data.blueprint || {}).sections || []).length > 0;
    if (!clips.length && !_hasBpSections) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('film') + '</div><h3>No Clips Yet</h3>';
      html += '<p>Create your Blueprint and Script first, then generate clips section by section.</p>';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-clips">' + icon('sparkles') + ' Generate All from Script</button></div>';
      html += renderNavButtons(S.mode === 'advanced' ? 'Studio' : 'Script', 'Continue to Publish', 'publish') + '</div>';
      return html;
    }

    // Track filter chips (only show when clips exist)
    if (clips.length) {
      html += '<div class="vpm-clips-filter">';
      var filters = [['all','All',clips.length],['ai','AI',S.clipStats.totalAI],['non-ai','Non-AI',S.clipStats.totalNonAI],['template','Template',S.clipStats.totalTemplate]];
      for (var fi = 0; fi < filters.length; fi++) {
        var f = filters[fi];
        html += '<button class="vpm-chip' + (S.clipTrackFilter === f[0] ? ' vpm-chip-active' : '') + '" data-action="filter-clips" data-filter="' + f[0] + '">' + esc(f[1]) + ' (' + f[2] + ')</button>';
      }
      html += '</div>';
    }

    // Split layout
    html += '<div class="vpm-clips-split">';

    // Left: clip list panel (Phase A)
    html += '<div class="vpm-clips-list-panel">';
    html += '<div class="vpm-clips-list-header"><span>' + (clips.length ? 'Clips (' + clips.length + ')' : 'Script Sections') + '</span>';
    html += '<button class="vpm-btn-icon-sm" data-action="add-clip-modal" title="Add Clip">' + icon('plus') + '</button></div>';
    var filteredClips = clips;
    if (S.clipTrackFilter !== 'all') filteredClips = clips.filter(function(c) { return c.track === S.clipTrackFilter; });

    // Build section map from clips
    var secMap = {};
    for (var ci = 0; ci < filteredClips.length; ci++) {
      var sec = filteredClips[ci].section || 'body';
      if (!secMap[sec]) secMap[sec] = [];
      secMap[sec].push(filteredClips[ci]);
    }

    // Build section order from blueprint (show ALL sections, even empty ones)
    var bpSecs = (S.data.blueprint || {}).sections || [];
    var secOrder = [];
    for (var bsi = 0; bsi < bpSecs.length; bsi++) secOrder.push(bpSecs[bsi].id);
    // Add any sections from clips not in blueprint
    for (var sk in secMap) { if (secOrder.indexOf(sk) === -1) secOrder.push(sk); }
    // If no blueprint sections at all, use 'body'
    if (!secOrder.length && filteredClips.length) secOrder.push('body');

    // Pre-compute section metrics
    var _sWpm = (S.meta.settings || {}).words_per_minute || 150;
    var _sVideoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var _sMCfg = getModelDurationConfig(_sVideoModel);
    var _sMaxClipDur = _sMCfg.maxDuration || _sMCfg.defaultDuration || 8;
    var _sMaxWordsPerClip = Math.floor((_sMaxClipDur / 60) * _sWpm);
    var _scriptSecs = (S.data.script || {}).sections || [];

    // Render section-by-section
    for (var gi = 0; gi < secOrder.length; gi++) {
      var gk = secOrder[gi];
      var gc = secMap[gk] || [];
      var gd = 0, gDone = 0;
      for (var gdi = 0; gdi < gc.length; gdi++) { gd += (gc[gdi].duration || 0); if (_isClipDone(gc[gdi])) gDone++; }
      // Resolve section label from blueprint
      var gl = gk, bpSec = null;
      for (var bli = 0; bli < bpSecs.length; bli++) { if (bpSecs[bli].id === gk || bpSecs[bli].label === gk) { gl = bpSecs[bli].label; bpSec = bpSecs[bli]; break; } }

      // Compute per-section metrics — match script section by ID, then by label, then by index
      var _scriptSec = null;
      for (var _ssi2 = 0; _ssi2 < _scriptSecs.length; _ssi2++) { if (_scriptSecs[_ssi2].id === gk) { _scriptSec = _scriptSecs[_ssi2]; break; } }
      if (!_scriptSec && gl) {
        var _glLow = gl.toLowerCase().trim();
        for (var _ssi3 = 0; _ssi3 < _scriptSecs.length; _ssi3++) { if ((_scriptSecs[_ssi3].label || '').toLowerCase().trim() === _glLow) { _scriptSec = _scriptSecs[_ssi3]; break; } }
      }
      if (!_scriptSec && gi < _scriptSecs.length) _scriptSec = _scriptSecs[gi];
      var _secWordCount = _scriptSec ? countWords(stripHtml(_scriptSec.content || '')) : 0;
      var _expectedClips = _secWordCount ? Math.max(1, Math.ceil(_secWordCount / _sMaxWordsPerClip)) : 0;
      var _secDone = gc.length >= _expectedClips && _expectedClips > 0;

      // Section header
      html += '<div class="vpm-clips-group-head' + (_secDone ? ' vpm-clips-group-done' : '') + '">';
      html += '<div class="vpm-clips-group-info"><span class="vpm-clips-group-label">' + icon('bookmark') + ' ' + (gi + 1) + '. ' + esc(gl) + '</span>';
      // Rich metadata
      var _secMeta = '';
      if (gc.length && _expectedClips) {
        _secMeta = gc.length + '/' + _expectedClips + ' clips';
        if (_secDone) _secMeta += ' ' + icon('circle-check');
      } else if (gc.length) {
        _secMeta = gc.length + ' clip' + (gc.length !== 1 ? 's' : '');
      } else {
        _secMeta = '0/' + (_expectedClips || '?') + ' clips';
      }
      if (_secWordCount) _secMeta += ' \u00B7 ' + _secWordCount + 'w';
      if (gc.length && gd) _secMeta += ' \u00B7 ' + formatDuration(gd);
      html += '<span class="vpm-text-xs vpm-text-muted">' + _secMeta + '</span>';
      html += '</div>';
      html += '<div class="vpm-clips-group-actions">';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-xs" data-action="generate-section-clips" data-section-id="' + esc(gk) + '" title="' + (gc.length ? 'Regenerate clips for this section' : 'Generate clips for this section') + '">' + icon('sparkles') + (gc.length ? ' Regen' : ' Generate') + '</button>';
      html += '</div>';
      // Progress bar for all sections
      var _progressPct = _expectedClips ? Math.min(100, Math.round((gc.length / _expectedClips) * 100)) : (gc.length ? 100 : 0);
      var _progressColor = _progressPct >= 100 ? 'var(--vpm-success)' : 'var(--vpm-primary)';
      if (_expectedClips || gc.length) html += '<div class="vpm-clips-group-progress"><div class="vpm-clips-group-progress-fill" style="width:' + _progressPct + '%;background:' + _progressColor + '"></div></div>';
      html += '</div>';

      // Empty section placeholder
      if (!gc.length) {
        html += '<div class="vpm-clips-section-empty">';
        if (_scriptSec && _scriptSec.content) {
          html += '<div class="vpm-text-xs vpm-text-muted" style="padding:4px 8px">' + icon('file-lines') + ' ' + esc(truncate(stripHtml(_scriptSec.content), 120)) + '</div>';
          html += '<div class="vpm-text-xs vpm-text-muted" style="padding:0 8px 6px">' + _secWordCount + ' words \u00B7 ~' + _expectedClips + ' clip' + (_expectedClips !== 1 ? 's' : '') + ' expected (' + _sMaxClipDur + 's max per clip)</div>';
        }
        html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-section-clips" data-section-id="' + esc(gk) + '" style="width:100%">' + icon('sparkles') + ' Generate Clips for ' + esc(truncate(gl, 25)) + '</button>';
        html += '</div>';
        continue;
      }

      // Render clips in this section
      for (var rci = 0; rci < gc.length; rci++) {
        var c = gc[rci]; var ct = Constants.CLIP_TYPES[c.type] || {}; var track = c.track || ct.track || 'ai';
        var isActive = c.id === S.selectedClipId;
        var durV = (track === 'ai') ? validateClipDuration(c) : { valid: true };
        var isDone = _isClipDone(c);
        html += '<div class="vpm-clips-list-item' + (isActive ? ' vpm-clips-list-active' : '') + (!durV.valid ? ' vpm-clips-list-warn' : '') + '" data-action="select-clip" data-clip-id="' + c.id + '">';
        html += '<span class="vpm-clip-order">#' + c.order + '</span>';
        html += '<div class="vpm-clip-status-dot" style="background:' + _csColor(c.status, track) + '"></div>';
        html += '<div class="vpm-clips-list-info"><div class="vpm-clips-list-title">' + esc(truncate(c.title || 'Untitled', 22)) + '</div>';
        html += '<div class="vpm-clips-list-meta">' + clipTypeBadge(c.type) + ' <span class="vpm-clip-list-dur">' + (c.duration || 0) + 's</span>';
        if (isDone) html += ' <span class="vpm-clip-done-check">' + icon('circle-check') + '</span>';
        if (!durV.valid) html += ' <span class="vpm-dur-warn">' + icon('warning') + '</span>';
        html += '</div></div>';
        html += '<div class="vpm-clip-reorder">';
        html += '<button class="vpm-clip-reorder-btn" data-action="move-clip-up" data-clip-id="' + c.id + '" title="Move up">' + icon('chevron-up') + '</button>';
        html += '<button class="vpm-clip-reorder-btn" data-action="move-clip-down" data-clip-id="' + c.id + '" title="Move down">' + icon('chevron-down') + '</button>';
        html += '</div></div>';
      }
    }
    html += '</div>';

    // Right: detail panel (Phase B container)
    html += '<div class="vpm-clips-detail-panel">';
    var sel = S.selectedClipId ? S.clipMap[S.selectedClipId] : (clips.length > 0 ? clips[0] : null);
    if (sel) {
      html += '<div class="vpm-clip-detail-container">' + _renderClipDetail(sel) + '</div>';
    } else {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('hand-pointer') + '</div><h3>Select a Clip</h3>';
      html += '<p>Choose a clip from the list to configure prompts, frames, and production details.</p></div>';
    }
    html += '</div></div>';

    html += renderNavButtons(S.mode === 'advanced' ? 'Studio' : 'Script', 'Continue to Publish', 'publish') + '</div>';
    return html;
  }

  function _isClipDone(clip) {
    var s = clip.status || '';
    return s === 'done' || s === 'video-done' || s === 'applied' || s === 'customized';
  }

  // --- Clip Detail Panel (Phase B: container + header + clip nav) ---
  function _renderClipDetail(clip) {
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var track = clip.track || ct.track || 'ai';
    // Lazy-ensure: create heavy structures on-demand when user opens clip detail
    if (track === 'ai') ensurePromptSet(clip);
    if (track === 'non-ai') ensureNonAiPlanning(clip);
    ensureProductionConfig(clip);
    var durV = (track === 'ai') ? validateClipDuration(clip) : { valid: true };
    var clips = S.data.clips || [];
    var clipIdx = -1; for (var ci = 0; ci < clips.length; ci++) { if (clips[ci].id === clip.id) { clipIdx = ci; break; } }
    var html = '<div class="vpm-clip-detail">';

    // Header with action buttons
    html += '<div class="vpm-clip-detail-head">';
    html += '<div class="vpm-clip-detail-head-left">';
    html += '<h3 class="vpm-clip-detail-title">#' + clip.order + ' ' + esc(clip.title || 'Untitled') + '</h3>';
    html += '<div class="vpm-clip-detail-badges">' + clipTypeBadge(clip.type) + ' ' + trackBadge(track) + ' ' + clipStatusBadge(clip.status, track) + ' ' + badge((clip.duration || 0) + 's', '#6b7280');
    if (!durV.valid) html += ' <span class="vpm-dur-warn" title="' + esc(durV.warning) + '">' + icon('warning') + ' ' + esc(durV.snapped + 's') + '</span>';
    html += '</div></div>';
    html += '<div class="vpm-clip-detail-actions">';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-clip-modal" data-clip-id="' + clip.id + '">' + icon('pen') + ' Edit</button>';
    html += '<button class="vpm-btn-icon-subtle" data-action="duplicate-clip" data-clip-id="' + clip.id + '" title="Duplicate">' + icon('copy') + '</button>';
    html += '<button class="vpm-btn-icon-subtle" data-action="delete-clip" data-clip-id="' + clip.id + '" title="Delete" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    html += '</div></div>';

    // Prerequisite warnings
    var _clipPrereqs = getClipPrerequisites(clip);
    if (_clipPrereqs.length) {
      html += '<div class="vpm-clip-prereqs">';
      for (var wi = 0; wi < _clipPrereqs.length; wi++) {
        var _w = _clipPrereqs[wi];
        var _sevCls = _w.severity === 'error' ? 'vpm-prereq-error' : _w.severity === 'warning' ? 'vpm-prereq-warn' : 'vpm-prereq-info';
        html += '<div class="vpm-prereq-banner ' + _sevCls + '">';
        html += '<span>' + icon(_w.severity === 'error' ? 'triangle-exclamation' : _w.severity === 'warning' ? 'circle-exclamation' : 'circle-info') + ' ' + esc(_w.message) + '</span>';
        html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="' + _w.action + '" data-clip-id="' + clip.id + '">' + icon('sparkles') + ' ' + esc(_w.actionLabel) + '</button>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Clip navigation: prev / next
    html += '<div class="vpm-clip-nav">';
    if (clipIdx > 0) html += '<button class="vpm-clip-nav-btn" data-action="select-clip" data-clip-id="' + clips[clipIdx - 1].id + '">' + icon('chevron-left') + ' #' + clips[clipIdx - 1].order + '</button>';
    else html += '<span></span>';
    html += '<span class="vpm-clip-nav-pos">' + (clipIdx + 1) + ' of ' + clips.length + '</span>';
    if (clipIdx < clips.length - 1) html += '<button class="vpm-clip-nav-btn" data-action="select-clip" data-clip-id="' + clips[clipIdx + 1].id + '">#' + clips[clipIdx + 1].order + ' ' + icon('chevron-right') + '</button>';
    else html += '<span></span>';
    html += '</div>';

    // AI status workflow bar — filter frame steps for non-frames modes
    if (track === 'ai') {
      html += '<div class="vpm-clip-workflow">';
      var _wfPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _wfModelDefaultGenMode = (Constants.VIDEO_MODELS[_wfPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _wfGenMode = ((clip.prompt_set || {}).video || {}).gen_mode || _wfModelDefaultGenMode;
      var _showFrameStatuses = (_wfGenMode === 'frames-to-video');
      var statuses = Constants.AI_CLIP_STATUS_ORDER.filter(function(s) {
        if (!_showFrameStatuses && (s === 'first-frame-ready' || s === 'last-frame-ready')) return false;
        return true;
      });
      var curIdx = statuses.indexOf(clip.status);
      for (var si = 0; si < statuses.length; si++) {
        var isDone = si <= curIdx;
        html += '<div class="vpm-cw-step' + (isDone ? ' vpm-cw-done' : '') + '"><div class="vpm-cw-bar"></div><span class="vpm-cw-label">' + esc((Constants.AI_CLIP_STATUSES[statuses[si]] || {}).label || statuses[si]) + '</span></div>';
      }
      html += '</div>';
    }

    // Track-specific tabs
    html += '<div class="vpm-inner-tabs">';
    if (track === 'ai') {
      var ps = clip.prompt_set || {};
      var _vd = ps.video || {};
      var _tabPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _tabModelDefaultGenMode = (Constants.VIDEO_MODELS[_tabPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _genMode = _vd.gen_mode || _tabModelDefaultGenMode;
      var _showFrameTabs = (_genMode === 'frames-to-video');
      // Mode-aware tab 1 label and icon
      var _tab1Label = _genMode === 'ingredients-to-video' ? 'Script & Assets'
                     : _genMode === 'text-to-video' ? 'Script'
                     : 'Script & Config';
      var _tab1Icon  = _genMode === 'ingredients-to-video' ? 'layer-group'
                     : _genMode === 'text-to-video' ? 'file-lines'
                     : 'sliders';
      var aiTabs = [{ id:'script-config', l: _tab1Label, ic: _tab1Icon }];
      if (_showFrameTabs) {
        aiTabs.push({ id:'first-frame', l:'First Frame', ic:'image' });
        if (ps.requires_last_frame) aiTabs.push({ id:'last-frame', l:'Last Frame', ic:'images' });
      }
      aiTabs.push({ id:'video', l:'Prompt', ic:'wand-magic-sparkles' });
      // Auto-switch to script-config if on a hidden frame tab
      if (!_showFrameTabs && (S.currentClipDetailTab === 'first-frame' || S.currentClipDetailTab === 'last-frame')) {
        S.currentClipDetailTab = 'script-config';
      }
      for (var ti = 0; ti < aiTabs.length; ti++) {
        var t = aiTabs[ti]; var isA = S.currentClipDetailTab === t.id;
        // Tab status indicator
        var tabStatus = _getTabStatus(clip, t.id);
        html += '<button class="vpm-inner-tab' + (isA ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="' + t.id + '">' + icon(t.ic) + ' ' + esc(t.l);
        if (tabStatus === 'done') html += ' <span class="vpm-tab-check">' + icon('circle-check') + '</span>';
        else if (tabStatus === 'partial') html += ' <span class="vpm-tab-partial">\u25CF</span>';
        html += '</button>';
      }
    } else if (track === 'non-ai') {
      html += '<button class="vpm-inner-tab' + (S.currentClipDetailTab === 'planning' ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="planning">' + icon('clipboard-list') + ' Planning</button>';
      html += '<button class="vpm-inner-tab' + (S.currentClipDetailTab === 'creation' ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="creation">' + icon('camera') + ' Create / Record</button>';
    } else {
      html += '<button class="vpm-inner-tab vpm-inner-tab-active">' + icon('copy') + ' Template</button>';
    }
    html += '</div>';

    // Tab content
    if (track === 'ai') {
      switch (S.currentClipDetailTab) {
        case 'script-config': html += _aiTabScriptConfig(clip); break;
        case 'first-frame': html += _aiTabFrame(clip, 'first_frame'); break;
        case 'last-frame': html += _aiTabFrame(clip, 'last_frame'); break;
        case 'video': html += _aiTabVideo(clip); break;
        default: html += _aiTabScriptConfig(clip);
      }
    } else if (track === 'non-ai') {
      html += (S.currentClipDetailTab === 'creation') ? _nonAiTabCreation(clip) : _nonAiTabPlanning(clip);
    } else {
      html += _templateTab(clip);
    }
    html += '</div>';
    return html;
  }

  function _getTabStatus(clip, tabId) {
    var ps = clip.prompt_set || {};
    if (tabId === 'script-config') return (clip.script_text || clip.visual_direction) ? 'done' : '';
    if (tabId === 'first-frame') { var ff = ps.first_frame || {}; if (ff.marked_done) return 'done'; if (ff.prompt && ff.prompt.status === 'generated') return 'partial'; return ''; }
    if (tabId === 'last-frame') { var lf = ps.last_frame || {}; if (!lf) return ''; if (lf.marked_done) return 'done'; if (lf.prompt && lf.prompt.status === 'generated') return 'partial'; return ''; }
    if (tabId === 'video') { var vp = (ps.video || {}).prompt || {}; if (ps.video && ps.video.marked_done) return 'done'; if (vp.status === 'generated') return 'partial'; return ''; }
    return '';
  }


  // ============================================================
  // SECTION 13: AI CLIP TABS
  // ============================================================

  function _aiTabScriptConfig(clip) {
    var pc = clip.production_config || {};
    var _ps = clip.prompt_set || {};
    var _vd = _ps.video || {};
    var _scPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var _scModelDefaultGenMode = (Constants.VIDEO_MODELS[_scPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
    var _genMode = _vd.gen_mode || _scModelDefaultGenMode;
    var VideoGenModes = Constants.VIDEO_GEN_MODES || {};
    var wpm = (S.meta.settings || {}).words_per_minute || 150;
    var wc = clip.script_text ? countWords(clip.script_text) : 0;
    var estDur = wc > 0 ? Math.round(wc / wpm * 60) : 0;
    var maxWordsForClip = Math.floor(((clip.duration || 8) / 60) * wpm);
    var html = '';

    // --- 1. Video Generation Mode (always shown — drives the rest of the UI) ---
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('sliders') + ' Generation Mode</div>';
    html += '<div class="vpm-gen-mode-cards">';
    for (var _gmk in VideoGenModes) {
      var _gm = VideoGenModes[_gmk]; var _isGmA = _genMode === _gmk;
      html += '<div class="vpm-gen-mode-card' + (_isGmA ? ' vpm-gen-mode-active' : '') + '" data-action="set-video-gen-mode" data-clip="' + clip.id + '" data-value="' + _gmk + '">';
      html += '<div class="vpm-gen-mode-icon">' + icon(_gm.icon) + '</div>';
      html += '<div class="vpm-gen-mode-label">' + esc(_gm.label) + '</div>';
      html += '<div class="vpm-gen-mode-desc">' + esc(_gm.description) + '</div>';
      html += '</div>';
    }
    html += '</div></div>';

    // --- 2. Mode-specific middle sections ---
    if (_genMode === 'ingredients-to-video') {
      // Seedance: Studio-linked character look + up to 3 environments
      html += _renderSeedanceAssetsPanel(clip);

    } else if (_genMode === 'frames-to-video') {
      // VEO 3.1: AI Character Look selector (ai-character clips only)
      if (clip.type === 'ai-character') {
        var _ffScene = ((_ps.first_frame || {}).scene || {});
        var _curLookIds = _ffScene.look_ids || [];
        var _assignedLook = _curLookIds.length && S.lookMap ? S.lookMap[_curLookIds[0]] : null;
        html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('user-tie') + ' Character / Look</div>';
        if (!S.allLooks.length) {
          html += '<div class="vpm-prereq-banner vpm-prereq-error">' + icon('triangle-exclamation') + ' No character looks available. ';
          html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('plus') + ' Create Looks from Script</button></div>';
        } else {
          html += '<div class="vpm-character-selector">';
          for (var _csi = 0; _csi < S.allLooks.length; _csi++) {
            var _clk = S.allLooks[_csi];
            var _isAssigned = _curLookIds.indexOf(_clk.id) >= 0;
            html += '<div class="vpm-char-card' + (_isAssigned ? ' vpm-char-card-active' : '') + '" data-action="assign-clip-look" data-clip="' + clip.id + '" data-look="' + _clk.id + '">';
            html += '<div class="vpm-char-card-info">';
            html += '<div class="vpm-char-card-name">' + esc(_clk.name || 'Unnamed') + '</div>';
            html += '<div class="vpm-char-card-role">' + esc((Constants.LOOK_ROLES[_clk.role] || {}).label || _clk.role || '') + '</div>';
            if (_isAssigned && _clk.voice_profile && (_clk.voice_profile.style || _clk.voice_profile.custom_description)) {
              html += '<div class="vpm-char-card-voice">' + icon('microphone-lines') + ' ' + esc([_clk.voice_profile.gender, _clk.voice_profile.style, _clk.voice_profile.accent].filter(Boolean).join(', ')) + '</div>';
            }
            html += '</div></div>';
          }
          html += '</div>';
          if (_assignedLook) {
            var _avp = _assignedLook.voice_profile || {};
            if (_avp.style || _avp.custom_description) {
              html += '<div class="vpm-voice-preview">' + icon('microphone-lines') + ' <strong>Voice:</strong> ' + esc([_avp.gender, _avp.age_range, _avp.style, _avp.accent].filter(Boolean).join(', '));
              if (_avp.custom_description) html += ' \u2014 ' + esc(_avp.custom_description);
              html += '</div>';
            } else {
              html += '<div class="vpm-info-banner vpm-text-sm" style="margin-top:6px">' + icon('info') + ' No voice profile on this look. Project default voice will be used.</div>';
            }
          }
        }
        html += '</div>';
      }

      // Scene & Visual Setup
      var ffScene = ((_ps.first_frame || {}).scene || {});
      html += '<div class="vpm-clip-section"><div class="vpm-flex-between"><div class="vpm-clip-section-head" style="margin:0">' + icon('image') + ' Scene & Visual Setup</div>';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-clip-scene" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI Suggest</button></div>';
      if (S.allScenes.length) {
        var assignedScene = null;
        for (var asi = 0; asi < S.allScenes.length; asi++) { if (S.allScenes[asi].id === ffScene.scene_template_id) { assignedScene = S.allScenes[asi]; break; } }
        html += '<div class="vpm-form-group"><label class="vpm-form-label">Scene Template</label>';
        html += '<select class="vpm-select" data-action="save-clip-scene" data-clip="' + clip.id + '"><option value="">\u2014 No Scene \u2014</option>';
        for (var sci = 0; sci < S.allScenes.length; sci++) {
          var sc = S.allScenes[sci];
          html += '<option value="' + esc(sc.id) + '"' + (ffScene.scene_template_id === sc.id ? ' selected' : '') + '>' + esc(sc.name) + (sc.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
        if (assignedScene) {
          var envName = '', lookNames = [];
          for (var ei = 0; ei < S.allEnvironments.length; ei++) { if (S.allEnvironments[ei].id === assignedScene.environment_id) { envName = S.allEnvironments[ei].name; break; } }
          for (var li = 0; li < (assignedScene.look_ids || []).length; li++) {
            for (var lki = 0; lki < S.allLooks.length; lki++) { if (S.allLooks[lki].id === assignedScene.look_ids[li]) { lookNames.push(S.allLooks[lki].name); break; } }
          }
          html += '<div class="vpm-scene-preview-card">';
          html += '<div class="vpm-scene-preview-name">' + icon('image') + ' ' + esc(assignedScene.name) + '</div>';
          if (envName) html += '<div class="vpm-scene-preview-detail">' + icon('panorama') + ' ' + esc(envName) + '</div>';
          if (lookNames.length) html += '<div class="vpm-scene-preview-detail">' + icon('user-check') + ' ' + esc(lookNames.join(', ')) + '</div>';
          if (assignedScene.camera_direction) html += '<div class="vpm-scene-preview-detail">' + icon('video') + ' ' + esc(assignedScene.camera_direction) + '</div>';
          html += '</div>';
        }
      }
      html += '<div class="vpm-form-grid" style="margin-top:8px">';
      if (S.allLooks.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Look / Character</label>';
        html += '<select class="vpm-select" data-action="save-clip-look" data-clip="' + clip.id + '"><option value="">\u2014 None \u2014</option>';
        var currentLookIds = ffScene.look_ids || [];
        for (var cli = 0; cli < S.allLooks.length; cli++) {
          var clk = S.allLooks[cli];
          html += '<option value="' + esc(clk.id) + '"' + (currentLookIds.indexOf(clk.id) >= 0 ? ' selected' : '') + '>' + esc(clk.name || 'Unnamed') + (clk.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
      }
      if (S.allEnvironments.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' Environment</label>';
        html += '<select class="vpm-select" data-action="save-clip-environment" data-clip="' + clip.id + '"><option value="">\u2014 None \u2014</option>';
        for (var cei = 0; cei < S.allEnvironments.length; cei++) {
          var env = S.allEnvironments[cei];
          html += '<option value="' + esc(env.id) + '"' + (ffScene.environment_id === env.id ? ' selected' : '') + '>' + esc(env.name || 'Unnamed') + ' (' + esc(env.type || 'indoor') + ')' + (env.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
      }
      html += '</div>';
      if (!S.allScenes.length && !S.allLooks.length && !S.allEnvironments.length) {
        html += '<div class="vpm-info-banner">' + icon('info') + ' No visual assets yet. ';
        html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script to Create Assets</button></div>';
      }
      html += '</div>';

      // Production Config (only relevant for frames-to-video / VEO 3.1)
      var mCfg = getModelDurationConfig(_scPrimaryVM);
      html += '<details class="vpm-clip-section vpm-clip-config-details"><summary class="vpm-clip-section-head">' + icon('gears') + ' Production Config</summary>';
      html += '<div class="vpm-form-grid" style="padding-top:10px">';
      html += _cfgSelect('Motion', Constants.MOTION_STRENGTHS, pc.motion_strength, clip.id, 'motion_strength');
      html += _cfgSelect('Camera', Constants.CAMERA_MOVEMENTS, pc.camera_movement, clip.id, 'camera_movement');
      html += _cfgSelect('Transition', Constants.TRANSITION_STYLES, pc.transition_style, clip.id, 'transition_style');
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration <span class="vpm-text-xs vpm-text-muted">(' + mCfg.label + ': ' + mCfg.minDuration + '-' + mCfg.maxDuration + 's)</span></label>';
      html += '<input class="vpm-input" type="number" min="' + mCfg.minDuration + '" max="' + mCfg.maxDuration + '" step="1" value="' + (clip.duration||8) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration">';
      html += '</div></div></details>';
    }
    // text-to-video: no middle sections — just gen mode cards then script

    // --- 3. Script & Narration (all modes) ---
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('file-lines') + ' Script & Narration';
    if (wc > 0) html += ' <span class="vpm-text-xs vpm-text-muted">' + wc + ' words \u00B7 ~' + estDur + 's</span>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Voiceover / Script Text</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="script_text" rows="3" placeholder="What the narrator says\u2026">' + esc(clip.script_text || '') + '</textarea></div>';
    if (wc > 0 && wc > maxWordsForClip) {
      html += '<div class="vpm-prereq-banner vpm-prereq-warn" style="margin:-4px 0 8px">';
      html += '<span>' + icon('triangle-exclamation') + ' Script is <strong>' + wc + ' words</strong> but ' + (clip.duration || 8) + 's clip supports max <strong>' + maxWordsForClip + ' words</strong> at ' + wpm + ' WPM. Overflow: ' + (wc - maxWordsForClip) + ' words.</span>';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-split-clip" data-clip-id="' + clip.id + '">' + icon('scissors') + ' AI Split</button>';
      html += '</div>';
    }
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">On-Screen Text</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="onscreen_text" value="' + esc(clip.onscreen_text || '') + '" placeholder="Text overlay\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="visual_direction" value="' + esc(clip.visual_direction || '') + '" placeholder="What to show\u2026"></div>';
    html += '</div></div>';
    return html;
  }

  function _cfgSelect(label, items, selected, clipId, field) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">' + esc(label) + '</label><select class="vpm-select" data-action="save-clip-config" data-clip="' + clipId + '" data-field="' + field + '">';
    for (var k in items) html += '<option value="' + k + '"' + (selected === k ? ' selected' : '') + '>' + esc(items[k].label) + '</option>';
    html += '</select></div>';
    return html;
  }

  // Seedance Assets Panel — character look + up to 3 environments from Studio
  // Data: clip.prompt_set.video.seedance_assets = { character_look_id: '', env_ids: ['', '', ''] }
  function _renderSeedanceAssetsPanel(clip) {
    var _ps = clip.prompt_set || {};
    var _vd = _ps.video || {};
    var _sa = _vd.seedance_assets || {};
    var _envIds = _sa.env_ids || ['', '', ''];
    var html = '<div class="vpm-clip-section">';
    html += '<div class="vpm-flex-between"><div class="vpm-clip-section-head" style="margin:0">' + icon('layer-group') + ' Seedance Assets</div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-clip-scene" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI Suggest</button></div>';
    html += '<p class="vpm-text-muted vpm-text-sm" style="margin:4px 0 10px">Select the Studio assets Seedance will use as visual ingredients for this clip.</p>';
    if (!S.allLooks.length && !S.allEnvironments.length) {
      html += '<div class="vpm-info-banner">' + icon('info') + ' No visual assets yet. ';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script to Create Assets</button></div>';
    } else {
      html += '<div class="vpm-form-grid">';
      // Character Look
      if (S.allLooks.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-tie') + ' Character Look</label>';
        html += '<select class="vpm-select" data-action="save-seedance-look" data-clip="' + clip.id + '">';
        html += '<option value="">\u2014 None \u2014</option>';
        for (var _li = 0; _li < S.allLooks.length; _li++) {
          var _lk = S.allLooks[_li];
          html += '<option value="' + esc(_lk.id) + '"' + (_sa.character_look_id === _lk.id ? ' selected' : '') + '>' + esc(_lk.name || 'Unnamed') + ((_lk.role && Constants.LOOK_ROLES && Constants.LOOK_ROLES[_lk.role]) ? ' (' + esc(Constants.LOOK_ROLES[_lk.role].label) + ')' : '') + '</option>';
        }
        html += '</select></div>';
      }
      // Environments 1-3
      if (S.allEnvironments.length) {
        var _envLabels = ['Environment 1', 'Environment 2 (optional)', 'Environment 3 (optional)'];
        for (var _ei = 0; _ei < 3; _ei++) {
          html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' ' + _envLabels[_ei] + '</label>';
          html += '<select class="vpm-select" data-action="save-seedance-env" data-clip="' + clip.id + '" data-idx="' + _ei + '">';
          html += '<option value="">\u2014 None \u2014</option>';
          for (var _ej = 0; _ej < S.allEnvironments.length; _ej++) {
            var _env = S.allEnvironments[_ej];
            html += '<option value="' + esc(_env.id) + '"' + ((_envIds[_ei] || '') === _env.id ? ' selected' : '') + '>' + esc(_env.name || 'Unnamed') + ' (' + esc(_env.type || 'indoor') + ')' + (_env.source === 'brand' ? ' (brand)' : '') + '</option>';
          }
          html += '</select></div>';
        }
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _aiTabFrame(clip, frameKey) {
    var ps = clip.prompt_set || {};
    var frame = ps[frameKey] || {};
    var prompt = frame.prompt || {};
    var scene = frame.scene || {};
    var isFirst = frameKey === 'first_frame';
    var html = '';

    // Header with done toggle
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head-row"><div>' + icon(isFirst ? 'image' : 'images') + ' ' + (isFirst ? 'First' : 'Last') + ' Frame';
    var pStatus = prompt.status || 'empty';
    if (pStatus === 'generated') html += ' <span class="vpm-prompt-status vpm-prompt-status-generated">' + icon('circle-check') + ' Generated</span>';
    else if (pStatus === 'edited') html += ' <span class="vpm-prompt-status vpm-prompt-status-edited">' + icon('pen') + ' Edited</span>';
    html += '</div>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-frame-done" data-clip="' + clip.id + '" data-frame="' + frameKey + '"' + (frame.marked_done ? ' checked' : '') + '>' + (frame.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label>';
    html += '</div>';

    // Scene info card
    if (scene.scene_template_id) {
      var sc = S.sceneMap[scene.scene_template_id];
      if (sc) {
        var envName = '';
        for (var ei = 0; ei < S.allEnvironments.length; ei++) { if (S.allEnvironments[ei].id === sc.environment_id) { envName = S.allEnvironments[ei].name; break; } }
        html += '<div class="vpm-scene-info-card">' + icon('image') + ' <strong>' + esc(sc.name) + '</strong>';
        if (envName) html += ' <span class="vpm-text-muted">\u00B7 ' + esc(envName) + '</span>';
        if (sc.camera_direction) html += ' <span class="vpm-text-muted">\u00B7 ' + esc(truncate(sc.camera_direction, 30)) + '</span>';
        html += '</div>';
      }
    }

    // Image prompt
    html += '<div class="vpm-clip-prompt-section"><div class="vpm-flex-between"><span class="vpm-clip-prompt-label">' + icon('wand-magic-sparkles') + ' Image Prompt</span>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-frame-prompt" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('sparkles') + ' Generate</button></div>';
    if (prompt.positive) {
      html += '<div class="vpm-prompt-box vpm-prompt-positive">' + esc(prompt.positive) + '</div>';
      if (prompt.negative) html += '<div class="vpm-prompt-box vpm-prompt-negative">' + esc(prompt.negative) + '</div>';
      if (prompt.style_keywords && prompt.style_keywords.length) {
        html += '<div class="vpm-prompt-keywords">';
        for (var ki = 0; ki < prompt.style_keywords.length; ki++) html += '<span class="vpm-prompt-keyword">' + esc(prompt.style_keywords[ki]) + '</span>';
        html += '</div>';
      }
      html += '<div class="vpm-btn-row" style="margin-top:8px"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(prompt.positive) + '">' + icon('copy') + ' Copy</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-frame-prompt" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('pen') + ' Edit</button></div>';
    } else {
      html += '<div class="vpm-empty-state vpm-empty-state-sm">' + icon('wand-magic-sparkles') + '<p>Generate or write an image prompt for this frame</p></div>';
    }
    html += '</div></div>';

    // Frame image picker
    html += _renderFrameImagePicker(clip, frameKey);
    return html;
  }

  function _aiTabVideo(clip) {
    var ps = clip.prompt_set || {};
    var vd = ps.video || {};
    var vPrompt = vd.prompt || {};
    var ff = ps.first_frame || {};
    var lf = ps.last_frame || {};
    var _vtPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var _vtModelDefaultGenMode = (Constants.VIDEO_MODELS[_vtPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
    var genMode = vd.gen_mode || _vtModelDefaultGenMode;
    var html = '';

    // Header with done toggle
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head-row"><div>' + icon('film') + ' Video Generation</div>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-video-done" data-clip="' + clip.id + '"' + (vd.marked_done ? ' checked' : '') + '>' + (vd.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label>';
    html += '</div>';

    // Frame preview thumbnails (only for frames-to-video)
    if (genMode === 'frames-to-video') {
      var ffUrl = ff.image_url || '', lfUrl = (lf || {}).image_url || '';
      if (ffUrl || lfUrl) {
        html += '<div class="vpm-frame-preview-row">';
        if (ffUrl) html += '<div class="vpm-frame-thumb-preview"><img src="' + esc(ffUrl) + '"><span>First' + (ff.marked_done ? ' ' + icon('circle-check') : '') + '</span></div>';
        if (ffUrl && ps.requires_last_frame) html += '<span class="vpm-frame-arrow">' + icon('arrow-right') + '</span>';
        if (lfUrl) html += '<div class="vpm-frame-thumb-preview"><img src="' + esc(lfUrl) + '"><span>Last' + (lf.marked_done ? ' ' + icon('circle-check') : '') + '</span></div>';
        else if (ps.requires_last_frame && ffUrl) html += '<div class="vpm-frame-thumb-empty">' + icon('image') + '<span>Last Frame</span></div>';
        html += '</div>';
      }
    }

    // Gen mode info badge
    html += '<div class="vpm-text-xs vpm-text-muted" style="padding:4px 0">' + icon('sliders') + ' Mode: <strong>' + esc((Constants.VIDEO_GEN_MODES || {})[genMode] ? (Constants.VIDEO_GEN_MODES[genMode].label || genMode) : genMode) + '</strong></div>';
    html += '</div>';

    // Video Settings — unified model + duration
    var currentModelId = vPrompt.model || ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var mCfg = getModelDurationConfig(currentModelId);
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('gears') + ' Video Settings</div>';
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Model</label><select class="vpm-select" data-action="save-video-model" data-clip="' + clip.id + '">';
    for (var vmk in Constants.VIDEO_MODELS) html += '<option value="' + vmk + '"' + (currentModelId === vmk ? ' selected' : '') + '>' + esc(Constants.VIDEO_MODELS[vmk].label) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration <span class="vpm-text-xs vpm-text-muted">(' + mCfg.minDuration + '-' + mCfg.maxDuration + 's)</span></label>';
    html += '<input class="vpm-input" type="number" min="' + mCfg.minDuration + '" max="' + mCfg.maxDuration + '" step="1" value="' + (clip.duration || 8) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div>';
    html += '</div>';
    if (mCfg.notes) html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:4px">' + icon('info') + ' ' + esc(mCfg.notes) + '</div>';
    html += '</div>';

    // Video prompt — model-aware display
    var isSeedanceDisplay = (currentModelId === 'seedance' || vPrompt.model === 'seedance');
    html += '<div class="vpm-clip-section"><div class="vpm-clip-prompt-section"><div class="vpm-flex-between"><span class="vpm-clip-prompt-label">' + icon('wand-magic-sparkles') + ' Video Prompt</span>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-video-prompt" data-clip="' + clip.id + '">' + icon('sparkles') + ' Generate</button></div>';

    if (isSeedanceDisplay && vPrompt.seedance_prompt) {
      // Seedance 2.0: plain-text prompt in a scrollable pre block
      html += '<div class="vpm-prompt-section">';
      html += '<div class="vpm-prompt-section-label">' + icon('seedling') + ' Seedance 2.0 Prompt <span class="vpm-text-xs vpm-text-muted" style="font-weight:normal">(plain text \u2014 upload to Seedance alongside images & audio)</span></div>';
      html += '<pre class="vpm-prompt-box" style="white-space:pre-wrap;font-family:var(--vpm-font-mono,monospace);font-size:11px;line-height:1.6;max-height:420px;overflow-y:auto;padding:10px">' + esc(vPrompt.seedance_prompt) + '</pre>';
      html += '</div>';
      html += '<div class="vpm-btn-row" style="margin-top:8px">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-seedance-prompt" data-clip="' + clip.id + '">' + icon('copy') + ' Copy Prompt</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-seedance-prompt" data-clip="' + clip.id + '">' + icon('pen') + ' Edit</button>';
      html += '<span class="vpm-text-xs vpm-text-muted" style="margin-left:auto">Seedance 2.0 \u2014 ' + esc(genMode) + '</span>';
      html += '</div>';
    } else if (!isSeedanceDisplay && (vPrompt.visual_prompt || vPrompt.positive)) {
      // VEO 3.1 / other models: structured JSON field display
      html += '<div class="vpm-prompt-section">';
      html += '<div class="vpm-prompt-section-label">' + icon('eye') + ' Visual Prompt</div>';
      html += '<div class="vpm-prompt-box vpm-prompt-positive">' + esc(vPrompt.visual_prompt || vPrompt.positive || '') + '</div>';
      html += '</div>';
      if (vPrompt.motion_description || vPrompt.motion) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('person-running') + ' Motion</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.motion_description || vPrompt.motion) + '</div></div>';
      }
      if (vPrompt.camera) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('video') + ' Camera</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.camera) + '</div></div>';
      }
      if (vPrompt.style) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('palette') + ' Style</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.style) + '</div></div>';
      }
      if (vPrompt.audio && typeof vPrompt.audio === 'object') {
        html += '<div class="vpm-prompt-section vpm-prompt-audio-section"><div class="vpm-prompt-section-label">' + icon('microphone-lines') + ' Audio</div>';
        if (vPrompt.audio.speech) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Speech:</strong> ' + esc(vPrompt.audio.speech) + '</div>';
        if (vPrompt.audio.voice_description) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Voice:</strong> ' + esc(vPrompt.audio.voice_description) + '</div>';
        if (vPrompt.audio.ambient) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Ambient:</strong> ' + esc(vPrompt.audio.ambient) + '</div>';
        if (vPrompt.audio.music) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Music:</strong> ' + esc(vPrompt.audio.music) + '</div>';
        if (vPrompt.audio.sound_effects) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>SFX:</strong> ' + esc(vPrompt.audio.sound_effects) + '</div>';
        html += '</div>';
      }
      if (vPrompt.negative_prompt || vPrompt.negative) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('ban') + ' Negative</div>';
        html += '<div class="vpm-prompt-box vpm-prompt-negative">' + esc(vPrompt.negative_prompt || vPrompt.negative) + '</div></div>';
      }
      html += '<div class="vpm-btn-row" style="margin-top:8px">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-video-prompt-full" data-clip="' + clip.id + '">' + icon('copy') + ' Copy Full Prompt</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-video-prompt" data-clip="' + clip.id + '">' + icon('pen') + ' Edit</button>';
      if (vPrompt.model) html += '<span class="vpm-text-xs vpm-text-muted" style="margin-left:auto">Generated for ' + esc((Constants.VIDEO_MODELS[vPrompt.model] || {}).label || vPrompt.model) + '</span>';
      html += '</div>';
    } else {
      html += '<div class="vpm-empty-state vpm-empty-state-sm">' + icon('film');
      if (isSeedanceDisplay) html += '<p>Add ingredient images or describe the scene, then generate the Seedance 2.0 prompt</p>';
      else if (genMode === 'text-to-video') html += '<p>Generate video prompt from your clip description and script</p>';
      else if (genMode === 'ingredients-to-video') html += '<p>Add ingredient images, then generate a prompt to compose them</p>';
      else html += '<p>Generate video prompt from frame images & scene context</p>';
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function _nonAiTabPlanning(clip) {
    var nap = clip.non_ai_planning || {};
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var html = '';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-type-banner" style="border-left-color:' + (ct.color || 'var(--vpm-info)') + '">';
    html += '<div class="vpm-clip-type-banner-icon">' + icon(ct.icon || 'camera') + '</div>';
    html += '<div><strong>' + esc(ct.label || clip.type) + '</strong><div class="vpm-text-xs vpm-text-muted">Requires manual recording or creation</div></div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Script / Narration</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="script_text" rows="3" placeholder="What the narrator says in this clip\u2026">' + esc(clip.script_text || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="visual_direction" rows="2" placeholder="What to show on screen\u2026">' + esc(clip.visual_direction || '') + '</textarea></div></div>';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('clipboard-list') + ' Production Brief</div>';
    html += '<div class="vpm-form-group"><textarea class="vpm-textarea" data-action="save-nonai-field" data-clip="' + clip.id + '" data-field="brief" rows="3" placeholder="Overall brief for what to record\u2026">' + esc(nap.brief || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Step-by-Step Instructions</label>';
    html += '<textarea class="vpm-textarea vpm-textarea-mono" data-action="save-nonai-field" data-clip="' + clip.id + '" data-field="instructions" rows="4" placeholder="1. Open the app\n2. Navigate to...\n3. Click on...">' + esc(nap.instructions || '') + '</textarea></div>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-improve-brief" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI: Improve Brief</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc((nap.brief || '') + '\n\n' + (nap.instructions || '')) + '">' + icon('copy') + ' Export as Task</button></div></div>';
    return html;
  }

  function _nonAiTabCreation(clip) {
    var nap = clip.non_ai_planning || {};
    var html = '';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('upload') + ' Recording / Asset</div>';
    if (nap.recording_ref) {
      html += '<div class="vpm-recording-ref"><div class="vpm-recording-ref-url">' + icon('link') + ' ' + esc(nap.recording_ref) + '</div>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-nonai-recording" data-clip="' + clip.id + '">' + icon('xmark') + ' Remove</button></div>';
    } else {
      html += '<div class="vpm-upload-zone"><div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
      html += '<p>Upload recording or paste URL</p>';
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="paste-nonai-url" data-clip="' + clip.id + '">' + icon('link') + ' Paste URL</button></div>';
    }
    html += '</div>';
    // Duration
    html += '<div class="vpm-clip-section"><div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" min="1" max="300" value="' + (clip.duration || 15) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div></div>';
    // Status
    html += '<div class="vpm-clip-section"><div class="vpm-flex-between"><span class="vpm-clip-section-head" style="margin:0">' + icon('circle-check') + ' Completion Status</span>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-nonai-done" data-clip="' + clip.id + '"' + (nap.marked_done ? ' checked' : '') + '>' + (nap.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label></div></div>';
    return html;
  }

  function _templateTab(clip) {
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var isApplied = clip.template_id || clip.status === 'applied' || clip.status === 'customized';
    var html = '<div class="vpm-clip-section">';
    html += '<div class="vpm-template-card">';
    html += '<div class="vpm-template-card-icon" style="background:' + (ct.color || 'var(--vpm-gray-400)') + '20;color:' + (ct.color || 'var(--vpm-gray-600)') + '">' + icon(ct.icon || 'play') + '</div>';
    html += '<div class="vpm-template-card-info"><h4>' + esc(clip.title || ct.label || 'Template') + '</h4>';
    html += '<p>' + esc(ct.label || clip.type) + ' \u00B7 ' + (clip.duration || 0) + 's</p>';
    if (clip.onscreen_text) html += '<p class="vpm-text-xs">' + icon('heading') + ' "' + esc(clip.onscreen_text) + '"</p>';
    html += '</div>';
    html += '<div class="vpm-template-card-status">';
    if (isApplied) html += '<span class="vpm-template-status-applied">' + icon('circle-check') + ' Applied</span>';
    else html += '<span class="vpm-template-status-pending">' + icon('clock') + ' Pending</span>';
    html += '</div></div>';
    // Editable fields
    html += '<div class="vpm-form-group" style="margin-top:12px"><label class="vpm-form-label">On-Screen Text</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="onscreen_text" value="' + esc(clip.onscreen_text || '') + '" placeholder="Text to display\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" min="1" max="30" value="' + (clip.duration || ct.defaultDuration || 4) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 14: FRAME IMAGE PICKER (REVP pattern)
  // ============================================================

  function _renderFrameImagePicker(clip, frameKey) {
    var ps = clip.prompt_set || {};
    var frame = ps[frameKey] || {};
    var imageUrl = frame.image_url || '';
    var version = frame.version || 0;
    var gallery = (S.galleries || {}).frames || [];

    var html = '<div class="vpm-panel vpm-panel-sm vpm-frame-picker" style="margin-top:8px" data-clip="' + clip.id + '" data-frame="' + frameKey + '">';
    html += '<div class="vpm-flex-between" style="margin-bottom:8px"><h4 style="margin:0;font-size:13px">' + icon('image') + ' Frame Image</h4>';
    if (version > 0) html += '<span class="vpm-frame-version">v' + version + '</span>';
    html += '</div>';
    if (imageUrl) {
      html += '<div class="vpm-frame-preview"><img src="' + esc(imageUrl) + '"></div>';
      html += '<div class="vpm-btn-row" style="margin-top:6px"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="remove-frame-image" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('xmark') + ' Remove</button></div>';
    } else {
      html += '<div class="vpm-frame-empty">' + icon('image') + '<p>No frame image yet. Generate via AI, then upload here.</p></div>';
    }
    // Gallery thumbnails
    if (gallery.length) {
      html += '<div class="vpm-image-thumbstrip" style="margin-top:6px">';
      for (var gi = 0; gi < Math.min(gallery.length, 8); gi++) {
        var isSel = imageUrl === gallery[gi].url;
        html += '<div class="vpm-image-thumb' + (isSel ? ' vpm-image-thumb-selected' : '') + '" data-action="select-frame-image" data-clip="' + clip.id + '" data-frame="' + frameKey + '" data-gallery-idx="' + gi + '"><img src="' + esc(gallery[gi].url) + '"></div>';
      }
      html += '</div>';
    }
    // URL paste
    html += '<div style="margin-top:6px;display:flex;gap:6px;align-items:center"><span class="vpm-text-xs vpm-text-muted">or</span>';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1" data-action="save-frame-image-url" data-clip="' + clip.id + '" data-frame="' + frameKey + '" value="' + esc(imageUrl) + '" placeholder="Paste frame image URL\u2026"></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 15: PUBLISH VIEW — FULL
  // ============================================================

  function renderPublishFull() {
    var pub = S.data.publishing || {};
    var yt = pub.youtube || {};
    var thumbs = S.data.thumbnails || {};

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('share-nodes') + ' Publish</h2>';
    html += '<p class="vpm-view-subtitle">Metadata, thumbnails & export</p></div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-metadata">' + icon('sparkles') + ' AI: Generate All Metadata</button></div>';

    // --- Production Checklist ---
    html += '<div class="vpm-publish-checklist">';
    var checks = [
      ['Script finalized', S.scriptFinalized],
      ['Clips created', S.clipsReady],
      ['AI clips done', S.clipStats.totalAI > 0 ? S.clipStats.aiDone >= S.clipStats.totalAI : true],
      ['Recordings done', S.clipStats.totalNonAI > 0 ? S.clipStats.nonAiDone >= S.clipStats.totalNonAI : true],
      ['Templates applied', S.clipStats.totalTemplate > 0 ? S.clipStats.templateDone >= S.clipStats.totalTemplate : true],
      ['Metadata ready', !!(yt.title && yt.description)]
    ];
    for (var ci = 0; ci < checks.length; ci++) {
      html += '<div class="vpm-pub-check' + (checks[ci][1] ? ' vpm-pub-check-done' : '') + '">' + icon(checks[ci][1] ? 'circle-check' : 'circle') + ' ' + esc(checks[ci][0]) + '</div>';
    }
    html += '</div>';

    // --- Platform Tabs ---
    html += '<div class="vpm-inner-tabs">';
    var platforms = [['youtube','YouTube','youtube'],['instagram','Instagram','instagram'],['tiktok','TikTok','clapperboard'],['linkedin','LinkedIn','linkedin']];
    for (var pi = 0; pi < platforms.length; pi++) {
      var p = platforms[pi];
      html += '<button class="vpm-inner-tab' + (S.currentPlatformTab === p[0] ? ' vpm-inner-tab-active' : '') + '" data-action="platform-tab" data-tab="' + p[0] + '">' + icon(p[2]) + ' ' + esc(p[1]) + '</button>';
    }
    html += '</div>';

    // Platform content
    switch (S.currentPlatformTab) {
      case 'youtube':   html += _publishYouTube(pub, yt); break;
      case 'instagram': html += _publishInstagram(pub); break;
      case 'tiktok':    html += _publishTikTok(pub); break;
      case 'linkedin':  html += _publishLinkedIn(pub); break;
      default: html += _publishYouTube(pub, yt);
    }

    // --- Thumbnail Workshop ---
    html += _renderThumbnailWorkshop(thumbs);

    // --- Export ---
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('download') + ' Export</div>';
    html += '<div class="vpm-export-grid">';
    var exports = [
      ['export-json', 'file-lines', 'Production Plan', 'Full project JSON'],
      ['export-shot-list', 'clipboard-list', 'Shot List', 'All clips with timing'],
      ['export-prompts', 'wand-magic-sparkles', 'All Prompts', 'Frame + video prompts'],
      ['export-metadata', 'share-nodes', 'YouTube Metadata', 'Title, desc, tags, chapters'],
      ['export-script', 'file-lines', 'Full Script', 'All sections as text'],
      ['export-social', 'globe', 'Social Posts', 'Platform-ready posts']
    ];
    for (var ei = 0; ei < exports.length; ei++) {
      var exp = exports[ei];
      html += '<button class="vpm-export-card" data-action="' + exp[0] + '"><div class="vpm-export-card-icon">' + icon(exp[1]) + '</div><div class="vpm-export-card-label">' + esc(exp[2]) + '</div><div class="vpm-export-card-desc">' + esc(exp[3]) + '</div></button>';
    }
    html += '</div></div>';

    html += renderNavButtons('Clips', null);
    html += '</div>';
    return html;
  }

  // --- YouTube Tab ---
  function _publishYouTube(pub, yt) {
    var html = '<div class="vpm-panel">';
    // Title with AI alternatives
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
    html += '<input class="vpm-input" data-action="save-publish-field" data-path="youtube.title" value="' + esc(yt.title || '') + '" placeholder="Video title\u2026"></div>';
    var alts = yt.title_options || [];
    if (alts.length) {
      html += '<div class="vpm-pub-title-alts"><span class="vpm-text-xs vpm-text-muted">AI Alternatives:</span>';
      for (var ai = 0; ai < alts.length; ai++) {
        html += '<button class="vpm-pub-alt-btn" data-action="use-title-alt" data-idx="' + ai + '">' + esc(truncate(alts[ai], 60)) + '</button>';
      }
      html += '</div>';
    }
    // Description
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="youtube.description" rows="6" placeholder="Video description with links, timestamps, CTAs\u2026">' + esc(yt.description || '') + '</textarea></div>';
    // Tags + Hashtags
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Tags (comma separated)</label>';
    html += '<input class="vpm-input" data-action="save-publish-tags" data-platform="youtube" value="' + esc((yt.tags || []).join(', ')) + '" placeholder="AI marketing, tutorial\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="youtube" value="' + esc((yt.hashtags || []).join(' ')) + '" placeholder="#AIMarketing #Tutorial\u2026"></div>';
    html += '</div>';
    // Category + Visibility
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Category</label><select class="vpm-select" data-action="save-publish-field" data-path="youtube.category">';
    var cats = ['education','entertainment','howto','science','people','news','gaming','music','sports','travel','comedy','film','autos','pets','nonprofits'];
    for (var cai = 0; cai < cats.length; cai++) html += '<option value="' + cats[cai] + '"' + (yt.category === cats[cai] ? ' selected' : '') + '>' + esc(cats[cai].charAt(0).toUpperCase() + cats[cai].slice(1)) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visibility</label><select class="vpm-select" data-action="save-publish-field" data-path="youtube.visibility">';
    html += '<option value="public"' + (yt.visibility === 'public' ? ' selected' : '') + '>Public</option>';
    html += '<option value="unlisted"' + (yt.visibility === 'unlisted' ? ' selected' : '') + '>Unlisted</option>';
    html += '<option value="private"' + (yt.visibility === 'private' ? ' selected' : '') + '>Private</option>';
    html += '</select></div></div>';
    html += '</div>';

    // Chapters
    html += '<div class="vpm-panel"><div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin:0">' + icon('clock') + ' Chapters</span>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-chapters">' + icon('sparkles') + ' Auto-Generate</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="add-chapter">' + icon('plus') + ' Add</button></div></div>';
    var chapters = yt.chapters || [];
    if (chapters.length) {
      for (var chi = 0; chi < chapters.length; chi++) {
        var ch = chapters[chi];
        html += '<div class="vpm-chapter-row">';
        html += '<input class="vpm-input vpm-input-sm vpm-chapter-time" data-action="save-chapter" data-idx="' + chi + '" data-field="time" value="' + esc(ch.time || '') + '" placeholder="0:00">';
        html += '<input class="vpm-input vpm-input-sm vpm-chapter-label" data-action="save-chapter" data-idx="' + chi + '" data-field="label" value="' + esc(ch.label || '') + '" placeholder="Chapter name">';
        html += '<button class="vpm-btn-icon-sm" data-action="delete-chapter" data-idx="' + chi + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
        html += '</div>';
      }
    } else {
      html += '<p class="vpm-text-sm vpm-text-muted" style="text-align:center;padding:8px">No chapters yet. Auto-generate from clip sections or add manually.</p>';
    }
    html += '</div>';
    return html;
  }

  // --- Instagram Tab ---
  function _publishInstagram(pub) {
    var ig = pub.instagram || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('instagram') + ' Instagram Reels</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Caption</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="instagram.caption" rows="4" placeholder="Write an engaging caption\u2026">' + esc(ig.caption || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="instagram" value="' + esc((ig.hashtags || []).join(' ')) + '" placeholder="#reels #marketing\u2026"></div>';
    html += '</div>';
    return html;
  }

  // --- TikTok Tab ---
  function _publishTikTok(pub) {
    var tt = pub.tiktok || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('clapperboard') + ' TikTok</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Caption</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="tiktok.caption" rows="3" placeholder="Short, punchy caption\u2026">' + esc(tt.caption || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="tiktok" value="' + esc((tt.hashtags || []).join(' ')) + '" placeholder="#fyp #tutorial\u2026"></div>';
    html += '</div>';
    return html;
  }

  // --- LinkedIn Tab ---
  function _publishLinkedIn(pub) {
    var li = pub.linkedin || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('linkedin') + ' LinkedIn</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Post Text</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="linkedin.post_text" rows="6" placeholder="Professional post with context and call-to-action\u2026">' + esc(li.post_text || '') + '</textarea></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 16: THUMBNAIL WORKSHOP (3-step)
  // ============================================================

  function _renderThumbnailWorkshop(thumbs) {
    var ideas = thumbs.ideas || [];
    var chat = thumbs.chat_history || [];
    var step = S.thumbnailStep || 'ideas';

    var html = '<div class="vpm-thumb-workshop">';
    html += '<div class="vpm-thumb-header"><div class="vpm-thumb-title">' + icon('image') + ' Thumbnail Workshop</div>';
    // Step indicator
    html += '<div class="vpm-thumb-steps">';
    var steps = [['ideas','Ideas','lightbulb'],['refine','Refine','sparkles'],['finalize','Finalize','check']];
    for (var si = 0; si < steps.length; si++) {
      var s = steps[si];
      var stepState = step === s[0] ? 'active' : (steps.indexOf(steps.find(function(x){ return x[0] === step; })) > si ? 'done' : 'pending');
      if (s[0] === 'ideas' && ideas.length && step !== 'ideas') stepState = 'done';
      if (s[0] === 'refine' && step === 'finalize') stepState = 'done';
      html += '<div class="vpm-thumb-step vpm-thumb-step-' + stepState + '"><span class="vpm-thumb-step-num">' + (stepState === 'done' ? icon('check') : (si + 1)) + '</span>' + esc(s[1]) + '</div>';
    }
    html += '</div></div>';

    // Step content
    switch (step) {
      case 'ideas': html += _thumbStepIdeas(ideas); break;
      case 'refine': html += _thumbStepRefine(thumbs); break;
      case 'finalize': html += _thumbStepFinalize(thumbs); break;
      default: html += _thumbStepIdeas(ideas);
    }
    html += '</div>';
    return html;
  }

  // --- Step 1: Ideas ---
  function _thumbStepIdeas(ideas) {
    var html = '';
    if (!ideas.length) {
      html += '<div class="vpm-thumb-empty">';
      html += '<p>Generate 4 thumbnail concepts based on your video content and audience.</p>';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-thumbnail-ideas">' + icon('sparkles') + ' Generate Thumbnail Ideas</button>';
      html += '</div>';
    } else {
      html += '<div class="vpm-thumb-ideas-grid">';
      for (var i = 0; i < ideas.length; i++) {
        var idea = ideas[i];
        var isSelected = S.selectedThumbnailId === idea.id;
        html += '<div class="vpm-thumb-idea' + (isSelected ? ' vpm-thumb-idea-selected' : '') + '" data-action="select-thumbnail" data-id="' + esc(idea.id) + '">';
        // Score badge
        if (idea.score) html += '<div class="vpm-thumb-score">' + idea.score + '%</div>';
        // Visual preview area
        html += '<div class="vpm-thumb-idea-preview">' + icon('image') + '</div>';
        html += '<div class="vpm-thumb-idea-body">';
        html += '<div class="vpm-thumb-idea-title">' + esc(idea.title || 'Concept ' + (i + 1)) + '</div>';
        html += '<div class="vpm-thumb-idea-desc">' + esc(truncate(idea.desc || '', 80)) + '</div>';
        // Meta chips
        html += '<div class="vpm-thumb-idea-meta">';
        if (idea.text) html += '<span class="vpm-thumb-meta-chip">' + icon('heading') + ' ' + esc(truncate(idea.text, 20)) + '</span>';
        if (idea.mood) html += '<span class="vpm-thumb-meta-chip">' + esc(idea.mood) + '</span>';
        if (idea.layout) html += '<span class="vpm-thumb-meta-chip">' + esc(idea.layout) + '</span>';
        html += '</div>';
        html += '<div class="vpm-btn-row" style="margin-top:6px">';
        html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="develop-thumbnail" data-id="' + esc(idea.id) + '">' + icon('sparkles') + ' Develop</button>';
        html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="regenerate-thumbnail-idea" data-id="' + esc(idea.id) + '">' + icon('arrows-rotate') + '</button>';
        html += '</div></div></div>';
      }
      html += '</div>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-generate-thumbnail-ideas" style="margin-top:8px">' + icon('arrows-rotate') + ' Regenerate All</button>';
    }
    return html;
  }

  // --- Step 2: Refine with Chat ---
  function _thumbStepRefine(thumbs) {
    var ideas = thumbs.ideas || [];
    var selId = S.selectedThumbnailId;
    var selIdea = ideas.find(function(i) { return i.id === selId; });
    var chat = thumbs.chat_history || [];

    var html = '<div class="vpm-thumb-refine">';
    // Left: selected idea sidebar
    html += '<div class="vpm-thumb-refine-sidebar">';
    if (selIdea) {
      html += '<div class="vpm-thumb-refine-idea"><h4>' + esc(selIdea.title || 'Selected Concept') + '</h4>';
      html += '<p class="vpm-text-sm vpm-text-muted">' + esc(selIdea.desc || '') + '</p>';
      if (selIdea.text) html += '<div class="vpm-text-xs"><strong>Text:</strong> ' + esc(selIdea.text) + '</div>';
      if (selIdea.colors) html += '<div class="vpm-text-xs"><strong>Colors:</strong> ' + esc(selIdea.colors) + '</div>';
      if (selIdea.mood) html += '<div class="vpm-text-xs"><strong>Mood:</strong> ' + esc(selIdea.mood) + '</div>';
      if (selIdea.layout) html += '<div class="vpm-text-xs"><strong>Layout:</strong> ' + esc(selIdea.layout) + '</div>';
      html += '</div>';
    }
    // Quick suggestion chips
    html += '<div class="vpm-thumb-suggestions"><span class="vpm-text-xs vpm-text-muted">Quick suggestions:</span>';
    var suggestions = ['Make text bigger', 'Change to warm colors', 'Add urgency', 'Simpler layout', 'More contrast', 'Include face close-up'];
    for (var si = 0; si < suggestions.length; si++) {
      html += '<button class="vpm-chip vpm-chip-sm" data-action="thumb-chat-suggest" data-text="' + esc(suggestions[si]) + '">' + esc(suggestions[si]) + '</button>';
    }
    html += '</div>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-back-to-ideas">' + icon('arrow-left') + ' Back to Ideas</button>';
    html += '</div>';

    // Right: chat panel
    html += '<div class="vpm-thumb-chat">';
    html += '<div class="vpm-thumb-chat-messages" id="vpmThumbChatMessages">';
    if (!chat.length) {
      html += '<div class="vpm-thumb-chat-msg vpm-thumb-chat-system"><span class="vpm-thumb-chat-role">System</span>Selected concept: "' + esc((selIdea || {}).title || '') + '". Describe how you want to refine it.</div>';
    }
    for (var mi = 0; mi < chat.length; mi++) {
      var msg = chat[mi];
      html += '<div class="vpm-thumb-chat-msg vpm-thumb-chat-' + (msg.role || 'user') + '">';
      html += '<span class="vpm-thumb-chat-role">' + esc(msg.role === 'assistant' ? 'AI' : msg.role === 'system' ? 'System' : 'You') + '</span>';
      html += '<div class="vpm-thumb-chat-text">' + esc(msg.text || '') + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="vpm-thumb-chat-input">';
    html += '<input class="vpm-input" id="vpmThumbChatInput" placeholder="Describe refinements\u2026 e.g. Make the text bolder, use orange accent" data-action="thumb-chat-keypress">';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-chat-send">' + icon('arrow-right') + '</button>';
    html += '</div>';
    html += '<div class="vpm-btn-row" style="margin-top:8px;justify-content:flex-end"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-finalize">' + icon('check') + ' Finalize Prompt</button></div>';
    html += '</div></div>';
    return html;
  }

  // --- Step 3: Finalize ---
  function _thumbStepFinalize(thumbs) {
    var fp = thumbs.finalized_prompt;
    var selIdea = (thumbs.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
    var html = '<div class="vpm-thumb-finalize">';

    // Left: summary
    html += '<div class="vpm-thumb-final-summary">';
    html += '<h4>' + icon('check') + ' Final Concept</h4>';
    if (selIdea) {
      html += '<div class="vpm-text-sm"><strong>' + esc(selIdea.title || '') + '</strong></div>';
      html += '<p class="vpm-text-sm vpm-text-muted">' + esc(selIdea.desc || '') + '</p>';
    }
    if (fp) {
      if (fp.positive) html += '<div class="vpm-form-group"><label class="vpm-form-label">Prompt</label><div class="vpm-prompt-box">' + esc(fp.positive) + '</div></div>';
      if (fp.text_overlays && fp.text_overlays.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">Text Overlays</label>';
        for (var ti = 0; ti < fp.text_overlays.length; ti++) html += '<div class="vpm-text-sm">\u2022 ' + esc(fp.text_overlays[ti].text || '') + ' <span class="vpm-text-muted">(' + esc(fp.text_overlays[ti].position || '') + ')</span></div>';
        html += '</div>';
      }
    }
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-back-to-refine">' + icon('arrow-left') + ' Back to Refine</button>';
    html += '</div>';

    // Right: JSON output
    html += '<div class="vpm-thumb-final-json">';
    html += '<div class="vpm-flex-between vpm-mb-sm"><h4 style="margin:0">Structured Prompt (JSON)</h4>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-copy-json">' + icon('copy') + ' Copy</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-download-json">' + icon('download') + ' Download</button>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="thumb-regenerate-json">' + icon('arrows-rotate') + '</button></div></div>';
    var jsonStr = fp ? JSON.stringify(fp, null, 2) : '{ "status": "not finalized yet" }';
    html += '<div class="vpm-json-code">' + esc(jsonStr) + '</div>';
    html += '</div></div>';
    return html;
  }


  // ============================================================
  // SECTION 17: EXPORT HELPERS
  // ============================================================

  function _exportFile(name, content, type) {
    type = type || 'text/plain';
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url;
    a.download = (S.data.video.title || 'vpm-export').replace(/[^a-zA-Z0-9]/g, '-') + '-' + name;
    a.click(); URL.revokeObjectURL(url);
    // Track export
    S.data.publishing.export_history = S.data.publishing.export_history || [];
    S.data.publishing.export_history.push({ type: name, timestamp: new Date().toISOString() });
    logActivity('exported', 'Exported: ' + name);
    syncToTextarea();
    toast(name + ' exported', 'success');
  }

  function _buildScriptExport() {
    var sc = S.data.script || {};
    var v = S.data.video || {};
    var lines = ['=== ' + (v.title || 'Untitled') + ' ===', 'Words: ' + (sc.total_word_count || 0) + ' | Est: ' + formatDuration(sc.estimated_duration || 0), ''];
    var sections = sc.sections || [];
    for (var i = 0; i < sections.length; i++) {
      lines.push('--- ' + (sections[i].label || 'Section ' + (i + 1)).toUpperCase() + ' ---');
      lines.push(stripHtml(sections[i].content || ''));
      lines.push('');
    }
    return lines.join('\n');
  }

  function _buildPromptsExport() {
    var clips = S.data.clips || [];
    var lines = ['=== ALL PROMPTS ===', ''];
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      if (c.track !== 'ai' || !c.prompt_set) continue;
      var ps = c.prompt_set;
      lines.push('--- CLIP ' + c.order + ': ' + (c.title || '') + ' ---');
      var ff = ps.first_frame || {};
      if (ff.prompt && ff.prompt.positive) {
        lines.push('FIRST FRAME: ' + ff.prompt.positive);
        if (ff.prompt.negative) lines.push('  Negative: ' + ff.prompt.negative);
      }
      if (ps.last_frame && ps.last_frame.prompt && ps.last_frame.prompt.positive) {
        lines.push('LAST FRAME: ' + ps.last_frame.prompt.positive);
      }
      if (ps.video && ps.video.prompt && ps.video.prompt.positive) {
        lines.push('VIDEO: ' + ps.video.prompt.positive);
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  function _buildShotListExport() {
    var clips = S.data.clips || [];
    var lines = ['=== SHOT LIST ===', '', '# | Time | Type | Track | Dur | Title | Script'];
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      lines.push(c.order + ' | ' + formatDuration((c.timing || {}).start || 0) + ' | ' + ((Constants.CLIP_TYPES[c.type] || {}).label || c.type) + ' | ' + (c.track || '') + ' | ' + (c.duration || 0) + 's | ' + (c.title || '') + ' | ' + truncate(c.script_text || '', 50));
    }
    return lines.join('\n');
  }

  function _buildMetadataExport() {
    var yt = (S.data.publishing || {}).youtube || {};
    var lines = ['=== YOUTUBE METADATA ===', '', 'Title: ' + (yt.title || ''), '', 'Description:', yt.description || '', '', 'Tags: ' + (yt.tags || []).join(', '), 'Hashtags: ' + (yt.hashtags || []).join(' ')];
    if (yt.chapters && yt.chapters.length) {
      lines.push('', 'Chapters:');
      for (var i = 0; i < yt.chapters.length; i++) lines.push('  ' + (yt.chapters[i].time || '') + ' ' + (yt.chapters[i].label || ''));
    }
    return lines.join('\n');
  }


  // ============================================================
  // SECTION 18: ACTIVITY VIEW — FULL (date-grouped, clear, export)
  // ============================================================

  function renderActivityFull() {
    var all = S.activity || [];
    var filtered = _getFilteredActivity();
    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('clock-rotate-left') + ' Activity</h2>';
    html += '<p class="vpm-view-subtitle">' + all.length + ' entries</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-activity">' + icon('download') + ' Export</button>';
    if (all.length) html += '<button class="vpm-btn vpm-btn-danger vpm-btn-sm" data-action="clear-activity">' + icon('trash') + ' Clear</button>';
    html += '</div></div>';

    // Filters
    html += '<div class="vpm-activity-filters">';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1;max-width:280px" data-action="filter-activity" placeholder="Search activity\u2026" value="' + esc(S.activityFilter.search || '') + '">';
    html += '<select class="vpm-select vpm-select-sm" data-action="filter-activity-type"><option value="">All types</option>';
    for (var atId in Constants.ACTIVITY_TYPES) html += '<option value="' + atId + '"' + (S.activityFilter.type === atId ? ' selected' : '') + '>' + esc(Constants.ACTIVITY_TYPES[atId].label) + '</option>';
    html += '</select>';
    if (S.activityFilter.search || S.activityFilter.type) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-activity-filters">' + icon('xmark') + ' Clear Filters</button>';
      html += '<span class="vpm-text-xs vpm-text-muted">' + filtered.length + ' of ' + all.length + '</span>';
    }
    html += '</div>';

    // Empty state
    if (!filtered.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('clock-rotate-left') + '</div><h3>No Activity</h3>';
      html += '<p>' + (all.length ? 'No entries match your filters.' : 'Actions will appear here as you work.') + '</p></div>';
      html += '</div>';
      return html;
    }

    // Group by date
    var groups = _groupByDate(filtered);
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi];
      html += '<div class="vpm-activity-group">';
      html += '<div class="vpm-activity-group-head">' + esc(g.label) + ' <span class="vpm-text-xs vpm-text-muted">(' + g.items.length + ')</span></div>';
      for (var ai = 0; ai < g.items.length; ai++) {
        var act = g.items[ai];
        var at = Constants.ACTIVITY_TYPES[act.type] || { label: act.type, icon: 'circle', color: '#6b7280' };
        html += '<div class="vpm-activity-item">';
        html += '<div class="vpm-activity-icon" style="background:' + (at.color || '#6b7280') + '14;color:' + (at.color || '#6b7280') + '">' + icon(at.icon) + '</div>';
        html += '<div class="vpm-activity-body">';
        html += '<div class="vpm-activity-desc">' + esc(act.description || '') + '</div>';
        html += '<div class="vpm-activity-meta">';
        html += '<span>' + esc(formatRelativeTime(act.timestamp)) + '</span>';
        if (act.user_name) html += '<span>\u00B7 ' + esc(act.user_name) + '</span>';
        html += '<span class="vpm-activity-type-tag" style="color:' + (at.color || '#6b7280') + '">' + esc(at.label) + '</span>';
        html += '</div></div></div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function _getFilteredActivity() {
    var all = S.activity || [];
    var search = (S.activityFilter.search || '').toLowerCase();
    var typeF = S.activityFilter.type || '';
    return all.filter(function(a) {
      if (typeF && a.type !== typeF) return false;
      if (search && (a.description || '').toLowerCase().indexOf(search) === -1 && (a.type || '').toLowerCase().indexOf(search) === -1) return false;
      return true;
    });
  }

  function _groupByDate(items) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var yesterday = today - 86400000;
    var weekAgo = today - 7 * 86400000;
    var groups = { today: { label: 'Today', items: [] }, yesterday: { label: 'Yesterday', items: [] }, week: { label: 'This Week', items: [] }, older: { label: 'Older', items: [] } };
    for (var i = 0; i < items.length; i++) {
      var ts = new Date(items[i].timestamp || 0).getTime();
      if (ts >= today) groups.today.items.push(items[i]);
      else if (ts >= yesterday) groups.yesterday.items.push(items[i]);
      else if (ts >= weekAgo) groups.week.items.push(items[i]);
      else groups.older.items.push(items[i]);
    }
    var result = [];
    if (groups.today.items.length) result.push(groups.today);
    if (groups.yesterday.items.length) result.push(groups.yesterday);
    if (groups.week.items.length) result.push(groups.week);
    if (groups.older.items.length) result.push(groups.older);
    return result;
  }


  // ============================================================
  // SECTION 19: EVENT HANDLERS
  // ============================================================

  function setupPart2AEvents() {
    // --- Modal events ---
    $(document).off('click.vpm2a-mc').on('click.vpm2a-mc', '[data-action="close-modal"]', function() { closeModal(); });
    $(document).off('click.vpm2a-ms').on('click.vpm2a-ms', '[data-action="modal-save"]', function() { if (currentModal && currentModal.onSave) currentModal.onSave(); });
    $(document).off('click.vpm2a-mb').on('click.vpm2a-mb', '.vpm-modal-backdrop', function(e) { if ($(e.target).hasClass('vpm-modal-backdrop')) closeModal(); });

    // --- Keyboard shortcuts ---
    $(document).off('keydown.vpm2a-kb').on('keydown.vpm2a-kb', function(e) {
      if ($(e.target).is('input, textarea, select, [contenteditable="true"]')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
        else if (e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
      }
      // Number keys for stage navigation
      var stageOrder = getStageOrder();
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= stageOrder.length) {
        navigateToStage(stageOrder[num - 1]);
      }
    });

    // --- Start stage events ---
    // Mode toggle (with smart redirect if on a mode-specific stage)
    $(document).off('click.vpm2a-mode').on('click.vpm2a-mode', '[data-action="set-mode"]', function() {
      var mode = $(this).data('mode');
      var oldMode = S.mode;
      S.mode = mode;
      S.data.start.mode = mode;
      // If switching to Standard while on an Advanced-only stage, redirect
      if (mode === 'standard') {
        var standardStages = Constants.STAGE_ORDER_STANDARD;
        if (standardStages.indexOf(S.currentStage) === -1 && S.currentStage !== 'activity' && S.currentStage !== 'settings') {
          // Redirect to nearest available stage
          if (S.currentStage === 'research') S.currentStage = 'blueprint';
          else if (S.currentStage === 'studio') S.currentStage = 'clips';
          else S.currentStage = 'start';
        }
      }
      logActivity('mode_set', 'Mode changed: ' + oldMode + ' \u2192 ' + mode);
      _snapshotFull('Mode: ' + mode);
      buildMaps(); syncToTextarea(); render();
      toast('Mode: ' + (mode === 'standard' ? 'Standard (5 stages)' : 'Advanced (7 stages)'), 'success');
    });

    // Preference chip/card selection
    $(document).off('click.vpm2a-pref').on('click.vpm2a-pref', '[data-action="set-pref"]', function() {
      var path = $(this).data('path');
      var value = $(this).data('value');
      if (path && value !== undefined) {
        setNested(S.data.start, path, value);
        _snapshotFull('Pref: ' + path);
        syncToTextarea(); render();
      }
    });

    // Platform selection (also sets aspect ratio)
    $(document).off('click.vpm2a-plat').on('click.vpm2a-plat', '[data-action="set-platform"]', function() {
      var val = $(this).data('value');
      var platform = Constants.PLATFORMS[val];
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.platform = val;
      if (platform && platform.defaultAspect) {
        S.data.start.preferences.aspect_ratio = platform.defaultAspect;
      }
      _snapshotFull('Platform: ' + val);
      syncToTextarea(); render();
    });

    // Duration slider
    $(document).off('input.vpm2a-dur').on('input.vpm2a-dur', '[data-action="set-duration"]', function() {
      var val = parseInt($(this).val(), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      // Live update display
      var $display = $(this).closest('.vpm-dur-control');
      $display.find('.vpm-dur-value').text(val + 's');
      $display.find('.vpm-dur-human').text(formatDuration(val));
    });
    $(document).off('change.vpm2a-dur-c').on('change.vpm2a-dur-c', '[data-action="set-duration"]', function() {
      _snapshotFull('Duration: ' + $(this).val());
      syncToTextarea();
    });

    // Process idea — delegates to Part 2B AI if available
    $(document).off('click.vpm2a-proc').on('click.vpm2a-proc', '[data-action="process-idea"]', function() {
      var input = ($('#vpmStartInput').val() || '').trim();
      if (!input) { toast('Enter a video idea first', 'warning'); return; }
      // Save raw input
      S.data.start.raw_input = input;
      // Copy preferences to video
      var prefs = S.data.start.preferences || {};
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || 120;
      S.data.video.production_mode = prefs.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();
      syncToTextarea();
      // Delegate to Part 2B AI analysis if loaded
      if (window._vpmPart2B && window._vpmPart2B.analyzeIdea) {
        window._vpmPart2B.analyzeIdea('analyze-idea', '');
      } else {
        // Fallback: no AI, mark as processed directly
        S.data.start.processed = true;
        S.data.start.processed_at = new Date().toISOString();
        logActivity('idea_processed', 'Video idea submitted: ' + truncate(input, 80));
        _snapshotFull('Idea processed');
        buildMaps(); syncToTextarea(); render();
        toast('Idea saved! Continue to Blueprint.', 'success');
      }
    });

    // Reset start — FULL FACTORY RESET
    $(document).off('click.vpm2a-reset').on('click.vpm2a-reset', '[data-action="reset-start"]', function() {
      openConfirmDialog({
        title: 'Start Over — Full Reset?',
        message: 'This will clear <strong>everything</strong>: your video idea, preferences, blueprint, script, clips, studio entities, research, publishing, and thumbnails. Your <em>settings and AI preferences</em> will be preserved.\n\nThis cannot be undone.',
        danger: true,
        onConfirm: function() {
          var getDefaultData = window._vpmGetDefaultData;
          // Preserve timestamps
          var now = new Date().toISOString();
          // Full data reset
          S.data = getDefaultData();
          S.data.video.created = now;
          S.data.video.modified = now;
          // Clear entity libraries (but keep settings + aiPreferences)
          S.meta.lookLibrary = [];
          S.meta.environmentLibrary = [];
          S.meta.sceneLibrary = [];
          S.meta.studioRequirements = {};
          // Reset all state flags
          S.mode = 'standard';
          S.currentStage = 'start';
          S.currentStudioTab = 'overview';
          S.currentSettingsTab = 'general';
          S.currentPlatformTab = 'youtube';
          S.currentClipDetailTab = 'script-config';
          S.selectedClipId = null;
          S.selectedThumbnailId = '';
          S.thumbnailStep = 'ideas';
          S.clipTrackFilter = 'all';
          S.activityFilter = { search: '', type: '' };
          // Clear activity
          S.activity = [];
          logActivity('reset', 'Full factory reset \u2014 starting fresh');
          _snapshotFull('Factory reset');
          buildMaps(); syncToTextarea(); render();
          toast('Fresh start! Enter your video idea.', 'success');
        }
      });
    });

    // Save prompt text on blur (auto-save without full process)
    $(document).off('blur.vpm2a-si').on('blur.vpm2a-si', '#vpmStartInput', function() {
      S.data.start.raw_input = $(this).val() || '';
      syncToTextarea();
    });

    // --- Planner Import ---
    $(document).off('click.vpm2a-imp').on('click.vpm2a-imp', '[data-action="import-planner"]', function(e) {
      e.preventDefault();
      if (S.data.start.processed) {
        openConfirmDialog({
          title: 'Import Over Existing Data?',
          message: 'You already have an idea processed. Importing will overwrite blueprint, script, and research data. Continue?',
          danger: true,
          onConfirm: function() { _openPlannerImport(); }
        });
      } else {
        _openPlannerImport();
      }
    });

    // Clear import marker
    $(document).off('click.vpm2a-cimp').on('click.vpm2a-cimp', '[data-action="clear-import"]', function(e) {
      e.preventDefault();
      S.data.start.import_source = null;
      syncToTextarea(); render();
      toast('Import marker cleared', 'info');
    });

    // Import modal — tab switching
    $(document).off('click.vpm-imp-tab').on('click.vpm-imp-tab', '[data-action="planner-import-tab"]', function(e) {
      e.preventDefault();
      var tab = $(this).data('tab');
      $('[data-action="planner-import-tab"]').removeClass('vpm-inner-tab-active');
      $(this).addClass('vpm-inner-tab-active');
      $('[data-import-tab]').hide();
      $('[data-import-tab="' + tab + '"]').show();
    });

    // Import modal — live preview on paste/type
    $(document).off('input.vpm-imp-preview').on('input.vpm-imp-preview', '#vpmPlannerJsonInput', debounce(function() {
      var json = ($(this).val() || '').trim();
      if (!json) { $('#vpmPlannerPreview').hide(); return; }
      var parsed = parseJSON(json);
      if (!parsed) {
        $('#vpmPlannerPreview').html('<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' Invalid JSON — check syntax</div>').show();
        return;
      }
      var validation = _validatePlannerJSON(parsed);
      _renderPlannerPreview(parsed, validation);
    }, 500));

    // Import modal — upload zone click
    $(document).off('click.vpm-imp-uzone').on('click.vpm-imp-uzone', '#vpmPlannerUploadZone', function(e) {
      if ($(e.target).is('input')) return;
      $('#vpmPlannerFileInput').trigger('click');
    });

    // Import modal — file selected
    $(document).off('change.vpm-imp-file').on('change.vpm-imp-file', '#vpmPlannerFileInput', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 500000) { toast('File too large (max 500KB)', 'error'); return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        // Switch to paste tab and populate
        $('[data-import-tab="paste"]').show();
        $('[data-import-tab="upload"]').hide();
        $('[data-action="planner-import-tab"]').removeClass('vpm-inner-tab-active');
        $('[data-action="planner-import-tab"][data-tab="paste"]').addClass('vpm-inner-tab-active');
        $('#vpmPlannerJsonInput').val(text).trigger('input');
        toast('File loaded: ' + file.name, 'info');
      };
      reader.readAsText(file);
    });

    // --- Clip Type Selection ---
    $(document).off('click.vpm2a-tgct').on('click.vpm2a-tgct', '[data-action="toggle-clip-types"]', function(e) {
      e.preventDefault();
      S._clipTypesExpanded = !S._clipTypesExpanded;
      render();
    });

    $(document).off('click.vpm2a-tct').on('click.vpm2a-tct', '[data-action="toggle-clip-type"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      if (!S.data.start.selected_clip_types) S.data.start.selected_clip_types = [];
      var idx = S.data.start.selected_clip_types.indexOf(val);
      if (idx >= 0) S.data.start.selected_clip_types.splice(idx, 1);
      else S.data.start.selected_clip_types.push(val);
      syncToTextarea(); render();
    });

    $(document).off('click.vpm2a-asct').on('click.vpm2a-asct', '[data-action="auto-select-clip-types"]', function(e) {
      e.preventDefault();
      var mode = ((S.data.start || {}).preferences || {}).production_mode || 'full-ai';
      var pm = Constants.PRODUCTION_MODES[mode];
      S.data.start.selected_clip_types = pm ? (pm.recommended || []).slice() : [];
      syncToTextarea(); render();
      toast('Clip types set from ' + (pm ? pm.label : mode), 'success');
    });

    $(document).off('click.vpm2a-cct').on('click.vpm2a-cct', '[data-action="clear-clip-types"]', function(e) {
      e.preventDefault();
      S.data.start.selected_clip_types = [];
      syncToTextarea(); render();
    });

    // --- Start Step Navigation ---
    $(document).off('click.vpm2a-sgs').on('click.vpm2a-sgs', '[data-action="start-goto-step"]', function(e) {
      e.preventDefault();
      var step = $(this).data('step');
      if (step === 'review') {
        var _title = (S.data.video.title || '').trim();
        var _prefs = (S.data.start || {}).preferences || {};
        if (!_title) { toast('Video title is required before review', 'warning'); return; }
        if (!_prefs.platform && (!_prefs.platforms || !_prefs.platforms.length)) { toast('Select at least one platform', 'warning'); return; }
      }
      if (step) { S.startStep = step; render(); }
    });

    // Start Import — tab switching (inline)
    $(document).off('click.vpm2a-sit').on('click.vpm2a-sit', '[data-action="start-import-tab"]', function(e) {
      e.preventDefault();
      var tab = $(this).data('tab');
      S._startImportTab = tab;
      $('[data-action="start-import-tab"]').removeClass('vpm-inner-tab-active');
      $(this).addClass('vpm-inner-tab-active');
      $('[data-start-import-tab]').hide();
      $('[data-start-import-tab="' + tab + '"]').show();
    });

    // Start Import — inline live preview
    $(document).off('input.vpm2a-sip').on('input.vpm2a-sip', '#vpmStartImportJson', debounce(function() {
      var json = ($(this).val() || '').trim();
      var $preview = $('#vpmStartImportPreview');
      if (!json) { $preview.hide(); return; }
      var parsed = parseJSON(json);
      if (!parsed) {
        $preview.html('<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' Invalid JSON \u2014 check syntax</div>').show();
        return;
      }
      var validation = _validatePlannerJSON(parsed);
      _renderPlannerPreview(parsed, validation, '#vpmStartImportPreview');
    }, 500));

    // Start Import — upload zone
    $(document).off('click.vpm2a-suz').on('click.vpm2a-suz', '#vpmStartUploadZone', function(e) {
      if ($(e.target).is('input')) return;
      $('#vpmStartFileInput').trigger('click');
    });
    $(document).off('change.vpm2a-suf').on('change.vpm2a-suf', '#vpmStartFileInput', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 500000) { toast('File too large (max 500KB)', 'error'); return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        S._startImportTab = 'paste';
        $('[data-start-import-tab="paste"]').show();
        $('[data-start-import-tab="upload"]').hide();
        $('[data-action="start-import-tab"]').removeClass('vpm-inner-tab-active');
        $('[data-action="start-import-tab"][data-tab="paste"]').addClass('vpm-inner-tab-active');
        $('#vpmStartImportJson').val(text).trigger('input');
        toast('File loaded: ' + file.name, 'info');
      };
      reader.readAsText(file);
    });

    // Start Import — execute import inline (reuses existing _executePlannerImport but stays on start)
    $(document).off('click.vpm2a-sei').on('click.vpm2a-sei', '[data-action="start-execute-import"]', function(e) {
      e.preventDefault();
      var json = ($('#vpmStartImportJson').val() || '').trim();
      if (!json) { toast('Paste or upload JSON first', 'warning'); return; }
      var parsed = parseJSON(json);
      if (!parsed) { toast('Invalid JSON \u2014 check syntax', 'error'); return; }
      var validation = _validatePlannerJSON(parsed);
      if (!validation.valid) { toast(validation.errors[0], 'error'); return; }

      var mapped = _mapPlannerToVPM(parsed);
      var coverage = validation.coverage;
      _snapshotFull('Before planner import');

      // Apply Start
      if (!S.data.start) S.data.start = {};
      S.data.start.raw_input = mapped.start.raw_input || S.data.start.raw_input || '';
      if (!S.data.start.preferences) S.data.start.preferences = {};
      var mp = mapped.start.preferences;
      if (mp.aspect_ratio) S.data.start.preferences.aspect_ratio = mp.aspect_ratio;
      if (mp.target_duration) S.data.start.preferences.target_duration = mp.target_duration;
      if (mp.production_mode) S.data.start.preferences.production_mode = mp.production_mode;
      S.data.start.import_source = {
        type: 'video-planner', imported_at: new Date().toISOString(),
        fields_mapped: Object.keys(coverage).filter(function(k) { return coverage[k]; })
      };

      // Apply Video metadata
      var vm = mapped.video;
      if (vm.title) S.data.video.title = vm.title;
      if (vm.description) S.data.video.description = vm.description;
      if (vm.target_audience) S.data.video.target_audience = vm.target_audience;
      if (vm.tone) S.data.video.tone = vm.tone;
      if (vm.keywords && vm.keywords.length) S.data.video.keywords = vm.keywords;
      if (vm.aspect_ratio) S.data.video.aspect_ratio = vm.aspect_ratio;
      if (vm.duration_target) S.data.video.duration_target = vm.duration_target;
      var prefs = S.data.start.preferences;
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || S.data.video.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || S.data.video.duration_target || 120;
      S.data.video.production_mode = prefs.production_mode || S.data.video.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      S.data.video.audio_mode = prefs.audio_mode || 'ai-audio-with-video';
      S.data.video.voice_profile = prefs.voice_profile ? JSON.parse(JSON.stringify(prefs.voice_profile)) : null;
      S.data.video.selected_video_models = prefs.selected_video_models ? prefs.selected_video_models.slice() : [];
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();

      // Apply Blueprint
      if (mapped.blueprint && mapped.blueprint.sections.length) {
        S.data.blueprint.title = mapped.blueprint.title || S.data.blueprint.title;
        S.data.blueprint.description = mapped.blueprint.description || S.data.blueprint.description;
        S.data.blueprint.tone = mapped.blueprint.tone || S.data.blueprint.tone;
        S.data.blueprint.target_audience = mapped.blueprint.target_audience || S.data.blueprint.target_audience;
        S.data.blueprint.style_notes = mapped.blueprint.style_notes || S.data.blueprint.style_notes;
        S.data.blueprint.sections = mapped.blueprint.sections;
      }

      // Apply Script
      if (mapped.script && mapped.script.sections.length) {
        S.data.script.sections = mapped.script.sections;
        S.data.script.total_word_count = mapped.script.total_word_count;
        S.data.script.estimated_duration = mapped.script.estimated_duration;
      }

      // Apply Research
      if (mapped.research) {
        if (!S.data.research) S.data.research = {};
        if (mapped.research.audience_insights) S.data.research.audience_insights = mapped.research.audience_insights;
        if (mapped.research.content_strategy) S.data.research.content_strategy = mapped.research.content_strategy;
        if (mapped.research.competitor_analysis) S.data.research.competitor_analysis = mapped.research.competitor_analysis;
        if (mapped.research.trending_angles) S.data.research.trending_angles = mapped.research.trending_angles;
        var _anyRes = mapped.research.audience_insights || mapped.research.content_strategy || mapped.research.competitor_analysis || mapped.research.trending_angles;
        if (_anyRes) { S.data.research.generated = true; S.data.research.generated_at = S.data.research.generated_at || new Date().toISOString(); }
      }

      // Apply Clip Types
      if (mapped.clipTypes.length) S.data.start.selected_clip_types = mapped.clipTypes;

      // Auto-switch to advanced if research data
      if (coverage.hasResearch && S.mode !== 'advanced') { S.mode = 'advanced'; S.data.start.mode = 'advanced'; }

      logActivity('planner_imported', 'Imported from Video Planner: ' + truncate(mapped.video.title || 'Untitled', 50));
      _snapshotFull('After planner import');
      buildMaps(); syncToTextarea();

      // Navigate to preferences step (NOT to another stage)
      S.startStep = 'preferences';
      render();

      var importedParts = [];
      if (coverage.hasTitle) importedParts.push('title');
      if (coverage.hasSections) importedParts.push('blueprint');
      if (coverage.hasScript) importedParts.push('script');
      if (coverage.hasResearch) importedParts.push('research');
      toast('Imported: ' + importedParts.join(', ') + '. Review preferences and launch.', 'success');
    });

    // Start Launch — finalize and navigate to next stage
    $(document).off('click.vpm2a-slaunch').on('click.vpm2a-slaunch', '[data-action="start-launch"]', function(e) {
      e.preventDefault();
      var prefs = S.data.start.preferences || {};
      // Copy all preferences to video data
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || prefs.platforms[0] || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || 120;
      S.data.video.production_mode = prefs.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      S.data.video.video_style = prefs.video_style || '';
      S.data.video.audio_mode = prefs.audio_mode || 'ai-audio-with-video';
      S.data.video.voice_profile = prefs.voice_profile ? JSON.parse(JSON.stringify(prefs.voice_profile)) : null;
      S.data.video.selected_video_models = prefs.selected_video_models ? prefs.selected_video_models.slice() : [];
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();
      // Override model preferences for this project
      if (prefs.primary_video_model) S.meta.aiPreferences.videoModel = prefs.primary_video_model;
      if (prefs.primary_image_model) S.meta.aiPreferences.imageModel = prefs.primary_image_model;
      // Mark as processed
      S.data.start.processed = true;
      S.data.start.processed_at = new Date().toISOString();
      logActivity('start_launched', 'Video production launched: ' + truncate(S.data.video.title || 'Untitled', 50));
      _snapshotFull('Start launched');
      buildMaps(); syncToTextarea();
      // Navigate to appropriate stage
      var nextStage = S.mode === 'advanced' ? 'research' : 'blueprint';
      navigateToStage(nextStage);
      toast('Production started! Proceeding to ' + (Constants.APP_STAGES[nextStage] || {}).label + '.', 'success');
    });

    // Toggle Platform (multi-select)
    $(document).off('click.vpm2a-tplat').on('click.vpm2a-tplat', '[data-action="toggle-platform"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.platforms) prefs.platforms = [];
      var idx = prefs.platforms.indexOf(val);
      if (idx >= 0) {
        if (prefs.platforms.length > 1) prefs.platforms.splice(idx, 1);
        else { toast('At least one platform required', 'warning'); return; }
      } else {
        prefs.platforms.push(val);
      }
      // Set primary platform to first selected
      prefs.platform = prefs.platforms[0];
      // Auto-set aspect ratio from primary platform
      var platform = Constants.PLATFORMS[prefs.platform];
      if (platform && platform.defaultAspect) prefs.aspect_ratio = platform.defaultAspect;
      _snapshotFull('Platforms: ' + prefs.platforms.join(','));
      syncToTextarea(); render();
    });

    // Voice profile fields
    $(document).off('click.vpm2a-svp').on('click.vpm2a-svp', '[data-action="set-voice-profile"]', function(e) {
      e.preventDefault();
      var field = $(this).data('field');
      var value = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.voice_profile) prefs.voice_profile = {};
      prefs.voice_profile[field] = value;
      syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-svpt').on('blur.vpm2a-svpt', '[data-action="set-voice-profile-text"]', function() {
      var field = $(this).data('field');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.voice_profile) prefs.voice_profile = {};
      prefs.voice_profile[field] = $(this).val() || '';
      syncToTextarea();
    });

    // Video style (handled by set-pref for standard paths)

    // Duration input (number field)
    $(document).off('change.vpm2a-di').on('change.vpm2a-di', '[data-action="set-duration-input"]', function() {
      var val = Math.max(5, Math.min(600, parseInt($(this).val(), 10) || 120));
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      // Sync slider
      $(this).closest('.vpm-dur-combo').find('.vpm-dur-slider').val(val);
      $(this).closest('.vpm-dur-combo').find('.vpm-dur-human').text(formatDuration(val));
      _snapshotFull('Duration: ' + val);
      syncToTextarea();
    });

    // Duration presets
    $(document).off('click.vpm2a-dp').on('click.vpm2a-dp', '[data-action="set-duration-preset"]', function(e) {
      e.preventDefault();
      var val = parseInt($(this).data('value'), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      _snapshotFull('Duration preset: ' + val);
      syncToTextarea(); render();
    });

    // Duration slider (enhanced version)
    $(document).off('input.vpm2a-dur2').on('input.vpm2a-dur2', '.vpm-dur-combo [data-action="set-duration"]', function() {
      var val = parseInt($(this).val(), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      var $combo = $(this).closest('.vpm-dur-combo');
      $combo.find('.vpm-dur-input').val(val);
      $combo.find('.vpm-dur-human').text(formatDuration(val));
    });

    // Model selection toggles
    $(document).off('click.vpm2a-tvm').on('click.vpm2a-tvm', '[data-action="toggle-video-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.selected_video_models) prefs.selected_video_models = [];
      var idx = prefs.selected_video_models.indexOf(val);
      if (idx >= 0) prefs.selected_video_models.splice(idx, 1);
      else prefs.selected_video_models.push(val);
      // If primary was deselected, reassign
      if (prefs.primary_video_model === val && idx >= 0) {
        prefs.primary_video_model = prefs.selected_video_models[0] || '';
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-spvm').on('click.vpm2a-spvm', '[data-action="set-primary-video-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      S.data.start.preferences.primary_video_model = val;
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-tim').on('click.vpm2a-tim', '[data-action="toggle-image-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.selected_image_models) prefs.selected_image_models = [];
      var idx = prefs.selected_image_models.indexOf(val);
      if (idx >= 0) prefs.selected_image_models.splice(idx, 1);
      else prefs.selected_image_models.push(val);
      if (prefs.primary_image_model === val && idx >= 0) {
        prefs.primary_image_model = prefs.selected_image_models[0] || '';
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-spim').on('click.vpm2a-spim', '[data-action="set-primary-image-model"]', function(e) {
      e.preventDefault();
      S.data.start.preferences.primary_image_model = $(this).data('value');
      syncToTextarea(); render();
    });

    // Brand Library Selection
    $(document).off('change.vpm2a-tbr').on('change.vpm2a-tbr', '[data-action="toggle-brand-resource"]', function() {
      var entityType = $(this).data('entity-type');
      var entityId = $(this).data('entity-id');
      var isChecked = $(this).is(':checked');
      var bs = S.data.start.brand_selections = S.data.start.brand_selections || {};
      var key = 'selected_' + entityType + '_ids';
      if (!bs[key]) bs[key] = [];
      var idx = bs[key].indexOf(entityId);
      if (isChecked && idx < 0) bs[key].push(entityId);
      else if (!isChecked && idx >= 0) bs[key].splice(idx, 1);
      buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-sab').on('click.vpm2a-sab', '[data-action="select-all-brand"]', function(e) {
      e.preventDefault();
      var bs = S.data.start.brand_selections = S.data.start.brand_selections || {};
      bs.selected_look_ids = (S.brandStudio.looks || []).map(function(l) { return l.id; });
      bs.selected_environment_ids = (S.brandStudio.environments || []).map(function(e) { return e.id; });
      bs.selected_scene_ids = (S.brandStudio.scenes || []).map(function(s) { return s.id; });
      bs.selected_character_ids = (S.brandStudio.characters || []).map(function(c) { return c.id; });
      buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-cbs').on('click.vpm2a-cbs', '[data-action="clear-brand-selection"]', function(e) {
      e.preventDefault();
      S.data.start.brand_selections = { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false };
      buildMaps(); syncToTextarea(); render();
    });

    // Template clips toggle
    $(document).off('change.vpm2a-tit').on('change.vpm2a-tit', '[data-action="toggle-include-templates"]', function() {
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      prefs.include_templates = $(this).is(':checked');
      syncToTextarea(); render();
    });

    // Brand library toggle
    $(document).off('change.vpm2a-tbl').on('change.vpm2a-tbl', '[data-action="toggle-brand-library"]', function() {
      S.data.start.use_brand_library = $(this).is(':checked');
      buildMaps(); syncToTextarea(); render();
    });

    // Custom style textarea
    $(document).off('blur.vpm2a-cs').on('blur.vpm2a-cs', '[data-action="set-custom-style"]', function() {
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      prefs.custom_style_keywords = $(this).val() || '';
      syncToTextarea();
    });

    // --- Research stage events ---
    // Edit research section (modal)
    // Toggle inline research editing
    $(document).off('click.vpm2a-ers').on('click.vpm2a-ers', '[data-action="edit-research-section"]', function(e) {
      e.preventDefault();
      var section = $(this).data('section');
      var $panel = $('[data-research-section="' + section + '"]');
      if (!$panel.length) return;
      var $text = $panel.find('.vpm-research-text');
      var $edit = $panel.find('.vpm-research-inline-edit');
      if ($edit.is(':visible')) {
        // Save and switch back to display
        var newVal = $edit.val() || '';
        S.data.research = S.data.research || {};
        S.data.research[section] = newVal;
        _snapshotFull('Edit research: ' + section);
        syncToTextarea(); render();
        toast('Research section updated', 'success');
      } else {
        // Switch to edit mode
        $text.hide();
        $edit.show().focus();
        $(this).html(icon('check') + ' Save');
      }
    });
    // Save on blur for inline research edit
    $(document).off('blur.vpm2a-ire').on('blur.vpm2a-ire', '[data-action="inline-edit-research"]', function() {
      var section = $(this).data('section');
      var newVal = $(this).val() || '';
      S.data.research = S.data.research || {};
      if (S.data.research[section] !== newVal) {
        S.data.research[section] = newVal;
        syncToTextarea();
      }
    });

    // Add research source (modal)
    $(document).off('click.vpm2a-ars').on('click.vpm2a-ars', '[data-action="add-research-source"]', function(e) {
      e.preventDefault();
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">URL</label>';
      html += '<input class="vpm-input" data-field="url" placeholder="https://youtube.com/watch?v=..."></div>';
      html += '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
      html += '<input class="vpm-input" data-field="title" placeholder="Source title\u2026"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label>';
      html += '<select class="vpm-select" data-field="type"><option value="reference">Reference</option><option value="competitor">Competitor</option><option value="inspiration">Inspiration</option><option value="data">Data / Stats</option></select></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes</label>';
      html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="What\u2019s relevant about this source?"></textarea></div>';
      openModal('Add Reference Source', html, { saveLabel: 'Add', onSave: function() {
        var data = collectModalFields();
        S.data.research = S.data.research || {};
        S.data.research.sources = S.data.research.sources || [];
        S.data.research.sources.push({ url: data.url || '', title: data.title || '', type: data.type || 'reference', notes: data.notes || '' });
        _snapshotFull('Add source');
        syncToTextarea(); closeModal(); render();
        toast('Source added', 'success');
      }});
    });

    // Delete research source
    $(document).off('click.vpm2a-drs').on('click.vpm2a-drs', '[data-action="delete-research-source"]', function(e) {
      e.preventDefault();
      var idx = parseInt($(this).data('idx'), 10);
      var sources = (S.data.research || {}).sources || [];
      if (idx >= 0 && idx < sources.length) {
        sources.splice(idx, 1);
        _snapshotFull('Delete source');
        syncToTextarea(); render();
        toast('Source removed', 'success');
      }
    });

    // --- Blueprint stage events ---
    // Save blueprint field
    $(document).off('change.vpm2a-bpf blur.vpm2a-bpf').on('change.vpm2a-bpf blur.vpm2a-bpf', '[data-action="save-bp-field"]', function() {
      var path = $(this).data('path');
      var val = $(this).val();
      if (path) {
        setNested(S.data, path, val);
        _snapshotFull('Blueprint: ' + path);
        buildMaps(); syncToTextarea();
      }
    });

    // Save blueprint section field
    $(document).off('change.vpm2a-bsf blur.vpm2a-bsf').on('change.vpm2a-bsf blur.vpm2a-bsf', '[data-action="save-bp-section-field"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var field = $(this).data('field');
      var val = $(this).val();
      var sections = (S.data.blueprint || {}).sections || [];
      if (idx >= 0 && idx < sections.length && field) {
        if (field === 'duration') val = parseInt(val, 10) || 0;
        if (field === 'key_points') val = val.split('\n').filter(function(l) { return l.trim(); });
        sections[idx][field] = val;
        _snapshotFull('Section ' + (idx + 1) + ': ' + field);
        buildMaps(); syncToTextarea(); render();
      }
    });

    // Add blueprint section
    $(document).off('click.vpm2a-abs').on('click.vpm2a-abs', '[data-action="add-bp-section"]', function() {
      S.data.blueprint.sections = S.data.blueprint.sections || [];
      var order = S.data.blueprint.sections.length + 1;
      S.data.blueprint.sections.push({
        id: generateId('sec'), label: 'Section ' + order, duration: 15,
        key_points: [], visual_notes: '', order: order
      });
      logActivity('blueprint_updated', 'Added section ' + order);
      _snapshotFull('Add section');
      buildMaps(); syncToTextarea(); render();
      toast('Section added', 'success');
    });

    // Delete blueprint section
    $(document).off('click.vpm2a-dbs').on('click.vpm2a-dbs', '[data-action="delete-bp-section"]', function(e) {
      e.stopPropagation();
      var idx = parseInt($(this).data('idx'), 10);
      var sections = (S.data.blueprint || {}).sections || [];
      if (idx >= 0 && idx < sections.length) {
        var name = sections[idx].label || 'Section ' + (idx + 1);
        openConfirmDialog({
          title: 'Delete "' + name + '"?', message: 'This section will be removed from the blueprint.', danger: true,
          onConfirm: function() {
            sections.splice(idx, 1);
            // Reorder
            for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
            logActivity('blueprint_updated', 'Removed: ' + name);
            _snapshotFull('Delete section');
            buildMaps(); syncToTextarea(); render();
            toast('Section deleted', 'success');
          }
        });
      }
    });

    // Move blueprint section
    $(document).off('click.vpm2a-mbs').on('click.vpm2a-mbs', '[data-action="move-bp-section"]', function(e) {
      e.stopPropagation();
      var idx = parseInt($(this).data('idx'), 10);
      var dir = $(this).data('dir');
      var sections = (S.data.blueprint || {}).sections || [];
      if (dir === 'up' && idx > 0) {
        var temp = sections[idx]; sections[idx] = sections[idx - 1]; sections[idx - 1] = temp;
      } else if (dir === 'down' && idx < sections.length - 1) {
        var temp2 = sections[idx]; sections[idx] = sections[idx + 1]; sections[idx + 1] = temp2;
      }
      for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
      _snapshotFull('Reorder sections');
      buildMaps(); syncToTextarea(); render();
    });

    // Confirm blueprint
    $(document).off('click.vpm2a-cbp').on('click.vpm2a-cbp', '[data-action="confirm-blueprint"]', function() {
      var bp = S.data.blueprint || {};
      if (!bp.sections || bp.sections.length < 1) { toast('Add at least one section', 'warning'); return; }
      var hasDownstream = (S.data.script.sections && S.data.script.sections.length > 0) || (S.data.clips && S.data.clips.length > 0);
      var doConfirm = function() {
        bp.confirmed = true;
        bp.confirmed_at = new Date().toISOString();
        // Auto-create script sections from blueprint
        S.data.script.sections = [];
        S.data.script.total_word_count = 0;
        S.data.script.estimated_duration = 0;
        S.data.script.finalized = false;
        S.data.script.finalized_at = '';
        for (var i = 0; i < bp.sections.length; i++) {
          S.data.script.sections.push(createDefaultBodySection(i + 1, bp.sections[i].label));
        }
        // Clear clips (they were based on old script)
        S.data.clips = [];
        S.selectedClipId = null;
        // Clear publishing (based on old content)
        S.data.publishing.youtube.title = ''; S.data.publishing.youtube.description = '';
        S.data.publishing.youtube.tags = []; S.data.publishing.youtube.chapters = [];
        S.data.thumbnails = { ideas: [], selected_idea_id: '', chat_history: [], finalized_prompt: null, generated_at: '' };
        // Copy title/audience/tone to video
        if (bp.title) S.data.video.title = bp.title;
        if (bp.target_audience) S.data.video.target_audience = bp.target_audience;
        if (bp.tone) S.data.video.tone = bp.tone;
        S.data.video.modified = new Date().toISOString();
        logActivity('blueprint_completed', 'Blueprint confirmed with ' + bp.sections.length + ' sections' + (hasDownstream ? ' (downstream data cleared)' : ''));
        _snapshotFull('Confirm blueprint');
        buildMaps(); syncToTextarea(); render();
        toast('Blueprint confirmed! Script sections created.', 'success');
      };
      if (hasDownstream) {
        openConfirmDialog({
          title: 'Re-confirm Blueprint?',
          message: 'Your <strong>script</strong> (' + (S.data.script.sections || []).length + ' sections, ' + (S.data.script.total_word_count || 0) + ' words) and <strong>clips</strong> (' + (S.data.clips || []).length + ' clips) will be cleared and recreated from the new blueprint structure.\n\nPublishing metadata and thumbnails will also be reset.',
          danger: true,
          onConfirm: doConfirm
        });
      } else {
        doConfirm();
      }
    });

    // Unlock blueprint (warns about downstream impact)
    $(document).off('click.vpm2a-ubp').on('click.vpm2a-ubp', '[data-action="unlock-blueprint"]', function() {
      var hasScript = S.data.script.sections && S.data.script.sections.length > 0 && S.data.script.total_word_count > 0;
      var hasClips = S.data.clips && S.data.clips.length > 0;
      if (hasScript || hasClips) {
        openConfirmDialog({
          title: 'Unlock Blueprint?',
          message: 'Changing the blueprint structure may make your current script' + (hasClips ? ' and clips' : '') + ' out of sync. You will need to re-confirm the blueprint to regenerate script sections.',
          onConfirm: function() {
            S.data.blueprint.confirmed = false;
            S.data.blueprint.confirmed_at = '';
            _snapshotFull('Unlock blueprint');
            buildMaps(); syncToTextarea(); render();
            toast('Blueprint unlocked for editing', 'info');
          }
        });
      } else {
        S.data.blueprint.confirmed = false;
        S.data.blueprint.confirmed_at = '';
        _snapshotFull('Unlock blueprint');
        buildMaps(); syncToTextarea(); render();
        toast('Blueprint unlocked for editing', 'info');
      }
    });

    // --- Activity view events ---
    $(document).off('click.vpm2a-clact').on('click.vpm2a-clact', '[data-action="clear-activity"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Clear Activity Log?', message: 'All ' + (S.activity || []).length + ' entries will be removed.', danger: true, onConfirm: function() {
        S.activity = []; syncToTextarea(); render(); toast('Activity cleared', 'success');
      }});
    });
    $(document).off('click.vpm2a-exact').on('click.vpm2a-exact', '[data-action="export-activity"]', function(e) {
      e.preventDefault();
      var lines = ['=== ACTIVITY LOG ===', ''];
      var acts = S.activity || [];
      for (var i = 0; i < acts.length; i++) {
        var a = acts[i];
        lines.push(formatDate(a.timestamp) + ' | ' + (a.type || '') + ' | ' + (a.description || '') + (a.user_name ? ' | ' + a.user_name : ''));
      }
      if (exportFile) exportFile('activity.txt', lines.join('\n'));
      else { _copyToClipboard(lines.join('\n')); toast('Activity copied to clipboard', 'success'); }
    });
    $(document).off('click.vpm2a-claf').on('click.vpm2a-claf', '[data-action="clear-activity-filters"]', function() {
      S.activityFilter = { search: '', type: '' }; render();
    });

    // --- Publish: Platform tab ---
    $(document).off('click.vpm2a-ptab').on('click.vpm2a-ptab', '[data-action="platform-tab"]', function() {
      S.currentPlatformTab = $(this).data('tab') || 'youtube'; render();
    });

    // --- Publish: Save fields ---
    $(document).off('change.vpm2a-spf blur.vpm2a-spf').on('change.vpm2a-spf blur.vpm2a-spf', '[data-action="save-publish-field"]', function() {
      var path = $(this).data('path'); var val = $(this).val();
      if (path) { setNested(S.data.publishing, path, val); }
      buildMaps(); syncToTextarea();
    });
    $(document).off('blur.vpm2a-spt').on('blur.vpm2a-spt', '[data-action="save-publish-tags"]', function() {
      var platform = $(this).data('platform') || 'youtube';
      S.data.publishing[platform] = S.data.publishing[platform] || {};
      S.data.publishing[platform].tags = $(this).val().split(',').map(function(t) { return t.trim(); }).filter(Boolean);
      syncToTextarea();
    });
    $(document).off('blur.vpm2a-sph').on('blur.vpm2a-sph', '[data-action="save-publish-hashtags"]', function() {
      var platform = $(this).data('platform') || 'youtube';
      S.data.publishing[platform] = S.data.publishing[platform] || {};
      S.data.publishing[platform].hashtags = $(this).val().split(/[\s,]+/).filter(function(t) { return t.startsWith('#') || t.length > 0; });
      syncToTextarea();
    });
    $(document).off('click.vpm2a-uta').on('click.vpm2a-uta', '[data-action="use-title-alt"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var alts = ((S.data.publishing || {}).youtube || {}).title_options || [];
      if (idx >= 0 && idx < alts.length) {
        S.data.publishing.youtube.title = alts[idx];
        _snapshotFull('Use alt title'); syncToTextarea(); render();
      }
    });

    // --- Chapters ---
    $(document).off('click.vpm2a-addch').on('click.vpm2a-addch', '[data-action="add-chapter"]', function() {
      S.data.publishing.youtube = S.data.publishing.youtube || {};
      S.data.publishing.youtube.chapters = S.data.publishing.youtube.chapters || [];
      S.data.publishing.youtube.chapters.push({ time: '0:00', label: 'New Chapter' });
      _snapshotFull('Add chapter'); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-sch blur.vpm2a-sch').on('change.vpm2a-sch blur.vpm2a-sch', '[data-action="save-chapter"]', function() {
      var idx = parseInt($(this).data('idx'), 10); var field = $(this).data('field');
      var chapters = ((S.data.publishing || {}).youtube || {}).chapters || [];
      if (idx >= 0 && idx < chapters.length) { chapters[idx][field] = $(this).val(); syncToTextarea(); }
    });
    $(document).off('click.vpm2a-delch').on('click.vpm2a-delch', '[data-action="delete-chapter"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var chapters = ((S.data.publishing || {}).youtube || {}).chapters || [];
      if (idx >= 0 && idx < chapters.length) { chapters.splice(idx, 1); _snapshotFull('Delete chapter'); syncToTextarea(); render(); }
    });

    // --- Exports ---
    $(document).off('click.vpm2a-ej').on('click.vpm2a-ej', '[data-action="export-json"]', function(e) {
      e.preventDefault();
      var data = { data: deepClone(S.data), meta: deepClone(S.meta), exported_at: new Date().toISOString(), app: 'vpm', version: '1.0' };
      _exportFile('project.json', JSON.stringify(data, null, 2), 'application/json');
    });
    $(document).off('click.vpm2a-es').on('click.vpm2a-es', '[data-action="export-script"]', function(e) { e.preventDefault(); _exportFile('script.txt', _buildScriptExport()); });
    $(document).off('click.vpm2a-ep').on('click.vpm2a-ep', '[data-action="export-prompts"]', function(e) { e.preventDefault(); _exportFile('prompts.txt', _buildPromptsExport()); });
    $(document).off('click.vpm2a-esl2').on('click.vpm2a-esl2', '[data-action="export-shot-list"]', function(e) { e.preventDefault(); _exportFile('shot-list.txt', _buildShotListExport()); });
    $(document).off('click.vpm2a-em').on('click.vpm2a-em', '[data-action="export-metadata"]', function(e) { e.preventDefault(); _exportFile('youtube-metadata.txt', _buildMetadataExport()); });
    $(document).off('click.vpm2a-esoc').on('click.vpm2a-esoc', '[data-action="export-social"]', function(e) {
      e.preventDefault();
      var pub = S.data.publishing || {};
      var lines = ['=== SOCIAL POSTS ==='];
      if (pub.instagram && pub.instagram.caption) lines.push('', '--- INSTAGRAM ---', pub.instagram.caption, (pub.instagram.hashtags || []).join(' '));
      if (pub.tiktok && pub.tiktok.caption) lines.push('', '--- TIKTOK ---', pub.tiktok.caption, (pub.tiktok.hashtags || []).join(' '));
      if (pub.linkedin && pub.linkedin.post_text) lines.push('', '--- LINKEDIN ---', pub.linkedin.post_text);
      _exportFile('social-posts.txt', lines.join('\n'));
    });

    // --- Thumbnail Workshop events ---
    $(document).off('click.vpm2a-selth').on('click.vpm2a-selth', '[data-action="select-thumbnail"]', function() {
      S.selectedThumbnailId = $(this).data('id'); render();
    });
    $(document).off('click.vpm2a-devth').on('click.vpm2a-devth', '[data-action="develop-thumbnail"]', function() {
      S.selectedThumbnailId = $(this).data('id');
      S.thumbnailStep = 'refine';
      // Seed chat with system message
      S.data.thumbnails = S.data.thumbnails || {};
      S.data.thumbnails.chat_history = S.data.thumbnails.chat_history || [];
      if (!S.data.thumbnails.chat_history.length) {
        var idea = (S.data.thumbnails.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
        S.data.thumbnails.chat_history.push({ role: 'system', text: 'Developing concept: "' + ((idea || {}).title || '') + '". Describe how you want to refine it.', timestamp: new Date().toISOString() });
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-bti').on('click.vpm2a-bti', '[data-action="thumb-back-to-ideas"]', function() {
      S.thumbnailStep = 'ideas'; render();
    });
    $(document).off('click.vpm2a-btr').on('click.vpm2a-btr', '[data-action="thumb-back-to-refine"]', function() {
      S.thumbnailStep = 'refine'; render();
    });
    // Chat send — delegates to Part 2B AI when available
    $(document).off('click.vpm2a-tcs').on('click.vpm2a-tcs', '[data-action="thumb-chat-send"]', function() {
      var input = ($('#vpmThumbChatInput').val() || '').trim();
      if (!input) return;
      S.data.thumbnails = S.data.thumbnails || {};
      S.data.thumbnails.chat_history = S.data.thumbnails.chat_history || [];
      S.data.thumbnails.chat_history.push({ role: 'user', text: input, timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      // Delegate to Part 2B AI
      if (window._vpmPart2B && window._vpmPart2B.thumbnailChatAI) {
        window._vpmPart2B.thumbnailChatAI(input);
      } else {
        // Fallback: placeholder response
        S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'I\u2019ve noted your feedback: "' + input + '". Configure AI in Settings for real-time refinement.', timestamp: new Date().toISOString() });
        syncToTextarea(); render();
      }
      // Scroll chat to bottom
      setTimeout(function() { var $msgs = $('#vpmThumbChatMessages'); if ($msgs.length) $msgs.scrollTop($msgs[0].scrollHeight); }, 50);
    });
    // Chat suggestion chip
    $(document).off('click.vpm2a-tcsg').on('click.vpm2a-tcsg', '[data-action="thumb-chat-suggest"]', function() {
      var text = $(this).data('text') || '';
      $('#vpmThumbChatInput').val(text).focus();
    });
    // Enter to send
    $(document).off('keypress.vpm2a-tck').on('keypress.vpm2a-tck', '#vpmThumbChatInput', function(e) {
      if (e.which === 13) { e.preventDefault(); $('[data-action="thumb-chat-send"]').click(); }
    });
    // Finalize
    $(document).off('click.vpm2a-tfin').on('click.vpm2a-tfin', '[data-action="thumb-finalize"]', function() {
      var thumbs = S.data.thumbnails || {};
      var idea = (thumbs.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
      // Build structured prompt from idea + chat context
      thumbs.finalized_prompt = {
        positive: (idea ? idea.desc || '' : '') + '. Professional YouTube thumbnail.',
        negative: 'blurry, low quality, cluttered, too much text',
        style_keywords: ['professional', 'youtube-thumbnail', 'high-contrast', idea ? idea.mood || '' : ''].filter(Boolean),
        parameters: { width: 1280, height: 720, quality: 'ultra' },
        text_overlays: idea && idea.text ? [{ text: idea.text, position: 'center', font_size: 'large', color: '#ffffff', stroke: '#000000' }] : [],
        composition: idea ? idea.layout || 'rule-of-thirds' : 'rule-of-thirds',
        brand_alignment: { colors_used: idea ? idea.colors || '' : '', mood: idea ? idea.mood || '' : '' },
        metadata: { generated_at: new Date().toISOString(), source_idea: S.selectedThumbnailId, chat_turns: (thumbs.chat_history || []).length }
      };
      thumbs.generated_at = new Date().toISOString();
      S.thumbnailStep = 'finalize';
      logActivity('thumbnail_finalized', 'Thumbnail prompt finalized');
      _snapshotFull('Finalize thumbnail'); syncToTextarea(); render();
      toast('Thumbnail prompt finalized!', 'success');
    });
    // Copy/Download JSON
    $(document).off('click.vpm2a-tcj').on('click.vpm2a-tcj', '[data-action="thumb-copy-json"]', function() {
      var fp = (S.data.thumbnails || {}).finalized_prompt;
      if (fp) _copyToClipboard(JSON.stringify(fp, null, 2));
    });
    $(document).off('click.vpm2a-tdj').on('click.vpm2a-tdj', '[data-action="thumb-download-json"]', function() {
      var fp = (S.data.thumbnails || {}).finalized_prompt;
      if (fp) _exportFile('thumbnail-prompt.json', JSON.stringify(fp, null, 2), 'application/json');
    });

    // --- Clips: Track filter ---
    $(document).off('click.vpm2a-fclip').on('click.vpm2a-fclip', '[data-action="filter-clips"]', function() {
      S.clipTrackFilter = $(this).data('filter') || 'all'; render();
    });

    // --- Clips: Tab switch ---
    $(document).off('click.vpm2a-cdt').on('click.vpm2a-cdt', '[data-action="clip-detail-tab"]', function(e) {
      e.preventDefault(); S.currentClipDetailTab = $(this).data('tab'); render();
    });

    // --- Clips: Add clip modal ---
    $(document).off('click.vpm2a-acm').on('click.vpm2a-acm', '[data-action="add-clip-modal"]', function(e) {
      e.preventDefault();
      var bpSecs = (S.data.blueprint || {}).sections || [];
      var html = '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><input class="vpm-input" data-field="title" value="New Clip"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Clip Type</label><select class="vpm-select" data-field="type">';
      for (var ctk in Constants.CLIP_TYPES) html += '<option value="' + ctk + '">' + esc(Constants.CLIP_TYPES[ctk].label) + ' (' + Constants.CLIP_TYPES[ctk].track + ')</option>';
      html += '</select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Section</label><select class="vpm-select" data-field="section">';
      if (bpSecs.length) { for (var bsi = 0; bsi < bpSecs.length; bsi++) html += '<option value="' + esc(bpSecs[bsi].id) + '">' + esc(bpSecs[bsi].label) + '</option>'; }
      else { html += '<option value="body">Body</option>'; }
      html += '</select></div></div>';
      openModal('Add Clip', html, { saveLabel: 'Create Clip', onSave: function() {
        var data = collectModalFields();
        var clip = createDefaultClip(data.type || 'ai-visual', data.section || 'body');
        clip.title = data.title || 'New Clip';
        S.data.clips.push(clip); S.selectedClipId = clip.id;
        recomputeClipTimings();
        logActivity('clip_added', 'Added clip: ' + clip.title);
        _snapshotFull('Add clip'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Clip added', 'success');
      }});
    });

    // --- Clips: Edit clip modal ---
    $(document).off('click.vpm2a-ecm').on('click.vpm2a-ecm', '[data-action="edit-clip-modal"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id');
      var clip = S.clipMap[clipId]; if (!clip) return;
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><input class="vpm-input" data-field="title" value="' + esc(clip.title || '') + '"></div>';
      html += '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type">';
      for (var ctk in Constants.CLIP_TYPES) html += '<option value="' + ctk + '"' + (clip.type === ctk ? ' selected' : '') + '>' + esc(Constants.CLIP_TYPES[ctk].label) + '</option>';
      html += '</select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (s)</label><input class="vpm-input" type="number" data-field="duration" value="' + (clip.duration || 8) + '"></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label><textarea class="vpm-textarea" data-field="visual_direction" rows="2">' + esc(clip.visual_direction || '') + '</textarea></div>';
      openModal('Edit Clip #' + clip.order, html, { saveLabel: 'Update', onSave: function() {
        var data = collectModalFields();
        clip.title = data.title || clip.title;
        var newType = data.type || clip.type;
        if (newType !== clip.type) { clip.type = newType; var ct = Constants.CLIP_TYPES[newType] || {}; clip.track = ct.track || 'ai'; if (clip.track === 'ai' && !clip.prompt_set) clip.prompt_set = createEmptyPromptSet(newType); if (clip.track === 'non-ai' && !clip.non_ai_planning) clip.non_ai_planning = createDefaultNonAiPlanning(); }
        clip.duration = parseInt(data.duration, 10) || clip.duration;
        clip.visual_direction = data.visual_direction || '';
        recomputeClipTimings(); maybeAdvanceClipStatus(clip, 'edited');
        _snapshotFull('Edit clip'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Clip updated', 'success');
      }});
    });

    // --- Clips: Delete / Duplicate / Move ---
    $(document).off('click.vpm2a-delc').on('click.vpm2a-delc', '[data-action="delete-clip"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clip = S.clipMap[clipId]; if (!clip) return;
      openConfirmDialog({ title: 'Delete "' + (clip.title || 'Untitled') + '"?', message: 'This removes the clip and all its data.', danger: true, onConfirm: function() {
        S.data.clips = S.data.clips.filter(function(c) { return c.id !== clipId; });
        if (S.selectedClipId === clipId) S.selectedClipId = S.data.clips.length > 0 ? S.data.clips[0].id : null;
        recomputeClipTimings();
        logActivity('clip_removed', 'Deleted: ' + (clip.title || ''));
        _snapshotFull('Delete clip'); buildMaps(); syncToTextarea(); render(); toast('Clip deleted', 'success');
      }});
    });
    $(document).off('click.vpm2a-dupc').on('click.vpm2a-dupc', '[data-action="duplicate-clip"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clip = S.clipMap[clipId]; if (!clip) return;
      var clone = deepClone(clip); clone.id = generateId('clip'); clone.title += ' (copy)';
      clone.status = (clone.track === 'ai') ? 'draft' : (clone.track === 'non-ai') ? 'planned' : 'pending';
      S.data.clips.push(clone); S.selectedClipId = clone.id;
      recomputeClipTimings();
      _snapshotFull('Duplicate clip'); buildMaps(); syncToTextarea(); render(); toast('Clip duplicated', 'success');
    });
    $(document).off('click.vpm2a-mcup').on('click.vpm2a-mcup', '[data-action="move-clip-up"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clips = S.data.clips || [];
      var idx = clips.findIndex(function(c) { return c.id === clipId; }); if (idx <= 0) return;
      var tmp = clips[idx]; clips[idx] = clips[idx-1]; clips[idx-1] = tmp;
      recomputeClipTimings(); _snapshotFull('Move clip up'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-mcdn').on('click.vpm2a-mcdn', '[data-action="move-clip-down"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clips = S.data.clips || [];
      var idx = clips.findIndex(function(c) { return c.id === clipId; }); if (idx < 0 || idx >= clips.length - 1) return;
      var tmp = clips[idx]; clips[idx] = clips[idx+1]; clips[idx+1] = tmp;
      recomputeClipTimings(); _snapshotFull('Move clip down'); buildMaps(); syncToTextarea(); render();
    });

    // --- Clips: Save fields ---
    $(document).off('change.vpm2a-scf blur.vpm2a-scf').on('change.vpm2a-scf blur.vpm2a-scf', '[data-action="save-clip-field"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field'); var val = $(this).val();
      var clip = S.clipMap[clipId]; if (!clip) return;
      if (field === 'duration') {
        var dur = parseInt(val, 10) || 8;
        var ct = Constants.CLIP_TYPES[clip.type] || {};
        var stg = (S.meta && S.meta.settings) || {};
        if (ct.track === 'ai' && stg.snap_to_model_durations) {
          var mId = ((S.meta.aiPreferences || {}).videoModel || '');
          dur = snapToModelDuration(dur, mId);
        }
        clip.duration = dur; recomputeClipTimings();
      } else { clip[field] = val; }
      maybeAdvanceClipStatus(clip, 'field'); syncToTextarea();
    });
    $(document).off('change.vpm2a-scc').on('change.vpm2a-scc', '[data-action="save-clip-config"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field');
      var clip = S.clipMap[clipId]; if (!clip) return;
      clip.production_config = clip.production_config || {}; clip.production_config[field] = $(this).val();
      syncToTextarea();
    });
    $(document).off('change.vpm2a-svm').on('change.vpm2a-svm', '[data-action="save-video-model"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {}; clip.prompt_set.video.prompt = clip.prompt_set.video.prompt || {};
      clip.prompt_set.video.prompt.model = $(this).val(); syncToTextarea(); render();
    });
    // Video generation mode selector
    $(document).off('click.vpm2a-svgm').on('click.vpm2a-svgm', '[data-action="set-video-gen-mode"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var val = $(this).data('value');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.gen_mode = val;
      // Auto-switch tab if on a frame tab that will be hidden
      if (val !== 'frames-to-video' && (S.currentClipDetailTab === 'first-frame' || S.currentClipDetailTab === 'last-frame')) {
        S.currentClipDetailTab = 'script-config';
      }
      syncToTextarea(); render();
    });
    // Copy Seedance 2.0 plain-text prompt
    $(document).off('click.vpm2a-csp').on('click.vpm2a-csp', '[data-action="copy-seedance-prompt"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var sp = ((clip.prompt_set.video || {}).prompt || {}).seedance_prompt || '';
      if (!sp) { toast('No Seedance prompt to copy', 'warning'); return; }
      if (navigator.clipboard) { navigator.clipboard.writeText(sp).then(function() { toast('Seedance prompt copied', 'success'); }); }
      else toast('Copy not available', 'warning');
    });
    // Edit Seedance 2.0 plain-text prompt
    $(document).off('click.vpm2a-esp').on('click.vpm2a-esp', '[data-action="edit-seedance-prompt"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vp = ((clip.prompt_set.video || {}).prompt || {});
      var mHtml = '<div class="vpm-form-group"><label class="vpm-form-label">Seedance 2.0 Prompt (plain text)</label>';
      mHtml += '<textarea class="vpm-textarea" data-field="seedance_prompt" rows="22" style="font-family:var(--vpm-font-mono,monospace);font-size:11px;line-height:1.6">' + esc(vp.seedance_prompt || '') + '</textarea></div>';
      openModal('Edit Seedance 2.0 Prompt', mHtml, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields();
        vp.seedance_prompt = data.seedance_prompt || '';
        vp.status = 'edited';
        syncToTextarea(); closeModal(); render();
      }});
    });
    // Copy full structured video prompt as JSON
    $(document).off('click.vpm2a-cvpf').on('click.vpm2a-cvpf', '[data-action="copy-video-prompt-full"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vp = ((clip.prompt_set.video || {}).prompt || {});
      var fullPrompt = {};
      if (vp.visual_prompt) fullPrompt.visual_prompt = vp.visual_prompt;
      else if (vp.positive) fullPrompt.visual_prompt = vp.positive;
      if (vp.motion_description) fullPrompt.motion_description = vp.motion_description;
      if (vp.camera) fullPrompt.camera = vp.camera;
      if (vp.style) fullPrompt.style = vp.style;
      if (vp.negative_prompt) fullPrompt.negative_prompt = vp.negative_prompt;
      if (vp.duration) fullPrompt.duration = vp.duration;
      if (vp.audio) fullPrompt.audio = vp.audio;
      var text = JSON.stringify(fullPrompt, null, 2);
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { toast('Full prompt copied', 'success'); }); }
      else toast('Copy not available', 'warning');
    });
    // Add ingredient for ingredients-to-video mode
    $(document).off('click.vpm2a-aing').on('click.vpm2a-aing', '[data-action="add-ingredient"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip');
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Label</label><input class="vpm-input" data-field="label" placeholder="e.g. Main Character, Office Background, Laptop"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type"><option value="character">Character</option><option value="environment">Environment</option><option value="object">Object</option></select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label><textarea class="vpm-textarea" data-field="description" rows="2" placeholder="Describe this ingredient..."></textarea></div>';
      openModal('Add Ingredient', html, { saveLabel: 'Add', onSave: function() {
        var data = collectModalFields();
        var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
        clip.prompt_set.video = clip.prompt_set.video || {};
        if (!clip.prompt_set.video.ingredients) clip.prompt_set.video.ingredients = [];
        clip.prompt_set.video.ingredients.push({ label: data.label || '', type: data.type || 'object', description: data.description || '' });
        syncToTextarea(); closeModal(); render();
      }});
    });
    $(document).off('click.vpm2a-ring').on('click.vpm2a-ring', '[data-action="remove-ingredient"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var idx = $(this).data('idx');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var ings = ((clip.prompt_set.video || {}).ingredients || []);
      if (idx >= 0 && idx < ings.length) { ings.splice(idx, 1); syncToTextarea(); render(); }
    });
    $(document).off('change.vpm2a-scs').on('change.vpm2a-scs', '[data-action="save-clip-scene"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var sceneId = $(this).val();
      clip.prompt_set.first_frame.scene.scene_template_id = sceneId;
      // Also populate look_ids and environment_id from the scene template
      if (sceneId && S.sceneMap[sceneId]) {
        var sc = S.sceneMap[sceneId];
        clip.prompt_set.first_frame.scene.look_ids = (sc.look_ids || []).slice();
        clip.prompt_set.first_frame.scene.environment_id = sc.environment_id || '';
      }
      maybeAdvanceClipStatus(clip, 'scene set');
      logActivity('scene_assigned', 'Scene assigned to clip #' + clip.order);
      syncToTextarea(); render();
    });
    // Direct look selection
    // Card-based look assignment (for ai-character clips)
    $(document).off('click.vpm2a-acl').on('click.vpm2a-acl', '[data-action="assign-clip-look"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var lookId = $(this).data('look');
      var clip = S.clipMap[clipId]; if (!clip) return;
      ensurePromptSet(clip);
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var scene = clip.prompt_set.first_frame.scene;
      if (scene.look_ids && scene.look_ids.indexOf(lookId) >= 0) {
        scene.look_ids = []; // Toggle off
      } else {
        scene.look_ids = [lookId]; // Assign
      }
      scene.scene_template_id = '';
      maybeAdvanceClipStatus(clip, 'character assigned');
      syncToTextarea(); render();
    });
    // Dropdown-based look selection (for generic use)
    $(document).off('change.vpm2a-scl').on('change.vpm2a-scl', '[data-action="save-clip-look"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var lookId = $(this).val();
      clip.prompt_set.first_frame.scene.look_ids = lookId ? [lookId] : [];
      clip.prompt_set.first_frame.scene.scene_template_id = ''; // Clear template — user overriding manually
      maybeAdvanceClipStatus(clip, 'look set');
      syncToTextarea(); render();
    });
    // Direct environment selection
    $(document).off('change.vpm2a-sce').on('change.vpm2a-sce', '[data-action="save-clip-environment"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      clip.prompt_set.first_frame.scene.environment_id = $(this).val() || '';
      clip.prompt_set.first_frame.scene.scene_template_id = ''; // Clear template — user overriding manually
      maybeAdvanceClipStatus(clip, 'environment set');
      syncToTextarea(); render();
    });
    // Seedance character look (saves to ps.video.seedance_assets.character_look_id)
    $(document).off('change.vpm2a-ssl').on('change.vpm2a-ssl', '[data-action="save-seedance-look"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.seedance_assets = clip.prompt_set.video.seedance_assets || {};
      clip.prompt_set.video.seedance_assets.character_look_id = $(this).val() || '';
      maybeAdvanceClipStatus(clip, 'seedance look set');
      syncToTextarea(); render();
    });
    // Seedance environment slots (saves to ps.video.seedance_assets.env_ids[idx])
    $(document).off('change.vpm2a-sse').on('change.vpm2a-sse', '[data-action="save-seedance-env"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var idx = parseInt($(this).data('idx')) || 0;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.seedance_assets = clip.prompt_set.video.seedance_assets || {};
      clip.prompt_set.video.seedance_assets.env_ids = clip.prompt_set.video.seedance_assets.env_ids || ['', '', ''];
      clip.prompt_set.video.seedance_assets.env_ids[idx] = $(this).val() || '';
      maybeAdvanceClipStatus(clip, 'seedance env set');
      syncToTextarea(); render();
    });

    // --- Frame/Video done toggles ---
    $(document).off('change.vpm2a-tfd').on('change.vpm2a-tfd', '[data-action="toggle-frame-done"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      frame.marked_done = $(this).is(':checked'); frame.done_at = frame.marked_done ? new Date().toISOString() : null;
      maybeAdvanceClipStatus(clip, 'frame toggled');
      logActivity('frame_marked_done', 'Clip ' + clip.order + ': ' + (frameKey === 'first_frame' ? 'First' : 'Last') + ' frame ' + (frame.marked_done ? 'done' : 'undone'));
      _snapshotFull('Toggle frame'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-tvd').on('change.vpm2a-tvd', '[data-action="toggle-video-done"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.marked_done = $(this).is(':checked');
      maybeAdvanceClipStatus(clip, 'video toggled');
      _snapshotFull('Toggle video'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-tnd').on('change.vpm2a-tnd', '[data-action="toggle-nonai-done"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {};
      clip.non_ai_planning.marked_done = $(this).is(':checked');
      maybeAdvanceClipStatus(clip, 'non-ai done');
      _snapshotFull('Toggle non-ai done'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-snf').on('blur.vpm2a-snf', '[data-action="save-nonai-field"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field');
      var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning[field] = $(this).val();
      maybeAdvanceClipStatus(clip, 'non-ai field'); syncToTextarea();
    });
    $(document).off('click.vpm2a-cnr').on('click.vpm2a-cnr', '[data-action="clear-nonai-recording"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning.recording_ref = '';
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-pnr').on('click.vpm2a-pnr', '[data-action="paste-nonai-url"]', function() {
      var clipId = $(this).data('clip');
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Recording URL</label><input class="vpm-input" data-field="url" placeholder="https://drive.google.com/..."></div>';
      openModal('Paste Recording URL', html, { saveLabel: 'Save', size: 'sm', onSave: function() {
        var data = collectModalFields();
        var clip = S.clipMap[clipId]; if (!clip) return;
        clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning.recording_ref = data.url || '';
        maybeAdvanceClipStatus(clip, 'recording added');
        closeModal(); syncToTextarea(); render(); toast('Recording URL saved', 'success');
      }});
    });

    // --- Frame image picker events ---
    $(document).off('click.vpm2a-sfimg').on('click.vpm2a-sfimg', '[data-action="select-frame-image"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var gIdx = parseInt($(this).data('gallery-idx'), 10);
      var gallery = (S.galleries || {}).frames || [];
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      if (gIdx >= 0 && gIdx < gallery.length) {
        frame.image_url = gallery[gIdx].url; frame.version = (frame.version || 0) + 1;
        logActivity('frame_image_set', 'Clip ' + clip.order + ': frame image set');
        syncToTextarea(); render();
      }
    });
    $(document).off('click.vpm2a-rfimg').on('click.vpm2a-rfimg', '[data-action="remove-frame-image"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      frame.image_url = ''; syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-sfurl').on('blur.vpm2a-sfurl', '[data-action="save-frame-image-url"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      var url = ($(this).val() || '').trim();
      if (url !== frame.image_url) { frame.image_url = url; frame.version = (frame.version || 0) + 1; syncToTextarea(); }
    });

    // --- Edit frame/video prompts ---
    $(document).off('click.vpm2a-efp').on('click.vpm2a-efp', '[data-action="edit-frame-prompt"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      var prompt = frame.prompt || {};
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Positive Prompt</label><textarea class="vpm-textarea" data-field="positive" rows="4">' + esc(prompt.positive || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Negative Prompt</label><textarea class="vpm-textarea" data-field="negative" rows="2">' + esc(prompt.negative || '') + '</textarea></div>';
      openModal('Edit ' + (frameKey === 'first_frame' ? 'First' : 'Last') + ' Frame Prompt', html, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields(); prompt.positive = data.positive || ''; prompt.negative = data.negative || '';
        prompt.status = prompt.positive ? 'generated' : 'empty'; frame.prompt = prompt;
        maybeAdvanceClipStatus(clip, 'prompt edited');
        _snapshotFull('Edit frame prompt'); syncToTextarea(); closeModal(); render();
      }});
    });
    $(document).off('click.vpm2a-evp').on('click.vpm2a-evp', '[data-action="edit-video-prompt"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vd = clip.prompt_set.video || {}; var prompt = vd.prompt || {};
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Motion / Video Prompt</label><textarea class="vpm-textarea" data-field="positive" rows="4">' + esc(prompt.positive || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Negative</label><textarea class="vpm-textarea" data-field="negative" rows="2">' + esc(prompt.negative || '') + '</textarea></div>';
      openModal('Edit Video Prompt', html, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields(); prompt.positive = data.positive || ''; prompt.negative = data.negative || '';
        prompt.status = prompt.positive ? 'generated' : 'empty'; vd.prompt = prompt; clip.prompt_set.video = vd;
        maybeAdvanceClipStatus(clip, 'video prompt edited');
        _snapshotFull('Edit video prompt'); syncToTextarea(); closeModal(); render();
      }});
    });

    // --- Studio tab switching ---
    $(document).off('click.vpm2a-stab').on('click.vpm2a-stab', '[data-action="studio-tab"]', function() {
      S.currentStudioTab = $(this).data('tab') || 'overview';
      render();
    });

    // --- Entity CRUD ---
    $(document).off('click.vpm2a-addlk').on('click.vpm2a-addlk', '[data-action="add-look"]', function() { _openLookEditModal(-1, null); });
    $(document).off('click.vpm2a-addenv').on('click.vpm2a-addenv', '[data-action="add-environment"]', function() { _openEnvironmentEditModal(-1, null); });
    $(document).off('click.vpm2a-addsc').on('click.vpm2a-addsc', '[data-action="add-scene"]', function() { _openSceneEditModal(-1, null); });

    $(document).off('click.vpm2a-edent').on('click.vpm2a-edent', '[data-action="edit-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var lib = _getEntityLib(type); if (!lib || idx < 0 || idx >= lib.length) return;
      if (type === 'look') _openLookEditModal(idx, lib[idx]);
      else if (type === 'environment') _openEnvironmentEditModal(idx, lib[idx]);
    });
    $(document).off('click.vpm2a-edsc').on('click.vpm2a-edsc', '[data-action="edit-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var lib = S.meta.sceneLibrary || []; if (idx < 0 || idx >= lib.length) return;
      _openSceneEditModal(idx, lib[idx]);
    });

    $(document).off('click.vpm2a-delent').on('click.vpm2a-delent', '[data-action="delete-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var lib = _getEntityLib(type); if (!lib || idx < 0 || idx >= lib.length) return;
      var name = lib[idx].name || 'Unnamed';
      openConfirmDialog({ title: 'Delete "' + name + '"?', message: 'This ' + type + ' will be permanently removed.', danger: true, onConfirm: function() {
        lib.splice(idx, 1);
        _snapshotFull('Delete ' + type); buildMaps(); syncToTextarea(); render(); toast(type + ' deleted', 'success');
      }});
    });
    $(document).off('click.vpm2a-delsc').on('click.vpm2a-delsc', '[data-action="delete-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var lib = S.meta.sceneLibrary || []; if (idx < 0 || idx >= lib.length) return;
      var name = lib[idx].name || 'Unnamed';
      openConfirmDialog({ title: 'Delete "' + name + '"?', message: 'This scene will be removed. Any clips using it will have their scene reference cleared.', danger: true, onConfirm: function() {
        // Clean up clip references to this scene
        var deletedId = lib[idx].id;
        var allClips = S.data.clips || [];
        for (var ci = 0; ci < allClips.length; ci++) {
          var cps = ((allClips[ci].prompt_set || {}).first_frame || {}).scene;
          if (cps && cps.scene_template_id === deletedId) { cps.scene_template_id = ''; }
        }
        lib.splice(idx, 1);
        _snapshotFull('Delete scene'); buildMaps(); syncToTextarea(); render(); toast('Scene deleted', 'success');
      }});
    });

    // Copy brand entity to video
    $(document).off('click.vpm2a-cpbe').on('click.vpm2a-cpbe', '[data-action="copy-brand-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var brandArr = (type === 'look') ? (S.brandStudio.looks || []) : (type === 'environment') ? (S.brandStudio.environments || []) : [];
      if (idx < 0 || idx >= brandArr.length) return;
      var copy = deepClone(brandArr[idx]);
      copy.id = generateId(type === 'look' ? 'look' : 'env');
      copy.source = 'video'; copy.name = copy.name + ' (Copy)'; copy.modified = new Date().toISOString();
      var lib = _getEntityLib(type);
      if (lib) { lib.push(copy); _snapshotFull('Copy brand ' + type); buildMaps(); syncToTextarea(); render(); toast(type + ' copied to video', 'success'); }
    });
    $(document).off('click.vpm2a-cpbs').on('click.vpm2a-cpbs', '[data-action="copy-brand-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var brandScenes = S.brandStudio.scenes || [];
      if (idx < 0 || idx >= brandScenes.length) return;
      var copy = deepClone(brandScenes[idx]);
      copy.id = generateId('scene'); copy.source = 'video'; copy.name = copy.name + ' (Copy)'; copy.modified = new Date().toISOString();
      S.meta.sceneLibrary = S.meta.sceneLibrary || []; S.meta.sceneLibrary.push(copy);
      _snapshotFull('Copy brand scene'); buildMaps(); syncToTextarea(); render(); toast('Scene copied to video', 'success');
    });

    // Image picker events
    $(document).off('click.vpm2a-selimg').on('click.vpm2a-selimg', '[data-action="select-entity-image"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var gIdx = parseInt($(this).data('gallery-idx'), 10);
      var galType = $(this).data('gallery-type');
      var gallery = (S.galleries || {})[galType] || [];
      if (gIdx >= 0 && gIdx < gallery.length) _setEntityImage(type, idx, gallery[gIdx].url, gallery[gIdx].fid);
    });
    $(document).off('click.vpm2a-rmimg').on('click.vpm2a-rmimg', '[data-action="remove-entity-image"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      _setEntityImage(type, idx, '', '');
    });
    $(document).off('blur.vpm2a-imgurl').on('blur.vpm2a-imgurl', '[data-action="save-entity-image-url"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var url = ($(this).val() || '').trim();
      _setEntityImage(type, idx, url, '');
    });
    $(document).off('click.vpm2a-uplimg').on('click.vpm2a-uplimg', '[data-action="upload-entity-image"]', function() {
      var galType = $(this).data('gallery-type');
      var entType = $(this).data('entity-type'); var entIdx = $(this).data('entity-idx');
      var $fileInput = $('<input type="file" accept="image/*" style="display:none">');
      $('body').append($fileInput);
      S._imageUploadContext = { entityType: entType, entityIdx: parseInt(entIdx, 10), galleryType: galType };
      $fileInput.trigger('click');
      $fileInput.on('change', function() {
        var file = this.files && this.files[0];
        if (file && S._imageUploadContext) { queueGalleryUpload(S._imageUploadContext.galleryType, file, S._imageUploadContext); }
        $(this).remove();
      });
    });

    // Reload brand library
    $(document).off('click.vpm2a-rbl').on('click.vpm2a-rbl', '[data-action="reload-brand-library"]', function() {
      window._vpmParseBrandStudioLibrary();
      buildMaps(); render(); toast('Brand library reloaded', 'success');
    });

    // --- Script stage events ---
    // Add script section
    $(document).off('click.vpm2a-addss').on('click.vpm2a-addss', '[data-action="add-script-section"]', function(e) {
      e.preventDefault();
      var sections = S.data.script.sections = S.data.script.sections || [];
      var newSec = createDefaultBodySection(sections.length + 1, 'New Section');
      sections.push(newSec);
      recomputeScriptDurations();
      logActivity('script_edited', 'Added script section: ' + newSec.label);
      _snapshotFull('Add script section'); buildMaps(); syncToTextarea(); render();
      toast('Section added', 'success');
    });

    // Remove script section
    $(document).off('click.vpm2a-rmss').on('click.vpm2a-rmss', '[data-action="remove-script-section"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var sec = sections.find(function(s) { return s.id === secId; });
      var name = sec ? sec.label : 'section';
      openConfirmDialog({
        title: 'Delete "' + name + '"?', message: 'This section and its content will be removed.', danger: true,
        onConfirm: function() {
          _destroySectionEditor(secId);
          S.data.script.sections = sections.filter(function(s) { return s.id !== secId; });
          // Re-order
          for (var i = 0; i < S.data.script.sections.length; i++) S.data.script.sections[i].order = i + 1;
          recomputeScriptDurations();
          logActivity('script_edited', 'Removed section: ' + name);
          _snapshotFull('Remove section'); buildMaps(); syncToTextarea(); render();
          toast('Section removed', 'success');
        }
      });
    });

    // Move script section up/down
    $(document).off('click.vpm2a-mssup').on('click.vpm2a-mssup', '[data-action="move-script-section-up"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var idx = sections.findIndex(function(s) { return s.id === secId; });
      if (idx > 0) {
        _destroyAllEditors();
        var temp = sections[idx]; sections[idx] = sections[idx - 1]; sections[idx - 1] = temp;
        for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
        _snapshotFull('Move section up'); buildMaps(); syncToTextarea(); render();
      }
    });
    $(document).off('click.vpm2a-mssdn').on('click.vpm2a-mssdn', '[data-action="move-script-section-down"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var idx = sections.findIndex(function(s) { return s.id === secId; });
      if (idx >= 0 && idx < sections.length - 1) {
        _destroyAllEditors();
        var temp = sections[idx]; sections[idx] = sections[idx + 1]; sections[idx + 1] = temp;
        for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
        _snapshotFull('Move section down'); buildMaps(); syncToTextarea(); render();
      }
    });

    // Rename script section label
    $(document).off('click.vpm2a-esl').on('click.vpm2a-esl', '[data-action="edit-section-label"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var sec = sections.find(function(s) { return s.id === secId; });
      if (!sec) return;
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Section Label</label>';
      html += '<input class="vpm-input" data-field="label" value="' + esc(sec.label || '') + '" autofocus></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes (optional)</label>';
      html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="Instructions or context for this section\u2026">' + esc(sec.notes || '') + '</textarea></div>';
      openModal('Edit Section', html, { saveLabel: 'Update', size: 'sm', onSave: function() {
        var data = collectModalFields();
        sec.label = data.label || sec.label;
        sec.notes = data.notes || '';
        _snapshotFull('Rename section'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Section updated', 'success');
      }});
    });

    // Finalize script
    $(document).off('click.vpm2a-fscr').on('click.vpm2a-fscr', '[data-action="finalize-script"]', function(e) {
      e.preventDefault();
      _flushAllEditors();
      recomputeScriptDurations();
      var sc = S.data.script;
      if (!sc.total_word_count) { toast('Script is empty \u2014 add content first', 'warning'); return; }
      // Save version
      sc.versions = sc.versions || [];
      sc.versions.push({
        id: generateId('ver'),
        timestamp: new Date().toISOString(),
        label: 'v' + (sc.versions.length + 1) + ' \u2014 Finalized',
        total_word_count: sc.total_word_count || 0,
        snapshot: deepClone(sc.sections)
      });
      sc.finalized = true;
      sc.finalized_at = new Date().toISOString();
      _destroyAllEditors();
      logActivity('script_finalized', 'Script finalized (' + (sc.total_word_count || 0) + ' words, ' + (sc.sections || []).length + ' sections)');
      _snapshotFull('Finalize script'); buildMaps(); syncToTextarea(); render();
      toast('Script finalized!', 'success');
    });

    // Unlock script
    $(document).off('click.vpm2a-uscr').on('click.vpm2a-uscr', '[data-action="unlock-script"]', function(e) {
      e.preventDefault();
      _destroyAllEditors();
      S.data.script.finalized = false;
      logActivity('script_unlocked', 'Script unlocked for editing');
      _snapshotFull('Unlock script'); buildMaps(); syncToTextarea(); render();
      toast('Script unlocked', 'info');
    });

    // Script version history
    $(document).off('click.vpm2a-svh').on('click.vpm2a-svh', '[data-action="show-script-versions"]', function(e) {
      e.preventDefault();
      var versions = (S.data.script || {}).versions || [];
      if (!versions.length) { toast('No versions saved yet', 'info'); return; }
      var html = '<div class="vpm-version-list">';
      for (var i = versions.length - 1; i >= 0; i--) {
        var ver = versions[i];
        var isCurrent = (i === versions.length - 1);
        html += '<div class="vpm-version-item' + (isCurrent ? ' vpm-version-current' : '') + '">';
        html += '<div class="vpm-flex-between"><div>';
        html += '<strong class="vpm-text-sm">' + esc(ver.label || 'Version ' + (i + 1)) + '</strong>';
        if (isCurrent) html += ' ' + badge('Current', '#0d904f');
        html += '</div><div class="vpm-flex-row" style="gap:6px"><span class="vpm-text-xs vpm-text-muted">' + formatRelativeTime(ver.timestamp || '') + '</span>';
        if (!isCurrent && ver.snapshot) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="restore-script-version" data-ver-idx="' + i + '" style="font-size:10px;padding:2px 8px">' + icon('arrows-rotate') + ' Restore</button>';
        html += '</div></div>';
        html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:2px">';
        if (ver.total_word_count) html += ver.total_word_count + ' words';
        if (ver.timestamp) html += ' \u00B7 ' + formatDate(ver.timestamp);
        html += '</div></div>';
      }
      html += '</div>';
      html += '<div class="vpm-info-banner" style="margin-top:12px">' + icon('info') + ' <span class="vpm-text-sm">Versions are saved when you finalize or when AI generates a script. Restoring a version creates a backup first.</span></div>';
      openModal('Script Version History', html, { footer: false, size: 'md' });
    });

    // Restore script version
    $(document).off('click.vpm2a-rsv').on('click.vpm2a-rsv', '[data-action="restore-script-version"]', function(e) {
      e.preventDefault();
      var idx = parseInt($(this).data('ver-idx'), 10);
      var versions = (S.data.script || {}).versions || [];
      if (idx < 0 || idx >= versions.length || !versions[idx].snapshot) { toast('Cannot restore this version', 'warning'); return; }
      var ver = versions[idx];
      openConfirmDialog({
        title: 'Restore "' + (ver.label || 'Version') + '"?',
        message: 'This will replace your current script with this version (' + (ver.total_word_count || 0) + ' words). A backup of your current script will be saved first.',
        onConfirm: function() {
          _destroyAllEditors();
          var sc = S.data.script;
          // Backup current
          sc.versions = sc.versions || [];
          sc.versions.push({
            id: generateId('ver'),
            timestamp: new Date().toISOString(),
            label: 'v' + (sc.versions.length + 1) + ' \u2014 Before Restore',
            total_word_count: sc.total_word_count || 0,
            snapshot: deepClone(sc.sections)
          });
          // Restore
          sc.sections = deepClone(ver.snapshot);
          sc.finalized = false;
          recomputeScriptDurations();
          logActivity('script_edited', 'Restored version: ' + (ver.label || 'v' + (idx + 1)));
          _snapshotFull('Restore version'); buildMaps(); syncToTextarea(); closeModal(); render();
          toast('Version restored', 'success');
        }
      });
    });

    // Copy prompt
    $(document).off('click.vpm2a-cp').on('click.vpm2a-cp', '[data-action="copy-prompt"]', function() {
      var text = $(this).data('text') || '';
      if (text) _copyToClipboard(text);
    });
  }


  // ============================================================
  // SECTION 21: API EXPORTS
  // ============================================================

  window._vpmOpenModal = openModal;
  window._vpmCloseModal = closeModal;
  window._vpmOpenConfirmDialog = openConfirmDialog;
  window._vpmCollectModalFields = collectModalFields;
  window._vpmUndo = undo;
  window._vpmRedo = redo;
  window._vpmCopyToClipboard = _copyToClipboard;
  window._vpmInitAllScriptEditors = _initAllScriptEditors;
  window._vpmDestroyAllEditors = _destroyAllEditors;
  window._vpmFlushAllEditors = _flushAllEditors;
  window._vpmRenderImagePicker = _renderImagePicker;
  window._vpmSetEntityImage = _setEntityImage;
  window._vpmGetEntityLib = _getEntityLib;
  window._vpmRenderFrameImagePicker = _renderFrameImagePicker;
  window._vpmExportFile = _exportFile;

  console.log('[VPM] Part 2A v1.0 loaded \u2014 21 sections (all stages + activity)');

})(jQuery, Drupal);
