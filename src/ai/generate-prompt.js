/**
 * generateVideoPrompt — core video prompt generator
 *
 * Branches on the active model (Seedance plain-text vs structured JSON for VEO 3.1
 * and others). Builds the prompt body, calls the model-specific
 * formatVideoPromptGuidance(), then dispatches to LLMService.callAI().
 *
 * Registers on: window._vpm.generateVideoPrompt
 * Invoked by part2b's click handler for [data-action="generate-video-prompt"]
 * (which now calls window._vpm.generateVideoPrompt(...) directly).
 *
 * Dependencies (captured at parse time from window):
 *   - window._vpmState                       (S)
 *   - window._vpmConstants                   (Constants — VIDEO_MODELS, MOTION_STRENGTHS, …)
 *   - window._vpm.promptTemplates            (PROMPT_TEMPLATES registry)
 *   - window._vpm.llmService                 (LLMService)
 *   - window._vpm.contexts                   (buildVideoContext, buildClipContext, buildSceneContext)
 *   - window._vpm.aiActions                  (_buildCustomBlock, _showAIProgress)
 *   - window._vpmToast, _vpmLogActivity,
 *     _vpmParseJSON, _vpmBuildMaps,
 *     _vpmSyncToTextarea, _vpmRender,
 *     _vpmSnapshot                            (utility callbacks from part1/part2a)
 *
 * MUST load AFTER llm-service.js, contexts.js, and prompt-templates/*.js;
 * loads BEFORE vpm-part2b.js so part2b can capture generateVideoPrompt as a local.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var PROMPT_TEMPLATES = (window._vpm && window._vpm.promptTemplates) || {};
  var LLMService = window._vpm && window._vpm.llmService;
  var _ctxMod = window._vpm && window._vpm.contexts || {};
  var buildVideoContext = _ctxMod.buildVideoContext;
  var buildClipContext = _ctxMod.buildClipContext;
  var buildSceneContext = _ctxMod.buildSceneContext;
  var _aaMod = window._vpm && window._vpm.aiActions || {};
  var _buildCustomBlock = _aaMod._buildCustomBlock;
  var _showAIProgress = _aaMod._showAIProgress;

  // Inlined locally so this file does not depend on part2b loading first.
  function _ensureString(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.content) return _ensureString(val.content);
      if (val.text) return _ensureString(val.text);
      try { return JSON.stringify(val, null, 2); } catch (e) { return String(val); }
    }
    return String(val);
  }

  // VIDEO_GEN_MODES — labels for the 3 generation modes (kept here so this file
  // is self-contained; the same constant is also on Constants.VIDEO_GEN_MODES).
  var VIDEO_GEN_MODES = (Constants && Constants.VIDEO_GEN_MODES) || {};

  function generateVideoPrompt(clipId, actionId, ci) {
    var toast = window._vpmToast;
    var parseJSON = window._vpmParseJSON;
    var logActivity = window._vpmLogActivity;
    var buildMaps = window._vpmBuildMaps;
    var syncToTextarea = window._vpmSyncToTextarea;
    var render = window._vpmRender;
    var snapshot = window._vpmSnapshot;

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
      ? 'You are an expert Seedance 2.0 video generation prompt engineer. Generate the complete 7-section Seedance prompt as plain text. Output plain text only — no JSON, no markdown, no code blocks, no commentary outside the prompt.'
      : 'You are an expert video generation prompt engineer specializing in ' + ((Constants.VIDEO_MODELS[videoModel] || {}).label || videoModel) + '. Generate a complete, detailed, structured video generation prompt. Output JSON only — no commentary.';

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
      var _gvpSaHasData = _gvpSa.character_look_id || ((_gvpSa.env_ids || []).some(function (id) { return !!id; }));
      if (_gvpSaHasData) {
        prompt += 'Ingredient images (from Studio assets):\n';
        if (_gvpSa.character_look_id && S.lookMap) {
          var _gvpLk = S.lookMap[_gvpSa.character_look_id];
          if (_gvpLk) prompt += '- CHARACTER: ' + _gvpLk.name + (_gvpLk.combined_prompt_fragment ? ' — ' + _gvpLk.combined_prompt_fragment : '') + '\n';
        }
        var _gvpEnvIds = _gvpSa.env_ids || [];
        for (var _gvpEi = 0; _gvpEi < _gvpEnvIds.length; _gvpEi++) {
          if (!_gvpEnvIds[_gvpEi]) continue;
          var _gvpEnv = S.envMap ? S.envMap[_gvpEnvIds[_gvpEi]] : null;
          if (_gvpEnv) prompt += '- ENVIRONMENT ' + (_gvpEi + 1) + ': ' + _gvpEnv.name + ' (' + (_gvpEnv.type || 'indoor') + ')' + (_gvpEnv.prompt_fragment ? ' — ' + _gvpEnv.prompt_fragment : '') + '\n';
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
      prompt += 'Do NOT use a disembodied voiceover — the on-screen character IS speaking these words.\n';
    }

    var pc = clip.production_config || {};
    prompt += '\nMotion intensity: ' + ((Constants.MOTION_STRENGTHS[pc.motion_strength] || {}).label || 'medium');
    prompt += '\nCamera movement: ' + ((Constants.CAMERA_MOVEMENTS[pc.camera_movement] || {}).label || 'slow-zoom');
    prompt += '\nTransition: ' + ((Constants.TRANSITION_STYLES[pc.transition_style] || {}).label || 'smooth-dissolve');

    // Video style
    var vs = prefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    if (vs && vsDef.promptHint) prompt += '\nVideo style: ' + vsDef.label + ' — ' + vsDef.promptHint;

    // Model-specific guidance
    if (modelTemplate.formatVideoPromptGuidance) {
      prompt += '\n\n' + modelTemplate.formatVideoPromptGuidance(clip, {});
    }

    prompt += _buildCustomBlock(actionId, ci);

    // Model-specific output format
    if (isSeedance) {
      prompt += '\n\nGenerate the complete Seedance 2.0 prompt now. Use the 7-section structure. Plain text only — begin with the HEADER line:';
    } else {
      var outFmt = modelTemplate.getOutputFormat ? modelTemplate.getOutputFormat(audioMode) : JSON.stringify({
        visual_prompt: 'Detailed visual description',
        motion_description: 'Motion description',
        camera: 'Camera work',
        style: 'Style keywords',
        negative_prompt: 'What to avoid'
      }, null, 2);
      prompt += '\n\nGenerate COMPLETE and DETAILED JSON:\n' + outFmt;
    }

    _showAIProgress('generate-video', false);
    LLMService.callAI(prompt, function (text) {
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
      } catch (e) { toast('Parse error: ' + e.message, 'error'); }
    }, function (err) { toast('AI error: ' + err, 'error'); }, 'generate-video', sp);
  }

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.generateVideoPrompt = generateVideoPrompt;
})();
