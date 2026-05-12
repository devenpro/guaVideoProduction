/**
 * Activity stage renderer
 *
 * Renders the Activity log with filters (search, type) grouped by date
 * (Today / Yesterday / This Week / Older).
 *
 * Registers on window._vpmRenderers.activityFull — part2a's initPart2A()
 * used to assign R.activityFull = renderActivityFull. That line is removed
 * from part2a now; this module owns the registration.
 *
 * Dependencies (captured at parse time from window):
 *   - S (state)             — via window._vpmState
 *   - Constants             — via window._vpmConstants (ACTIVITY_TYPES)
 *   - icon, esc, formatRelativeTime — via window._vpm* (set by utils/format.js)
 *
 * MUST load AFTER vpm-part1.js (which initializes window._vpmRenderers) and
 * after utils/format.js. Order vs part2a does not matter.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var icon = window._vpmIcon;
  var esc = window._vpmEsc;
  var formatRelativeTime = window._vpmFormatRelativeTime;

  function renderActivityFull() {
    var all = S.activity || [];
    var filtered = _getFilteredActivity();
    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('clock-rotate-left') + ' Activity</h2>';
    html += '<p class="vpm-view-subtitle">' + all.length + ' entries</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-activity">' + icon('download') + ' Export</button>';
    if (all.length) html += '<button class="vpm-btn vpm-btn-danger vpm-btn-sm" data-action="clear-activity">' + icon('trash') + ' Clear</button>';
    html += '</div></div>';

    // Filters
    html += '<div class="vpm-activity-filters">';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1;max-width:280px" data-action="filter-activity" placeholder="Search activity…" value="' + esc(S.activityFilter.search || '') + '">';
    html += '<select class="vpm-select vpm-select-sm" data-action="filter-activity-type"><option value="">All types</option>';
    for (var atId in Constants.ACTIVITY_TYPES) html += '<option value="' + atId + '"' + (S.activityFilter.type === atId ? ' selected' : '') + '>' + esc(Constants.ACTIVITY_TYPES[atId].label) + '</option>';
    html += '</select>';
    if (S.activityFilter.search || S.activityFilter.type) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-activity-filters">' + icon('xmark') + ' Clear Filters</button>';
      html += '<span class="vpm-text-xs vpm-text-muted">' + filtered.length + ' of ' + all.length + '</span>';
    }
    html += '</div>';

    // Empty state
    if (!filtered.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('clock-rotate-left') + '</div><h3>No Activity</h3>';
      html += '<p>' + (all.length ? 'No entries match your filters.' : 'Actions will appear here as you work.') + '</p></div>';
      html += '</div>';
      return html;
    }

    // Group by date
    var groups = _groupByDate(filtered);
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi];
      html += '<div class="vpm-activity-group">';
      html += '<div class="vpm-activity-group-head">' + esc(g.label) + ' <span class="vpm-text-xs vpm-text-muted">(' + g.items.length + ')</span></div>';
      for (var ai = 0; ai < g.items.length; ai++) {
        var act = g.items[ai];
        var at = Constants.ACTIVITY_TYPES[act.type] || { label: act.type, icon: 'circle', color: '#6b7280' };
        html += '<div class="vpm-activity-item">';
        html += '<div class="vpm-activity-icon" style="background:' + (at.color || '#6b7280') + '14;color:' + (at.color || '#6b7280') + '">' + icon(at.icon) + '</div>';
        html += '<div class="vpm-activity-body">';
        html += '<div class="vpm-activity-desc">' + esc(act.description || '') + '</div>';
        html += '<div class="vpm-activity-meta">';
        html += '<span>' + esc(formatRelativeTime(act.timestamp)) + '</span>';
        if (act.user_name) html += '<span>· ' + esc(act.user_name) + '</span>';
        html += '<span class="vpm-activity-type-tag" style="color:' + (at.color || '#6b7280') + '">' + esc(at.label) + '</span>';
        html += '</div></div></div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function _getFilteredActivity() {
    var all = S.activity || [];
    var search = (S.activityFilter.search || '').toLowerCase();
    var typeF = S.activityFilter.type || '';
    return all.filter(function (a) {
      if (typeF && a.type !== typeF) return false;
      if (search && (a.description || '').toLowerCase().indexOf(search) === -1 && (a.type || '').toLowerCase().indexOf(search) === -1) return false;
      return true;
    });
  }

  function _groupByDate(items) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var yesterday = today - 86400000;
    var weekAgo = today - 7 * 86400000;
    var groups = { today: { label: 'Today', items: [] }, yesterday: { label: 'Yesterday', items: [] }, week: { label: 'This Week', items: [] }, older: { label: 'Older', items: [] } };
    for (var i = 0; i < items.length; i++) {
      var ts = new Date(items[i].timestamp || 0).getTime();
      if (ts >= today) groups.today.items.push(items[i]);
      else if (ts >= yesterday) groups.yesterday.items.push(items[i]);
      else if (ts >= weekAgo) groups.week.items.push(items[i]);
      else groups.older.items.push(items[i]);
    }
    var result = [];
    if (groups.today.items.length) result.push(groups.today);
    if (groups.yesterday.items.length) result.push(groups.yesterday);
    if (groups.week.items.length) result.push(groups.week);
    if (groups.older.items.length) result.push(groups.older);
    return result;
  }

  // Register on the shared renderer map (set up by vpm-part1.js)
  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRenderers.activityFull = renderActivityFull;
})();
