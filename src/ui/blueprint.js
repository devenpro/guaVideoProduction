/**
 * Blueprint stage renderer
 *
 * Renders the Blueprint view — video overview (inline editable: title, target
 * audience, tone, description), duration allocation bar, section cards with
 * key points and visual notes, confirm flow.
 *
 * Registers on window._vpmRenderers.blueprintFull.
 *
 * Dependencies (captured at parse time from window):
 *   - S, Constants (TONES)
 *   - icon, esc, formatDuration, formatDate, progressBar (from utils/format.js)
 *   - renderNavButtons (from part1)
 *
 * MUST load AFTER vpm-part1.js and utils/format.js.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var icon = window._vpmIcon;
  var esc = window._vpmEsc;
  var formatDuration = window._vpmFormatDuration;
  var formatDate = window._vpmFormatDate;
  var progressBar = window._vpmProgressBar;
  var renderNavButtons = window._vpmRenderNavButtons;

  function renderBlueprintFull() {
    var bp = S.data.blueprint || {};
    var v = S.data.video || {};
    var sections = bp.sections || [];
    var totalDur = 0;
    for (var i = 0; i < sections.length; i++) totalDur += (sections[i].duration || 0);
    var targetDur = v.duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('compass-drafting') + ' Blueprint</h2>';
    html += '<p class="vpm-view-subtitle">Plan your video structure & sections</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-blueprint">' + icon('sparkles') + ' Generate Blueprint</button>';
    if (bp.confirmed) html += '<span class="vpm-text-success">' + icon('circle-check') + ' Confirmed</span>';
    html += '</div></div>';

    // --- Video Overview (inline editable) ---
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('info') + ' Video Overview</div>';
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
    html += '<input class="vpm-input" data-action="save-bp-field" data-path="blueprint.title" value="' + esc(bp.title || '') + '" placeholder="Video title…"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Duration</label>';
    html += '<div class="vpm-input-display">' + formatDuration(targetDur) + ' (' + targetDur + 's)</div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Audience</label>';
    html += '<input class="vpm-input" data-action="save-bp-field" data-path="blueprint.target_audience" value="' + esc(bp.target_audience || '') + '" placeholder="Who is this video for?"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Tone</label>';
    html += '<select class="vpm-select" data-action="save-bp-field" data-path="blueprint.tone">';
    html += '<option value="">Select…</option>';
    for (var tid in Constants.TONES) {
      html += '<option value="' + tid + '"' + (bp.tone === tid ? ' selected' : '') + '>' + esc(Constants.TONES[tid].label) + '</option>';
    }
    html += '</select></div>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label>';
    html += '<textarea class="vpm-textarea" data-action="save-bp-field" data-path="blueprint.description" rows="2" placeholder="Brief overview of what this video covers…">' + esc(bp.description || '') + '</textarea></div>';
    html += '</div>';

    // --- Duration Allocation Bar ---
    if (sections.length > 0) {
      html += '<div class="vpm-panel vpm-bp-dur-panel">';
      html += '<div class="vpm-flex-between vpm-mb-sm"><span class="vpm-text-label">Duration Allocation</span>';
      html += '<span class="vpm-text-sm' + (totalDur > targetDur ? ' vpm-text-error' : ' vpm-text-success') + '">' + totalDur + 's / ' + targetDur + 's target</span></div>';
      html += '<div class="vpm-bp-dur-track">';
      var _durColors = ['#d3e4fd', '#e8f0fe', '#d3e4fd', '#e8f0fe', '#ceead6', '#d3e4fd', '#fef7e0', '#e8f0fe', '#ceead6', '#f3e8ff'];
      for (var di = 0; di < sections.length; di++) {
        var sec = sections[di];
        var durPct = targetDur > 0 ? Math.max(2, Math.round((sec.duration / targetDur) * 100)) : 10;
        html += '<div class="vpm-bp-dur-seg" style="flex:' + (sec.duration || 1) + ';background:' + _durColors[di % _durColors.length] + '" title="' + esc(sec.label) + ': ' + (sec.duration || 0) + 's">';
        html += '<span>' + (sec.duration || 0) + 's</span></div>';
      }
      html += '</div>';
      html += progressBar(Math.min(100, Math.round((totalDur / targetDur) * 100)), totalDur > targetDur ? 'var(--vpm-error)' : 'var(--vpm-primary)');
      html += '</div>';
    }

    // --- Section Cards ---
    html += '<div class="vpm-bp-sections">';
    html += '<div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin-bottom:0">' + icon('list') + ' Sections</span>';
    html += '<span class="vpm-badge vpm-badge-outline">' + sections.length + ' sections</span></div>';

    if (!sections.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('compass-drafting') + '</div>';
      html += '<h3>No Sections Yet</h3><p>Click "Generate Blueprint" to auto-create sections from your video idea, or add sections manually below.</p></div>';
    }

    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      html += '<div class="vpm-bp-card" data-section-idx="' + si + '">';
      html += '<div class="vpm-bp-card-left">';
      html += '<span class="vpm-bp-drag" title="Drag to reorder">' + icon('grip-vertical') + '</span>';
      html += '<span class="vpm-bp-num">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-bp-card-body">';
      // Header row: label + duration + actions
      html += '<div class="vpm-bp-card-head">';
      html += '<input class="vpm-bp-card-label-input" value="' + esc(sec.label || '') + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="label" placeholder="Section name">';
      html += '<div class="vpm-bp-card-dur-input"><input class="vpm-input vpm-input-sm vpm-bp-dur-input-field" type="number" min="1" max="600" value="' + (sec.duration || 0) + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="duration" style="width:60px">s</div>';
      html += '<div class="vpm-bp-card-actions">';
      if (si > 0) html += '<button class="vpm-btn-icon-sm" data-action="move-bp-section" data-idx="' + si + '" data-dir="up" title="Move up">' + icon('chevron-up') + '</button>';
      if (si < sections.length - 1) html += '<button class="vpm-btn-icon-sm" data-action="move-bp-section" data-idx="' + si + '" data-dir="down" title="Move down">' + icon('chevron-down') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-bp-section" data-idx="' + si + '" title="Delete section" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
      html += '</div></div>';
      // Key points
      html += '<div class="vpm-bp-card-field"><textarea class="vpm-textarea vpm-bp-card-textarea" data-action="save-bp-section-field" data-idx="' + si + '" data-field="key_points" rows="2" placeholder="Key points, topics to cover…">' + esc(Array.isArray(sec.key_points) ? sec.key_points.join('\n') : (sec.key_points || '')) + '</textarea></div>';
      // Visual notes
      html += '<div class="vpm-bp-card-visual">' + icon('image') + ' <input class="vpm-bp-visual-input" value="' + esc(sec.visual_notes || '') + '" data-action="save-bp-section-field" data-idx="' + si + '" data-field="visual_notes" placeholder="Visual approach notes…"></div>';
      html += '</div></div>';
    }

    // Add section button
    html += '<button class="vpm-bp-add-btn" data-action="add-bp-section">' + icon('plus') + ' Add Section</button>';
    html += '</div>';

    // Style notes
    html += '<div class="vpm-panel"><div class="vpm-form-group"><label class="vpm-form-label">Global Style Notes</label>';
    html += '<textarea class="vpm-textarea" data-action="save-bp-field" data-path="blueprint.style_notes" rows="2" placeholder="Overall visual style, color palette, reference videos…">' + esc(bp.style_notes || '') + '</textarea></div></div>';

    // Confirm button
    html += '<div class="vpm-bp-confirm">';
    if (bp.confirmed) {
      html += '<div class="vpm-info-banner">' + icon('circle-check') + ' Blueprint confirmed on ' + formatDate(bp.confirmed_at) + '. <button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="unlock-blueprint">' + icon('lock') + ' Unlock & Edit</button></div>';
    } else {
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-full" data-action="confirm-blueprint"' + (sections.length < 1 ? ' disabled' : '') + '>' + icon('check') + ' Confirm Blueprint</button>';
    }
    html += '</div>';

    var prevStage = S.mode === 'advanced' ? 'Research' : 'Start';
    html += renderNavButtons(prevStage, 'Continue to Script', 'script');
    html += '</div>';
    return html;
  }

  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRenderers.blueprintFull = renderBlueprintFull;
})();
