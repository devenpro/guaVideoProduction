/**
 * AI Video Production Manager v1.0 - Part 2B: AI & Settings Engine
 *
 * LLMService (8 providers), BrandService, AI action system with preflight/progress,
 * 11 AI actions (research, script, clips, frames, video, studio, metadata, brief,
 * thumbnails, idea analysis, script enhancement), Settings view (5 tabs),
 * config import/export, keyboard shortcuts.
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  // ============================================================
  // SECTION 1: INIT & IMPORTS
  // ============================================================

  var S, render, navigateToStage, toast, generateId, buildMaps, syncToTextarea;
  var logActivity, esc, deepClone, icon, truncate, stripHtml, countWords;
  var formatDate, formatRelativeTime, formatDuration, formatDurationLong, formatNumber;
  var badge, statusBadge, clipTypeBadge, trackBadge, clipStatusBadge, sourceBadge, roleBadge, progressBar;
  var estimateDuration, parseJSON, getSmartClipDuration, getModelDurationConfig, snapToModelDuration, validateClipDuration;
  var canAccessStage, evaluateClipStatus, maybeAdvanceClipStatus, recomputeClipTimings, recomputeScriptDurations;
  var createDefaultClip, createLightweightClip, createEmptyPromptSet, createDefaultBodySection, createDefaultLook, createDefaultEnvironment, createDefaultScene;
  var ensurePromptSet, ensureNonAiPlanning, ensureProductionConfig, normalizeClipType, resolveSectionId, normalizeToHtml;
  var renderNavButtons, Constants, setNested;
  var snapshot, openModal, closeModal, collectModalFields, openConfirmDialog, copyToClipboard, exportFile;

  var _checkCount = 0;
  var checkInterval = setInterval(function() {
    _checkCount++;
    if (window._vpmState && window._vpmState.initialized && window._vpmPart2AReady) { clearInterval(checkInterval); initPart2B(); }
    else if (_checkCount > 250) {
      clearInterval(checkInterval);
      console.error('[VPM] Part 2B: Timed out. _vpmState:', !!window._vpmState, ', Part2AReady:', !!window._vpmPart2AReady);
    }
  }, 100);

  function initPart2B() {
    console.log('[VPM] Initializing Part 2B...');
    S = window._vpmState;
    render = window._vpmRender; navigateToStage = window._vpmNavigateToStage;
    toast = window._vpmToast; generateId = window._vpmGenerateId;
    buildMaps = window._vpmBuildMaps; syncToTextarea = window._vpmSyncToTextarea;
    logActivity = window._vpmLogActivity; esc = window._vpmEsc;
    deepClone = window._vpmDeepClone; icon = window._vpmIcon;
    truncate = window._vpmTruncate; stripHtml = window._vpmStripHtml; countWords = window._vpmCountWords;
    formatDate = window._vpmFormatDate; formatRelativeTime = window._vpmFormatRelativeTime;
    formatDuration = window._vpmFormatDuration; formatDurationLong = window._vpmFormatDurationLong;
    formatNumber = window._vpmFormatNumber; estimateDuration = window._vpmEstimateDuration;
    parseJSON = window._vpmParseJSON; getSmartClipDuration = window._vpmGetSmartClipDuration;
    getModelDurationConfig = window._vpmGetModelDurationConfig; snapToModelDuration = window._vpmSnapToModelDuration;
    validateClipDuration = window._vpmValidateClipDuration;
    badge = window._vpmBadge; statusBadge = window._vpmStatusBadge;
    clipTypeBadge = window._vpmClipTypeBadge; trackBadge = window._vpmTrackBadge;
    clipStatusBadge = window._vpmClipStatusBadge; sourceBadge = window._vpmSourceBadge; roleBadge = window._vpmRoleBadge;
    progressBar = window._vpmProgressBar;
    canAccessStage = window._vpmCanAccessStage;
    evaluateClipStatus = window._vpmEvaluateClipStatus; maybeAdvanceClipStatus = window._vpmMaybeAdvanceClipStatus;
    recomputeClipTimings = window._vpmRecomputeClipTimings; recomputeScriptDurations = window._vpmRecomputeScriptDurations;
    createDefaultClip = window._vpmCreateDefaultClip; createEmptyPromptSet = window._vpmCreateEmptyPromptSet;
    createLightweightClip = window._vpmCreateLightweightClip;
    ensurePromptSet = window._vpmEnsurePromptSet; ensureNonAiPlanning = window._vpmEnsureNonAiPlanning;
    ensureProductionConfig = window._vpmEnsureProductionConfig;
    normalizeClipType = window._vpmNormalizeClipType; resolveSectionId = window._vpmResolveSectionId;
    normalizeToHtml = window._vpmNormalizeToHtml;
    createDefaultBodySection = window._vpmCreateDefaultBodySection;
    createDefaultLook = window._vpmCreateDefaultLook; createDefaultEnvironment = window._vpmCreateDefaultEnvironment;
    createDefaultScene = window._vpmCreateDefaultScene;
    renderNavButtons = window._vpmRenderNavButtons; Constants = window._vpmConstants;
    setNested = window._vpmSetNested;
    snapshot = window._vpmSnapshot;
    openModal = window._vpmOpenModal; closeModal = window._vpmCloseModal;
    collectModalFields = window._vpmCollectModalFields; openConfirmDialog = window._vpmOpenConfirmDialog;
    copyToClipboard = window._vpmCopyToClipboard;
    exportFile = window._vpmExportFile;

    var R = window._vpmRenderers;
    R.settingsFull = renderSettingsView;

    LLMService.init();
    BrandService.init();
    setupPart2BEvents();
    setupKeyboardShortcuts();
    console.log('[VPM] Part 2B v1.0 initialized \u2014 AI: ' + (LLMService.isConfigured() ? 'configured' : 'none') + ', Brand: ' + (BrandService.isConfigured() ? 'yes' : 'no'));
  }


  // ============================================================
  // LLM Service + AI Action System (defined in src/ai/llm-service.js)
  // ============================================================
  var LLMService = window._vpm.llmService;
  var _aa = window._vpm.aiActions;
  var AI_ACTIONS = _aa.AI_ACTIONS;
  var _openAIActionModal = _aa._openAIActionModal;
  var _showAIProgress = _aa._showAIProgress;
  var _hideAIProgress = _aa._hideAIProgress;
  var _cancelAI = _aa._cancelAI;
  var _buildCustomBlock = _aa._buildCustomBlock;
  var _launchAI = _aa._launchAI;
  var _callAIWithRetry = _aa._callAIWithRetry;
  var _hasRequiredKeys = _aa._hasRequiredKeys;
  var _extractArray = _aa._extractArray;

  // ============================================================
  // BrandService (defined in src/ai/brand-service.js; reference captured here)
  // ============================================================
  var BrandService = window._vpm.brandService;


  // ============================================================
  // Context builders (defined in src/ai/contexts.js)
  // ============================================================
  var _ctxMod = window._vpm.contexts;
  var buildVideoContext = _ctxMod.buildVideoContext;
  var buildScriptContext = _ctxMod.buildScriptContext;
  var buildClipContext = _ctxMod.buildClipContext;
  var buildSceneContext = _ctxMod.buildSceneContext;
  // _buildVoiceDescription is exported by contexts.js as window._vpm.buildVoiceDescription
  var _buildVoiceDescription = window._vpm.buildVoiceDescription;

  // --- Video generation modes ---
  var VIDEO_GEN_MODES = {
    'frames-to-video':      { label: 'Frames to Video',      icon: 'images',              description: 'Generate video from first frame (and optional last frame) reference images' },
    'text-to-video':        { label: 'Text to Video',        icon: 'wand-magic-sparkles', description: 'Generate video purely from text prompt — no reference images needed' },
    'ingredients-to-video': { label: 'Ingredients to Video',  icon: 'layer-group',         description: 'Provide ingredient images (characters, environments, objects) and compose a video from them' }
  };

  // --- Model-specific prompt templates ---
  // Per-model templates live in src/ai/prompt-templates/*.js (seedance.js, veo-3.1.js, kling.js, runway.js).
  // They register themselves on window._vpm.promptTemplates before this file runs.
  var PROMPT_TEMPLATES = (window._vpm && window._vpm.promptTemplates) || {};


  // ============================================================
  // SECTION 6: AI — IDEA ANALYSIS
  // ============================================================

  function analyzeIdea(actionId, ci) {
    var input = (S.data.start.raw_input || '').trim();
    if (!input) { toast('Enter your video idea first', 'warning'); return; }
    if (!LLMService.isConfigured()) {
      S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString();
      logActivity('idea_processed', 'Idea saved (no AI)');
      if (snapshot) snapshot('Process idea'); buildMaps(); syncToTextarea(); render();
      toast('Idea saved! Configure AI in Settings for smart analysis.', 'info'); return;
    }
    var sp = 'You are an expert video production planner. Analyze the video idea and extract structured metadata. Output JSON only.';
    var prompt = 'Analyze this video idea:\n\n"' + input + '"';
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += '\nAvailable tones: professional, casual, energetic, educational, entertaining, inspirational';
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"suggested title","description":"one line","tone":"tone","target_audience":"who","suggested_sections":["Section 1","Section 2","Section 3"]}';
    _showAIProgress('analyze-idea', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString();
        if (r) {
          var bp = S.data.blueprint;
          if (r.title) bp.title = r.title;
          if (r.description) bp.description = r.description;
          if (r.tone) bp.tone = r.tone;
          if (r.target_audience) bp.target_audience = r.target_audience;
          if (r.suggested_sections && r.suggested_sections.length) {
            bp.sections = [];
            for (var i = 0; i < r.suggested_sections.length; i++) bp.sections.push({ id: generateId('sec'), label: r.suggested_sections[i], duration: 0, key_points: [], visual_notes: '', order: i + 1 });
          }
        }
        logActivity('idea_processed', 'AI analyzed: ' + (r && r.title ? r.title : input.substring(0, 50)));
        if (snapshot) snapshot('AI idea'); buildMaps(); syncToTextarea(); render();
        toast('Idea analyzed! Blueprint pre-filled.', 'success');
      } catch(e) { S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString(); buildMaps(); syncToTextarea(); render(); toast('Idea saved (parse error)', 'warning'); }
    }, function(err) { S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString(); buildMaps(); syncToTextarea(); render(); toast('AI unavailable \u2014 idea saved', 'warning'); }, 'analyze-idea', sp);
  }


  // ============================================================
  // SECTION 7: AI — RESEARCH GENERATION
  // ============================================================

  // Ensure a value is a plain string (fixes [object Object] bug)
  function _ensureString(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      // If it's an object with a content/text field, extract it
      if (val.content) return _ensureString(val.content);
      if (val.text) return _ensureString(val.text);
      // Otherwise stringify the object in readable format
      try { return JSON.stringify(val, null, 2); } catch(e) { return String(val); }
    }
    return String(val);
  }

  function generateResearch(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var input = S.data.start.raw_input || '';
    var v = S.data.video || {};
    var bp = S.data.blueprint || {};
    var sp = 'You are an expert content researcher for video production. Provide actionable, detailed research to help plan a better video. Every value in the JSON output MUST be a plain text string (not an object). Output JSON only.';

    var prompt = 'Research this video topic thoroughly for planning a video production.\n\n' + buildVideoContext();
    if (input) prompt += '\n\nOriginal idea: "' + input + '"';
    if (v.title) prompt += '\nVideo title: ' + v.title;
    if (v.description) prompt += '\nDescription: ' + v.description;
    if (v.target_audience) prompt += '\nTarget audience: ' + v.target_audience;

    // Include blueprint context if available
    var bpSections = bp.sections || [];
    if (bpSections.length) {
      prompt += '\n\n--- VIDEO STRUCTURE ---\n';
      for (var bi = 0; bi < bpSections.length; bi++) {
        prompt += (bi + 1) + '. ' + (bpSections[bi].label || 'Section') + (bpSections[bi].duration ? ' (' + bpSections[bi].duration + 's)' : '') + '\n';
      }
    }

    var sources = (S.data.research || {}).sources || [];
    if (sources.length) { prompt += '\n\nReference sources:\n'; for (var i = 0; i < sources.length; i++) prompt += '- ' + (sources[i].title || sources[i].url || '') + ' (' + (sources[i].type || '') + ')\n'; }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nProvide research in these 4 areas. Each field MUST be a plain text string with line breaks for formatting (NOT a nested object):\n';
    prompt += '1. audience_insights: Who is the target audience? What are their pain points, search intent, demographics, and viewing habits? What questions do they have?\n';
    prompt += '2. competitor_analysis: What similar videos exist? What content gaps can we fill? What works well in top-performing videos on this topic?\n';
    prompt += '3. trending_angles: What current trends relate to this topic? What hooks are viral? Any seasonal or timely relevance?\n';
    prompt += '4. content_strategy: What approach should this video take? Recommended structure, hook strategy, key differentiators, and CTA suggestions.\n';
    prompt += '\nJSON:\n{"audience_insights":"multi-line detailed text...","competitor_analysis":"multi-line detailed text...","trending_angles":"multi-line detailed text...","content_strategy":"multi-line detailed text..."}';

    _showAIProgress('generate-research', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        S.data.research = S.data.research || {};
        // Use _ensureString to prevent [object Object] display
        if (r.audience_insights) S.data.research.audience_insights = _ensureString(r.audience_insights);
        if (r.competitor_analysis) S.data.research.competitor_analysis = _ensureString(r.competitor_analysis);
        if (r.trending_angles) S.data.research.trending_angles = _ensureString(r.trending_angles);
        if (r.content_strategy) S.data.research.content_strategy = _ensureString(r.content_strategy);
        S.data.research.generated = true; S.data.research.generated_at = new Date().toISOString();
        logActivity('research_generated', 'AI research brief generated');
        if (snapshot) snapshot('Research'); buildMaps(); syncToTextarea(); render();
        toast('Research brief generated!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-research', sp, { max_tokens: 8000 });
  }


  // ============================================================
  // SECTION 8: AI — SCRIPT GENERATION
  // ============================================================

  function generateScript(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    if (!bpSections.length) { toast('Confirm blueprint first', 'warning'); return; }
    var sp = 'You are an expert video scriptwriter. Write a compelling script structured into sections. Output ONLY valid JSON — no explanation, no markdown.';
    var prompt = 'Generate a full video script.\n\n' + buildVideoContext();
    if (bp.style_notes) prompt += '\nStyle notes: ' + bp.style_notes;
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    // Explicitly list each section for the AI
    prompt += '\n\n--- SECTIONS TO WRITE ---\n';
    for (var si = 0; si < bpSections.length; si++) {
      var bs = bpSections[si];
      prompt += (si + 1) + '. "' + bs.label + '" (~' + (bs.duration || 30) + 's, ~' + Math.round((bs.duration || 30) * ((S.meta.settings || {}).words_per_minute || 150) / 60) + ' words)';
      if (bs.key_points && bs.key_points.length) prompt += ' — cover: ' + bs.key_points.join(', ');
      prompt += '\n';
    }
    prompt += '\nWrite content as plain text paragraphs separated by newlines. Do NOT use HTML tags.\n';
    prompt += '\nJSON format:\n{"sections":[{"label":"section label","content":"paragraph 1\\n\\nparagraph 2","notes":"any production notes"}]}';
    _callAIWithRetry(prompt, sp, 'generate-script', 'generate-script', true, function(r) {
      try {
        var sections = _extractArray(r, 'sections');
        if (!sections || !sections.length) { toast('No sections found in response', 'error'); return; }
        if (snapshot) snapshot('Before script gen');
        var sc = S.data.script;
        sc.versions = sc.versions || [];
        if (sc.sections && sc.sections.length) {
          sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 Before AI', total_word_count: sc.total_word_count || 0, snapshot: deepClone(sc.sections) });
        }
        sc.sections = [];
        for (var i = 0; i < sections.length; i++) {
          var rs = sections[i];
          var label = rs.label || rs.title || rs.name || 'Section ' + (i + 1);
          var sec = createDefaultBodySection(i + 1, label);
          // Normalize content: handle both HTML and plain text
          var rawContent = rs.content || rs.text || rs.body || '';
          sec.content = normalizeToHtml(rawContent);
          sec.word_count = countWords(stripHtml(sec.content));
          sec.notes = rs.notes || rs.direction || '';
          // Try to match to blueprint section ID
          if (i < bpSections.length) sec.id = bpSections[i].id;
          sc.sections.push(sec);
        }
        sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 AI Generated', total_word_count: 0, snapshot: deepClone(sc.sections) });
        recomputeScriptDurations();
        logActivity('script_generated', 'AI generated script (' + sc.sections.length + ' sections, ' + sc.total_word_count + ' words)');
        if (snapshot) snapshot('After script gen'); buildMaps(); syncToTextarea(); render();
        toast('Script generated!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Script gen error:', e); }
    }, ['sections'], { max_tokens: 12000 });
  }


  // ============================================================
  // SECTION 9: AI — SCRIPT ENHANCEMENT
  // ============================================================

  // Generate script for a SINGLE section
  function generateScriptSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var bpSec = null;
    for (var bsi = 0; bsi < bpSections.length; bsi++) { if (bpSections[bsi].id === sectionId) { bpSec = bpSections[bsi]; break; } }
    var sc = S.data.script || {};
    var sec = (sc.sections || []).find(function(s) { return s.id === sectionId; });
    if (!sec) { toast('Script section not found', 'error'); return; }

    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var targetWords = Math.round(((bpSec ? bpSec.duration : 30) || 30) * wpm / 60);

    var sp = 'You are an expert video scriptwriter. Write compelling, natural script content for this ONE section. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Generate the script for this ONE section of the video.\n\n' + buildVideoContext();
    if (bp.style_notes) prompt += '\nStyle notes: ' + bp.style_notes;
    if (bp.tone) prompt += '\nTone: ' + bp.tone;

    // Section context
    prompt += '\n\n--- SECTION TO WRITE ---\n';
    prompt += 'Section: "' + (sec.label || 'Untitled') + '"\n';
    prompt += 'Target duration: ~' + ((bpSec ? bpSec.duration : 30) || 30) + 's\n';
    prompt += 'Target word count: ~' + targetWords + ' words (at ' + wpm + ' WPM)\n';
    if (bpSec && bpSec.key_points && bpSec.key_points.length) prompt += 'Key points to cover: ' + bpSec.key_points.join(', ') + '\n';
    if (bpSec && bpSec.visual_notes) prompt += 'Visual notes: ' + bpSec.visual_notes + '\n';

    // Context from other sections (so AI knows what comes before/after)
    var allSecs = sc.sections || [];
    var secIdx = -1;
    for (var asi = 0; asi < allSecs.length; asi++) { if (allSecs[asi].id === sectionId) { secIdx = asi; break; } }
    if (secIdx > 0 && allSecs[secIdx - 1].content) {
      prompt += '\nPrevious section ("' + (allSecs[secIdx - 1].label || '') + '") ends with: "' + truncate(stripHtml(allSecs[secIdx - 1].content), 150) + '"\n';
      prompt += 'Continue naturally from where the previous section left off.\n';
    }
    if (secIdx >= 0 && secIdx < allSecs.length - 1 && allSecs[secIdx + 1].content) {
      prompt += '\nNext section ("' + (allSecs[secIdx + 1].label || '') + '") starts with: "' + truncate(stripHtml(allSecs[secIdx + 1].content), 100) + '"\n';
      prompt += 'End this section in a way that flows into the next.\n';
    }

    // Existing content (for regeneration)
    var existingText = sec.content ? stripHtml(sec.content) : '';
    if (existingText && existingText.length > 10) {
      prompt += '\nExisting content (replace with improved version): "' + truncate(existingText, 300) + '"\n';
    }

    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nWrite content as plain text paragraphs separated by newlines. Aim for ~' + targetWords + ' words. Do NOT use HTML tags.\n';
    prompt += 'JSON:\n{"content":"paragraph 1\\n\\nparagraph 2","notes":"any production notes"}';

    _callAIWithRetry(prompt, sp, 'generate-script', 'generate-script', false, function(r) {
      try {
        var content = r.content || r.text || r.body || r.enhanced || '';
        if (!content) { toast('No content generated', 'error'); return; }
        if (snapshot) snapshot('Before section script gen');
        // Version snapshot
        sc.versions = sc.versions || [];
        sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 Before "' + (sec.label || 'section') + '" gen', total_word_count: sc.total_word_count || 0, snapshot: deepClone(sc.sections) });
        // Update section
        sec.content = normalizeToHtml(_ensureString(content));
        sec.word_count = countWords(stripHtml(sec.content));
        if (r.notes) sec.notes = _ensureString(r.notes);
        recomputeScriptDurations();
        logActivity('script_section_generated', 'AI generated script for "' + (sec.label || sectionId) + '" (' + sec.word_count + ' words)');
        if (snapshot) snapshot('After section script gen'); buildMaps(); syncToTextarea(); render();
        toast('Script generated for "' + (sec.label || 'section') + '"!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, null, { max_tokens: 4000 });
  }

  function enhanceSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sc = S.data.script || {};
    var sec = (sc.sections || []).find(function(s) { return s.id === sectionId; });
    if (!sec || !sec.content) { toast('Write some content first', 'warning'); return; }
    var currentText = stripHtml(sec.content);
    var sp = 'You are an expert video scriptwriter. Improve the given section. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Enhance this script section.\n\n' + buildVideoContext();
    prompt += '\n\nSection: ' + (sec.label || 'Unknown') + '\nCurrent text: ' + currentText;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nReturn plain text paragraphs separated by \\n\\n. No HTML tags.\n';
    prompt += 'JSON:\n{"enhanced":"improved paragraph 1\\n\\nimproved paragraph 2","notes":"what changed"}';
    _callAIWithRetry(prompt, sp, 'enhance-script', 'enhance-script', false, function(r) {
      try {
        var enhanced = r.enhanced || r.content || r.text || r.improved || '';
        if (!enhanced) { toast('Could not parse enhanced content', 'error'); return; }
        if (snapshot) snapshot('Before enhance');
        sec.content = normalizeToHtml(enhanced);
        sec.word_count = countWords(stripHtml(sec.content));
        recomputeScriptDurations();
        logActivity('script_enhanced', 'AI enhanced: ' + (sec.label || sectionId));
        if (snapshot) snapshot('After enhance'); buildMaps(); syncToTextarea(); render();
        toast('Section enhanced!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, null);
  }


  // ============================================================
  // SECTION 10: AI — CLIP BREAKDOWN
  // ============================================================

  // Video types that should get auto-injected template clips (intro/outro/chapters)
  var AUTO_TEMPLATE_PLATFORMS = { 'youtube': true, 'youtube-shorts': false, 'instagram-reels': false, 'tiktok': false, 'linkedin': true };

  function generateClips(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var v = S.data.video || {};
    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var modelCfg = getModelDurationConfig(videoModel);

    var sp = 'You are a video production expert. Break the script into production-ready clips. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Generate clip breakdown from script.\n\n' + buildVideoContext() + '\n\n' + buildScriptContext();

    // --- Explicit valid type IDs ---
    prompt += '\n\n--- VALID CLIP TYPES (use EXACT IDs) ---\n';
    prompt += 'AI track:       ai-character, ai-visual, ai-broll\n';
    prompt += 'Non-AI track:   screen-recording, screen-with-cam, human-presenter\n';
    prompt += 'Template track: branded-intro, branded-outro, chapter-title, text-card\n';
    prompt += 'DO NOT invent new type IDs. Use ONLY the ones above.\n';

    // --- Preferred clip types (from user selection in Start stage) ---
    var selectedClipTypes = ((S.data.start || {}).selected_clip_types || []);
    if (selectedClipTypes.length) {
      prompt += '\n--- PREFERRED CLIP TYPES ---\n';
      prompt += 'The user has selected these clip types: ' + selectedClipTypes.join(', ') + '\n';
      prompt += 'Prioritize using these types. You MAY use other valid types if needed, but prefer the selected ones.\n';
    }

    // --- Explicit section IDs ---
    prompt += '\n--- SECTION IDs (use EXACT IDs) ---\n';
    for (var si = 0; si < bpSections.length; si++) {
      prompt += '"' + bpSections[si].id + '" = ' + bpSections[si].label + '\n';
    }
    if (!bpSections.length) prompt += '(no blueprint sections — use "body" for all clips)\n';

    // --- Duration + Script Word Budget constraints ---
    var _wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var _maxClipDur = modelCfg.maxDuration || modelCfg.defaultDuration || 8;
    var _maxWordsPerClip = Math.floor((_maxClipDur / 60) * _wpm);
    prompt += '\n--- DURATION & WORD BUDGET RULES ---\n';
    prompt += 'AI track clips: valid durations = ' + (modelCfg.durations || []).join('s, ') + 's (default: ' + modelCfg.defaultDuration + 's)\n';
    prompt += 'Words per minute (WPM): ' + _wpm + '\n';
    prompt += 'CRITICAL: Each clip\'s script_text MUST be <= ' + _maxWordsPerClip + ' words (for ' + _maxClipDur + 's at ' + _wpm + ' WPM).\n';
    prompt += 'If a section has too many words for one clip, split it into MULTIPLE clips.\n';
    prompt += 'Formula: max_words = floor((duration / 60) * ' + _wpm + ')\n';
    prompt += 'Non-AI clips: 10-60s depending on content\n';
    prompt += 'Template clips: branded-intro=4s, branded-outro=8s, chapter-title=3s, text-card=4s\n';

    // --- Section-by-section word budgets ---
    var _scriptSections = (S.data.script || {}).sections || [];
    if (_scriptSections.length) {
      prompt += '\n--- PER-SECTION WORD BUDGETS ---\n';
      for (var _wbi = 0; _wbi < _scriptSections.length; _wbi++) {
        var _wbSec = _scriptSections[_wbi];
        var _secText = stripHtml(_wbSec.content || '');
        var _secWords = countWords(_secText);
        var _sugClips = Math.max(1, Math.ceil(_secWords / _maxWordsPerClip));
        prompt += 'Section "' + (_wbSec.label || 'Section ' + (_wbi + 1)) + '": ' + _secWords + ' words → suggest ' + _sugClips + ' clip(s), max ' + _maxWordsPerClip + ' words each\n';
      }
    }

    // --- Character awareness ---
    var _charLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador'; });
    if (_charLooks.length) {
      prompt += '\n--- AVAILABLE CHARACTERS ---\n';
      for (var _cli = 0; _cli < _charLooks.length; _cli++) {
        prompt += '- ' + _charLooks[_cli].name + ' (look_id: ' + _charLooks[_cli].id + '): ' + (_charLooks[_cli].combined_prompt_fragment || '').substring(0, 100) + '\n';
      }
      prompt += 'For ai-character clips, include "look_id" field referencing one of these characters.\n';
    }

    // --- Presenter preference ---
    var presPref = prefs.presenter_preference || v.presenter_preference || 'ai-only';
    prompt += '\n--- PRESENTER: ' + presPref.toUpperCase() + ' ---\n';
    if (presPref === 'ai-only') prompt += 'Use ai-character for narration. NO human-presenter.\n';
    else if (presPref === 'human-only') prompt += 'Use human-presenter for narration. ai-visual/ai-broll allowed for visuals.\n';
    else prompt += 'Mix ai-character and human-presenter as appropriate.\n';

    // --- Structural rules ---
    // User can override template injection: prefs.include_templates (true/false/undefined)
    var _templatePref = prefs.include_templates;
    var autoInject = (_templatePref !== undefined) ? !!_templatePref : (AUTO_TEMPLATE_PLATFORMS[prefs.platform || v.platform || 'youtube'] !== false);
    if (autoInject) {
      prompt += '\n--- STRUCTURE ---\n';
      prompt += 'DO NOT include branded-intro, branded-outro, or chapter-title clips.\n';
      prompt += 'The app will auto-inject those. Focus ONLY on content clips.\n';
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nFor each blueprint section, create 1-5 clips.\n';
    prompt += 'CRITICAL: Each clip\'s script_text must contain the ACTUAL voiceover narration text COPIED from the script. Do NOT summarize or use placeholders.\n';
    prompt += 'Each clip gets up to ' + _maxWordsPerClip + ' words. The clips must collectively contain ALL the script text — no words left out.\n';
    prompt += 'JSON:\n{"clips":[{"title":"short title","type":"exact_type_id","section":"exact_section_id","duration":' + _maxClipDur + ',"script_text":"FULL voiceover narration text from the script (up to ' + _maxWordsPerClip + ' words per clip, copy exact words from the script)","onscreen_text":"overlay text","visual_direction":"what to show","look_id":"optional_look_id_for_ai-character"}]}';

    _callAIWithRetry(prompt, sp, 'generate-clips', 'generate-clips', true, function(r) {
      try {
        var rawClips = _extractArray(r, 'clips');
        if (!rawClips || !rawClips.length) { toast('No clips found in response', 'error'); return; }
        if (snapshot) snapshot('Before clip gen');

        // --- Build lightweight clips with normalization ---
        var contentClips = [];
        var stg = (S.meta && S.meta.settings) || {};
        var snappedCount = 0;
        for (var i = 0; i < rawClips.length; i++) {
          var ic = rawClips[i];
          var clipType = normalizeClipType(ic.type);
          var sectionId = resolveSectionId(ic.section);
          var clip = createLightweightClip(clipType, sectionId, i + 1);
          clip.title = ic.title || ic.name || 'Clip ' + (i + 1);
          // Duration: validate and snap
          var aiDur = parseInt(ic.duration, 10) || 0;
          clip.duration = (aiDur >= 2 && aiDur <= 120) ? aiDur : getSmartClipDuration(clipType);
          if (clip.track === 'ai' && (stg.strict_ai_duration || stg.snap_to_model_durations)) {
            var snapped = snapToModelDuration(clip.duration, videoModel);
            if (snapped !== clip.duration) { snappedCount++; clip.duration = snapped; }
          }
          clip.script_text = ic.script_text || ic.voiceover || ic.narration || '';
          clip.onscreen_text = ic.onscreen_text || ic.text_overlay || '';
          clip.visual_direction = ic.visual_direction || ic.visuals || ic.direction || '';
          // Assign look if AI provided look_id (for ai-character clips)
          if (ic.look_id && S.lookMap && S.lookMap[ic.look_id]) {
            ensurePromptSet(clip);
            clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
            clip.prompt_set.first_frame.scene.look_ids = [ic.look_id];
          }
          contentClips.push(clip);
        }

        // --- Auto-inject template clips ---
        var finalClips = [];
        if (autoInject) {
          // Branded Intro
          var introClip = createLightweightClip('branded-intro', bpSections.length ? bpSections[0].id : 'body', 1);
          introClip.title = 'Branded Intro';
          introClip.duration = 4;
          introClip.status = 'pending';
          finalClips.push(introClip);

          // Group content clips by section and inject chapter titles
          var currentSection = '';
          for (var ci2 = 0; ci2 < contentClips.length; ci2++) {
            var cc = contentClips[ci2];
            if (cc.section !== currentSection) {
              currentSection = cc.section;
              // Find section label
              var secLabel = currentSection;
              for (var bsi = 0; bsi < bpSections.length; bsi++) {
                if (bpSections[bsi].id === currentSection) { secLabel = bpSections[bsi].label; break; }
              }
              var chClip = createLightweightClip('chapter-title', currentSection, 0);
              chClip.title = secLabel;
              chClip.onscreen_text = secLabel;
              chClip.duration = 3;
              chClip.status = 'pending';
              finalClips.push(chClip);
            }
            finalClips.push(cc);
          }

          // Branded Outro
          var outroClip = createLightweightClip('branded-outro', bpSections.length ? bpSections[bpSections.length - 1].id : 'body', 0);
          outroClip.title = 'Branded Outro';
          outroClip.duration = 8;
          outroClip.status = 'pending';
          finalClips.push(outroClip);
        } else {
          finalClips = contentClips;
        }

        // --- Recompute order + timing ---
        var t = 0;
        for (var fi = 0; fi < finalClips.length; fi++) {
          finalClips[fi].order = fi + 1;
          finalClips[fi].timing = { start: t, end: t + finalClips[fi].duration };
          t += finalClips[fi].duration;
        }

        // --- Stats ---
        var aiCount = finalClips.filter(function(c) { return c.track === 'ai'; }).length;
        var nonAiCount = finalClips.filter(function(c) { return c.track === 'non-ai'; }).length;
        var tplCount = finalClips.filter(function(c) { return c.track === 'template'; }).length;

        S.data.clips = finalClips;
        recomputeClipTimings();
        logActivity('clips_generated', 'AI generated ' + finalClips.length + ' clips (' + aiCount + ' AI, ' + nonAiCount + ' Non-AI, ' + tplCount + ' Template)' + (snappedCount > 0 ? ' \u2014 ' + snappedCount + ' durations snapped' : ''));
        if (snapshot) snapshot('After clip gen'); buildMaps(); syncToTextarea(); render();
        // Check for script overflow
        var _overflowCount = 0;
        for (var _oci = 0; _oci < finalClips.length; _oci++) {
          if (finalClips[_oci].script_text && getClipScriptOverflow(finalClips[_oci])) _overflowCount++;
        }
        var _msg = finalClips.length + ' clips generated!';
        if (snappedCount > 0) _msg += ' (' + snappedCount + ' durations adjusted)';
        if (_overflowCount > 0) _msg += ' \u26a0 ' + _overflowCount + ' clip(s) exceed word limit \u2014 use AI Split';
        toast(_msg, _overflowCount > 0 ? 'warning' : 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Clip gen error:', e); }
    }, ['clips'], { max_tokens: 16000 });
  }


  // --- Generate clips for a SINGLE section ---
  function generateClipsForSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var bpSec = null;
    for (var bsi = 0; bsi < bpSections.length; bsi++) { if (bpSections[bsi].id === sectionId) { bpSec = bpSections[bsi]; break; } }
    if (!bpSec) { toast('Section not found in blueprint', 'error'); return; }

    // Find script content for this section — match by ID first, then by label, then by index
    var scriptSecs = (S.data.script || {}).sections || [];
    var scriptSec = null;
    // Match 1: by ID
    for (var ssi = 0; ssi < scriptSecs.length; ssi++) { if (scriptSecs[ssi].id === sectionId) { scriptSec = scriptSecs[ssi]; break; } }
    // Match 2: by label (if ID match failed)
    if (!scriptSec && bpSec) {
      var _bpLabel = (bpSec.label || '').toLowerCase().trim();
      for (var ssi2 = 0; ssi2 < scriptSecs.length; ssi2++) {
        if ((scriptSecs[ssi2].label || '').toLowerCase().trim() === _bpLabel) { scriptSec = scriptSecs[ssi2]; break; }
      }
    }
    // Match 3: by index position in blueprint
    if (!scriptSec) {
      var _bpIdx = -1;
      for (var _bi = 0; _bi < bpSections.length; _bi++) { if (bpSections[_bi].id === sectionId) { _bpIdx = _bi; break; } }
      if (_bpIdx >= 0 && _bpIdx < scriptSecs.length) scriptSec = scriptSecs[_bpIdx];
    }
    var secText = scriptSec ? stripHtml(scriptSec.content || '') : '';
    var secWords = countWords(secText);
    if (!secText || secWords < 3) { toast('No script content for this section. Write the script in the Script stage first.', 'warning'); return; }

    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var modelCfg = getModelDurationConfig(videoModel);
    var _wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var _maxClipDur = modelCfg.maxDuration || modelCfg.defaultDuration || 8;
    var _maxWordsPerClip = Math.floor((_maxClipDur / 60) * _wpm);
    var sugClips = Math.max(1, Math.ceil(secWords / _maxWordsPerClip));

    var sp = 'You are a video production expert. Break this script section into production-ready clips. Output ONLY valid JSON.';
    var prompt = 'Generate clips for this ONE section of the video.\n\n' + buildVideoContext();
    prompt += '\n\n--- SECTION TO PROCESS ---\n';
    prompt += 'Section: "' + bpSec.label + '" (id: ' + sectionId + ')\n';
    prompt += 'Script text (' + secWords + ' words): ' + secText + '\n';
    prompt += 'Target duration: ' + (bpSec.duration || 30) + 's\n';
    prompt += 'Suggested clips: ' + sugClips + ' (max ' + _maxWordsPerClip + ' words per clip at ' + _wpm + ' WPM)\n';

    // Valid types and preferences
    prompt += '\n--- VALID CLIP TYPES ---\nai-character, ai-visual, ai-broll, screen-recording, screen-with-cam, human-presenter\n';
    prompt += 'DO NOT create template clips (branded-intro, branded-outro, chapter-title, text-card). Focus ONLY on content clips.\n';
    var selectedClipTypes = ((S.data.start || {}).selected_clip_types || []);
    if (selectedClipTypes.length) prompt += 'Preferred: ' + selectedClipTypes.join(', ') + '\n';

    // Duration and word rules
    prompt += '\n--- RULES ---\n';
    prompt += 'Duration range: ' + modelCfg.minDuration + '-' + _maxClipDur + 's\n';
    if (modelCfg.durations && modelCfg.durations.length) prompt += 'Valid AI durations: ' + modelCfg.durations.join('s, ') + 's (default: ' + modelCfg.defaultDuration + 's)\n';
    prompt += 'EACH clip script_text MUST be <= ' + _maxWordsPerClip + ' words.\n';
    prompt += 'CRITICAL: COPY the EXACT script text into the clips. The script_text field must contain the ACTUAL voiceover narration, NOT a summary or placeholder.\n';
    prompt += 'The clips must collectively contain the ENTIRE script text for this section. No words should be left out.\n';
    prompt += 'Split the text sequentially \u2014 each clip picks up exactly where the previous clip ended.\n';
    prompt += 'Do NOT write "max N words" or placeholders in script_text \u2014 write the real narration text from the script above.\n';
    prompt += 'Section ID for all clips: "' + sectionId + '"\n';

    // Presenter preference
    var presPref = prefs.presenter_preference || 'ai-only';
    if (presPref === 'ai-only') prompt += 'Use ai-character for narration. NO human-presenter.\n';
    else if (presPref === 'human-only') prompt += 'Use human-presenter. ai-visual/ai-broll for visuals.\n';

    // Character awareness
    var _charLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador'; });
    if (_charLooks.length) {
      prompt += '\n--- CHARACTERS ---\n';
      for (var _cli = 0; _cli < _charLooks.length; _cli++) prompt += '- ' + _charLooks[_cli].name + ' (look_id: ' + _charLooks[_cli].id + ')\n';
      prompt += 'For ai-character clips, include "look_id".\n';
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"clips":[{"title":"short title","type":"exact_type_id","duration":' + _maxClipDur + ',"script_text":"FULL voiceover narration text copied from the script (up to ' + _maxWordsPerClip + ' words per clip)","onscreen_text":"overlay","visual_direction":"what to show","look_id":"optional"}]}';

    _callAIWithRetry(prompt, sp, 'generate-clips', 'generate-clips', false, function(r) {
      try {
        var rawClips = _extractArray(r, 'clips');
        if (!rawClips || !rawClips.length) { toast('No clips generated for this section', 'error'); return; }
        if (snapshot) snapshot('Before section clip gen');

        // Remove existing clips for this section
        var existingClips = S.data.clips || [];
        var keptClips = existingClips.filter(function(c) { return c.section !== sectionId; });

        // Build new clips for this section
        var stg = (S.meta && S.meta.settings) || {};
        var newClips = [];
        for (var i = 0; i < rawClips.length; i++) {
          var ic = rawClips[i];
          var clipType = normalizeClipType(ic.type);
          var clip = createLightweightClip(clipType, sectionId, 0);
          clip.title = ic.title || ic.name || bpSec.label + ' Clip ' + (i + 1);
          var aiDur = parseInt(ic.duration, 10) || 0;
          clip.duration = (aiDur >= 2 && aiDur <= 120) ? aiDur : getSmartClipDuration(clipType);
          if (clip.track === 'ai') clip.duration = snapToModelDuration(clip.duration, videoModel);
          clip.script_text = ic.script_text || ic.voiceover || ic.narration || '';
          clip.onscreen_text = ic.onscreen_text || ic.text_overlay || '';
          clip.visual_direction = ic.visual_direction || ic.visuals || ic.direction || '';
          if (ic.look_id && S.lookMap && S.lookMap[ic.look_id]) {
            ensurePromptSet(clip);
            clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
            clip.prompt_set.first_frame.scene.look_ids = [ic.look_id];
          }
          newClips.push(clip);
        }

        // Insert new clips at the correct position (by section order)
        var insertIdx = keptClips.length; // default: append
        for (var ki = 0; ki < keptClips.length; ki++) {
          // Find first clip whose section comes AFTER the target section
          var kSec = keptClips[ki].section || 'body';
          var kSecOrder = -1, targetSecOrder = -1;
          for (var bo = 0; bo < bpSections.length; bo++) {
            if (bpSections[bo].id === kSec) kSecOrder = bo;
            if (bpSections[bo].id === sectionId) targetSecOrder = bo;
          }
          if (targetSecOrder >= 0 && kSecOrder > targetSecOrder) { insertIdx = ki; break; }
        }
        // Splice in new clips
        for (var ni = 0; ni < newClips.length; ni++) keptClips.splice(insertIdx + ni, 0, newClips[ni]);

        // Reorder all clips
        for (var ri = 0; ri < keptClips.length; ri++) { keptClips[ri].order = ri + 1; }
        S.data.clips = keptClips;
        recomputeClipTimings();

        logActivity('section_clips_generated', 'Generated ' + newClips.length + ' clips for "' + bpSec.label + '"');
        if (snapshot) snapshot('After section clip gen'); buildMaps(); syncToTextarea(); render();

        // Overflow check
        var _ofc = 0;
        for (var _oi = 0; _oi < newClips.length; _oi++) { if (newClips[_oi].script_text && getClipScriptOverflow(newClips[_oi])) _ofc++; }
        var _msg = newClips.length + ' clips generated for "' + bpSec.label + '"';
        toast(_msg + (_ofc > 0 ? ' \u2014 ' + _ofc + ' exceed word limit' : ''), _ofc > 0 ? 'warning' : 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Section clip gen error:', e); }
    }, ['clips'], { max_tokens: 8000 });
  }


  // ============================================================
  // SECTION 11: AI — FRAME & VIDEO PROMPTS
  // ============================================================

  function generateFramePrompt(clipId, frameKey, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
    var frame = clip.prompt_set[frameKey]; if (!frame) return;
    var isFirst = frameKey === 'first_frame';
    var ar = ((S.data.start || {}).preferences || {}).aspect_ratio || '16:9';
    var sp = 'You are an expert AI image prompt engineer. Write detailed image prompts. Output JSON only.';
    var prompt = 'Generate a ' + (isFirst ? 'FIRST' : 'LAST') + ' FRAME prompt.\n\n' + buildClipContext(clip) + '\n\n' + buildSceneContext(clip);
    if (!isFirst && clip.prompt_set.first_frame && clip.prompt_set.first_frame.prompt && clip.prompt_set.first_frame.prompt.positive) {
      prompt += '\n\nFirst frame: ' + clip.prompt_set.first_frame.prompt.positive + '\nThis LAST FRAME shows the END state.';
    }
    // AI Character: show in speaking/presenting pose
    if (clip.type === 'ai-character') {
      var _fgLookIds = (((clip.prompt_set || {}).first_frame || {}).scene || {}).look_ids || [];
      var _fgLook = (_fgLookIds.length && S.lookMap) ? S.lookMap[_fgLookIds[0]] : null;
      prompt += '\n\n=== AI CHARACTER FRAME REQUIREMENTS ===';
      prompt += '\n- The character IS the narrator. Show them in a speaking/presenting pose, facing the camera.';
      if (_fgLook) prompt += '\n- Character: ' + (_fgLook.name || 'Unnamed') + ' \u2014 ' + (_fgLook.combined_prompt_fragment || 'professional presenter');
      prompt += '\n- Facial expression should match the tone of the script text.';
      prompt += '\n- Show the character naturally mid-speech (mouth slightly open, engaged expression).';
      if (isFirst) prompt += '\n- This is the OPENING shot \u2014 the character begins speaking to the viewer.';
    }
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += '\nAspect ratio: ' + ar;
    // Video style
    var _fvs = ((S.data.start || {}).preferences || {}).video_style || '';
    var _fvsDef = (Constants.VIDEO_STYLES || {})[_fvs] || {};
    if (_fvs && _fvsDef.promptHint) prompt += '\nVideo style: ' + _fvsDef.label + ' \u2014 ' + _fvsDef.promptHint;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"positive":"detailed prompt","negative":"watermark, blurry, low quality","style_keywords":[]}';
    _showAIProgress('generate-prompt', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.positive) { toast('Could not parse', 'error'); return; }
        frame.prompt.positive = r.positive; frame.prompt.negative = r.negative || '';
        frame.prompt.status = 'generated'; frame.prompt.generated_at = new Date().toISOString();
        maybeAdvanceClipStatus(clip, (isFirst ? 'first' : 'last') + ' frame prompt');
        logActivity('prompt_generated', 'Clip ' + clip.order + ': ' + (isFirst ? 'First' : 'Last') + ' frame prompt');
        if (snapshot) snapshot('Frame prompt'); buildMaps(); syncToTextarea(); render();
        toast('Frame prompt ready!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-prompt', sp);
  }

  function generateVideoPrompt(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
    var ps = clip.prompt_set; var ff = ps.first_frame || {};
    var lf = ps.last_frame || {};

    // Resolve model and preferences
    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var modelTemplate = PROMPT_TEMPLATES[videoModel] || {};
    var audioMode = prefs.audio_mode || 'ai-audio-with-video';
    var _modelDefaultGenMode = (Constants.VIDEO_MODELS[videoModel] || {}).defaultGenMode || 'frames-to-video';
    var genMode = (ps.video || {}).gen_mode || _modelDefaultGenMode;
    var isSeedance = (videoModel === 'seedance');

    var sp = isSeedance
      ? 'You are an expert Seedance 2.0 video generation prompt engineer. Generate the complete 7-section Seedance prompt as plain text. Output plain text only \u2014 no JSON, no markdown, no code blocks, no commentary outside the prompt.'
      : 'You are an expert video generation prompt engineer specializing in ' + ((Constants.VIDEO_MODELS[videoModel] || {}).label || videoModel) + '. Generate a complete, detailed, structured video generation prompt. Output JSON only \u2014 no commentary.';

    // Build comprehensive prompt
    var prompt = 'Generate a COMPLETE structured video generation prompt for a ' + (clip.duration || 8) + 's video clip.\n\n';

    // Video generation mode context
    prompt += '--- GENERATION MODE: ' + (VIDEO_GEN_MODES[genMode] || {}).label + ' ---\n';
    if (genMode === 'frames-to-video') {
      prompt += 'This video is generated from reference frame images. The first frame image is the starting point.\n';
      if ((ff.prompt || {}).positive) prompt += 'First frame description: ' + ff.prompt.positive + '\n';
      if (lf && (lf.prompt || {}).positive) prompt += 'Last frame description: ' + lf.prompt.positive + '\n';
      if (ff.image_url) prompt += 'First frame image will be provided as reference.\n';
      if (lf && lf.image_url) prompt += 'Last frame image will be provided as reference.\n';
    } else if (genMode === 'text-to-video') {
      prompt += 'This video is generated purely from text — no reference images. The prompt must be extremely detailed and descriptive.\n';
    } else if (genMode === 'ingredients-to-video') {
      prompt += 'This video is composed from ingredient images (characters, environments, objects). The prompt must describe how to combine these ingredients into a coherent scene.\n';
      // Read seedance_assets (new Studio-linked system) first
      var _gvpSa = (ps.video || {}).seedance_assets || {};
      var _gvpSaHasData = _gvpSa.character_look_id || ((_gvpSa.env_ids || []).some(function(id) { return !!id; }));
      if (_gvpSaHasData) {
        prompt += 'Ingredient images (from Studio assets):\n';
        if (_gvpSa.character_look_id && S.lookMap) {
          var _gvpLk = S.lookMap[_gvpSa.character_look_id];
          if (_gvpLk) prompt += '- CHARACTER: ' + _gvpLk.name + (_gvpLk.combined_prompt_fragment ? ' \u2014 ' + _gvpLk.combined_prompt_fragment : '') + '\n';
        }
        var _gvpEnvIds = _gvpSa.env_ids || [];
        for (var _gvpEi = 0; _gvpEi < _gvpEnvIds.length; _gvpEi++) {
          if (!_gvpEnvIds[_gvpEi]) continue;
          var _gvpEnv = S.envMap ? S.envMap[_gvpEnvIds[_gvpEi]] : null;
          if (_gvpEnv) prompt += '- ENVIRONMENT ' + (_gvpEi + 1) + ': ' + _gvpEnv.name + ' (' + (_gvpEnv.type || 'indoor') + ')' + (_gvpEnv.prompt_fragment ? ' \u2014 ' + _gvpEnv.prompt_fragment : '') + '\n';
        }
      }
      // Also include legacy ingredients array (backward compat)
      var ingredients = (ps.video || {}).ingredients || [];
      if (ingredients.length) {
        if (_gvpSaHasData) prompt += 'Additional ingredients:\n';
        else prompt += 'Ingredient images:\n';
        for (var ing = 0; ing < ingredients.length; ing++) {
          prompt += '- ' + (ingredients[ing].label || 'Ingredient ' + (ing + 1)) + ': ' + (ingredients[ing].description || '') + '\n';
        }
      }
    }

    prompt += '\n' + buildVideoContext();
    prompt += '\n\n' + buildClipContext(clip);
    prompt += '\n' + buildSceneContext(clip);

    // AI Character speaking reinforcement
    if (clip.type === 'ai-character') {
      prompt += '\n\n=== CRITICAL: AI CHARACTER IS THE SPEAKER ===\n';
      prompt += 'The character described above IS the narrator/presenter. They speak the script text directly to camera.\n';
      prompt += 'The visual_prompt MUST show the character speaking/presenting on camera. Lip movements MUST sync with the speech audio.\n';
      prompt += 'Do NOT use a disembodied voiceover \u2014 the on-screen character IS speaking these words.\n';
    }

    var pc = clip.production_config || {};
    prompt += '\nMotion intensity: ' + ((Constants.MOTION_STRENGTHS[pc.motion_strength] || {}).label || 'medium');
    prompt += '\nCamera movement: ' + ((Constants.CAMERA_MOVEMENTS[pc.camera_movement] || {}).label || 'slow-zoom');
    prompt += '\nTransition: ' + ((Constants.TRANSITION_STYLES[pc.transition_style] || {}).label || 'smooth-dissolve');

    // Video style
    var vs = prefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    if (vs && vsDef.promptHint) prompt += '\nVideo style: ' + vsDef.label + ' \u2014 ' + vsDef.promptHint;

    // Model-specific guidance
    if (modelTemplate.formatVideoPromptGuidance) {
      prompt += '\n\n' + modelTemplate.formatVideoPromptGuidance(clip, {});
    }

    prompt += _buildCustomBlock(actionId, ci);

    // Model-specific output format
    if (isSeedance) {
      prompt += '\n\nGenerate the complete Seedance 2.0 prompt now. Use the 7-section structure. Plain text only \u2014 begin with the HEADER line:';
    } else {
      var outFmt = modelTemplate.getOutputFormat ? modelTemplate.getOutputFormat(audioMode) : JSON.stringify({
        visual_prompt: "Detailed visual description",
        motion_description: "Motion description",
        camera: "Camera work",
        style: "Style keywords",
        negative_prompt: "What to avoid"
      }, null, 2);
      prompt += '\n\nGenerate COMPLETE and DETAILED JSON:\n' + outFmt;
    }

    _showAIProgress('generate-video', false);
    LLMService.callAI(prompt, function(text) {
      try {
        ps.video = ps.video || {}; ps.video.prompt = ps.video.prompt || {};

        if (isSeedance) {
          // Seedance: plain text response — store directly, no JSON parsing
          var rawText = (text || '').trim();
          ps.video.prompt.seedance_prompt = rawText;
          // Populate visual_prompt/positive for display compatibility (first non-empty line as summary)
          var firstLine = '';
          var rawLines = rawText.split('\n');
          for (var rl = 0; rl < rawLines.length; rl++) {
            if (rawLines[rl].trim() && rawLines[rl].indexOf('===') === -1) { firstLine = rawLines[rl].trim(); break; }
          }
          ps.video.prompt.visual_prompt = firstLine || rawText.substring(0, 200);
          ps.video.prompt.positive = ps.video.prompt.visual_prompt;
          ps.video.prompt.duration = (clip.duration || 10) + 's';
          ps.video.prompt.status = 'generated';
          ps.video.prompt.model = videoModel;
          ps.video.prompt.gen_mode = genMode;
        } else {
          // All other models: JSON parsing (existing logic)
          var r = parseJSON(text);
          if (!r) { toast('Could not parse', 'error'); return; }
          // Store structured prompt fields
          ps.video.prompt.visual_prompt = _ensureString(r.visual_prompt || r.positive || '');
          ps.video.prompt.positive = _ensureString(r.visual_prompt || r.positive || ''); // backward compat
          ps.video.prompt.motion_description = _ensureString(r.motion_description || r.motion || '');
          ps.video.prompt.motion = _ensureString(r.motion_description || r.motion || ''); // backward compat
          ps.video.prompt.camera = _ensureString(r.camera || '');
          ps.video.prompt.style = _ensureString(r.style || '');
          ps.video.prompt.negative = _ensureString(r.negative_prompt || r.negative || '');
          ps.video.prompt.negative_prompt = _ensureString(r.negative_prompt || r.negative || '');
          ps.video.prompt.duration = (clip.duration || 8) + 's';
          ps.video.prompt.status = 'generated';
          ps.video.prompt.model = videoModel;
          ps.video.prompt.gen_mode = genMode;
          // Store audio data if present (VEO 3.1 with ai-audio-with-video)
          if (r.audio && typeof r.audio === 'object') {
            ps.video.prompt.audio = {
              speech: _ensureString(r.audio.speech || ''),
              voice_description: _ensureString(r.audio.voice_description || r.audio.voice || ''),
              ambient: _ensureString(r.audio.ambient || ''),
              music: _ensureString(r.audio.music || ''),
              sound_effects: _ensureString(r.audio.sound_effects || '')
            };
          }
        }

        logActivity('video_prompt_generated', 'Clip ' + clip.order + ': Video prompt (' + ((Constants.VIDEO_MODELS[videoModel] || {}).label || videoModel) + ', ' + genMode + ')');
        if (snapshot) snapshot('Video prompt'); buildMaps(); syncToTextarea(); render();
        toast('Video prompt ready!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-video', sp);
  }


  // ============================================================
  // SECTION 12: AI — STUDIO, METADATA, BRIEF, THUMBNAILS
  // ============================================================

  function analyzeStudio(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return c.track === 'ai'; });
    if (!aiClips.length) { toast('No AI clips to analyze', 'info'); return; }
    var sp = 'You are a video production studio manager. Analyze clips and determine needed looks, environments, scenes. Output JSON only.';
    var prompt = 'Analyze these AI clips for studio requirements.\n\n' + buildVideoContext() + '\n\n--- AI CLIPS ---\n';
    for (var i = 0; i < aiClips.length; i++) { var c = aiClips[i]; prompt += '#' + c.order + ' ' + c.title + ' (' + c.type + '): ' + (c.visual_direction || c.script_text || '') + '\n'; }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"looks":[{"name":"","description":"","prompt_fragment":""}],"environments":[{"name":"","type":"studio-set|indoor|outdoor","prompt_fragment":""}],"scenes":[{"name":"","look":"look name","environment":"env name"}]}';
    _showAIProgress('analyze-studio', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before studio');
        var created = 0;
        if (r.looks) { for (var li = 0; li < r.looks.length; li++) { var rl = r.looks[li]; var lk = createDefaultLook(); lk.name = rl.name || 'Look ' + (li+1); lk.combined_prompt_fragment = rl.prompt_fragment || rl.description || ''; lk._draft = true; S.meta.lookLibrary.push(lk); created++; } }
        if (r.environments) { for (var ei = 0; ei < r.environments.length; ei++) { var re = r.environments[ei]; var env = createDefaultEnvironment(); env.name = re.name || 'Env ' + (ei+1); env.type = re.type || 'indoor'; env.prompt_fragment = re.prompt_fragment || ''; env._draft = true; S.meta.environmentLibrary.push(env); created++; } }
        logActivity('studio_analyzed', 'AI created ' + created + ' draft entities');
        if (snapshot) snapshot('After studio'); buildMaps(); syncToTextarea(); render();
        toast(created + ' draft entities created!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'analyze-studio', sp, { max_tokens: 8000 });
  }

  function generateMetadata(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sp = 'You are a YouTube SEO expert. Generate optimized metadata. Output JSON only.';
    var prompt = 'Generate YouTube metadata.\n\n' + buildVideoContext() + '\n\n' + buildScriptContext();
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"SEO title","title_options":["alt1","alt2","alt3"],"description":"full description with timestamps","tags":["tag1","tag2"],"hashtags":["#tag1"],"category":"education","chapters":[{"time":"0:00","label":"Intro"}]}';
    _showAIProgress('generate-metadata', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before metadata');
        var yt = S.data.publishing.youtube = S.data.publishing.youtube || {};
        if (r.title) yt.title = r.title;
        if (r.title_options) yt.title_options = r.title_options;
        if (r.description) yt.description = r.description;
        if (r.tags) yt.tags = r.tags;
        if (r.hashtags) yt.hashtags = r.hashtags;
        if (r.category) yt.category = r.category;
        if (r.chapters) yt.chapters = r.chapters;
        logActivity('metadata_generated', 'AI generated YouTube metadata');
        if (snapshot) snapshot('After metadata'); buildMaps(); syncToTextarea(); render();
        toast('Metadata generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-metadata', sp, { max_tokens: 4000 });
  }

  function improveBrief(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) return;
    var nap = clip.non_ai_planning || {};
    var sp = 'You are a video production manager. Improve the recording brief. Output JSON only.';
    var prompt = 'Improve this production brief.\n\n' + buildVideoContext() + '\n\n' + buildClipContext(clip);
    prompt += '\nCurrent brief: ' + (nap.brief || 'none') + '\nCurrent instructions: ' + (nap.instructions || 'none');
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"brief":"improved brief","instructions":"step-by-step"}';
    _showAIProgress('improve-brief', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before brief');
        clip.non_ai_planning = clip.non_ai_planning || {};
        if (r.brief) clip.non_ai_planning.brief = r.brief;
        if (r.instructions) clip.non_ai_planning.instructions = r.instructions;
        maybeAdvanceClipStatus(clip, 'brief improved');
        logActivity('clip_edited', 'Clip ' + clip.order + ': AI improved brief');
        if (snapshot) snapshot('After brief'); buildMaps(); syncToTextarea(); render();
        toast('Brief improved!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'improve-brief', sp);
  }

  function generateThumbnailIdeas(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sp = 'You are a YouTube thumbnail design expert. Generate 4 distinctive concepts. Output JSON only.';
    var prompt = 'Generate 4 thumbnail concepts.\n\n' + buildVideoContext();
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"ideas":[{"title":"concept name","desc":"description","text":"main text overlay","subtext":"optional subtitle","colors":"color palette","mood":"energetic|calm|dramatic","layout":"center|rule-of-thirds|split","score":85}]}';
    _showAIProgress('generate-thumbnails', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.ideas || !r.ideas.length) { toast('No ideas parsed', 'error'); return; }
        S.data.thumbnails = S.data.thumbnails || {};
        S.data.thumbnails.ideas = [];
        for (var i = 0; i < r.ideas.length; i++) { r.ideas[i].id = generateId('thumb'); S.data.thumbnails.ideas.push(r.ideas[i]); }
        S.thumbnailStep = 'ideas';
        logActivity('thumbnails_generated', 'AI generated ' + r.ideas.length + ' thumbnail concepts');
        if (snapshot) snapshot('Thumbnail ideas'); buildMaps(); syncToTextarea(); render();
        toast(r.ideas.length + ' thumbnail concepts ready!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-thumbnails', sp);
  }


  // ============================================================
  // SECTION 12B: AI — BLUEPRINT, CHAPTERS, SCENES, RESEARCH REGEN, THUMBNAIL CHAT
  // ============================================================

  function generateBlueprint(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var input = S.data.start.raw_input || '';
    var prefs = (S.data.start || {}).preferences || {};
    var sp = 'You are an expert video production planner. Create a structured video blueprint with sections. Output JSON only.';
    var prompt = 'Generate a video blueprint.\n\n' + buildVideoContext();
    if (input) prompt += '\n\nOriginal idea: "' + input + '"';
    prompt += '\nTarget duration: ' + (prefs.target_duration || 120) + 's';
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"video title","description":"one sentence","tone":"casual|professional|energetic","target_audience":"who","style_notes":"visual style notes","sections":[{"label":"Section Name","duration":60,"key_points":["point 1","point 2"],"visual_notes":"what to show"}]}';
    _showAIProgress('analyze-idea', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.sections || !r.sections.length) { toast('No sections parsed', 'error'); return; }
        if (snapshot) snapshot('Before AI blueprint');
        var bp = S.data.blueprint;
        if (r.title) bp.title = r.title;
        if (r.description) bp.description = r.description;
        if (r.tone) bp.tone = r.tone;
        if (r.target_audience) bp.target_audience = r.target_audience;
        if (r.style_notes) bp.style_notes = r.style_notes;
        bp.sections = [];
        for (var i = 0; i < r.sections.length; i++) {
          var rs = r.sections[i];
          bp.sections.push({ id: generateId('sec'), label: rs.label || 'Section ' + (i + 1), duration: parseInt(rs.duration, 10) || 0, key_points: rs.key_points || [], visual_notes: rs.visual_notes || '', order: i + 1 });
        }
        logActivity('blueprint_generated', 'AI generated blueprint with ' + bp.sections.length + ' sections');
        if (snapshot) snapshot('After AI blueprint'); buildMaps(); syncToTextarea(); render();
        toast('Blueprint generated with ' + bp.sections.length + ' sections!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'analyze-idea', sp, { max_tokens: 4000 });
  }

  function generateChapters(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    if (!clips.length) { toast('Need clips to generate chapters', 'warning'); return; }
    var sp = 'You are a YouTube SEO expert. Generate video chapters from clip data. Output JSON only.';
    var prompt = 'Generate YouTube chapters.\n\n' + buildVideoContext() + '\n\n--- CLIPS ---\n';
    var t = 0;
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      var m = Math.floor(t / 60), s = t % 60;
      prompt += m + ':' + (s < 10 ? '0' : '') + s + ' - #' + c.order + ' ' + (c.title || c.type) + ' (' + c.duration + 's)\n';
      t += c.duration || 0;
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"chapters":[{"time":"0:00","label":"Chapter Name"}]}';
    _showAIProgress('generate-metadata', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.chapters) { toast('Could not parse', 'error'); return; }
        S.data.publishing = S.data.publishing || {};
        S.data.publishing.youtube = S.data.publishing.youtube || {};
        S.data.publishing.youtube.chapters = r.chapters;
        logActivity('chapters_generated', 'AI generated ' + r.chapters.length + ' chapters');
        if (snapshot) snapshot('Chapters'); buildMaps(); syncToTextarea(); render();
        toast(r.chapters.length + ' chapters generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-metadata', sp);
  }

  function generateScenes(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var looks = S.allLooks || [];
    var envs = S.allEnvironments || [];
    if (!looks.length && !envs.length) { toast('Create looks or environments first', 'warning'); return; }
    var sp = 'You are a video production scene designer. Create scenes by combining looks and environments for visual consistency. Output JSON only.';
    var prompt = 'Generate scenes for this video.\n\n' + buildVideoContext();

    // Video style context
    var prefs = ((S.data.start || {}).preferences || {});
    var vs = prefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    if (vs && vsDef.promptHint) {
      prompt += '\n\n--- VIDEO STYLE ---\n' + vsDef.label + ': ' + vsDef.promptHint;
      prompt += '\nAll scenes should be visually consistent with this style.';
    }

    // Audio context
    var audioMode = prefs.audio_mode || '';
    if (audioMode === 'ai-audio-with-video') {
      prompt += '\n\n--- AUDIO ---\nThis video uses AI-generated audio with video. Scenes should consider audio/acoustic environment (e.g. indoor reverb, outdoor ambient).';
    }

    prompt += '\n\n--- AVAILABLE LOOKS ---\n';
    for (var li = 0; li < looks.length; li++) prompt += '- ' + looks[li].name + ' (id: ' + looks[li].id + ', role: ' + (looks[li].role || 'unspecified') + ')' + (looks[li].combined_prompt_fragment ? ' \u2014 ' + looks[li].combined_prompt_fragment : '') + '\n';
    prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
    for (var ei = 0; ei < envs.length; ei++) prompt += '- ' + envs[ei].name + ' (id: ' + envs[ei].id + ', type: ' + (envs[ei].type || 'indoor') + ')' + (envs[ei].prompt_fragment ? ' \u2014 ' + envs[ei].prompt_fragment : '') + '\n';

    // Clip-requirement-aware generation
    var aiClips = (S.data.clips || []).filter(function(c) { return c.track === 'ai'; });
    if (aiClips.length) {
      prompt += '\n--- CLIP REQUIREMENTS ---\n';
      prompt += 'Generate scenes that cover the needs of these clips:\n';
      for (var ci2 = 0; ci2 < aiClips.length; ci2++) {
        var c = aiClips[ci2];
        prompt += '#' + c.order + ' ' + (c.title || 'Untitled') + ' (' + c.type + '): ' + (c.visual_direction || c.script_text || 'No description').substring(0, 100) + '\n';
        if (c.type === 'ai-character') prompt += '  ^ NEEDS CHARACTER LOOK in scene\n';
      }
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"scenes":[{"name":"Scene Name","look_ids":["look_id"],"environment_id":"env_id","camera_direction":"camera description","notes":"usage notes","suggested_clips":[1,2]}]}';
    _showAIProgress('analyze-studio', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.scenes) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before scenes gen');
        var created = 0;
        for (var si = 0; si < r.scenes.length; si++) {
          var rs = r.scenes[si];
          var scene = createDefaultScene();
          scene.name = rs.name || 'Scene ' + (si + 1);
          if (rs.look_ids) scene.look_ids = rs.look_ids;
          if (rs.environment_id) scene.environment_id = rs.environment_id;
          scene.camera_direction = rs.camera_direction || '';
          scene.notes = rs.notes || '';
          S.meta.sceneLibrary.push(scene);
          created++;

          // Auto-assign scene to suggested clips
          if (rs.suggested_clips && rs.suggested_clips.length) {
            for (var sc = 0; sc < rs.suggested_clips.length; sc++) {
              var clipOrder = rs.suggested_clips[sc];
              var matchClip = aiClips.find(function(ac) { return ac.order === clipOrder; });
              if (matchClip) {
                ensurePromptSet(matchClip);
                var ff = matchClip.prompt_set.first_frame;
                if (ff && (!ff.scene || !ff.scene.scene_template_id)) {
                  ff.scene = ff.scene || {};
                  ff.scene.scene_template_id = scene.id;
                  ff.scene.look_ids = scene.look_ids || [];
                  ff.scene.environment_id = scene.environment_id || '';
                }
              }
            }
          }
        }
        logActivity('scene_created', 'AI generated ' + created + ' scenes (style-aware)');
        if (snapshot) snapshot('After scenes gen'); buildMaps(); syncToTextarea(); render();
        toast(created + ' scenes generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'analyze-studio', sp);
  }

  // --- AI Suggest: Brand Library Items ---
  // --- AI Split: Split an overflowing clip into multiple clips ---
  function aiSplitClip(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) { toast('Clip not found', 'error'); return; }
    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var maxWords = getMaxWordsForDuration(clip.duration || 8, wpm);
    var actualWords = countWords(clip.script_text || '');
    if (actualWords <= maxWords) { toast('Script fits within duration — no split needed', 'info'); return; }
    var numClips = Math.ceil(actualWords / maxWords);
    var sp = 'You are a script editor. Split the voiceover script into ' + numClips + ' segments, each max ' + maxWords + ' words. Preserve natural breaks and narrative flow. Output JSON only.';
    var prompt = 'Split this clip\'s voiceover script into ' + numClips + ' segments.\n\n';
    prompt += 'Clip: "' + (clip.title || 'Untitled') + '" (' + clip.type + ', ' + (clip.duration || 8) + 's per clip)\n';
    prompt += 'Max words per segment: ' + maxWords + ' (at ' + wpm + ' WPM for ' + (clip.duration || 8) + 's)\n';
    prompt += 'Original script (' + actualWords + ' words): "' + (clip.script_text || '') + '"\n';
    prompt += 'Visual direction: "' + (clip.visual_direction || '') + '"\n\n';
    prompt += 'Split into EXACTLY ' + numClips + ' segments. Each MUST be <= ' + maxWords + ' words.\n';
    prompt += 'JSON:\n{"segments":[{"title":"short descriptive title","script_text":"voiceover segment (max ' + maxWords + ' words)","visual_direction":"what to show"}]}';

    _showAIProgress('ai-split', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.segments || !r.segments.length) { toast('Could not parse split', 'error'); return; }
        if (snapshot) snapshot('Before clip split');
        // Find clip index
        var clips = S.data.clips || [];
        var clipIdx = -1;
        for (var ci2 = 0; ci2 < clips.length; ci2++) { if (clips[ci2].id === clipId) { clipIdx = ci2; break; } }
        if (clipIdx === -1) { toast('Clip not found', 'error'); return; }
        // Create replacement clips
        var newClips = [];
        for (var si = 0; si < r.segments.length; si++) {
          var seg = r.segments[si];
          var nc = createLightweightClip(clip.type, clip.section, clip.order + si);
          nc.title = _ensureString(seg.title || clip.title + ' (Part ' + (si + 1) + ')');
          nc.script_text = _ensureString(seg.script_text || '');
          nc.visual_direction = _ensureString(seg.visual_direction || clip.visual_direction || '');
          nc.onscreen_text = clip.onscreen_text || '';
          nc.duration = clip.duration || 8;
          nc.timing = { start: 0, end: nc.duration };
          newClips.push(nc);
        }
        // Replace original clip with new clips
        clips.splice(clipIdx, 1);
        for (var ni = newClips.length - 1; ni >= 0; ni--) { clips.splice(clipIdx, 0, newClips[ni]); }
        // Reorder
        for (var ri = 0; ri < clips.length; ri++) { clips[ri].order = ri + 1; }
        recomputeClipTimings();
        logActivity('clip_split', 'Split clip "' + (clip.title || '#' + clip.order) + '" into ' + newClips.length + ' clips');
        if (snapshot) snapshot('After clip split'); buildMaps(); syncToTextarea(); render();
        toast('Clip split into ' + newClips.length + ' segments!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'ai-split', sp);
  }

  // --- Auto-Assign: AI assigns looks/environments to unassigned clips ---
  function autoAssignAssets(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    var unassigned = clips.filter(function(c) {
      if ((c.track || (Constants.CLIP_TYPES[c.type] || {}).track) !== 'ai') return false;
      var scene = (((c.prompt_set || {}).first_frame || {}).scene || {});
      return !scene.scene_template_id && !(scene.look_ids && scene.look_ids.length) && !scene.environment_id;
    });
    if (!unassigned.length) { toast('All AI clips are assigned', 'info'); return; }
    if (!S.allLooks.length && !S.allEnvironments.length) { toast('Create looks or environments first', 'warning'); return; }

    var sp = 'You are a video production assistant. Assign the best matching look and environment to each unassigned clip. Output JSON only.';
    var prompt = 'Auto-assign looks and environments to these unassigned clips.\n\n' + buildVideoContext();
    if (S.allLooks.length) {
      prompt += '\n\n--- AVAILABLE LOOKS ---\n';
      for (var li = 0; li < S.allLooks.length; li++) { var lk = S.allLooks[li]; prompt += '- ' + lk.id + ': ' + (lk.name || 'Unnamed') + ' (' + (lk.role || '') + ') ' + (lk.combined_prompt_fragment || '').substring(0, 80) + '\n'; }
    }
    if (S.allEnvironments.length) {
      prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
      for (var ei = 0; ei < S.allEnvironments.length; ei++) { var env = S.allEnvironments[ei]; prompt += '- ' + env.id + ': ' + (env.name || 'Unnamed') + ' (' + (env.type || 'indoor') + ') ' + (env.prompt_fragment || '').substring(0, 80) + '\n'; }
    }
    prompt += '\n--- UNASSIGNED CLIPS ---\n';
    for (var ci2 = 0; ci2 < unassigned.length; ci2++) {
      var c = unassigned[ci2];
      prompt += '#' + c.order + ' ' + c.id + ' (' + c.type + '): ' + (c.title || '') + ' \u2014 ' + (c.visual_direction || c.script_text || '').substring(0, 80) + '\n';
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\nFor ai-character clips, ALWAYS assign a look. For all clips, assign an environment.\n';
    prompt += 'JSON:\n{"assignments":[{"clip_id":"clip_id","look_id":"look_id or empty string","environment_id":"env_id or empty string"}]}';

    _showAIProgress('auto-assign', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.assignments) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before auto-assign');
        var count = 0;
        for (var ai = 0; ai < r.assignments.length; ai++) {
          var a = r.assignments[ai];
          var clip = S.clipMap[a.clip_id]; if (!clip) continue;
          ensurePromptSet(clip);
          clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
          clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
          if (a.look_id && S.lookMap[a.look_id]) { clip.prompt_set.first_frame.scene.look_ids = [a.look_id]; count++; }
          if (a.environment_id && S.envMap[a.environment_id]) { clip.prompt_set.first_frame.scene.environment_id = a.environment_id; count++; }
          maybeAdvanceClipStatus(clip, 'auto-assigned');
        }
        logActivity('auto_assigned', 'AI auto-assigned ' + count + ' assets to ' + r.assignments.length + ' clips');
        if (snapshot) snapshot('After auto-assign'); buildMaps(); syncToTextarea(); render();
        toast(count + ' assignments made!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'auto-assign', sp, { max_tokens: 4000 });
  }

  function suggestBrandItems(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.looks.length && !bs.environments.length && !bs.characters.length)) {
      toast('No brand library items available', 'info'); return;
    }
    var sp = 'You are a video production assistant. Recommend which brand library assets best fit this video project. Output JSON only.';
    var prompt = 'Suggest which brand library items to use for this video.\n\n' + buildVideoContext();
    prompt += '\n\n--- AVAILABLE BRAND LIBRARY ---\n';
    if (bs.looks.length) {
      prompt += 'LOOKS:\n';
      for (var li = 0; li < bs.looks.length; li++) prompt += '- id: ' + bs.looks[li].id + ', name: ' + (bs.looks[li].name || 'Unnamed') + ', role: ' + (bs.looks[li].role || '') + ', desc: ' + (bs.looks[li].combined_prompt_fragment || '').substring(0, 80) + '\n';
    }
    if (bs.environments.length) {
      prompt += 'ENVIRONMENTS:\n';
      for (var ei = 0; ei < bs.environments.length; ei++) prompt += '- id: ' + bs.environments[ei].id + ', name: ' + (bs.environments[ei].name || 'Unnamed') + ', type: ' + (bs.environments[ei].type || '') + '\n';
    }
    if (bs.scenes.length) {
      prompt += 'SCENES:\n';
      for (var si = 0; si < bs.scenes.length; si++) prompt += '- id: ' + bs.scenes[si].id + ', name: ' + (bs.scenes[si].name || 'Unnamed') + '\n';
    }
    if (bs.characters.length) {
      prompt += 'CHARACTERS:\n';
      for (var chi = 0; chi < bs.characters.length; chi++) prompt += '- id: ' + bs.characters[chi].id + ', name: ' + (bs.characters[chi].name || 'Unnamed') + '\n';
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nSelect the most relevant items. Return ONLY IDs of items that fit this video.\nJSON:\n{"selected_look_ids":["id1"],"selected_environment_ids":["id1"],"selected_scene_ids":["id1"],"selected_character_ids":["id1"],"reasoning":"brief explanation"}';
    _showAIProgress('suggest-brand', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        S.data.start.brand_selections = S.data.start.brand_selections || {};
        if (r.selected_look_ids) S.data.start.brand_selections.selected_look_ids = r.selected_look_ids;
        if (r.selected_environment_ids) S.data.start.brand_selections.selected_environment_ids = r.selected_environment_ids;
        if (r.selected_scene_ids) S.data.start.brand_selections.selected_scene_ids = r.selected_scene_ids;
        if (r.selected_character_ids) S.data.start.brand_selections.selected_character_ids = r.selected_character_ids;
        S.data.start.brand_selections.ai_suggested = true;
        if (snapshot) snapshot('AI brand suggest'); buildMaps(); syncToTextarea(); render();
        toast('Brand items suggested!' + (r.reasoning ? ' ' + r.reasoning.substring(0, 80) : ''), 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'suggest-brand', sp);
  }

  // --- AI Suggest: Clip Scene Assignment ---
  function suggestClipScene(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) { toast('Clip not found', 'error'); return; }
    var hasAssets = (S.allScenes || []).length || (S.allLooks || []).length || (S.allEnvironments || []).length;
    if (!hasAssets) { toast('Create looks, environments, or scenes first', 'warning'); return; }
    var sp = 'You are a video production scene designer. Recommend the best scene, look, and environment for this specific clip. Output JSON only.';
    var prompt = 'Suggest the best scene setup for this clip.\n\n' + buildVideoContext() + '\n\n' + buildClipContext(clip);
    // List available assets
    if ((S.allScenes || []).length) {
      prompt += '\n\n--- AVAILABLE SCENES ---\n';
      for (var si = 0; si < S.allScenes.length; si++) {
        var sc = S.allScenes[si];
        prompt += '- id: ' + sc.id + ', name: ' + (sc.name || 'Unnamed') + ', camera: ' + (sc.camera_direction || '') + '\n';
      }
    }
    if ((S.allLooks || []).length) {
      prompt += '\n--- AVAILABLE LOOKS ---\n';
      for (var li = 0; li < S.allLooks.length; li++) {
        var lk = S.allLooks[li];
        prompt += '- id: ' + lk.id + ', name: ' + (lk.name || 'Unnamed') + ', role: ' + (lk.role || '') + '\n';
      }
    }
    if ((S.allEnvironments || []).length) {
      prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
      for (var ei = 0; ei < S.allEnvironments.length; ei++) {
        var env = S.allEnvironments[ei];
        prompt += '- id: ' + env.id + ', name: ' + (env.name || 'Unnamed') + ', type: ' + (env.type || 'indoor') + '\n';
      }
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nPick the best match. If a scene template fits, use it. Otherwise suggest direct look + environment.\nJSON:\n{"scene_template_id":"scene_id or empty","look_ids":["look_id"],"environment_id":"env_id","reasoning":"why this fits"}';
    _showAIProgress('suggest-clip-scene', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        ensurePromptSet(clip);
        clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
        clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
        if (r.scene_template_id && S.sceneMap && S.sceneMap[r.scene_template_id]) {
          clip.prompt_set.first_frame.scene.scene_template_id = r.scene_template_id;
          var sc = S.sceneMap[r.scene_template_id];
          clip.prompt_set.first_frame.scene.look_ids = (sc.look_ids || []).slice();
          clip.prompt_set.first_frame.scene.environment_id = sc.environment_id || '';
        } else {
          clip.prompt_set.first_frame.scene.scene_template_id = '';
          if (r.look_ids) clip.prompt_set.first_frame.scene.look_ids = r.look_ids;
          if (r.environment_id) clip.prompt_set.first_frame.scene.environment_id = r.environment_id;
        }
        maybeAdvanceClipStatus(clip, 'AI scene suggestion');
        logActivity('scene_suggested', 'AI suggested scene for clip #' + clip.order + (r.reasoning ? ': ' + r.reasoning.substring(0, 60) : ''));
        if (snapshot) snapshot('AI scene suggest'); buildMaps(); syncToTextarea(); render();
        toast('Scene suggested for clip #' + clip.order + '!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'suggest-clip-scene', sp);
  }

  function regenerateResearchSection(sectionKey, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var labels = { audience_insights: 'Audience Insights', competitor_analysis: 'Competitor Analysis', trending_angles: 'Trending Angles', content_strategy: 'Content Strategy' };
    var sp = 'You are an expert content researcher. Regenerate this specific research section with fresh insights. Output JSON only.';
    var prompt = 'Regenerate the "' + (labels[sectionKey] || sectionKey) + '" section.\n\n' + buildVideoContext();
    var currentContent = (S.data.research || {})[sectionKey] || '';
    if (currentContent) prompt += '\n\nCurrent content (improve upon this): ' + currentContent;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"content":"detailed fresh analysis"}';
    _showAIProgress('generate-research', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.content) { toast('Could not parse', 'error'); return; }
        S.data.research = S.data.research || {};
        S.data.research[sectionKey] = _ensureString(r.content);
        logActivity('research_updated', 'Regenerated: ' + (labels[sectionKey] || sectionKey));
        if (snapshot) snapshot('Regen research'); buildMaps(); syncToTextarea(); render();
        toast((labels[sectionKey] || 'Section') + ' regenerated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-research', sp);
  }

  function regenerateThumbnailIdea(ideaId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var ideas = (S.data.thumbnails || {}).ideas || [];
    var idx = -1;
    for (var i = 0; i < ideas.length; i++) { if (ideas[i].id === ideaId) { idx = i; break; } }
    if (idx === -1) return;
    var sp = 'You are a YouTube thumbnail expert. Generate ONE fresh thumbnail concept to replace the current one. Output JSON only.';
    var prompt = 'Regenerate this thumbnail concept.\n\n' + buildVideoContext();
    prompt += '\nCurrent concept: ' + (ideas[idx].title || '') + ' — ' + (ideas[idx].desc || '');
    prompt += '\nOther concepts to differ from: ' + ideas.filter(function(_, i) { return i !== idx; }).map(function(i) { return i.title; }).join(', ');
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"concept name","desc":"description","text":"overlay text","subtext":"optional","colors":"palette","mood":"energetic|calm|dramatic","layout":"center|split|rule-of-thirds","score":85}';
    _showAIProgress('generate-thumbnails', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.title) { toast('Could not parse', 'error'); return; }
        r.id = ideas[idx].id; // preserve ID
        ideas[idx] = r;
        logActivity('thumbnail_updated', 'Regenerated thumbnail: ' + r.title);
        if (snapshot) snapshot('Regen thumbnail'); buildMaps(); syncToTextarea(); render();
        toast('Thumbnail concept refreshed!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-thumbnails', sp);
  }

  function thumbnailChatAI(userMessage) {
    if (!LLMService.isConfigured()) {
      // Fallback: echo-style placeholder
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'AI not configured. Your feedback "' + userMessage + '" has been noted. Configure AI in Settings for real-time refinement.', timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      return;
    }
    var idea = (S.data.thumbnails.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
    var sp = 'You are a YouTube thumbnail design expert. Help refine a thumbnail concept based on user feedback. Be specific about visual changes. Respond naturally in 2-3 sentences.';
    var prompt = 'Thumbnail concept: "' + ((idea || {}).title || '') + '"\nDescription: ' + ((idea || {}).desc || '');
    prompt += '\n\nChat history:\n';
    var history = S.data.thumbnails.chat_history || [];
    for (var i = Math.max(0, history.length - 6); i < history.length; i++) {
      prompt += history[i].role + ': ' + history[i].text + '\n';
    }
    prompt += '\nUser: ' + userMessage;
    prompt += '\n\nRespond with specific visual refinement advice. Do NOT output JSON.';
    _showAIProgress('generate-thumbnails', false);
    LLMService.callAI(prompt, function(text) {
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: text, timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      setTimeout(function() { var $msgs = $('#vpmThumbChatMessages'); if ($msgs.length) $msgs.scrollTop($msgs[0].scrollHeight); }, 50);
    }, function(err) {
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'Sorry, I encountered an error: ' + err + '. Please try again.', timestamp: new Date().toISOString() });
      syncToTextarea(); render();
    }, 'generate-thumbnails', sp);
  }


  // ============================================================
  // SECTION 13: SETTINGS VIEW — WIREFRAME-ACCURATE (5 tabs)
  // ============================================================

  function renderSettingsView() {
    var html = '<div class="vpm-view"><div class="vpm-view-header"><h2 class="vpm-view-title">' + icon('gear') + ' Settings</h2></div>';
    html += '<div class="vpm-inner-tabs">';
    for (var tk in Constants.SETTINGS_TABS) {
      var t = Constants.SETTINGS_TABS[tk];
      html += '<button class="vpm-inner-tab' + (S.currentSettingsTab === tk ? ' vpm-inner-tab-active' : '') + '" data-action="settings-tab" data-tab="' + tk + '">' + icon(t.icon) + ' ' + esc(t.label) + '</button>';
    }
    html += '</div>';
    switch (S.currentSettingsTab) {
      case 'general':        html += _settingsGeneral(); break;
      case 'ai':             html += _settingsAI(); break;
      case 'defaults':       html += _settingsDefaults(); break;
      case 'brand':          html += _settingsBrand(); break;
      case 'import-export':  html += _settingsImportExport(); break;
      default: html += _settingsGeneral();
    }
    html += '</div>';
    return html;
  }

  // --- TAB: GENERAL (Video Info + Default Preferences) ---
  function _settingsGeneral() {
    var v = S.data.video || {}; var st = S.data.start || {}; var prefs = st.preferences || {};
    var clips = S.data.clips || []; var totalDur = 0; for (var i = 0; i < clips.length; i++) totalDur += clips[i].duration || 0;
    var html = '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('info') + ' Video Info</div>';
    html += '<div class="vpm-settings-grid">';
    html += _infoRow('Title', esc(v.title || 'Untitled'));
    html += _infoRow('Status', statusBadge(S.computedStatus));
    html += _infoRow('Mode', badge(S.mode === 'advanced' ? 'Advanced \u00B7 7 stages' : 'Standard \u00B7 5 stages', S.mode === 'advanced' ? '#7c3aed' : '#1a73e8'));
    html += _infoRow('Platform', esc(((Constants.PLATFORMS[prefs.platform] || {}).label || prefs.platform || 'YouTube') + ' \u00B7 ' + (prefs.aspect_ratio || '16:9')));
    html += _infoRow('Clips', clips.length + ' clips \u00B7 ' + formatDuration(totalDur));
    html += _infoRow('Script', (S.data.script.total_word_count || 0) + ' words \u00B7 ' + formatDuration(S.data.script.estimated_duration || 0));
    html += _infoRow('Created', v.created ? formatDate(v.created) : '\u2014');
    html += _infoRow('Modified', v.modified ? formatRelativeTime(v.modified) : '\u2014');
    html += _infoRow('Language', (Constants.LANGUAGES[prefs.language] || {}).label || prefs.language || 'English');
    html += '</div></div>';

    // Default Preferences
    var stg = S.meta.settings || {};
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('sliders') + ' Default Preferences</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">These defaults apply when creating new videos. Override per-video in Start stage.</p>';
    html += '<div class="vpm-form-grid">';
    html += _settingsSelect('Default Language', 'default_language', stg.default_language, Constants.LANGUAGES);
    html += _settingsSelect('Default Platform', 'default_platform', stg.default_platform, Constants.PLATFORMS);
    html += _settingsSelect('Default Production Mode', 'default_production_mode', stg.default_production_mode, Constants.PRODUCTION_MODES);
    html += _settingsSelect('Default Presenter', 'default_presenter', stg.default_presenter, Constants.PRESENTER_PREFS);
    html += _settingsSelect('Default Aspect Ratio', 'default_aspect_ratio', stg.default_aspect_ratio, Constants.ASPECT_RATIOS);
    html += _settingsSelect('Default Audio Mode', 'default_audio_mode', stg.default_audio_mode, Constants.AUDIO_MODES);
    html += '</div></div>';
    return html;
  }

  function _infoRow(label, value) {
    return '<div class="vpm-info-row"><span class="vpm-info-label">' + label + '</span><span class="vpm-info-value">' + value + '</span></div>';
  }

  function _settingsSelect(label, path, currentVal, options) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">' + esc(label) + '</label><select class="vpm-select" data-setting-path="' + path + '">';
    for (var k in options) html += '<option value="' + k + '"' + (currentVal === k ? ' selected' : '') + '>' + esc(options[k].label || k) + '</option>';
    html += '</select></div>';
    return html;
  }

  // --- TAB: AI PROVIDERS (wireframe layout with provider cards) ---
  function _settingsAI() {
    var html = '';
    // Info banner
    html += '<div class="vpm-info-banner">' + icon('info') + ' <span>Providers are configured in your <strong>Drupal user profile</strong>. Active providers and their enabled models appear below.</span></div>';

    if (!LLMService.isConfigured()) {
      html += '<div class="vpm-panel"><div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('microchip') + '</div><h3>No AI Providers</h3><p>Configure AI providers in your Drupal user profile to enable AI features.</p></div></div>';
      return html;
    }

    // Text AI Default Selector
    var def = LLMService.getDefault();
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('robot') + ' Text AI Default</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:10px">This model is used for all AI actions unless overridden per-action in the preflight modal.</p>';
    if (def) {
      html += '<div class="vpm-settings-ai-current"><span class="vpm-text-xs vpm-text-muted">Current Default:</span> <strong class="vpm-text-sm">' + esc(def.provider) + ' / ' + esc(def.model) + '</strong></div>';
    }
    html += '<div class="vpm-settings-ai-picker">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Provider</label>' + LLMService.renderInlinePicker('app-default').split('</select>')[0] + '</select></div>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="set-app-ai-default" style="align-self:flex-end">' + icon('check') + ' Set Default</button>';
    html += '</div></div>';

    // Provider Cards
    var providers = LLMService.getActiveProviders();
    html += '<div class="vpm-settings-section-label">' + icon('microchip') + ' Active Providers (' + providers.length + ')</div>';
    for (var pi = 0; pi < providers.length; pi++) {
      var p = providers[pi]; var isD = def && def.provider === p.id;
      html += '<div class="vpm-provider-card' + (isD ? ' vpm-provider-card-default' : '') + '">';
      html += '<div class="vpm-provider-header"><div class="vpm-provider-header-left"><span class="vpm-provider-icon">' + icon('sparkles') + '</span><span class="vpm-provider-name">' + esc(p.label) + '</span></div>';
      html += '<span class="vpm-text-xs vpm-text-muted">' + p.activeModels.length + ' model' + (p.activeModels.length > 1 ? 's' : '') + '</span></div>';
      html += '<div class="vpm-provider-key"><span class="vpm-provider-key-icon">' + icon('lock') + '</span><span class="vpm-provider-key-text">\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' + (p.api_key ? p.api_key.slice(-4) : '') + '</span></div>';
      html += '<div class="vpm-provider-models">';
      for (var mi = 0; mi < p.activeModels.length; mi++) {
        var m = p.activeModels[mi]; var isMD = def && def.provider === p.id && def.model === m.id;
        html += '<div class="vpm-provider-model-row' + (isMD ? ' vpm-provider-model-default' : '') + '">';
        html += '<span class="vpm-provider-model-name">' + esc(m.label || m.id);
        if (isMD) html += ' <span class="vpm-provider-default-star">\u2605</span>';
        html += '</span>';
        html += '<span class="vpm-provider-model-meta"><span>temp ' + (m.temperature !== undefined ? m.temperature : 1) + '</span><span>' + ((m.max_tokens || 8192) >= 1000 ? ((m.max_tokens || 8192) / 1000) + 'k' : (m.max_tokens || 8192)) + ' tok</span></span>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Image & Video Models
    var prefs = S.meta.aiPreferences || {};
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('image') + ' Image & Video Models</div><div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Image Generation Model</label><select class="vpm-select" data-action="save-ai-pref" data-field="imageModel">';
    for (var imk in Constants.IMAGE_MODELS) html += '<option value="' + imk + '"' + (prefs.imageModel === imk ? ' selected' : '') + '>' + esc(Constants.IMAGE_MODELS[imk].label) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Video Generation Model</label><select class="vpm-select" data-action="save-ai-pref" data-field="videoModel">';
    for (var vmk in Constants.VIDEO_MODELS) { var vm = Constants.VIDEO_MODELS[vmk]; html += '<option value="' + vmk + '"' + (prefs.videoModel === vmk ? ' selected' : '') + '>' + esc(vm.label) + ' \u2014 max ' + (vm.maxDuration || vm.defaultDuration || 8) + 's</option>'; }
    html += '</select></div></div>';
    html += '<div class="vpm-form-group" style="margin-top:8px"><label class="vpm-form-label">Global Negative Prompt</label>';
    html += '<textarea class="vpm-textarea" data-action="save-ai-pref-text" data-field="globalNegative" rows="2" style="font-family:var(--vpm-font-mono);font-size:11px">' + esc(prefs.globalNegative || '') + '</textarea>';
    html += '<span class="vpm-text-xs vpm-text-muted" style="margin-top:3px;display:block">Applied to all image/video generation prompts automatically.</span></div></div>';

    // Current Video Profile (read-only from start preferences)
    var startPrefs = ((S.data.start || {}).preferences || {});
    var vs = startPrefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    var am = startPrefs.audio_mode || '';
    var amDef = (Constants.AUDIO_MODES || {})[am] || {};
    var vp = startPrefs.voice_profile || {};
    if (vs || am || vp.style) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('palette') + ' Current Video Profile</div>';
      html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:8px">Configured in the Start stage for this video.</p>';
      if (vs) html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Video Style:</strong> <span class="vpm-text-sm">' + esc(vsDef.label || vs) + '</span></div>';
      if (am) html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Audio Mode:</strong> <span class="vpm-text-sm">' + esc(amDef.label || am) + '</span></div>';
      if (vp.style || vp.gender || vp.custom_description) {
        var vpParts = [];
        if (vp.gender) vpParts.push(vp.gender);
        if (vp.age_range) vpParts.push(vp.age_range.replace(/-/g, ' '));
        if (vp.style) vpParts.push(vp.style);
        if (vp.accent && vp.accent !== 'neutral') vpParts.push(vp.accent + ' accent');
        if (vp.custom_description) vpParts.push(vp.custom_description);
        html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Voice Profile:</strong> <span class="vpm-text-sm">' + esc(vpParts.join(', ')) + '</span></div>';
      }
      html += '</div>';
    }

    return html;
  }

  // --- TAB: DEFAULTS (Production + Duration + AI Behavior) ---
  function _settingsDefaults() {
    var stg = S.meta.settings || {};
    // Production Defaults
    var html = '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('film') + ' Production Defaults</div><div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Default Clip Duration (seconds)</label><input class="vpm-input" type="number" value="' + (stg.default_clip_duration || 8) + '" data-setting-path="default_clip_duration" data-setting-type="int"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Words Per Minute (WPM)</label><input class="vpm-input" type="number" value="' + (stg.words_per_minute || 150) + '" data-setting-path="words_per_minute" data-setting-type="int"><span class="vpm-text-xs vpm-text-muted">Used for estimating script section durations.</span></div>';
    html += '</div></div>';

    // Video Duration Control
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('clock') + ' Video Duration Control</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Control how AI clip durations are enforced based on video model limits.</p>';
    html += _settingsToggle('strict_ai_duration', stg.strict_ai_duration, 'Strict Duration Mode', 'AI clip durations are restricted to exact valid values for the selected model.');
    html += _settingsToggle('snap_to_model_durations', stg.snap_to_model_durations, 'Auto-Snap Durations', 'Automatically round clip durations to the nearest valid value when editing or generating clips.');
    // Model duration cards
    html += '<div class="vpm-settings-section-label" style="margin-top:16px">' + icon('film') + ' Model Duration Ranges</div>';
    var prefs = S.meta.aiPreferences || {};
    for (var vmId in Constants.VIDEO_MODELS) {
      var vm = Constants.VIDEO_MODELS[vmId];
      var isActive = (prefs.videoModel || '') === vmId;
      html += '<div class="vpm-dur-model-card' + (isActive ? ' vpm-dur-model-active' : '') + '">';
      html += '<div class="vpm-dur-model-header"><span class="vpm-dur-model-name">' + esc(vm.label) + '</span>';
      if (isActive) html += badge('Default', '#0d904f');
      html += '</div><div class="vpm-dur-model-details">';
      html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Max Duration</span><span class="vpm-dur-detail-value">' + (vm.maxDuration || 8) + 's</span></div>';
      if (vm.durations && vm.durations.length) {
        html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Valid Durations</span><span class="vpm-dur-detail-value">';
        for (var di = 0; di < vm.durations.length; di++) html += '<span class="vpm-dur-chip">' + vm.durations[di] + 's</span>';
        html += '</span></div>';
      }
      if (vm.notes) html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Notes</span><span class="vpm-dur-detail-value vpm-text-muted">' + esc(vm.notes) + '</span></div>';
      html += '</div></div>';
    }
    html += '</div>';

    // AI Behavior
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('sparkles') + ' AI Behavior</div>';
    html += _settingsToggle('show_ai_preflight', stg.show_ai_preflight, 'Show AI Preflight Modal', 'Opens a modal before every AI action where you can pick the model and add custom instructions.');
    html += '<div class="vpm-form-group" style="margin-top:12px"><label class="vpm-form-label">' + icon('globe') + ' Global AI Instructions</label>';
    html += '<textarea class="vpm-textarea" data-action="save-setting-text" data-setting-path="ai_global_instructions" rows="3" placeholder="e.g. Always use simple English, focus on beginners\u2026">' + esc(stg.ai_global_instructions || '') + '</textarea>';
    html += '<span class="vpm-text-xs vpm-text-muted" style="margin-top:3px;display:block">These instructions are included in every AI prompt across all actions.</span></div></div>';
    return html;
  }

  function _settingsToggle(path, isOn, label, desc) {
    return '<div class="vpm-settings-toggle" data-action="toggle-setting-bool" data-setting-path="' + path + '"><div class="vpm-toggle-track' + (isOn ? ' vpm-toggle-on' : '') + '"><div class="vpm-toggle-thumb"></div></div><div class="vpm-toggle-text"><span class="vpm-toggle-label">' + esc(label) + '</span><span class="vpm-toggle-desc">' + esc(desc) + '</span></div></div>';
  }

  // --- TAB: BRAND CONTEXT ---
  function _settingsBrand() {
    var bo = S.meta.brandOverrides || {};
    var brandLoaded = S.brand && S.brand.configured;
    var html = '';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <span>Brand context is loaded from the <strong>.brand-data</strong> element on the page. If no brand is configured, enable the override below.</span></div>';

    // Brand from page (read-only)
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('palette') + ' Brand Context (from Page)</div>';
    if (brandLoaded) {
      var core = (S.brand || {}).core || {};
      html += '<div class="vpm-settings-grid">';
      html += _infoRow('Brand Name', esc(core.brand_name || '\u2014'));
      html += _infoRow('Tagline', esc(core.tagline || '\u2014'));
      html += _infoRow('Voice / Tone', esc(core.voice || '\u2014'));
      html += _infoRow('Target Audience', esc(typeof core.audience === 'string' ? core.audience : '\u2014'));
      html += '</div>';
      html += '<div class="vpm-brand-status"><span class="vpm-brand-status-dot vpm-brand-status-on"></span> Brand context loaded</div>';
    } else {
      html += '<div class="vpm-brand-status"><span class="vpm-brand-status-dot"></span> No brand data detected on page</div>';
    }
    html += '</div>';

    // Override
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('pen') + ' Brand Override</div>';
    html += _settingsToggle('_brand_override', bo.enabled, 'Override brand context for this video', 'Use custom brand values instead of the page-level brand data.');
    if (bo.enabled) {
      html += '<div class="vpm-info-banner" style="margin-top:12px;background:var(--vpm-warning-light);border-color:var(--vpm-warning)">' + icon('warning') + ' Overrides only affect <strong>this video</strong>. The page-level brand context is not modified.</div>';
      html += '<div class="vpm-form-grid" style="margin-top:12px">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Brand Name</label><input class="vpm-input" data-action="save-brand-override" data-field="name" value="' + esc(bo.name || '') + '"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Tagline</label><input class="vpm-input" data-action="save-brand-override" data-field="tagline" value="' + esc(bo.tagline || '') + '"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Primary Color</label><div class="vpm-flex-row"><input type="color" value="' + esc(bo.primary_color || '#1a73e8') + '" data-action="save-brand-override" data-field="primary_color" style="width:32px;height:32px;border:none;cursor:pointer;border-radius:4px"><input class="vpm-input" style="flex:1" data-action="save-brand-override" data-field="primary_color" value="' + esc(bo.primary_color || '') + '"></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Secondary Color</label><div class="vpm-flex-row"><input type="color" value="' + esc(bo.secondary_color || '#0d904f') + '" data-action="save-brand-override" data-field="secondary_color" style="width:32px;height:32px;border:none;cursor:pointer;border-radius:4px"><input class="vpm-input" style="flex:1" data-action="save-brand-override" data-field="secondary_color" value="' + esc(bo.secondary_color || '') + '"></div></div>';
      html += '</div>';
      html += '<div class="vpm-form-group" style="margin-top:8px"><label class="vpm-form-label">Voice / Tone</label><textarea class="vpm-textarea" data-action="save-brand-override" data-field="voice" rows="2">' + esc(bo.voice || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Audience</label><textarea class="vpm-textarea" data-action="save-brand-override" data-field="target_audience" rows="2">' + esc(bo.target_audience || '') + '</textarea></div>';
    }
    html += '</div>';
    return html;
  }

  // --- TAB: IMPORT / EXPORT ---
  function _settingsImportExport() {
    var html = '';
    // Config Export
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('download') + ' Export Configuration</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Export your settings, AI preferences, and brand overrides as a portable JSON file to reuse across videos.</p>';
    html += '<div class="vpm-ie-checklist">';
    var exportItems = [
      { icon: 'gear', label: 'General settings & defaults' },
      { icon: 'microchip', label: 'AI preferences (provider selections, per-action prefs)' },
      { icon: 'palette', label: 'Brand overrides' },
      { icon: 'user-check', label: 'Entity library (looks, environments, scenes)' }
    ];
    for (var ei = 0; ei < exportItems.length; ei++) {
      html += '<div class="vpm-ie-check-item">' + icon(exportItems[ei].icon) + ' <span>' + esc(exportItems[ei].label) + '</span></div>';
    }
    html += '</div>';
    html += '<div class="vpm-info-banner" style="margin-top:8px">' + icon('lock') + ' API keys are <strong>never</strong> exported. They remain in your Drupal user profile.</div>';
    html += '<div class="vpm-btn-row" style="margin-top:12px"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="export-config">' + icon('download') + ' Export Settings (JSON)</button></div>';
    html += '</div>';

    // Config Import
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('upload') + ' Import Configuration</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Import settings from a previously exported JSON file. Existing settings will be merged.</p>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Paste Configuration JSON</label>';
    html += '<textarea class="vpm-textarea" id="vpmSettingsImportJson" rows="6" style="font-family:var(--vpm-font-mono);font-size:11px" placeholder=\'{"_type":"vpm-config","_version":"1.0.0","settings":{...}}\'></textarea></div>';
    html += '<div class="vpm-btn-row" style="margin-top:8px"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="import-config-inline">' + icon('upload') + ' Import & Merge</button></div>';
    html += '</div>';

    // Entity Export/Import
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('layer-group') + ' Entity Library Export / Import</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Export or import your visual entities separately from settings.</p>';
    html += '<div class="vpm-entity-ie-grid">';
    var entities = [
      { type: 'look', icon: 'user-check', label: 'Looks / Avatars', count: (S.meta.lookLibrary || []).length },
      { type: 'environment', icon: 'panorama', label: 'Environments', count: (S.meta.environmentLibrary || []).length },
      { type: 'scene', icon: 'image', label: 'Scenes', count: (S.meta.sceneLibrary || []).length }
    ];
    for (var eni = 0; eni < entities.length; eni++) {
      var ent = entities[eni];
      html += '<div class="vpm-entity-ie-card"><div class="vpm-entity-ie-head">' + icon(ent.icon) + ' ' + esc(ent.label) + ' <span class="vpm-entity-ie-count">' + ent.count + '</span></div>';
      html += '<div class="vpm-entity-ie-actions"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-all-entities" data-entity-type="' + ent.type + '">' + icon('download') + ' Export</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="import-entity" data-entity-type="' + ent.type + '">' + icon('upload') + ' Import</button></div></div>';
    }
    html += '</div></div>';

    // Danger Zone
    html += '<div class="vpm-panel vpm-panel-danger"><div class="vpm-panel-title" style="color:var(--vpm-error)">' + icon('warning') + ' Danger Zone</div>';
    html += '<div class="vpm-danger-grid">';
    html += _dangerItem('Reset All Prompts', 'Clear all generated image/video prompts from clips. Scene assignments remain.', icon('arrows-rotate') + ' Reset Prompts', 'reset-all-prompts');
    html += _dangerItem('Delete All Clips', 'Remove all clips from this video. Script and blueprint remain intact.', icon('trash') + ' Delete Clips', 'clear-all-clips');
    html += _dangerItem('Reset Studio Entities', 'Delete all looks, environments, and scenes for this video.', icon('trash') + ' Reset Studio', 'reset-studio');
    html += _dangerItem('Factory Reset Meta', 'Reset all meta settings to default values. Video data is not affected.', icon('warning') + ' Factory Reset', 'factory-reset-meta');
    html += '</div></div>';
    return html;
  }

  function _dangerItem(title, desc, btnHtml, action) {
    return '<div class="vpm-danger-item"><div class="vpm-danger-item-text"><strong>' + esc(title) + '</strong><span class="vpm-text-xs vpm-text-muted">' + esc(desc) + '</span></div><button class="vpm-btn vpm-btn-danger vpm-btn-sm" data-action="' + action + '">' + btnHtml + '</button></div>';
  }


  // ============================================================
  // SECTION 14: IMPORT / EXPORT HELPERS
  // ============================================================

  function _exportAllEntities(type) {
    var lib = S.meta[type + 'Library'] || [];
    if (!lib.length) { toast('No ' + type + 's to export', 'info'); return; }
    if (exportFile) exportFile(type + 's.json', JSON.stringify(lib, null, 2), 'application/json');
  }

  function _importEntity(type) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Paste JSON</label>';
    html += '<textarea class="vpm-textarea" data-field="json" rows="8" placeholder="Paste entity JSON\u2026"></textarea></div>';
    openModal('Import ' + type, html, { saveLabel: 'Import', onSave: function() {
      var data = collectModalFields(); var parsed = parseJSON(data.json);
      if (!parsed) { toast('Invalid JSON', 'error'); return; }
      var lib = type + 'Library'; S.meta[lib] = S.meta[lib] || [];
      if (Array.isArray(parsed)) { for (var i = 0; i < parsed.length; i++) { parsed[i].id = generateId(type.substring(0, 3)); parsed[i].source = 'video'; S.meta[lib].push(parsed[i]); } }
      else { parsed.id = generateId(type.substring(0, 3)); parsed.source = 'video'; S.meta[lib].push(parsed); }
      logActivity(type + '_created', 'Imported ' + type + '(s)');
      if (snapshot) snapshot('Import ' + type); buildMaps(); syncToTextarea(); closeModal(); render();
      toast(type + ' imported!', 'success');
    }});
  }

  function _exportConfig() {
    var config = { _type: 'vpm-config', _version: '1.0.0', _exported_at: new Date().toISOString(), settings: deepClone(S.meta.settings || {}), aiPreferences: deepClone(S.meta.aiPreferences || {}), brandOverrides: deepClone(S.meta.brandOverrides || {}) };
    if (exportFile) exportFile('config.json', JSON.stringify(config, null, 2), 'application/json');
  }

  function _importConfig() {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Paste Config JSON</label>';
    html += '<textarea class="vpm-textarea" data-field="json" rows="10" placeholder="Paste vpm-config JSON\u2026"></textarea></div>';
    openModal('Import Configuration', html, { saveLabel: icon('upload') + ' Import', onSave: function() {
      var data = collectModalFields(); var parsed = parseJSON(data.json);
      if (!parsed || parsed._type !== 'vpm-config') { toast('Invalid config file', 'error'); return; }
      if (snapshot) snapshot('Before config import');
      if (parsed.settings) S.meta.settings = $.extend(true, {}, S.meta.settings || {}, parsed.settings);
      if (parsed.aiPreferences) { var imp = deepClone(parsed.aiPreferences); delete imp.lastCustomInstructions; S.meta.aiPreferences = $.extend(true, {}, S.meta.aiPreferences || {}, imp); }
      if (parsed.brandOverrides) S.meta.brandOverrides = $.extend(true, {}, S.meta.brandOverrides || {}, parsed.brandOverrides);
      logActivity('settings_changed', 'Imported configuration');
      if (snapshot) snapshot('After config import'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Config imported!', 'success');
    }});
  }


  // ============================================================
  // SECTION 15: EVENT HANDLERS
  // ============================================================

  function setupPart2BEvents() {
    // Settings tabs
    $(document).off('click.vpm2b-stab').on('click.vpm2b-stab', '[data-action="settings-tab"]', function(e) { e.preventDefault(); S.currentSettingsTab = $(this).data('tab'); render(); });

    // Settings save
    $(document).off('change.vpm2b-ssi blur.vpm2b-ssi').on('change.vpm2b-ssi blur.vpm2b-ssi', 'input[data-setting-path]', function() {
      var path = $(this).data('setting-path'); var type = $(this).data('setting-type');
      S.meta.settings = S.meta.settings || {};
      S.meta.settings[path] = type === 'int' ? (parseInt($(this).val(), 10) || 0) : $(this).val();
      syncToTextarea();
    });
    $(document).off('change.vpm2b-ssc').on('change.vpm2b-ssc', 'select[data-setting-path]', function() {
      S.meta.settings = S.meta.settings || {}; S.meta.settings[$(this).data('setting-path')] = $(this).val(); syncToTextarea();
    });
    // Toggle switches (div-based, not checkbox)
    $(document).off('click.vpm2b-stb').on('click.vpm2b-stb', '[data-action="toggle-setting-bool"]', function() {
      var path = $(this).data('setting-path');
      if (path === '_brand_override') {
        // Special: brand override toggle
        S.meta.brandOverrides = S.meta.brandOverrides || {};
        S.meta.brandOverrides.enabled = !S.meta.brandOverrides.enabled;
        BrandService.init(); syncToTextarea(); render();
        return;
      }
      S.meta.settings = S.meta.settings || {};
      S.meta.settings[path] = !S.meta.settings[path];
      logActivity('settings_changed', path + ' = ' + (S.meta.settings[path] ? 'ON' : 'OFF'));
      syncToTextarea(); render();
    });
    $(document).off('blur.vpm2b-sst').on('blur.vpm2b-sst', '[data-action="save-setting-text"]', function() {
      S.meta.settings = S.meta.settings || {}; S.meta.settings[$(this).data('setting-path')] = $(this).val(); syncToTextarea();
    });
    $(document).off('click.vpm2b-sad').on('click.vpm2b-sad', '[data-action="set-app-ai-default"]', function() {
      var sel = LLMService.resolveSelection('app-default');
      var $p = $('.vpm-ai-provider-select[data-action-id="app-default"]'), $m = $('.vpm-ai-model-select[data-action-id="app-default"]');
      if ($p.length) sel = { provider: $p.val(), model: $m.val() };
      S.meta.aiPreferences = S.meta.aiPreferences || {};
      S.meta.aiPreferences.appDefault = { provider: sel.provider, model: sel.model };
      syncToTextarea(); toast('Default AI set: ' + sel.provider + '/' + sel.model, 'success');
    });
    $(document).off('change.vpm2b-sap').on('change.vpm2b-sap', '[data-action="save-ai-pref"]', function() {
      S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences[$(this).data('field')] = $(this).val(); syncToTextarea();
    });
    $(document).off('blur.vpm2b-sapt').on('blur.vpm2b-sapt', '[data-action="save-ai-pref-text"]', function() {
      S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences[$(this).data('field')] = $(this).val(); syncToTextarea();
    });
    // Brand override field saves
    $(document).off('blur.vpm2b-sbo').on('blur.vpm2b-sbo', '[data-action="save-brand-override"]', function() {
      S.meta.brandOverrides = S.meta.brandOverrides || {};
      S.meta.brandOverrides[$(this).data('field')] = $(this).val();
      BrandService.init(); syncToTextarea();
    });

    // Inline config import (from Import/Export tab textarea)
    $(document).off('click.vpm2b-ici').on('click.vpm2b-ici', '[data-action="import-config-inline"]', function(e) {
      e.preventDefault();
      var json = ($('#vpmSettingsImportJson').val() || '').trim();
      if (!json) { toast('Paste config JSON first', 'warning'); return; }
      var parsed = parseJSON(json);
      if (!parsed || parsed._type !== 'vpm-config') { toast('Invalid config file', 'error'); return; }
      if (snapshot) snapshot('Before config import');
      if (parsed.settings) S.meta.settings = $.extend(true, {}, S.meta.settings || {}, parsed.settings);
      if (parsed.aiPreferences) { var imp = deepClone(parsed.aiPreferences); delete imp.lastCustomInstructions; S.meta.aiPreferences = $.extend(true, {}, S.meta.aiPreferences || {}, imp); }
      if (parsed.brandOverrides) S.meta.brandOverrides = $.extend(true, {}, S.meta.brandOverrides || {}, parsed.brandOverrides);
      logActivity('settings_changed', 'Imported configuration');
      if (snapshot) snapshot('After config import'); buildMaps(); syncToTextarea(); render();
      toast('Config imported & merged!', 'success');
    });

    // Reset Studio Entities
    $(document).off('click.vpm2b-rse').on('click.vpm2b-rse', '[data-action="reset-studio"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Reset Studio Entities?', message: 'Delete all looks, environments, and scenes for this video. Brand entities are unaffected.', danger: true, onConfirm: function() {
        S.meta.lookLibrary = []; S.meta.environmentLibrary = []; S.meta.sceneLibrary = [];
        S.meta.studioRequirements = {};
        logActivity('settings_changed', 'Reset all studio entities');
        if (snapshot) snapshot('Reset studio'); buildMaps(); syncToTextarea(); render();
        toast('Studio entities cleared', 'success');
      }});
    });

    // Factory Reset Meta
    $(document).off('click.vpm2b-frm').on('click.vpm2b-frm', '[data-action="factory-reset-meta"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Factory Reset Settings?', message: 'Reset all meta settings and AI preferences to default values. Video data (script, clips) is <strong>not</strong> affected.', danger: true, onConfirm: function() {
        var getDefaultMeta = window._vpmGetDefaultMeta;
        var fresh = getDefaultMeta();
        S.meta.settings = fresh.settings;
        S.meta.aiPreferences = fresh.aiPreferences;
        S.meta.brandOverrides = fresh.brandOverrides;
        // Keep entity libraries intact
        logActivity('settings_changed', 'Factory reset — settings restored to defaults');
        if (snapshot) snapshot('Factory reset meta'); BrandService.init(); buildMaps(); syncToTextarea(); render();
        toast('Settings reset to defaults', 'success');
      }});
    });
    // AI provider picker cascade
    $(document).off('change.vpm2b-apch').on('change.vpm2b-apch', '.vpm-ai-provider-select', function() {
      var aid = $(this).data('action-id'); var pid = $(this).val();
      var models = LLMService.getActiveModels(pid); var $m = $('.vpm-ai-model-select[data-action-id="' + aid + '"]');
      var html = ''; for (var i = 0; i < models.length; i++) { var _m = models[i]; html += '<option value="' + esc(_m.id) + '" data-temp="' + (_m.temperature !== undefined ? _m.temperature : 1.0) + '" data-tokens="' + (_m.max_tokens || 8192) + '">' + esc(_m.label || _m.id) + '</option>'; }
      $m.html(html);
    });

    // --- AI Actions (wiring buttons to execution functions) ---
    $(document).off('click.vpm2b-aia').on('click.vpm2b-aia', '[data-action="ai-generate-research"]', function(e) { e.preventDefault(); _launchAI('generate-research', 'Research brief from video idea', generateResearch); });
    $(document).off('click.vpm2b-ags').on('click.vpm2b-ags', '[data-action="ai-generate-script"]', function(e) { e.preventDefault(); _launchAI('generate-script', 'Full script from blueprint sections', generateScript); });
    $(document).off('click.vpm2b-aes').on('click.vpm2b-aes', '[data-action="ai-enhance-section"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('enhance-script', 'Enhance section', function(ci) { enhanceSection(sid, 'enhance-script', ci); }); });
    $(document).off('click.vpm2b-agss').on('click.vpm2b-agss', '[data-action="ai-generate-section-script"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('generate-script', 'Generate script for section', function(ci) { generateScriptSection(sid, 'generate-script', ci); }); });
    $(document).off('click.vpm2b-agc').on('click.vpm2b-agc', '[data-action="ai-generate-clips"]', function(e) { e.preventDefault(); _launchAI('generate-clips', 'Break entire script into clips', generateClips); });
    $(document).off('click.vpm2b-gsc').on('click.vpm2b-gsc', '[data-action="generate-section-clips"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('generate-clips', 'Generate clips for section', function(ci) { generateClipsForSection(sid, 'generate-clips', ci); }); });
    $(document).off('click.vpm2b-aas').on('click.vpm2b-aas', '[data-action="ai-analyze-studio"]', function(e) { e.preventDefault(); _launchAI('analyze-studio', 'Analyze clips for studio needs', analyzeStudio); });
    $(document).off('click.vpm2b-agfp').on('click.vpm2b-agfp', '[data-action="generate-frame-prompt"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'), fk = $(this).data('frame'); _launchAI('generate-prompt', 'Image prompt for frame', function(ci) { generateFramePrompt(cid, fk, 'generate-prompt', ci); }); });
    $(document).off('click.vpm2b-agvp').on('click.vpm2b-agvp', '[data-action="generate-video-prompt"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('generate-video', 'Video motion prompt', function(ci) { generateVideoPrompt(cid, 'generate-video', ci); }); });
    $(document).off('click.vpm2b-aib').on('click.vpm2b-aib', '[data-action="ai-improve-brief"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('improve-brief', 'Improve recording brief', function(ci) { improveBrief(cid, 'improve-brief', ci); }); });
    $(document).off('click.vpm2b-agm').on('click.vpm2b-agm', '[data-action="ai-generate-metadata"]', function(e) { e.preventDefault(); _launchAI('generate-metadata', 'YouTube SEO metadata', generateMetadata); });
    $(document).off('click.vpm2b-agti').on('click.vpm2b-agti', '[data-action="ai-generate-thumbnail-ideas"]', function(e) { e.preventDefault(); _launchAI('generate-thumbnails', 'Thumbnail concepts', generateThumbnailIdeas); });

    // --- New AI actions ---
    $(document).off('click.vpm2b-agbp').on('click.vpm2b-agbp', '[data-action="ai-generate-blueprint"]', function(e) { e.preventDefault(); _launchAI('analyze-idea', 'Generate blueprint sections from idea', generateBlueprint); });
    $(document).off('click.vpm2b-agch').on('click.vpm2b-agch', '[data-action="ai-generate-chapters"]', function(e) { e.preventDefault(); _launchAI('generate-metadata', 'Auto-generate YouTube chapters from clips', generateChapters); });
    $(document).off('click.vpm2b-agsc').on('click.vpm2b-agsc', '[data-action="ai-generate-scenes"]', function(e) { e.preventDefault(); _launchAI('analyze-studio', 'Auto-generate scenes from looks + environments', generateScenes); });
    $(document).off('click.vpm2b-arrs').on('click.vpm2b-arrs', '[data-action="ai-regenerate-research-section"]', function(e) { e.preventDefault(); var sec = $(this).data('section'); _launchAI('generate-research', 'Regenerate research section', function(ci) { regenerateResearchSection(sec, 'generate-research', ci); }); });
    $(document).off('click.vpm2b-arti').on('click.vpm2b-arti', '[data-action="regenerate-thumbnail-idea"]', function(e) { e.preventDefault(); var tid = $(this).data('id'); _launchAI('generate-thumbnails', 'Regenerate thumbnail concept', function(ci) { regenerateThumbnailIdea(tid, 'generate-thumbnails', ci); }); });
    $(document).off('click.vpm2b-asb').on('click.vpm2b-asb', '[data-action="ai-suggest-brand"]', function(e) { e.preventDefault(); _launchAI('suggest-brand', 'Suggest brand library items', suggestBrandItems); });
    $(document).off('click.vpm2b-aisc').on('click.vpm2b-aisc', '[data-action="ai-split-clip"]', function(e) { e.preventDefault(); var cid = $(this).data('clip-id'); _launchAI('ai-split', 'Split overflowing clip', function(ci) { aiSplitClip(cid, 'ai-split', ci); }); });
    $(document).off('click.vpm2b-ascs').on('click.vpm2b-ascs', '[data-action="ai-suggest-clip-scene"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('suggest-clip-scene', 'Suggest scene for clip', function(ci) { suggestClipScene(cid, 'suggest-clip-scene', ci); }); });
    $(document).off('click.vpm2b-aaa').on('click.vpm2b-aaa', '[data-action="ai-auto-assign"]', function(e) { e.preventDefault(); _launchAI('auto-assign', 'AI auto-assign assets to clips', autoAssignAssets); });

    // Cancel AI
    $(document).off('click.vpm2b-cai').on('click.vpm2b-cai', '[data-action="cancel-ai"]', function(e) { e.preventDefault(); _cancelAI(); });

    // Danger zone
    $(document).off('click.vpm2b-rap').on('click.vpm2b-rap', '[data-action="reset-all-prompts"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Reset All Prompts?', message: 'All generated prompts cleared.', danger: true, onConfirm: function() {
        var clips = S.data.clips || [];
        for (var i = 0; i < clips.length; i++) { var ps = clips[i].prompt_set || {}; if (ps.first_frame && ps.first_frame.prompt) { ps.first_frame.prompt.positive = ''; ps.first_frame.prompt.status = 'empty'; } if (ps.last_frame && ps.last_frame.prompt) { ps.last_frame.prompt.positive = ''; ps.last_frame.prompt.status = 'empty'; } if (ps.video && ps.video.prompt) { ps.video.prompt.positive = ''; ps.video.prompt.status = 'empty'; } }
        logActivity('settings_changed', 'Reset all prompts');
        if (snapshot) snapshot('Reset prompts'); buildMaps(); syncToTextarea(); render(); toast('All prompts reset', 'success');
      }});
    });
    $(document).off('click.vpm2b-cac').on('click.vpm2b-cac', '[data-action="clear-all-clips"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Delete All Clips?', message: 'Cannot be undone.', danger: true, onConfirm: function() {
        S.data.clips = []; S.selectedClipId = null;
        logActivity('settings_changed', 'Cleared all clips');
        if (snapshot) snapshot('Clear clips'); buildMaps(); syncToTextarea(); render(); toast('All clips cleared', 'success');
      }});
    });

    // Entity export/import
    $(document).off('click.vpm2b-expa').on('click.vpm2b-expa', '[data-action="export-all-entities"]', function(e) { e.preventDefault(); _exportAllEntities($(this).data('entity-type')); });
    $(document).off('click.vpm2b-imp').on('click.vpm2b-imp', '[data-action="import-entity"]', function(e) { e.preventDefault(); _importEntity($(this).data('entity-type')); });
    $(document).off('click.vpm2b-exc').on('click.vpm2b-exc', '[data-action="export-config"]', function(e) { e.preventDefault(); _exportConfig(); });
    $(document).off('click.vpm2b-imc').on('click.vpm2b-imc', '[data-action="import-config"]', function(e) { e.preventDefault(); _importConfig(); });

    // Shortcuts help
    $(document).off('click.vpm2b-skh').on('click.vpm2b-skh', '[data-action="show-shortcuts-help"]', function(e) { e.preventDefault(); _showShortcutsHelp(); });
  }


  // ============================================================
  // SECTION 16: KEYBOARD SHORTCUTS
  // ============================================================

  function setupKeyboardShortcuts() {
    $(document).off('keydown.vpm2b-sk').on('keydown.vpm2b-sk', function(e) {
      if ($(e.target).is('input, textarea, select, [contenteditable="true"]')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); if (window._vpmUndo) window._vpmUndo(); }
        else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); if (window._vpmRedo) window._vpmRedo(); }
        else if (e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); _showShortcutsHelp(); return; }
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        var stages = S.mode === 'advanced' ? Constants.STAGE_ORDER_ADVANCED : Constants.STAGE_ORDER_STANDARD;
        if (stages[num - 1]) navigateToStage(stages[num - 1]);
      }
    });
  }

  function _showShortcutsHelp() {
    var shortcuts = [
      { keys: 'Ctrl + S', desc: 'Save to Drupal' },
      { keys: 'Ctrl + Z', desc: 'Undo' },
      { keys: 'Ctrl + Shift + Z / Y', desc: 'Redo' },
      { keys: '1 \u2013 7', desc: 'Jump to stage' },
      { keys: '?', desc: 'Show this help' }
    ];
    var html = '<div style="display:flex;flex-direction:column;gap:8px">';
    for (var i = 0; i < shortcuts.length; i++) {
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--vpm-border-light)">';
      html += '<span class="vpm-text-sm">' + esc(shortcuts[i].desc) + '</span>';
      html += '<kbd class="vpm-kbd">' + esc(shortcuts[i].keys) + '</kbd></div>';
    }
    html += '</div>';
    openModal('Keyboard Shortcuts', html, { footer: false, size: 'sm' });
  }


  // ============================================================
  // SECTION 17: API EXPORTS
  // ============================================================

  window._vpmPart2B = {
    LLMService: LLMService, BrandService: BrandService,
    isAIConfigured: LLMService.isConfigured.bind(LLMService),
    renderInlinePicker: LLMService.renderInlinePicker.bind(LLMService),
    analyzeIdea: analyzeIdea, generateResearch: generateResearch,
    generateScript: generateScript, enhanceSection: enhanceSection,
    generateClips: generateClips, generateFramePrompt: generateFramePrompt,
    generateVideoPrompt: generateVideoPrompt, analyzeStudio: analyzeStudio,
    generateMetadata: generateMetadata, improveBrief: improveBrief,
    generateThumbnailIdeas: generateThumbnailIdeas,
    generateBlueprint: generateBlueprint, generateChapters: generateChapters,
    generateScenes: generateScenes, regenerateResearchSection: regenerateResearchSection,
    regenerateThumbnailIdea: regenerateThumbnailIdea, thumbnailChatAI: thumbnailChatAI,
    buildVideoContext: buildVideoContext, buildScriptContext: buildScriptContext,
    buildClipContext: buildClipContext, buildSceneContext: buildSceneContext
  };

  console.log('[VPM] Part 2B v1.0 loaded \u2014 18 sections');
})(jQuery, Drupal);
