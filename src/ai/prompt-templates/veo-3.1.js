/**
 * Google VEO 3.1 prompt template
 *
 * VEO 3.1 generates high-quality video WITH integrated audio. Output is structured
 * JSON with visual_prompt, motion_description, camera, style, negative_prompt, audio.
 *
 * Registers on: window._vpm.promptTemplates['google-veo-3.1']
 *
 * Dependencies (read at method-call time from window):
 *   - window._vpmState  (S.data.start.preferences.audio_mode, voice_profile)
 *   - window._vpmResolveVoiceProfile()  (helper from part1)
 *   - window._vpm.buildVoiceDescription()  (helper from part2b — exported on window)
 */
(function () {
  'use strict';

  var veo = {
    supportsAudio: true,
    formatVideoPromptGuidance: function (clip, context) {
      var S = window._vpmState;
      var buildVoiceDescription = (window._vpm && window._vpm.buildVoiceDescription) || function () { return ''; };

      var audioMode = ((S.data.start || {}).preferences || {}).audio_mode || '';
      var vp = (window._vpmResolveVoiceProfile ? window._vpmResolveVoiceProfile(clip) : null) || ((S.data.start || {}).preferences || {}).voice_profile || {};
      var lines = [];
      lines.push('=== MODEL: Google VEO 3.1 ===');
      lines.push('Generate a COMPLETE structured video generation prompt in JSON format.');
      lines.push('VEO 3.1 generates high-quality video WITH integrated audio. The prompt must describe BOTH visual and audio elements in detail.');
      lines.push('');
      lines.push('REQUIREMENTS:');
      lines.push('- "visual_prompt": Full detailed description of the visual scene, characters, actions, lighting, composition, color palette');
      lines.push('- "motion_description": Detailed description of all motion — character movement, object movement, camera movement');
      lines.push('- "camera": Specific camera work — shot type, movement direction, speed, transitions');
      lines.push('- "style": Visual style keywords for consistency');
      lines.push('- "negative_prompt": What to avoid');
      if (audioMode === 'ai-audio-with-video') {
        lines.push('');
        lines.push('AUDIO (VEO 3.1 generates audio WITH video):');
        if (clip.script_text) lines.push('- Speech/voiceover text: "' + clip.script_text + '"');
        lines.push('- Voice profile: ' + buildVoiceDescription(vp));
        lines.push('- "audio.speech": The exact narration/dialogue text');
        lines.push('- "audio.voice_description": Detailed voice characteristics matching the profile above');
        lines.push('- "audio.ambient": Background/environmental sounds');
        lines.push('- "audio.music": Background music style or "none"');
        lines.push('- "audio.sound_effects": Any specific sound effects needed');
        // AI Character speaking enforcement
        if (clip.type === 'ai-character') {
          lines.push('');
          lines.push('=== AI CHARACTER IS THE SPEAKER (CRITICAL) ===');
          lines.push('- The character visible in the scene IS the speaker. Their lip movements MUST sync with the speech.');
          lines.push('- The visual_prompt MUST describe the character speaking/presenting directly to camera.');
          lines.push('- Include "speaking to camera" or "talking directly to the viewer" in the visual description.');
          lines.push('- Do NOT describe this as a separate voiceover — the on-screen character IS speaking these words.');
        }
      }
      return lines.join('\n');
    },
    getOutputFormat: function (audioMode) {
      if (audioMode === 'ai-audio-with-video') {
        return JSON.stringify({
          visual_prompt: 'Detailed visual description of the scene including subjects, actions, lighting, composition, colors, and environment',
          motion_description: 'Detailed motion description — what moves, how it moves, speed and direction of all movement',
          camera: "Camera shot type, movement direction, speed (e.g. 'Medium shot, slow push-in from left to right')",
          style: "Visual style keywords (e.g. 'cinematic, warm tones, shallow depth of field')",
          negative_prompt: "What to avoid (e.g. 'jerky motion, blurry, distorted faces, watermark')",
          duration: '8s',
          audio: {
            speech: 'Exact voiceover/narration text for this clip',
            voice_description: 'Voice characteristics: gender, age, tone, accent, pacing, emotion',
            ambient: "Background environmental sounds (e.g. 'soft office ambience', 'outdoor birds chirping')",
            music: "Background music style or 'none' (e.g. 'soft upbeat corporate music')",
            sound_effects: "Specific sound effects if any (e.g. 'keyboard typing', 'notification chime')"
          }
        }, null, 2);
      }
      return JSON.stringify({
        visual_prompt: 'Detailed visual scene description',
        motion_description: 'All motion in the scene',
        camera: 'Camera shot type and movement',
        style: 'Visual style keywords',
        negative_prompt: 'What to avoid',
        duration: '8s'
      }, null, 2);
    }
  };

  window._vpm = window._vpm || {};
  window._vpm.promptTemplates = window._vpm.promptTemplates || {};
  window._vpm.promptTemplates['google-veo-3.1'] = veo;
})();
