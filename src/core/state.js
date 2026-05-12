/**
 * VPM State Container
 * The single source of truth for all VPM runtime state.
 * Defines `S` and immediately exposes it on window so part1/part2a/part2b
 * (and any future extracted module) can grab a reference and mutate it directly.
 *
 * Exposes:
 *   - window._vpmState  (legacy API — part2a and part2b poll for this)
 *   - window._vpm.state  (new unified namespace, same reference)
 *
 * MUST load before src/core/vpm-part1.js.
 */
(function () {
  'use strict';

  var S = {
    // Persisted (3 JSON fields)
    data: {
      start: {}, video: {}, research: {}, blueprint: {}, script: {}, clips: [], publishing: {}, thumbnails: {}
    },
    meta: {
      settings: {}, aiPreferences: {},
      lookLibrary: [], environmentLibrary: [], sceneLibrary: [],
      brandOverrides: {},
      studioRequirements: {}
    },
    activity: [],

    // Platform (read-only from DOM)
    user: { id: '', name: '', email: '', fullName: '', timezone: '', roles: '' },
    brand: { configured: false, identity: {}, core: null, video: null, content: null },
    brandStudio: { characters: [], outfits: [], looks: [], environments: [], scenes: [], collections: [], loaded: false },

    // Gallery state (3 types)
    galleries: { looks: [], environments: [], frames: [] },
    _galleryWrappers: {},

    // Combined pools (brand studio + video custom)
    allLooks: [], allEnvironments: [], allScenes: [],

    // Lookup maps (rebuilt by buildMaps)
    clipMap: {}, clipsByType: {}, clipsByTrack: {}, clipsBySection: {}, clipsByStatus: {},
    lookMap: {}, envMap: {}, sceneMap: {},

    // Stats (rebuilt by buildMaps)
    clipStats: {
      total: 0, totalAI: 0, totalNonAI: 0, totalTemplate: 0,
      aiDone: 0, nonAiDone: 0, templateDone: 0,
      withScenes: 0, withFramesDone: 0, withPrompts: 0, withVideoPrompts: 0
    },

    // Completion flags
    computedStatus: 'new',
    startComplete: false, blueprintComplete: false,
    researchComplete: false,
    scriptReady: false, scriptFinalized: false,
    studioReady: false,
    clipsReady: false, productionComplete: false,
    publishReady: false, exported: false,

    // Mode (standard | advanced)
    mode: 'advanced',

    // UI state (not persisted)
    currentStage: 'start', previousStage: null,
    currentStudioTab: 'overview',
    currentSettingsTab: 'general',
    currentClipDetailTab: 'script-config',
    currentPlatformTab: 'youtube',
    startStep: 'import',
    selectedClipId: null,
    clipTrackFilter: 'all',
    sidebarHidden: false,
    sidebarCollapsed: false,
    activityFilter: { search: '', type: '' },

    // Thumbnail workshop
    thumbnailStep: 'ideas',
    selectedThumbnailId: null,

    // Drupal DOM refs
    $form: null, $submitBtn: null,
    $dataField: null, $metaField: null, $activityField: null,

    // System
    _initializing: false, initialized: false, dirty: false,
    autoSaveTimer: null, lastSaved: null
  };

  // Legacy API (part2a, part2b poll for this)
  window._vpmState = S;
  // New unified namespace
  window._vpm = window._vpm || {};
  window._vpm.state = S;
})();
