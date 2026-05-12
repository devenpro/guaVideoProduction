/**
 * BrandService — reads brand context from state and produces a system prompt prefix.
 *
 * Sources (init() reads):
 *   - S.brand.core              (parsed by part1 from .brand-data Drupal block)
 *   - S.meta.brandOverrides     (user-set overrides in Settings → Brand)
 *
 * Registers on: window._vpm.brandService
 * vpm-part2b.js captures it as: var BrandService = window._vpm.brandService;
 */
(function () {
  'use strict';

  var BrandService = (function () {
    var _parsed = {};

    function init() {
      var S = window._vpmState;
      _parsed = {};
      if (S.brand && S.brand.configured) { _parsed.core = S.brand.core || {}; }
      // Also check brandOverrides
      var bo = (S.meta || {}).brandOverrides || {};
      if (bo.enabled) {
        _parsed.core = _parsed.core || {};
        if (bo.name) _parsed.core.brand_name = bo.name;
        if (bo.voice) _parsed.core.voice = bo.voice;
        if (bo.target_audience) _parsed.core.audience = bo.target_audience;
      }
    }

    function isConfigured() { return !!(_parsed.core && (_parsed.core.brand_name || _parsed.core.voice)); }
    function getCore() { return _parsed.core || {}; }

    function getSystemPrompt() {
      if (!isConfigured()) return '';
      var core = getCore();
      var lines = ['--- BRAND CONTEXT ---'];
      if (core.brand_name) lines.push('Brand: ' + core.brand_name);
      if (core.voice) lines.push('Voice: ' + core.voice);
      if (core.audience) lines.push('Audience: ' + (typeof core.audience === 'string' ? core.audience : JSON.stringify(core.audience)));
      if (core.tagline) lines.push('Tagline: ' + core.tagline);
      return lines.join('\n');
    }

    return { init: init, isConfigured: isConfigured, getCore: getCore, getSystemPrompt: getSystemPrompt };
  })();

  window._vpm = window._vpm || {};
  window._vpm.brandService = BrandService;
})();
