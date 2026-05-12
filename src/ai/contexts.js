/**
 * VPM AI Context Builders
 *
 * Pure-ish functions that format S.data.* into prompt-friendly text blocks
 * (video context, script context, clip context, scene context). These are
 * concatenated into prompts in src/ai/vpm-part2b.js (the various generate*
 * action functions).
 *
 * Registers on:
 *   - window._vpm.buildVoiceDescription   (also used by VEO 3.1 prompt template)
 *   - window._vpm.contexts                ({ buildVideoContext, buildScriptContext,
 *                                            buildClipContext, buildSceneContext })
 *
 * Reads from window (set by earlier modules):
 *   - window._vpmState          (S)
 *   - window._vpmConstants      (Constants)
 *   - window._vpmStripHtml      (stripHtml helper from part1)
 *   - window._vpmFormatDurationLong  (formatDurationLong from part1)
 *   - window._vpmResolveVoiceProfile (resolveVoiceProfile from part1)
 *
 * MUST load AFTER vpm-part1.js (deps) and BEFORE vpm-part2b.js (consumer).
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var stripHtml = window._vpmStripHtml;
  var formatDurationLong = window._vpmFormatDurationLong;

  // --- Voice description builder ---
  function _buildVoiceDescription(vp) {
    if (!vp) return '';
    var parts = [];
    if (vp.gender) parts.push(vp.gender);
    if (vp.age_range) parts.push(vp.age_range.replace(/-/g, ' '));
    if (vp.style) parts.push(vp.style + ' tone');
    if (vp.accent && vp.accent !== 'neutral') parts.push(vp.accent + ' accent');
    if (vp.custom_description) parts.push(vp.custom_description);
    return parts.join(', ') || 'natural, clear voice';
  }

  function buildVideoContext() {
    var v = S.data.video || {}; var st = S.data.start || {};
    var prefs = st.preferences || {};
    var lines = ['--- VIDEO CONTEXT ---'];
    if (v.title) lines.push('Title: ' + v.title);
    if (st.raw_input) lines.push('Idea: ' + st.raw_input);
    if (prefs.language) lines.push('Language: ' + ((Constants.LANGUAGES[prefs.language] || {}).label || prefs.language));
    if (prefs.platform) lines.push('Platform: ' + ((Constants.PLATFORMS[prefs.platform] || {}).label || prefs.platform));
    if (prefs.aspect_ratio) lines.push('Aspect ratio: ' + prefs.aspect_ratio);
    if (prefs.target_duration) lines.push('Target duration: ' + formatDurationLong(prefs.target_duration));
    if (prefs.production_mode) lines.push('Production mode: ' + ((Constants.PRODUCTION_MODES[prefs.production_mode] || {}).label || prefs.production_mode));
    if (prefs.presenter_preference) lines.push('Presenter: ' + ((Constants.PRESENTER_PREFS[prefs.presenter_preference] || {}).label || prefs.presenter_preference));
    // Video style
    if (prefs.video_style) {
      var styleDef = (Constants.VIDEO_STYLES || {})[prefs.video_style] || {};
      lines.push('Video style: ' + (styleDef.label || prefs.video_style));
      if (styleDef.promptHint) lines.push('Style keywords: ' + styleDef.promptHint);
    }
    // Audio mode
    if (prefs.audio_mode) {
      var audioLabel = ((Constants.AUDIO_MODES || {})[prefs.audio_mode] || {}).label || prefs.audio_mode;
      lines.push('Audio mode: ' + audioLabel);
    }
    // Seedance audio direction (campaign-level, Seedance 2.0)
    if (prefs.seedance_audio_direction) {
      var sadDef = ((Constants.SEEDANCE_AUDIO_DIRECTIONS || {})[prefs.seedance_audio_direction] || {});
      lines.push('Seedance audio direction: ' + (sadDef.label || prefs.seedance_audio_direction));
    }
    var bp = S.data.blueprint || {};
    if (bp.tone) lines.push('Tone: ' + bp.tone);
    if (bp.target_audience) lines.push('Audience: ' + bp.target_audience);
    return lines.join('\n');
  }

  function buildScriptContext() {
    var sc = S.data.script || {};
    var lines = ['--- SCRIPT ---'];
    var secs = sc.sections || [];
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].content) lines.push(secs[i].label.toUpperCase() + ': ' + stripHtml(secs[i].content));
    }
    return lines.join('\n');
  }

  function buildClipContext(clip) {
    var lines = ['--- CLIP ---'];
    lines.push('Title: ' + (clip.title || '')); lines.push('Type: ' + ((Constants.CLIP_TYPES[clip.type] || {}).label || clip.type));
    lines.push('Track: ' + (clip.track || 'ai')); lines.push('Duration: ' + (clip.duration || 8) + 's');
    if (clip.script_text) lines.push('Script: ' + clip.script_text);
    if (clip.visual_direction) lines.push('Visual: ' + clip.visual_direction);
    // AI Character: the character IS the narrator/speaker
    if (clip.type === 'ai-character') {
      lines.push('');
      lines.push('NARRATOR ROLE: The AI character IS the presenter/narrator. They speak the script text directly on camera.');
      lines.push('The character must be shown speaking — lip movements match the speech. This is NOT a voiceover.');
      var _acLookIds = (((clip.prompt_set || {}).first_frame || {}).scene || {}).look_ids || [];
      if (_acLookIds.length && S.lookMap) {
        var _acLook = S.lookMap[_acLookIds[0]];
        if (_acLook) {
          lines.push('Character: ' + (_acLook.name || 'Unnamed'));
          if (_acLook.combined_prompt_fragment) lines.push('Appearance: ' + _acLook.combined_prompt_fragment);
          var _acVp = (window._vpmResolveVoiceProfile ? window._vpmResolveVoiceProfile(clip) : null) || {};
          if (_acVp.style || _acVp.custom_description) lines.push('Voice: ' + _buildVoiceDescription(_acVp));
        }
      }
    }
    return lines.join('\n');
  }

  function buildSceneContext(clip) {
    var ps = clip.prompt_set || {}; var ff = ps.first_frame || {}; var scene = ff.scene || {};
    var lines = ['--- SCENE ---'];

    // Seedance assets path: ingredients-to-video clips store character+environments in ps.video.seedance_assets
    var _sa = (ps.video || {}).seedance_assets || {};
    var _saHasData = _sa.character_look_id || ((_sa.env_ids || []).some(function (id) { return !!id; }));
    if (_saHasData) {
      if (_sa.character_look_id && S.lookMap) {
        var _saLook = S.lookMap[_sa.character_look_id];
        if (_saLook) lines.push('Character Look: ' + _saLook.name + (_saLook.combined_prompt_fragment ? ' — ' + _saLook.combined_prompt_fragment : ''));
      }
      var _saEnvIds = _sa.env_ids || [];
      for (var _sei = 0; _sei < _saEnvIds.length; _sei++) {
        if (!_saEnvIds[_sei]) continue;
        var _seEnv = S.envMap ? S.envMap[_saEnvIds[_sei]] : null;
        if (_seEnv) lines.push('Environment ' + (_sei + 1) + ': ' + _seEnv.name + (_seEnv.prompt_fragment ? ' — ' + _seEnv.prompt_fragment : ''));
      }
      return lines.join('\n');
    }

    // Frames-to-video path: look up via first_frame.scene (scene template or direct look/env)
    var _sceneResolved = false;
    if (scene.scene_template_id) {
      var sc = S.sceneMap ? S.sceneMap[scene.scene_template_id] : null;
      if (sc) {
        _sceneResolved = true;
        lines.push('Scene: ' + sc.name);
        var lids = sc.look_ids || (sc.looks ? sc.looks.map(function (l) { return l.look_id; }) : []);
        for (var i = 0; i < lids.length; i++) { var lk = S.lookMap[lids[i]]; if (lk) lines.push('Look: ' + lk.name + (lk.combined_prompt_fragment ? ' — ' + lk.combined_prompt_fragment : '')); }
        var env = sc.environment_id ? S.envMap[sc.environment_id] : null;
        if (env) lines.push('Environment: ' + env.name + (env.prompt_fragment ? ' — ' + env.prompt_fragment : ''));
      }
    }
    // Fallback: direct look_ids / environment_id (no scene template or template not found)
    if (!_sceneResolved) {
      var _directLookIds = scene.look_ids || [];
      for (var _dli = 0; _dli < _directLookIds.length; _dli++) {
        var _dlk = S.lookMap ? S.lookMap[_directLookIds[_dli]] : null;
        if (_dlk) lines.push('Look: ' + _dlk.name + (_dlk.combined_prompt_fragment ? ' — ' + _dlk.combined_prompt_fragment : ''));
      }
      var _directEnv = scene.environment_id ? (S.envMap ? S.envMap[scene.environment_id] : null) : null;
      if (_directEnv) lines.push('Environment: ' + _directEnv.name + (_directEnv.prompt_fragment ? ' — ' + _directEnv.prompt_fragment : ''));
    }
    return lines.join('\n');
  }

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.buildVoiceDescription = _buildVoiceDescription;
  window._vpm.contexts = {
    buildVideoContext: buildVideoContext,
    buildScriptContext: buildScriptContext,
    buildClipContext: buildClipContext,
    buildSceneContext: buildSceneContext
  };
})();
