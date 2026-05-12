/**
 * Runway prompt template
 *
 * Runway excels at creative style control and camera motion.
 *
 * Registers on: window._vpm.promptTemplates.runway
 */
(function () {
  'use strict';

  var runway = {
    supportsAudio: false,
    formatVideoPromptGuidance: function (clip, context) {
      var lines = [];
      lines.push('=== MODEL: Runway ===');
      lines.push('Runway excels at creative style control and camera motion.');
      lines.push('Emphasize camera movement direction, speed, and creative style.');
      lines.push('Runway handles artistic/stylized content well.');
      return lines.join('\n');
    },
    getOutputFormat: function () {
      return JSON.stringify({
        visual_prompt: 'Natural language scene description with style emphasis',
        motion_description: 'Motion with creative direction',
        camera: 'Detailed camera movement (Runway excels at this)',
        style: 'Detailed style and artistic direction',
        negative_prompt: 'jerky, distorted, low quality'
      }, null, 2);
    }
  };

  window._vpm = window._vpm || {};
  window._vpm.promptTemplates = window._vpm.promptTemplates || {};
  window._vpm.promptTemplates.runway = runway;
})();
