/**
 * AI Video Production Manager v1.0 - Part 1: Core Engine
 * VPM Design System — Prefix: vpm-
 *
 * General-purpose AI video production for any YouTube/social media content.
 * Standard mode: 5 stages (Start → Blueprint → Script → Clips → Publish)
 * Advanced mode: 7 stages (Start → Research → Blueprint → Script → Studio → Clips → Publish)
 * 3 clip tracks: AI (full REVP pipeline), Non-AI (plan+record), Template (auto-apply)
 * Studio: 5 tabs (overview, looks, environments, scenes, library)
 * Settings: 5 tabs (general, ai, defaults, brand, import-export)
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  window._vpmRenderers = window._vpmRenderers || {};

  // ============================================================
  // CONSTANTS (defined in src/core/constants.js, destructured here for backward-compatible local references)
  // ============================================================
  var _C = window._vpmConstants;
  var APP_STAGES = _C.APP_STAGES, STAGE_ORDER_STANDARD = _C.STAGE_ORDER_STANDARD, STAGE_ORDER_ADVANCED = _C.STAGE_ORDER_ADVANCED;
  var UTILITY_VIEWS = _C.UTILITY_VIEWS;
  var PLATFORMS = _C.PLATFORMS, ASPECT_RATIOS = _C.ASPECT_RATIOS, AUDIO_MODES = _C.AUDIO_MODES, SEEDANCE_AUDIO_DIRECTIONS = _C.SEEDANCE_AUDIO_DIRECTIONS;
  var VIDEO_STYLES = _C.VIDEO_STYLES, VOICE_GENDERS = _C.VOICE_GENDERS, VOICE_AGE_RANGES = _C.VOICE_AGE_RANGES;
  var VOICE_STYLES = _C.VOICE_STYLES, VOICE_ACCENTS = _C.VOICE_ACCENTS;
  var PRODUCTION_MODES = _C.PRODUCTION_MODES, PRESENTER_PREFS = _C.PRESENTER_PREFS;
  var LANGUAGES = _C.LANGUAGES, TONES = _C.TONES;
  var CLIP_TYPES = _C.CLIP_TYPES;
  var AI_CLIP_STATUSES = _C.AI_CLIP_STATUSES, AI_CLIP_STATUS_ORDER = _C.AI_CLIP_STATUS_ORDER;
  var NON_AI_CLIP_STATUSES = _C.NON_AI_CLIP_STATUSES, TEMPLATE_CLIP_STATUSES = _C.TEMPLATE_CLIP_STATUSES;
  var STUDIO_TABS = _C.STUDIO_TABS, SETTINGS_TABS = _C.SETTINGS_TABS;
  var AI_CLIP_TABS = _C.AI_CLIP_TABS, NON_AI_CLIP_TABS = _C.NON_AI_CLIP_TABS;
  var LOOK_ROLES = _C.LOOK_ROLES, ENVIRONMENT_TYPES = _C.ENVIRONMENT_TYPES;
  var MOTION_STRENGTHS = _C.MOTION_STRENGTHS, CAMERA_MOVEMENTS = _C.CAMERA_MOVEMENTS, TRANSITION_STYLES = _C.TRANSITION_STYLES;
  var IMAGE_MODELS = _C.IMAGE_MODELS, VIDEO_MODELS = _C.VIDEO_MODELS;
  var VIDEO_STATUSES = _C.VIDEO_STATUSES, ACTIVITY_TYPES = _C.ACTIVITY_TYPES;
  var PLANNER_TONE_MAP = _C.PLANNER_TONE_MAP, VIDEO_GEN_MODES = _C.VIDEO_GEN_MODES;


  // ============================================================
  // STATE (defined in src/core/state.js; reference captured here)
  // ============================================================
  var S = window._vpmState;


  // ============================================================
  // SECTION 3: INITIALIZATION
  // ============================================================

  function isVPMPage() { return $('body').hasClass('node--type-video-production'); }

  // Prevent CKEditor5 from initializing on our JSON textareas
  if (isVPMPage()) {
    $('#edit-field-json-data-0-value, #edit-field-json-meta-0-value, #edit-field-activity-log-0-value')
      .removeAttr('data-ckeditor5-host-entity-type')
      .removeAttr('data-ckeditor5-host-entity-bundle')
      .removeAttr('data-ckeditor5-host-entity-langcode');
  }

  Drupal.behaviors = Drupal.behaviors || {};
  Drupal.behaviors.vpmPart1 = {
    attach: function(context) {
      if (S.initialized || S._initializing) return;
      if (!isVPMPage()) return;
      if (!$(context).find('#edit-field-json-data-0-value').length &&
          !$(context).find('#edit-field-json-meta-0-value').length &&
          context !== document) return;
      init();
    }
  };

  // Fallback init timers
  if (isVPMPage()) {
    var _fallbackDelays = [200, 500, 1000];
    for (var _fi = 0; _fi < _fallbackDelays.length; _fi++) {
      (function(delay) {
        setTimeout(function() {
          if (!S.initialized && !S._initializing) {
            console.log('[VPM] Fallback init at ' + delay + 'ms');
            init();
          }
        }, delay);
      })(_fallbackDelays[_fi]);
    }
  }

  function init() {
    if (S._initializing || S.initialized) return;
    S._initializing = true;
    console.log('[VPM] Initializing Part 1...');

    try {
      parseUserData();
      if (!detectDrupalForm()) { console.error('[VPM] Drupal form not found'); S._initializing = false; return; }
      parseGalleries();
      _observeGalleryWidgets();
      loadData();
      migrateData();
      migrateMeta();
      parseBrandData();
      parseBrandStudioLibrary();
      _observeBrandStudioLibrary();
      buildMaps();
      // Restore last UI state (current stage + sub-tabs + selected clip) BEFORE first render
      // so the app reopens exactly where the user left off.
      var _resumed = false;
      try { _resumed = _restoreUIState(); } catch (_re) { console.warn('[VPM] UI restore failed:', _re && _re.message); }
      // Auto-hide sidebar on mobile viewports
      if (window.innerWidth < 992) S.sidebarHidden = true;
      renderApp();
      setupEventHandlers();
      startAutoSave();
      // Resume toast — shown once on init when restored to a non-Start stage.
      if (_resumed) {
        var lbl = (APP_STAGES[S.currentStage] && APP_STAGES[S.currentStage].label) || (UTILITY_VIEWS[S.currentStage] && UTILITY_VIEWS[S.currentStage].label) || S.currentStage;
        // Delay so toast container is fully mounted
        setTimeout(function() { try { toast('Resumed at ' + lbl, 'info', 3000); } catch (_te) {} }, 400);
      }
    } catch (e) {
      console.error('[VPM] Init error:', e.message, e.stack);
      S._initializing = false;
      S.initialized = true;
      return;
    }

    // Drupal AJAX gallery refresh
    $(document).ajaxComplete(function(event, xhr, settings) {
      if (settings && settings.url && (
        settings.url.indexOf('field_looks_gallery') > -1 ||
        settings.url.indexOf('field_environments_gallery') > -1 ||
        settings.url.indexOf('field_frames_gallery') > -1
      )) {
        setTimeout(function() { parseGalleries(); $(document).trigger('vpm:gallery-updated', ['all']); }, 300);
      }
    });

    // Unsaved changes warning
    $(window).on('beforeunload', function(e) {
      if (S.dirty) { e.preventDefault(); return 'You have unsaved changes. Leave anyway?'; }
    });

    S.initialized = true;
    S._initializing = false;
    console.log('[VPM] Part 1 initialized — mode: ' + S.mode + ', stage: ' + S.currentStage + ', clips: ' + (S.data.clips || []).length);
  }

  // --- Parse User Data ---
  function parseUserData() {
    var $ud = $('#guau-userdata');
    if (!$ud.length) { console.warn('[VPM] #guau-userdata not found'); return; }
    S.user = {
      id: ($ud.find('#guau-userid').text() || '').trim(),
      name: ($ud.find('#guau-username').text() || '').trim(),
      email: ($ud.find('#guau-useremail').text() || '').trim(),
      fullName: ($ud.find('#guau-userfullname').text() || '').trim(),
      timezone: ($ud.find('#guau-usertimezone').text() || '').trim(),
      roles: ($ud.find('#guau-userroles').text() || '').trim()
    };
  }

  // --- Detect Drupal Form ---
  function detectDrupalForm() {
    S.$dataField = $('#edit-field-json-data-0-value');
    S.$metaField = $('#edit-field-json-meta-0-value');
    S.$activityField = $('#edit-field-activity-log-0-value');
    if (!S.$dataField.length && !S.$metaField.length) return false;
    S.$form = S.$dataField.closest('form');
    S.$submitBtn = S.$form.find('#edit-submit, .form-submit[value="Save"], input[type="submit"]').first();
    // Hide JSON field wrappers
    S.$dataField.closest('.field--name-field-json-data').hide();
    S.$metaField.closest('.field--name-field-json-meta').hide();
    if (S.$activityField.length) S.$activityField.closest('.field--name-field-activity-log').hide();
    $('#edit-field-json-data-0-format, #edit-field-json-meta-0-format, #edit-field-activity-log-0-format').hide();
    return true;
  }

  // --- Gallery Parsing (3 galleries) ---
  var _GALLERY_SELECTORS = {
    'looks':         '#edit-field-looks-gallery-wrapper, .field--name-field-looks-gallery',
    'environments':  '#edit-field-environments-gallery-wrapper, .field--name-field-environments-gallery',
    'frames':        '#edit-field-frames-gallery-wrapper, .field--name-field-frames-gallery'
  };

  function _freshWrapper(type) { var sel = _GALLERY_SELECTORS[type]; return sel ? $(sel).first() : $(); }

  function parseGalleries() {
    S.galleries = { looks: [], environments: [], frames: [] };
    S._galleryWrappers = {};
    function _parseFieldImages(type) {
      var $wrapper = _freshWrapper(type);
      S._galleryWrappers[type] = $wrapper;
      if (!$wrapper.length) return;
      $wrapper.find('.image-widget, .media-library-item, .js-form-managed-file, .form-managed-file').each(function() {
        var $slot = $(this);
        var $img = $slot.find('.image-preview img, .image-widget img, img[typeof="foaf:Image"]').first();
        if (!$img.length) $img = $slot.find('img').first();
        var src = $img.attr('src');
        if (!src) return;
        var fid = $slot.find('input[name*="fids"], input[type="hidden"][name*="target_id"]').val() || '';
        if (!fid) return;
        var origSrc = src;
        if (src.indexOf('/styles/') > -1) origSrc = src.replace(/\/styles\/[^\/]+\/public\//, '/');
        S.galleries[type].push({ url: src, originalUrl: origSrc, alt: $img.attr('alt') || '', fid: fid, filename: origSrc.split('/').pop().split('?')[0], $slot: $slot });
      });
      $wrapper.hide();
    }
    _parseFieldImages('looks');
    _parseFieldImages('environments');
    _parseFieldImages('frames');
    console.log('[VPM] Galleries: ' + S.galleries.looks.length + ' looks, ' + S.galleries.environments.length + ' envs, ' + S.galleries.frames.length + ' frames');
  }

  function _observeGalleryWidgets() {
    try {
      for (var gType in _GALLERY_SELECTORS) {
        var $w = _freshWrapper(gType);
        if ($w.length && $w[0]) {
          var observer = new MutationObserver(function() { setTimeout(function() { parseGalleries(); }, 200); });
          observer.observe($w[0], { childList: true, subtree: true });
        }
      }
    } catch (e) { console.warn('[VPM] Gallery observer setup failed:', e); }
  }

  // --- Gallery Upload Queue ---
  var _galleryQueue = [];
  var _galleryQueueProcessing = false;

  function queueGalleryUpload(type, file, context) {
    _galleryQueue.push({ type: type, file: file, context: context || {} });
    if (!_galleryQueueProcessing) _processGalleryQueue();
  }

  function _processGalleryQueue() {
    if (_galleryQueue.length === 0) { _galleryQueueProcessing = false; return; }
    _galleryQueueProcessing = true;
    var item = _galleryQueue.shift();
    var $wrapper = _freshWrapper(item.type);
    if (!$wrapper.length) { _processGalleryQueue(); return; }
    var $input = $wrapper.find('input[type="file"]').last();
    if (!$input.length) { _processGalleryQueue(); return; }
    var dt = new DataTransfer();
    dt.items.add(item.file);
    $input[0].files = dt.files;
    $input.trigger('change');
    setTimeout(function() { _processGalleryQueue(); }, 2000);
  }

  function triggerGalleryRemove(type, fid) {
    var $wrapper = _freshWrapper(type);
    if (!$wrapper.length) return;
    $wrapper.find('.js-form-managed-file, .form-managed-file').each(function() {
      var $slot = $(this);
      var slotFid = $slot.find('input[name*="fids"], input[type="hidden"][name*="target_id"]').val() || '';
      if (slotFid === fid) {
        var $removeBtn = $slot.find('.button--remove, [name*="remove_button"]');
        if ($removeBtn.length) $removeBtn.trigger('mousedown');
      }
    });
  }

  // --- Load Data ---
  function loadData() {
    var rawData = (S.$dataField.val() || '').trim();
    var rawMeta = (S.$metaField.val() || '').trim();
    var rawActivity = S.$activityField ? (S.$activityField.val() || '').trim() : '';
    if (rawData) { try { S.data = JSON.parse(rawData); } catch (e) { console.error('[VPM] Data parse error:', e); } }
    if (rawMeta) { try { S.meta = JSON.parse(rawMeta); } catch (e) { console.error('[VPM] Meta parse error:', e); } }
    if (rawActivity) { try { S.activity = JSON.parse(rawActivity); } catch (e) { console.error('[VPM] Activity parse error:', e); } }
    if (!Array.isArray(S.activity)) S.activity = [];
  }

  // --- Migrate Data ---
  function migrateData() {
    var def = getDefaultData();
    S.data.start = $.extend(true, {}, def.start, S.data.start || {});
    S.data.video = $.extend(true, {}, def.video, S.data.video || {});
    S.data.research = $.extend(true, {}, def.research, S.data.research || {});
    S.data.blueprint = $.extend(true, {}, def.blueprint, S.data.blueprint || {});
    S.data.script = $.extend(true, {}, def.script, S.data.script || {});
    S.data.publishing = $.extend(true, {}, def.publishing, S.data.publishing || {});
    S.data.thumbnails = $.extend(true, {}, def.thumbnails, S.data.thumbnails || {});
    if (!Array.isArray(S.data.clips)) S.data.clips = [];

    // Migrate audio mode: old 'ai-generated' → new 'ai-audio-with-video'
    var _prefs = S.data.start.preferences || {};
    if (_prefs.audio_mode === 'ai-generated') _prefs.audio_mode = 'ai-audio-with-video';
    if (_prefs.audio_mode === 'voiceover') _prefs.audio_mode = 'ai-voice-separate';
    // Ensure new preference fields exist
    if (!_prefs.platforms) _prefs.platforms = _prefs.platform ? [_prefs.platform] : ['youtube'];
    if (!_prefs.voice_profile) _prefs.voice_profile = { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' };
    if (!_prefs.video_style) _prefs.video_style = '';
    if (!_prefs.selected_video_models) _prefs.selected_video_models = [];
    if (!_prefs.selected_image_models) _prefs.selected_image_models = [];
    if (_prefs.primary_video_model === undefined) _prefs.primary_video_model = '';
    if (_prefs.primary_image_model === undefined) _prefs.primary_image_model = '';
    // Ensure brand_selections
    if (!S.data.start.brand_selections) S.data.start.brand_selections = { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false };

    // Determine mode from persisted start data
    S.mode = (S.data.start && S.data.start.mode) || 'advanced';

    // Ensure script sections exist
    if (!S.data.script.sections) S.data.script.sections = [];
    if (!S.data.script.versions) S.data.script.versions = [];

    // Ensure all clips have required fields
    var clips = S.data.clips;
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      if (!c.id) c.id = generateId('clip');
      if (c.order === undefined) c.order = i + 1;
      if (!c.section) c.section = 'body';
      if (!c.track) { var ct = CLIP_TYPES[c.type] || {}; c.track = ct.track || 'ai'; }
      if (!c.status) c.status = (c.track === 'ai') ? 'draft' : (c.track === 'non-ai') ? 'planned' : 'pending';
      if (!c.timing) c.timing = { start: 0, end: c.duration || 8 };
      if (c.track === 'ai') {
        if (!c.prompt_set) c.prompt_set = createEmptyPromptSet(c.type);
        if (!c.prompt_set.first_frame) c.prompt_set.first_frame = _createEmptyFrame();
        var needsLast = (CLIP_TYPES[c.type] || {}).defaultLastFrame;
        if (needsLast && !c.prompt_set.last_frame) c.prompt_set.last_frame = _createEmptyFrame();
        if (!c.prompt_set.video) c.prompt_set.video = { prompt: createEmptyPrompt(), marked_done: false, done_at: null, notes: '' };
      }
      if (c.track === 'non-ai' && !c.non_ai_planning) c.non_ai_planning = createDefaultNonAiPlanning();
      if (!c.production_config) c.production_config = { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true };
      if (c.production_config && c.production_config.audio_mode === 'ai-generated') c.production_config.audio_mode = 'ai-audio-with-video';
    }
    if (!S.data.video.created) S.data.video.created = new Date().toISOString();
  }

  function migrateMeta() {
    var def = getDefaultMeta();
    S.meta.settings = $.extend(true, {}, def.settings, S.meta.settings || {});
    S.meta.aiPreferences = $.extend(true, {}, def.aiPreferences, S.meta.aiPreferences || {});
    if (!S.meta.lookLibrary) S.meta.lookLibrary = [];
    // Ensure voice_profile on all look library entries
    for (var _vli = 0; _vli < (S.meta.lookLibrary || []).length; _vli++) {
      if (!S.meta.lookLibrary[_vli].voice_profile) S.meta.lookLibrary[_vli].voice_profile = { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' };
    }
    if (!S.meta.environmentLibrary) S.meta.environmentLibrary = [];
    if (!S.meta.sceneLibrary) S.meta.sceneLibrary = [];
    if (!S.meta.brandOverrides) S.meta.brandOverrides = {};
    if (!S.meta.studioRequirements) S.meta.studioRequirements = {};
    S.meta._ui = $.extend(true, {}, def._ui, S.meta._ui || {});

    // Migrate deprecated model IDs
    var _modelFixes = {
      'gemini-2.5-pro-preview-06-05': 'gemini-2.5-pro',
      'gemini-2.5-flash-preview-05-20': 'gemini-2.5-flash',
      'gemini-2.5-pro-preview-03-25': 'gemini-2.5-pro',
      'gemini-2.5-flash-preview-04-17': 'gemini-2.5-flash'
    };
    function _fixModel(obj, key) {
      if (obj && obj[key] && _modelFixes[obj[key]]) { obj[key] = _modelFixes[obj[key]]; }
    }
    var ap = S.meta.aiPreferences || {};
    _fixModel(ap, 'lastModel');
    if (ap.appDefault) _fixModel(ap.appDefault, 'model');
    if (ap.perAction) { for (var ak in ap.perAction) { if (ap.perAction[ak]) _fixModel(ap.perAction[ak], 'model'); } }
  }

  // --- Parse Brand Data ---
  function parseBrandData() {
    var $bd = $('.brand-data');
    if (!$bd.length) return;
    S.brand.configured = true;
    S.brand.identity = {
      name: $bd.find('.brand-name').text().trim(),
      id: $bd.find('.brand-id').text().trim(),
      logoUrl: $bd.find('.brand-logo-url').text().trim()
    };
    function _parseBrandJSON(selector) {
      var $el = $bd.find(selector);
      if (!$el.length) return null;
      try { return JSON.parse($el.text().trim()); } catch (e) { return null; }
    }
    S.brand.core = _parseBrandJSON('.brand-core-data');
    S.brand.video = _parseBrandJSON('.brand-video-data');
    S.brand.content = _parseBrandJSON('.brand-content-data');
  }


  // ============================================================
  // SECTION 4: BRAND STUDIO LIBRARY PARSER
  // ============================================================

  function parseBrandStudioLibrary() {
    S.brandStudio = { characters: [], outfits: [], looks: [], environments: [], scenes: [], collections: [], loaded: false };
    var $lib = $('.brand-studio-library');
    if (!$lib.length) {
      console.log('[VPM] No .brand-studio-library found on page');
      return;
    }
    function _parseLibJSON(selector) {
      var $el = $lib.find(selector);
      if (!$el.length) {
        // Try parsing the entire library as a single JSON blob
        return [];
      }
      try {
        var arr = JSON.parse($el.text().trim());
        if (!Array.isArray(arr)) return [];
        for (var i = 0; i < arr.length; i++) arr[i].source = 'brand';
        return arr;
      } catch (e) { return []; }
    }

    // Try structured sub-divs first
    S.brandStudio.characters = _parseLibJSON('.brand-studio-characters');
    S.brandStudio.outfits = _parseLibJSON('.brand-studio-outfits');
    S.brandStudio.looks = _parseLibJSON('.brand-studio-looks');
    S.brandStudio.environments = _parseLibJSON('.brand-studio-environments');
    S.brandStudio.scenes = _parseLibJSON('.brand-studio-scenes');
    S.brandStudio.collections = _parseLibJSON('.brand-studio-collections');

    // Fallback: try parsing entire div as single JSON export
    if (!S.brandStudio.looks.length && !S.brandStudio.environments.length) {
      try {
        var raw = JSON.parse($lib.text().trim());
        if (raw) {
          function _markBrand(arr) { if (!arr) return []; for (var i = 0; i < arr.length; i++) arr[i].source = 'brand'; return arr; }
          if (raw.characters) S.brandStudio.characters = _markBrand(raw.characters);
          if (raw.outfits) S.brandStudio.outfits = _markBrand(raw.outfits);
          if (raw.looks) S.brandStudio.looks = _markBrand(raw.looks);
          if (raw.environments) S.brandStudio.environments = _markBrand(raw.environments);
          if (raw.scenes) S.brandStudio.scenes = _markBrand(raw.scenes);
          if (raw.collections) S.brandStudio.collections = _markBrand(raw.collections);
          if (raw.brand) S.brandStudio.brandInfo = raw.brand;
        }
      } catch (e) { /* not a single JSON blob */ }
    }

    S.brandStudio.loaded = true;
    console.log('[VPM] Brand Studio: ' + S.brandStudio.characters.length + ' chars, ' + S.brandStudio.outfits.length + ' outfits, ' + S.brandStudio.looks.length + ' looks, ' + S.brandStudio.environments.length + ' envs, ' + S.brandStudio.scenes.length + ' scenes, ' + S.brandStudio.collections.length + ' collections');
  }

  // Observe for dynamically loaded brand studio library (Drupal AJAX)
  function _observeBrandStudioLibrary() {
    if (S.brandStudio.loaded && S.brandStudio.looks.length) return;
    try {
      var _bsObserver = new MutationObserver(function() {
        if (S.brandStudio.loaded && S.brandStudio.looks.length) { _bsObserver.disconnect(); return; }
        var $lib = $('.brand-studio-library');
        if ($lib.length) {
          _bsObserver.disconnect();
          parseBrandStudioLibrary();
          buildMaps();
          if (S.initialized) renderApp();
          console.log('[VPM] Brand Studio loaded via observer');
        }
      });
      _bsObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(function() { _bsObserver.disconnect(); }, 30000);
    } catch (e) { console.warn('[VPM] Brand studio observer failed:', e); }
    // Fallback retry after 3s
    if (!S.brandStudio.loaded || !S.brandStudio.looks.length) {
      setTimeout(function() {
        if (!S.brandStudio.loaded || !S.brandStudio.looks.length) {
          parseBrandStudioLibrary();
          if (S.brandStudio.loaded && S.brandStudio.looks.length) { buildMaps(); if (S.initialized) renderApp(); }
        }
      }, 3000);
    }
  }


  // ============================================================
  // SECTION 5: MAP BUILDERS & STATUS ENGINE
  // ============================================================

  function buildMaps() {
    // --- Clip maps ---
    S.clipMap = {}; S.clipsByType = {}; S.clipsByTrack = { ai: [], 'non-ai': [], template: [] }; S.clipsBySection = {}; S.clipsByStatus = {};
    var clips = S.data.clips || [];
    var stats = { total: clips.length, totalAI: 0, totalNonAI: 0, totalTemplate: 0, aiDone: 0, nonAiDone: 0, templateDone: 0, withScenes: 0, withFramesDone: 0, withPrompts: 0, withVideoPrompts: 0 };

    for (var ci = 0; ci < clips.length; ci++) {
      var c = clips[ci];
      S.clipMap[c.id] = c;
      S.clipsByType[c.type] = S.clipsByType[c.type] || []; S.clipsByType[c.type].push(c);
      var track = c.track || (CLIP_TYPES[c.type] || {}).track || 'ai';
      S.clipsByTrack[track] = S.clipsByTrack[track] || []; S.clipsByTrack[track].push(c);
      S.clipsBySection[c.section] = S.clipsBySection[c.section] || []; S.clipsBySection[c.section].push(c);
      S.clipsByStatus[c.status] = S.clipsByStatus[c.status] || []; S.clipsByStatus[c.status].push(c);

      if (track === 'ai') {
        stats.totalAI++;
        if (c.status === 'done' || c.status === 'video-ready') stats.aiDone++;
        var ps = c.prompt_set || {};
        var ff = ps.first_frame || {};
        if (ff.scene && (ff.scene.environment_id || (ff.scene.look_ids && ff.scene.look_ids.length))) stats.withScenes++;
        if (ff.marked_done) stats.withFramesDone++;
        if (ff.prompt && ff.prompt.status === 'generated') stats.withPrompts++;
        if (ps.video && ps.video.prompt && ps.video.prompt.status === 'generated') stats.withVideoPrompts++;
      } else if (track === 'non-ai') {
        stats.totalNonAI++;
        if (c.status === 'done' || c.status === 'recorded' || (c.non_ai_planning && c.non_ai_planning.marked_done)) stats.nonAiDone++;
      } else {
        stats.totalTemplate++;
        if (c.status === 'applied' || c.template_id) stats.templateDone++;
      }
    }
    S.clipStats = stats;

    // --- Entity maps ---
    S.lookMap = {}; S.envMap = {}; S.sceneMap = {};
    var _buildMap = function(arr, map) { for (var i = 0; i < arr.length; i++) if (arr[i].id) map[arr[i].id] = arr[i]; };
    _buildMap(S.meta.lookLibrary || [], S.lookMap);
    _buildMap(S.meta.environmentLibrary || [], S.envMap);
    _buildMap(S.meta.sceneLibrary || [], S.sceneMap);

    // Combined pools (brand studio + video custom), filtered by brand selections
    var _bs = ((S.data.start || {}).brand_selections || {});
    var _selLooks = _bs.selected_look_ids || [];
    var _selEnvs = _bs.selected_environment_ids || [];
    var _selScenes = _bs.selected_scene_ids || [];
    var _filterArr = function(arr, ids) { return ids.length ? arr.filter(function(x) { return ids.indexOf(x.id) >= 0; }) : arr; };
    var _useBrand = !S.data.start || S.data.start.use_brand_library !== false;
    if (_useBrand) {
      S.allLooks = _filterArr(S.brandStudio.looks || [], _selLooks).concat(S.meta.lookLibrary || []);
      S.allEnvironments = _filterArr(S.brandStudio.environments || [], _selEnvs).concat(S.meta.environmentLibrary || []);
      S.allScenes = _filterArr(S.brandStudio.scenes || [], _selScenes).concat(S.meta.sceneLibrary || []);
      // Add brand studio entities to maps
      _buildMap(S.brandStudio.looks || [], S.lookMap);
      _buildMap(S.brandStudio.environments || [], S.envMap);
      _buildMap(S.brandStudio.scenes || [], S.sceneMap);
    } else {
      S.allLooks = (S.meta.lookLibrary || []).slice();
      S.allEnvironments = (S.meta.environmentLibrary || []).slice();
      S.allScenes = (S.meta.sceneLibrary || []).slice();
    }

    // --- Studio requirements analysis ---
    computeStudioRequirements();

    // --- Completion flags ---
    computeFlags();
    S.computedStatus = calculateVideoStatus();

    // Recompute script durations
    recomputeScriptDurations();
    recomputeClipTimings();
  }

  function computeStudioRequirements() {
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return (c.track || (CLIP_TYPES[c.type] || {}).track) === 'ai'; });
    var reqs = {
      existing_looks: (S.allLooks || []).length, existing_envs: (S.allEnvironments || []).length, existing_scenes: (S.allScenes || []).length,
      clips_needing_look: [], clips_needing_env: [], unassigned_clips: [],
      look_usage: {}, env_usage: {}, scene_usage: {}
    };
    for (var i = 0; i < aiClips.length; i++) {
      var c = aiClips[i];
      var scene = (((c.prompt_set || {}).first_frame || {}).scene || {});
      var hasLook = scene.look_ids && scene.look_ids.length > 0;
      var hasEnv = !!scene.environment_id;
      var hasScene = !!scene.scene_template_id;
      if (c.type === 'ai-character' && !hasLook) reqs.clips_needing_look.push(c.id);
      if (!hasEnv && !hasScene) reqs.clips_needing_env.push(c.id);
      if (!hasScene && !hasLook && !hasEnv) reqs.unassigned_clips.push(c.id);
      // Track usage
      if (hasLook) { for (var li = 0; li < scene.look_ids.length; li++) { var lid = scene.look_ids[li]; reqs.look_usage[lid] = reqs.look_usage[lid] || []; reqs.look_usage[lid].push(c.id); } }
      if (hasEnv) { reqs.env_usage[scene.environment_id] = reqs.env_usage[scene.environment_id] || []; reqs.env_usage[scene.environment_id].push(c.id); }
      if (hasScene) { reqs.scene_usage[scene.scene_template_id] = reqs.scene_usage[scene.scene_template_id] || []; reqs.scene_usage[scene.scene_template_id].push(c.id); }
    }
    S.studioReqs = reqs;
  }

  function computeFlags() {
    var d = S.data;

    // Start
    S.startComplete = !!(d.start && d.start.processed);

    // Research (Advanced only)
    S.researchComplete = !!(d.research && d.research.generated);

    // Blueprint
    var bp = d.blueprint || {};
    S.blueprintComplete = !!(bp.confirmed);

    // Script
    var sc = d.script || {};
    var sections = sc.sections || [];
    var totalContent = 0;
    for (var i = 0; i < sections.length; i++) {
      totalContent += (sections[i].content ? stripHtml(sections[i].content).trim().length : 0);
    }
    S.scriptReady = sections.length >= 1 && totalContent >= 20;
    S.scriptFinalized = !!sc.finalized;

    // Studio (Advanced only)
    var sr = S.meta.studioRequirements || {};
    if (sr.total_needed && sr.total_needed > 0) {
      S.studioReady = (sr.total_draft || 0) === 0;
    } else {
      S.studioReady = (S.allLooks.length > 0 || S.allEnvironments.length > 0);
    }

    // Clips
    var clips = d.clips || [];
    S.clipsReady = clips.length >= 2;
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    S.productionComplete = clips.length > 0 && done >= clips.length;

    // Publish
    var yt = (d.publishing && d.publishing.youtube) || {};
    S.publishReady = !!(yt.title && yt.description);
    S.exported = !!(d.publishing && d.publishing.export_history && d.publishing.export_history.length > 0);
  }

  function calculateVideoStatus() {
    if (S.exported) return 'published';
    if (S.productionComplete) return 'production-done';
    if (S.clipsReady) return 'in-production';
    if (S.studioReady && S.mode === 'advanced') return 'studio-ready';
    if (S.scriptFinalized) return 'script-final';
    if (S.scriptReady) return 'script-draft';
    if (S.blueprintComplete) return 'blueprint-done';
    if (S.researchComplete && S.mode === 'advanced') return 'research-done';
    if (S.startComplete) return 'idea-ready';
    return 'new';
  }

  function recomputeClipTimings() {
    var clips = S.data.clips || [], offset = 0;
    for (var i = 0; i < clips.length; i++) {
      clips[i].order = i + 1;
      clips[i].timing = { start: offset, end: offset + (clips[i].duration || 8) };
      offset += (clips[i].duration || 8);
    }
  }

  function recomputeScriptDurations() {
    var sc = S.data.script || {};
    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var totalWords = 0, totalDuration = 0;
    var sections = sc.sections || [];
    for (var i = 0; i < sections.length; i++) {
      sections[i].word_count = countWords(sections[i].content || '');
      sections[i].estimated_duration = Math.ceil((sections[i].word_count / wpm) * 60);
      totalWords += sections[i].word_count;
      totalDuration += sections[i].estimated_duration;
    }
    sc.total_word_count = totalWords;
    sc.estimated_duration = totalDuration;
  }

  function evaluateClipStatus(clip) {
    if (!clip) return clip ? clip.status : 'draft';
    var ct = CLIP_TYPES[clip.type] || {};
    var track = clip.track || ct.track || 'ai';
    if (track === 'ai') {
      var ps = clip.prompt_set || {};
      // Model-aware gen mode default (so Seedance clips default to ingredients-to-video)
      var _evPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _evModelDefaultGm = (VIDEO_MODELS[_evPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _gm = ((ps.video || {}).gen_mode || _evModelDefaultGm);
      var _needsFrames = (_gm === 'frames-to-video');
      if (ps.video && ps.video.marked_done) return 'done';
      if (ps.video && ps.video.prompt && ps.video.prompt.status === 'generated') return 'video-ready';
      if (_needsFrames) {
        if (ps.requires_last_frame && ps.last_frame && ps.last_frame.marked_done) return 'last-frame-ready';
        if (ps.first_frame && ps.first_frame.marked_done) return 'first-frame-ready';
      }
      var ff = ps.first_frame || {};
      // scene-set: check both seedance_assets (new) and first_frame.scene (frames-to-video)
      var _sa = (ps.video || {}).seedance_assets || {};
      var _saSet = _sa.character_look_id || ((_sa.env_ids || []).some(function(id) { return !!id; }));
      if (_saSet || (ff.scene && (ff.scene.scene_template_id || ff.scene.environment_id || (ff.scene.look_ids && ff.scene.look_ids.length)))) return 'scene-set';
      if (clip.script_text && clip.script_text.trim().length > 5) return 'script-ready';
      return 'draft';
    } else if (track === 'non-ai') {
      if (clip.non_ai_planning && clip.non_ai_planning.marked_done) return 'done';
      if (clip.non_ai_planning && clip.non_ai_planning.recording_ref) return 'recorded';
      if (clip.non_ai_planning && (clip.non_ai_planning.brief || clip.non_ai_planning.instructions)) return 'in-progress';
      return 'planned';
    } else {
      return clip.template_id ? 'applied' : 'pending';
    }
  }

  function maybeAdvanceClipStatus(clip, reason) {
    if (!clip) return;
    var newStatus = evaluateClipStatus(clip);
    if (newStatus !== clip.status) {
      var ct = CLIP_TYPES[clip.type] || {};
      var track = clip.track || ct.track || 'ai';
      var statusMap = (track === 'ai') ? AI_CLIP_STATUSES : (track === 'non-ai') ? NON_AI_CLIP_STATUSES : TEMPLATE_CLIP_STATUSES;
      var curOrder = (statusMap[clip.status] || {}).order || 0;
      var newOrder = (statusMap[newStatus] || {}).order || 0;
      var direction = newOrder > curOrder ? 'advanced' : 'regressed';
      clip.status = newStatus;
      console.log('[VPM] Clip ' + clip.order + ' status ' + direction + ' to: ' + clip.status + ' (' + (reason || '') + ')');
    }
  }


  // ============================================================
  // SECTION 6: STAGE NAVIGATION
  // ============================================================

  function getStageOrder() {
    return S.mode === 'standard' ? STAGE_ORDER_STANDARD : STAGE_ORDER_ADVANCED;
  }

  // Capture current UI state (stage + sub-state) into S.meta._ui.
  // Cheap — only mutates the object; does NOT mark dirty or write the textarea.
  // syncToTextarea() calls this before writing so saved JSON includes the latest UI state.
  function _captureUIState() {
    if (!S.meta) return;
    var ui = S.meta._ui = S.meta._ui || {};
    ui.last_stage = S.currentStage || 'start';
    ui.start_step = S.startStep || '';
    ui.selected_clip_id = S.selectedClipId || '';
    ui.clip_detail_tab = S.currentClipDetailTab || '';
    ui.studio_tab = S.currentStudioTab || '';
    ui.settings_tab = S.currentSettingsTab || '';
    ui.platform_tab = S.currentPlatformTab || '';
    ui.thumbnail_step = S.thumbnailStep || '';
    if (!Array.isArray(ui.visited_stages)) ui.visited_stages = [];
    ui.updated_at = new Date().toISOString();
  }

  // Restore UI state from S.meta._ui into S.* fields. Called in init() before renderApp().
  // Validates that the restored stage is reachable in the current mode and falls back to 'start' otherwise.
  // Returns true if a non-default stage was restored (used to decide whether to show the "Resume" toast).
  function _restoreUIState() {
    var ui = (S.meta && S.meta._ui) || {};
    var restored = false;
    if (ui.last_stage) {
      var stageOrder = getStageOrder();
      if (APP_STAGES[ui.last_stage] && stageOrder.indexOf(ui.last_stage) !== -1) {
        S.currentStage = ui.last_stage;
        restored = ui.last_stage !== 'start';
      } else if (UTILITY_VIEWS[ui.last_stage]) {
        S.currentStage = ui.last_stage;
        restored = true;
      }
    }
    if (ui.start_step) S.startStep = ui.start_step;
    if (ui.clip_detail_tab) S.currentClipDetailTab = ui.clip_detail_tab;
    if (ui.studio_tab) S.currentStudioTab = ui.studio_tab;
    if (ui.settings_tab) S.currentSettingsTab = ui.settings_tab;
    if (ui.platform_tab) S.currentPlatformTab = ui.platform_tab;
    if (ui.thumbnail_step) S.thumbnailStep = ui.thumbnail_step;
    if (ui.selected_clip_id) {
      var clips = (S.data && S.data.clips) || [];
      for (var i = 0; i < clips.length; i++) {
        if (clips[i].id === ui.selected_clip_id) { S.selectedClipId = ui.selected_clip_id; break; }
      }
    }
    return restored;
  }

  // Auto-mark prior stage complete when user navigates forward AND prior stage has min content.
  // Returns the stage that was auto-confirmed (or '' if nothing changed).
  function _maybeAutoConfirmPriorStage(fromStage, toStage) {
    if (!fromStage || !toStage || fromStage === toStage) return '';
    var stageOrder = getStageOrder();
    var fromIdx = stageOrder.indexOf(fromStage), toIdx = stageOrder.indexOf(toStage);
    if (fromIdx < 0 || toIdx <= fromIdx) return ''; // not a forward move
    var d = S.data || {};
    if (fromStage === 'research') {
      var r = d.research || {};
      if (!r.generated && (r.audience_insights || r.competitor_analysis || r.trending_angles || r.content_strategy)) {
        r.generated = true; r.generated_at = r.generated_at || new Date().toISOString();
        logActivity && logActivity('research_auto_confirmed', 'Research auto-marked complete on stage advance');
        return 'research';
      }
    } else if (fromStage === 'blueprint') {
      var bp = d.blueprint || {};
      var hasSection = (bp.sections || []).some(function(s) { return (s.label || '').trim().length > 0; });
      if (!bp.confirmed && hasSection) {
        bp.confirmed = true; bp.confirmed_at = bp.confirmed_at || new Date().toISOString();
        logActivity && logActivity('blueprint_auto_confirmed', 'Blueprint auto-marked complete on stage advance');
        return 'blueprint';
      }
    } else if (fromStage === 'script') {
      var sc = d.script || {}, totalChars = 0;
      var secs = sc.sections || [];
      for (var si = 0; si < secs.length; si++) totalChars += (secs[si].content ? stripHtml(secs[si].content).trim().length : 0);
      if (!sc.finalized && totalChars >= 20) {
        sc.finalized = true; sc.finalized_at = sc.finalized_at || new Date().toISOString();
        logActivity && logActivity('script_auto_confirmed', 'Script auto-marked complete on stage advance');
        return 'script';
      }
    }
    return '';
  }

  function navigateToStage(stageId) {
    if (!APP_STAGES[stageId] && !UTILITY_VIEWS[stageId]) return;
    // Check if stage is available in current mode
    var stageOrder = getStageOrder();
    if (APP_STAGES[stageId] && stageOrder.indexOf(stageId) === -1 && !UTILITY_VIEWS[stageId]) {
      toast('Not available in ' + S.mode + ' mode', 'warning');
      return;
    }

    // Soft prerequisite warnings (don't block, just inform)
    var access = canAccessStage(stageId);
    if (access.warning && stageId !== S.currentStage) {
      toast(access.warning, 'info');
    }

    var fromStage = S.currentStage;
    S.previousStage = S.currentStage;
    S.currentStage = stageId;

    // Auto-mark prior stage complete on forward navigation (when it has minimum content).
    // Explicit Confirm/Unlock buttons still work — this just removes the friction of leaving stages
    // visibly "incomplete" after the user has clearly moved past them.
    var autoConfirmed = _maybeAutoConfirmPriorStage(fromStage, stageId);

    // Track visited stages for sidebar coach + future analytics
    var ui = S.meta && S.meta._ui;
    if (ui) {
      if (!Array.isArray(ui.visited_stages)) ui.visited_stages = [];
      if (ui.visited_stages.indexOf(stageId) === -1) ui.visited_stages.push(stageId);
    }

    // Reset sub-state for clips
    if (stageId === 'clips' && !S.selectedClipId && S.data.clips && S.data.clips.length > 0) {
      S.selectedClipId = S.data.clips[0].id;
      var firstClip = S.data.clips[0];
      var firstTrack = firstClip.track || (CLIP_TYPES[firstClip.type] || {}).track || 'ai';
      S.currentClipDetailTab = firstTrack === 'ai' ? 'script-config' : firstTrack === 'non-ai' ? 'planning' : 'template';
    }

    // Recompute completion flags every navigation so sidebar reflects the latest state
    // (especially after an auto-confirm).
    try { buildMaps(); } catch (_e) {}

    // Persist new stage + sub-state immediately so a reload restores correctly
    syncToTextarea();

    if (autoConfirmed) {
      var label = (APP_STAGES[autoConfirmed] && APP_STAGES[autoConfirmed].label) || autoConfirmed;
      toast(label + ' marked complete', 'success', 2200);
    }

    // Render content + sidebar
    render();
    window.scrollTo(0, 0);
  }

  function _refreshSidebarNav() {
    var $sidebar = $('#vpmSidebar');
    if (!$sidebar.length) return;
    var stageOrder = getStageOrder();
    var collapsed = S.sidebarCollapsed;
    // Update collapsed class
    $sidebar.toggleClass('vpm-sidebar-collapsed', !!collapsed);
    // Update collapse button icon
    $sidebar.find('.vpm-sidebar-collapse-btn').attr('title', collapsed ? 'Expand' : 'Collapse').html(icon(collapsed ? 'chevron-right' : 'chevron-left'));
    // Rebuild nav content
    var $nav = $sidebar.find('.vpm-nav');
    if (!$nav.length) return;
    var html = '<div class="vpm-nav-label"><span class="vpm-nav-label-text">STAGES</span></div>';
    var _visited = (S.meta && S.meta._ui && Array.isArray(S.meta._ui.visited_stages)) ? S.meta._ui.visited_stages : [];
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var isVisited = !isActive && !isDone && _visited.indexOf(key) !== -1;
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isVisited ? ' vpm-nav-visited' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + (isVisited ? ' (visited — not confirmed)' : '') + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else if (isVisited) html += icon('circle-dot');
      else html += '<span class="vpm-nav-step">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(stage.label) + '</div>';
      html += '<div class="vpm-nav-desc' + (isActive ? ' vpm-nav-desc-active' : '') + '">' + esc(stage.description) + '</div>';
      if (!isDone && !isFuture && progress > 0) {
        html += '<div class="vpm-nav-progress"><div class="vpm-nav-progress-fill" style="width:' + progress + '%"></div></div>';
      }
      html += '</div></button>';
    }
    html += '<div class="vpm-nav-divider"></div><div class="vpm-nav-label"><span class="vpm-nav-label-text">VIEWS</span></div>';
    for (var uid in UTILITY_VIEWS) {
      var uv = UTILITY_VIEWS[uid];
      html += '<button class="vpm-nav-item vpm-nav-util' + (S.currentStage === uid ? ' vpm-nav-active' : '') + '" data-action="navigate" data-stage="' + uid + '" title="' + esc(uv.label) + '"><div class="vpm-nav-dot vpm-nav-dot-util">' + icon(uv.icon) + '</div><div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(uv.label) + '</div></div></button>';
    }
    $nav.html(html);
  }

  function canAccessStage(stageId) {
    var stageOrder = getStageOrder();
    if (stageOrder.indexOf(stageId) === -1 && !UTILITY_VIEWS[stageId]) return { allowed: false, warning: 'Not available in ' + S.mode + ' mode' };
    switch (stageId) {
      case 'research':   return { allowed: true, warning: S.startComplete ? '' : 'Start stage not complete' };
      case 'blueprint':  return { allowed: true, warning: S.startComplete ? '' : 'Start stage not complete' };
      case 'script':     return { allowed: true, warning: S.blueprintComplete ? '' : 'Blueprint not confirmed' };
      case 'studio':     return { allowed: true, warning: S.scriptFinalized ? '' : 'Script not finalized' };
      case 'clips':      return { allowed: true, warning: S.scriptReady ? '' : 'Script needs content' };
      case 'publish':    return { allowed: true, warning: S.clipsReady ? '' : 'Create clips first' };
    }
    return { allowed: true, warning: '' };
  }

  function getStageStatus(stageId) {
    if (isStageComplete(stageId)) return 'complete';
    var stageOrder = getStageOrder();
    if (S.currentStage === stageId) return 'current';
    var idx = stageOrder.indexOf(stageId);
    var currentIdx = stageOrder.indexOf(S.currentStage);
    if (idx >= 0 && currentIdx >= 0 && idx < currentIdx) return 'in-progress';
    return 'not-started';
  }

  function isStageComplete(stageId) {
    switch (stageId) {
      case 'start':     return S.startComplete;
      case 'research':  return S.researchComplete;
      case 'blueprint': return S.blueprintComplete;
      case 'script':    return S.scriptFinalized;
      case 'studio':    return S.studioReady;
      case 'clips':     return S.productionComplete;
      case 'publish':   return S.exported;
    }
    return false;
  }

  function getStageProgress(stageId) {
    switch (stageId) {
      case 'start':     return S.startComplete ? 100 : 0;
      case 'research':  return S.researchComplete ? 100 : 0;
      case 'blueprint': return S.blueprintComplete ? 100 : 0;
      case 'script': {
        var secs = (S.data.script || {}).sections || [];
        if (!secs.length) return 0;
        var filled = 0;
        for (var si = 0; si < secs.length; si++) { if (secs[si].content && stripHtml(secs[si].content).trim().length > 10) filled++; }
        return Math.round((filled / secs.length) * 100);
      }
      case 'studio':    return S.studioReady ? 100 : (S.allLooks.length > 0 ? 50 : 0);
      case 'clips': {
        var st = S.clipStats;
        var total = st.total || 1;
        var done = st.aiDone + st.nonAiDone + st.templateDone;
        return Math.round((done / total) * 100);
      }
      case 'publish':   return S.exported ? 100 : S.publishReady ? 75 : 0;
    }
    return 0;
  }


  // ============================================================
  // UTILITIES (defined in src/utils/format.js; captured here as locals)
  // ============================================================
  var esc = window._vpmEsc, truncate = window._vpmTruncate, stripHtml = window._vpmStripHtml, countWords = window._vpmCountWords;
  var formatDuration = window._vpmFormatDuration, formatDurationLong = window._vpmFormatDurationLong;
  var formatDate = window._vpmFormatDate, formatRelativeTime = window._vpmFormatRelativeTime, formatNumber = window._vpmFormatNumber;
  var estimateDurationFromWords = window._vpmEstimateDuration, getMaxWordsForDuration = window._vpmGetMaxWordsForDuration;
  var getClipScriptOverflow = window._vpmGetClipScriptOverflow;
  var getSmartClipDuration = window._vpmGetSmartClipDuration, getModelDurationConfig = window._vpmGetModelDurationConfig;
  var snapToModelDuration = window._vpmSnapToModelDuration, validateClipDuration = window._vpmValidateClipDuration;
  var icon = window._vpmIcon, generateId = window._vpmGenerateId;
  var parseAIResponse = window._vpmParseAIResponse, parseJSON = window._vpmParseJSON;
  var deepClone = window._vpmDeepClone, isEmpty = window._vpmIsEmpty, debounce = window._vpmDebounce;
  var logActivity = window._vpmLogActivity, getFilteredActivity = window._vpmGetFilteredActivity;
  var badge = window._vpmBadge, statusBadge = window._vpmStatusBadge, clipTypeBadge = window._vpmClipTypeBadge;
  var trackBadge = window._vpmTrackBadge, clipStatusBadge = window._vpmClipStatusBadge;
  var sourceBadge = window._vpmSourceBadge, roleBadge = window._vpmRoleBadge, progressBar = window._vpmProgressBar;
  var _getEntityPrimaryImage = window._vpmGetEntityPrimaryImage;


  // ============================================================
  // SECTION 8: APP SHELL
  // ============================================================

  function _recalcToolbarHeight() {
    var toolbarH = 0; var $tb = $('#toolbar-bar');
    if ($tb.length) { toolbarH = $tb.outerHeight() || 0; var $tray = $('#toolbar-tray-horizontal'); if ($tray.length && $tray.is(':visible')) toolbarH += $tray.outerHeight() || 0; }
    document.documentElement.style.setProperty('--vpm-drupal-toolbar', toolbarH + 'px');
  }

  function renderApp() {
    _recalcToolbarHeight();
    $('body').addClass('vpm-active');
    var $formParent = S.$form.closest('.layout-region-node-main, .node-form');
    $formParent.hide();
    $('#vpmApp').remove();
    var $app = $('<div id="vpmApp" class="vpm-app"></div>');
    $formParent.before($app);
    $app.html(renderAppShell());
    renderCurrentView();
    $(document).off('click.vpm1-toolbar').on('click.vpm1-toolbar', '#toolbar-bar .toolbar-tab a, .toolbar-toggle-orientation button', function() {
      setTimeout(_recalcToolbarHeight, 300);
    });
  }

  function renderAppShell() {
    return renderHeader() + '<div class="vpm-body">' + renderSidebar() + '<div class="vpm-main"><div class="vpm-content" id="vpmContent"></div></div></div><div id="vpmToasts" class="vpm-toast-container"></div>';
  }

  function renderHeader() {
    var v = S.data.video || {};
    var stageOrder = getStageOrder();
    var html = '<div class="vpm-header"><div class="vpm-header-left">';
    html += '<button class="vpm-btn-icon vpm-sidebar-toggle" id="vpmSidebarToggle">' + icon('bars') + '</button>';
    html += '<div class="vpm-header-brand">' + icon('film') + ' <span class="vpm-header-title">VPM</span></div>';
    // Mode badge
    html += '<span class="vpm-mode-badge vpm-mode-' + S.mode + '">' + (S.mode === 'standard' ? 'Standard' : 'Advanced') + ' \u00B7 ' + stageOrder.length + ' stages</span>';
    html += '</div><div class="vpm-header-center">';
    if (v.title) html += '<span class="vpm-header-project">' + esc(truncate(v.title, 50)) + '</span>';
    html += '</div><div class="vpm-header-right">' + statusBadge(S.computedStatus);
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" id="vpmSaveNodeBtn">' + icon('floppy-disk') + ' Save</button>';
    html += '<span class="vpm-last-saved" id="vpmLastSaved">' + (S.lastSaved ? icon('circle-check') + ' ' + formatRelativeTime(S.lastSaved) : '') + '</span>';
    html += '</div></div>';
    return html;
  }

  function renderSidebar() {
    var stageOrder = getStageOrder();
    var collapsed = S.sidebarCollapsed;
    // Overlay is OUTSIDE sidebar as a sibling
    var html = '<div id="vpmSidebarOverlay" class="vpm-sidebar-overlay' + (S.sidebarHidden ? '' : ' vpm-sidebar-overlay-visible') + '"></div>';
    html += '<div class="vpm-sidebar' + (S.sidebarHidden ? ' vpm-sidebar-hidden' : '') + (collapsed ? ' vpm-sidebar-collapsed' : '') + '" id="vpmSidebar">';
    // Sidebar header with collapse toggle
    html += '<div class="vpm-sidebar-header">';
    html += '<div class="vpm-sidebar-brand">' + icon('film') + '<span class="vpm-sidebar-brand-text">VPM</span></div>';
    html += '<button class="vpm-sidebar-collapse-btn" data-action="toggle-sidebar-collapse" title="' + (collapsed ? 'Expand' : 'Collapse') + '">' + icon(collapsed ? 'chevron-right' : 'chevron-left') + '</button>';
    html += '</div>';
    html += '<nav class="vpm-nav">';
    html += '<div class="vpm-nav-label"><span class="vpm-nav-label-text">STAGES</span></div>';
    var _visited2 = (S.meta && S.meta._ui && Array.isArray(S.meta._ui.visited_stages)) ? S.meta._ui.visited_stages : [];
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var isVisited = !isActive && !isDone && _visited2.indexOf(key) !== -1;
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isVisited ? ' vpm-nav-visited' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + (isVisited ? ' (visited — not confirmed)' : '') + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else if (isVisited) html += icon('circle-dot');
      else html += '<span class="vpm-nav-step">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(stage.label) + '</div>';
      html += '<div class="vpm-nav-desc' + (isActive ? ' vpm-nav-desc-active' : '') + '">' + esc(stage.description) + '</div>';
      // Progress bar (only for non-complete, non-future stages)
      if (!isDone && !isFuture && progress > 0) {
        html += '<div class="vpm-nav-progress"><div class="vpm-nav-progress-fill" style="width:' + progress + '%"></div></div>';
      }
      html += '</div></button>';
    }
    html += '<div class="vpm-nav-divider"></div><div class="vpm-nav-label"><span class="vpm-nav-label-text">VIEWS</span></div>';
    for (var uid in UTILITY_VIEWS) {
      var uv = UTILITY_VIEWS[uid];
      html += '<button class="vpm-nav-item vpm-nav-util' + (S.currentStage === uid ? ' vpm-nav-active' : '') + '" data-action="navigate" data-stage="' + uid + '" title="' + esc(uv.label) + '"><div class="vpm-nav-dot vpm-nav-dot-util">' + icon(uv.icon) + '</div><div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(uv.label) + '</div></div></button>';
    }
    html += '</nav><div class="vpm-sidebar-footer"><span class="vpm-sidebar-footer-text">VPM v1.0</span></div></div>';
    return html;
  }

  function renderCurrentView() {
    var $c = $('#vpmContent');
    if (!$c.length) return;
    try { $(document).trigger('vpm:beforeRender', [S.currentStage]); } catch (e) {}
    var R = window._vpmRenderers, html = '';
    try {
      switch (S.currentStage) {
        case 'start':     html = (R.startFull)     ? R.startFull()     : renderStartCompact(); break;
        case 'research':  html = (R.researchFull)  ? R.researchFull()  : renderResearchCompact(); break;
        case 'blueprint': html = (R.blueprintFull) ? R.blueprintFull() : renderBlueprintCompact(); break;
        case 'script':    html = (R.scriptFull)    ? R.scriptFull()    : renderScriptCompact(); break;
        case 'studio':    html = (R.studioFull)    ? R.studioFull()    : renderStudioCompact(); break;
        case 'clips':     html = (R.clipsFull)     ? R.clipsFull()     : renderClipsCompact(); break;
        case 'publish':   html = (R.publishFull)   ? R.publishFull()   : renderPublishCompact(); break;
        case 'activity':  html = (R.activityFull)  ? R.activityFull()  : renderActivityView(); break;
        case 'settings':  html = (R.settingsFull)  ? R.settingsFull()  : renderSettingsPlaceholder(); break;
        default: html = renderStartCompact();
      }
    } catch (e) {
      console.error('[VPM] Render error on "' + S.currentStage + '":', e.message, e.stack);
      html = '<div class="vpm-view" style="padding:40px"><div class="vpm-panel" style="border-color:var(--vpm-error)"><h3>Render Error</h3><p>' + esc(e.message) + '</p><pre style="font-size:11px;overflow:auto;max-height:200px">' + esc(e.stack || '') + '</pre></div></div>';
    }
    // Fade transition: quick opacity swap
    if (S.previousStage && S.previousStage !== S.currentStage) {
      $c.css({ opacity: 0, transform: 'translateY(6px)' });
      $c.html(html);
      setTimeout(function() { $c.css({ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.2s ease, transform 0.2s ease' }); }, 20);
      // Reset transition after animation
      setTimeout(function() { $c.css({ transition: '' }); }, 250);
    } else {
      $c.html(html);
    }
    $(document).trigger('vpm:afterRender', [S.currentStage]);
    _updateLastSaved();
  }

  function render() { _captureUIState(); _refreshSidebarNav(); renderCurrentView(); }


  // ============================================================
  // SECTION 9: COMPACT VIEW RENDERERS (Fallbacks for Part 2A)
  // ============================================================

  function _viewHeader(iconName, title, subtitle) {
    return '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon(iconName) + ' ' + esc(title) + '</h2>' + (subtitle ? '<p class="vpm-view-subtitle">' + esc(subtitle) + '</p>' : '') + '</div></div>';
  }
  function _emptyHero(iconName, title, desc, ctaHtml) {
    return '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon(iconName) + '</div><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' + (ctaHtml || '') + '</div>';
  }

  // S9: Start
  function renderStartCompact() {
    var html = _viewHeader('rocket', 'Start', 'Configure your video project');
    if (S.startComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Idea processed. Mode: <strong>' + S.mode + '</strong></p></div>';
    } else {
      html += _emptyHero('rocket', 'Start Your Video', 'Choose your mode, set preferences, and describe your video idea.', '<button class="vpm-btn vpm-btn-primary" data-action="navigate" data-stage="start">Get Started</button>');
    }
    html += renderNavButtons(null, 'Continue to ' + (S.mode === 'advanced' ? 'Research' : 'Blueprint'), S.mode === 'advanced' ? 'research' : 'blueprint');
    html += '</div>';
    return html;
  }

  // S10: Research
  function renderResearchCompact() {
    var html = _viewHeader('magnifying-glass', 'Research', 'AI-powered content research');
    if (S.researchComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Research complete</p></div>';
    } else {
      html += _emptyHero('magnifying-glass', 'Research Your Topic', 'AI analyzes your topic for audience insights, competitor gaps, and trending angles.');
    }
    html += renderNavButtons('Start', 'Continue to Blueprint', 'blueprint') + '</div>';
    return html;
  }

  // S11: Blueprint
  function renderBlueprintCompact() {
    var bp = S.data.blueprint || {};
    var html = _viewHeader('compass-drafting', 'Blueprint', 'Video plan & section structure');
    if (S.blueprintComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Blueprint confirmed</p>';
      if (bp.title) html += '<p><strong>' + esc(bp.title) + '</strong></p>';
      var secs = bp.sections || [];
      if (secs.length) { html += '<div class="vpm-text-sm vpm-text-muted">' + secs.length + ' sections</div>'; }
      html += '</div>';
    } else {
      html += _emptyHero('compass-drafting', 'Plan Your Video', 'Define sections, timing, and structure before writing the script.');
    }
    var prev = S.mode === 'advanced' ? 'Research' : 'Start';
    html += renderNavButtons(prev, 'Continue to Script', 'script') + '</div>';
    return html;
  }

  // S12: Script
  function renderScriptCompact() {
    var sc = S.data.script || {};
    var secs = sc.sections || [];
    var html = _viewHeader('file-lines', 'Script', 'Write content section by section');
    html += '<div class="vpm-panel">';
    if (S.scriptFinalized) {
      html += '<p class="vpm-text-success">' + icon('lock') + ' Script finalized \u2014 ' + (sc.total_word_count || 0) + ' words, ~' + formatDuration(sc.estimated_duration || 0) + '</p>';
    } else if (secs.length) {
      html += '<p>' + secs.length + ' sections \u00B7 ' + (sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</p>';
    } else {
      html += _emptyHero('file-lines', 'Write Your Script', 'Sections from your Blueprint appear here as editors. Use AI to generate content.');
    }
    html += '</div>';
    var next = S.mode === 'advanced' ? 'Continue to Studio' : 'Continue to Clips';
    var nextStage = S.mode === 'advanced' ? 'studio' : 'clips';
    html += renderNavButtons('Blueprint', next, nextStage) + '</div>';
    return html;
  }

  // S13: Studio
  function renderStudioCompact() {
    var html = _viewHeader('palette', 'Studio', 'Looks, environments & scenes');
    html += '<div class="vpm-panel"><div class="vpm-flex-row" style="gap:16px;flex-wrap:wrap">';
    html += '<div>' + icon('user-check') + ' <strong>' + S.allLooks.length + '</strong> Looks</div>';
    html += '<div>' + icon('panorama') + ' <strong>' + S.allEnvironments.length + '</strong> Environments</div>';
    html += '<div>' + icon('image') + ' <strong>' + S.allScenes.length + '</strong> Scenes</div>';
    html += '</div></div>';
    html += renderNavButtons('Script', 'Continue to Clips', 'clips') + '</div>';
    return html;
  }

  // S14: Clips
  function renderClipsCompact() {
    var clips = S.data.clips || [];
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    var html = _viewHeader('film', 'Clips', done + '/' + clips.length + ' clips complete');
    if (clips.length) {
      html += '<div class="vpm-panel">';
      html += '<div class="vpm-flex-row" style="gap:8px;margin-bottom:8px">' + trackBadge('ai') + ' ' + S.clipStats.totalAI + ' &nbsp;' + trackBadge('non-ai') + ' ' + S.clipStats.totalNonAI + ' &nbsp;' + trackBadge('template') + ' ' + S.clipStats.totalTemplate + '</div>';
      html += renderTimelineBar(clips);
      html += progressBar(Math.round((done / Math.max(clips.length, 1)) * 100));
      html += '</div>';
    } else {
      html += _emptyHero('film', 'Create Clips', 'AI breaks your script into clips. Each clip becomes a production task.');
    }
    var prev = S.mode === 'advanced' ? 'Studio' : 'Script';
    html += renderNavButtons(prev, 'Continue to Publish', 'publish') + '</div>';
    return html;
  }

  // S15: Publish
  function renderPublishCompact() {
    var yt = (S.data.publishing || {}).youtube || {};
    var html = _viewHeader('share-nodes', 'Publish', 'Metadata, thumbnails & export');
    html += '<div class="vpm-panel">';
    if (yt.title) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><div class="vpm-input-display">' + esc(yt.title) + '</div></div>';
    }
    html += '</div>';
    html += '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('download') + ' Export</h3><div class="vpm-export-btns">';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="export-json">' + icon('download') + ' JSON</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-script">' + icon('file-lines') + ' Script</button>';
    html += '</div></div>';
    html += renderNavButtons('Clips', null) + '</div>';
    return html;
  }

  // S16: Activity
  function renderActivityView() {
    var list = getFilteredActivity();
    var html = _viewHeader('clock-rotate-left', 'Activity', (S.activity || []).length + ' entries');
    html += '<div class="vpm-panel vpm-panel-sm"><div class="vpm-flex-row"><input class="vpm-input vpm-input-sm" data-action="filter-activity" placeholder="Search\u2026" value="' + esc(S.activityFilter.search || '') + '">';
    html += '<select class="vpm-select vpm-select-sm" data-action="filter-activity-type"><option value="">All</option>';
    for (var atId in ACTIVITY_TYPES) html += '<option value="' + atId + '"' + (S.activityFilter.type === atId ? ' selected' : '') + '>' + esc(ACTIVITY_TYPES[atId].label) + '</option>';
    html += '</select></div></div><div class="vpm-panel" style="padding:0">';
    if (!list.length) html += _emptyHero('clock-rotate-left', 'No Activity Yet', 'Actions will appear here as you work.');
    for (var ai = 0; ai < Math.min(list.length, 50); ai++) {
      var act = list[ai], at = ACTIVITY_TYPES[act.type] || { label: act.type, icon: 'circle' };
      html += '<div class="vpm-activity-item"><div class="vpm-activity-icon">' + icon(at.icon) + '</div><div class="vpm-activity-content"><div class="vpm-activity-desc">' + esc(act.description) + '</div><div class="vpm-activity-meta">' + esc(formatRelativeTime(act.timestamp)) + (act.user_name ? ' \u00B7 ' + esc(act.user_name) : '') + '</div></div></div>';
    }
    html += '</div></div>';
    return html;
  }

  // S17: Settings placeholder
  function renderSettingsPlaceholder() {
    return '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('gear') + ' Settings</h2></div></div><div class="vpm-panel"><div class="vpm-empty-state">' + icon('loader') + ' Loading\u2026</div></div></div>';
  }


  // ============================================================
  // SECTION 10: SHARED VIEW HELPERS
  // ============================================================

  function renderNavButtons(prevLabel, nextLabel, nextStage) {
    var stageOrder = getStageOrder();
    var curIdx = stageOrder.indexOf(S.currentStage);
    var html = '<div class="vpm-nav-buttons">';
    // Previous
    if (prevLabel) {
      var ps = curIdx > 0 ? stageOrder[curIdx - 1] : '';
      // Auto-resolve label from stage name if just a stage key
      var prevDisplay = prevLabel;
      if (APP_STAGES[prevLabel]) prevDisplay = APP_STAGES[prevLabel].label;
      html += '<button class="vpm-btn vpm-btn-outline" data-action="navigate" data-stage="' + ps + '">' + icon('arrow-left') + ' ' + esc(prevDisplay) + '</button>';
    }
    html += '<div class="vpm-nav-spacer"></div>';
    // Next
    if (nextLabel) {
      if (!nextStage) { if (curIdx < stageOrder.length - 1) nextStage = stageOrder[curIdx + 1]; }
      var access = nextStage ? canAccessStage(nextStage) : { allowed: true, warning: '' };
      var hasWarning = !!(access.warning);
      html += '<button class="vpm-btn vpm-btn-primary" data-action="navigate" data-stage="' + (nextStage || '') + '"' + (hasWarning ? ' title="' + esc(access.warning) + '"' : '') + '>' + esc(nextLabel) + ' ' + icon('arrow-right') + '</button>';
    }
    html += '</div>';
    return html;
  }

  function renderClipList(clips, selectedId) {
    var html = '<div class="vpm-clip-list">';
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i], ct = CLIP_TYPES[c.type] || {}, track = c.track || ct.track || 'ai', isA = c.id === selectedId;
      html += '<button class="vpm-clip-list-item' + (isA ? ' vpm-clip-list-active' : '') + '" data-action="select-clip" data-clip-id="' + c.id + '">';
      html += '<span class="vpm-clip-order">#' + c.order + '</span>';
      html += '<div class="vpm-clip-status-dot" style="background:' + _csColor(c.status, track) + '"></div>';
      html += '<div class="vpm-clip-list-info"><div class="vpm-clip-list-title">' + esc(truncate(c.title || 'Untitled', 28)) + '</div><div class="vpm-clip-list-meta">' + clipTypeBadge(c.type) + '</div></div>';
      html += '<span class="vpm-clip-list-dur">' + (c.duration || 0) + 's</span></button>';
    }
    html += '</div>';
    return html;
  }

  function renderClipCard(clip) {
    var ct = CLIP_TYPES[clip.type] || {}, track = clip.track || ct.track || 'ai';
    var prereqs = getClipPrerequisites(clip);
    var hasErr = prereqs.some(function(p) { return p.severity === 'error'; });
    var hasWarn = !hasErr && prereqs.some(function(p) { return p.severity === 'warning'; });
    return '<div class="vpm-clip-card"><span class="vpm-clip-card-order">#' + clip.order + '</span>' + clipTypeBadge(clip.type) + '<span class="vpm-clip-card-title">' + esc(truncate(clip.title || 'Untitled', 40)) + '</span>' + trackBadge(track) + '<span class="vpm-clip-card-dur">' + (clip.duration || 0) + 's</span>' + (hasErr ? '<span class="vpm-prereq-dot vpm-prereq-dot-err" title="Missing prerequisites">' + icon('triangle-exclamation') + '</span>' : hasWarn ? '<span class="vpm-prereq-dot vpm-prereq-dot-warn" title="Missing setup">' + icon('circle-exclamation') + '</span>' : '') + '</div>';
  }

  function renderTimelineBar(clips) {
    if (!clips || !clips.length) return '';
    var html = '<div class="vpm-timeline-bar">';
    for (var i = 0; i < clips.length; i++) {
      var ct = CLIP_TYPES[clips[i].type] || {};
      var trackColor = ct.track === 'ai' ? '#7c3aed' : ct.track === 'non-ai' ? '#e37400' : '#9ca3af';
      html += '<div class="vpm-timeline-segment" data-action="timeline-select-clip" data-clip-id="' + clips[i].id + '" style="flex:' + (clips[i].duration || 1) + ';background:' + trackColor + '" title="#' + clips[i].order + ' ' + esc(clips[i].title || '') + ' (' + (clips[i].duration || 0) + 's)"></div>';
    }
    html += '</div>';
    return html;
  }

  function renderProductionProgress() {
    var st = S.clipStats, d = st.aiDone + st.nonAiDone + st.templateDone, t = st.total || 1;
    return '<div class="vpm-production-progress">' + progressBar(Math.round((d / t) * 100)) + '<div class="vpm-flex-between vpm-mt-xs"><span class="vpm-text-sm vpm-text-muted">' + d + ' done</span><span class="vpm-text-sm vpm-text-muted">' + Math.round((d / t) * 100) + '%</span></div></div>';
  }

  function _csColor(status, track) { var sm = (track === 'non-ai') ? NON_AI_CLIP_STATUSES : (track === 'template') ? TEMPLATE_CLIP_STATUSES : AI_CLIP_STATUSES; return (sm[status] || {}).color || '#9ca3af'; }


  // ============================================================
  // SECTION 11: EVENT HANDLERS
  // ============================================================

  function setupEventHandlers() {
    // Navigation
    $(document).off('click.vpm1-nav').on('click.vpm1-nav', '[data-action="navigate"]', function() { var s = $(this).data('stage'); if (s) navigateToStage(s); });
    // Sidebar collapse toggle (desktop icon-rail mode)
    $(document).off('click.vpm1-collapse').on('click.vpm1-collapse', '[data-action="toggle-sidebar-collapse"]', function() {
      S.sidebarCollapsed = !S.sidebarCollapsed;
      $('#vpmSidebar').toggleClass('vpm-sidebar-collapsed', S.sidebarCollapsed);
      // Update chevron icon
      $(this).attr('title', S.sidebarCollapsed ? 'Expand' : 'Collapse').html(icon(S.sidebarCollapsed ? 'chevron-right' : 'chevron-left'));
    });
    // Sidebar mobile toggle (hamburger)
    $(document).off('click.vpm1-toggle').on('click.vpm1-toggle', '#vpmSidebarToggle', function() {
      S.sidebarHidden = !S.sidebarHidden;
      $('#vpmSidebar').toggleClass('vpm-sidebar-hidden', S.sidebarHidden);
      $('#vpmSidebarOverlay').toggleClass('vpm-sidebar-overlay-visible', !S.sidebarHidden);
    });
    $(document).off('click.vpm1-overlay').on('click.vpm1-overlay', '#vpmSidebarOverlay', function() {
      S.sidebarHidden = true;
      $('#vpmSidebar').addClass('vpm-sidebar-hidden');
      $('#vpmSidebarOverlay').removeClass('vpm-sidebar-overlay-visible');
    });
    // Save
    $(document).off('click.vpm1-save').on('click.vpm1-save', '#vpmSaveNodeBtn', function() { triggerDrupalSave(); });
    // Clip selection
    $(document).off('click.vpm1-clip-sel').on('click.vpm1-clip-sel', '[data-action="select-clip"]', function() {
      var cid = $(this).data('clip-id'); if (!cid) return;
      S.selectedClipId = cid;
      var cl = S.clipMap[cid]; if (cl) { var tr = cl.track || (CLIP_TYPES[cl.type] || {}).track || 'ai'; S.currentClipDetailTab = tr === 'ai' ? 'script-config' : tr === 'non-ai' ? 'planning' : 'template'; }
      renderCurrentView();
    });
    // Timeline click
    $(document).off('click.vpm1-tl-sel').on('click.vpm1-tl-sel', '[data-action="timeline-select-clip"]', function() {
      var cid = $(this).data('clip-id'); if (!cid || !S.clipMap[cid]) return;
      S.selectedClipId = cid;
      var cl = S.clipMap[cid]; var tr = cl.track || (CLIP_TYPES[cl.type] || {}).track || 'ai';
      S.currentClipDetailTab = tr === 'ai' ? 'script-config' : tr === 'non-ai' ? 'planning' : 'template';
      navigateToStage('clips');
    });
    // Activity filter
    $(document).off('input.vpm1-act-search').on('input.vpm1-act-search', '[data-action="filter-activity"]', debounce(function() { S.activityFilter.search = $(this).val(); renderCurrentView(); }, 300));
    $(document).off('change.vpm1-act-type').on('change.vpm1-act-type', '[data-action="filter-activity-type"]', function() { S.activityFilter.type = $(this).val(); renderCurrentView(); });
  }

  function _setNested(obj, path, value) { var p = path.split('.'), t = obj; for (var i = 0; i < p.length - 1; i++) { if (!t[p[i]] || typeof t[p[i]] !== 'object') t[p[i]] = {}; t = t[p[i]]; } t[p[p.length - 1]] = value; }


  // ============================================================
  // SECTION 12: SYNC, SAVE & AUTO-SAVE
  // ============================================================

  function syncToTextarea() {
    if (!S.$dataField || !S.$dataField.length) return;
    _captureUIState();
    S.data.video.modified = new Date().toISOString();
    S.$dataField.val(JSON.stringify(S.data));
    S.$metaField.val(JSON.stringify(S.meta));
    if (S.$activityField && S.$activityField.length) S.$activityField.val(JSON.stringify(S.activity));
    S.dirty = true;
  }

  function triggerDrupalSave() {
    syncToTextarea();
    if (S.$submitBtn && S.$submitBtn.length) {
      S.$submitBtn.click();
      S.dirty = false;
      S.lastSaved = new Date().toISOString();
      _updateLastSaved();
    }
  }

  function startAutoSave() {
    if (S.autoSaveTimer) clearInterval(S.autoSaveTimer);
    S.autoSaveTimer = setInterval(function() {
      if (S.dirty) { syncToTextarea(); }
      _updateLastSaved();
    }, 30000);
  }

  function _updateLastSaved() {
    var $el = $('#vpmLastSaved');
    if (!$el.length) return;
    if (S.lastSaved) $el.html(icon('circle-check') + ' ' + formatRelativeTime(S.lastSaved));
    else if (S.dirty) $el.html(icon('circle') + ' Unsaved');
  }

  // Undo/redo placeholder — wired up in Part 2A
  function snapshot(label) { /* Part 2A provides real implementation */ }


  // ============================================================
  // SECTION 13: TOAST NOTIFICATIONS
  // ============================================================

  function toast(message, type, duration) {
    type = type || 'info';
    // Type-specific durations: errors/warnings longer, success/info shorter
    if (!duration) {
      switch (type) {
        case 'error':   duration = 6000; break;
        case 'warning': duration = 5000; break;
        case 'success': duration = 3000; break;
        default:        duration = 3500;
      }
    }
    var $c = $('#vpmToasts'); if (!$c.length) return;
    // Max stack: remove oldest if > 4
    var $existing = $c.children('.vpm-toast');
    if ($existing.length >= 4) $existing.first().remove();
    var im = { success: 'circle-check', error: 'circle-exclamation', warning: 'warning', info: 'circle-info' };
    var $t = $('<div class="vpm-toast vpm-toast-' + type + '"><span class="vpm-toast-icon">' + icon(im[type] || 'circle-info') + '</span><span class="vpm-toast-msg">' + esc(message) + '</span><button class="vpm-toast-close">' + icon('xmark') + '</button></div>');
    $t.find('.vpm-toast-close').on('click', function() { $t.removeClass('vpm-toast-show'); setTimeout(function() { $t.remove(); }, 300); });
    $c.append($t);
    setTimeout(function() { $t.addClass('vpm-toast-show'); }, 10);
    setTimeout(function() { $t.removeClass('vpm-toast-show'); setTimeout(function() { $t.remove(); }, 300); }, duration);
  }


  // ============================================================
  // SECTION 14: FACTORY FUNCTIONS
  // ============================================================

  function getDefaultData() {
    return {
      start: {
        mode: 'advanced', raw_input: '',
        preferences: {
          language: 'english', audio_mode: 'ai-audio-with-video', platform: 'youtube', platforms: ['youtube'],
          aspect_ratio: '16:9', target_duration: 120, production_mode: 'full-ai', presenter_preference: 'ai-only',
          video_style: '', voice_profile: { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' },
          selected_video_models: [], selected_image_models: [], primary_video_model: '', primary_image_model: ''
        },
        llm_response: '', processed: false, processed_at: '', import_source: null, selected_clip_types: [],
        brand_selections: { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false }
      },
      video: { title: '', description: '', target_audience: '', tone: '', language: '', platform: 'youtube', aspect_ratio: '16:9', duration_target: 0, production_mode: '', presenter_preference: '', video_style: '', keywords: [], created: '', modified: '' },
      research: { audience_insights: '', competitor_analysis: '', trending_angles: '', content_strategy: '', sources: [], generated: false, generated_at: '' },
      blueprint: { title: '', description: '', sections: [], style_notes: '', tone: '', target_audience: '', confirmed: false, confirmed_at: '' },
      script: { sections: [], total_word_count: 0, estimated_duration: 0, finalized: false, finalized_at: '', versions: [] },
      clips: [],
      publishing: {
        youtube: { title: '', title_options: [], description: '', tags: [], hashtags: [], category: 'education', chapters: [], thumbnail_text: '', thumbnail_url: '', visibility: 'public', premiere_scheduled: '' },
        instagram: { caption: '', hashtags: [], cover_frame_clip: '' },
        tiktok: { caption: '', hashtags: [] },
        linkedin: { post_text: '' },
        derivatives: [], content: { blog_post: '', social_posts: [], thumbnail_brief: '' }, export_history: []
      },
      thumbnails: { ideas: [], selected_idea_id: '', chat_history: [], finalized_prompt: null, generated_at: '' }
    };
  }

  function getDefaultMeta() {
    return {
      settings: { words_per_minute: 150, default_clip_duration: 8, default_clip_type: 'ai-visual', default_language: 'english', default_tone: 'friendly', default_aspect_ratio: '16:9', default_platform: 'youtube', default_production_mode: 'full-ai', default_presenter: 'ai-only', default_audio_mode: 'ai-audio-with-video', show_ai_preflight: true, ai_global_instructions: '', strict_ai_duration: true, snap_to_model_durations: true, video_model_overrides: {}, app_version: '1.0.0' },
      aiPreferences: { appDefault: { provider: 'gemini', model: 'gemini-2.5-flash' }, lastProvider: '', lastModel: '', imageModel: 'imagen-3', videoModel: 'seedance', globalNegative: 'watermark, text overlay, logo, low quality, blurry, distorted, cartoon, anime', perAction: {}, lastCustomInstructions: {} },
      lookLibrary: [], environmentLibrary: [], sceneLibrary: [],
      brandOverrides: { enabled: false, name: '', tagline: '', primary_color: '', secondary_color: '', accent_color: '', voice: '', target_audience: '', logo_url: '', font_family: '' },
      studioRequirements: {},
      _ui: { last_stage: '', start_step: '', selected_clip_id: '', clip_detail_tab: '', studio_tab: '', settings_tab: '', platform_tab: '', thumbnail_step: '', visited_stages: [], updated_at: '' }
    };
  }

  function createDefaultClip(type, section) {
    var ct = CLIP_TYPES[type] || CLIP_TYPES['ai-visual'];
    var track = ct.track || 'ai';
    var dur = getSmartClipDuration(type);
    var clip = { id: generateId('clip'), order: (S.data.clips || []).length + 1, title: '', type: type, section: section || 'body', track: track, script_text: '', onscreen_text: '', visual_direction: '', delivery_notes: '', notes: '', duration: dur, timing: { start: 0, end: dur }, status: track === 'ai' ? 'draft' : track === 'non-ai' ? 'planned' : 'pending', production_config: { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true } };
    if (track === 'ai') clip.prompt_set = createEmptyPromptSet(type);
    if (track === 'non-ai') clip.non_ai_planning = createDefaultNonAiPlanning();
    if (track === 'template') clip.template_id = '';
    return clip;
  }

  // Lightweight clip — ONLY wireframe fields, no prompt_set/non_ai_planning/production_config
  // Used for AI clip generation; heavy structures created lazily via ensure*()
  function createLightweightClip(type, section, order) {
    var ct = CLIP_TYPES[type] || CLIP_TYPES['ai-visual'];
    var track = ct.track || 'ai';
    var dur = getSmartClipDuration(type);
    return {
      id: generateId('clip'), order: order || 1, title: '', type: type,
      section: section || 'body', track: track, script_text: '', onscreen_text: '',
      visual_direction: '', delivery_notes: '', notes: '', duration: dur,
      timing: { start: 0, end: dur },
      status: track === 'ai' ? 'draft' : track === 'non-ai' ? 'planned' : 'pending'
    };
  }

  // Lazy-ensure: creates prompt_set on-demand when user opens AI clip detail
  function ensurePromptSet(clip) {
    if (clip.prompt_set) return clip.prompt_set;
    clip.prompt_set = createEmptyPromptSet(clip.type);
    return clip.prompt_set;
  }

  // Lazy-ensure: creates non_ai_planning on-demand when user opens Non-AI clip detail
  function ensureNonAiPlanning(clip) {
    if (clip.non_ai_planning) return clip.non_ai_planning;
    clip.non_ai_planning = createDefaultNonAiPlanning();
    return clip.non_ai_planning;
  }

  // Lazy-ensure: creates production_config on-demand when user edits production settings
  function ensureProductionConfig(clip) {
    if (clip.production_config) return clip.production_config;
    clip.production_config = { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true };
    return clip.production_config;
  }

  // Normalize clip type: maps fuzzy LLM output to valid CLIP_TYPES key
  function normalizeClipType(raw) {
    if (!raw) return 'ai-visual';
    var t = raw.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (CLIP_TYPES[t]) return t;
    // Fuzzy map
    var map = {
      'visual': 'ai-visual', 'ai': 'ai-visual', 'aivisual': 'ai-visual', 'broll': 'ai-broll', 'b-roll': 'ai-broll',
      'character': 'ai-character', 'aicharacter': 'ai-character', 'presenter': 'human-presenter',
      'human': 'human-presenter', 'humanpresenter': 'human-presenter', 'talking-head': 'human-presenter',
      'screen': 'screen-recording', 'screenrecording': 'screen-recording', 'recording': 'screen-recording',
      'screenwithcam': 'screen-with-cam', 'screen-with-camera': 'screen-with-cam',
      'intro': 'branded-intro', 'brandedintro': 'branded-intro',
      'outro': 'branded-outro', 'brandedoutro': 'branded-outro',
      'chapter': 'chapter-title', 'chaptertitle': 'chapter-title', 'title': 'chapter-title',
      'text': 'text-card', 'textcard': 'text-card', 'card': 'text-card'
    };
    if (map[t]) return map[t];
    // Partial match: check if raw contains a known type key
    for (var k in CLIP_TYPES) {
      if (t.indexOf(k.replace(/-/g, '')) >= 0 || k.replace(/-/g, '').indexOf(t) >= 0) return k;
    }
    return 'ai-visual';
  }

  // Resolve section ID from fuzzy LLM output against blueprint sections
  function resolveSectionId(raw) {
    if (!raw) return 'body';
    var sections = ((S.data.blueprint || {}).sections || []);
    if (!sections.length) return raw || 'body';
    // Exact match by id
    for (var i = 0; i < sections.length; i++) { if (sections[i].id === raw) return raw; }
    // Match by label (case-insensitive)
    var lower = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var j = 0; j < sections.length; j++) {
      var secLower = (sections[j].label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (secLower === lower) return sections[j].id;
    }
    // Partial match (label contains raw or vice versa)
    for (var k = 0; k < sections.length; k++) {
      var sl = (sections[k].label || '').toLowerCase();
      if (sl.indexOf(raw.toLowerCase()) >= 0 || raw.toLowerCase().indexOf(sl) >= 0) return sections[k].id;
    }
    // Match by section number pattern: "section 3" → third section
    var numMatch = raw.match(/(\d+)/);
    if (numMatch) {
      var idx = parseInt(numMatch[1], 10) - 1;
      if (idx >= 0 && idx < sections.length) return sections[idx].id;
    }
    return raw || 'body';
  }

  // Resolve voice profile for a clip — checks look's voice, falls back to project default
  function resolveVoiceProfile(clip) {
    var projectVP = ((S.data.start || {}).preferences || {}).voice_profile || {};
    if (!clip || clip.type !== 'ai-character') return projectVP;
    var ps = clip.prompt_set || {};
    var lookIds = ((ps.first_frame || {}).scene || {}).look_ids || [];
    if (lookIds.length) {
      var look = S.lookMap ? S.lookMap[lookIds[0]] : null;
      if (look && look.voice_profile && (look.voice_profile.style || look.voice_profile.custom_description)) {
        return look.voice_profile;
      }
    }
    return projectVP;
  }

  // Phase 4: Prerequisite check for clips — returns array of warnings/errors
  function getClipPrerequisites(clip) {
    var warnings = [];
    if (!clip) return warnings;
    var ct = CLIP_TYPES[clip.type] || {};
    // AI Character clip without any presenter looks
    if (clip.type === 'ai-character') {
      var presenterLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador' || l.role === 'supporting'; });
      if (!presenterLooks.length) {
        warnings.push({ type: 'missing-look', severity: 'error', message: 'No character/look exists for AI Character clip', action: 'create-look', actionLabel: 'Create Character Look' });
      }
      // Check scene assignment
      var ps = clip.prompt_set || {};
      var ffScene = ((ps.first_frame || {}).scene || {});
      if (!ffScene.scene_template_id && !(ffScene.look_ids && ffScene.look_ids.length)) {
        warnings.push({ type: 'missing-scene', severity: 'warning', message: 'No scene assigned — character needs environment context', action: 'assign-scene', actionLabel: 'Assign Scene' });
      }
    }
    // Voice profile check for AI audio mode
    var audioMode = ((S.data.start || {}).preferences || {}).audio_mode || '';
    var audioModeDef = AUDIO_MODES[audioMode] || {};
    if (audioModeDef.supportsVoiceProfile && ct.track === 'ai') {
      var vp = ((S.data.start || {}).preferences || {}).voice_profile || {};
      if (!vp.style && !vp.custom_description) {
        warnings.push({ type: 'missing-voice', severity: 'info', message: 'No voice profile set — audio prompts will use defaults', action: 'set-voice-profile', actionLabel: 'Set Voice Profile' });
      }
    }
    return warnings;
  }

  // Normalize script content to HTML <p> tags
  function normalizeToHtml(content) {
    if (!content) return '';
    // Already has HTML tags
    if (/<\/?[a-z][\s\S]*>/i.test(content)) return content;
    // Plain text: split on double newlines or single newlines, wrap in <p>
    var paragraphs = content.split(/\n\n+|\n/).filter(function(p) { return p.trim(); });
    return paragraphs.map(function(p) { return '<p>' + p.trim() + '</p>'; }).join('');
  }

  function createEmptyPromptSet(clipType) {
    var ct = CLIP_TYPES[clipType] || {};
    return { requires_last_frame: !!ct.defaultLastFrame, first_frame: _createEmptyFrame(), last_frame: ct.defaultLastFrame ? _createEmptyFrame() : null, video: { prompt: createEmptyPrompt(), marked_done: false, done_at: null, notes: '' } };
  }

  function _createEmptyFrame() {
    return { scene: { environment_id: '', look_ids: [], scene_template_id: '', notes: '' }, prompt: createEmptyPrompt(), image_url: '', version: 0, version_notes: '', marked_done: false, done_at: null, implementation_guide: null };
  }

  function createEmptyPrompt() {
    return { positive: '', negative: '', style_keywords: [], parameters: {}, model: '', status: 'empty', generated_at: '' };
  }

  function createDefaultNonAiPlanning() {
    return { brief: '', instructions: '', recording_ref: '', marked_done: false, done_at: null };
  }

  function createDefaultLook() {
    return { id: generateId('look'), name: '', role: 'supporting', character_id: '', outfit_id: '', combined_prompt_fragment: '', description: '', reference_images: [], tags: [], voice_profile: { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' }, source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultEnvironment() {
    return { id: generateId('env'), name: '', type: 'indoor', description: '', prompt_fragment: '', reference_images: [], tags: [], source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultScene() {
    return { id: generateId('scene'), name: '', look_ids: [], environment_id: '', camera_direction: '', suggested_duration: 8, notes: '', source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultBodySection(order, label) {
    return { id: generateId('sec'), label: label || 'Section ' + order, content: '', word_count: 0, estimated_duration: 0, order: order || 1, notes: '' };
  }


  // ============================================================
  // SECTION 15: API EXPORTS
  // ============================================================

  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRender = renderCurrentView;
  window._vpmRenderApp = renderApp;
  window._vpmRefreshSidebarNav = _refreshSidebarNav;
  window._vpmNavigateToStage = navigateToStage;
  window._vpmToast = toast;
  window._vpmSnapshot = snapshot;
  window._vpmBuildMaps = buildMaps;
  window._vpmSyncToTextarea = syncToTextarea;
  window._vpmCaptureUIState = _captureUIState;
  window._vpmRestoreUIState = _restoreUIState;
  window._vpmEvaluateClipStatus = evaluateClipStatus;
  window._vpmMaybeAdvanceClipStatus = maybeAdvanceClipStatus;
  window._vpmCalculateVideoStatus = calculateVideoStatus;
  window._vpmComputeFlags = computeFlags;
  window._vpmCanAccessStage = canAccessStage;
  window._vpmGetStageStatus = getStageStatus;
  window._vpmIsStageComplete = isStageComplete;
  window._vpmGetStageProgress = getStageProgress;
  window._vpmGetStageOrder = getStageOrder;
  window._vpmRecomputeClipTimings = recomputeClipTimings;
  window._vpmRecomputeScriptDurations = recomputeScriptDurations;
  window._vpmRenderClipList = renderClipList;
  window._vpmRenderClipCard = renderClipCard;
  window._vpmRenderTimelineBar = renderTimelineBar;
  window._vpmRenderNavButtons = renderNavButtons;
  window._vpmRenderProductionProgress = renderProductionProgress;
  window._vpmCsColor = _csColor;
  window._vpmGetDefaultData = getDefaultData;
  window._vpmGetDefaultMeta = getDefaultMeta;
  window._vpmCreateDefaultClip = createDefaultClip;
  window._vpmCreateLightweightClip = createLightweightClip;
  window._vpmEnsurePromptSet = ensurePromptSet;
  window._vpmEnsureNonAiPlanning = ensureNonAiPlanning;
  window._vpmEnsureProductionConfig = ensureProductionConfig;
  window._vpmNormalizeClipType = normalizeClipType;
  window._vpmResolveSectionId = resolveSectionId;
  window._vpmNormalizeToHtml = normalizeToHtml;
  window._vpmCreateEmptyPromptSet = createEmptyPromptSet;
  window._vpmCreateEmptyFrame = _createEmptyFrame;
  window._vpmCreateEmptyPrompt = createEmptyPrompt;
  window._vpmCreateDefaultNonAiPlanning = createDefaultNonAiPlanning;
  window._vpmCreateDefaultLook = createDefaultLook;
  window._vpmCreateDefaultEnvironment = createDefaultEnvironment;
  window._vpmCreateDefaultScene = createDefaultScene;
  window._vpmCreateDefaultBodySection = createDefaultBodySection;
  window._vpmParseGalleries = parseGalleries;
  window._vpmQueueGalleryUpload = queueGalleryUpload;
  window._vpmTriggerGalleryRemove = triggerGalleryRemove;
  window._vpmParseBrandStudioLibrary = parseBrandStudioLibrary;
  window._vpmGetClipPrerequisites = getClipPrerequisites;
  window._vpmResolveVoiceProfile = resolveVoiceProfile;
  window._vpmSetNested = _setNested;

  console.log('[VPM] Part 1 v1.0 loaded \u2014 15 sections');

})(jQuery, Drupal);
