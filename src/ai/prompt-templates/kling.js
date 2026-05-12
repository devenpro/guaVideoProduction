/**
 * Kling prompt template
 *
 * Kling prefers concise, direct prompts with clear action descriptions.
 *
 * Registers on: window._vpm.promptTemplates.kling
 */
(function () {
  'use strict';

  var kling = {
    supportsAudio: false,
    formatVideoPromptGuidance: function (clip, context) {
      var lines = [];
      lines.push('=== MODEL: Kling ===');
      lines.push('Kling prefers concise, direct prompts with clear action descriptions.');
      lines.push('Keep prompts focused — avoid excessive detail. Describe the key action clearly.');
      return lines.join('\n');
    },
    getOutputFormat: function () {
      return JSON.stringify({
        visual_prompt: 'Concise scene and action description',
        motion_description: 'Key motion description',
        camera: 'Camera shot and movement',
        style: 'Style keywords',
        negative_prompt: 'jerky, low quality, blurry'
      }, null, 2);
    }
  };

  window._vpm = window._vpm || {};
  window._vpm.promptTemplates = window._vpm.promptTemplates || {};
  window._vpm.promptTemplates.kling = kling;
})();
