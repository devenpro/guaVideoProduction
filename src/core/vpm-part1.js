/**
 * AI Video Production Manager v1.0 - Part 1: Core Engine
 * VPM Design System — Prefix: vpm-
 *
 * General-purpose AI video production for any YouTube/social media content.
 * Standard mode: 5 stages (Start → Blueprint → Script → Clips → Publish)
 * Advanced mode: 7 stages (Start → Research → Blueprint → Script → Studio → Clips → Publish)
 * 3 clip tracks: AI (full REVP pipeline), Non-AI (plan+record), Template (auto-apply)
 * Studio: 5 tabs (overview, looks, environments, scenes, library)
 * Settings: 5 tabs (general, ai, defaults, brand, import-export)
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  window._vpmRenderers = window._vpmRenderers || {};

  // ============================================================
  // SECTION 1: CONSTANTS
  // ============================================================

  // 1a. Workflow stages — all possible stages (mode filters which are active)
  var APP_STAGES = {
    'start':     { order: 1, label: 'Start',     icon: 'rocket',           description: 'Prompt, preferences & mode' },
    'research':  { order: 2, label: 'Research',   icon: 'magnifying-glass', description: 'AI-powered content research', advancedOnly: true },
    'blueprint': { order: 3, label: 'Blueprint',  icon: 'compass-drafting', description: 'Video plan & section structure' },
    'script':    { order: 4, label: 'Script',     icon: 'file-lines',       description: 'Write content section by section' },
    'studio':    { order: 5, label: 'Studio',     icon: 'palette',          description: 'Looks, environments & scenes', advancedOnly: true },
    'clips':     { order: 6, label: 'Clips',      icon: 'film',             description: 'Clip breakdown & REVP pipeline' },
    'publish':   { order: 7, label: 'Publish',    icon: 'share-nodes',      description: 'Metadata, thumbnails & export' }
  };
  var STAGE_ORDER_STANDARD = ['start', 'blueprint', 'script', 'clips', 'publish'];
  var STAGE_ORDER_ADVANCED = ['start', 'research', 'blueprint', 'script', 'studio', 'clips', 'publish'];

  // 1b. Utility views
  var UTILITY_VIEWS = {
    'activity': { label: 'Activity', icon: 'clock-rotate-left' },
    'settings': { label: 'Settings', icon: 'gear' }
  };

  // 1c. Platforms (5) with defaults
  var PLATFORMS = {
    'youtube':   { label: 'YouTube',         icon: 'youtube',   defaultAspect: '16:9',  durationRange: [60, 600],   metaFields: ['title', 'description', 'tags', 'chapters', 'category'] },
    'instagram': { label: 'Instagram Reels', icon: 'instagram', defaultAspect: '9:16',  durationRange: [15, 90],    metaFields: ['caption', 'hashtags', 'cover_frame'] },
    'tiktok':    { label: 'TikTok',          icon: 'clapperboard', defaultAspect: '9:16', durationRange: [15, 60],   metaFields: ['caption', 'hashtags'] },
    'linkedin':  { label: 'LinkedIn',        icon: 'linkedin',  defaultAspect: '16:9',  durationRange: [30, 120],   metaFields: ['post_text'] },
    'facebook':  { label: 'Facebook',        icon: 'facebook',  defaultAspect: '16:9',  durationRange: [60, 240],   metaFields: ['post_text', 'description'] }
  };

  // 1d. Aspect ratios
  var ASPECT_RATIOS = {
    '16:9': { label: 'Landscape (16:9)', shortLabel: '16:9', icon: 'desktop',  width: 1920, height: 1080 },
    '9:16': { label: 'Portrait (9:16)',  shortLabel: '9:16', icon: 'mobile',   width: 1080, height: 1920 },
    '1:1':  { label: 'Square (1:1)',     shortLabel: '1:1',  icon: 'square',   width: 1080, height: 1080 },
    '4:5':  { label: 'Social (4:5)',     shortLabel: '4:5',  icon: 'image',    width: 1080, height: 1350 }
  };

  // 1e. Audio modes (4) — expanded with voice profile support
  var AUDIO_MODES = {
    'ai-audio-with-video': { label: 'AI Audio with Video',  icon: 'film',              description: 'Audio generated as part of video model output (e.g. VEO 3.1 generates video WITH audio)', supportsVoiceProfile: true,  priority: 1 },
    'ai-voice-separate':   { label: 'AI Voice (Separate)',  icon: 'robot',             description: 'Dedicated TTS/voice tools (ElevenLabs, etc.) — audio mixed with video later', supportsVoiceProfile: true,  priority: 2 },
    'post-production':     { label: 'Post-Production',      icon: 'microphone-lines',  description: 'Audio added manually later in editing', supportsVoiceProfile: false, priority: 3 },
    'no-audio':            { label: 'No Audio (Silent)',    icon: 'volume-xmark',      description: 'Silent video with text/visuals only', supportsVoiceProfile: false, priority: 4 }
  };

  // 1e4. Seedance audio directions (campaign-level, Seedance 2.0 only)
  var SEEDANCE_AUDIO_DIRECTIONS = {
    'voice-ambient': {
      label: 'Option A: Voice + Ambient', icon: 'microphone-lines',
      description: 'ElevenLabs voice narration + Seedance-generated ambient audio. Default for most videos.',
      usesElevenLabs: true, usesMusicPostProd: false, isDefault: true
    },
    'voice-ambient-music': {
      label: 'Option B: Voice + Ambient + Music', icon: 'music',
      description: 'ElevenLabs voice + Seedance ambient + post-production music bed added in editing.',
      usesElevenLabs: true, usesMusicPostProd: true, isDefault: false
    },
    'ambient-only': {
      label: 'Option C: Ambient Only', icon: 'volume-low',
      description: 'No voice narration. Seedance ambient audio only. VFX text overlays carry all information.',
      usesElevenLabs: false, usesMusicPostProd: false, isDefault: false
    }
  };

  // 1e2. Video styles (for visual consistency across clips)
  var VIDEO_STYLES = {
    'cinematic':        { label: 'Cinematic',         icon: 'film',              description: 'High-quality, movie-like visuals with dramatic lighting',     promptHint: 'cinematic, film grain, dramatic lighting, shallow depth of field, anamorphic' },
    'corporate':        { label: 'Corporate',         icon: 'briefcase',         description: 'Clean, professional look for business communications',        promptHint: 'corporate, clean, professional, well-lit, modern office aesthetic' },
    'tutorial':         { label: 'Tutorial',          icon: 'chalkboard-user',   description: 'Clear, educational style focused on readability',             promptHint: 'tutorial style, clear, bright, educational, instructional' },
    'vlog-style':       { label: 'Vlog Style',        icon: 'video',             description: 'Casual, personal feel like a YouTuber vlog',                  promptHint: 'vlog style, casual, personal, handheld feel, natural lighting' },
    'motion-graphics':  { label: 'Motion Graphics',   icon: 'bezier-curve',      description: 'Animated graphics, infographics, text-driven visuals',        promptHint: 'motion graphics, animated, flat design, infographic style, vector art' },
    'documentary':      { label: 'Documentary',       icon: 'newspaper',         description: 'Interview-style, real-world footage feel',                    promptHint: 'documentary style, realistic, natural, interview lighting, journalistic' },
    'animated':         { label: 'Animated',          icon: 'palette',           description: '2D or 3D animation style',                                   promptHint: 'animated, illustration, cartoon style, vibrant colors' },
    'minimal':          { label: 'Minimal',           icon: 'minus',             description: 'Clean, simple, lots of white space',                          promptHint: 'minimalist, clean, white space, simple, elegant' },
    'custom':           { label: 'Custom',            icon: 'pen',               description: 'Define your own style keywords',                              promptHint: '' }
  };

  // 1e3. Voice profile options
  var VOICE_GENDERS = { 'male': 'Male', 'female': 'Female', 'neutral': 'Neutral' };
  var VOICE_AGE_RANGES = { 'young-adult': 'Young Adult', 'adult': 'Adult', 'mature': 'Mature' };
  var VOICE_STYLES = { 'warm': 'Warm', 'authoritative': 'Authoritative', 'energetic': 'Energetic', 'calm': 'Calm', 'professional': 'Professional', 'friendly': 'Friendly', 'dramatic': 'Dramatic' };
  var VOICE_ACCENTS = { 'american': 'American', 'british': 'British', 'australian': 'Australian', 'indian': 'Indian', 'neutral': 'Neutral', 'custom': 'Custom' };

  // 1f. Production modes (5)
  var PRODUCTION_MODES = {
    'full-ai':          { label: 'Full AI',           icon: 'robot',    description: 'All clips AI-generated: characters, visuals, voiceover', recommended: ['ai-character', 'ai-visual', 'ai-broll'] },
    'hybrid':           { label: 'Hybrid',            icon: 'arrows-rotate', description: 'Mix AI + human recording for best results', recommended: ['ai-character', 'screen-recording', 'ai-visual', 'human-presenter'] },
    'screen-recording': { label: 'Screen Recording',  icon: 'desktop',  description: 'App demos & walkthroughs with voiceover', recommended: ['screen-recording', 'screen-with-cam', 'text-card'] },
    'live-action':      { label: 'Live Action',       icon: 'video',    description: 'Real camera footage with editing', recommended: ['human-presenter', 'ai-broll', 'text-card'] },
    'template-based':   { label: 'Template-Based',    icon: 'layer-group', description: 'Branded templates, overlays & text cards', recommended: ['branded-intro', 'text-card', 'chapter-title', 'branded-outro'] }
  };

  // 1g. Presenter preferences
  var PRESENTER_PREFS = {
    'ai-only':    { label: 'AI Only',       icon: 'robot',         description: 'AI characters for all presenter segments' },
    'human-only': { label: 'Human Only',    icon: 'user',          description: 'Human presenter for talking-head segments' },
    'hybrid':     { label: 'Hybrid',        icon: 'arrows-rotate', description: 'Mix AI + human for different sections' },
    'none':       { label: 'No Presenter',  icon: 'eye-slash',     description: 'Visuals only — no talking-head segments' }
  };

  // 1h. Languages (8+)
  var LANGUAGES = {
    'english':  { label: 'English',   icon: 'e' },
    'hindi':    { label: 'Hindi',     icon: 'h',  sub: '\u0939\u093f\u0902\u0926\u0940' },
    'hinglish': { label: 'Hinglish',  icon: 'he', sub: 'Mix' },
    'spanish':  { label: 'Spanish',   icon: 'es' },
    'french':   { label: 'French',    icon: 'fr' },
    'german':   { label: 'German',    icon: 'de' },
    'japanese': { label: 'Japanese',  icon: 'ja' },
    'custom':   { label: 'Custom',    icon: 'globe' }
  };

  // 1i. Tones (6)
  var TONES = {
    'friendly':      { label: 'Friendly',        icon: 'face-smile',         color: '#0d904f', description: 'Warm, approachable, conversational' },
    'professional':  { label: 'Professional',     icon: 'briefcase',          color: '#1a73e8', description: 'Polished, business-appropriate, trustworthy' },
    'authoritative': { label: 'Authoritative',    icon: 'crown',             color: '#7c3aed', description: 'Expert-level, commanding, builds trust with data' },
    'casual':        { label: 'Casual',           icon: 'mug-saucer',        color: '#e37400', description: 'Relaxed, informal, like talking to a friend' },
    'energetic':     { label: 'Energetic',        icon: 'bolt',              color: '#d93025', description: 'High energy, enthusiastic, fast-paced' },
    'dramatic':      { label: 'Dramatic',         icon: 'fire',              color: '#9333ea', description: 'Cinematic, emotional, storytelling-focused' }
  };

  // 1j. Planner tone mapping (for video planner JSON import)
  var PLANNER_TONE_MAP = {
    'educational': 'professional', 'step-by-step teaching style': 'professional',
    'conversational': 'friendly', 'entertaining': 'energetic', 'inspirational': 'dramatic',
    'professional': 'professional', 'friendly': 'friendly', 'casual': 'casual',
    'energetic': 'energetic', 'dramatic': 'dramatic', 'authoritative': 'authoritative'
  };

  // 1k. Clip types (12) with track assignment
  var CLIP_TYPES = {
    // AI track
    'ai-character':     { label: 'AI Character',     icon: 'user-tie',             track: 'ai',       color: '#7c3aed', needsPrompt: true,  defaultLastFrame: true,  defaultDuration: 8 },
    'ai-visual':        { label: 'AI Visual',        icon: 'wand-magic-sparkles',  track: 'ai',       color: '#7c3aed', needsPrompt: true,  defaultLastFrame: false, defaultDuration: 6 },
    'ai-broll':         { label: 'AI B-Roll',        icon: 'images',               track: 'ai',       color: '#7c3aed', needsPrompt: true,  defaultLastFrame: false, defaultDuration: 8 },
    // Non-AI track
    'screen-recording': { label: 'Screen Recording', icon: 'desktop',              track: 'non-ai',   color: '#0891b2', needsPrompt: false, defaultDuration: 15 },
    'screen-with-cam':  { label: 'Screen + Camera',  icon: 'camera',               track: 'non-ai',   color: '#0891b2', needsPrompt: false, defaultDuration: 15 },
    'human-presenter':  { label: 'Human Presenter',  icon: 'video',                track: 'non-ai',   color: '#1a73e8', needsPrompt: false, defaultDuration: 15 },
    'infographic':      { label: 'Infographic',      icon: 'chart-bar',            track: 'non-ai',   color: '#e37400', needsPrompt: false, defaultDuration: 5 },
    'custom-non-ai':    { label: 'Custom (Non-AI)',  icon: 'pen',                  track: 'non-ai',   color: '#6b7280', needsPrompt: false, defaultDuration: 10 },
    // Template track
    'branded-intro':    { label: 'Branded Intro',    icon: 'play',                 track: 'template', color: '#9ca3af', needsPrompt: false, defaultDuration: 4 },
    'branded-outro':    { label: 'Branded Outro',    icon: 'circle-stop',          track: 'template', color: '#9ca3af', needsPrompt: false, defaultDuration: 10 },
    'chapter-title':    { label: 'Chapter Title',    icon: 'bookmark',             track: 'template', color: '#9ca3af', needsPrompt: false, defaultDuration: 3 },
    'text-card':        { label: 'Text Card',        icon: 'heading',              track: 'template', color: '#9ca3af', needsPrompt: false, defaultDuration: 4 }
  };

  // 1k. Clip statuses per track
  var AI_CLIP_STATUSES = {
    'draft':             { order: 0, label: 'Draft',         color: '#9ca3af', icon: 'circle' },
    'script-ready':      { order: 1, label: 'Script Ready',  color: '#e37400', icon: 'file-lines' },
    'scene-set':         { order: 2, label: 'Scene Set',     color: '#0891b2', icon: 'palette' },
    'first-frame-ready': { order: 3, label: '1st Frame',     color: '#1a73e8', icon: 'image' },
    'last-frame-ready':  { order: 4, label: 'Last Frame',    color: '#7c3aed', icon: 'images' },
    'video-ready':       { order: 5, label: 'Video Ready',   color: '#0d904f', icon: 'film' },
    'done':              { order: 6, label: 'Done',          color: '#0d904f', icon: 'circle-check' }
  };
  var AI_CLIP_STATUS_ORDER = ['draft', 'script-ready', 'scene-set', 'first-frame-ready', 'last-frame-ready', 'video-ready', 'done'];

  var NON_AI_CLIP_STATUSES = {
    'planned':     { order: 0, label: 'Planned',     color: '#9ca3af', icon: 'circle' },
    'in-progress': { order: 1, label: 'In Progress', color: '#e37400', icon: 'spinner' },
    'recorded':    { order: 2, label: 'Recorded',    color: '#1a73e8', icon: 'camera' },
    'done':        { order: 3, label: 'Done',        color: '#0d904f', icon: 'circle-check' }
  };

  var TEMPLATE_CLIP_STATUSES = {
    'pending': { order: 0, label: 'Pending', color: '#9ca3af', icon: 'circle' },
    'applied': { order: 1, label: 'Applied', color: '#0d904f', icon: 'circle-check' }
  };

  // 1l. Tab configs
  var STUDIO_TABS = {
    'overview':     { label: 'Overview',      icon: 'bullseye',   order: 0 },
    'looks':        { label: 'Looks / Avatars', icon: 'user-check', order: 1 },
    'environments': { label: 'Environments',  icon: 'panorama',   order: 2 },
    'scenes':       { label: 'Scenes',        icon: 'image',      order: 3 },
    'library':      { label: 'Brand Library', icon: 'building',   order: 4 }
  };
  var SETTINGS_TABS = {
    'general':       { label: 'General',       icon: 'gear',      order: 1 },
    'ai':            { label: 'AI Providers',  icon: 'microchip', order: 2 },
    'defaults':      { label: 'Defaults',      icon: 'sliders',   order: 3 },
    'brand':         { label: 'Brand Context', icon: 'palette',   order: 4 },
    'import-export': { label: 'Import/Export', icon: 'layer-group', order: 5 }
  };
  var AI_CLIP_TABS = {
    'script-config': { label: 'Script & Config',  icon: 'file-lines', order: 1 },
    'first-frame':   { label: 'First Frame',      icon: 'image',      order: 2 },
    'last-frame':    { label: 'Last Frame',        icon: 'images',     order: 3, conditional: true },
    'video':         { label: 'Video',             icon: 'film',       order: 4 }
  };
  var NON_AI_CLIP_TABS = {
    'planning':  { label: 'Planning & Brief',  icon: 'clipboard-list', order: 1 },
    'creation':  { label: 'Create / Record',   icon: 'camera',         order: 2 }
  };

  // 1m. Entity sub-constants
  var LOOK_ROLES = {
    'primary-presenter': { label: 'Primary Presenter', color: '#1a73e8', icon: 'user-tie' },
    'brand-ambassador':  { label: 'Brand Ambassador',  color: '#7c3aed', icon: 'star' },
    'supporting':        { label: 'Supporting',        color: '#e37400', icon: 'users' },
    'lifestyle':         { label: 'Lifestyle',         color: '#0d904f', icon: 'person-walking' }
  };
  var ENVIRONMENT_TYPES = {
    'indoor':   { label: 'Indoor' },
    'outdoor':  { label: 'Outdoor' },
    'studio':   { label: 'Studio Set' },
    'aerial':   { label: 'Aerial' },
    'abstract': { label: 'Abstract / Digital' }
  };

  // 1n. Production sub-constants
  var MOTION_STRENGTHS = { 'subtle': { label: 'Subtle' }, 'low': { label: 'Low' }, 'medium': { label: 'Medium' }, 'high': { label: 'High' }, 'dynamic': { label: 'Dynamic' } };
  var CAMERA_MOVEMENTS = { 'static': { label: 'Static' }, 'slow-pan': { label: 'Slow Pan' }, 'slow-zoom': { label: 'Slow Zoom' }, 'push-in': { label: 'Push-in' }, 'pull-back': { label: 'Pull-back' }, 'orbit': { label: 'Orbit' }, 'dolly': { label: 'Dolly' } };
  var TRANSITION_STYLES = { 'cut': { label: 'Cut' }, 'smooth-dissolve': { label: 'Smooth Dissolve' }, 'fade': { label: 'Fade' }, 'swipe': { label: 'Swipe' }, 'morph': { label: 'Morph' } };

  // 1o. Image/Video models
  var IMAGE_MODELS = {
    'imagen-3': { label: 'Google Imagen 3', icon: 'image', isDefault: true },
    'seedream': { label: 'Seedream',        icon: 'seedling' }
  };
  var VIDEO_MODELS = {
    'seedance':        { label: 'Seedance 2.0',   icon: 'seedling',  isDefault: true, durations: [5, 10, 15],     defaultDuration: 10, minDuration: 5,  maxDuration: 15, durationStep: 5, defaultGenMode: 'ingredients-to-video', notes: 'Primary model. Ingredients & Text to Video. Sweet spot 8\u201310s per clip.' },
    'google-veo-3.1':  { label: 'Google VEO 3.1', icon: 'film',                       durations: [5, 6, 7, 8],    defaultDuration: 8,  minDuration: 5,  maxDuration: 8,  durationStep: 1, defaultGenMode: 'frames-to-video',      notes: 'Frames to Video \u2014 reference image required. Integrated audio. Max 8s.' },
    'kling':           { label: 'Kling',          icon: 'bolt',                       durations: [5, 10],         defaultDuration: 5,  minDuration: 5,  maxDuration: 10, durationStep: 5, notes: 'Fast generation. 5s or 10s clips.' },
    'runway':          { label: 'Runway',         icon: 'plane',                      durations: [4, 10, 16],     defaultDuration: 10, minDuration: 4,  maxDuration: 16, durationStep: 1, notes: 'Creative style control. 4-16s range.' }
  };

  // 1p. Video statuses (forward-only)
  var VIDEO_STATUSES = {
    'new':              { label: 'New',              color: '#9ca3af', icon: 'circle',           order: 0 },
    'idea-ready':       { label: 'Idea Ready',       color: '#1a73e8', icon: 'lightbulb',        order: 1 },
    'research-done':    { label: 'Research Done',    color: '#0891b2', icon: 'magnifying-glass',  order: 2 },
    'blueprint-done':   { label: 'Blueprint Done',   color: '#1a73e8', icon: 'compass-drafting', order: 3 },
    'script-draft':     { label: 'Script Draft',     color: '#e37400', icon: 'file-lines',       order: 4 },
    'script-final':     { label: 'Script Final',     color: '#0d904f', icon: 'file-lines',       order: 5 },
    'studio-ready':     { label: 'Studio Ready',     color: '#7c3aed', icon: 'palette',          order: 6 },
    'in-production':    { label: 'In Production',    color: '#e37400', icon: 'spinner',          order: 7 },
    'production-done':  { label: 'Production Done',  color: '#0d904f', icon: 'circle-check',     order: 8 },
    'published':        { label: 'Published',        color: '#0d904f', icon: 'share-nodes',      order: 9 }
  };

  // 1q. Activity types
  var ACTIVITY_TYPES = {
    'created': { label: 'Created', icon: 'plus' },
    'idea_processed': { label: 'Idea Processed', icon: 'lightbulb' },
    'research_generated': { label: 'Research', icon: 'magnifying-glass' },
    'blueprint_completed': { label: 'Blueprint', icon: 'compass-drafting' },
    'blueprint_updated': { label: 'Blueprint Updated', icon: 'compass-drafting' },
    'script_generated': { label: 'Script Generated', icon: 'sparkles' },
    'script_edited': { label: 'Script Edited', icon: 'pen' },
    'script_enhanced': { label: 'AI Enhanced', icon: 'sparkles' },
    'script_finalized': { label: 'Finalized', icon: 'circle-check' },
    'script_unlocked': { label: 'Unlocked', icon: 'lock' },
    'clips_generated': { label: 'Clips Generated', icon: 'scissors' },
    'clip_edited': { label: 'Clip Edited', icon: 'pen' },
    'clip_added': { label: 'Clip+', icon: 'plus' },
    'clip_removed': { label: 'Clip-', icon: 'trash' },
    'clip_reordered': { label: 'Reordered', icon: 'arrows-rotate' },
    'studio_analyzed': { label: 'Studio Analyzed', icon: 'sparkles' },
    'look_created': { label: 'Look+', icon: 'user-check' },
    'look_edited': { label: 'Look Edited', icon: 'pen' },
    'environment_created': { label: 'Env+', icon: 'panorama' },
    'scene_created': { label: 'Scene+', icon: 'image' },
    'scene_assigned': { label: 'Scene Assigned', icon: 'link' },
    'prompt_generated': { label: 'Prompt', icon: 'wand-magic-sparkles' },
    'frame_marked_done': { label: 'Frame Done', icon: 'circle-check' },
    'frame_image_set': { label: 'Frame Image', icon: 'image' },
    'video_prompt_generated': { label: 'Video Prompt', icon: 'film' },
    'metadata_generated': { label: 'Metadata', icon: 'sparkles' },
    'thumbnail_ideas_generated': { label: 'Thumbnail Ideas', icon: 'image' },
    'thumbnail_finalized': { label: 'Thumbnail Done', icon: 'circle-check' },
    'exported': { label: 'Exported', icon: 'download' },
    'settings_changed': { label: 'Settings', icon: 'gear' },
    'brand_override_set': { label: 'Brand Override', icon: 'palette' },
    'planner_imported': { label: 'Planner Import', icon: 'file-import' }
  };


  // ============================================================
  // SECTION 2: STATE OBJECT
  // ============================================================

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


  // ============================================================
  // SECTION 3: INITIALIZATION
  // ============================================================

  function isVPMPage() { return $('body').hasClass('node--type-video-production'); }

  // Prevent CKEditor5 from initializing on our JSON textareas
  if (isVPMPage()) {
    $('#edit-field-json-data-0-value, #edit-field-json-meta-0-value, #edit-field-activity-log-0-value')
      .removeAttr('data-ckeditor5-host-entity-type')
      .removeAttr('data-ckeditor5-host-entity-bundle')
      .removeAttr('data-ckeditor5-host-entity-langcode');
  }

  Drupal.behaviors = Drupal.behaviors || {};
  Drupal.behaviors.vpmPart1 = {
    attach: function(context) {
      if (S.initialized || S._initializing) return;
      if (!isVPMPage()) return;
      if (!$(context).find('#edit-field-json-data-0-value').length &&
          !$(context).find('#edit-field-json-meta-0-value').length &&
          context !== document) return;
      init();
    }
  };

  // Fallback init timers
  if (isVPMPage()) {
    var _fallbackDelays = [200, 500, 1000];
    for (var _fi = 0; _fi < _fallbackDelays.length; _fi++) {
      (function(delay) {
        setTimeout(function() {
          if (!S.initialized && !S._initializing) {
            console.log('[VPM] Fallback init at ' + delay + 'ms');
            init();
          }
        }, delay);
      })(_fallbackDelays[_fi]);
    }
  }

  function init() {
    if (S._initializing || S.initialized) return;
    S._initializing = true;
    console.log('[VPM] Initializing Part 1...');

    try {
      parseUserData();
      if (!detectDrupalForm()) { console.error('[VPM] Drupal form not found'); S._initializing = false; return; }
      parseGalleries();
      _observeGalleryWidgets();
      loadData();
      migrateData();
      migrateMeta();
      parseBrandData();
      parseBrandStudioLibrary();
      _observeBrandStudioLibrary();
      buildMaps();
      // Auto-hide sidebar on mobile viewports
      if (window.innerWidth < 992) S.sidebarHidden = true;
      renderApp();
      setupEventHandlers();
      startAutoSave();
    } catch (e) {
      console.error('[VPM] Init error:', e.message, e.stack);
      S._initializing = false;
      S.initialized = true;
      return;
    }

    // Drupal AJAX gallery refresh
    $(document).ajaxComplete(function(event, xhr, settings) {
      if (settings && settings.url && (
        settings.url.indexOf('field_looks_gallery') > -1 ||
        settings.url.indexOf('field_environments_gallery') > -1 ||
        settings.url.indexOf('field_frames_gallery') > -1
      )) {
        setTimeout(function() { parseGalleries(); $(document).trigger('vpm:gallery-updated', ['all']); }, 300);
      }
    });

    // Unsaved changes warning
    $(window).on('beforeunload', function(e) {
      if (S.dirty) { e.preventDefault(); return 'You have unsaved changes. Leave anyway?'; }
    });

    S.initialized = true;
    S._initializing = false;
    console.log('[VPM] Part 1 initialized — mode: ' + S.mode + ', stage: ' + S.currentStage + ', clips: ' + (S.data.clips || []).length);
  }

  // --- Parse User Data ---
  function parseUserData() {
    var $ud = $('#guau-userdata');
    if (!$ud.length) { console.warn('[VPM] #guau-userdata not found'); return; }
    S.user = {
      id: ($ud.find('#guau-userid').text() || '').trim(),
      name: ($ud.find('#guau-username').text() || '').trim(),
      email: ($ud.find('#guau-useremail').text() || '').trim(),
      fullName: ($ud.find('#guau-userfullname').text() || '').trim(),
      timezone: ($ud.find('#guau-usertimezone').text() || '').trim(),
      roles: ($ud.find('#guau-userroles').text() || '').trim()
    };
  }

  // --- Detect Drupal Form ---
  function detectDrupalForm() {
    S.$dataField = $('#edit-field-json-data-0-value');
    S.$metaField = $('#edit-field-json-meta-0-value');
    S.$activityField = $('#edit-field-activity-log-0-value');
    if (!S.$dataField.length && !S.$metaField.length) return false;
    S.$form = S.$dataField.closest('form');
    S.$submitBtn = S.$form.find('#edit-submit, .form-submit[value="Save"], input[type="submit"]').first();
    // Hide JSON field wrappers
    S.$dataField.closest('.field--name-field-json-data').hide();
    S.$metaField.closest('.field--name-field-json-meta').hide();
    if (S.$activityField.length) S.$activityField.closest('.field--name-field-activity-log').hide();
    $('#edit-field-json-data-0-format, #edit-field-json-meta-0-format, #edit-field-activity-log-0-format').hide();
    return true;
  }

  // --- Gallery Parsing (3 galleries) ---
  var _GALLERY_SELECTORS = {
    'looks':         '#edit-field-looks-gallery-wrapper, .field--name-field-looks-gallery',
    'environments':  '#edit-field-environments-gallery-wrapper, .field--name-field-environments-gallery',
    'frames':        '#edit-field-frames-gallery-wrapper, .field--name-field-frames-gallery'
  };

  function _freshWrapper(type) { var sel = _GALLERY_SELECTORS[type]; return sel ? $(sel).first() : $(); }

  function parseGalleries() {
    S.galleries = { looks: [], environments: [], frames: [] };
    S._galleryWrappers = {};
    function _parseFieldImages(type) {
      var $wrapper = _freshWrapper(type);
      S._galleryWrappers[type] = $wrapper;
      if (!$wrapper.length) return;
      $wrapper.find('.image-widget, .media-library-item, .js-form-managed-file, .form-managed-file').each(function() {
        var $slot = $(this);
        var $img = $slot.find('.image-preview img, .image-widget img, img[typeof="foaf:Image"]').first();
        if (!$img.length) $img = $slot.find('img').first();
        var src = $img.attr('src');
        if (!src) return;
        var fid = $slot.find('input[name*="fids"], input[type="hidden"][name*="target_id"]').val() || '';
        if (!fid) return;
        var origSrc = src;
        if (src.indexOf('/styles/') > -1) origSrc = src.replace(/\/styles\/[^\/]+\/public\//, '/');
        S.galleries[type].push({ url: src, originalUrl: origSrc, alt: $img.attr('alt') || '', fid: fid, filename: origSrc.split('/').pop().split('?')[0], $slot: $slot });
      });
      $wrapper.hide();
    }
    _parseFieldImages('looks');
    _parseFieldImages('environments');
    _parseFieldImages('frames');
    console.log('[VPM] Galleries: ' + S.galleries.looks.length + ' looks, ' + S.galleries.environments.length + ' envs, ' + S.galleries.frames.length + ' frames');
  }

  function _observeGalleryWidgets() {
    try {
      for (var gType in _GALLERY_SELECTORS) {
        var $w = _freshWrapper(gType);
        if ($w.length && $w[0]) {
          var observer = new MutationObserver(function() { setTimeout(function() { parseGalleries(); }, 200); });
          observer.observe($w[0], { childList: true, subtree: true });
        }
      }
    } catch (e) { console.warn('[VPM] Gallery observer setup failed:', e); }
  }

  // --- Gallery Upload Queue ---
  var _galleryQueue = [];
  var _galleryQueueProcessing = false;

  function queueGalleryUpload(type, file, context) {
    _galleryQueue.push({ type: type, file: file, context: context || {} });
    if (!_galleryQueueProcessing) _processGalleryQueue();
  }

  function _processGalleryQueue() {
    if (_galleryQueue.length === 0) { _galleryQueueProcessing = false; return; }
    _galleryQueueProcessing = true;
    var item = _galleryQueue.shift();
    var $wrapper = _freshWrapper(item.type);
    if (!$wrapper.length) { _processGalleryQueue(); return; }
    var $input = $wrapper.find('input[type="file"]').last();
    if (!$input.length) { _processGalleryQueue(); return; }
    var dt = new DataTransfer();
    dt.items.add(item.file);
    $input[0].files = dt.files;
    $input.trigger('change');
    setTimeout(function() { _processGalleryQueue(); }, 2000);
  }

  function triggerGalleryRemove(type, fid) {
    var $wrapper = _freshWrapper(type);
    if (!$wrapper.length) return;
    $wrapper.find('.js-form-managed-file, .form-managed-file').each(function() {
      var $slot = $(this);
      var slotFid = $slot.find('input[name*="fids"], input[type="hidden"][name*="target_id"]').val() || '';
      if (slotFid === fid) {
        var $removeBtn = $slot.find('.button--remove, [name*="remove_button"]');
        if ($removeBtn.length) $removeBtn.trigger('mousedown');
      }
    });
  }

  // --- Load Data ---
  function loadData() {
    var rawData = (S.$dataField.val() || '').trim();
    var rawMeta = (S.$metaField.val() || '').trim();
    var rawActivity = S.$activityField ? (S.$activityField.val() || '').trim() : '';
    if (rawData) { try { S.data = JSON.parse(rawData); } catch (e) { console.error('[VPM] Data parse error:', e); } }
    if (rawMeta) { try { S.meta = JSON.parse(rawMeta); } catch (e) { console.error('[VPM] Meta parse error:', e); } }
    if (rawActivity) { try { S.activity = JSON.parse(rawActivity); } catch (e) { console.error('[VPM] Activity parse error:', e); } }
    if (!Array.isArray(S.activity)) S.activity = [];
  }

  // --- Migrate Data ---
  function migrateData() {
    var def = getDefaultData();
    S.data.start = $.extend(true, {}, def.start, S.data.start || {});
    S.data.video = $.extend(true, {}, def.video, S.data.video || {});
    S.data.research = $.extend(true, {}, def.research, S.data.research || {});
    S.data.blueprint = $.extend(true, {}, def.blueprint, S.data.blueprint || {});
    S.data.script = $.extend(true, {}, def.script, S.data.script || {});
    S.data.publishing = $.extend(true, {}, def.publishing, S.data.publishing || {});
    S.data.thumbnails = $.extend(true, {}, def.thumbnails, S.data.thumbnails || {});
    if (!Array.isArray(S.data.clips)) S.data.clips = [];

    // Migrate audio mode: old 'ai-generated' → new 'ai-audio-with-video'
    var _prefs = S.data.start.preferences || {};
    if (_prefs.audio_mode === 'ai-generated') _prefs.audio_mode = 'ai-audio-with-video';
    if (_prefs.audio_mode === 'voiceover') _prefs.audio_mode = 'ai-voice-separate';
    // Ensure new preference fields exist
    if (!_prefs.platforms) _prefs.platforms = _prefs.platform ? [_prefs.platform] : ['youtube'];
    if (!_prefs.voice_profile) _prefs.voice_profile = { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' };
    if (!_prefs.video_style) _prefs.video_style = '';
    if (!_prefs.selected_video_models) _prefs.selected_video_models = [];
    if (!_prefs.selected_image_models) _prefs.selected_image_models = [];
    if (_prefs.primary_video_model === undefined) _prefs.primary_video_model = '';
    if (_prefs.primary_image_model === undefined) _prefs.primary_image_model = '';
    // Ensure brand_selections
    if (!S.data.start.brand_selections) S.data.start.brand_selections = { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false };

    // Determine mode from persisted start data
    S.mode = (S.data.start && S.data.start.mode) || 'advanced';

    // Ensure script sections exist
    if (!S.data.script.sections) S.data.script.sections = [];
    if (!S.data.script.versions) S.data.script.versions = [];

    // Ensure all clips have required fields
    var clips = S.data.clips;
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      if (!c.id) c.id = generateId('clip');
      if (c.order === undefined) c.order = i + 1;
      if (!c.section) c.section = 'body';
      if (!c.track) { var ct = CLIP_TYPES[c.type] || {}; c.track = ct.track || 'ai'; }
      if (!c.status) c.status = (c.track === 'ai') ? 'draft' : (c.track === 'non-ai') ? 'planned' : 'pending';
      if (!c.timing) c.timing = { start: 0, end: c.duration || 8 };
      if (c.track === 'ai') {
        if (!c.prompt_set) c.prompt_set = createEmptyPromptSet(c.type);
        if (!c.prompt_set.first_frame) c.prompt_set.first_frame = _createEmptyFrame();
        var needsLast = (CLIP_TYPES[c.type] || {}).defaultLastFrame;
        if (needsLast && !c.prompt_set.last_frame) c.prompt_set.last_frame = _createEmptyFrame();
        if (!c.prompt_set.video) c.prompt_set.video = { prompt: createEmptyPrompt(), marked_done: false, done_at: null, notes: '' };
      }
      if (c.track === 'non-ai' && !c.non_ai_planning) c.non_ai_planning = createDefaultNonAiPlanning();
      if (!c.production_config) c.production_config = { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true };
      if (c.production_config && c.production_config.audio_mode === 'ai-generated') c.production_config.audio_mode = 'ai-audio-with-video';
    }
    if (!S.data.video.created) S.data.video.created = new Date().toISOString();
  }

  function migrateMeta() {
    var def = getDefaultMeta();
    S.meta.settings = $.extend(true, {}, def.settings, S.meta.settings || {});
    S.meta.aiPreferences = $.extend(true, {}, def.aiPreferences, S.meta.aiPreferences || {});
    if (!S.meta.lookLibrary) S.meta.lookLibrary = [];
    // Ensure voice_profile on all look library entries
    for (var _vli = 0; _vli < (S.meta.lookLibrary || []).length; _vli++) {
      if (!S.meta.lookLibrary[_vli].voice_profile) S.meta.lookLibrary[_vli].voice_profile = { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' };
    }
    if (!S.meta.environmentLibrary) S.meta.environmentLibrary = [];
    if (!S.meta.sceneLibrary) S.meta.sceneLibrary = [];
    if (!S.meta.brandOverrides) S.meta.brandOverrides = {};
    if (!S.meta.studioRequirements) S.meta.studioRequirements = {};

    // Migrate deprecated model IDs
    var _modelFixes = {
      'gemini-2.5-pro-preview-06-05': 'gemini-2.5-pro',
      'gemini-2.5-flash-preview-05-20': 'gemini-2.5-flash',
      'gemini-2.5-pro-preview-03-25': 'gemini-2.5-pro',
      'gemini-2.5-flash-preview-04-17': 'gemini-2.5-flash'
    };
    function _fixModel(obj, key) {
      if (obj && obj[key] && _modelFixes[obj[key]]) { obj[key] = _modelFixes[obj[key]]; }
    }
    var ap = S.meta.aiPreferences || {};
    _fixModel(ap, 'lastModel');
    if (ap.appDefault) _fixModel(ap.appDefault, 'model');
    if (ap.perAction) { for (var ak in ap.perAction) { if (ap.perAction[ak]) _fixModel(ap.perAction[ak], 'model'); } }
  }

  // --- Parse Brand Data ---
  function parseBrandData() {
    var $bd = $('.brand-data');
    if (!$bd.length) return;
    S.brand.configured = true;
    S.brand.identity = {
      name: $bd.find('.brand-name').text().trim(),
      id: $bd.find('.brand-id').text().trim(),
      logoUrl: $bd.find('.brand-logo-url').text().trim()
    };
    function _parseBrandJSON(selector) {
      var $el = $bd.find(selector);
      if (!$el.length) return null;
      try { return JSON.parse($el.text().trim()); } catch (e) { return null; }
    }
    S.brand.core = _parseBrandJSON('.brand-core-data');
    S.brand.video = _parseBrandJSON('.brand-video-data');
    S.brand.content = _parseBrandJSON('.brand-content-data');
  }


  // ============================================================
  // SECTION 4: BRAND STUDIO LIBRARY PARSER
  // ============================================================

  function parseBrandStudioLibrary() {
    S.brandStudio = { characters: [], outfits: [], looks: [], environments: [], scenes: [], collections: [], loaded: false };
    var $lib = $('.brand-studio-library');
    if (!$lib.length) {
      console.log('[VPM] No .brand-studio-library found on page');
      return;
    }
    function _parseLibJSON(selector) {
      var $el = $lib.find(selector);
      if (!$el.length) {
        // Try parsing the entire library as a single JSON blob
        return [];
      }
      try {
        var arr = JSON.parse($el.text().trim());
        if (!Array.isArray(arr)) return [];
        for (var i = 0; i < arr.length; i++) arr[i].source = 'brand';
        return arr;
      } catch (e) { return []; }
    }

    // Try structured sub-divs first
    S.brandStudio.characters = _parseLibJSON('.brand-studio-characters');
    S.brandStudio.outfits = _parseLibJSON('.brand-studio-outfits');
    S.brandStudio.looks = _parseLibJSON('.brand-studio-looks');
    S.brandStudio.environments = _parseLibJSON('.brand-studio-environments');
    S.brandStudio.scenes = _parseLibJSON('.brand-studio-scenes');
    S.brandStudio.collections = _parseLibJSON('.brand-studio-collections');

    // Fallback: try parsing entire div as single JSON export
    if (!S.brandStudio.looks.length && !S.brandStudio.environments.length) {
      try {
        var raw = JSON.parse($lib.text().trim());
        if (raw) {
          function _markBrand(arr) { if (!arr) return []; for (var i = 0; i < arr.length; i++) arr[i].source = 'brand'; return arr; }
          if (raw.characters) S.brandStudio.characters = _markBrand(raw.characters);
          if (raw.outfits) S.brandStudio.outfits = _markBrand(raw.outfits);
          if (raw.looks) S.brandStudio.looks = _markBrand(raw.looks);
          if (raw.environments) S.brandStudio.environments = _markBrand(raw.environments);
          if (raw.scenes) S.brandStudio.scenes = _markBrand(raw.scenes);
          if (raw.collections) S.brandStudio.collections = _markBrand(raw.collections);
          if (raw.brand) S.brandStudio.brandInfo = raw.brand;
        }
      } catch (e) { /* not a single JSON blob */ }
    }

    S.brandStudio.loaded = true;
    console.log('[VPM] Brand Studio: ' + S.brandStudio.characters.length + ' chars, ' + S.brandStudio.outfits.length + ' outfits, ' + S.brandStudio.looks.length + ' looks, ' + S.brandStudio.environments.length + ' envs, ' + S.brandStudio.scenes.length + ' scenes, ' + S.brandStudio.collections.length + ' collections');
  }

  // Observe for dynamically loaded brand studio library (Drupal AJAX)
  function _observeBrandStudioLibrary() {
    if (S.brandStudio.loaded && S.brandStudio.looks.length) return;
    try {
      var _bsObserver = new MutationObserver(function() {
        if (S.brandStudio.loaded && S.brandStudio.looks.length) { _bsObserver.disconnect(); return; }
        var $lib = $('.brand-studio-library');
        if ($lib.length) {
          _bsObserver.disconnect();
          parseBrandStudioLibrary();
          buildMaps();
          if (S.initialized) renderApp();
          console.log('[VPM] Brand Studio loaded via observer');
        }
      });
      _bsObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(function() { _bsObserver.disconnect(); }, 30000);
    } catch (e) { console.warn('[VPM] Brand studio observer failed:', e); }
    // Fallback retry after 3s
    if (!S.brandStudio.loaded || !S.brandStudio.looks.length) {
      setTimeout(function() {
        if (!S.brandStudio.loaded || !S.brandStudio.looks.length) {
          parseBrandStudioLibrary();
          if (S.brandStudio.loaded && S.brandStudio.looks.length) { buildMaps(); if (S.initialized) renderApp(); }
        }
      }, 3000);
    }
  }


  // ============================================================
  // SECTION 5: MAP BUILDERS & STATUS ENGINE
  // ============================================================

  function buildMaps() {
    // --- Clip maps ---
    S.clipMap = {}; S.clipsByType = {}; S.clipsByTrack = { ai: [], 'non-ai': [], template: [] }; S.clipsBySection = {}; S.clipsByStatus = {};
    var clips = S.data.clips || [];
    var stats = { total: clips.length, totalAI: 0, totalNonAI: 0, totalTemplate: 0, aiDone: 0, nonAiDone: 0, templateDone: 0, withScenes: 0, withFramesDone: 0, withPrompts: 0, withVideoPrompts: 0 };

    for (var ci = 0; ci < clips.length; ci++) {
      var c = clips[ci];
      S.clipMap[c.id] = c;
      S.clipsByType[c.type] = S.clipsByType[c.type] || []; S.clipsByType[c.type].push(c);
      var track = c.track || (CLIP_TYPES[c.type] || {}).track || 'ai';
      S.clipsByTrack[track] = S.clipsByTrack[track] || []; S.clipsByTrack[track].push(c);
      S.clipsBySection[c.section] = S.clipsBySection[c.section] || []; S.clipsBySection[c.section].push(c);
      S.clipsByStatus[c.status] = S.clipsByStatus[c.status] || []; S.clipsByStatus[c.status].push(c);

      if (track === 'ai') {
        stats.totalAI++;
        if (c.status === 'done' || c.status === 'video-ready') stats.aiDone++;
        var ps = c.prompt_set || {};
        var ff = ps.first_frame || {};
        if (ff.scene && (ff.scene.environment_id || (ff.scene.look_ids && ff.scene.look_ids.length))) stats.withScenes++;
        if (ff.marked_done) stats.withFramesDone++;
        if (ff.prompt && ff.prompt.status === 'generated') stats.withPrompts++;
        if (ps.video && ps.video.prompt && ps.video.prompt.status === 'generated') stats.withVideoPrompts++;
      } else if (track === 'non-ai') {
        stats.totalNonAI++;
        if (c.status === 'done' || c.status === 'recorded' || (c.non_ai_planning && c.non_ai_planning.marked_done)) stats.nonAiDone++;
      } else {
        stats.totalTemplate++;
        if (c.status === 'applied' || c.template_id) stats.templateDone++;
      }
    }
    S.clipStats = stats;

    // --- Entity maps ---
    S.lookMap = {}; S.envMap = {}; S.sceneMap = {};
    var _buildMap = function(arr, map) { for (var i = 0; i < arr.length; i++) if (arr[i].id) map[arr[i].id] = arr[i]; };
    _buildMap(S.meta.lookLibrary || [], S.lookMap);
    _buildMap(S.meta.environmentLibrary || [], S.envMap);
    _buildMap(S.meta.sceneLibrary || [], S.sceneMap);

    // Combined pools (brand studio + video custom), filtered by brand selections
    var _bs = ((S.data.start || {}).brand_selections || {});
    var _selLooks = _bs.selected_look_ids || [];
    var _selEnvs = _bs.selected_environment_ids || [];
    var _selScenes = _bs.selected_scene_ids || [];
    var _filterArr = function(arr, ids) { return ids.length ? arr.filter(function(x) { return ids.indexOf(x.id) >= 0; }) : arr; };
    var _useBrand = !S.data.start || S.data.start.use_brand_library !== false;
    if (_useBrand) {
      S.allLooks = _filterArr(S.brandStudio.looks || [], _selLooks).concat(S.meta.lookLibrary || []);
      S.allEnvironments = _filterArr(S.brandStudio.environments || [], _selEnvs).concat(S.meta.environmentLibrary || []);
      S.allScenes = _filterArr(S.brandStudio.scenes || [], _selScenes).concat(S.meta.sceneLibrary || []);
      // Add brand studio entities to maps
      _buildMap(S.brandStudio.looks || [], S.lookMap);
      _buildMap(S.brandStudio.environments || [], S.envMap);
      _buildMap(S.brandStudio.scenes || [], S.sceneMap);
    } else {
      S.allLooks = (S.meta.lookLibrary || []).slice();
      S.allEnvironments = (S.meta.environmentLibrary || []).slice();
      S.allScenes = (S.meta.sceneLibrary || []).slice();
    }

    // --- Studio requirements analysis ---
    computeStudioRequirements();

    // --- Completion flags ---
    computeFlags();
    S.computedStatus = calculateVideoStatus();

    // Recompute script durations
    recomputeScriptDurations();
    recomputeClipTimings();
  }

  function computeStudioRequirements() {
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return (c.track || (CLIP_TYPES[c.type] || {}).track) === 'ai'; });
    var reqs = {
      existing_looks: (S.allLooks || []).length, existing_envs: (S.allEnvironments || []).length, existing_scenes: (S.allScenes || []).length,
      clips_needing_look: [], clips_needing_env: [], unassigned_clips: [],
      look_usage: {}, env_usage: {}, scene_usage: {}
    };
    for (var i = 0; i < aiClips.length; i++) {
      var c = aiClips[i];
      var scene = (((c.prompt_set || {}).first_frame || {}).scene || {});
      var hasLook = scene.look_ids && scene.look_ids.length > 0;
      var hasEnv = !!scene.environment_id;
      var hasScene = !!scene.scene_template_id;
      if (c.type === 'ai-character' && !hasLook) reqs.clips_needing_look.push(c.id);
      if (!hasEnv && !hasScene) reqs.clips_needing_env.push(c.id);
      if (!hasScene && !hasLook && !hasEnv) reqs.unassigned_clips.push(c.id);
      // Track usage
      if (hasLook) { for (var li = 0; li < scene.look_ids.length; li++) { var lid = scene.look_ids[li]; reqs.look_usage[lid] = reqs.look_usage[lid] || []; reqs.look_usage[lid].push(c.id); } }
      if (hasEnv) { reqs.env_usage[scene.environment_id] = reqs.env_usage[scene.environment_id] || []; reqs.env_usage[scene.environment_id].push(c.id); }
      if (hasScene) { reqs.scene_usage[scene.scene_template_id] = reqs.scene_usage[scene.scene_template_id] || []; reqs.scene_usage[scene.scene_template_id].push(c.id); }
    }
    S.studioReqs = reqs;
  }

  function computeFlags() {
    var d = S.data;

    // Start
    S.startComplete = !!(d.start && d.start.processed);

    // Research (Advanced only)
    S.researchComplete = !!(d.research && d.research.generated);

    // Blueprint
    var bp = d.blueprint || {};
    S.blueprintComplete = !!(bp.confirmed);

    // Script
    var sc = d.script || {};
    var sections = sc.sections || [];
    var totalContent = 0;
    for (var i = 0; i < sections.length; i++) {
      totalContent += (sections[i].content ? stripHtml(sections[i].content).trim().length : 0);
    }
    S.scriptReady = sections.length >= 1 && totalContent >= 20;
    S.scriptFinalized = !!sc.finalized;

    // Studio (Advanced only)
    var sr = S.meta.studioRequirements || {};
    if (sr.total_needed && sr.total_needed > 0) {
      S.studioReady = (sr.total_draft || 0) === 0;
    } else {
      S.studioReady = (S.allLooks.length > 0 || S.allEnvironments.length > 0);
    }

    // Clips
    var clips = d.clips || [];
    S.clipsReady = clips.length >= 2;
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    S.productionComplete = clips.length > 0 && done >= clips.length;

    // Publish
    var yt = (d.publishing && d.publishing.youtube) || {};
    S.publishReady = !!(yt.title && yt.description);
    S.exported = !!(d.publishing && d.publishing.export_history && d.publishing.export_history.length > 0);
  }

  function calculateVideoStatus() {
    if (S.exported) return 'published';
    if (S.productionComplete) return 'production-done';
    if (S.clipsReady) return 'in-production';
    if (S.studioReady && S.mode === 'advanced') return 'studio-ready';
    if (S.scriptFinalized) return 'script-final';
    if (S.scriptReady) return 'script-draft';
    if (S.blueprintComplete) return 'blueprint-done';
    if (S.researchComplete && S.mode === 'advanced') return 'research-done';
    if (S.startComplete) return 'idea-ready';
    return 'new';
  }

  function recomputeClipTimings() {
    var clips = S.data.clips || [], offset = 0;
    for (var i = 0; i < clips.length; i++) {
      clips[i].order = i + 1;
      clips[i].timing = { start: offset, end: offset + (clips[i].duration || 8) };
      offset += (clips[i].duration || 8);
    }
  }

  function recomputeScriptDurations() {
    var sc = S.data.script || {};
    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var totalWords = 0, totalDuration = 0;
    var sections = sc.sections || [];
    for (var i = 0; i < sections.length; i++) {
      sections[i].word_count = countWords(sections[i].content || '');
      sections[i].estimated_duration = Math.ceil((sections[i].word_count / wpm) * 60);
      totalWords += sections[i].word_count;
      totalDuration += sections[i].estimated_duration;
    }
    sc.total_word_count = totalWords;
    sc.estimated_duration = totalDuration;
  }

  function evaluateClipStatus(clip) {
    if (!clip) return clip ? clip.status : 'draft';
    var ct = CLIP_TYPES[clip.type] || {};
    var track = clip.track || ct.track || 'ai';
    if (track === 'ai') {
      var ps = clip.prompt_set || {};
      // Model-aware gen mode default (so Seedance clips default to ingredients-to-video)
      var _evPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _evModelDefaultGm = (VIDEO_MODELS[_evPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _gm = ((ps.video || {}).gen_mode || _evModelDefaultGm);
      var _needsFrames = (_gm === 'frames-to-video');
      if (ps.video && ps.video.marked_done) return 'done';
      if (ps.video && ps.video.prompt && ps.video.prompt.status === 'generated') return 'video-ready';
      if (_needsFrames) {
        if (ps.requires_last_frame && ps.last_frame && ps.last_frame.marked_done) return 'last-frame-ready';
        if (ps.first_frame && ps.first_frame.marked_done) return 'first-frame-ready';
      }
      var ff = ps.first_frame || {};
      // scene-set: check both seedance_assets (new) and first_frame.scene (frames-to-video)
      var _sa = (ps.video || {}).seedance_assets || {};
      var _saSet = _sa.character_look_id || ((_sa.env_ids || []).some(function(id) { return !!id; }));
      if (_saSet || (ff.scene && (ff.scene.scene_template_id || ff.scene.environment_id || (ff.scene.look_ids && ff.scene.look_ids.length)))) return 'scene-set';
      if (clip.script_text && clip.script_text.trim().length > 5) return 'script-ready';
      return 'draft';
    } else if (track === 'non-ai') {
      if (clip.non_ai_planning && clip.non_ai_planning.marked_done) return 'done';
      if (clip.non_ai_planning && clip.non_ai_planning.recording_ref) return 'recorded';
      if (clip.non_ai_planning && (clip.non_ai_planning.brief || clip.non_ai_planning.instructions)) return 'in-progress';
      return 'planned';
    } else {
      return clip.template_id ? 'applied' : 'pending';
    }
  }

  function maybeAdvanceClipStatus(clip, reason) {
    if (!clip) return;
    var newStatus = evaluateClipStatus(clip);
    if (newStatus !== clip.status) {
      var ct = CLIP_TYPES[clip.type] || {};
      var track = clip.track || ct.track || 'ai';
      var statusMap = (track === 'ai') ? AI_CLIP_STATUSES : (track === 'non-ai') ? NON_AI_CLIP_STATUSES : TEMPLATE_CLIP_STATUSES;
      var curOrder = (statusMap[clip.status] || {}).order || 0;
      var newOrder = (statusMap[newStatus] || {}).order || 0;
      var direction = newOrder > curOrder ? 'advanced' : 'regressed';
      clip.status = newStatus;
      console.log('[VPM] Clip ' + clip.order + ' status ' + direction + ' to: ' + clip.status + ' (' + (reason || '') + ')');
    }
  }


  // ============================================================
  // SECTION 6: STAGE NAVIGATION
  // ============================================================

  function getStageOrder() {
    return S.mode === 'standard' ? STAGE_ORDER_STANDARD : STAGE_ORDER_ADVANCED;
  }

  function navigateToStage(stageId) {
    if (!APP_STAGES[stageId] && !UTILITY_VIEWS[stageId]) return;
    // Check if stage is available in current mode
    var stageOrder = getStageOrder();
    if (APP_STAGES[stageId] && stageOrder.indexOf(stageId) === -1 && !UTILITY_VIEWS[stageId]) {
      toast('Not available in ' + S.mode + ' mode', 'warning');
      return;
    }

    // Soft prerequisite warnings (don't block, just inform)
    var access = canAccessStage(stageId);
    if (access.warning && stageId !== S.currentStage) {
      toast(access.warning, 'info');
    }

    S.previousStage = S.currentStage;
    S.currentStage = stageId;

    // Reset sub-state for clips
    if (stageId === 'clips' && !S.selectedClipId && S.data.clips && S.data.clips.length > 0) {
      S.selectedClipId = S.data.clips[0].id;
      var firstClip = S.data.clips[0];
      var firstTrack = firstClip.track || (CLIP_TYPES[firstClip.type] || {}).track || 'ai';
      S.currentClipDetailTab = firstTrack === 'ai' ? 'script-config' : firstTrack === 'non-ai' ? 'planning' : 'template';
    }

    // Render content + sidebar
    render();
    window.scrollTo(0, 0);
  }

  function _refreshSidebarNav() {
    var $sidebar = $('#vpmSidebar');
    if (!$sidebar.length) return;
    var stageOrder = getStageOrder();
    var collapsed = S.sidebarCollapsed;
    // Update collapsed class
    $sidebar.toggleClass('vpm-sidebar-collapsed', !!collapsed);
    // Update collapse button icon
    $sidebar.find('.vpm-sidebar-collapse-btn').attr('title', collapsed ? 'Expand' : 'Collapse').html(icon(collapsed ? 'chevron-right' : 'chevron-left'));
    // Rebuild nav content
    var $nav = $sidebar.find('.vpm-nav');
    if (!$nav.length) return;
    var html = '<div class="vpm-nav-label"><span class="vpm-nav-label-text">STAGES</span></div>';
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else html += '<span class="vpm-nav-step">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(stage.label) + '</div>';
      html += '<div class="vpm-nav-desc' + (isActive ? ' vpm-nav-desc-active' : '') + '">' + esc(stage.description) + '</div>';
      if (!isDone && !isFuture && progress > 0) {
        html += '<div class="vpm-nav-progress"><div class="vpm-nav-progress-fill" style="width:' + progress + '%"></div></div>';
      }
      html += '</div></button>';
    }
    html += '<div class="vpm-nav-divider"></div><div class="vpm-nav-label"><span class="vpm-nav-label-text">VIEWS</span></div>';
    for (var uid in UTILITY_VIEWS) {
      var uv = UTILITY_VIEWS[uid];
      html += '<button class="vpm-nav-item vpm-nav-util' + (S.currentStage === uid ? ' vpm-nav-active' : '') + '" data-action="navigate" data-stage="' + uid + '" title="' + esc(uv.label) + '"><div class="vpm-nav-dot vpm-nav-dot-util">' + icon(uv.icon) + '</div><div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(uv.label) + '</div></div></button>';
    }
    $nav.html(html);
  }

  function canAccessStage(stageId) {
    var stageOrder = getStageOrder();
    if (stageOrder.indexOf(stageId) === -1 && !UTILITY_VIEWS[stageId]) return { allowed: false, warning: 'Not available in ' + S.mode + ' mode' };
    switch (stageId) {
      case 'research':   return { allowed: true, warning: S.startComplete ? '' : 'Start stage not complete' };
      case 'blueprint':  return { allowed: true, warning: S.startComplete ? '' : 'Start stage not complete' };
      case 'script':     return { allowed: true, warning: S.blueprintComplete ? '' : 'Blueprint not confirmed' };
      case 'studio':     return { allowed: true, warning: S.scriptFinalized ? '' : 'Script not finalized' };
      case 'clips':      return { allowed: true, warning: S.scriptReady ? '' : 'Script needs content' };
      case 'publish':    return { allowed: true, warning: S.clipsReady ? '' : 'Create clips first' };
    }
    return { allowed: true, warning: '' };
  }

  function getStageStatus(stageId) {
    if (isStageComplete(stageId)) return 'complete';
    var stageOrder = getStageOrder();
    if (S.currentStage === stageId) return 'current';
    var idx = stageOrder.indexOf(stageId);
    var currentIdx = stageOrder.indexOf(S.currentStage);
    if (idx >= 0 && currentIdx >= 0 && idx < currentIdx) return 'in-progress';
    return 'not-started';
  }

  function isStageComplete(stageId) {
    switch (stageId) {
      case 'start':     return S.startComplete;
      case 'research':  return S.researchComplete;
      case 'blueprint': return S.blueprintComplete;
      case 'script':    return S.scriptFinalized;
      case 'studio':    return S.studioReady;
      case 'clips':     return S.productionComplete;
      case 'publish':   return S.exported;
    }
    return false;
  }

  function getStageProgress(stageId) {
    switch (stageId) {
      case 'start':     return S.startComplete ? 100 : 0;
      case 'research':  return S.researchComplete ? 100 : 0;
      case 'blueprint': return S.blueprintComplete ? 100 : 0;
      case 'script': {
        var secs = (S.data.script || {}).sections || [];
        if (!secs.length) return 0;
        var filled = 0;
        for (var si = 0; si < secs.length; si++) { if (secs[si].content && stripHtml(secs[si].content).trim().length > 10) filled++; }
        return Math.round((filled / secs.length) * 100);
      }
      case 'studio':    return S.studioReady ? 100 : (S.allLooks.length > 0 ? 50 : 0);
      case 'clips': {
        var st = S.clipStats;
        var total = st.total || 1;
        var done = st.aiDone + st.nonAiDone + st.templateDone;
        return Math.round((done / total) * 100);
      }
      case 'publish':   return S.exported ? 100 : S.publishReady ? 75 : 0;
    }
    return 0;
  }


  // ============================================================
  // SECTION 7: UTILITIES
  // ============================================================

  function esc(str) { if (!str) return ''; var el = document.createElement('span'); el.textContent = str; return el.innerHTML; }
  function truncate(str, len) { if (!str || str.length <= len) return str || ''; return str.substring(0, len) + '\u2026'; }
  function stripHtml(html) { if (!html) return ''; var tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }
  function countWords(html) { var text = stripHtml(html).trim(); if (!text) return 0; return text.split(/\s+/).length; }
  function formatDuration(seconds) { if (!seconds || seconds <= 0) return '0s'; if (seconds < 60) return seconds + 's'; var m = Math.floor(seconds / 60); var s = seconds % 60; return m + 'm' + (s > 0 ? ' ' + s + 's' : ''); }
  function formatDurationLong(seconds) { if (!seconds || seconds <= 0) return '0 seconds'; if (seconds < 60) return seconds + ' second' + (seconds !== 1 ? 's' : ''); var m = Math.floor(seconds / 60); var s = seconds % 60; return m + ' minute' + (m !== 1 ? 's' : '') + (s > 0 ? ' ' + s + 's' : ''); }
  function formatDate(iso) { if (!iso) return '\u2014'; try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } }
  function formatRelativeTime(iso) { if (!iso) return ''; var diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000); if (diff < 60) return 'just now'; if (diff < 3600) return Math.floor(diff / 60) + 'm ago'; if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'; return Math.floor(diff / 86400) + 'd ago'; }
  function formatNumber(n) { if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return (n / 1000).toFixed(1) + 'K'; return String(n); }
  function estimateDurationFromWords(wordCount, wpm) { return Math.ceil((wordCount / (wpm || 150)) * 60); }
  function getMaxWordsForDuration(seconds, wpm) { return Math.floor(((seconds || 60) / 60) * (wpm || 150)); }
  function getClipScriptOverflow(clip) {
    if (!clip || !clip.script_text) return null;
    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var maxWords = getMaxWordsForDuration(clip.duration || 8, wpm);
    var actualWords = countWords(clip.script_text);
    if (actualWords <= maxWords) return null;
    return { actualWords: actualWords, maxWords: maxWords, overflowWords: actualWords - maxWords, duration: clip.duration || 8, wpm: wpm };
  }

  // --- Duration control utilities ---
  function getSmartClipDuration(clipType) {
    var ct = CLIP_TYPES[clipType] || {};
    if (ct.track === 'ai') {
      var modelId = (S.meta && S.meta.aiPreferences) ? S.meta.aiPreferences.videoModel : '';
      var cfg = getModelDurationConfig(modelId);
      if (cfg.defaultDuration) return cfg.defaultDuration;
    }
    return ct.defaultDuration || 8;
  }

  function getModelDurationConfig(modelId) {
    var model = VIDEO_MODELS[modelId || ''];
    if (!model) { for (var k in VIDEO_MODELS) { if (VIDEO_MODELS[k].isDefault) { model = VIDEO_MODELS[k]; modelId = k; break; } } }
    if (!model) return { defaultDuration: 8, minDuration: 2, maxDuration: 120, durations: [], durationStep: 1, notes: '' };
    var overrides = (S.meta && S.meta.settings && S.meta.settings.video_model_overrides) ? S.meta.settings.video_model_overrides[modelId] : null;
    return {
      id: modelId, label: model.label || modelId,
      defaultDuration: (overrides && overrides.defaultDuration) || model.defaultDuration || 8,
      minDuration: (overrides && overrides.minDuration) || model.minDuration || 2,
      maxDuration: (overrides && overrides.maxDuration) || model.maxDuration || 120,
      durations: model.durations || [], durationStep: model.durationStep || 1, notes: model.notes || ''
    };
  }

  function snapToModelDuration(duration, modelId) {
    var cfg = getModelDurationConfig(modelId);
    return Math.max(cfg.minDuration, Math.min(cfg.maxDuration, Math.round(duration)));
  }

  function validateClipDuration(clip) {
    var ct = CLIP_TYPES[clip.type] || {};
    if (ct.track !== 'ai') return { valid: true, warning: '', snapped: clip.duration || 0 };
    var modelId = (clip.prompt_set && clip.prompt_set.video && clip.prompt_set.video.prompt) ? clip.prompt_set.video.prompt.model : ((S.meta && S.meta.aiPreferences) ? S.meta.aiPreferences.videoModel : '');
    var dur = clip.duration || 8;
    var cfg = getModelDurationConfig(modelId);
    var snapped = snapToModelDuration(dur, modelId);
    if (dur < cfg.minDuration) {
      return { valid: false, warning: dur + 's below minimum ' + cfg.minDuration + 's for ' + cfg.label, snapped: cfg.minDuration, model: cfg.label };
    }
    if (dur > cfg.maxDuration) {
      return { valid: false, warning: dur + 's exceeds maximum ' + cfg.maxDuration + 's for ' + cfg.label, snapped: cfg.maxDuration, model: cfg.label };
    }
    return { valid: true, warning: '', snapped: dur, model: cfg.label };
  }

  // --- Icon helper ---
  function icon(name, className) {
    className = className || '';
    var icons = {
      'search':'fa-magnifying-glass','magnifying-glass':'fa-magnifying-glass','lightbulb':'fa-lightbulb','file-lines':'fa-file-lines',
      'sparkles':'fa-sparkles','download':'fa-download','upload':'fa-upload','cloud-arrow-up':'fa-cloud-arrow-up','hand-pointer':'fa-hand-pointer',
      'circle':'fa-circle','circle-check':'fa-circle-check','check':'fa-check','loader':'fa-spinner fa-spin',
      'film':'fa-film','image':'fa-image','images':'fa-images',
      'pen':'fa-pen','pencil':'fa-pencil','trash':'fa-trash-can','copy':'fa-copy','plus':'fa-plus','xmark':'fa-xmark',
      'chevron-down':'fa-chevron-down','chevron-right':'fa-chevron-right','chevron-left':'fa-chevron-left','chevron-up':'fa-chevron-up','arrow-right':'fa-arrow-right','arrow-left':'fa-arrow-left',
      'clock':'fa-clock','clock-rotate-left':'fa-clock-rotate-left','bullseye':'fa-bullseye',
      'bolt':'fa-bolt','play':'fa-play','circle-stop':'fa-circle-stop','gear':'fa-gear','gears':'fa-gears','sliders':'fa-sliders',
      'info':'fa-circle-info','circle-info':'fa-circle-info','warning':'fa-triangle-exclamation','circle-exclamation':'fa-circle-exclamation',
      'star':'fa-star','video':'fa-video','camera':'fa-camera','globe':'fa-globe','link':'fa-link',
      'users':'fa-users','user':'fa-user','user-tie':'fa-user-tie','user-check':'fa-user-check',
      'eye':'fa-eye','eye-slash':'fa-eye-slash','list':'fa-list','bars':'fa-bars',
      'palette':'fa-palette','wand-magic-sparkles':'fa-wand-magic-sparkles','arrows-rotate':'fa-arrows-rotate',
      'layer-group':'fa-layer-group','lock':'fa-lock','share-nodes':'fa-share-nodes','tags':'fa-tags',
      'briefcase':'fa-briefcase','clipboard-list':'fa-clipboard-list','scissors':'fa-scissors','fire':'fa-fire',
      'building':'fa-building','panorama':'fa-panorama',
      'microphone-lines':'fa-microphone-lines','volume-xmark':'fa-volume-xmark',
      'clapperboard':'fa-clapperboard','rocket':'fa-rocket','compass-drafting':'fa-compass-drafting',
      'chart-bar':'fa-chart-bar','desktop':'fa-desktop','heading':'fa-heading','bookmark':'fa-bookmark',
      'spinner':'fa-spinner','floppy-disk':'fa-floppy-disk',
      'crown':'fa-crown','face-smile':'fa-face-smile','mug-saucer':'fa-mug-saucer',
      'person-walking':'fa-person-walking','seedling':'fa-seedling','plane':'fa-plane',
      'youtube':'fa-youtube','instagram':'fa-instagram','facebook':'fa-facebook','linkedin':'fa-linkedin',
      'microchip':'fa-microchip','robot':'fa-robot','code':'fa-code',
      'mobile':'fa-mobile-screen-button','square':'fa-square',
      'grip-vertical':'fa-grip-vertical','align-left':'fa-align-left'
    };
    var faClass = icons[name] || 'fa-' + name;
    return '<i class="fas ' + faClass + (className ? ' ' + className : '') + ' vpm-icon"></i>';
  }

  function generateId(prefix) { return prefix + '_' + Math.random().toString(36).substr(2, 8); }

  // --- Robust AI Response Parser ---
  // Handles: markdown blocks, text wrapping, trailing commas, single quotes,
  // escaped newlines, multiple objects, string-aware brace matching
  function parseAIResponse(text) {
    if (!text || typeof text !== 'string') return null;
    // Step 1: Strip markdown code blocks
    var cleaned = text.replace(/```(?:json|JSON|js|javascript)?\s*\n?/gi, '').replace(/```\s*/g, '').trim();
    // Step 2: Direct parse (happy path)
    try { return JSON.parse(cleaned); } catch (e) {}
    // Step 3: Fix common LLM JSON errors and retry
    var fixed = _fixLLMJson(cleaned);
    try { return JSON.parse(fixed); } catch (e) {}
    // Step 4: String-aware extraction — find first { or [ respecting quoted strings
    var extracted = _extractJsonBlock(cleaned);
    if (extracted) {
      try { return JSON.parse(extracted); } catch (e) {}
      var fixedExtracted = _fixLLMJson(extracted);
      try { return JSON.parse(fixedExtracted); } catch (e) {}
    }
    // Step 5: Last resort — try to find any JSON-like substring
    var lastResort = _lastResortExtract(cleaned);
    if (lastResort) { try { return JSON.parse(lastResort); } catch (e) {} }
    console.warn('[VPM] parseAIResponse failed. Raw text:', text.substring(0, 500));
    return null;
  }

  function _fixLLMJson(s) {
    // Fix trailing commas: ,] or ,}
    s = s.replace(/,(\s*[\]}])/g, '$1');
    // Fix single quotes around keys/values (simple cases)
    s = s.replace(/(['"])?(\w+)(['"])?\s*:\s*'([^']*)'/g, '"$2": "$4"');
    // Fix unquoted keys: { key: "value" } → { "key": "value" }
    s = s.replace(/{\s*(\w+)\s*:/g, '{"$1":');
    s = s.replace(/,\s*(\w+)\s*:/g, ',"$1":');
    // Fix escaped newlines inside strings (literal \n not \\n)
    s = s.replace(/\n/g, '\\n');
    // Fix control characters
    s = s.replace(/[\x00-\x1F\x7F]/g, function(c) { return c === '\n' || c === '\r' || c === '\t' ? c : ''; });
    return s;
  }

  function _extractJsonBlock(text) {
    // Find first { or [ that starts a JSON block, respecting quoted strings
    var firstBrace = -1, firstBracket = -1;
    var inStr = false, escape = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '{' && firstBrace < 0) firstBrace = i;
      if (ch === '[' && firstBracket < 0) firstBracket = i;
      if (firstBrace >= 0 && firstBracket >= 0) break;
    }
    var start = -1;
    if (firstBrace >= 0 && (firstBracket < 0 || firstBrace < firstBracket)) start = firstBrace;
    else if (firstBracket >= 0) start = firstBracket;
    if (start < 0) return null;
    // String-aware brace matching
    var open = text[start], close = open === '{' ? '}' : ']';
    var depth = 0; inStr = false; escape = false;
    for (var j = start; j < text.length; j++) {
      var c = text[j];
      if (escape) { escape = false; continue; }
      if (c === '\\') { escape = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === open) depth++;
      if (c === close) { depth--; if (depth === 0) return text.substring(start, j + 1); }
    }
    return null;
  }

  function _lastResortExtract(text) {
    // Try regex to find {...} or [...] patterns
    var m = text.match(/(\{[\s\S]*\})/);
    if (m) { var fixed = _fixLLMJson(m[1]); try { JSON.parse(fixed); return fixed; } catch(e) {} }
    m = text.match(/(\[[\s\S]*\])/);
    if (m) { var fixed2 = _fixLLMJson(m[1]); try { JSON.parse(fixed2); return fixed2; } catch(e) {} }
    return null;
  }

  // Keep legacy name as alias for backward compat
  function parseJSON(text) { return parseAIResponse(text); }
  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function isEmpty(obj) { return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0); }
  function debounce(fn, delay) { var t; return function() { var c = this, a = arguments; clearTimeout(t); t = setTimeout(function() { fn.apply(c, a); }, delay); }; }

  function logActivity(type, description) {
    S.activity.unshift({ id: generateId('act'), type: type, description: description, timestamp: new Date().toISOString(), user_id: S.user.id || '0', user_name: S.user.name || 'system' });
    if (S.activity.length > 200) S.activity = S.activity.slice(0, 200);
  }
  function getFilteredActivity() {
    var list = S.activity || [], f = S.activityFilter;
    if (f.type) list = list.filter(function(a) { return a.type === f.type; });
    if (f.search) { var q = f.search.toLowerCase(); list = list.filter(function(a) { return (a.description || '').toLowerCase().indexOf(q) > -1; }); }
    return list;
  }

  // --- Badges ---
  function badge(text, bg, fg) { fg = fg || bg; return '<span class="vpm-badge" style="background:' + bg + '15;color:' + fg + '">' + esc(text) + '</span>'; }
  function statusBadge(status) { var c = VIDEO_STATUSES[status] || { label: status, color: '#6b7280', icon: 'circle' }; return '<span class="vpm-status-badge"><span class="vpm-status-dot" style="background:' + c.color + '"></span>' + esc(c.label) + '</span>'; }
  function clipTypeBadge(clipType) { var ct = CLIP_TYPES[clipType] || { label: clipType, icon: 'film', color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + ct.color + '15;color:' + ct.color + '">' + icon(ct.icon) + ' ' + esc(ct.label) + '</span>'; }
  function trackBadge(track) { var tc = { ai: { l: 'AI', c: '#7c3aed', i: 'robot' }, 'non-ai': { l: 'Non-AI', c: '#e37400', i: 'camera' }, template: { l: 'Template', c: '#9ca3af', i: 'copy' } }; var t = tc[track] || tc.ai; return '<span class="vpm-badge" style="background:' + t.c + '15;color:' + t.c + '">' + icon(t.i) + ' ' + esc(t.l) + '</span>'; }
  function clipStatusBadge(status, track) { var sm = (track === 'non-ai') ? NON_AI_CLIP_STATUSES : (track === 'template') ? TEMPLATE_CLIP_STATUSES : AI_CLIP_STATUSES; var cs = sm[status] || { label: status, color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + cs.color + '15;color:' + cs.color + '">' + esc(cs.label) + '</span>'; }
  function sourceBadge(source) { return source === 'brand' ? '<span class="vpm-source-badge vpm-source-brand">' + icon('building') + ' Brand</span>' : '<span class="vpm-source-badge vpm-source-video">' + icon('video') + ' Custom</span>'; }
  function roleBadge(roleId) { var r = LOOK_ROLES[roleId] || { label: roleId, color: '#6b7280' }; return '<span class="vpm-badge" style="background:' + r.color + '15;color:' + r.color + '">' + esc(r.label) + '</span>'; }
  function progressBar(pct, color) { color = color || 'var(--vpm-primary)'; return '<div class="vpm-progress-bar"><div class="vpm-progress-fill" style="width:' + pct + '%;background:' + color + '"></div></div>'; }
  function _getEntityPrimaryImage(entity) { if (!entity || !entity.reference_images) return ''; for (var i = 0; i < entity.reference_images.length; i++) { if (entity.reference_images[i].url) return entity.reference_images[i].url; } return entity.thumbnail_url || ''; }


  // ============================================================
  // SECTION 8: APP SHELL
  // ============================================================

  function _recalcToolbarHeight() {
    var toolbarH = 0; var $tb = $('#toolbar-bar');
    if ($tb.length) { toolbarH = $tb.outerHeight() || 0; var $tray = $('#toolbar-tray-horizontal'); if ($tray.length && $tray.is(':visible')) toolbarH += $tray.outerHeight() || 0; }
    document.documentElement.style.setProperty('--vpm-drupal-toolbar', toolbarH + 'px');
  }

  function renderApp() {
    _recalcToolbarHeight();
    $('body').addClass('vpm-active');
    var $formParent = S.$form.closest('.layout-region-node-main, .node-form');
    $formParent.hide();
    $('#vpmApp').remove();
    var $app = $('<div id="vpmApp" class="vpm-app"></div>');
    $formParent.before($app);
    $app.html(renderAppShell());
    renderCurrentView();
    $(document).off('click.vpm1-toolbar').on('click.vpm1-toolbar', '#toolbar-bar .toolbar-tab a, .toolbar-toggle-orientation button', function() {
      setTimeout(_recalcToolbarHeight, 300);
    });
  }

  function renderAppShell() {
    return renderHeader() + '<div class="vpm-body">' + renderSidebar() + '<div class="vpm-main"><div class="vpm-content" id="vpmContent"></div></div></div><div id="vpmToasts" class="vpm-toast-container"></div>';
  }

  function renderHeader() {
    var v = S.data.video || {};
    var stageOrder = getStageOrder();
    var html = '<div class="vpm-header"><div class="vpm-header-left">';
    html += '<button class="vpm-btn-icon vpm-sidebar-toggle" id="vpmSidebarToggle">' + icon('bars') + '</button>';
    html += '<div class="vpm-header-brand">' + icon('film') + ' <span class="vpm-header-title">VPM</span></div>';
    // Mode badge
    html += '<span class="vpm-mode-badge vpm-mode-' + S.mode + '">' + (S.mode === 'standard' ? 'Standard' : 'Advanced') + ' \u00B7 ' + stageOrder.length + ' stages</span>';
    html += '</div><div class="vpm-header-center">';
    if (v.title) html += '<span class="vpm-header-project">' + esc(truncate(v.title, 50)) + '</span>';
    html += '</div><div class="vpm-header-right">' + statusBadge(S.computedStatus);
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" id="vpmSaveNodeBtn">' + icon('floppy-disk') + ' Save</button>';
    html += '<span class="vpm-last-saved" id="vpmLastSaved">' + (S.lastSaved ? icon('circle-check') + ' ' + formatRelativeTime(S.lastSaved) : '') + '</span>';
    html += '</div></div>';
    return html;
  }

  function renderSidebar() {
    var stageOrder = getStageOrder();
    var collapsed = S.sidebarCollapsed;
    // Overlay is OUTSIDE sidebar as a sibling
    var html = '<div id="vpmSidebarOverlay" class="vpm-sidebar-overlay' + (S.sidebarHidden ? '' : ' vpm-sidebar-overlay-visible') + '"></div>';
    html += '<div class="vpm-sidebar' + (S.sidebarHidden ? ' vpm-sidebar-hidden' : '') + (collapsed ? ' vpm-sidebar-collapsed' : '') + '" id="vpmSidebar">';
    // Sidebar header with collapse toggle
    html += '<div class="vpm-sidebar-header">';
    html += '<div class="vpm-sidebar-brand">' + icon('film') + '<span class="vpm-sidebar-brand-text">VPM</span></div>';
    html += '<button class="vpm-sidebar-collapse-btn" data-action="toggle-sidebar-collapse" title="' + (collapsed ? 'Expand' : 'Collapse') + '">' + icon(collapsed ? 'chevron-right' : 'chevron-left') + '</button>';
    html += '</div>';
    html += '<nav class="vpm-nav">';
    html += '<div class="vpm-nav-label"><span class="vpm-nav-label-text">STAGES</span></div>';
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else html += '<span class="vpm-nav-step">' + (si + 1) + '</span>';
      html += '</div>';
      html += '<div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(stage.label) + '</div>';
      html += '<div class="vpm-nav-desc' + (isActive ? ' vpm-nav-desc-active' : '') + '">' + esc(stage.description) + '</div>';
      // Progress bar (only for non-complete, non-future stages)
      if (!isDone && !isFuture && progress > 0) {
        html += '<div class="vpm-nav-progress"><div class="vpm-nav-progress-fill" style="width:' + progress + '%"></div></div>';
      }
      html += '</div></button>';
    }
    html += '<div class="vpm-nav-divider"></div><div class="vpm-nav-label"><span class="vpm-nav-label-text">VIEWS</span></div>';
    for (var uid in UTILITY_VIEWS) {
      var uv = UTILITY_VIEWS[uid];
      html += '<button class="vpm-nav-item vpm-nav-util' + (S.currentStage === uid ? ' vpm-nav-active' : '') + '" data-action="navigate" data-stage="' + uid + '" title="' + esc(uv.label) + '"><div class="vpm-nav-dot vpm-nav-dot-util">' + icon(uv.icon) + '</div><div class="vpm-nav-text"><div class="vpm-nav-name">' + esc(uv.label) + '</div></div></button>';
    }
    html += '</nav><div class="vpm-sidebar-footer"><span class="vpm-sidebar-footer-text">VPM v1.0</span></div></div>';
    return html;
  }

  function renderCurrentView() {
    var $c = $('#vpmContent');
    if (!$c.length) return;
    try { $(document).trigger('vpm:beforeRender', [S.currentStage]); } catch (e) {}
    var R = window._vpmRenderers, html = '';
    try {
      switch (S.currentStage) {
        case 'start':     html = (R.startFull)     ? R.startFull()     : renderStartCompact(); break;
        case 'research':  html = (R.researchFull)  ? R.researchFull()  : renderResearchCompact(); break;
        case 'blueprint': html = (R.blueprintFull) ? R.blueprintFull() : renderBlueprintCompact(); break;
        case 'script':    html = (R.scriptFull)    ? R.scriptFull()    : renderScriptCompact(); break;
        case 'studio':    html = (R.studioFull)    ? R.studioFull()    : renderStudioCompact(); break;
        case 'clips':     html = (R.clipsFull)     ? R.clipsFull()     : renderClipsCompact(); break;
        case 'publish':   html = (R.publishFull)   ? R.publishFull()   : renderPublishCompact(); break;
        case 'activity':  html = (R.activityFull)  ? R.activityFull()  : renderActivityView(); break;
        case 'settings':  html = (R.settingsFull)  ? R.settingsFull()  : renderSettingsPlaceholder(); break;
        default: html = renderStartCompact();
      }
    } catch (e) {
      console.error('[VPM] Render error on "' + S.currentStage + '":', e.message, e.stack);
      html = '<div class="vpm-view" style="padding:40px"><div class="vpm-panel" style="border-color:var(--vpm-error)"><h3>Render Error</h3><p>' + esc(e.message) + '</p><pre style="font-size:11px;overflow:auto;max-height:200px">' + esc(e.stack || '') + '</pre></div></div>';
    }
    // Fade transition: quick opacity swap
    if (S.previousStage && S.previousStage !== S.currentStage) {
      $c.css({ opacity: 0, transform: 'translateY(6px)' });
      $c.html(html);
      setTimeout(function() { $c.css({ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.2s ease, transform 0.2s ease' }); }, 20);
      // Reset transition after animation
      setTimeout(function() { $c.css({ transition: '' }); }, 250);
    } else {
      $c.html(html);
    }
    $(document).trigger('vpm:afterRender', [S.currentStage]);
    _updateLastSaved();
  }

  function render() { _refreshSidebarNav(); renderCurrentView(); }


  // ============================================================
  // SECTION 9: COMPACT VIEW RENDERERS (Fallbacks for Part 2A)
  // ============================================================

  function _viewHeader(iconName, title, subtitle) {
    return '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon(iconName) + ' ' + esc(title) + '</h2>' + (subtitle ? '<p class="vpm-view-subtitle">' + esc(subtitle) + '</p>' : '') + '</div></div>';
  }
  function _emptyHero(iconName, title, desc, ctaHtml) {
    return '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon(iconName) + '</div><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' + (ctaHtml || '') + '</div>';
  }

  // S9: Start
  function renderStartCompact() {
    var html = _viewHeader('rocket', 'Start', 'Configure your video project');
    if (S.startComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Idea processed. Mode: <strong>' + S.mode + '</strong></p></div>';
    } else {
      html += _emptyHero('rocket', 'Start Your Video', 'Choose your mode, set preferences, and describe your video idea.', '<button class="vpm-btn vpm-btn-primary" data-action="navigate" data-stage="start">Get Started</button>');
    }
    html += renderNavButtons(null, 'Continue to ' + (S.mode === 'advanced' ? 'Research' : 'Blueprint'), S.mode === 'advanced' ? 'research' : 'blueprint');
    html += '</div>';
    return html;
  }

  // S10: Research
  function renderResearchCompact() {
    var html = _viewHeader('magnifying-glass', 'Research', 'AI-powered content research');
    if (S.researchComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Research complete</p></div>';
    } else {
      html += _emptyHero('magnifying-glass', 'Research Your Topic', 'AI analyzes your topic for audience insights, competitor gaps, and trending angles.');
    }
    html += renderNavButtons('Start', 'Continue to Blueprint', 'blueprint') + '</div>';
    return html;
  }

  // S11: Blueprint
  function renderBlueprintCompact() {
    var bp = S.data.blueprint || {};
    var html = _viewHeader('compass-drafting', 'Blueprint', 'Video plan & section structure');
    if (S.blueprintComplete) {
      html += '<div class="vpm-panel"><p class="vpm-text-success">' + icon('circle-check') + ' Blueprint confirmed</p>';
      if (bp.title) html += '<p><strong>' + esc(bp.title) + '</strong></p>';
      var secs = bp.sections || [];
      if (secs.length) { html += '<div class="vpm-text-sm vpm-text-muted">' + secs.length + ' sections</div>'; }
      html += '</div>';
    } else {
      html += _emptyHero('compass-drafting', 'Plan Your Video', 'Define sections, timing, and structure before writing the script.');
    }
    var prev = S.mode === 'advanced' ? 'Research' : 'Start';
    html += renderNavButtons(prev, 'Continue to Script', 'script') + '</div>';
    return html;
  }

  // S12: Script
  function renderScriptCompact() {
    var sc = S.data.script || {};
    var secs = sc.sections || [];
    var html = _viewHeader('file-lines', 'Script', 'Write content section by section');
    html += '<div class="vpm-panel">';
    if (S.scriptFinalized) {
      html += '<p class="vpm-text-success">' + icon('lock') + ' Script finalized \u2014 ' + (sc.total_word_count || 0) + ' words, ~' + formatDuration(sc.estimated_duration || 0) + '</p>';
    } else if (secs.length) {
      html += '<p>' + secs.length + ' sections \u00B7 ' + (sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</p>';
    } else {
      html += _emptyHero('file-lines', 'Write Your Script', 'Sections from your Blueprint appear here as editors. Use AI to generate content.');
    }
    html += '</div>';
    var next = S.mode === 'advanced' ? 'Continue to Studio' : 'Continue to Clips';
    var nextStage = S.mode === 'advanced' ? 'studio' : 'clips';
    html += renderNavButtons('Blueprint', next, nextStage) + '</div>';
    return html;
  }

  // S13: Studio
  function renderStudioCompact() {
    var html = _viewHeader('palette', 'Studio', 'Looks, environments & scenes');
    html += '<div class="vpm-panel"><div class="vpm-flex-row" style="gap:16px;flex-wrap:wrap">';
    html += '<div>' + icon('user-check') + ' <strong>' + S.allLooks.length + '</strong> Looks</div>';
    html += '<div>' + icon('panorama') + ' <strong>' + S.allEnvironments.length + '</strong> Environments</div>';
    html += '<div>' + icon('image') + ' <strong>' + S.allScenes.length + '</strong> Scenes</div>';
    html += '</div></div>';
    html += renderNavButtons('Script', 'Continue to Clips', 'clips') + '</div>';
    return html;
  }

  // S14: Clips
  function renderClipsCompact() {
    var clips = S.data.clips || [];
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    var html = _viewHeader('film', 'Clips', done + '/' + clips.length + ' clips complete');
    if (clips.length) {
      html += '<div class="vpm-panel">';
      html += '<div class="vpm-flex-row" style="gap:8px;margin-bottom:8px">' + trackBadge('ai') + ' ' + S.clipStats.totalAI + ' &nbsp;' + trackBadge('non-ai') + ' ' + S.clipStats.totalNonAI + ' &nbsp;' + trackBadge('template') + ' ' + S.clipStats.totalTemplate + '</div>';
      html += renderTimelineBar(clips);
      html += progressBar(Math.round((done / Math.max(clips.length, 1)) * 100));
      html += '</div>';
    } else {
      html += _emptyHero('film', 'Create Clips', 'AI breaks your script into clips. Each clip becomes a production task.');
    }
    var prev = S.mode === 'advanced' ? 'Studio' : 'Script';
    html += renderNavButtons(prev, 'Continue to Publish', 'publish') + '</div>';
    return html;
  }

  // S15: Publish
  function renderPublishCompact() {
    var yt = (S.data.publishing || {}).youtube || {};
    var html = _viewHeader('share-nodes', 'Publish', 'Metadata, thumbnails & export');
    html += '<div class="vpm-panel">';
    if (yt.title) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><div class="vpm-input-display">' + esc(yt.title) + '</div></div>';
    }
    html += '</div>';
    html += '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('download') + ' Export</h3><div class="vpm-export-btns">';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="export-json">' + icon('download') + ' JSON</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-script">' + icon('file-lines') + ' Script</button>';
    html += '</div></div>';
    html += renderNavButtons('Clips', null) + '</div>';
    return html;
  }

  // S16: Activity
  function renderActivityView() {
    var list = getFilteredActivity();
    var html = _viewHeader('clock-rotate-left', 'Activity', (S.activity || []).length + ' entries');
    html += '<div class="vpm-panel vpm-panel-sm"><div class="vpm-flex-row"><input class="vpm-input vpm-input-sm" data-action="filter-activity" placeholder="Search\u2026" value="' + esc(S.activityFilter.search || '') + '">';
    html += '<select class="vpm-select vpm-select-sm" data-action="filter-activity-type"><option value="">All</option>';
    for (var atId in ACTIVITY_TYPES) html += '<option value="' + atId + '"' + (S.activityFilter.type === atId ? ' selected' : '') + '>' + esc(ACTIVITY_TYPES[atId].label) + '</option>';
    html += '</select></div></div><div class="vpm-panel" style="padding:0">';
    if (!list.length) html += _emptyHero('clock-rotate-left', 'No Activity Yet', 'Actions will appear here as you work.');
    for (var ai = 0; ai < Math.min(list.length, 50); ai++) {
      var act = list[ai], at = ACTIVITY_TYPES[act.type] || { label: act.type, icon: 'circle' };
      html += '<div class="vpm-activity-item"><div class="vpm-activity-icon">' + icon(at.icon) + '</div><div class="vpm-activity-content"><div class="vpm-activity-desc">' + esc(act.description) + '</div><div class="vpm-activity-meta">' + esc(formatRelativeTime(act.timestamp)) + (act.user_name ? ' \u00B7 ' + esc(act.user_name) : '') + '</div></div></div>';
    }
    html += '</div></div>';
    return html;
  }

  // S17: Settings placeholder
  function renderSettingsPlaceholder() {
    return '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('gear') + ' Settings</h2></div></div><div class="vpm-panel"><div class="vpm-empty-state">' + icon('loader') + ' Loading\u2026</div></div></div>';
  }


  // ============================================================
  // SECTION 10: SHARED VIEW HELPERS
  // ============================================================

  function renderNavButtons(prevLabel, nextLabel, nextStage) {
    var stageOrder = getStageOrder();
    var curIdx = stageOrder.indexOf(S.currentStage);
    var html = '<div class="vpm-nav-buttons">';
    // Previous
    if (prevLabel) {
      var ps = curIdx > 0 ? stageOrder[curIdx - 1] : '';
      // Auto-resolve label from stage name if just a stage key
      var prevDisplay = prevLabel;
      if (APP_STAGES[prevLabel]) prevDisplay = APP_STAGES[prevLabel].label;
      html += '<button class="vpm-btn vpm-btn-outline" data-action="navigate" data-stage="' + ps + '">' + icon('arrow-left') + ' ' + esc(prevDisplay) + '</button>';
    }
    html += '<div class="vpm-nav-spacer"></div>';
    // Next
    if (nextLabel) {
      if (!nextStage) { if (curIdx < stageOrder.length - 1) nextStage = stageOrder[curIdx + 1]; }
      var access = nextStage ? canAccessStage(nextStage) : { allowed: true, warning: '' };
      var hasWarning = !!(access.warning);
      html += '<button class="vpm-btn vpm-btn-primary" data-action="navigate" data-stage="' + (nextStage || '') + '"' + (hasWarning ? ' title="' + esc(access.warning) + '"' : '') + '>' + esc(nextLabel) + ' ' + icon('arrow-right') + '</button>';
    }
    html += '</div>';
    return html;
  }

  function renderClipList(clips, selectedId) {
    var html = '<div class="vpm-clip-list">';
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i], ct = CLIP_TYPES[c.type] || {}, track = c.track || ct.track || 'ai', isA = c.id === selectedId;
      html += '<button class="vpm-clip-list-item' + (isA ? ' vpm-clip-list-active' : '') + '" data-action="select-clip" data-clip-id="' + c.id + '">';
      html += '<span class="vpm-clip-order">#' + c.order + '</span>';
      html += '<div class="vpm-clip-status-dot" style="background:' + _csColor(c.status, track) + '"></div>';
      html += '<div class="vpm-clip-list-info"><div class="vpm-clip-list-title">' + esc(truncate(c.title || 'Untitled', 28)) + '</div><div class="vpm-clip-list-meta">' + clipTypeBadge(c.type) + '</div></div>';
      html += '<span class="vpm-clip-list-dur">' + (c.duration || 0) + 's</span></button>';
    }
    html += '</div>';
    return html;
  }

  function renderClipCard(clip) {
    var ct = CLIP_TYPES[clip.type] || {}, track = clip.track || ct.track || 'ai';
    var prereqs = getClipPrerequisites(clip);
    var hasErr = prereqs.some(function(p) { return p.severity === 'error'; });
    var hasWarn = !hasErr && prereqs.some(function(p) { return p.severity === 'warning'; });
    return '<div class="vpm-clip-card"><span class="vpm-clip-card-order">#' + clip.order + '</span>' + clipTypeBadge(clip.type) + '<span class="vpm-clip-card-title">' + esc(truncate(clip.title || 'Untitled', 40)) + '</span>' + trackBadge(track) + '<span class="vpm-clip-card-dur">' + (clip.duration || 0) + 's</span>' + (hasErr ? '<span class="vpm-prereq-dot vpm-prereq-dot-err" title="Missing prerequisites">' + icon('triangle-exclamation') + '</span>' : hasWarn ? '<span class="vpm-prereq-dot vpm-prereq-dot-warn" title="Missing setup">' + icon('circle-exclamation') + '</span>' : '') + '</div>';
  }

  function renderTimelineBar(clips) {
    if (!clips || !clips.length) return '';
    var html = '<div class="vpm-timeline-bar">';
    for (var i = 0; i < clips.length; i++) {
      var ct = CLIP_TYPES[clips[i].type] || {};
      var trackColor = ct.track === 'ai' ? '#7c3aed' : ct.track === 'non-ai' ? '#e37400' : '#9ca3af';
      html += '<div class="vpm-timeline-segment" data-action="timeline-select-clip" data-clip-id="' + clips[i].id + '" style="flex:' + (clips[i].duration || 1) + ';background:' + trackColor + '" title="#' + clips[i].order + ' ' + esc(clips[i].title || '') + ' (' + (clips[i].duration || 0) + 's)"></div>';
    }
    html += '</div>';
    return html;
  }

  function renderProductionProgress() {
    var st = S.clipStats, d = st.aiDone + st.nonAiDone + st.templateDone, t = st.total || 1;
    return '<div class="vpm-production-progress">' + progressBar(Math.round((d / t) * 100)) + '<div class="vpm-flex-between vpm-mt-xs"><span class="vpm-text-sm vpm-text-muted">' + d + ' done</span><span class="vpm-text-sm vpm-text-muted">' + Math.round((d / t) * 100) + '%</span></div></div>';
  }

  function _csColor(status, track) { var sm = (track === 'non-ai') ? NON_AI_CLIP_STATUSES : (track === 'template') ? TEMPLATE_CLIP_STATUSES : AI_CLIP_STATUSES; return (sm[status] || {}).color || '#9ca3af'; }


  // ============================================================
  // SECTION 11: EVENT HANDLERS
  // ============================================================

  function setupEventHandlers() {
    // Navigation
    $(document).off('click.vpm1-nav').on('click.vpm1-nav', '[data-action="navigate"]', function() { var s = $(this).data('stage'); if (s) navigateToStage(s); });
    // Sidebar collapse toggle (desktop icon-rail mode)
    $(document).off('click.vpm1-collapse').on('click.vpm1-collapse', '[data-action="toggle-sidebar-collapse"]', function() {
      S.sidebarCollapsed = !S.sidebarCollapsed;
      $('#vpmSidebar').toggleClass('vpm-sidebar-collapsed', S.sidebarCollapsed);
      // Update chevron icon
      $(this).attr('title', S.sidebarCollapsed ? 'Expand' : 'Collapse').html(icon(S.sidebarCollapsed ? 'chevron-right' : 'chevron-left'));
    });
    // Sidebar mobile toggle (hamburger)
    $(document).off('click.vpm1-toggle').on('click.vpm1-toggle', '#vpmSidebarToggle', function() {
      S.sidebarHidden = !S.sidebarHidden;
      $('#vpmSidebar').toggleClass('vpm-sidebar-hidden', S.sidebarHidden);
      $('#vpmSidebarOverlay').toggleClass('vpm-sidebar-overlay-visible', !S.sidebarHidden);
    });
    $(document).off('click.vpm1-overlay').on('click.vpm1-overlay', '#vpmSidebarOverlay', function() {
      S.sidebarHidden = true;
      $('#vpmSidebar').addClass('vpm-sidebar-hidden');
      $('#vpmSidebarOverlay').removeClass('vpm-sidebar-overlay-visible');
    });
    // Save
    $(document).off('click.vpm1-save').on('click.vpm1-save', '#vpmSaveNodeBtn', function() { triggerDrupalSave(); });
    // Clip selection
    $(document).off('click.vpm1-clip-sel').on('click.vpm1-clip-sel', '[data-action="select-clip"]', function() {
      var cid = $(this).data('clip-id'); if (!cid) return;
      S.selectedClipId = cid;
      var cl = S.clipMap[cid]; if (cl) { var tr = cl.track || (CLIP_TYPES[cl.type] || {}).track || 'ai'; S.currentClipDetailTab = tr === 'ai' ? 'script-config' : tr === 'non-ai' ? 'planning' : 'template'; }
      renderCurrentView();
    });
    // Timeline click
    $(document).off('click.vpm1-tl-sel').on('click.vpm1-tl-sel', '[data-action="timeline-select-clip"]', function() {
      var cid = $(this).data('clip-id'); if (!cid || !S.clipMap[cid]) return;
      S.selectedClipId = cid;
      var cl = S.clipMap[cid]; var tr = cl.track || (CLIP_TYPES[cl.type] || {}).track || 'ai';
      S.currentClipDetailTab = tr === 'ai' ? 'script-config' : tr === 'non-ai' ? 'planning' : 'template';
      navigateToStage('clips');
    });
    // Activity filter
    $(document).off('input.vpm1-act-search').on('input.vpm1-act-search', '[data-action="filter-activity"]', debounce(function() { S.activityFilter.search = $(this).val(); renderCurrentView(); }, 300));
    $(document).off('change.vpm1-act-type').on('change.vpm1-act-type', '[data-action="filter-activity-type"]', function() { S.activityFilter.type = $(this).val(); renderCurrentView(); });
  }

  function _setNested(obj, path, value) { var p = path.split('.'), t = obj; for (var i = 0; i < p.length - 1; i++) { if (!t[p[i]] || typeof t[p[i]] !== 'object') t[p[i]] = {}; t = t[p[i]]; } t[p[p.length - 1]] = value; }


  // ============================================================
  // SECTION 12: SYNC, SAVE & AUTO-SAVE
  // ============================================================

  function syncToTextarea() {
    if (!S.$dataField || !S.$dataField.length) return;
    S.data.video.modified = new Date().toISOString();
    S.$dataField.val(JSON.stringify(S.data));
    S.$metaField.val(JSON.stringify(S.meta));
    if (S.$activityField && S.$activityField.length) S.$activityField.val(JSON.stringify(S.activity));
    S.dirty = true;
  }

  function triggerDrupalSave() {
    syncToTextarea();
    if (S.$submitBtn && S.$submitBtn.length) {
      S.$submitBtn.click();
      S.dirty = false;
      S.lastSaved = new Date().toISOString();
      _updateLastSaved();
    }
  }

  function startAutoSave() {
    if (S.autoSaveTimer) clearInterval(S.autoSaveTimer);
    S.autoSaveTimer = setInterval(function() {
      if (S.dirty) { syncToTextarea(); }
      _updateLastSaved();
    }, 30000);
  }

  function _updateLastSaved() {
    var $el = $('#vpmLastSaved');
    if (!$el.length) return;
    if (S.lastSaved) $el.html(icon('circle-check') + ' ' + formatRelativeTime(S.lastSaved));
    else if (S.dirty) $el.html(icon('circle') + ' Unsaved');
  }

  // Undo/redo placeholder — wired up in Part 2A
  function snapshot(label) { /* Part 2A provides real implementation */ }


  // ============================================================
  // SECTION 13: TOAST NOTIFICATIONS
  // ============================================================

  function toast(message, type, duration) {
    type = type || 'info';
    // Type-specific durations: errors/warnings longer, success/info shorter
    if (!duration) {
      switch (type) {
        case 'error':   duration = 6000; break;
        case 'warning': duration = 5000; break;
        case 'success': duration = 3000; break;
        default:        duration = 3500;
      }
    }
    var $c = $('#vpmToasts'); if (!$c.length) return;
    // Max stack: remove oldest if > 4
    var $existing = $c.children('.vpm-toast');
    if ($existing.length >= 4) $existing.first().remove();
    var im = { success: 'circle-check', error: 'circle-exclamation', warning: 'warning', info: 'circle-info' };
    var $t = $('<div class="vpm-toast vpm-toast-' + type + '"><span class="vpm-toast-icon">' + icon(im[type] || 'circle-info') + '</span><span class="vpm-toast-msg">' + esc(message) + '</span><button class="vpm-toast-close">' + icon('xmark') + '</button></div>');
    $t.find('.vpm-toast-close').on('click', function() { $t.removeClass('vpm-toast-show'); setTimeout(function() { $t.remove(); }, 300); });
    $c.append($t);
    setTimeout(function() { $t.addClass('vpm-toast-show'); }, 10);
    setTimeout(function() { $t.removeClass('vpm-toast-show'); setTimeout(function() { $t.remove(); }, 300); }, duration);
  }


  // ============================================================
  // SECTION 14: FACTORY FUNCTIONS
  // ============================================================

  function getDefaultData() {
    return {
      start: {
        mode: 'advanced', raw_input: '',
        preferences: {
          language: 'english', audio_mode: 'ai-audio-with-video', platform: 'youtube', platforms: ['youtube'],
          aspect_ratio: '16:9', target_duration: 120, production_mode: 'full-ai', presenter_preference: 'ai-only',
          video_style: '', voice_profile: { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' },
          selected_video_models: [], selected_image_models: [], primary_video_model: '', primary_image_model: ''
        },
        llm_response: '', processed: false, processed_at: '', import_source: null, selected_clip_types: [],
        brand_selections: { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false }
      },
      video: { title: '', description: '', target_audience: '', tone: '', language: '', platform: 'youtube', aspect_ratio: '16:9', duration_target: 0, production_mode: '', presenter_preference: '', video_style: '', keywords: [], created: '', modified: '' },
      research: { audience_insights: '', competitor_analysis: '', trending_angles: '', content_strategy: '', sources: [], generated: false, generated_at: '' },
      blueprint: { title: '', description: '', sections: [], style_notes: '', tone: '', target_audience: '', confirmed: false, confirmed_at: '' },
      script: { sections: [], total_word_count: 0, estimated_duration: 0, finalized: false, finalized_at: '', versions: [] },
      clips: [],
      publishing: {
        youtube: { title: '', title_options: [], description: '', tags: [], hashtags: [], category: 'education', chapters: [], thumbnail_text: '', thumbnail_url: '', visibility: 'public', premiere_scheduled: '' },
        instagram: { caption: '', hashtags: [], cover_frame_clip: '' },
        tiktok: { caption: '', hashtags: [] },
        linkedin: { post_text: '' },
        derivatives: [], content: { blog_post: '', social_posts: [], thumbnail_brief: '' }, export_history: []
      },
      thumbnails: { ideas: [], selected_idea_id: '', chat_history: [], finalized_prompt: null, generated_at: '' }
    };
  }

  function getDefaultMeta() {
    return {
      settings: { words_per_minute: 150, default_clip_duration: 8, default_clip_type: 'ai-visual', default_language: 'english', default_tone: 'friendly', default_aspect_ratio: '16:9', default_platform: 'youtube', default_production_mode: 'full-ai', default_presenter: 'ai-only', default_audio_mode: 'ai-audio-with-video', show_ai_preflight: true, ai_global_instructions: '', strict_ai_duration: true, snap_to_model_durations: true, video_model_overrides: {}, app_version: '1.0.0' },
      aiPreferences: { appDefault: { provider: 'gemini', model: 'gemini-2.5-flash' }, lastProvider: '', lastModel: '', imageModel: 'imagen-3', videoModel: 'seedance', globalNegative: 'watermark, text overlay, logo, low quality, blurry, distorted, cartoon, anime', perAction: {}, lastCustomInstructions: {} },
      lookLibrary: [], environmentLibrary: [], sceneLibrary: [],
      brandOverrides: { enabled: false, name: '', tagline: '', primary_color: '', secondary_color: '', accent_color: '', voice: '', target_audience: '', logo_url: '', font_family: '' },
      studioRequirements: {}
    };
  }

  function createDefaultClip(type, section) {
    var ct = CLIP_TYPES[type] || CLIP_TYPES['ai-visual'];
    var track = ct.track || 'ai';
    var dur = getSmartClipDuration(type);
    var clip = { id: generateId('clip'), order: (S.data.clips || []).length + 1, title: '', type: type, section: section || 'body', track: track, script_text: '', onscreen_text: '', visual_direction: '', delivery_notes: '', notes: '', duration: dur, timing: { start: 0, end: dur }, status: track === 'ai' ? 'draft' : track === 'non-ai' ? 'planned' : 'pending', production_config: { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true } };
    if (track === 'ai') clip.prompt_set = createEmptyPromptSet(type);
    if (track === 'non-ai') clip.non_ai_planning = createDefaultNonAiPlanning();
    if (track === 'template') clip.template_id = '';
    return clip;
  }

  // Lightweight clip — ONLY wireframe fields, no prompt_set/non_ai_planning/production_config
  // Used for AI clip generation; heavy structures created lazily via ensure*()
  function createLightweightClip(type, section, order) {
    var ct = CLIP_TYPES[type] || CLIP_TYPES['ai-visual'];
    var track = ct.track || 'ai';
    var dur = getSmartClipDuration(type);
    return {
      id: generateId('clip'), order: order || 1, title: '', type: type,
      section: section || 'body', track: track, script_text: '', onscreen_text: '',
      visual_direction: '', delivery_notes: '', notes: '', duration: dur,
      timing: { start: 0, end: dur },
      status: track === 'ai' ? 'draft' : track === 'non-ai' ? 'planned' : 'pending'
    };
  }

  // Lazy-ensure: creates prompt_set on-demand when user opens AI clip detail
  function ensurePromptSet(clip) {
    if (clip.prompt_set) return clip.prompt_set;
    clip.prompt_set = createEmptyPromptSet(clip.type);
    return clip.prompt_set;
  }

  // Lazy-ensure: creates non_ai_planning on-demand when user opens Non-AI clip detail
  function ensureNonAiPlanning(clip) {
    if (clip.non_ai_planning) return clip.non_ai_planning;
    clip.non_ai_planning = createDefaultNonAiPlanning();
    return clip.non_ai_planning;
  }

  // Lazy-ensure: creates production_config on-demand when user edits production settings
  function ensureProductionConfig(clip) {
    if (clip.production_config) return clip.production_config;
    clip.production_config = { audio_mode: 'ai-audio-with-video', motion_strength: 'medium', camera_movement: 'slow-zoom', transition_style: 'smooth-dissolve', custom_notes: '', _inherited: true };
    return clip.production_config;
  }

  // Normalize clip type: maps fuzzy LLM output to valid CLIP_TYPES key
  function normalizeClipType(raw) {
    if (!raw) return 'ai-visual';
    var t = raw.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (CLIP_TYPES[t]) return t;
    // Fuzzy map
    var map = {
      'visual': 'ai-visual', 'ai': 'ai-visual', 'aivisual': 'ai-visual', 'broll': 'ai-broll', 'b-roll': 'ai-broll',
      'character': 'ai-character', 'aicharacter': 'ai-character', 'presenter': 'human-presenter',
      'human': 'human-presenter', 'humanpresenter': 'human-presenter', 'talking-head': 'human-presenter',
      'screen': 'screen-recording', 'screenrecording': 'screen-recording', 'recording': 'screen-recording',
      'screenwithcam': 'screen-with-cam', 'screen-with-camera': 'screen-with-cam',
      'intro': 'branded-intro', 'brandedintro': 'branded-intro',
      'outro': 'branded-outro', 'brandedoutro': 'branded-outro',
      'chapter': 'chapter-title', 'chaptertitle': 'chapter-title', 'title': 'chapter-title',
      'text': 'text-card', 'textcard': 'text-card', 'card': 'text-card'
    };
    if (map[t]) return map[t];
    // Partial match: check if raw contains a known type key
    for (var k in CLIP_TYPES) {
      if (t.indexOf(k.replace(/-/g, '')) >= 0 || k.replace(/-/g, '').indexOf(t) >= 0) return k;
    }
    return 'ai-visual';
  }

  // Resolve section ID from fuzzy LLM output against blueprint sections
  function resolveSectionId(raw) {
    if (!raw) return 'body';
    var sections = ((S.data.blueprint || {}).sections || []);
    if (!sections.length) return raw || 'body';
    // Exact match by id
    for (var i = 0; i < sections.length; i++) { if (sections[i].id === raw) return raw; }
    // Match by label (case-insensitive)
    var lower = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (var j = 0; j < sections.length; j++) {
      var secLower = (sections[j].label || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (secLower === lower) return sections[j].id;
    }
    // Partial match (label contains raw or vice versa)
    for (var k = 0; k < sections.length; k++) {
      var sl = (sections[k].label || '').toLowerCase();
      if (sl.indexOf(raw.toLowerCase()) >= 0 || raw.toLowerCase().indexOf(sl) >= 0) return sections[k].id;
    }
    // Match by section number pattern: "section 3" → third section
    var numMatch = raw.match(/(\d+)/);
    if (numMatch) {
      var idx = parseInt(numMatch[1], 10) - 1;
      if (idx >= 0 && idx < sections.length) return sections[idx].id;
    }
    return raw || 'body';
  }

  // Resolve voice profile for a clip — checks look's voice, falls back to project default
  function resolveVoiceProfile(clip) {
    var projectVP = ((S.data.start || {}).preferences || {}).voice_profile || {};
    if (!clip || clip.type !== 'ai-character') return projectVP;
    var ps = clip.prompt_set || {};
    var lookIds = ((ps.first_frame || {}).scene || {}).look_ids || [];
    if (lookIds.length) {
      var look = S.lookMap ? S.lookMap[lookIds[0]] : null;
      if (look && look.voice_profile && (look.voice_profile.style || look.voice_profile.custom_description)) {
        return look.voice_profile;
      }
    }
    return projectVP;
  }

  // Phase 4: Prerequisite check for clips — returns array of warnings/errors
  function getClipPrerequisites(clip) {
    var warnings = [];
    if (!clip) return warnings;
    var ct = CLIP_TYPES[clip.type] || {};
    // AI Character clip without any presenter looks
    if (clip.type === 'ai-character') {
      var presenterLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador' || l.role === 'supporting'; });
      if (!presenterLooks.length) {
        warnings.push({ type: 'missing-look', severity: 'error', message: 'No character/look exists for AI Character clip', action: 'create-look', actionLabel: 'Create Character Look' });
      }
      // Check scene assignment
      var ps = clip.prompt_set || {};
      var ffScene = ((ps.first_frame || {}).scene || {});
      if (!ffScene.scene_template_id && !(ffScene.look_ids && ffScene.look_ids.length)) {
        warnings.push({ type: 'missing-scene', severity: 'warning', message: 'No scene assigned — character needs environment context', action: 'assign-scene', actionLabel: 'Assign Scene' });
      }
    }
    // Voice profile check for AI audio mode
    var audioMode = ((S.data.start || {}).preferences || {}).audio_mode || '';
    var audioModeDef = AUDIO_MODES[audioMode] || {};
    if (audioModeDef.supportsVoiceProfile && ct.track === 'ai') {
      var vp = ((S.data.start || {}).preferences || {}).voice_profile || {};
      if (!vp.style && !vp.custom_description) {
        warnings.push({ type: 'missing-voice', severity: 'info', message: 'No voice profile set — audio prompts will use defaults', action: 'set-voice-profile', actionLabel: 'Set Voice Profile' });
      }
    }
    return warnings;
  }

  // Normalize script content to HTML <p> tags
  function normalizeToHtml(content) {
    if (!content) return '';
    // Already has HTML tags
    if (/<\/?[a-z][\s\S]*>/i.test(content)) return content;
    // Plain text: split on double newlines or single newlines, wrap in <p>
    var paragraphs = content.split(/\n\n+|\n/).filter(function(p) { return p.trim(); });
    return paragraphs.map(function(p) { return '<p>' + p.trim() + '</p>'; }).join('');
  }

  function createEmptyPromptSet(clipType) {
    var ct = CLIP_TYPES[clipType] || {};
    return { requires_last_frame: !!ct.defaultLastFrame, first_frame: _createEmptyFrame(), last_frame: ct.defaultLastFrame ? _createEmptyFrame() : null, video: { prompt: createEmptyPrompt(), marked_done: false, done_at: null, notes: '' } };
  }

  function _createEmptyFrame() {
    return { scene: { environment_id: '', look_ids: [], scene_template_id: '', notes: '' }, prompt: createEmptyPrompt(), image_url: '', version: 0, version_notes: '', marked_done: false, done_at: null, implementation_guide: null };
  }

  function createEmptyPrompt() {
    return { positive: '', negative: '', style_keywords: [], parameters: {}, model: '', status: 'empty', generated_at: '' };
  }

  function createDefaultNonAiPlanning() {
    return { brief: '', instructions: '', recording_ref: '', marked_done: false, done_at: null };
  }

  function createDefaultLook() {
    return { id: generateId('look'), name: '', role: 'supporting', character_id: '', outfit_id: '', combined_prompt_fragment: '', description: '', reference_images: [], tags: [], voice_profile: { gender: '', age_range: '', style: '', accent: '', custom_description: '', reference_model: '' }, source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultEnvironment() {
    return { id: generateId('env'), name: '', type: 'indoor', description: '', prompt_fragment: '', reference_images: [], tags: [], source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultScene() {
    return { id: generateId('scene'), name: '', look_ids: [], environment_id: '', camera_direction: '', suggested_duration: 8, notes: '', source: 'video', status: 'draft', created: new Date().toISOString(), modified: '' };
  }

  function createDefaultBodySection(order, label) {
    return { id: generateId('sec'), label: label || 'Section ' + order, content: '', word_count: 0, estimated_duration: 0, order: order || 1, notes: '' };
  }


  // ============================================================
  // SECTION 15: API EXPORTS
  // ============================================================

  window._vpmState = S;
  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRender = renderCurrentView;
  window._vpmRenderApp = renderApp;
  window._vpmRefreshSidebarNav = _refreshSidebarNav;
  window._vpmNavigateToStage = navigateToStage;
  window._vpmToast = toast;
  window._vpmSnapshot = snapshot;
  window._vpmGenerateId = generateId;
  window._vpmBuildMaps = buildMaps;
  window._vpmSyncToTextarea = syncToTextarea;
  window._vpmLogActivity = logActivity;
  window._vpmEvaluateClipStatus = evaluateClipStatus;
  window._vpmMaybeAdvanceClipStatus = maybeAdvanceClipStatus;
  window._vpmCalculateVideoStatus = calculateVideoStatus;
  window._vpmComputeFlags = computeFlags;
  window._vpmCanAccessStage = canAccessStage;
  window._vpmGetStageStatus = getStageStatus;
  window._vpmIsStageComplete = isStageComplete;
  window._vpmGetStageProgress = getStageProgress;
  window._vpmGetStageOrder = getStageOrder;
  window._vpmRecomputeClipTimings = recomputeClipTimings;
  window._vpmRecomputeScriptDurations = recomputeScriptDurations;
  window._vpmFormatDate = formatDate;
  window._vpmFormatRelativeTime = formatRelativeTime;
  window._vpmFormatNumber = formatNumber;
  window._vpmFormatDuration = formatDuration;
  window._vpmFormatDurationLong = formatDurationLong;
  window._vpmEsc = esc;
  window._vpmIcon = icon;
  window._vpmTruncate = truncate;
  window._vpmStripHtml = stripHtml;
  window._vpmDeepClone = deepClone;
  window._vpmDebounce = debounce;
  window._vpmIsEmpty = isEmpty;
  window._vpmCountWords = countWords;
  window._vpmEstimateDuration = estimateDurationFromWords;
  window._vpmGetMaxWordsForDuration = getMaxWordsForDuration;
  window._vpmGetSmartClipDuration = getSmartClipDuration;
  window._vpmGetModelDurationConfig = getModelDurationConfig;
  window._vpmSnapToModelDuration = snapToModelDuration;
  window._vpmValidateClipDuration = validateClipDuration;
  window._vpmParseJSON = parseJSON;
  window._vpmParseAIResponse = parseAIResponse;
  window._vpmBadge = badge;
  window._vpmStatusBadge = statusBadge;
  window._vpmClipTypeBadge = clipTypeBadge;
  window._vpmTrackBadge = trackBadge;
  window._vpmClipStatusBadge = clipStatusBadge;
  window._vpmSourceBadge = sourceBadge;
  window._vpmRoleBadge = roleBadge;
  window._vpmProgressBar = progressBar;
  window._vpmRenderClipList = renderClipList;
  window._vpmRenderClipCard = renderClipCard;
  window._vpmRenderTimelineBar = renderTimelineBar;
  window._vpmRenderNavButtons = renderNavButtons;
  window._vpmRenderProductionProgress = renderProductionProgress;
  window._vpmGetEntityPrimaryImage = _getEntityPrimaryImage;
  window._vpmCsColor = _csColor;
  window._vpmGetDefaultData = getDefaultData;
  window._vpmGetDefaultMeta = getDefaultMeta;
  window._vpmCreateDefaultClip = createDefaultClip;
  window._vpmCreateLightweightClip = createLightweightClip;
  window._vpmEnsurePromptSet = ensurePromptSet;
  window._vpmEnsureNonAiPlanning = ensureNonAiPlanning;
  window._vpmEnsureProductionConfig = ensureProductionConfig;
  window._vpmNormalizeClipType = normalizeClipType;
  window._vpmResolveSectionId = resolveSectionId;
  window._vpmNormalizeToHtml = normalizeToHtml;
  window._vpmCreateEmptyPromptSet = createEmptyPromptSet;
  window._vpmCreateEmptyFrame = _createEmptyFrame;
  window._vpmCreateEmptyPrompt = createEmptyPrompt;
  window._vpmCreateDefaultNonAiPlanning = createDefaultNonAiPlanning;
  window._vpmCreateDefaultLook = createDefaultLook;
  window._vpmCreateDefaultEnvironment = createDefaultEnvironment;
  window._vpmCreateDefaultScene = createDefaultScene;
  window._vpmCreateDefaultBodySection = createDefaultBodySection;
  window._vpmParseGalleries = parseGalleries;
  window._vpmQueueGalleryUpload = queueGalleryUpload;
  window._vpmTriggerGalleryRemove = triggerGalleryRemove;
  window._vpmParseBrandStudioLibrary = parseBrandStudioLibrary;
  window._vpmGetClipPrerequisites = getClipPrerequisites;
  window._vpmGetClipScriptOverflow = getClipScriptOverflow;
  window._vpmResolveVoiceProfile = resolveVoiceProfile;
  window._vpmGetMaxWordsForDuration = getMaxWordsForDuration;
  window._vpmSetNested = _setNested;
  window._vpmConstants = {
    APP_STAGES: APP_STAGES, STAGE_ORDER_STANDARD: STAGE_ORDER_STANDARD, STAGE_ORDER_ADVANCED: STAGE_ORDER_ADVANCED,
    UTILITY_VIEWS: UTILITY_VIEWS,
    PLATFORMS: PLATFORMS, ASPECT_RATIOS: ASPECT_RATIOS, AUDIO_MODES: AUDIO_MODES, SEEDANCE_AUDIO_DIRECTIONS: SEEDANCE_AUDIO_DIRECTIONS,
    VIDEO_STYLES: VIDEO_STYLES, VOICE_GENDERS: VOICE_GENDERS, VOICE_AGE_RANGES: VOICE_AGE_RANGES,
    VOICE_STYLES: VOICE_STYLES, VOICE_ACCENTS: VOICE_ACCENTS,
    PRODUCTION_MODES: PRODUCTION_MODES, PRESENTER_PREFS: PRESENTER_PREFS,
    LANGUAGES: LANGUAGES, TONES: TONES,
    CLIP_TYPES: CLIP_TYPES,
    AI_CLIP_STATUSES: AI_CLIP_STATUSES, AI_CLIP_STATUS_ORDER: AI_CLIP_STATUS_ORDER,
    NON_AI_CLIP_STATUSES: NON_AI_CLIP_STATUSES, TEMPLATE_CLIP_STATUSES: TEMPLATE_CLIP_STATUSES,
    STUDIO_TABS: STUDIO_TABS, SETTINGS_TABS: SETTINGS_TABS,
    AI_CLIP_TABS: AI_CLIP_TABS, NON_AI_CLIP_TABS: NON_AI_CLIP_TABS,
    LOOK_ROLES: LOOK_ROLES, ENVIRONMENT_TYPES: ENVIRONMENT_TYPES,
    MOTION_STRENGTHS: MOTION_STRENGTHS, CAMERA_MOVEMENTS: CAMERA_MOVEMENTS, TRANSITION_STYLES: TRANSITION_STYLES,
    IMAGE_MODELS: IMAGE_MODELS, VIDEO_MODELS: VIDEO_MODELS,
    VIDEO_STATUSES: VIDEO_STATUSES, ACTIVITY_TYPES: ACTIVITY_TYPES,
    PLANNER_TONE_MAP: PLANNER_TONE_MAP,
    VIDEO_GEN_MODES: {
      'frames-to-video':      { label: 'Frames to Video',      icon: 'images',              description: 'Generate video from first frame (and optional last frame) reference images' },
      'text-to-video':        { label: 'Text to Video',        icon: 'wand-magic-sparkles', description: 'Generate video purely from text prompt \u2014 no reference images needed' },
      'ingredients-to-video': { label: 'Ingredients to Video',  icon: 'layer-group',         description: 'Provide ingredient images (characters, environments, objects) and compose a video from them' }
    }
  };

  console.log('[VPM] Part 1 v1.0 loaded \u2014 15 sections');

})(jQuery, Drupal);
