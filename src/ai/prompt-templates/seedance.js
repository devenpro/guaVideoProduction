/**
 * Seedance 2.0 prompt template
 *
 * Generates 7-section plain-text prompt (NOT JSON). Seedance 2.0 is the primary
 * video model — see docs/features/AI-INTEGRATION.md for the redesign rationale.
 *
 * Registers on: window._vpm.promptTemplates.seedance
 * Looked up at runtime by src/ai/vpm-part2b.js via PROMPT_TEMPLATES[modelKey].
 *
 * Dependencies (read at method-call time from window):
 *   - window._vpmState  (state container — S.data.start.preferences, S.lookMap, S.envMap)
 *   - window._vpmConstants  (constants — Constants.SEEDANCE_AUDIO_DIRECTIONS)
 */
(function () {
  'use strict';

  var seedance = {
    supportsAudio: true,
    outputFormat: 'plaintext',
    defaultGenMode: 'ingredients-to-video',
    formatVideoPromptGuidance: function (clip, context) {
      var S = window._vpmState;
      var Constants = window._vpmConstants;

      var prefs = ((S.data.start || {}).preferences || {});
      var audioDir = prefs.seedance_audio_direction || 'voice-ambient';
      var audioDirDef = (Constants.SEEDANCE_AUDIO_DIRECTIONS || {})[audioDir] || {};
      var clipNum = clip.order || 1;
      var clipTitle = clip.title || 'Untitled';
      var duration = clip.duration || 10;
      var aspectRatio = prefs.aspect_ratio || '9:16';
      var genMode = ((clip.prompt_set || {}).video || {}).gen_mode || 'ingredients-to-video';

      // Resolve character name and environment names — seedance_assets first, then fall back to first_frame.scene
      var characterName = 'none';
      var envNames = [];
      var ps = clip.prompt_set || {};

      // Priority 1: seedance_assets (set via the Seedance Assets Panel — Studio Looks + Environments)
      var _fpSa = (ps.video || {}).seedance_assets || {};
      var _fpSaHasData = _fpSa.character_look_id || ((_fpSa.env_ids || []).some(function (id) { return !!id; }));
      if (_fpSaHasData) {
        if (_fpSa.character_look_id && S.lookMap) {
          var _fpLk = S.lookMap[_fpSa.character_look_id];
          if (_fpLk) characterName = _fpLk.name + (_fpLk.combined_prompt_fragment ? ' — ' + _fpLk.combined_prompt_fragment.substring(0, 80) : '');
        }
        var _fpEnvIds = _fpSa.env_ids || [];
        for (var _fpi = 0; _fpi < _fpEnvIds.length; _fpi++) {
          if (!_fpEnvIds[_fpi]) continue;
          var _fpEnv = S.envMap ? S.envMap[_fpEnvIds[_fpi]] : null;
          if (_fpEnv) envNames.push(_fpEnv.name + (_fpEnv.prompt_fragment ? ': ' + _fpEnv.prompt_fragment.substring(0, 80) : ''));
        }
      } else {
        // Priority 2: first_frame.scene (used in frames-to-video or legacy projects)
        var scene = ((ps.first_frame || {}).scene || {});
        if (scene.look_ids && scene.look_ids.length && S.lookMap) {
          var lk = S.lookMap[scene.look_ids[0]];
          if (lk) characterName = lk.name + (lk.combined_prompt_fragment ? ' — ' + lk.combined_prompt_fragment.substring(0, 80) : '');
        }
        if (scene.environment_id && S.envMap) {
          var env = S.envMap[scene.environment_id];
          if (env) envNames.push(env.name + (env.prompt_fragment ? ': ' + env.prompt_fragment.substring(0, 80) : ''));
        }
        // Priority 3: legacy ingredients array
        var ings = ((ps.video || {}).ingredients || []);
        for (var ii = 0; ii < ings.length; ii++) {
          if ((ings[ii].type === 'environment' || ings[ii].type === 'character') && ings[ii].label) {
            if (ings[ii].type === 'environment') envNames.push(ings[ii].label + (ings[ii].description ? ': ' + ings[ii].description.substring(0, 80) : ''));
            else if (ings[ii].type === 'character' && characterName === 'none') characterName = ings[ii].label + (ings[ii].description ? ' — ' + ings[ii].description.substring(0, 80) : '');
          }
        }
      }

      var lines = [];
      lines.push('=== MODEL: Seedance 2.0 — PLAIN TEXT PROMPT (NOT JSON) ===');
      lines.push('');
      lines.push('CRITICAL OUTPUT INSTRUCTION:');
      lines.push('Output PLAIN TEXT ONLY. Do NOT output JSON. Do NOT wrap in code blocks or markdown. Do NOT add any commentary before or after the prompt.');
      lines.push('Use EXACTLY the 7-section structure shown below. Separate every section with this exact divider line:');
      lines.push('================================================================');
      lines.push('');
      lines.push('--- CLIP CONTEXT FOR THIS PROMPT ---');
      lines.push('Clip number: ' + clipNum);
      lines.push('Clip title: ' + clipTitle);
      lines.push('Duration: ' + duration + 's (sweet spot 8–10s; valid: 5s, 10s, 15s)');
      lines.push('Aspect ratio: ' + aspectRatio);
      lines.push('Generation mode: ' + genMode);
      lines.push('Audio direction: ' + (audioDirDef.label || audioDir));
      lines.push('Character: ' + characterName);
      lines.push('Environments: ' + (envNames.length ? envNames.join(' | ') : 'describe from video context'));
      if (clip.script_text) lines.push('Script / narration: "' + clip.script_text + '"');
      if (clip.visual_direction) lines.push('Visual direction: ' + clip.visual_direction);
      lines.push('');
      lines.push('--- SEEDANCE 2.0 PROMPT RULES ---');
      lines.push('');
      lines.push('SECTION 1 — HEADER (first line, no divider before it):');
      lines.push('  Format: CLIP [N] — [CLIP TITLE IN CAPS]');
      lines.push('  Then: Video type, Tool: Seedance 2.0, Format: [aspect ratio] [resolution] 24fps');
      lines.push('  Then: Duration: [X]s | Scenes: [N] | Character: [name or "Not present"] | Audio: [Provided X.Xs / None — ambient only]');
      lines.push('');
      lines.push('SECTION 2 — INPUT DECLARATION (after first divider):');
      lines.push('  If character present: CHARACTER REFERENCE IMAGE block with name, key appearance features (3–4 specific features: clothing colour, accessories, hair)');
      lines.push('  ENVIRONMENT IMAGE 1 — [SCENE NAME]: one-line description + "Used for: Scene 1 (0.0s–X.Xs)"');
      lines.push('  ENVIRONMENT IMAGE 2 (if needed): same format');
      lines.push('  ENVIRONMENT IMAGE 3 (if needed): same format');
      if (audioDir === 'ambient-only') {
        lines.push('  AUDIO: No voice audio file provided. Ambient only. Generate environmental sound matching each scene. No voice, no narration.');
      } else {
        lines.push('  AUDIO FILE: Pre-recorded voiceover, [X.X] seconds duration. ' + (characterName !== 'none' ? 'Sync character lip movement to this audio.' : 'No lip sync required — voiceover only.') + ' Generate ambient environmental sound matching each scene.');
      }
      lines.push('');
      lines.push('SECTION 3 — AUDIO HANDLING (after divider):');
      if (audioDir === 'voice-ambient' || audioDir === 'voice-ambient-music') {
        lines.push('  PRIMARY AUDIO: Use the provided audio file as the voice track.');
        if (characterName !== 'none') lines.push('  LIP SYNC: Sync character mouth movement to provided audio. Specify which scenes lip sync is active with time ranges.');
        lines.push('  AMBIENT GENERATION: Generate environmental ambient sound per scene — describe the specific acoustic character of each scene (open/enclosed, birds/traffic/interior reverb).');
        lines.push('  AMBIENT LEVEL: Ambient sits beneath the voice — felt, not heard. Voice is always dominant.');
        if (audioDir === 'voice-ambient-music') lines.push('  NOTE: Post-production music will be added in editing — do NOT generate music in Seedance.');
        lines.push('  DO NOT generate any additional voice, narration, dialogue, or speech beyond the provided audio.');
        lines.push('  DO NOT generate background music.');
      } else {
        lines.push('  PRIMARY AUDIO: No voice track — ambient only.');
        lines.push('  AMBIENT GENERATION: Generate rich environmental ambient sound that carries the scene. Be specific per scene.');
        lines.push('  NOTE: All narrative information must be conveyed via VFX text overlays (Section 5).');
        lines.push('  DO NOT generate any voice, narration, or dialogue of any kind.');
      }
      lines.push('');
      lines.push('SECTION 4 — SCENE-BY-SCENE INSTRUCTIONS (after divider):');
      lines.push('  For each scene use this exact block format:');
      lines.push('  SCENE [N] (X.Xs–Y.Ys) — [SCENE NAME]');
      lines.push('    Environment: Use Environment Image [N]');
      lines.push('    Camera:');
      lines.push('      Start: [what viewer sees at start of scene — specific framing]');
      lines.push('      Movement: [ONE of: slow dolly-in | slow dolly-out | slow pan left/right | rising crane | descending crane | slow orbit | static hold | glide-through]');
      lines.push('      Speed: [CONCRETE rate — e.g. "barely perceptible, camera covers 2 metres over 4 seconds" NOT just "slow"]');
      lines.push('      End: [what viewer sees at end of scene]');
      lines.push('    Character: [position, action, gesture, expression, lip sync time range — OR "Not visible in this scene"]');
      lines.push('    Ambient: [scene-specific ambient sound with acoustic character]');
      lines.push('  Between scenes: --- TRANSITION: Hard cut at X.Xs ---');
      lines.push('  RULE: One camera movement type per scene. Hard cuts only — no dissolves, wipes, fades, blends.');
      lines.push('');
      lines.push('SECTION 5 — VFX TEXT OVERLAY INSTRUCTIONS (after divider):');
      lines.push('  Lead with: "All text below is FINAL — no additional text appears."');
      lines.push('  For each text element:');
      lines.push('  TEXT [N]:');
      lines.push('    String: "[EXACT TEXT — ALL CAPS for chips/kickers]"');
      lines.push('    Style: [frosted pill chip | floating data card | bottom kicker | location label | brand bar | offer badge]');
      lines.push('    Position: [specific position — e.g. "top 10–12% of frame, centred"]');
      lines.push('    Entry time: [X.Xs]');
      lines.push('    Entry trigger: [dialogue word trigger OR timer if ambient-only]');
      lines.push('    Animation: [fade in 0.3–0.4s | slide in 0.5–0.6s | SNAP IN — instant (for kickers)]');
      lines.push('    Scene: [scene number]');
      lines.push('    Persistence: [visible until end of clip / exits at X.Xs]');
      lines.push('  FINAL HOLD TEXT STATE: list all text visible simultaneously in the last 1.0–1.5s');
      if (audioDir === 'ambient-only') {
        lines.push('  IMPORTANT (Option C — ambient only): All narrative from script must be carried by VFX text overlays.');
        if (clip.script_text) lines.push('  Script to convey via text: "' + clip.script_text + '"');
      }
      lines.push('');
      lines.push('SECTION 6 — FINAL HOLD (after divider):');
      lines.push('  Timestamp: [X.Xs to clip end]');
      lines.push('  Camera: static hold — motion fully settled');
      lines.push('  Character: [final position/expression or "Not visible"]');
      lines.push('  Environment: [which environment image is showing]');
      lines.push('  Text visible: [list all text elements simultaneously visible]');
      lines.push('  Ambient: [final ambient state — typically quietest moment]');
      lines.push('  Note: This is the frame the viewer sees longest — must be clean and composed.');
      lines.push('');
      lines.push('SECTION 7 — QUALITY DIRECTIVES (after divider):');
      lines.push('  VISUAL QUALITY:');
      lines.push('  - Photorealistic, editorial quality throughout');
      lines.push('  - No AI artifacts — no warped hands, extra fingers, distorted architecture');
      lines.push('  - Straight architectural lines, correct perspective');
      lines.push('  - Lighting consistent within each scene — direction does not shift');
      if (characterName !== 'none') {
        lines.push('  CHARACTER CONSISTENCY:');
        lines.push('  - Character must match the reference image exactly');
        lines.push('  - Reinforce 3–4 key features explicitly here (wardrobe, accessories, distinguishing features)');
        lines.push('  - Skin tone consistent across all scenes; proportions remain natural');
      }
      lines.push('  CAMERA:');
      lines.push('  - All camera movement slow and deliberate — never fast or jerky');
      lines.push('  - Specify the concrete speed for this clip\'s camera movement');
      lines.push('  SCENE CHANGES:');
      lines.push('  - Hard cuts only — no dissolves, wipes, fades, or blending');
      lines.push('  - Each scene starts cleanly with its own environment image');
      lines.push('  AUDIO:');
      if (audioDir !== 'ambient-only') {
        lines.push('  - Use ONLY the provided audio file for voice — generate no additional speech');
      }
      lines.push('  - Generate ambient environmental sound matching each scene');
      lines.push('  - No background music generation');
      lines.push('  DO NOT:');
      lines.push('  - Generate any voice, narration, or dialogue beyond the provided audio');
      lines.push('  - Add any text not listed in the VFX Text Overlay Instructions');
      lines.push('  - Add furniture, people, or objects not described in scene instructions');
      lines.push('  - Change time of day mid-clip');
      lines.push('  - Make character look different from the reference image');
      lines.push('  - Generate background music');
      lines.push('');
      lines.push('--- CONDENSED EXAMPLE (reference quality only — do not copy) ---');
      lines.push('CLIP 1 — ARRIVAL');
      lines.push('Video: Project Hero Film | Tool: Seedance 2.0 | Format: 9:16 1080×1920 24fps');
      lines.push('Duration: 8s | Scenes: 2 | Character: Not present | Audio: Provided — ElevenLabs 6.2s');
      lines.push('================================================================');
      lines.push('INPUT DECLARATION');
      lines.push('No character reference.');
      lines.push('ENVIRONMENT IMAGE 1 — AERIAL ESTABLISHING: Aerial view of campus at golden morning light, three towers, green canopy. Used for: Scene 1 (0.0s–4.0s)');
      lines.push('ENVIRONMENT IMAGE 2 — GROUND ENTRANCE: Ground-level view of granite archway at same golden hour, landscaped palms, backlit signage. Used for: Scene 2 (4.0s–8.0s)');
      lines.push('AUDIO FILE: Pre-recorded voiceover, 6.2 seconds. No lip sync required. Generate ambient.');
      lines.push('================================================================');
      lines.push('AUDIO HANDLING');
      lines.push('PRIMARY AUDIO: Use provided voiceover as voice track. No character — no lip sync.');
      lines.push('AMBIENT GENERATION:');
      lines.push('- Scene 1 (aerial): High-altitude open air — distant city hum, faint wind across treetops, soft bird calls. Acoustic: wide, spacious, elevated.');
      lines.push('- Scene 2 (entrance): Ground-level morning — closer bird calls, soft footsteps on granite, gentle breeze. Acoustic narrows — we are inside the project now.');
      lines.push('AMBIENT LEVEL: Felt, not heard. Voice is always dominant.');
      lines.push('DO NOT generate additional voice or background music.');
      lines.push('================================================================');
      lines.push('SCENE-BY-SCENE INSTRUCTIONS');
      lines.push('SCENE 1 (0.0s–4.0s) — AERIAL ESTABLISHING');
      lines.push('  Environment: Use Environment Image 1');
      lines.push('  Camera:');
      lines.push('    Start: Bird\'s-eye view, all three towers in frame, canopy spreading below, horizon visible.');
      lines.push('    Movement: Slow descending crane');
      lines.push('    Speed: Barely perceptible — camera covers 15–20 metres of vertical drop over 4 seconds.');
      lines.push('    End: Still aerial but slightly closer — towers dominate upper two-thirds of frame.');
      lines.push('  Character: Not visible in this scene.');
      lines.push('  Ambient: High-altitude open air. Wide, spacious acoustic.');
      lines.push('--- TRANSITION: Hard cut at 4.0s ---');
      lines.push('SCENE 2 (4.0s–8.0s) — GROUND ENTRANCE');
      lines.push('  Environment: Use Environment Image 2');
      lines.push('  Camera:');
      lines.push('    Start: Ground-level frontal view of granite archway, 6 metres from arch.');
      lines.push('    Movement: Slow dolly-in');
      lines.push('    Speed: Barely perceptible forward drift — camera covers 2 metres over 4 seconds.');
      lines.push('    End: Archway fills upper three-quarters of frame.');
      lines.push('  Character: Not visible in this scene.');
      lines.push('  Ambient: Ground-level morning birds, soft distant footsteps, gentle breeze.');
      lines.push('================================================================');
      lines.push('VFX TEXT OVERLAY INSTRUCTIONS');
      lines.push('All text below is FINAL — no additional text appears.');
      lines.push('TEXT 1:');
      lines.push('  String: "NORTH BENGALURU"');
      lines.push('  Style: Location label (frosted pill chip at top)');
      lines.push('  Position: Top 10–12% of frame, horizontally centred');
      lines.push('  Entry time: 1.2s | Entry trigger: Appears on word "green" in audio');
      lines.push('  Animation: Fade in over 0.4s | Scene: 1 | Persistence: visible until end');
      lines.push('TEXT 2:');
      lines.push('  String: "WELCOME HOME"');
      lines.push('  Style: Bottom kicker — two ruled lines with scrim');
      lines.push('  Position: Bottom 18–20% of frame, centred');
      lines.push('  Entry time: 5.8s | Entry trigger: Appears on word "Welcome" in audio');
      lines.push('  Animation: SNAP IN — instant | Scene: 2 | Persistence: visible until end');
      lines.push('FINAL HOLD TEXT STATE: At 6.5s to end — "NORTH BENGALURU" (top) + "WELCOME HOME" (bottom kicker) both visible.');
      lines.push('================================================================');
      lines.push('FINAL HOLD (6.5s–8.0s)');
      lines.push('Camera: Static hold. Scene 2 dolly settled.');
      lines.push('Character: Not visible.');
      lines.push('Environment: Environment Image 2 (ground entrance).');
      lines.push('Text visible: "NORTH BENGALURU" + "WELCOME HOME".');
      lines.push('Ambient: Scene 2 ambient quiets slightly — birds softer, breeze gentler.');
      lines.push('================================================================');
      lines.push('QUALITY DIRECTIVES');
      lines.push('VISUAL QUALITY: Photorealistic, editorial-quality architectural visualisation. Straight lines, correct perspective. Golden morning light consistent across both scenes.');
      lines.push('CAMERA: Scene 1 descending crane: 15–20 metres over 4s. Scene 2 dolly-in: 2 metres over 4s. No fast pans, no jerky motion.');
      lines.push('SCENE CHANGES: Hard cut at 4.0s — no dissolve, no blend. Scene 2 begins with its own independent starting frame.');
      lines.push('AUDIO: Use ONLY provided voiceover. Generate ambient per Audio Handling section. No background music.');
      lines.push('DO NOT: Generate any voice beyond provided audio | Add unlisted text | Add people or objects not described | Change time of day | Generate music.');
      lines.push('--- END EXAMPLE ---');
      lines.push('');
      lines.push('Now generate the complete Seedance 2.0 prompt for the clip described above. Output plain text only.');

      return lines.join('\n');
    },
    getOutputFormat: function () {
      return [
        'CLIP [N] — [CLIP TITLE IN CAPS]',
        'Video: [video type] | Tool: Seedance 2.0 | Format: [aspect ratio] 24fps',
        'Duration: [X]s | Scenes: [N] | Character: [name or "Not present"] | Audio: [Provided X.Xs / None — ambient only]',
        '================================================================',
        'INPUT DECLARATION',
        '...',
        '================================================================',
        'AUDIO HANDLING',
        '...',
        '================================================================',
        'SCENE-BY-SCENE INSTRUCTIONS',
        '...',
        '================================================================',
        'VFX TEXT OVERLAY INSTRUCTIONS',
        '...',
        '================================================================',
        'FINAL HOLD ([X.X]s–[clip end])',
        '...',
        '================================================================',
        'QUALITY DIRECTIVES',
        '...'
      ].join('\n');
    }
  };

  window._vpm = window._vpm || {};
  window._vpm.promptTemplates = window._vpm.promptTemplates || {};
  window._vpm.promptTemplates.seedance = seedance;
})();
