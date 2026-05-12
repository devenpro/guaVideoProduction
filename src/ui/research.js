/**
 * Research stage renderer (Advanced mode only)
 *
 * Renders the Research grid with 4 panels (audience insights, competitor
 * analysis, trending angles, content strategy) plus a Reference Sources list.
 * Inline-editable per panel via the pen button.
 *
 * Registers on window._vpmRenderers.researchFull.
 *
 * Dependencies (captured at parse time from window):
 *   - S, Constants, icon, esc, truncate, badge, formatRelativeTime
 *   - renderNavButtons (from part1)
 *
 * MUST load AFTER vpm-part1.js and utils/format.js.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var icon = window._vpmIcon;
  var esc = window._vpmEsc;
  var truncate = window._vpmTruncate;
  var badge = window._vpmBadge;
  var formatRelativeTime = window._vpmFormatRelativeTime;
  var renderNavButtons = window._vpmRenderNavButtons;

  function renderResearchFull() {
    var res = S.data.research || {};
    var sources = res.sources || [];
    var prefs = (S.data.start && S.data.start.preferences) || {};
    var video = S.data.video || {};

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('magnifying-glass') + ' Research</h2>';
    html += '<p class="vpm-view-subtitle">AI-powered content research for better videos</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-research">' + icon('sparkles') + ' ' + (res.generated ? 'Regenerate Brief' : 'Generate Research Brief') + '</button>';
    if (res.generated) html += '<span class="vpm-text-success vpm-text-sm">' + icon('circle-check') + ' Generated ' + formatRelativeTime(res.generated_at || '') + '</span>';
    html += '</div></div>';

    // Chip strip: Start inputs feeding the brief — click to jump back to Start.
    var chips = [];
    if (video.target_audience) chips.push({ icon: 'users', label: 'Audience', value: video.target_audience });
    var plats = prefs.platforms || (prefs.platform ? [prefs.platform] : []);
    if (plats.length) {
      var pls = plats.map(function(p) { var def = window._vpmConstants.PLATFORMS[p]; return def ? def.label : p; }).join(' · ');
      chips.push({ icon: 'share-nodes', label: 'Platform', value: pls });
    }
    if (prefs.tone) { var tdef = window._vpmConstants.TONES[prefs.tone]; chips.push({ icon: 'face-smile', label: 'Tone', value: tdef ? tdef.label : prefs.tone }); }
    if (prefs.target_duration) chips.push({ icon: 'clock', label: 'Duration', value: prefs.target_duration + 's' });
    if (prefs.video_style) { var vdef = window._vpmConstants.VIDEO_STYLES[prefs.video_style]; chips.push({ icon: 'palette', label: 'Style', value: vdef ? vdef.label : prefs.video_style }); }
    if (prefs.language) { var ldef = window._vpmConstants.LANGUAGES[prefs.language]; chips.push({ icon: 'file-lines', label: 'Language', value: ldef ? ldef.label : prefs.language }); }

    if (chips.length) {
      html += '<div class="vpm-research-source-chips" title="These Start inputs shape the AI research brief — click any chip to revise.">';
      html += '<span class="vpm-research-source-chips-label">' + icon('sliders') + ' Brief inputs:</span>';
      for (var ci = 0; ci < chips.length; ci++) {
        var c = chips[ci];
        html += '<button class="vpm-research-source-chip" data-action="navigate" data-stage="start" title="Edit ' + esc(c.label) + ' in Start">';
        html += icon(c.icon) + ' <span class="vpm-research-source-chip-label">' + esc(c.label) + ':</span> ' + esc(c.value);
        html += '</button>';
      }
      html += '</div>';
    }

    // Stale-banner: Start preferences changed since this brief was generated.
    if (res.generated && window._vpmComputeResearchPrefsSignature) {
      var currentSig = window._vpmComputeResearchPrefsSignature();
      if (res.prefs_signature && res.prefs_signature !== currentSig) {
        html += '<div class="vpm-info-banner vpm-info-banner-warn" style="display:flex;align-items:center;gap:10px">' + icon('triangle-exclamation');
        html += ' <span><strong>Start preferences changed</strong> after this brief was generated — the research may no longer reflect your current inputs.</span>';
        html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-research" style="margin-left:auto">' + icon('sparkles') + ' Regenerate</button>';
        html += '</div>';
      }
    }

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
      var hints = ['Audience insights', 'Competitor analysis', 'Trending angles', 'Content strategy'];
      for (var hi = 0; hi < hints.length; hi++) html += '<div class="vpm-research-step-hint"><span class="vpm-research-step-num">' + (hi + 1) + '</span> ' + esc(hints[hi]) + '</div>';
      html += '</div></div>';
    } else {
      // 4 research panels in 2x2 grid
      var panels = [
        { key: 'audience_insights', label: 'Audience Insights', icon: 'users', color: '#1a73e8', desc: 'Target demographics, pain points, search intent, viewing habits' },
        { key: 'competitor_analysis', label: 'Competitor Analysis', icon: 'chart-bar', color: '#7c3aed', desc: 'Top-performing videos, content gaps, positioning opportunities' },
        { key: 'trending_angles', label: 'Trending Angles', icon: 'bolt', color: '#e37400', desc: 'Current trends, hot topics, viral hooks, seasonal relevance' },
        { key: 'content_strategy', label: 'Content Strategy', icon: 'compass-drafting', color: '#0d904f', desc: 'Recommended approach, structure, hooks, differentiation' }
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
        else try { text = JSON.stringify(text, null, 2); } catch (e) { text = String(text); }
      } else { text = String(text); }
    }
    var h = esc(text);
    // Format markdown-like lists
    h = h.replace(/^[-•]\s/gm, '• ');
    h = h.replace(/^\d+\.\s/gm, function (m) { return '<strong>' + m.trim() + '</strong> '; });
    h = h.replace(/\n\n+/g, '</p><p>');
    h = h.replace(/\n/g, '<br>');
    return '<p>' + h + '</p>';
  }

  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRenderers.researchFull = renderResearchFull;
})();
