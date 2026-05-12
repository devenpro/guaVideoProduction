/*! VPM JS bundle — built 2026-05-12T06:25:21.738Z */

/* ===== src/core/constants.js ===== */
/**
 * VPM Constants
 * All workflow/UI enum data: stages, platforms, audio modes, video styles, clip types, statuses, models, etc.
 * Exposes:
 *   - window._vpmConstants  (legacy aggregate, used throughout part1/part2a/part2b)
 *   - window._vpm.constants  (new unified namespace, same object reference)
 *
 * MUST load before src/core/vpm-part1.js (part1 destructures these into local vars).
 */
(function () {
  'use strict';

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
    'hindi':    { label: 'Hindi',     icon: 'h',  sub: 'हिंदी' },
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
    'seedance':        { label: 'Seedance 2.0',   icon: 'seedling',  isDefault: true, durations: [5, 10, 15],     defaultDuration: 10, minDuration: 5,  maxDuration: 15, durationStep: 5, defaultGenMode: 'ingredients-to-video', notes: 'Primary model. Ingredients & Text to Video. Sweet spot 8–10s per clip.' },
    'google-veo-3.1':  { label: 'Google VEO 3.1', icon: 'film',                       durations: [5, 6, 7, 8],    defaultDuration: 8,  minDuration: 5,  maxDuration: 8,  durationStep: 1, defaultGenMode: 'frames-to-video',      notes: 'Frames to Video — reference image required. Integrated audio. Max 8s.' },
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

  // 1r. Video generation modes (used by Seedance, VEO 3.1)
  var VIDEO_GEN_MODES = {
    'frames-to-video':      { label: 'Frames to Video',      icon: 'images',              description: 'Generate video from first frame (and optional last frame) reference images' },
    'text-to-video':        { label: 'Text to Video',        icon: 'wand-magic-sparkles', description: 'Generate video purely from text prompt — no reference images needed' },
    'ingredients-to-video': { label: 'Ingredients to Video',  icon: 'layer-group',         description: 'Provide ingredient images (characters, environments, objects) and compose a video from them' }
  };

  // ========================================================
  // EXPORTS
  // ========================================================
  var Constants = {
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
    VIDEO_GEN_MODES: VIDEO_GEN_MODES
  };

  // Legacy/public API (used throughout part1, part2a, part2b)
  window._vpmConstants = Constants;
  // New unified namespace
  window._vpm = window._vpm || {};
  window._vpm.constants = Constants;
})();


/* ===== src/core/state.js ===== */
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
      studioRequirements: {},
      _ui: {}
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


/* ===== src/utils/format.js ===== */
/**
 * VPM Format/Parse/Badge Utilities
 *
 * Pure (or near-pure) helper functions used across part1/part2a/part2b.
 * Exports each function on the existing window._vpm* names for backward compat.
 * Also exposes them grouped under window._vpm.utils.
 *
 * MUST load AFTER constants.js + state.js, BEFORE vpm-part1.js.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var CLIP_TYPES = Constants.CLIP_TYPES;
  var VIDEO_MODELS = Constants.VIDEO_MODELS;
  var VIDEO_STATUSES = Constants.VIDEO_STATUSES;
  var AI_CLIP_STATUSES = Constants.AI_CLIP_STATUSES;
  var NON_AI_CLIP_STATUSES = Constants.NON_AI_CLIP_STATUSES;
  var TEMPLATE_CLIP_STATUSES = Constants.TEMPLATE_CLIP_STATUSES;
  var LOOK_ROLES = Constants.LOOK_ROLES;

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
  // EXPORTS — preserve existing window._vpm* API
  // ============================================================
  window._vpmEsc = esc;
  window._vpmTruncate = truncate;
  window._vpmStripHtml = stripHtml;
  window._vpmCountWords = countWords;
  window._vpmFormatDuration = formatDuration;
  window._vpmFormatDurationLong = formatDurationLong;
  window._vpmFormatDate = formatDate;
  window._vpmFormatRelativeTime = formatRelativeTime;
  window._vpmFormatNumber = formatNumber;
  window._vpmEstimateDuration = estimateDurationFromWords;
  window._vpmGetMaxWordsForDuration = getMaxWordsForDuration;
  window._vpmGetClipScriptOverflow = getClipScriptOverflow;
  window._vpmGetSmartClipDuration = getSmartClipDuration;
  window._vpmGetModelDurationConfig = getModelDurationConfig;
  window._vpmSnapToModelDuration = snapToModelDuration;
  window._vpmValidateClipDuration = validateClipDuration;
  window._vpmIcon = icon;
  window._vpmGenerateId = generateId;
  window._vpmParseAIResponse = parseAIResponse;
  window._vpmParseJSON = parseJSON;
  window._vpmDeepClone = deepClone;
  window._vpmIsEmpty = isEmpty;
  window._vpmDebounce = debounce;
  window._vpmLogActivity = logActivity;
  window._vpmGetFilteredActivity = getFilteredActivity;
  window._vpmBadge = badge;
  window._vpmStatusBadge = statusBadge;
  window._vpmClipTypeBadge = clipTypeBadge;
  window._vpmTrackBadge = trackBadge;
  window._vpmClipStatusBadge = clipStatusBadge;
  window._vpmSourceBadge = sourceBadge;
  window._vpmRoleBadge = roleBadge;
  window._vpmProgressBar = progressBar;
  window._vpmGetEntityPrimaryImage = _getEntityPrimaryImage;

  // New unified namespace
  window._vpm = window._vpm || {};
  window._vpm.utils = {
    esc: esc, truncate: truncate, stripHtml: stripHtml, countWords: countWords,
    formatDuration: formatDuration, formatDurationLong: formatDurationLong,
    formatDate: formatDate, formatRelativeTime: formatRelativeTime, formatNumber: formatNumber,
    icon: icon, generateId: generateId, parseAIResponse: parseAIResponse, parseJSON: parseJSON,
    deepClone: deepClone, isEmpty: isEmpty, debounce: debounce, logActivity: logActivity,
    badge: badge, statusBadge: statusBadge, clipTypeBadge: clipTypeBadge
  };
})();


/* ===== src/core/vpm-part1.js ===== */
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
  // CONSTANTS (defined in src/core/constants.js, destructured here for backward-compatible local references)
  // ============================================================
  var _C = window._vpmConstants;
  var APP_STAGES = _C.APP_STAGES, STAGE_ORDER_STANDARD = _C.STAGE_ORDER_STANDARD, STAGE_ORDER_ADVANCED = _C.STAGE_ORDER_ADVANCED;
  var UTILITY_VIEWS = _C.UTILITY_VIEWS;
  var PLATFORMS = _C.PLATFORMS, ASPECT_RATIOS = _C.ASPECT_RATIOS, AUDIO_MODES = _C.AUDIO_MODES, SEEDANCE_AUDIO_DIRECTIONS = _C.SEEDANCE_AUDIO_DIRECTIONS;
  var VIDEO_STYLES = _C.VIDEO_STYLES, VOICE_GENDERS = _C.VOICE_GENDERS, VOICE_AGE_RANGES = _C.VOICE_AGE_RANGES;
  var VOICE_STYLES = _C.VOICE_STYLES, VOICE_ACCENTS = _C.VOICE_ACCENTS;
  var PRODUCTION_MODES = _C.PRODUCTION_MODES, PRESENTER_PREFS = _C.PRESENTER_PREFS;
  var LANGUAGES = _C.LANGUAGES, TONES = _C.TONES;
  var CLIP_TYPES = _C.CLIP_TYPES;
  var AI_CLIP_STATUSES = _C.AI_CLIP_STATUSES, AI_CLIP_STATUS_ORDER = _C.AI_CLIP_STATUS_ORDER;
  var NON_AI_CLIP_STATUSES = _C.NON_AI_CLIP_STATUSES, TEMPLATE_CLIP_STATUSES = _C.TEMPLATE_CLIP_STATUSES;
  var STUDIO_TABS = _C.STUDIO_TABS, SETTINGS_TABS = _C.SETTINGS_TABS;
  var AI_CLIP_TABS = _C.AI_CLIP_TABS, NON_AI_CLIP_TABS = _C.NON_AI_CLIP_TABS;
  var LOOK_ROLES = _C.LOOK_ROLES, ENVIRONMENT_TYPES = _C.ENVIRONMENT_TYPES;
  var MOTION_STRENGTHS = _C.MOTION_STRENGTHS, CAMERA_MOVEMENTS = _C.CAMERA_MOVEMENTS, TRANSITION_STYLES = _C.TRANSITION_STYLES;
  var IMAGE_MODELS = _C.IMAGE_MODELS, VIDEO_MODELS = _C.VIDEO_MODELS;
  var VIDEO_STATUSES = _C.VIDEO_STATUSES, ACTIVITY_TYPES = _C.ACTIVITY_TYPES;
  var PLANNER_TONE_MAP = _C.PLANNER_TONE_MAP, VIDEO_GEN_MODES = _C.VIDEO_GEN_MODES;


  // ============================================================
  // STATE (defined in src/core/state.js; reference captured here)
  // ============================================================
  var S = window._vpmState;


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
      // Restore last UI state (current stage + sub-tabs + selected clip) BEFORE first render
      // so the app reopens exactly where the user left off.
      var _resumed = false;
      try { _resumed = _restoreUIState(); } catch (_re) { console.warn('[VPM] UI restore failed:', _re && _re.message); }
      // Auto-hide sidebar on mobile viewports
      if (window.innerWidth < 992) S.sidebarHidden = true;
      renderApp();
      setupEventHandlers();
      startAutoSave();
      // Resume toast — shown once on init when restored to a non-Start stage.
      if (_resumed) {
        var lbl = (APP_STAGES[S.currentStage] && APP_STAGES[S.currentStage].label) || (UTILITY_VIEWS[S.currentStage] && UTILITY_VIEWS[S.currentStage].label) || S.currentStage;
        // Delay so toast container is fully mounted
        setTimeout(function() { try { toast('Resumed at ' + lbl, 'info', 3000); } catch (_te) {} }, 400);
      }
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
    S.meta._ui = $.extend(true, {}, def._ui, S.meta._ui || {});

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

  // Capture current UI state (stage + sub-state) into S.meta._ui.
  // Cheap — only mutates the object; does NOT mark dirty or write the textarea.
  // syncToTextarea() calls this before writing so saved JSON includes the latest UI state.
  function _captureUIState() {
    if (!S.meta) return;
    var ui = S.meta._ui = S.meta._ui || {};
    ui.last_stage = S.currentStage || 'start';
    ui.start_step = S.startStep || '';
    ui.selected_clip_id = S.selectedClipId || '';
    ui.clip_detail_tab = S.currentClipDetailTab || '';
    ui.studio_tab = S.currentStudioTab || '';
    ui.settings_tab = S.currentSettingsTab || '';
    ui.platform_tab = S.currentPlatformTab || '';
    ui.thumbnail_step = S.thumbnailStep || '';
    if (!Array.isArray(ui.visited_stages)) ui.visited_stages = [];
    ui.updated_at = new Date().toISOString();
  }

  // Restore UI state from S.meta._ui into S.* fields. Called in init() before renderApp().
  // Validates that the restored stage is reachable in the current mode and falls back to 'start' otherwise.
  // Returns true if a non-default stage was restored (used to decide whether to show the "Resume" toast).
  function _restoreUIState() {
    var ui = (S.meta && S.meta._ui) || {};
    var restored = false;
    if (ui.last_stage) {
      var stageOrder = getStageOrder();
      if (APP_STAGES[ui.last_stage] && stageOrder.indexOf(ui.last_stage) !== -1) {
        S.currentStage = ui.last_stage;
        restored = ui.last_stage !== 'start';
      } else if (UTILITY_VIEWS[ui.last_stage]) {
        S.currentStage = ui.last_stage;
        restored = true;
      }
    }
    if (ui.start_step) S.startStep = ui.start_step;
    if (ui.clip_detail_tab) S.currentClipDetailTab = ui.clip_detail_tab;
    if (ui.studio_tab) S.currentStudioTab = ui.studio_tab;
    if (ui.settings_tab) S.currentSettingsTab = ui.settings_tab;
    if (ui.platform_tab) S.currentPlatformTab = ui.platform_tab;
    if (ui.thumbnail_step) S.thumbnailStep = ui.thumbnail_step;
    if (ui.selected_clip_id) {
      var clips = (S.data && S.data.clips) || [];
      for (var i = 0; i < clips.length; i++) {
        if (clips[i].id === ui.selected_clip_id) { S.selectedClipId = ui.selected_clip_id; break; }
      }
    }
    return restored;
  }

  // Auto-mark prior stage complete when user navigates forward AND prior stage has min content.
  // Returns the stage that was auto-confirmed (or '' if nothing changed).
  function _maybeAutoConfirmPriorStage(fromStage, toStage) {
    if (!fromStage || !toStage || fromStage === toStage) return '';
    var stageOrder = getStageOrder();
    var fromIdx = stageOrder.indexOf(fromStage), toIdx = stageOrder.indexOf(toStage);
    if (fromIdx < 0 || toIdx <= fromIdx) return ''; // not a forward move
    var d = S.data || {};
    if (fromStage === 'research') {
      var r = d.research || {};
      if (!r.generated && (r.audience_insights || r.competitor_analysis || r.trending_angles || r.content_strategy)) {
        r.generated = true; r.generated_at = r.generated_at || new Date().toISOString();
        logActivity && logActivity('research_auto_confirmed', 'Research auto-marked complete on stage advance');
        return 'research';
      }
    } else if (fromStage === 'blueprint') {
      var bp = d.blueprint || {};
      var hasSection = (bp.sections || []).some(function(s) { return (s.label || '').trim().length > 0; });
      if (!bp.confirmed && hasSection) {
        bp.confirmed = true; bp.confirmed_at = bp.confirmed_at || new Date().toISOString();
        logActivity && logActivity('blueprint_auto_confirmed', 'Blueprint auto-marked complete on stage advance');
        return 'blueprint';
      }
    } else if (fromStage === 'script') {
      var sc = d.script || {}, totalChars = 0;
      var secs = sc.sections || [];
      for (var si = 0; si < secs.length; si++) totalChars += (secs[si].content ? stripHtml(secs[si].content).trim().length : 0);
      if (!sc.finalized && totalChars >= 20) {
        sc.finalized = true; sc.finalized_at = sc.finalized_at || new Date().toISOString();
        logActivity && logActivity('script_auto_confirmed', 'Script auto-marked complete on stage advance');
        return 'script';
      }
    }
    return '';
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

    var fromStage = S.currentStage;
    S.previousStage = S.currentStage;
    S.currentStage = stageId;

    // Auto-mark prior stage complete on forward navigation (when it has minimum content).
    // Explicit Confirm/Unlock buttons still work — this just removes the friction of leaving stages
    // visibly "incomplete" after the user has clearly moved past them.
    var autoConfirmed = _maybeAutoConfirmPriorStage(fromStage, stageId);

    // Track visited stages for sidebar coach + future analytics
    var ui = S.meta && S.meta._ui;
    if (ui) {
      if (!Array.isArray(ui.visited_stages)) ui.visited_stages = [];
      if (ui.visited_stages.indexOf(stageId) === -1) ui.visited_stages.push(stageId);
    }

    // Reset sub-state for clips
    if (stageId === 'clips' && !S.selectedClipId && S.data.clips && S.data.clips.length > 0) {
      S.selectedClipId = S.data.clips[0].id;
      var firstClip = S.data.clips[0];
      var firstTrack = firstClip.track || (CLIP_TYPES[firstClip.type] || {}).track || 'ai';
      S.currentClipDetailTab = firstTrack === 'ai' ? 'script-config' : firstTrack === 'non-ai' ? 'planning' : 'template';
    }

    // Recompute completion flags every navigation so sidebar reflects the latest state
    // (especially after an auto-confirm).
    try { buildMaps(); } catch (_e) {}

    // Persist new stage + sub-state immediately so a reload restores correctly
    syncToTextarea();

    if (autoConfirmed) {
      var label = (APP_STAGES[autoConfirmed] && APP_STAGES[autoConfirmed].label) || autoConfirmed;
      toast(label + ' marked complete', 'success', 2200);
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
    var _visited = (S.meta && S.meta._ui && Array.isArray(S.meta._ui.visited_stages)) ? S.meta._ui.visited_stages : [];
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var isVisited = !isActive && !isDone && _visited.indexOf(key) !== -1;
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isVisited ? ' vpm-nav-visited' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + (isVisited ? ' (visited — not confirmed)' : '') + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else if (isVisited) html += icon('circle-dot');
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
  // UTILITIES (defined in src/utils/format.js; captured here as locals)
  // ============================================================
  var esc = window._vpmEsc, truncate = window._vpmTruncate, stripHtml = window._vpmStripHtml, countWords = window._vpmCountWords;
  var formatDuration = window._vpmFormatDuration, formatDurationLong = window._vpmFormatDurationLong;
  var formatDate = window._vpmFormatDate, formatRelativeTime = window._vpmFormatRelativeTime, formatNumber = window._vpmFormatNumber;
  var estimateDurationFromWords = window._vpmEstimateDuration, getMaxWordsForDuration = window._vpmGetMaxWordsForDuration;
  var getClipScriptOverflow = window._vpmGetClipScriptOverflow;
  var getSmartClipDuration = window._vpmGetSmartClipDuration, getModelDurationConfig = window._vpmGetModelDurationConfig;
  var snapToModelDuration = window._vpmSnapToModelDuration, validateClipDuration = window._vpmValidateClipDuration;
  var icon = window._vpmIcon, generateId = window._vpmGenerateId;
  var parseAIResponse = window._vpmParseAIResponse, parseJSON = window._vpmParseJSON;
  var deepClone = window._vpmDeepClone, isEmpty = window._vpmIsEmpty, debounce = window._vpmDebounce;
  var logActivity = window._vpmLogActivity, getFilteredActivity = window._vpmGetFilteredActivity;
  var badge = window._vpmBadge, statusBadge = window._vpmStatusBadge, clipTypeBadge = window._vpmClipTypeBadge;
  var trackBadge = window._vpmTrackBadge, clipStatusBadge = window._vpmClipStatusBadge;
  var sourceBadge = window._vpmSourceBadge, roleBadge = window._vpmRoleBadge, progressBar = window._vpmProgressBar;
  var _getEntityPrimaryImage = window._vpmGetEntityPrimaryImage;


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
    var _visited2 = (S.meta && S.meta._ui && Array.isArray(S.meta._ui.visited_stages)) ? S.meta._ui.visited_stages : [];
    for (var si = 0; si < stageOrder.length; si++) {
      var key = stageOrder[si], stage = APP_STAGES[key], status = getStageStatus(key);
      var isActive = S.currentStage === key, isDone = status === 'complete', isFuture = status === 'not-started';
      var isVisited = !isActive && !isDone && _visited2.indexOf(key) !== -1;
      var progress = getStageProgress(key);
      html += '<button class="vpm-nav-item' + (isActive ? ' vpm-nav-active' : '') + (isDone ? ' vpm-nav-done' : '') + (isVisited ? ' vpm-nav-visited' : '') + (isFuture ? ' vpm-nav-future' : '') + '" data-action="navigate" data-stage="' + key + '" title="' + esc(stage.label) + (isVisited ? ' (visited — not confirmed)' : '') + '">';
      html += '<div class="vpm-nav-dot">';
      if (isDone) html += icon('check');
      else if (isVisited) html += icon('circle-dot');
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

  function render() { _captureUIState(); _refreshSidebarNav(); renderCurrentView(); }


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
    _captureUIState();
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
      studioRequirements: {},
      _ui: { last_stage: '', start_step: '', selected_clip_id: '', clip_detail_tab: '', studio_tab: '', settings_tab: '', platform_tab: '', thumbnail_step: '', visited_stages: [], updated_at: '' }
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

  window._vpmRenderers = window._vpmRenderers || {};
  window._vpmRender = renderCurrentView;
  window._vpmRenderApp = renderApp;
  window._vpmRefreshSidebarNav = _refreshSidebarNav;
  window._vpmNavigateToStage = navigateToStage;
  window._vpmToast = toast;
  window._vpmSnapshot = snapshot;
  window._vpmBuildMaps = buildMaps;
  window._vpmSyncToTextarea = syncToTextarea;
  window._vpmCaptureUIState = _captureUIState;
  window._vpmRestoreUIState = _restoreUIState;
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
  window._vpmRenderClipList = renderClipList;
  window._vpmRenderClipCard = renderClipCard;
  window._vpmRenderTimelineBar = renderTimelineBar;
  window._vpmRenderNavButtons = renderNavButtons;
  window._vpmRenderProductionProgress = renderProductionProgress;
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
  window._vpmResolveVoiceProfile = resolveVoiceProfile;
  window._vpmSetNested = _setNested;

  console.log('[VPM] Part 1 v1.0 loaded \u2014 15 sections');

})(jQuery, Drupal);


/* ===== src/ui/activity.js ===== */
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


/* ===== src/ui/research.js ===== */
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

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('magnifying-glass') + ' Research</h2>';
    html += '<p class="vpm-view-subtitle">AI-powered content research for better videos</p></div>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-research">' + icon('sparkles') + ' Generate Research Brief</button>';
    if (res.generated) html += '<span class="vpm-text-success vpm-text-sm">' + icon('circle-check') + ' Generated ' + formatRelativeTime(res.generated_at || '') + '</span>';
    html += '</div></div>';

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


/* ===== src/ui/blueprint.js ===== */
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


/* ===== src/ui/vpm-part2a.js ===== */
/**
 * AI Video Production Manager v1.0 - Part 2A: CRUD & Editing Engine
 *
 * Phase 2: Modal system, undo/redo, Start stage (mode selector, preferences,
 * prompt input), Blueprint stage (section editor, duration allocation).
 * Future phases add: Script, Studio, Clips, Publish renderers.
 *
 * Registers: startFull, blueprintFull + setup*Events
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  // ============================================================
  // SECTION 1: INIT & IMPORTS
  // ============================================================

  var S, render, navigateToStage, toast, generateId, buildMaps, syncToTextarea;
  var logActivity, esc, deepClone, icon, truncate, stripHtml, debounce, isEmpty, countWords;
  var formatDate, formatRelativeTime, formatDuration, formatDurationLong, formatNumber;
  var badge, statusBadge, clipTypeBadge, trackBadge, clipStatusBadge;
  var sourceBadge, roleBadge, progressBar, estimateDuration, parseJSON;
  var getSmartClipDuration, getModelDurationConfig, snapToModelDuration, validateClipDuration;
  var canAccessStage, isStageComplete, getStageProgress;
  var evaluateClipStatus, maybeAdvanceClipStatus, recomputeClipTimings, recomputeScriptDurations;
  var createDefaultClip, createEmptyPromptSet, createEmptyFrame, createEmptyPrompt, createDefaultNonAiPlanning;
  var createDefaultLook, createDefaultEnvironment, createDefaultScene, createDefaultBodySection;
  var ensurePromptSet, ensureNonAiPlanning, ensureProductionConfig;
  var renderClipList, renderClipCard, renderTimelineBar, renderNavButtons, renderProductionProgress;
  var getEntityPrimaryImage, parseGalleries, queueGalleryUpload, triggerGalleryRemove;
  var getStageOrder, setNested, _csColor, _refreshSidebarNav;
  var normalizeClipType, createLightweightClip;
  var getClipPrerequisites, getClipScriptOverflow, getMaxWordsForDuration;
  var Constants;

  var _checkCount = 0;
  var checkInterval = setInterval(function() {
    _checkCount++;
    if (window._vpmState && window._vpmState.initialized) { clearInterval(checkInterval); initPart2A(); }
    else if (_checkCount > 250) {
      clearInterval(checkInterval);
      console.error('[VPM] Part 2A: Timed out waiting for Part 1');
    }
  }, 100);

  function initPart2A() {
    console.log('[VPM] Initializing Part 2A...');

    // Import all Part 1 exports
    S = window._vpmState;
    render = window._vpmRender; navigateToStage = window._vpmNavigateToStage;
    toast = window._vpmToast; generateId = window._vpmGenerateId;
    buildMaps = window._vpmBuildMaps; syncToTextarea = window._vpmSyncToTextarea;
    logActivity = window._vpmLogActivity;
    esc = window._vpmEsc; deepClone = window._vpmDeepClone; icon = window._vpmIcon;
    truncate = window._vpmTruncate; stripHtml = window._vpmStripHtml;
    debounce = window._vpmDebounce; isEmpty = window._vpmIsEmpty; countWords = window._vpmCountWords;
    formatDate = window._vpmFormatDate; formatRelativeTime = window._vpmFormatRelativeTime;
    formatDuration = window._vpmFormatDuration; formatDurationLong = window._vpmFormatDurationLong;
    formatNumber = window._vpmFormatNumber; estimateDuration = window._vpmEstimateDuration;
    parseJSON = window._vpmParseJSON; getSmartClipDuration = window._vpmGetSmartClipDuration;
    getModelDurationConfig = window._vpmGetModelDurationConfig;
    snapToModelDuration = window._vpmSnapToModelDuration;
    validateClipDuration = window._vpmValidateClipDuration;
    badge = window._vpmBadge; statusBadge = window._vpmStatusBadge;
    clipTypeBadge = window._vpmClipTypeBadge; trackBadge = window._vpmTrackBadge;
    clipStatusBadge = window._vpmClipStatusBadge;
    sourceBadge = window._vpmSourceBadge; roleBadge = window._vpmRoleBadge;
    progressBar = window._vpmProgressBar;
    canAccessStage = window._vpmCanAccessStage; isStageComplete = window._vpmIsStageComplete;
    getStageProgress = window._vpmGetStageProgress;
    evaluateClipStatus = window._vpmEvaluateClipStatus; maybeAdvanceClipStatus = window._vpmMaybeAdvanceClipStatus;
    recomputeClipTimings = window._vpmRecomputeClipTimings;
    recomputeScriptDurations = window._vpmRecomputeScriptDurations;
    createDefaultClip = window._vpmCreateDefaultClip;
    createEmptyPromptSet = window._vpmCreateEmptyPromptSet;
    createEmptyFrame = window._vpmCreateEmptyFrame;
    createEmptyPrompt = window._vpmCreateEmptyPrompt;
    createDefaultNonAiPlanning = window._vpmCreateDefaultNonAiPlanning;
    createDefaultLook = window._vpmCreateDefaultLook;
    createDefaultEnvironment = window._vpmCreateDefaultEnvironment;
    createDefaultScene = window._vpmCreateDefaultScene;
    createDefaultBodySection = window._vpmCreateDefaultBodySection;
    ensurePromptSet = window._vpmEnsurePromptSet;
    ensureNonAiPlanning = window._vpmEnsureNonAiPlanning;
    ensureProductionConfig = window._vpmEnsureProductionConfig;
    renderClipList = window._vpmRenderClipList; renderClipCard = window._vpmRenderClipCard;
    renderTimelineBar = window._vpmRenderTimelineBar; renderNavButtons = window._vpmRenderNavButtons;
    renderProductionProgress = window._vpmRenderProductionProgress;
    getEntityPrimaryImage = window._vpmGetEntityPrimaryImage;
    parseGalleries = window._vpmParseGalleries;
    queueGalleryUpload = window._vpmQueueGalleryUpload;
    triggerGalleryRemove = window._vpmTriggerGalleryRemove;
    getStageOrder = window._vpmGetStageOrder;
    setNested = window._vpmSetNested;
    _csColor = window._vpmCsColor;
    _refreshSidebarNav = window._vpmRefreshSidebarNav;
    normalizeClipType = window._vpmNormalizeClipType;
    createLightweightClip = window._vpmCreateLightweightClip;
    getClipPrerequisites = window._vpmGetClipPrerequisites;
    getClipScriptOverflow = window._vpmGetClipScriptOverflow;
    getMaxWordsForDuration = window._vpmGetMaxWordsForDuration;
    Constants = window._vpmConstants;

    // Register renderers (all stages + utilities)
    var R = window._vpmRenderers;
    R.startFull = renderStartFull;
    R.scriptFull = renderScriptFull;
    R.studioFull = renderStudioFull;
    R.clipsFull = renderClipsFull;
    R.publishFull = renderPublishFull;

    setupPart2AEvents();
    _snapshotFull('Initial state');
    loadTiptap();
    $(document).on('vpm:beforeRender', function() { _destroyAllEditors(); });
    if (render) render();
    window._vpmPart2AReady = true;
    console.log('[VPM] Part 2A v1.0 initialized (all stages + utilities)');
  }


  // ============================================================
  // SECTION 2: MODAL SYSTEM
  // ============================================================

  var currentModal = null;

  function openModal(title, content, options) {
    options = options || {}; closeModal();
    var size = options.size || 'md';
    var html = '<div class="vpm-modal-backdrop"><div class="vpm-modal vpm-modal-' + size + '">';
    html += '<div class="vpm-modal-header"><h3>' + title + '</h3><button class="vpm-btn-icon vpm-modal-close" data-action="close-modal">' + icon('xmark') + '</button></div>';
    html += '<div class="vpm-modal-body">' + content + '</div>';
    if (options.footer !== false) {
      html += '<div class="vpm-modal-footer"><button class="vpm-btn vpm-btn-outline" data-action="close-modal">Cancel</button>';
      html += '<button class="vpm-btn vpm-btn-primary" data-action="modal-save">' + (options.saveLabel || 'Save') + '</button></div>';
    }
    html += '</div></div>';
    $('body').append(html); currentModal = options;
    setTimeout(function() { $('.vpm-modal-backdrop').addClass('vpm-modal-visible'); }, 10);
  }

  function closeModal() { $('.vpm-modal-backdrop').remove(); currentModal = null; }

  function openConfirmDialog(opts) {
    var html = '<div class="vpm-confirm-backdrop"><div class="vpm-confirm-dialog">';
    html += '<h3>' + esc(opts.title || 'Confirm') + '</h3><p>' + esc(opts.message || 'Are you sure?') + '</p>';
    html += '<div class="vpm-confirm-actions"><button class="vpm-btn vpm-btn-outline" data-action="confirm-cancel">Cancel</button>';
    html += '<button class="vpm-btn ' + (opts.danger ? 'vpm-btn-danger' : 'vpm-btn-primary') + '" data-action="confirm-ok">' + esc(opts.confirmLabel || 'Confirm') + '</button></div></div></div>';
    $('body').append(html);
    $(document).off('click.vpm2a-cok').on('click.vpm2a-cok', '[data-action="confirm-ok"]', function() { _closeConfirm(); if (opts.onConfirm) opts.onConfirm(); });
    $(document).off('click.vpm2a-ccn').on('click.vpm2a-ccn', '[data-action="confirm-cancel"]', function() { _closeConfirm(); });
  }

  function _closeConfirm() { $('.vpm-confirm-backdrop').remove(); $(document).off('click.vpm2a-cok click.vpm2a-ccn'); }

  function collectModalFields() {
    var data = {};
    $('.vpm-modal-body [data-field]').each(function() {
      var $f = $(this);
      data[$f.data('field')] = $f.is(':checkbox') ? $f.is(':checked') : $f.val();
    });
    return data;
  }

  // Pending AI-extracted preferences awaiting user review (set by _openPrefDiffModal,
  // consumed by 'apply-pref-diff'). Stored module-local so the modal can render
  // without re-running the AI.
  var _pendingPrefDiff = null;

  // Render a side-by-side diff modal of AI-proposed preference values vs the
  // current ones, with per-row Accept/Skip checkboxes. The 'apply-pref-diff'
  // handler writes only the rows the user accepted.
  function _openPrefDiffModal(proposed, originalText) {
    if (!proposed || typeof proposed !== 'object') {
      toast('AI returned no usable preferences. Try a more detailed description.', 'warning');
      return;
    }
    var prefs = (S.data.start && S.data.start.preferences) || {};
    var video = S.data.video || {};

    // Field definitions for the diff. allow=function(value) checks validity.
    var fields = [
      { key: 'title',                target: 'video.title',                     label: 'Title',                  display: function(v) { return v; } },
      { key: 'description',          target: 'video.description',               label: 'Description',            display: function(v) { return v; } },
      { key: 'target_audience',      target: 'video.target_audience',           label: 'Target Audience',        display: function(v) { return v; } },
      { key: 'language',             target: 'preferences.language',            label: 'Language',               display: function(v) { return _diffLabel(Constants.LANGUAGES, v); }, allow: function(v) { return !!Constants.LANGUAGES[v]; } },
      { key: 'platforms',            target: 'preferences.platforms',           label: 'Target Platforms',       display: function(v) { return (v || []).map(function(p) { return _diffLabel(Constants.PLATFORMS, p); }).join(', '); }, isArray: true, allow: function(v) { return Array.isArray(v) && v.length && v.every(function(p) { return !!Constants.PLATFORMS[p]; }); } },
      { key: 'aspect_ratio',         target: 'preferences.aspect_ratio',        label: 'Aspect Ratio',           display: function(v) { return _diffLabel(Constants.ASPECT_RATIOS, v); }, allow: function(v) { return !!Constants.ASPECT_RATIOS[v]; } },
      { key: 'target_duration',      target: 'preferences.target_duration',     label: 'Target Duration',        display: function(v) { return v + 's'; }, allow: function(v) { return typeof v === 'number' && v > 0; } },
      { key: 'audio_mode',           target: 'preferences.audio_mode',          label: 'Audio Mode',             display: function(v) { return _diffLabel(Constants.AUDIO_MODES, v); }, allow: function(v) { return !!Constants.AUDIO_MODES[v]; } },
      { key: 'production_mode',      target: 'preferences.production_mode',     label: 'Production Mode',        display: function(v) { return _diffLabel(Constants.PRODUCTION_MODES, v); }, allow: function(v) { return !!Constants.PRODUCTION_MODES[v]; } },
      { key: 'presenter_preference', target: 'preferences.presenter_preference',label: 'Presenter Preference',   display: function(v) { return _diffLabel(Constants.PRESENTER_PREFS, v); }, allow: function(v) { return !!Constants.PRESENTER_PREFS[v]; } },
      { key: 'video_style',          target: 'preferences.video_style',         label: 'Video Style',            display: function(v) { return _diffLabel(Constants.VIDEO_STYLES, v); }, allow: function(v) { return !!Constants.VIDEO_STYLES[v]; } },
      { key: 'tone',                 target: 'preferences.tone',                label: 'Tone',                   display: function(v) { return _diffLabel(Constants.TONES, v); }, allow: function(v) { return !!Constants.TONES[v]; } },
      { key: 'keywords',             target: 'video.keywords',                  label: 'Keywords',               display: function(v) { return (v || []).join(', '); }, isArray: true }
    ];

    // Build rows
    var rows = [];
    var acceptableCount = 0;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var raw = proposed[f.key];
      var hasValue = f.isArray ? (Array.isArray(raw) && raw.length) : (raw !== '' && raw !== null && raw !== undefined && raw !== 0 && !(typeof raw === 'number' && isNaN(raw)));
      if (!hasValue) continue;
      var valid = f.allow ? f.allow(raw) : true;
      if (!valid) continue;
      var current;
      if (f.target.indexOf('preferences.') === 0) current = prefs[f.target.slice('preferences.'.length)];
      else current = video[f.target.slice('video.'.length)];
      var unchanged = JSON.stringify(current) === JSON.stringify(raw);
      rows.push({ field: f, proposed: raw, current: current, unchanged: unchanged });
      if (!unchanged) acceptableCount++;
    }

    if (!rows.length) {
      toast('AI could not extract any preferences from that text. Try adding more detail.', 'info');
      return;
    }
    if (!acceptableCount) {
      toast('AI suggestions all match your current preferences — nothing to apply', 'info');
      return;
    }

    _pendingPrefDiff = { rows: rows, originalText: originalText || '' };

    var body = '';
    body += '<p class="vpm-text-sm vpm-text-muted" style="margin-bottom:12px">' + icon('wand-magic-sparkles') + ' Review AI-extracted values. Uncheck any you want to skip — only checked rows will be applied.</p>';
    body += '<div class="vpm-pref-diff-actions" style="display:flex;gap:8px;margin-bottom:10px">';
    body += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="pref-diff-toggle-all" data-state="on">' + icon('check-double') + ' Accept All</button>';
    body += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="pref-diff-toggle-all" data-state="off">' + icon('xmark') + ' Skip All</button>';
    body += '</div>';
    body += '<table class="vpm-pref-diff-table"><thead><tr><th style="width:32px">Use</th><th>Field</th><th>Current</th><th>AI Suggests</th></tr></thead><tbody>';
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var checked = row.unchanged ? '' : ' checked';
      var disabled = row.unchanged ? ' disabled' : '';
      body += '<tr class="' + (row.unchanged ? 'vpm-pref-diff-row-same' : 'vpm-pref-diff-row-diff') + '">';
      body += '<td><input type="checkbox" class="vpm-pref-diff-cb" data-idx="' + r + '"' + checked + disabled + '></td>';
      body += '<td><strong>' + esc(row.field.label) + '</strong></td>';
      body += '<td class="vpm-text-muted">' + esc(row.field.display(row.current) || '—') + '</td>';
      body += '<td>' + (row.unchanged ? '<span class="vpm-text-muted">(same)</span>' : esc(row.field.display(row.proposed))) + '</td>';
      body += '</tr>';
    }
    body += '</tbody></table>';

    openModal(icon('wand-magic-sparkles') + ' AI Preference Suggestions', body, {
      size: 'lg',
      saveLabel: 'Apply Selected',
      onSave: function() {
        if (!_pendingPrefDiff) { closeModal(); return; }
        var applied = 0;
        S.data.start.preferences = S.data.start.preferences || {};
        $('.vpm-pref-diff-cb').each(function() {
          var $cb = $(this);
          if (!$cb.is(':checked') || $cb.is(':disabled')) return;
          var idx = parseInt($cb.data('idx'), 10);
          var row = _pendingPrefDiff.rows[idx]; if (!row) return;
          var target = row.field.target;
          if (target.indexOf('preferences.') === 0) {
            S.data.start.preferences[target.slice('preferences.'.length)] = row.proposed;
            if (target === 'preferences.platforms' && Array.isArray(row.proposed) && row.proposed.length) {
              S.data.start.preferences.platform = row.proposed[0];
              var pdef = Constants.PLATFORMS[row.proposed[0]];
              if (pdef && pdef.defaultAspect && !S.data.start.preferences.aspect_ratio) {
                S.data.start.preferences.aspect_ratio = pdef.defaultAspect;
              }
            }
          } else {
            S.data.video[target.slice('video.'.length)] = row.proposed;
          }
          applied++;
        });
        if (applied) {
          S.data.start.raw_input = _pendingPrefDiff.originalText || S.data.start.raw_input || '';
          S.data.start.import_source = {
            type: 'ai-extracted', imported_at: new Date().toISOString(),
            fields_mapped: _pendingPrefDiff.rows.filter(function(r) { return !r.unchanged; }).map(function(r) { return r.field.key; })
          };
          if (window._vpmLogActivity) window._vpmLogActivity('ai_prefs_applied', applied + ' preference(s) applied from AI extraction');
          if (window._vpmSnapshot) window._vpmSnapshot('AI preference extraction');
          syncToTextarea();
          S.startStep = 'preferences';
          render();
          toast('Applied ' + applied + ' preference' + (applied === 1 ? '' : 's') + '. Review them below.', 'success');
        } else {
          toast('No preferences selected. Nothing applied.', 'info');
        }
        _pendingPrefDiff = null;
        closeModal();
      }
    });
  }

  function _diffLabel(map, key) {
    if (!key) return '';
    if (map && map[key] && map[key].label) return map[key].label;
    return String(key);
  }


  // ============================================================
  // SECTION 3: UNDO/REDO
  // ============================================================

  function _snapshotFull(label) {
    S.undoStack = S.undoStack || [];
    S.undoStack.push({ label: label || '', data: deepClone(S.data), meta: deepClone(S.meta), activity: deepClone(S.activity) });
    if (S.undoStack.length > 50) S.undoStack.shift();
    S.redoStack = [];
  }

  // Override Part 1's stub
  window._vpmSnapshot = _snapshotFull;

  function undo() {
    if (!S.undoStack || S.undoStack.length <= 1) { toast('Nothing to undo', 'info'); return; }
    S.redoStack = S.redoStack || [];
    S.redoStack.push(S.undoStack.pop());
    var prev = S.undoStack[S.undoStack.length - 1];
    S.data = deepClone(prev.data); S.meta = deepClone(prev.meta); S.activity = deepClone(prev.activity);
    buildMaps(); syncToTextarea(); render();
    toast('Undone', 'info');
  }

  function redo() {
    if (!S.redoStack || !S.redoStack.length) { toast('Nothing to redo', 'info'); return; }
    var next = S.redoStack.pop();
    S.undoStack.push(next);
    S.data = deepClone(next.data); S.meta = deepClone(next.meta); S.activity = deepClone(next.activity);
    buildMaps(); syncToTextarea(); render();
    toast('Redone', 'info');
  }

  function _copyToClipboard(text) {
    if (navigator.clipboard) { navigator.clipboard.writeText(text).catch(function() { _fallbackCopy(text); }); }
    else { _fallbackCopy(text); }
    toast('Copied to clipboard', 'success');
  }
  function _fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {} document.body.removeChild(ta);
  }


  // ============================================================
  // SECTION 4: TIPTAP LOADING & N-SECTION EDITORS
  // ============================================================

  var _tiptapReady = false;
  var _tiptapEditors = {}; // keyed by section.id
  var _tiptapSyncTimer = null;

  function loadTiptap() {
    if (window.TiptapBundle || window.tiptap) { _tiptapReady = true; console.log('[VPM] Tiptap already loaded'); return; }
    // Try multiple CDN sources
    var sources = [
      'https://goultraai.com/libraries/tiptap/tiptap-bundle.js'
    ];
    function tryLoad(idx) {
      if (idx >= sources.length) { console.error('[VPM] All Tiptap sources failed'); toast('Script editor failed to load', 'error'); return; }
      var script = document.createElement('script');
      script.src = sources[idx];
      script.onload = function() { _tiptapReady = true; console.log('[VPM] Tiptap loaded from source ' + idx); if (S.currentStage === 'script') render(); };
      script.onerror = function() { console.warn('[VPM] Tiptap source ' + idx + ' failed, trying next...'); tryLoad(idx + 1); };
      document.head.appendChild(script);
    }
    tryLoad(0);
  }

  function _initSectionEditor(key, containerId, getContent, setContent) {
    _destroySectionEditor(key);
    var bundle = window.TiptapBundle || window.tiptap;
    if (!bundle || !bundle.Editor) return;
    var el = document.getElementById(containerId);
    if (!el) return;
    var sc = S.data.script || {};
    _tiptapEditors[key] = new bundle.Editor({
      element: el,
      extensions: [bundle.StarterKit],
      content: getContent() || '',
      editable: !sc.finalized,
      onUpdate: function(arg) {
        var html = arg.editor.getHTML();
        var wc = countWords(arg.editor.getText());
        setContent(html, wc);
        S.dirty = true;
        if (_tiptapSyncTimer) clearTimeout(_tiptapSyncTimer);
        _tiptapSyncTimer = setTimeout(function() {
          recomputeScriptDurations();
          syncToTextarea();
          _updateScriptStatsUI();
        }, 800);
      }
    });
  }

  function _destroySectionEditor(key) {
    if (_tiptapEditors[key]) { try { _tiptapEditors[key].destroy(); } catch(e) {} _tiptapEditors[key] = null; }
  }

  function _destroyAllEditors() {
    for (var k in _tiptapEditors) { if (_tiptapEditors[k]) _destroySectionEditor(k); }
    _tiptapEditors = {};
  }

  function _initAllScriptEditors() {
    if (!_tiptapReady) return;
    setTimeout(function() {
      var sc = S.data.script || {};
      var sections = sc.sections || [];
      for (var i = 0; i < sections.length; i++) {
        (function(sec) {
          _initSectionEditor(sec.id, 'vpmScriptSection_' + sec.id,
            function() { return sec.content || ''; },
            function(html, wc) { sec.content = html; sec.word_count = wc; }
          );
        })(sections[i]);
      }
    }, 50);
  }

  function _flushAllEditors() {
    var sc = S.data.script || {};
    var sections = sc.sections || [];
    for (var k in _tiptapEditors) {
      if (!_tiptapEditors[k]) continue;
      var html = _tiptapEditors[k].getHTML();
      var wc = countWords(_tiptapEditors[k].getText());
      var sec = sections.find(function(s) { return s.id === k; });
      if (sec) { sec.content = html; sec.word_count = wc; }
    }
    recomputeScriptDurations();
  }

  function _updateScriptStatsUI() {
    var sc = S.data.script || {};
    var $s = $('#vpmScriptStats');
    if ($s.length) {
      var td = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;
      $s.html(
        '<span class="vpm-text-sm vpm-text-muted">' + formatNumber(sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</span>' +
        '<span class="vpm-text-sm vpm-text-muted">Target: ' + formatDuration(td) + '</span>'
      );
      // Update progress bar
      var $bar = $('#vpmScriptProgressFill');
      if ($bar.length) {
        var pct = Math.min(100, Math.round(((sc.estimated_duration || 0) / Math.max(td, 1)) * 100));
        $bar.css('width', pct + '%');
      }
      // Update per-section stats
      var sections = sc.sections || [];
      for (var i = 0; i < sections.length; i++) {
        var $secStats = $('[data-section-stats="' + sections[i].id + '"]');
        if ($secStats.length) {
          $secStats.html(
            (sections[i].word_count || 0) + 'w \u00B7 ~' + formatDuration(sections[i].estimated_duration || 0)
          );
        }
      }
    }
  }


  // ============================================================
  // SECTION 5: START VIEW — FULL
  // ============================================================

  function renderStartFull() {
    var st = S.data.start || {};
    // Determine current start step
    if (!S.startStep) {
      S.startStep = (st.processed || st.import_source) ? 'preferences' : 'import';
    }
    var html = '<div class="vpm-view"><div class="vpm-start-container">';
    // Step indicator bar
    html += _renderStartStepBar();
    // Route to sub-renderer
    switch (S.startStep) {
      case 'preferences': html += _renderStartPreferences(); break;
      case 'review':      html += _renderStartReview(); break;
      default:            html += _renderStartImport(); break;
    }
    html += '</div></div>';
    return html;
  }

  // --- Step indicator bar ---
  function _renderStartStepBar() {
    var steps = [
      { key: 'import', label: 'Import', icon: 'file-import' },
      { key: 'preferences', label: 'Preferences', icon: 'gears' },
      { key: 'review', label: 'Review & Launch', icon: 'rocket' }
    ];
    var stepOrder = ['import', 'preferences', 'review'];
    var currentIdx = stepOrder.indexOf(S.startStep || 'import');
    var html = '<div class="vpm-start-steps">';
    for (var i = 0; i < steps.length; i++) {
      var isDone = i < currentIdx;
      var isCurrent = i === currentIdx;
      html += '<div class="vpm-start-step' + (isDone ? ' vpm-start-step-done' : '') + (isCurrent ? ' vpm-start-step-active' : '') + '" data-action="start-goto-step" data-step="' + steps[i].key + '">';
      html += '<div class="vpm-start-step-num">' + (isDone ? icon('circle-check') : (i + 1)) + '</div>';
      html += '<div class="vpm-start-step-label">' + icon(steps[i].icon) + ' ' + esc(steps[i].label) + '</div>';
      html += '</div>';
      if (i < steps.length - 1) html += '<div class="vpm-start-step-connector' + (isDone ? ' vpm-start-step-connector-done' : '') + '"></div>';
    }
    html += '</div>';
    return html;
  }

  // --- Step 1: Import ---
  function _renderStartImport() {
    var st = S.data.start || {};
    var html = '';
    if (!S._startImportTab) S._startImportTab = 'describe';

    // Hero
    html += '<div class="vpm-start-hero"><div class="vpm-start-icon">' + icon('file-import') + '</div>';
    html += '<h1 class="vpm-start-title">Start Your Video</h1>';
    html += '<p class="vpm-start-desc">Describe your idea in plain text or paste an existing plan. AI will pre-fill your preferences so you can launch in seconds.</p></div>';

    if (st.import_source) {
      html += '<div class="vpm-info-banner vpm-info-banner-success" style="display:flex;align-items:center;gap:12px">';
      html += icon('circle-check') + ' <span><strong>Data imported</strong>';
      var mapped = st.import_source.fields_mapped || [];
      if (mapped.length) html += ' — ' + mapped.length + ' fields mapped';
      html += '</span>';
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="start-goto-step" data-step="preferences" style="margin-left:auto">' + icon('arrow-right') + ' Continue to Preferences</button>';
      html += '</div>';
    }

    html += '<div class="vpm-panel vpm-start-import-panel">';
    html += '<div class="vpm-panel-title">' + icon('file-import') + ' Tell us about your video</div>';

    // 3 tabs: Describe (default), Paste JSON, Upload File
    html += '<div class="vpm-inner-tabs" style="margin-bottom:16px">';
    html += '<button class="vpm-inner-tab' + (S._startImportTab === 'describe' ? ' vpm-inner-tab-active' : '') + '" data-action="start-import-tab" data-tab="describe">' + icon('wand-magic-sparkles') + ' Describe Your Video</button>';
    html += '<button class="vpm-inner-tab' + (S._startImportTab === 'paste' ? ' vpm-inner-tab-active' : '') + '" data-action="start-import-tab" data-tab="paste">' + icon('clipboard') + ' Paste Planner JSON</button>';
    html += '<button class="vpm-inner-tab' + (S._startImportTab === 'upload' ? ' vpm-inner-tab-active' : '') + '" data-action="start-import-tab" data-tab="upload">' + icon('upload') + ' Upload File</button>';
    html += '</div>';

    // Describe tab — free text + AI extraction
    html += '<div class="vpm-import-tab-pane"' + (S._startImportTab !== 'describe' ? ' style="display:none"' : '') + ' data-start-import-tab="describe">';
    html += '<p class="vpm-text-sm vpm-text-muted" style="margin-bottom:8px">Describe your video idea, target audience, tone, platform, length — anything you know. AI will infer the preferences and show you the proposed values for review before applying.</p>';
    html += '<textarea class="vpm-textarea" id="vpmStartDescribeText" rows="10" placeholder="Example: A 90-second YouTube Short explaining how solo founders can use AI tools to ship faster. Energetic tone, single AI presenter, vertical format, English.">' + esc(st.raw_input || '') + '</textarea>';
    html += '<div style="margin-top:12px;text-align:right">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-lg" data-action="start-ai-extract">' + icon('wand-magic-sparkles') + ' Auto-fill Preferences with AI</button>';
    html += '</div></div>';

    // Paste JSON tab
    html += '<div class="vpm-import-tab-pane"' + (S._startImportTab !== 'paste' ? ' style="display:none"' : '') + ' data-start-import-tab="paste">';
    html += '<textarea class="vpm-textarea" id="vpmStartImportJson" rows="14" style="font-family:var(--vpm-font-mono);font-size:12px" placeholder=\'Paste your Video Planner JSON here...\'></textarea>';
    html += '<div style="margin-top:12px;text-align:right">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-lg" data-action="start-execute-import">' + icon('file-import') + ' Import & Continue to Preferences</button>';
    html += '</div></div>';

    // Upload tab
    html += '<div class="vpm-import-tab-pane"' + (S._startImportTab !== 'upload' ? ' style="display:none"' : '') + ' data-start-import-tab="upload">';
    html += '<div class="vpm-upload-zone" id="vpmStartUploadZone">';
    html += '<div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
    html += '<p>Drop a .json file here or click to browse</p>';
    html += '<p class="vpm-text-muted vpm-text-xs">Max 500KB</p>';
    html += '<input type="file" accept=".json,application/json" id="vpmStartFileInput" style="display:none">';
    html += '</div></div>';

    html += '<div id="vpmStartImportPreview" style="margin-top:12px"></div>';
    html += '</div>';

    // Skip option
    html += '<div style="text-align:center;margin-top:16px">';
    html += '<button class="vpm-btn vpm-btn-link" data-action="start-goto-step" data-step="preferences">Skip — set preferences manually ' + icon('arrow-right') + '</button>';
    html += '</div>';

    return html;
  }

  // --- Step 2: Preferences ---
  function _renderStartPreferences() {
    var st = S.data.start || {};
    var prefs = st.preferences || {};
    var html = '';

    // Import summary banner
    if (st.import_source) {
      html += '<div class="vpm-info-banner" style="display:flex;align-items:center;gap:8px">' + icon('circle-check');
      html += ' <strong>' + esc(S.data.video.title || 'Video Plan Imported') + '</strong>';
      var mapped = st.import_source.fields_mapped || [];
      if (mapped.length) html += ' <span class="vpm-text-muted">\u2014 ' + mapped.length + ' fields mapped</span>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-import" style="margin-left:auto">' + icon('xmark') + ' Clear Import</button></div>';
    }

    // --- Mode Selector ---
    html += '<div class="vpm-panel vpm-start-mode-panel">';
    html += '<div class="vpm-panel-title">' + icon('rocket') + ' Workflow Mode</div>';
    html += '<div class="vpm-mode-cards">';
    html += '<div class="vpm-mode-card' + (S.mode === 'standard' ? ' vpm-mode-card-active' : '') + '" data-action="set-mode" data-mode="standard">';
    html += '<div class="vpm-mode-card-head"><span class="vpm-mode-dot vpm-mode-dot-std"></span><strong>Standard</strong><span class="vpm-mode-card-badge">5 stages</span></div>';
    html += '<p class="vpm-mode-card-desc">Quick & focused workflow for straightforward videos</p>';
    html += '<div class="vpm-mode-card-stages">Start \u2192 Blueprint \u2192 Script \u2192 Clips \u2192 Publish</div></div>';
    html += '<div class="vpm-mode-card' + (S.mode === 'advanced' ? ' vpm-mode-card-active' : '') + '" data-action="set-mode" data-mode="advanced">';
    html += '<div class="vpm-mode-card-head"><span class="vpm-mode-dot vpm-mode-dot-adv"></span><strong>Advanced</strong><span class="vpm-mode-card-badge vpm-mode-card-badge-adv">7 stages</span></div>';
    html += '<p class="vpm-mode-card-desc">Full pipeline with Research + Studio for visual control</p>';
    html += '<div class="vpm-mode-card-stages">Start \u2192 Research \u2192 Blueprint \u2192 Script \u2192 Studio \u2192 Clips \u2192 Publish</div></div>';
    html += '</div></div>';

    // --- Primary Preferences (9 fields, always expanded) ---
    html += '<div class="vpm-panel vpm-start-prefs">';
    html += '<div class="vpm-panel-title">' + icon('gears') + ' Primary Preferences <span class="vpm-text-muted vpm-text-xs" style="font-weight:400">— the choices that shape every clip</span></div>';
    html += '<div class="vpm-prefs-grid">';

    // Language
    html += _prefGroup('Language', 'file-lines', false,
      _chipBar(Constants.LANGUAGES, prefs.language || 'english', 'preferences.language'));

    // Platform — multi-select
    html += _prefGroup('Target Platforms', 'share-nodes', true, _platformMultiSelect(prefs.platforms || [prefs.platform || 'youtube']));

    // Aspect Ratio
    html += _prefGroup('Aspect Ratio', 'image', false, _aspectCards(prefs.aspect_ratio || '16:9'));

    // Target Duration (enhanced)
    html += _prefGroup('Target Duration', 'clock', true, _enhancedDurationControl(prefs.target_duration || 120));

    // Production Mode
    html += _prefGroup('Production Mode', 'film', true, _prodModeCards(prefs.production_mode || 'full-ai'));

    // Presenter Preference
    html += _prefGroup('Presenter Preference', 'user', true,
      _chipBar(Constants.PRESENTER_PREFS, prefs.presenter_preference || 'ai-only', 'preferences.presenter_preference'));

    // Audio Mode (expanded cards)
    html += _prefGroup('Audio Mode', 'microphone-lines', true, _audioModeCards(prefs.audio_mode || 'ai-audio-with-video'));

    // Video Style
    html += _prefGroup('Video Style', 'palette', true, _videoStyleCards(prefs.video_style || ''));

    // Tone (drives narrative voice for AI script + research)
    html += _prefGroup('Tone', 'face-smile', true,
      _chipBar(Constants.TONES, prefs.tone || 'friendly', 'preferences.tone'));

    html += '</div></div>';

    // --- Advanced Options header + collapsible groups ---
    html += '<div class="vpm-start-advanced-header"><span>' + icon('sliders') + ' Advanced Options</span>';
    html += '<span class="vpm-text-muted vpm-text-xs" style="margin-left:auto">Defaults work for most videos \u2014 expand to fine-tune</span></div>';

    // 1) Voice & TTS (only when audio mode supports voice profile)
    var audioModeDef = Constants.AUDIO_MODES[prefs.audio_mode || 'ai-audio-with-video'] || {};
    if (audioModeDef.supportsVoiceProfile) {
      var vp = prefs.voice_profile || {};
      var vpSummary = [];
      if (vp.gender) vpSummary.push(Constants.VOICE_GENDERS[vp.gender] || vp.gender);
      if (vp.style) vpSummary.push(Constants.VOICE_STYLES[vp.style] || vp.style);
      if (vp.accent) vpSummary.push(Constants.VOICE_ACCENTS[vp.accent] || vp.accent);
      html += _advancedGroup('voice', 'Voice & TTS', 'microphone',
        vpSummary.length ? esc(vpSummary.join(' \u00b7 ')) : 'No voice profile set',
        _voiceProfileEditor(vp));
    }

    // 2) AI Models (+ Seedance audio direction when applicable)
    var modelsContent = _renderModelSelectionPanel(prefs);
    var _primaryVMPref = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    if (_primaryVMPref === 'seedance') modelsContent += _renderSeedanceAudioDirectionPanel(prefs);
    var modelLabel = (Constants.VIDEO_MODELS && Constants.VIDEO_MODELS[_primaryVMPref] && Constants.VIDEO_MODELS[_primaryVMPref].label) || _primaryVMPref;
    html += _advancedGroup('models', 'AI Models', 'wand-magic-sparkles',
      'Primary video: ' + esc(modelLabel) + (_primaryVMPref === 'seedance' ? ' \u2014 Seedance audio options included' : ''),
      modelsContent);

    // 3) Brand Library
    html += _advancedGroup('brand', 'Brand Library', 'palette',
      'Pick which brand looks, environments and scenes are available for this video',
      _renderBrandLibrarySelectionPanel());

    // 4) Clips & Templates
    var _inclTpl = prefs.include_templates;
    var selectedTypes = st.selected_clip_types || [];
    var clipsSummary = (_inclTpl !== false ? 'Templates on' : 'Templates off');
    clipsSummary += selectedTypes.length ? ' \u00b7 ' + selectedTypes.length + ' clip types pinned' : ' \u00b7 Auto-pick from production mode';
    var clipsContent = '';
    clipsContent += '<div class="vpm-flex-between" style="padding:8px 0">';
    clipsContent += '<div><strong class="vpm-text-sm">' + icon('layer-group') + ' Include Template Clips</strong>';
    clipsContent += '<div class="vpm-text-xs vpm-text-muted">Auto-insert branded intro, outro & chapter titles when generating clips</div></div>';
    clipsContent += '<label class="vpm-toggle-switch"><input type="checkbox" data-action="toggle-include-templates"' + (_inclTpl !== false ? ' checked' : '') + '> <span class="vpm-text-sm">' + (_inclTpl !== false ? 'On' : 'Off') + '</span></label>';
    clipsContent += '</div>';
    clipsContent += '<div class="vpm-text-label" style="margin-top:12px;margin-bottom:6px">' + icon('film') + ' Clip Types <span class="vpm-text-muted vpm-text-xs">(optional \u2014 auto-selected from production mode if skipped)</span></div>';
    var tracks = { ai: [], 'non-ai': [], template: [] };
    for (var ctk in Constants.CLIP_TYPES) tracks[Constants.CLIP_TYPES[ctk].track].push(ctk);
    var trackLabels = { ai: 'AI Track', 'non-ai': 'Non-AI Track', template: 'Template Track' };
    for (var trk in trackLabels) {
      clipsContent += '<div style="margin-top:8px"><div class="vpm-text-xs vpm-text-muted" style="margin-bottom:4px">' + esc(trackLabels[trk]) + '</div>';
      clipsContent += '<div class="vpm-chip-bar" style="flex-wrap:wrap">';
      for (var ti = 0; ti < tracks[trk].length; ti++) {
        var ctKey = tracks[trk][ti];
        var ct = Constants.CLIP_TYPES[ctKey];
        var isSelected = selectedTypes.indexOf(ctKey) >= 0;
        clipsContent += '<button class="vpm-chip' + (isSelected ? ' vpm-chip-active' : '') + '" data-action="toggle-clip-type" data-value="' + esc(ctKey) + '" style="border-color:' + ct.color + '">';
        clipsContent += icon(ct.icon) + ' ' + esc(ct.label) + '</button>';
      }
      clipsContent += '</div></div>';
    }
    clipsContent += '<div style="margin-top:10px">';
    clipsContent += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="auto-select-clip-types">' + icon('sparkles') + ' Auto-select from Production Mode</button>';
    if (selectedTypes.length) clipsContent += ' <button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-clip-types">' + icon('xmark') + ' Clear All</button>';
    clipsContent += '</div>';
    html += _advancedGroup('clips', 'Clips & Templates', 'film', clipsSummary, clipsContent);

    // Navigation
    html += '<div class="vpm-start-nav-buttons">';
    html += '<button class="vpm-btn vpm-btn-outline" data-action="start-goto-step" data-step="import">' + icon('arrow-left') + ' Back to Import</button>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-lg" data-action="start-goto-step" data-step="review">' + icon('arrow-right') + ' Review & Launch</button>';
    html += '</div>';

    return html;
  }

  // Render a collapsible Advanced group. Open state persists in S.meta._ui.advanced_panels[key].
  function _advancedGroup(key, label, iconName, summary, contentHtml) {
    var ui = (S.meta._ui = S.meta._ui || {});
    var panels = (ui.advanced_panels = ui.advanced_panels || {});
    var open = !!panels[key];
    var h = '';
    h += '<div class="vpm-panel vpm-adv-group' + (open ? ' vpm-adv-group-open' : '') + '">';
    h += '<div class="vpm-adv-group-head" data-action="toggle-adv-panel" data-key="' + esc(key) + '">';
    h += '<span class="vpm-adv-group-title">' + icon(iconName) + ' ' + esc(label) + '</span>';
    h += '<span class="vpm-adv-group-summary">' + summary + '</span>';
    h += '<span class="vpm-adv-group-chev">' + icon(open ? 'chevron-up' : 'chevron-down') + '</span>';
    h += '</div>';
    if (open) h += '<div class="vpm-adv-group-body">' + contentHtml + '</div>';
    h += '</div>';
    return h;
  }

  // --- Step 3: Review & Launch ---
  function _renderStartReview() {
    var st = S.data.start || {};
    var prefs = st.preferences || {};
    var html = '';

    html += '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('rocket') + ' Ready to Launch</div>';

    html += '<div class="vpm-review-grid">';
    html += _reviewRow('Title', S.data.video.title || 'Untitled');
    html += _reviewRow('Description', truncate(S.data.video.description || '', 120) || '\u2014');
    html += _reviewRow('Workflow Mode', S.mode === 'advanced' ? 'Advanced (7 stages)' : 'Standard (5 stages)');
    html += _reviewRow('Language', (Constants.LANGUAGES[prefs.language] || {}).label || prefs.language || 'English');
    html += _reviewRow('Audio Mode', (Constants.AUDIO_MODES[prefs.audio_mode] || {}).label || prefs.audio_mode);
    if (prefs.voice_profile && (prefs.voice_profile.style || prefs.voice_profile.custom_description)) {
      var vpParts = [];
      if (prefs.voice_profile.gender) vpParts.push(prefs.voice_profile.gender);
      if (prefs.voice_profile.style) vpParts.push(prefs.voice_profile.style);
      if (prefs.voice_profile.accent) vpParts.push(prefs.voice_profile.accent + ' accent');
      html += _reviewRow('Voice Profile', vpParts.join(', ') || prefs.voice_profile.custom_description || '\u2014');
    }
    html += _reviewRow('Video Style', (Constants.VIDEO_STYLES[prefs.video_style] || {}).label || prefs.video_style || 'Not set');
    var platLabels = (prefs.platforms || [prefs.platform || 'youtube']).map(function(p) { return (Constants.PLATFORMS[p] || {}).label || p; });
    html += _reviewRow('Platforms', platLabels.join(', '));
    html += _reviewRow('Aspect Ratio', (Constants.ASPECT_RATIOS[prefs.aspect_ratio] || {}).label || prefs.aspect_ratio || '16:9');
    html += _reviewRow('Target Duration', formatDuration(prefs.target_duration || 120));
    html += _reviewRow('Production Mode', (Constants.PRODUCTION_MODES[prefs.production_mode] || {}).label || prefs.production_mode);
    html += _reviewRow('Presenter', (Constants.PRESENTER_PREFS[prefs.presenter_preference] || {}).label || prefs.presenter_preference);

    // Model selection
    var primaryVM = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    html += _reviewRow('Video Model', (Constants.VIDEO_MODELS[primaryVM] || {}).label || primaryVM);
    // Seedance audio direction (shown when Seedance is primary)
    if (primaryVM === 'seedance') {
      var sadLabel = ((Constants.SEEDANCE_AUDIO_DIRECTIONS || {})[prefs.seedance_audio_direction || 'voice-ambient'] || {}).label || 'Option A: Voice + Ambient';
      html += _reviewRow('Seedance Audio', sadLabel);
    }
    var primaryIM = prefs.primary_image_model || (S.meta.aiPreferences || {}).imageModel || 'imagen-3';
    html += _reviewRow('Image Model', (Constants.IMAGE_MODELS[primaryIM] || {}).label || primaryIM);

    // Import coverage
    if (st.import_source) {
      var fields = st.import_source.fields_mapped || [];
      html += _reviewRow('Imported Data', fields.join(', ') || 'No fields mapped');
    }
    html += '</div>';

    // Launch button
    var nextStage = S.mode === 'advanced' ? 'research' : 'blueprint';
    html += '<div style="text-align:center;margin-top:20px">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-lg" data-action="start-launch" style="min-width:300px">' + icon('rocket') + ' Launch \u2014 Continue to ' + (Constants.APP_STAGES[nextStage] || {}).label + '</button>';
    html += '</div>';
    html += '</div>';

    // Navigation
    html += '<div class="vpm-start-nav-buttons">';
    html += '<button class="vpm-btn vpm-btn-outline" data-action="start-goto-step" data-step="preferences">' + icon('arrow-left') + ' Back to Preferences</button>';
    html += '</div>';

    return html;
  }

  function _reviewRow(label, value) {
    return '<div class="vpm-review-row"><div class="vpm-review-label">' + esc(label) + '</div><div class="vpm-review-value">' + esc(value || '\u2014') + '</div></div>';
  }

  // --- New Start Helpers ---

  // Expanded audio mode cards
  function _audioModeCards(selected) {
    var html = '<div class="vpm-audio-mode-cards">';
    for (var k in Constants.AUDIO_MODES) {
      var am = Constants.AUDIO_MODES[k];
      var isActive = selected === k;
      html += '<div class="vpm-audio-mode-card' + (isActive ? ' vpm-audio-mode-active' : '') + '" data-action="set-pref" data-path="preferences.audio_mode" data-value="' + esc(k) + '">';
      html += '<div class="vpm-audio-mode-head">';
      html += '<div class="vpm-audio-mode-icon">' + icon(am.icon) + '</div>';
      html += '<div class="vpm-audio-mode-label">' + esc(am.label) + '</div>';
      if (am.priority === 1) html += '<span class="vpm-badge-recommended">Recommended</span>';
      html += '</div>';
      html += '<div class="vpm-audio-mode-desc">' + esc(am.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // Voice profile editor
  function _voiceProfileEditor(profile) {
    var html = '<div class="vpm-voice-profile-grid">';
    // Gender
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Gender</label><div class="vpm-chip-bar">';
    for (var g in Constants.VOICE_GENDERS) {
      html += '<button class="vpm-chip' + (profile.gender === g ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="gender" data-value="' + g + '">' + esc(Constants.VOICE_GENDERS[g]) + '</button>';
    }
    html += '</div></div>';
    // Age Range
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Age Range</label><div class="vpm-chip-bar">';
    for (var a in Constants.VOICE_AGE_RANGES) {
      html += '<button class="vpm-chip' + (profile.age_range === a ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="age_range" data-value="' + a + '">' + esc(Constants.VOICE_AGE_RANGES[a]) + '</button>';
    }
    html += '</div></div>';
    // Style
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Voice Style</label><div class="vpm-chip-bar" style="flex-wrap:wrap">';
    for (var s in Constants.VOICE_STYLES) {
      html += '<button class="vpm-chip' + (profile.style === s ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="style" data-value="' + s + '">' + esc(Constants.VOICE_STYLES[s]) + '</button>';
    }
    html += '</div></div>';
    // Accent
    html += '<div class="vpm-voice-field"><label class="vpm-text-label">Accent</label><div class="vpm-chip-bar" style="flex-wrap:wrap">';
    for (var ac in Constants.VOICE_ACCENTS) {
      html += '<button class="vpm-chip' + (profile.accent === ac ? ' vpm-chip-active' : '') + '" data-action="set-voice-profile" data-field="accent" data-value="' + ac + '">' + esc(Constants.VOICE_ACCENTS[ac]) + '</button>';
    }
    html += '</div></div>';
    // Custom description
    html += '<div class="vpm-voice-field vpm-voice-field-full"><label class="vpm-text-label">Custom Voice Description</label>';
    html += '<textarea class="vpm-textarea" rows="2" data-action="set-voice-profile-text" data-field="custom_description" placeholder="e.g. Deep, warm male voice with a slight Southern accent, conversational pace...">' + esc(profile.custom_description || '') + '</textarea>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  // Video style cards
  function _videoStyleCards(selected) {
    var html = '<div class="vpm-video-style-cards">';
    for (var k in Constants.VIDEO_STYLES) {
      var vs = Constants.VIDEO_STYLES[k];
      var isActive = selected === k;
      html += '<div class="vpm-video-style-card' + (isActive ? ' vpm-video-style-active' : '') + '" data-action="set-pref" data-path="preferences.video_style" data-value="' + esc(k) + '">';
      html += '<div class="vpm-video-style-icon">' + icon(vs.icon) + '</div>';
      html += '<div class="vpm-video-style-label">' + esc(vs.label) + '</div>';
      html += '<div class="vpm-video-style-desc">' + esc(vs.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    // Custom textarea if custom selected
    if (selected === 'custom') {
      var customHint = ((S.data.start || {}).preferences || {}).custom_style_keywords || '';
      html += '<textarea class="vpm-textarea" rows="2" data-action="set-custom-style" placeholder="Enter your custom style keywords..." style="margin-top:8px">' + esc(customHint) + '</textarea>';
    }
    return html;
  }

  // Platform multi-select
  function _platformMultiSelect(selectedPlatforms) {
    var html = '<div class="vpm-platform-cards vpm-platform-multi">';
    for (var k in Constants.PLATFORMS) {
      var p = Constants.PLATFORMS[k];
      var isActive = selectedPlatforms.indexOf(k) >= 0;
      html += '<div class="vpm-platform-card' + (isActive ? ' vpm-platform-active' : '') + '" data-action="toggle-platform" data-value="' + esc(k) + '">';
      html += '<div class="vpm-platform-check">' + (isActive ? icon('square-check') : icon('square')) + '</div>';
      html += '<div class="vpm-platform-name">' + icon(p.icon) + ' ' + esc(p.label) + '</div>';
      html += '<div class="vpm-platform-meta">' + esc(p.defaultAspect) + ' \u00B7 ' + p.durationRange[0] + '-' + p.durationRange[1] + 's</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // Enhanced duration control with slider + input + presets
  function _enhancedDurationControl(value) {
    var presets = [30, 60, 120, 300, 600];
    var html = '<div class="vpm-dur-combo">';
    html += '<input type="range" class="vpm-dur-slider" min="5" max="600" value="' + value + '" data-action="set-duration">';
    html += '<div class="vpm-dur-combo-row">';
    html += '<div class="vpm-dur-input-wrap"><input type="number" class="vpm-dur-input" min="5" max="600" value="' + value + '" data-action="set-duration-input"> <span class="vpm-text-muted">seconds</span></div>';
    html += '<span class="vpm-dur-human">' + formatDuration(value) + '</span>';
    html += '</div>';
    html += '<div class="vpm-dur-presets">';
    for (var pi = 0; pi < presets.length; pi++) {
      var pv = presets[pi];
      html += '<button class="vpm-chip' + (value === pv ? ' vpm-chip-active' : '') + '" data-action="set-duration-preset" data-value="' + pv + '">' + formatDuration(pv) + '</button>';
    }
    html += '</div></div>';
    return html;
  }

  // Model selection panel
  function _renderModelSelectionPanel(prefs) {
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('microchip') + ' AI Models</div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Select models available for this project. The primary model is used by default for generation.</p>';

    // Video models
    html += '<div class="vpm-text-label" style="margin:12px 0 8px">' + icon('film') + ' Video Generation Models</div>';
    html += '<div class="vpm-model-cards">';
    var selVMs = prefs.selected_video_models || [];
    var primaryVM = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    for (var vk in Constants.VIDEO_MODELS) {
      var vm = Constants.VIDEO_MODELS[vk];
      var isSel = selVMs.indexOf(vk) >= 0 || selVMs.length === 0; // All selected if none explicitly set
      var isPrimary = primaryVM === vk;
      html += '<div class="vpm-model-card' + (isSel ? ' vpm-model-active' : '') + (isPrimary ? ' vpm-model-primary' : '') + '" data-action="toggle-video-model" data-value="' + esc(vk) + '">';
      html += '<div class="vpm-model-head">' + icon(vm.icon) + ' <strong>' + esc(vm.label) + '</strong>';
      if (isPrimary) html += ' <span class="vpm-badge-primary">Primary</span>';
      if (vk === 'seedance') html += ' <span class="vpm-badge" style="background:#0d904f20;color:#0d904f;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600">Recommended</span>';
      html += '</div>';
      if (vk === 'seedance') html += '<div class="vpm-model-meta" style="color:var(--vpm-info,#1a73e8)">' + icon('layer-group') + ' Primary \u2014 Ingredients & Text to Video</div>';
      else if (vk === 'google-veo-3.1') html += '<div class="vpm-model-meta" style="color:var(--vpm-text-muted,#6b7280)">' + icon('images') + ' Secondary \u2014 Frames to Video (reference image required)</div>';
      html += '<div class="vpm-model-meta">' + esc(vm.notes) + '</div>';
      html += '<div class="vpm-model-meta">Duration: ' + vm.minDuration + '-' + vm.maxDuration + 's</div>';
      if (isSel && !isPrimary) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-xs" data-action="set-primary-video-model" data-value="' + esc(vk) + '">Set as Primary</button>';
      html += '</div>';
    }
    html += '</div>';

    // Image models
    html += '<div class="vpm-text-label" style="margin:16px 0 8px">' + icon('image') + ' Image Generation Models</div>';
    html += '<div class="vpm-model-cards">';
    var selIMs = prefs.selected_image_models || [];
    var primaryIM = prefs.primary_image_model || (S.meta.aiPreferences || {}).imageModel || 'imagen-3';
    for (var ik in Constants.IMAGE_MODELS) {
      var im = Constants.IMAGE_MODELS[ik];
      var isISel = selIMs.indexOf(ik) >= 0 || selIMs.length === 0;
      var isIPrimary = primaryIM === ik;
      html += '<div class="vpm-model-card' + (isISel ? ' vpm-model-active' : '') + (isIPrimary ? ' vpm-model-primary' : '') + '" data-action="toggle-image-model" data-value="' + esc(ik) + '">';
      html += '<div class="vpm-model-head">' + icon(im.icon) + ' <strong>' + esc(im.label) + '</strong>';
      if (isIPrimary) html += ' <span class="vpm-badge-primary">Primary</span>';
      html += '</div>';
      if (isISel && !isIPrimary) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-xs" data-action="set-primary-image-model" data-value="' + esc(ik) + '">Set as Primary</button>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  // Seedance Audio Direction panel (campaign-level, shown when Seedance 2.0 is primary)
  function _renderSeedanceAudioDirectionPanel(prefs) {
    var selected = prefs.seedance_audio_direction || 'voice-ambient';
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-panel-title">' + icon('seedling') + ' Seedance Audio Direction</div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Campaign-level audio approach for Seedance 2.0 clips. Determines how voice, ambient, and music are handled in generated prompts.</p>';
    html += '<div class="vpm-audio-dir-cards" style="display:flex;flex-direction:column;gap:8px">';
    var dirs = Constants.SEEDANCE_AUDIO_DIRECTIONS || {};
    for (var dk in dirs) {
      var dd = dirs[dk];
      var isA = selected === dk;
      html += '<div class="vpm-audio-mode-card' + (isA ? ' vpm-audio-mode-active' : '') + '" data-action="set-pref" data-path="preferences.seedance_audio_direction" data-value="' + esc(dk) + '" style="cursor:pointer">';
      html += '<div class="vpm-audio-mode-head">';
      html += '<div class="vpm-audio-mode-icon">' + icon(dd.icon) + '</div>';
      html += '<div class="vpm-audio-mode-label">' + esc(dd.label) + '</div>';
      if (isA) html += '<div class="vpm-audio-mode-check" style="margin-left:auto;color:var(--vpm-success,#0d904f)">' + icon('circle-check') + '</div>';
      html += '</div>';
      html += '<div class="vpm-audio-mode-desc vpm-text-sm vpm-text-muted">' + esc(dd.description) + '</div>';
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  // Brand Library Selection panel
  function _renderBrandLibrarySelectionPanel() {
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.characters.length && !bs.looks.length && !bs.environments.length)) return '';

    var useBrand = S.data.start.use_brand_library !== false;
    var selections = ((S.data.start || {}).brand_selections || {});
    var html = '<div class="vpm-panel">';
    html += '<div class="vpm-flex-between">';
    html += '<div class="vpm-panel-title">' + icon('building') + ' Brand Library</div>';
    html += '<label class="vpm-toggle-switch"><input type="checkbox" data-action="toggle-brand-library"' + (useBrand ? ' checked' : '') + '> <span class="vpm-text-sm">' + (useBrand ? 'Enabled' : 'Disabled') + '</span></label>';
    html += '</div>';
    if (!useBrand) {
      html += '<p class="vpm-text-muted vpm-text-sm">Brand library items will not be used for this video. Only video-specific assets will be available.</p></div>';
      return html;
    }
    html += '<div class="vpm-flex-between" style="margin-top:8px">';
    html += '<p class="vpm-text-muted vpm-text-sm" style="margin:0">Select which brand resources to use for this video.</p>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-brand">' + icon('sparkles') + ' AI Suggest</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="select-all-brand">' + icon('check-double') + ' All</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-brand-selection">' + icon('xmark') + ' Clear</button>';
    html += '</div></div>';
    html += '<p class="vpm-text-muted vpm-text-sm">Select which brand resources to use for this video. Unselected items will not appear in Studio.</p>';

    if (bs.looks.length) {
      html += _brandSelGroup('Looks / Avatars', 'user-check', bs.looks, selections.selected_look_ids || [], 'look');
    }
    if (bs.environments.length) {
      html += _brandSelGroup('Environments', 'panorama', bs.environments, selections.selected_environment_ids || [], 'environment');
    }
    if (bs.scenes.length) {
      html += _brandSelGroup('Scenes', 'image', bs.scenes, selections.selected_scene_ids || [], 'scene');
    }
    if (bs.characters.length) {
      html += _brandSelGroup('Characters', 'users', bs.characters, selections.selected_character_ids || [], 'character');
    }
    html += '</div>';
    return html;
  }

  function _brandSelGroup(label, iconName, items, selectedIds, entityType) {
    var html = '<div class="vpm-brand-sel-group">';
    html += '<div class="vpm-brand-sel-label">' + icon(iconName) + ' ' + esc(label) + ' <span class="vpm-text-muted">(' + items.length + ')</span></div>';
    html += '<div class="vpm-brand-sel-list">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isSel = selectedIds.indexOf(item.id) >= 0;
      html += '<label class="vpm-brand-sel-item' + (isSel ? ' vpm-brand-sel-active' : '') + '">';
      html += '<input type="checkbox" class="vpm-brand-check" data-action="toggle-brand-resource" data-entity-type="' + entityType + '" data-entity-id="' + esc(item.id) + '"' + (isSel ? ' checked' : '') + '>';
      html += '<span class="vpm-brand-sel-name">' + esc(item.name || 'Unnamed') + '</span>';
      var frag = item.prompt_fragment || item.combined_prompt_fragment || '';
      if (frag) html += '<span class="vpm-brand-sel-desc">' + esc(truncate(frag, 50)) + '</span>';
      html += '</label>';
    }
    html += '</div></div>';
    return html;
  }

  // --- Start stage helpers ---

  function _prefGroup(label, iconName, isFull, content) {
    return '<div class="vpm-pref-group' + (isFull ? ' vpm-pref-full' : '') + '"><div class="vpm-pref-label">' + icon(iconName) + ' ' + esc(label) + '</div>' + content + '</div>';
  }

  function _chipBar(items, selected, path) {
    var html = '<div class="vpm-chip-bar">';
    for (var k in items) {
      var item = items[k];
      var isActive = selected === k;
      html += '<button class="vpm-chip' + (isActive ? ' vpm-chip-active' : '') + '" data-action="set-pref" data-path="' + esc(path) + '" data-value="' + esc(k) + '">';
      if (item.icon) html += icon(item.icon) + ' ';
      html += esc(item.label) + '</button>';
    }
    html += '</div>';
    return html;
  }

  function _platformCards(selected) {
    var html = '<div class="vpm-platform-cards">';
    for (var k in Constants.PLATFORMS) {
      var p = Constants.PLATFORMS[k];
      var isActive = selected === k;
      html += '<div class="vpm-platform-card' + (isActive ? ' vpm-platform-active' : '') + '" data-action="set-platform" data-value="' + esc(k) + '">';
      html += '<div class="vpm-platform-name">' + icon(p.icon) + ' ' + esc(p.label) + '</div>';
      html += '<div class="vpm-platform-meta">' + esc(p.defaultAspect) + ' \u00B7 ' + p.durationRange[0] + '-' + p.durationRange[1] + 's</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _aspectCards(selected) {
    var html = '<div class="vpm-aspect-cards">';
    for (var k in Constants.ASPECT_RATIOS) {
      var ar = Constants.ASPECT_RATIOS[k];
      var isActive = selected === k;
      // Simple preview proportions
      var w = 40, h = Math.round(40 * (ar.height / ar.width));
      if (h > 50) { h = 50; w = Math.round(50 * (ar.width / ar.height)); }
      html += '<div class="vpm-aspect-card' + (isActive ? ' vpm-aspect-active' : '') + '" data-action="set-pref" data-path="preferences.aspect_ratio" data-value="' + esc(k) + '">';
      html += '<div class="vpm-aspect-preview" style="width:' + w + 'px;height:' + h + 'px"></div>';
      html += '<div class="vpm-aspect-label">' + esc(ar.shortLabel) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _durationControl(value) {
    return '<div class="vpm-dur-control">' +
      '<input type="range" class="vpm-dur-slider" min="5" max="600" value="' + value + '" data-action="set-duration">' +
      '<div class="vpm-dur-display"><span class="vpm-dur-value">' + value + 's</span>' +
      '<span class="vpm-dur-human">' + formatDuration(value) + '</span></div></div>';
  }

  function _prodModeCards(selected) {
    var html = '<div class="vpm-prod-cards">';
    for (var k in Constants.PRODUCTION_MODES) {
      var pm = Constants.PRODUCTION_MODES[k];
      var isActive = selected === k;
      html += '<div class="vpm-prod-card' + (isActive ? ' vpm-prod-active' : '') + '" data-action="set-pref" data-path="preferences.production_mode" data-value="' + esc(k) + '">';
      html += '<div class="vpm-prod-icon">' + icon(pm.icon) + '</div>';
      html += '<div class="vpm-prod-label">' + esc(pm.label) + '</div>';
      html += '<div class="vpm-prod-desc">' + esc(pm.description) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 5B: VIDEO PLANNER IMPORT — PARSER, MAPPER & MODAL
  // ============================================================

  // --- Validation ---

  function _validatePlannerJSON(obj) {
    var errors = [], warnings = [];
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return { valid: false, errors: ['Not a valid JSON object'], warnings: [], coverage: {} };
    }
    if (!obj.title && !obj.description && !obj.script_sections) {
      errors.push('No recognizable video planner fields found (need title, description, or script_sections)');
    }
    var coverage = {
      hasTitle: !!(obj.title || obj.description),
      hasAudience: !!obj.audience,
      hasTone: !!obj.tone,
      hasResearch: !!(obj.research && (obj.research.pain_points || obj.research.keywords)),
      hasSections: !!(obj.script_sections && obj.script_sections.length),
      hasScript: false,
      hasClipTypes: !!(obj.clip_types && obj.clip_types.length),
      hasTags: !!(obj.tags && obj.tags.length),
      hasProductionNotes: !!obj.production_notes,
      hasVisualStyle: !!obj.visual_style
    };
    if (coverage.hasSections) {
      var withContent = 0;
      for (var i = 0; i < obj.script_sections.length; i++) {
        if (obj.script_sections[i].content && obj.script_sections[i].content.trim().length > 20) withContent++;
      }
      coverage.hasScript = withContent > 0 && withContent >= obj.script_sections.length * 0.5;
    }
    if (obj.ratio && !_mapPlannerRatio(obj.ratio)) warnings.push('Unknown ratio "' + obj.ratio + '", defaulting to 16:9');
    if (obj.tone && !_mapPlannerTone(obj.tone)) warnings.push('Unknown tone "' + obj.tone + '", using closest match');
    return { valid: errors.length === 0, errors: errors, warnings: warnings, coverage: coverage };
  }

  // --- Mapping helpers ---

  function _mapPlannerRatio(ratio) {
    if (!ratio) return null;
    var r = ratio.trim().toLowerCase();
    var map = { '16:9': '16:9', '9:16': '9:16', '1:1': '1:1', '4:5': '4:5',
      'landscape': '16:9', 'portrait': '9:16', 'square': '1:1', 'vertical': '9:16', 'horizontal': '16:9' };
    return map[r] || null;
  }

  function _mapPlannerTone(tone) {
    if (!tone) return null;
    var t = tone.toLowerCase().trim();
    var toneMap = Constants.PLANNER_TONE_MAP || {};
    // Direct match
    if (toneMap[t]) return toneMap[t];
    // Split on separator and try parts
    var parts = t.split(/\s*[—\-:]+\s*/);
    for (var pi = 0; pi < parts.length; pi++) {
      var p = parts[pi].trim();
      if (toneMap[p]) return toneMap[p];
      // Partial match
      for (var k in toneMap) {
        if (p.indexOf(k) >= 0 || k.indexOf(p) >= 0) return toneMap[k];
      }
    }
    // Direct match against TONES keys
    for (var tk in Constants.TONES) {
      if (t.indexOf(tk) >= 0) return tk;
    }
    return 'professional';
  }

  function _mapPlannerAudience(audience) {
    if (!audience) return '';
    return audience.replace(/^(beginner|intermediate|advanced|expert)\s*[—\-:]+\s*/i, '').trim() || audience;
  }

  function _inferProductionMode(planner) {
    var notes = (planner.production_notes || '').toLowerCase();
    if (notes.indexOf('screen recording') >= 0 || notes.indexOf('screen capture') >= 0 || notes.indexOf('screencast') >= 0) return 'screen-recording';
    if (notes.indexOf('live action') >= 0 || notes.indexOf('camera') >= 0 || notes.indexOf('filming') >= 0) return 'live-action';
    if (planner.clip_types && planner.clip_types.length) {
      var hasAI = false, hasNonAI = false;
      for (var ci = 0; ci < planner.clip_types.length; ci++) {
        var ct = normalizeClipType(planner.clip_types[ci]);
        var ctDef = Constants.CLIP_TYPES[ct];
        if (ctDef) {
          if (ctDef.track === 'ai') hasAI = true;
          if (ctDef.track === 'non-ai') hasNonAI = true;
        }
      }
      if (hasAI && hasNonAI) return 'hybrid';
      if (hasAI && !hasNonAI) return 'full-ai';
      if (!hasAI && hasNonAI) return 'screen-recording';
    }
    return 'hybrid';
  }

  // --- Main mapper ---

  function _mapPlannerToVPM(planner) {
    var result = {
      start: { preferences: {} },
      video: {},
      research: null,
      blueprint: { title: '', description: '', sections: [], style_notes: '', tone: '', target_audience: '' },
      script: null,
      clipTypes: []
    };

    // --- Preferences ---
    if (planner.ratio) result.start.preferences.aspect_ratio = _mapPlannerRatio(planner.ratio) || '16:9';
    if (planner.target_duration) {
      result.start.preferences.target_duration = parseInt(planner.target_duration, 10) || (planner.total_duration || 120);
    } else if (planner.total_duration) {
      result.start.preferences.target_duration = planner.total_duration;
    }
    result.start.preferences.production_mode = _inferProductionMode(planner);
    result.start.raw_input = planner.description || planner.title || '';

    // --- Video metadata ---
    result.video.title = planner.title || '';
    result.video.description = planner.description || '';
    result.video.target_audience = _mapPlannerAudience(planner.audience || '');
    result.video.tone = _mapPlannerTone(planner.tone || '');
    result.video.keywords = (planner.tags || []).slice();
    if (planner.ratio) result.video.aspect_ratio = _mapPlannerRatio(planner.ratio) || '16:9';
    if (planner.target_duration || planner.total_duration) {
      result.video.duration_target = parseInt(planner.target_duration, 10) || planner.total_duration || 120;
    }

    // --- Blueprint ---
    result.blueprint.title = planner.title || '';
    result.blueprint.description = planner.description || '';
    result.blueprint.tone = result.video.tone;
    result.blueprint.target_audience = result.video.target_audience;
    var styleNotes = [];
    if (planner.production_notes) styleNotes.push(planner.production_notes);
    if (planner.visual_style) styleNotes.push('Visual style: ' + planner.visual_style);
    if (planner.angle) styleNotes.push('Angle: ' + planner.angle);
    if (planner.hook) styleNotes.push('Hook: ' + planner.hook);
    if (planner.series) styleNotes.push('Series: ' + planner.series);
    if (planner.format) styleNotes.push('Format: ' + planner.format);
    result.blueprint.style_notes = styleNotes.join('\n');

    // Map script_sections to blueprint sections (and script if content)
    var sectionIds = [];
    if (planner.script_sections && planner.script_sections.length) {
      for (var i = 0; i < planner.script_sections.length; i++) {
        var ps = planner.script_sections[i];
        var secId = generateId('sec');
        sectionIds.push(secId);
        result.blueprint.sections.push({
          id: secId,
          label: ps.title || ps.type_label || ('Section ' + (i + 1)),
          duration: ps.estimated_duration || 0,
          key_points: [],
          visual_notes: ps.notes || '',
          order: i + 1
        });
      }
    }

    // --- Script (only if sections have substantial content) ---
    var validation = _validatePlannerJSON(planner);
    if (validation.coverage.hasScript) {
      result.script = { sections: [], total_word_count: 0, estimated_duration: 0 };
      var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) ? S.meta.settings.words_per_minute : 150;
      for (var si = 0; si < planner.script_sections.length; si++) {
        var pSec = planner.script_sections[si];
        var sId = sectionIds[si] || generateId('sec');
        var content = pSec.content || '';
        // Wrap plain text in <p> tags if not already HTML
        if (content && content.indexOf('<') === -1) {
          content = '<p>' + esc(content).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
        }
        var wc = pSec.word_count || countWords(content);
        var ed = pSec.estimated_duration || estimateDuration(wc, wpm);
        result.script.sections.push({
          id: sId,
          label: pSec.title || pSec.type_label || (result.blueprint.sections[si] ? result.blueprint.sections[si].label : 'Section ' + (si + 1)),
          content: content,
          word_count: wc,
          estimated_duration: ed,
          order: si + 1,
          notes: pSec.notes || ''
        });
        result.script.total_word_count += wc;
        result.script.estimated_duration += ed;
      }
    }

    // --- Research (enhanced: extract from metadata + explicit research field) ---
    result.research = {};
    // From explicit research field
    if (planner.research) {
      if (planner.research.pain_points && planner.research.pain_points.length) {
        result.research.audience_insights = planner.research.pain_points.map(function(p) {
          return (p.priority ? '[' + p.priority.toUpperCase() + '] ' : '') + p.text;
        }).join('\n');
      }
      if (planner.research.keywords && planner.research.keywords.length) {
        result.research.content_strategy = 'Target Keywords:\n' + planner.research.keywords.map(function(k) {
          return '- ' + k.keyword + (k.volume ? ' (volume: ' + k.volume + ')' : '') + (k.competition ? ' [competition: ' + k.competition + ']' : '');
        }).join('\n');
      }
    }
    // Enrich from planner metadata if not already populated
    if (!result.research.audience_insights && planner.audience) {
      var aParts = ['Target Audience: ' + planner.audience];
      if (planner.description) aParts.push('Context: ' + planner.description.substring(0, 300));
      result.research.audience_insights = aParts.join('\n');
    }
    if (!result.research.content_strategy) {
      var cParts = [];
      if (planner.tone) cParts.push('Tone: ' + planner.tone);
      if (planner.format) cParts.push('Format: ' + planner.format);
      if (planner.angle) cParts.push('Angle: ' + planner.angle);
      if (cParts.length) result.research.content_strategy = cParts.join('\n');
    }
    if (planner.hook) {
      result.research.trending_angles = 'Hook: ' + planner.hook;
    }
    // Set to null if nothing was populated
    var _hasResearch = result.research.audience_insights || result.research.content_strategy || result.research.trending_angles || result.research.competitor_analysis;
    if (!_hasResearch) result.research = null;

    // --- Clip types ---
    if (planner.clip_types && planner.clip_types.length) {
      result.clipTypes = [];
      for (var cti = 0; cti < planner.clip_types.length; cti++) {
        var normalized = normalizeClipType(planner.clip_types[cti]);
        if (normalized && Constants.CLIP_TYPES[normalized]) result.clipTypes.push(normalized);
      }
    }

    return result;
  }

  // --- Smart stage determination ---

  function _determineLandingStage(coverage) {
    if (coverage.hasScript) return 'script';
    if (coverage.hasSections) return 'blueprint';
    if (coverage.hasResearch && S.mode === 'advanced') return 'research';
    if (coverage.hasTitle) return 'blueprint';
    return 'start';
  }

  // --- Import modal ---

  function _openPlannerImport() {
    var html = '<div class="vpm-planner-import">';

    // Inner tabs
    html += '<div class="vpm-inner-tabs" style="margin-bottom:16px">';
    html += '<button class="vpm-inner-tab vpm-inner-tab-active" data-action="planner-import-tab" data-tab="paste">' + icon('clipboard') + ' Paste JSON</button>';
    html += '<button class="vpm-inner-tab" data-action="planner-import-tab" data-tab="upload">' + icon('upload') + ' Upload File</button>';
    html += '</div>';

    // Paste tab
    html += '<div class="vpm-import-tab-pane" data-import-tab="paste">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Paste your Video Planner JSON</label>';
    html += '<textarea class="vpm-textarea" id="vpmPlannerJsonInput" rows="10" style="font-family:var(--vpm-font-mono);font-size:11px" placeholder=\'{"title":"...","description":"...","script_sections":[...],"research":{...}}\'></textarea></div>';
    html += '</div>';

    // Upload tab (hidden initially)
    html += '<div class="vpm-import-tab-pane" data-import-tab="upload" style="display:none">';
    html += '<div class="vpm-upload-zone" id="vpmPlannerUploadZone" style="cursor:pointer">';
    html += '<div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
    html += '<p>Drop a .json file here or click to browse</p>';
    html += '<input type="file" accept=".json,application/json" id="vpmPlannerFileInput" style="display:none">';
    html += '</div></div>';

    // Preview area (populated after parse)
    html += '<div id="vpmPlannerPreview" style="display:none"></div>';

    html += '</div>';

    openModal(icon('file-import') + ' Import from Video Planner', html, {
      size: 'lg',
      saveLabel: icon('file-import') + ' Import & Map',
      onSave: function() { _executePlannerImport(); }
    });
  }

  // --- Preview renderer ---

  function _renderPlannerPreview(planner, validation, targetSelector) {
    var $target = $(targetSelector || '#vpmPlannerPreview');
    var html = '';

    if (validation.errors.length) {
      html += '<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' ' + esc(validation.errors.join('; ')) + '</div>';
      $target.html(html).show();
      return;
    }

    if (validation.warnings.length) {
      html += '<div class="vpm-info-banner" style="margin-bottom:8px">' + icon('circle-info') + ' ' + esc(validation.warnings.join('; ')) + '</div>';
    }

    var c = validation.coverage;

    html += '<div class="vpm-panel" style="margin-top:12px"><div class="vpm-panel-title">' + icon('compass-drafting') + ' Import Preview</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';

    var items = [
      { label: 'Title', ok: c.hasTitle, val: planner.title ? truncate(planner.title, 50) : '' },
      { label: 'Audience', ok: c.hasAudience, val: planner.audience ? truncate(planner.audience, 50) : '' },
      { label: 'Tone', ok: c.hasTone, val: planner.tone || '' },
      { label: 'Blueprint Sections', ok: c.hasSections, val: c.hasSections ? (planner.script_sections.length + ' sections') : '' },
      { label: 'Full Script', ok: c.hasScript, val: c.hasScript ? ((planner.total_word_count || '?') + ' words') : '' },
      { label: 'Research Data', ok: c.hasResearch, val: '' },
      { label: 'Clip Types', ok: c.hasClipTypes, val: c.hasClipTypes ? planner.clip_types.join(', ') : '' },
      { label: 'Tags / Keywords', ok: c.hasTags, val: c.hasTags ? planner.tags.join(', ') : '' },
      { label: 'Production Notes', ok: c.hasProductionNotes, val: '' },
      { label: 'Visual Style', ok: c.hasVisualStyle, val: planner.visual_style || '' }
    ];

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html += '<div style="display:flex;align-items:center;gap:6px;padding:4px 0">';
      html += '<span style="color:' + (it.ok ? 'var(--vpm-success)' : 'var(--vpm-gray-400)') + '">' + icon(it.ok ? 'circle-check' : 'circle') + '</span>';
      html += '<span class="vpm-text-sm"><strong>' + esc(it.label) + '</strong>';
      if (it.val) html += ' — ' + esc(it.val);
      html += '</span></div>';
    }
    html += '</div>';

    // Landing stage recommendation
    var landingStage = _determineLandingStage(c);
    var stageLabel = (Constants.APP_STAGES[landingStage] || {}).label || landingStage;
    html += '<div class="vpm-info-banner" style="margin-top:12px">' + icon('rocket') + ' After import, you\'ll land on the <strong>' + esc(stageLabel) + '</strong> stage to review and continue.</div>';
    html += '</div>';

    $target.html(html).show();
  }

  // --- Import execution ---

  function _executePlannerImport() {
    var json = ($('#vpmPlannerJsonInput').val() || '').trim();
    if (!json) { toast('Paste or upload JSON first', 'warning'); return; }

    var parsed = parseJSON(json);
    if (!parsed) { toast('Invalid JSON — check syntax', 'error'); return; }

    var validation = _validatePlannerJSON(parsed);
    if (!validation.valid) { toast(validation.errors[0], 'error'); return; }

    var mapped = _mapPlannerToVPM(parsed);
    var coverage = validation.coverage;

    // Snapshot before import
    _snapshotFull('Before planner import');

    // --- Apply Start ---
    if (!S.data.start) S.data.start = {};
    S.data.start.raw_input = mapped.start.raw_input || S.data.start.raw_input || '';
    if (!S.data.start.preferences) S.data.start.preferences = {};
    var mp = mapped.start.preferences;
    if (mp.aspect_ratio) S.data.start.preferences.aspect_ratio = mp.aspect_ratio;
    if (mp.target_duration) S.data.start.preferences.target_duration = mp.target_duration;
    if (mp.production_mode) S.data.start.preferences.production_mode = mp.production_mode;
    S.data.start.import_source = {
      type: 'video-planner',
      imported_at: new Date().toISOString(),
      fields_mapped: Object.keys(coverage).filter(function(k) { return coverage[k]; })
    };

    // --- Apply Video metadata ---
    var vm = mapped.video;
    if (vm.title) S.data.video.title = vm.title;
    if (vm.description) S.data.video.description = vm.description;
    if (vm.target_audience) S.data.video.target_audience = vm.target_audience;
    if (vm.tone) S.data.video.tone = vm.tone;
    if (vm.keywords && vm.keywords.length) S.data.video.keywords = vm.keywords;
    if (vm.aspect_ratio) S.data.video.aspect_ratio = vm.aspect_ratio;
    if (vm.duration_target) S.data.video.duration_target = vm.duration_target;
    // Copy preferences to video (same pattern as process-idea handler)
    var prefs = S.data.start.preferences;
    S.data.video.language = prefs.language || 'english';
    S.data.video.platform = prefs.platform || 'youtube';
    S.data.video.aspect_ratio = prefs.aspect_ratio || S.data.video.aspect_ratio || '16:9';
    S.data.video.duration_target = prefs.target_duration || S.data.video.duration_target || 120;
    S.data.video.production_mode = prefs.production_mode || S.data.video.production_mode || 'full-ai';
    S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
    if (!S.data.video.created) S.data.video.created = new Date().toISOString();
    S.data.video.modified = new Date().toISOString();

    // --- Apply Blueprint ---
    if (mapped.blueprint && mapped.blueprint.sections.length) {
      S.data.blueprint.title = mapped.blueprint.title || S.data.blueprint.title;
      S.data.blueprint.description = mapped.blueprint.description || S.data.blueprint.description;
      S.data.blueprint.tone = mapped.blueprint.tone || S.data.blueprint.tone;
      S.data.blueprint.target_audience = mapped.blueprint.target_audience || S.data.blueprint.target_audience;
      S.data.blueprint.style_notes = mapped.blueprint.style_notes || S.data.blueprint.style_notes;
      S.data.blueprint.sections = mapped.blueprint.sections;
      // Do NOT auto-confirm — let user review
    }

    // --- Apply Script ---
    if (mapped.script && mapped.script.sections.length) {
      S.data.script.sections = mapped.script.sections;
      S.data.script.total_word_count = mapped.script.total_word_count;
      S.data.script.estimated_duration = mapped.script.estimated_duration;
      // Do NOT auto-finalize — let user review
    }

    // --- Apply Research ---
    if (mapped.research) {
      if (!S.data.research) S.data.research = {};
      if (mapped.research.audience_insights) S.data.research.audience_insights = mapped.research.audience_insights;
      if (mapped.research.content_strategy) S.data.research.content_strategy = mapped.research.content_strategy;
      if (mapped.research.competitor_analysis) S.data.research.competitor_analysis = mapped.research.competitor_analysis;
      if (mapped.research.trending_angles) S.data.research.trending_angles = mapped.research.trending_angles;
      var _anyResearch = mapped.research.audience_insights || mapped.research.content_strategy || mapped.research.competitor_analysis || mapped.research.trending_angles;
      if (_anyResearch) {
        S.data.research.generated = true;
        S.data.research.generated_at = S.data.research.generated_at || new Date().toISOString();
      }
    }

    // --- Apply Clip Types ---
    if (mapped.clipTypes.length) {
      S.data.start.selected_clip_types = mapped.clipTypes;
    }

    // Mark start as processed
    S.data.start.processed = true;
    S.data.start.processed_at = new Date().toISOString();

    // Auto-switch to advanced mode if research data exists
    if (coverage.hasResearch && S.mode !== 'advanced') {
      S.mode = 'advanced';
      S.data.start.mode = 'advanced';
    }

    // Log, snapshot, sync, render
    logActivity('planner_imported', 'Imported from Video Planner: ' + truncate(mapped.video.title || 'Untitled', 50));
    _snapshotFull('After planner import');
    buildMaps();
    syncToTextarea();
    closeModal();

    // Smart navigation
    var landingStage = _determineLandingStage(coverage);
    navigateToStage(landingStage);

    // Summary toast
    var importedParts = [];
    if (coverage.hasTitle) importedParts.push('title');
    if (coverage.hasSections) importedParts.push('blueprint');
    if (coverage.hasScript) importedParts.push('script');
    if (coverage.hasResearch) importedParts.push('research');
    toast('Imported: ' + importedParts.join(', ') + '. Review and fill any gaps.', 'success');
  }


  // ============================================================
  // SECTION 7: SCRIPT VIEW — FULL (N-section Tiptap editors)
  // ============================================================

  function renderScriptFull() {
    var sc = S.data.script || {};
    var sections = sc.sections || [];
    var td = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('file-lines') + ' Script</h2>';
    html += '<p class="vpm-view-subtitle">' + sections.length + ' sections from Blueprint</p></div><div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-script">' + icon('sparkles') + ' AI Generate</button>';
    var versions = sc.versions || [];
    if (versions.length > 0) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="show-script-versions">' + icon('clock-rotate-left') + ' Versions (' + versions.length + ')</button>';
    if (sc.finalized) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="unlock-script">' + icon('lock') + ' Unlock</button>';
      html += '<span class="vpm-text-success vpm-text-sm">' + icon('circle-check') + ' Finalized</span>';
    } else {
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="finalize-script"' + (!sc.total_word_count ? ' disabled' : '') + '>' + icon('check') + ' Finalize</button>';
    }
    html += '</div></div>';

    // --- Stats Bar ---
    html += '<div class="vpm-panel vpm-panel-sm"><div class="vpm-flex-between" id="vpmScriptStats">';
    html += '<span class="vpm-text-sm vpm-text-muted">' + formatNumber(sc.total_word_count || 0) + ' words \u00B7 ~' + formatDuration(sc.estimated_duration || 0) + '</span>';
    html += '<span class="vpm-text-sm vpm-text-muted">Target: ' + formatDuration(td) + '</span>';
    html += '</div>';
    var durPct = Math.min(100, Math.round(((sc.estimated_duration || 0) / Math.max(td, 1)) * 100));
    html += '<div class="vpm-progress-bar"><div class="vpm-progress-fill" id="vpmScriptProgressFill" style="width:' + durPct + '%;background:' + (durPct > 100 ? 'var(--vpm-warning)' : 'var(--vpm-primary)') + '"></div></div>';
    html += '</div>';

    // --- Empty State ---
    if (!sections.length) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('file-lines') + '</div>';
      html += '<h3>No Script Sections</h3>';
      html += '<p>Confirm your Blueprint to auto-create script sections, or add sections manually below.</p>';
      html += '<div class="vpm-btn-row" style="justify-content:center">';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-script">' + icon('sparkles') + ' AI Generate Script</button>';
      html += '<button class="vpm-btn vpm-btn-outline" data-action="add-script-section">' + icon('plus') + ' Add Section</button>';
      html += '</div></div>';
    }

    // --- Tiptap loading indicator ---
    if (sections.length && !_tiptapReady) {
      html += '<div class="vpm-panel"><div class="vpm-ai-processing"><div class="vpm-ai-processing-animation">';
      html += '<div class="vpm-ai-pulse"></div><div class="vpm-ai-pulse vpm-ai-pulse-2"></div><div class="vpm-ai-pulse vpm-ai-pulse-3"></div>';
      html += '</div><p class="vpm-text-muted vpm-text-sm" style="margin-top:8px">Loading script editor\u2026</p></div></div>';
    }

    // --- Section Editors ---
    var _sectionColors = ['#1a73e8', '#7c3aed', '#0891b2', '#0d904f', '#e37400', '#d93025', '#9333ea', '#1a73e8', '#0891b2', '#0d904f'];
    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      var sColor = _sectionColors[si % _sectionColors.length];

      html += '<div class="vpm-script-section" style="border-left-color:' + sColor + '" data-section-id="' + sec.id + '">';

      // Section header
      html += '<div class="vpm-script-section-head">';
      html += '<div class="vpm-script-section-left">';
      html += '<span class="vpm-script-badge" style="background:' + sColor + '">' + esc(sec.label || 'Section ' + (si + 1)) + '</span>';
      html += '<span class="vpm-text-xs vpm-text-muted" data-section-stats="' + sec.id + '">' + (sec.word_count || 0) + 'w \u00B7 ~' + formatDuration(sec.estimated_duration || 0) + '</span>';
      html += '</div>';
      html += '<div class="vpm-script-section-actions">';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-xs" data-action="ai-generate-section-script" data-section-id="' + sec.id + '" title="' + (sec.word_count ? 'Regenerate script for this section' : 'Generate script for this section') + '">' + icon('sparkles') + (sec.word_count ? ' Regen' : ' Generate') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="ai-enhance-section" data-section-id="' + sec.id + '" title="AI Enhance">' + icon('wand-magic-sparkles') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="edit-section-label" data-section-id="' + sec.id + '" title="Rename">' + icon('pen') + '</button>';
      if (si > 0) html += '<button class="vpm-btn-icon-sm" data-action="move-script-section-up" data-section-id="' + sec.id + '" title="Move up">' + icon('chevron-up') + '</button>';
      if (si < sections.length - 1) html += '<button class="vpm-btn-icon-sm" data-action="move-script-section-down" data-section-id="' + sec.id + '" title="Move down">' + icon('chevron-down') + '</button>';
      if (sections.length > 1) html += '<button class="vpm-btn-icon-sm" data-action="remove-script-section" data-section-id="' + sec.id + '" title="Delete section" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
      html += '</div></div>';

      // Notes (collapsible)
      if (sec.notes) {
        html += '<div class="vpm-script-section-notes">' + icon('info') + ' <span class="vpm-text-xs vpm-text-muted">' + esc(sec.notes) + '</span></div>';
      }

      // Tiptap editor container
      html += '<div class="vpm-tiptap-container' + (sc.finalized ? ' vpm-tiptap-finalized' : '') + '" id="vpmScriptSection_' + sec.id + '"></div>';

      html += '</div>';
    }

    // --- Add Section Button ---
    if (sections.length > 0 && !sc.finalized) {
      html += '<button class="vpm-script-add-btn" data-action="add-script-section">' + icon('plus') + ' Add Section</button>';
    }

    // --- Finalized Banner ---
    if (sc.finalized) {
      html += '<div class="vpm-info-banner" style="margin-top:var(--vpm-space-4)">' + icon('lock') + ' Script finalized on ' + formatDate(sc.finalized_at) + '. Click "Unlock" to resume editing.</div>';
    }

    // --- Navigation ---
    var nextLabel, nextStage;
    if (S.mode === 'advanced') { nextLabel = 'Continue to Studio'; nextStage = 'studio'; }
    else { nextLabel = 'Continue to Clips'; nextStage = 'clips'; }
    html += renderNavButtons('Blueprint', nextLabel, nextStage);
    html += '</div>';

    // Trigger Tiptap init after DOM is ready
    setTimeout(function() { _initAllScriptEditors(); }, 100);

    return html;
  }


  // ============================================================
  // SECTION 8: STUDIO VIEW — FULL (5-tab)
  // ============================================================

  function renderStudioFull() {
    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('palette') + ' Studio</h2>';
    html += '<p class="vpm-view-subtitle">Looks, environments & scenes for visual consistency</p></div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script</button></div>';
    // Tabs
    html += '<div class="vpm-inner-tabs">';
    for (var tabId in Constants.STUDIO_TABS) {
      var tab = Constants.STUDIO_TABS[tabId]; var isActive = S.currentStudioTab === tabId;
      html += '<button class="vpm-inner-tab' + (isActive ? ' vpm-inner-tab-active' : '') + '" data-action="studio-tab" data-tab="' + tabId + '">' + icon(tab.icon) + ' ' + esc(tab.label) + '</button>';
    }
    html += '</div>';
    switch (S.currentStudioTab) {
      case 'overview':     html += _studioOverviewTab(); break;
      case 'looks':        html += _studioLooksTab(); break;
      case 'environments': html += _studioEnvironmentsTab(); break;
      case 'scenes':       html += _studioScenesTab(); break;
      case 'library':      html += _studioBrandLibraryTab(); break;
      default: html += _studioOverviewTab();
    }
    html += renderNavButtons('Script', 'Continue to Clips', 'clips');
    html += '</div>';
    return html;
  }

  // --- Overview Tab ---
  function _studioRequirementsPanel() {
    var reqs = S.studioReqs || {};
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return (c.track || (Constants.CLIP_TYPES[c.type] || {}).track) === 'ai'; });
    if (!aiClips.length) return '';

    var html = '<div class="vpm-panel vpm-studio-reqs-panel">';
    html += '<div class="vpm-flex-between vpm-mb-sm">';
    html += '<span class="vpm-panel-title" style="margin:0">' + icon('bullseye') + ' Asset Requirements</span>';
    html += '<div class="vpm-btn-row">';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Generate Missing Assets</button>';
    if ((reqs.unassigned_clips || []).length) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-auto-assign">' + icon('wand-magic-sparkles') + ' Auto-Assign</button>';
    html += '</div></div>';

    var rows = [
      { label: 'Character Looks', iconN: 'user-check', needed: (reqs.clips_needing_look || []).length, existing: reqs.existing_looks || 0 },
      { label: 'Environments', iconN: 'panorama', needed: (reqs.clips_needing_env || []).length, existing: reqs.existing_envs || 0 },
      { label: 'Unassigned Clips', iconN: 'circle-exclamation', needed: (reqs.unassigned_clips || []).length, existing: 0 }
    ];
    html += '<div class="vpm-studio-req-rows">';
    for (var ri = 0; ri < rows.length; ri++) {
      var rw = rows[ri];
      var status = rw.needed === 0 ? 'ok' : 'missing';
      html += '<div class="vpm-studio-req-row vpm-studio-req-' + status + '">';
      html += '<div class="vpm-studio-req-icon">' + icon(rw.iconN) + '</div>';
      html += '<div class="vpm-studio-req-info"><strong>' + esc(rw.label) + '</strong> ';
      if (rw.needed > 0) html += '<span class="vpm-text-warning">' + rw.needed + ' clip' + (rw.needed !== 1 ? 's' : '') + ' need assignment</span>';
      else html += '<span class="vpm-text-success">' + icon('check') + ' All assigned</span>';
      if (rw.existing > 0) html += ' <span class="vpm-text-xs vpm-text-muted">(' + rw.existing + ' available)</span>';
      html += '</div></div>';
    }
    html += '</div>';

    // Progress
    var totalN = aiClips.length;
    var assigned = totalN - (reqs.unassigned_clips || []).length;
    var pct = totalN > 0 ? Math.round((assigned / totalN) * 100) : 100;
    html += progressBar(pct);
    html += '</div>';
    return html;
  }

  function _studioOverviewTab() {
    var sr = S.meta.studioRequirements || {};
    var bs = S.brandStudio || {};
    var html = '';

    // Brand Library status
    if (bs.loaded) {
      html += '<div class="vpm-studio-brand-bar">';
      html += '<div class="vpm-studio-brand-left">' + icon('building') + ' <strong>Brand Studio Library</strong>';
      if (bs.brandInfo && bs.brandInfo.name) html += ' \u2014 ' + esc(bs.brandInfo.name);
      html += '<span class="vpm-studio-loaded">' + icon('check') + ' Loaded</span></div>';
      html += '<div class="vpm-studio-brand-counts">';
      if (bs.characters.length) html += '<span>' + bs.characters.length + ' Characters</span>';
      if (bs.outfits.length) html += '<span>' + bs.outfits.length + ' Outfits</span>';
      if (bs.looks.length) html += '<span>' + bs.looks.length + ' Looks</span>';
      if (bs.environments.length) html += '<span>' + bs.environments.length + ' Envs</span>';
      if (bs.scenes.length) html += '<span>' + bs.scenes.length + ' Scenes</span>';
      html += '</div></div>';
    }

    // Asset Requirements Panel (AI-first)
    html += _studioRequirementsPanel();

    // Stats row
    html += '<div class="vpm-studio-stats">';
    var statItems = [
      { label: 'Looks / Avatars', icon: 'user-check', brand: (bs.looks || []).length, custom: (S.meta.lookLibrary || []).length },
      { label: 'Environments', icon: 'panorama', brand: (bs.environments || []).length, custom: (S.meta.environmentLibrary || []).length },
      { label: 'Scenes', icon: 'image', brand: (bs.scenes || []).length, custom: (S.meta.sceneLibrary || []).length }
    ];
    for (var si = 0; si < statItems.length; si++) {
      var st = statItems[si]; var total = st.brand + st.custom;
      html += '<div class="vpm-studio-stat-card"><div class="vpm-studio-stat-icon">' + icon(st.icon) + '</div>';
      html += '<div class="vpm-studio-stat-num">' + total + '</div>';
      html += '<div class="vpm-studio-stat-label">' + esc(st.label) + '</div>';
      html += '<div class="vpm-studio-stat-break"><span class="vpm-studio-stat-brand">' + st.brand + ' brand</span><span class="vpm-studio-stat-custom">' + st.custom + ' custom</span></div></div>';
    }
    html += '</div>';

    // Visual Pipeline
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('zap') + ' Visual Pipeline</div>';
    html += '<div class="vpm-pipeline">';
    var pipeNodes = [
      { icon: 'user-check', label: 'Look / Avatar', sub: 'Visual identity', cls: 'accent' },
      { op: '+' },
      { icon: 'panorama', label: 'Environment', sub: 'Location & lighting', cls: '' },
      { op: '=' },
      { icon: 'image', label: 'Scene', sub: 'Reusable template', cls: 'primary' },
      { op: '\u2192' },
      { icon: 'film', label: 'Clip Frames', sub: 'AI-generated', cls: 'success' }
    ];
    for (var pi = 0; pi < pipeNodes.length; pi++) {
      var pn = pipeNodes[pi];
      if (pn.op) { html += '<div class="vpm-pipe-op">' + pn.op + '</div>'; }
      else {
        html += '<div class="vpm-pipe-node' + (pn.cls ? ' vpm-pipe-' + pn.cls : '') + '">';
        html += '<div class="vpm-pipe-icon">' + icon(pn.icon) + '</div>';
        html += '<strong>' + esc(pn.label) + '</strong><small>' + esc(pn.sub) + '</small></div>';
      }
    }
    html += '</div></div>';

    // AI analysis
    if (sr.total_needed) {
      html += '<div class="vpm-panel"><div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin:0">' + icon('sparkles') + ' AI Analysis</span>';
      html += badge((sr.total_created || 0) + '/' + sr.total_needed + ' ready', sr.total_draft > 0 ? '#e37400' : '#0d904f');
      html += '</div>' + progressBar(Math.round(((sr.total_created || 0) / sr.total_needed) * 100));
      if (sr.total_draft > 0) html += '<div class="vpm-info-banner vpm-info-warning" style="margin-top:8px">' + icon('warning') + ' ' + sr.total_draft + ' draft entities need review</div>';
      html += '</div>';
    }

    return html;
  }

  // --- Looks / Avatars Tab ---
  function _studioLooksTab() {
    var brandLooks = S.brandStudio.looks || [];
    var videoLooks = S.meta.lookLibrary || [];
    var total = brandLooks.length + videoLooks.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('user-check') + ' Looks / Avatars (' + total + ')</h3>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-look">' + icon('plus') + ' Create Look</button></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Look = Character + Outfit.</strong> Looks define the visual identity of people in your video. Brand looks are read-only; create custom copies to edit.</div></div>';

    // Brand section
    if (brandLooks.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandLooks.length + '</span></div>';
      html += '<div class="vpm-entity-grid">';
      for (var bi = 0; bi < brandLooks.length; bi++) html += _renderEntityCard(brandLooks[bi], bi, 'look', true);
      html += '</div>';
    }

    // Custom section
    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoLooks.length + '</span></div>';
    html += '<div class="vpm-entity-grid">';
    for (var vi = 0; vi < videoLooks.length; vi++) html += _renderEntityCard(videoLooks[vi], vi, 'look', false);
    html += '<div class="vpm-entity-card vpm-entity-card-add" data-action="add-look">' + icon('plus') + '<span>New Look</span></div>';
    html += '</div>';
    return html;
  }

  // --- Environments Tab ---
  function _studioEnvironmentsTab() {
    var brandEnvs = S.brandStudio.environments || [];
    var videoEnvs = S.meta.environmentLibrary || [];
    var total = brandEnvs.length + videoEnvs.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('panorama') + ' Environments (' + total + ')</h3>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-environment">' + icon('plus') + ' Create Environment</button></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Environments</strong> define locations, lighting, and atmosphere. Combine with a Look to create a Scene.</div></div>';

    if (brandEnvs.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandEnvs.length + '</span></div>';
      html += '<div class="vpm-entity-grid">';
      for (var bi = 0; bi < brandEnvs.length; bi++) html += _renderEntityCard(brandEnvs[bi], bi, 'environment', true);
      html += '</div>';
    }

    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoEnvs.length + '</span></div>';
    html += '<div class="vpm-entity-grid">';
    for (var vi = 0; vi < videoEnvs.length; vi++) html += _renderEntityCard(videoEnvs[vi], vi, 'environment', false);
    html += '<div class="vpm-entity-card vpm-entity-card-add" data-action="add-environment">' + icon('plus') + '<span>New Environment</span></div>';
    html += '</div>';
    return html;
  }

  // --- Scenes Tab ---
  function _studioScenesTab() {
    var brandScenes = S.brandStudio.scenes || [];
    var videoScenes = S.meta.sceneLibrary || [];
    var total = brandScenes.length + videoScenes.length;
    var html = '<div class="vpm-flex-between vpm-mb-sm"><h3>' + icon('image') + ' Scenes (' + total + ')</h3>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="add-scene">' + icon('plus') + ' Create Scene</button>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-scenes">' + icon('sparkles') + ' Auto-Generate</button></div></div>';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <div><strong>Scene = Look + Environment</strong> with camera direction. Assign scenes to clip frames for consistent visual generation.</div></div>';

    // Brand scenes
    if (brandScenes.length) {
      html += '<div class="vpm-entity-section-head">' + icon('building') + ' <span>From Brand Library</span><span class="vpm-entity-count">' + brandScenes.length + '</span></div>';
      html += '<div class="vpm-scene-list">';
      for (var bi = 0; bi < brandScenes.length; bi++) html += _renderSceneCard(brandScenes[bi], bi, true);
      html += '</div>';
    }

    // Video scenes
    html += '<div class="vpm-entity-section-head">' + icon('video') + ' <span>This Video \u2014 Custom</span><span class="vpm-entity-count">' + videoScenes.length + '</span></div>';
    html += '<div class="vpm-scene-list">';
    for (var vi = 0; vi < videoScenes.length; vi++) html += _renderSceneCard(videoScenes[vi], vi, false);
    html += '<div class="vpm-scene-card vpm-scene-card-add" data-action="add-scene">' + icon('plus') + ' Create New Scene</div>';
    html += '</div>';
    return html;
  }

  function _renderSceneCard(sc, idx, isBrand) {
    var env = sc.environment_id ? S.envMap[sc.environment_id] : (sc.environment ? sc.environment : null);
    var lookNames = [];
    var lookIds = sc.look_ids || (sc.looks ? sc.looks.map(function(l) { return l.look_id; }) : []);
    for (var i = 0; i < lookIds.length; i++) { var lk = S.lookMap[lookIds[i]]; if (lk) lookNames.push(lk.name || 'Unnamed Look'); }

    var html = '<div class="vpm-scene-card' + (isBrand ? ' vpm-scene-card-brand' : '') + (sc._draft ? ' vpm-scene-card-draft' : '') + '">';
    html += '<div class="vpm-scene-card-head"><span class="vpm-scene-name">' + esc(sc.name || 'Unnamed') + '</span>';
    if (isBrand) html += sourceBadge('brand');
    else html += sourceBadge('video');
    if (sc._draft) html += ' <span class="vpm-text-warning vpm-text-xs" style="font-weight:600">Draft</span>';
    if (sc.suggested_duration || sc.duration) html += '<span class="vpm-scene-dur">' + (sc.suggested_duration || sc.duration || 0) + 's</span>';
    html += '</div>';

    // Composition formula
    html += '<div class="vpm-scene-compose">';
    if (lookNames.length) html += '<span class="vpm-scene-part vpm-scene-look-part">' + icon('user-check') + ' ' + esc(lookNames.join(', ')) + '</span><span class="vpm-scene-op">+</span>';
    html += '<span class="vpm-scene-part vpm-scene-env-part">' + icon('panorama') + ' ' + esc(env ? (env.name || 'Unnamed Env') : (sc.environment ? sc.environment.name : 'No environment')) + '</span>';
    html += '</div>';

    // Camera direction
    if (sc.camera_direction) html += '<div class="vpm-scene-camera">' + icon('camera') + ' ' + esc(sc.camera_direction) + '</div>';

    // Actions
    html += '<div class="vpm-scene-actions">';
    if (isBrand) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-brand-scene" data-idx="' + idx + '">' + icon('copy') + ' Copy to Video</button>';
    } else {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-scene" data-idx="' + idx + '">' + icon('pen') + ' Edit</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-scene" data-idx="' + idx + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    }
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(_buildScenePrompt(sc)) + '">' + icon('copy') + ' Prompt</button>';
    html += '</div></div>';
    return html;
  }

  function _buildScenePrompt(sc) {
    var parts = [];
    var lookIds = sc.look_ids || (sc.looks ? sc.looks.map(function(l) { return l.look_id; }) : []);
    for (var i = 0; i < lookIds.length; i++) { var lk = S.lookMap[lookIds[i]]; if (lk && (lk.combined_prompt_fragment || lk.prompt_fragment)) parts.push(lk.combined_prompt_fragment || lk.prompt_fragment); }
    var env = sc.environment_id ? S.envMap[sc.environment_id] : (sc.environment || null);
    if (env && env.prompt_fragment) parts.push(env.prompt_fragment);
    if (sc.camera_direction) parts.push(sc.camera_direction);
    if (sc.scene_notes) parts.push(sc.scene_notes);
    return parts.join(', ');
  }

  // --- Brand Library Tab ---
  function _studioBrandLibraryTab() {
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.characters.length && !bs.looks.length && !bs.environments.length)) {
      return '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('building') + '</div><h3>No Brand Library</h3><p>No brand studio library found on this page. Add a <code>.brand-studio-library</code> element to the page template, or import entities manually.</p></div>';
    }

    var html = '<div class="vpm-panel"><div class="vpm-flex-between"><div>';
    html += '<h3 style="margin:0">' + icon('building') + ' ' + esc(bs.brandInfo ? bs.brandInfo.name : 'Brand Library') + '</h3>';
    html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:2px">Loaded from <code>.brand-studio-library</code> on page</div>';
    html += '</div><div class="vpm-btn-row"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="reload-brand-library">' + icon('arrows-rotate') + ' Reload</button></div></div></div>';

    // Collections
    if (bs.collections && bs.collections.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('layer-group') + ' Collections (' + bs.collections.length + ')</div>';
      html += '<div class="vpm-coll-grid">';
      for (var ci = 0; ci < bs.collections.length; ci++) {
        var col = bs.collections[ci];
        html += '<div class="vpm-coll-card"><div class="vpm-coll-name">' + esc(col.name || 'Unnamed') + '</div>';
        var entityCount = (col.character_ids || []).length + (col.look_ids || []).length + (col.environment_ids || []).length + (col.scene_ids || []).length;
        html += '<div class="vpm-coll-count">' + entityCount + ' entities</div>';
        if (col.tags && col.tags.length) { html += '<div class="vpm-coll-tags">'; for (var ti = 0; ti < col.tags.length; ti++) html += '<span class="vpm-tag-pill">' + esc(col.tags[ti]) + '</span>'; html += '</div>'; }
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Characters summary
    if (bs.characters.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('users') + ' Characters (' + bs.characters.length + ')</div>';
      html += '<div class="vpm-lib-list">';
      for (var chi = 0; chi < bs.characters.length; chi++) {
        var ch = bs.characters[chi];
        html += '<div class="vpm-lib-row"><div class="vpm-lib-thumb vpm-lib-thumb-char">' + icon('users') + '</div>';
        html += '<div class="vpm-lib-info"><div class="vpm-lib-name">' + esc(ch.name || 'Unnamed') + '</div>';
        if (ch.role) html += '<div class="vpm-lib-meta">' + roleBadge(ch.role) + '</div>';
        html += '</div>';
        var pf = ch.prompt_fragment || '';
        if (pf) html += '<div class="vpm-lib-prompt">' + esc(truncate(pf, 60)) + '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Outfits summary
    if (bs.outfits.length) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('shirt') + ' Outfits (' + bs.outfits.length + ')</div>';
      html += '<div class="vpm-lib-list">';
      for (var oi = 0; oi < bs.outfits.length; oi++) {
        var o = bs.outfits[oi];
        html += '<div class="vpm-lib-row"><div class="vpm-lib-thumb vpm-lib-thumb-outfit">' + icon('shirt') + '</div>';
        html += '<div class="vpm-lib-info"><div class="vpm-lib-name">' + esc(o.name || 'Unnamed') + '</div>';
        html += '<div class="vpm-lib-meta">' + esc(o.category || '') + '</div></div>';
        var opf = o.prompt_fragment || '';
        if (opf) html += '<div class="vpm-lib-prompt">' + esc(truncate(opf, 60)) + '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    return html;
  }


  // ============================================================
  // SECTION 9: ENTITY CARD RENDERER (reusable)
  // ============================================================

  function _renderEntityCard(entity, idx, entityType, isBrand) {
    var primaryImg = getEntityPrimaryImage(entity);
    var html = '<div class="vpm-entity-card' + (isBrand ? ' vpm-entity-card-brand' : '') + (entity._draft ? ' vpm-entity-card-draft' : '') + '">';
    html += '<div class="vpm-entity-img' + (entityType === 'look' ? ' vpm-entity-img-look' : entityType === 'environment' ? ' vpm-entity-img-env' : '') + '">';
    if (primaryImg) html += '<img src="' + esc(primaryImg) + '">';
    else html += icon(entityType === 'look' ? 'user-check' : entityType === 'environment' ? 'panorama' : 'image');
    if (entity._draft) html += '<span class="vpm-entity-draft-badge">' + icon('warning') + ' Draft</span>';
    html += '</div><div class="vpm-entity-info">';
    html += '<h4 class="vpm-entity-name">' + esc(entity.name || 'Unnamed') + '</h4>';
    // Badges
    var badges = '';
    if (entity.source) badges += sourceBadge(entity.source);
    if (entity.role && entityType === 'look') badges += ' ' + roleBadge(entity.role);
    if (entity.type && entityType === 'environment') badges += ' <span class="vpm-text-xs vpm-text-muted">' + esc(entity.type) + '</span>';
    if (badges) html += '<div style="margin-top:3px">' + badges + '</div>';
    // Prompt
    var pf = entity.prompt_fragment || entity.combined_prompt_fragment || '';
    if (pf) html += '<div class="vpm-entity-prompt">' + esc(truncate(pf, 80)) + '</div>';
    // Actions
    html += '<div class="vpm-btn-row" style="margin-top:6px">';
    if (isBrand) {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-brand-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '">' + icon('copy') + ' Copy</button>';
    } else {
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '">' + icon('pen') + '</button>';
      if (pf) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(pf) + '">' + icon('copy') + '</button>';
      html += '<button class="vpm-btn-icon-sm" data-action="delete-entity" data-entity-type="' + entityType + '" data-entity-idx="' + idx + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    }
    html += '</div></div></div>';
    return html;
  }

  function _getEntityLib(type) {
    switch (type) {
      case 'look': return S.meta.lookLibrary;
      case 'environment': return S.meta.environmentLibrary;
      case 'scene': return S.meta.sceneLibrary;
      default: return null;
    }
  }

  function _galleryTypeForEntity(entityType) {
    return entityType === 'look' ? 'looks' : entityType === 'environment' ? 'environments' : 'looks';
  }


  // ============================================================
  // SECTION 10: IMAGE PICKER — Reusable (entity edit modals)
  // ============================================================

  function _renderImagePicker(galleryType, entityType, idx, refImages) {
    var gallery = (S.galleries || {})[galleryType] || [];
    var primaryUrl = '';
    var refs = refImages || [];
    for (var ri = 0; ri < refs.length; ri++) { if (refs[ri].url) { primaryUrl = refs[ri].url; break; } }

    var html = '<div class="vpm-image-picker" data-gallery-type="' + esc(galleryType) + '" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">';
    html += '<label class="vpm-form-label">' + icon('image') + ' Reference Image</label>';
    if (primaryUrl) {
      html += '<div class="vpm-image-preview"><img src="' + esc(primaryUrl) + '" class="vpm-image-preview-img">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="remove-entity-image" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">' + icon('xmark') + ' Remove</button></div>';
    }
    html += '<div class="vpm-btn-row" style="margin:8px 0">';
    html += '<button class="vpm-btn vpm-btn-sm vpm-btn-primary" data-action="upload-entity-image" data-gallery-type="' + esc(galleryType) + '" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '">' + icon('upload') + ' Upload</button>';
    if (gallery.length) html += '<button class="vpm-btn vpm-btn-sm vpm-btn-outline" data-action="browse-entity-gallery" data-gallery-type="' + esc(galleryType) + '">' + icon('images') + ' Gallery (' + gallery.length + ')</button>';
    html += '</div>';
    if (gallery.length) {
      html += '<div class="vpm-image-thumbstrip">';
      for (var gi = 0; gi < Math.min(gallery.length, 8); gi++) {
        var isSel = primaryUrl === gallery[gi].url;
        html += '<div class="vpm-image-thumb' + (isSel ? ' vpm-image-thumb-selected' : '') + '" data-action="select-entity-image" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '" data-gallery-idx="' + gi + '" data-gallery-type="' + esc(galleryType) + '"><img src="' + esc(gallery[gi].url) + '"></div>';
      }
      html += '</div>';
    }
    html += '<div style="margin-top:6px;display:flex;gap:6px;align-items:center"><span class="vpm-text-xs vpm-text-muted">or</span>';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1" data-action="save-entity-image-url" data-entity-type="' + esc(entityType) + '" data-entity-idx="' + idx + '" value="' + esc(primaryUrl) + '" placeholder="Paste image URL\u2026"></div>';
    html += '</div>';
    return html;
  }

  function _setEntityImage(entityType, idx, url, fid) {
    var lib = _getEntityLib(entityType);
    var entity = lib ? lib[idx] : null;
    if (!entity) return;
    entity.reference_images = url ? [{ url: url, type: 'primary', gallery_fid: fid || '', set_at: new Date().toISOString() }] : [];
    entity.modified = new Date().toISOString();
    syncToTextarea();
    var $picker = $('.vpm-image-picker[data-entity-type="' + entityType + '"][data-entity-idx="' + idx + '"]');
    if ($picker.length) { var galType = $picker.data('gallery-type'); $picker.replaceWith(_renderImagePicker(galType, entityType, idx, entity.reference_images)); }
    toast(url ? 'Image set' : 'Image removed', url ? 'success' : 'info');
  }


  // ============================================================
  // SECTION 11: ENTITY EDIT MODALS (Look, Environment, Scene)
  // ============================================================

  function _openLookEditModal(idx, look) {
    var isNew = !look;
    if (isNew) look = createDefaultLook();
    var bs = S.brandStudio || {};
    var allChars = bs.characters || [];
    var allOutfits = bs.outfits || [];

    var html = '<div class="vpm-info-banner" style="margin-bottom:12px">' + icon('sparkles') + ' <strong>Look = Character + Outfit.</strong> Select components or write a combined prompt directly.</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Look Name</label><input class="vpm-input" data-field="name" value="' + esc(look.name || '') + '" placeholder="e.g. Professional Presenter"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Role</label><select class="vpm-select" data-field="role">';
    for (var rk in Constants.LOOK_ROLES) html += '<option value="' + rk + '"' + (look.role === rk ? ' selected' : '') + '>' + esc(Constants.LOOK_ROLES[rk].label) + '</option>';
    html += '</select></div>';
    // Character + Outfit selectors (from brand library)
    if (allChars.length) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('users') + ' Character (from Brand)</label><select class="vpm-select" data-field="character_id"><option value="">— None —</option>';
      for (var ci = 0; ci < allChars.length; ci++) html += '<option value="' + esc(allChars[ci].id) + '"' + (look.character_id === allChars[ci].id ? ' selected' : '') + '>' + esc(allChars[ci].name) + '</option>';
      html += '</select></div>';
    }
    if (allOutfits.length) {
      html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('shirt') + ' Outfit (from Brand)</label><select class="vpm-select" data-field="outfit_id"><option value="">— None —</option>';
      for (var oi = 0; oi < allOutfits.length; oi++) html += '<option value="' + esc(allOutfits[oi].id) + '"' + (look.outfit_id === allOutfits[oi].id ? ' selected' : '') + '>' + esc(allOutfits[oi].name) + '</option>';
      html += '</select></div>';
    }
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Combined Prompt Fragment</label><textarea class="vpm-textarea" data-field="combined_prompt_fragment" rows="3" placeholder="Full visual description for AI prompts. Leave blank to auto-combine from Character + Outfit.">' + esc(look.combined_prompt_fragment || '') + '</textarea></div>';
    // Image picker
    if (!isNew && idx >= 0) {
      html += _renderImagePicker('looks', 'look', idx, look.reference_images);
    }

    openModal(isNew ? 'Create Look' : 'Edit Look', html, { size: 'lg', saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      look.name = data.name || look.name || 'Unnamed';
      look.role = data.role || look.role;
      look.character_id = data.character_id || '';
      look.outfit_id = data.outfit_id || '';
      var cpf = data.combined_prompt_fragment || '';
      if (!cpf) {
        // Auto-combine
        var parts = [];
        if (look.character_id) { var ch = (bs.characters || []).find(function(c) { return c.id === look.character_id; }); if (ch && ch.prompt_fragment) parts.push(ch.prompt_fragment); }
        if (look.outfit_id) { var out = (bs.outfits || []).find(function(o) { return o.id === look.outfit_id; }); if (out && out.prompt_fragment) parts.push(out.prompt_fragment); }
        cpf = parts.join(', ');
      }
      look.combined_prompt_fragment = cpf;
      look.modified = new Date().toISOString();
      look.status = 'ready';
      if (isNew) { S.meta.lookLibrary = S.meta.lookLibrary || []; S.meta.lookLibrary.push(look); logActivity('look_created', 'Created look: ' + look.name); }
      else { S.meta.lookLibrary[idx] = look; logActivity('look_edited', 'Edited look: ' + look.name); }
      _snapshotFull(isNew ? 'Create look' : 'Edit look'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Look ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }

  function _openEnvironmentEditModal(idx, env) {
    var isNew = !env;
    if (isNew) env = createDefaultEnvironment();
    var html = '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Name</label><input class="vpm-input" data-field="name" value="' + esc(env.name || '') + '" placeholder="e.g. Modern Office — Daylight"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type">';
    for (var et in Constants.ENVIRONMENT_TYPES) html += '<option value="' + et + '"' + (env.type === et ? ' selected' : '') + '>' + esc(Constants.ENVIRONMENT_TYPES[et].label) + '</option>';
    html += '</select></div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label><textarea class="vpm-textarea" data-field="description" rows="2" placeholder="Physical description of the location\u2026">' + esc(env.description || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Prompt Fragment</label><textarea class="vpm-textarea" data-field="prompt_fragment" rows="3" placeholder="Concise visual description for AI prompts\u2026">' + esc(env.prompt_fragment || '') + '</textarea></div>';
    if (!isNew && idx >= 0) html += _renderImagePicker('environments', 'environment', idx, env.reference_images);
    openModal(isNew ? 'Create Environment' : 'Edit Environment', html, { saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      env.name = data.name || env.name || 'Unnamed'; env.type = data.type || env.type;
      env.description = data.description || ''; env.prompt_fragment = data.prompt_fragment || '';
      env.modified = new Date().toISOString(); env.status = 'ready';
      if (isNew) { S.meta.environmentLibrary = S.meta.environmentLibrary || []; S.meta.environmentLibrary.push(env); logActivity('environment_created', 'Created: ' + env.name); }
      else { S.meta.environmentLibrary[idx] = env; }
      _snapshotFull(isNew ? 'Create env' : 'Edit env'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Environment ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }

  function _openSceneEditModal(idx, scene) {
    var isNew = !scene;
    if (isNew) scene = createDefaultScene();
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Scene Name</label>';
    html += '<input class="vpm-input" data-field="name" value="' + esc(scene.name || '') + '" placeholder="e.g. Presenter in Modern Office"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' Environment</label>';
    html += '<select class="vpm-select" data-field="environment_id"><option value="">— Select —</option>';
    for (var ei = 0; ei < S.allEnvironments.length; ei++) { var env = S.allEnvironments[ei]; html += '<option value="' + esc(env.id) + '"' + (scene.environment_id === env.id ? ' selected' : '') + '>' + esc(env.name) + (env.source === 'brand' ? ' (brand)' : '') + '</option>'; }
    html += '</select></div>';
    // Look checkboxes
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Looks</label>';
    var currentLookIds = scene.look_ids || (scene.looks ? scene.looks.map(function(l) { return l.look_id; }) : []);
    if (S.allLooks.length) {
      for (var li = 0; li < S.allLooks.length; li++) { var lk = S.allLooks[li]; var isChecked = currentLookIds.indexOf(lk.id) > -1;
        html += '<label style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:13px;cursor:pointer"><input type="checkbox" class="vpm-scene-look-check" value="' + esc(lk.id) + '"' + (isChecked ? ' checked' : '') + '> ' + esc(lk.name) + (lk.source === 'brand' ? ' (brand)' : '') + '</label>'; }
    } else html += '<p class="vpm-text-sm vpm-text-muted">No looks available. Create one in the Looks tab first.</p>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('camera') + ' Camera Direction</label>';
    html += '<input class="vpm-input" data-field="camera_direction" value="' + esc(scene.camera_direction || '') + '" placeholder="e.g. Medium shot, slow dolly-in"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" data-field="suggested_duration" min="1" max="120" value="' + (scene.suggested_duration || 8) + '"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes</label>';
    html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="Scene description, mood, action notes\u2026">' + esc(scene.notes || scene.scene_notes || '') + '</textarea></div>';
    openModal(isNew ? 'Create Scene' : 'Edit Scene', html, { saveLabel: isNew ? 'Create' : 'Save', onSave: function() {
      var data = collectModalFields();
      scene.name = data.name || scene.name || 'Unnamed';
      scene.environment_id = data.environment_id || '';
      scene.camera_direction = data.camera_direction || '';
      scene.suggested_duration = parseInt(data.suggested_duration, 10) || 8;
      scene.notes = data.notes || '';
      scene.look_ids = [];
      $('.vpm-scene-look-check:checked').each(function() { scene.look_ids.push($(this).val()); });
      scene.modified = new Date().toISOString(); scene.status = 'ready';
      if (isNew) { S.meta.sceneLibrary = S.meta.sceneLibrary || []; S.meta.sceneLibrary.push(scene); logActivity('scene_created', 'Created: ' + scene.name); }
      else { S.meta.sceneLibrary[idx] = scene; }
      _snapshotFull(isNew ? 'Create scene' : 'Edit scene'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Scene ' + (isNew ? 'created' : 'updated'), 'success');
    }});
  }


  // ============================================================
  // SECTION 12: CLIPS VIEW — FULL (Split layout)
  // ============================================================

  function renderClipsFull() {
    var clips = S.data.clips || [];
    var done = S.clipStats.aiDone + S.clipStats.nonAiDone + S.clipStats.templateDone;
    var totalDur = 0; for (var di = 0; di < clips.length; di++) totalDur += (clips[di].duration || 0);
    var targetDur = (S.data.video || {}).duration_target || (S.data.start && S.data.start.preferences ? S.data.start.preferences.target_duration : 120) || 120;
    var pct = Math.round((done / Math.max(clips.length, 1)) * 100);

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('film') + ' Clips</h2>';
    html += '<p class="vpm-view-subtitle">' + clips.length + ' clips \u00B7 ' + formatDuration(totalDur) + ' / ' + formatDuration(targetDur) + ' target \u00B7 ' + pct + '% complete</p></div>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-generate-clips" title="Generates all sections at once \u2014 for large videos, generate section by section">' + icon('sparkles') + ' Generate All Sections</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="add-clip-modal">' + icon('plus') + ' Add Clip</button></div></div>';

    // Per-track progress bars (Phase G)
    html += '<div class="vpm-clips-track-progress">';
    var tracks = [
      { key: 'ai', label: 'AI', total: S.clipStats.totalAI, done: S.clipStats.aiDone, color: 'var(--vpm-accent)' },
      { key: 'non-ai', label: 'Non-AI', total: S.clipStats.totalNonAI, done: S.clipStats.nonAiDone, color: 'var(--vpm-info)' },
      { key: 'template', label: 'Template', total: S.clipStats.totalTemplate, done: S.clipStats.templateDone, color: 'var(--vpm-text-muted)' }
    ];
    for (var tp = 0; tp < tracks.length; tp++) {
      var tr = tracks[tp]; var tPct = tr.total ? Math.round((tr.done / tr.total) * 100) : 0;
      html += '<div class="vpm-track-progress-item">';
      html += '<div class="vpm-track-progress-label">' + trackBadge(tr.key) + ' <span>' + tr.done + '/' + tr.total + '</span></div>';
      html += '<div class="vpm-track-progress-bar"><div class="vpm-track-progress-fill" style="width:' + tPct + '%;background:' + tr.color + '"></div></div>';
      html += '</div>';
    }
    // Duration bar
    var durPct = Math.min(100, Math.round((totalDur / Math.max(targetDur, 1)) * 100));
    var durOver = totalDur > targetDur;
    html += '<div class="vpm-track-progress-item">';
    html += '<div class="vpm-track-progress-label">' + icon('clock') + ' <span>' + formatDuration(totalDur) + ' / ' + formatDuration(targetDur) + '</span></div>';
    html += '<div class="vpm-track-progress-bar"><div class="vpm-track-progress-fill" style="width:' + durPct + '%;background:' + (durOver ? 'var(--vpm-warning)' : 'var(--vpm-primary)') + '"></div></div>';
    html += '</div></div>';

    html += renderTimelineBar(clips);

    // Empty state — only when NO clips AND no blueprint sections
    var _hasBpSections = ((S.data.blueprint || {}).sections || []).length > 0;
    if (!clips.length && !_hasBpSections) {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('film') + '</div><h3>No Clips Yet</h3>';
      html += '<p>Create your Blueprint and Script first, then generate clips section by section.</p>';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-clips">' + icon('sparkles') + ' Generate All from Script</button></div>';
      html += renderNavButtons(S.mode === 'advanced' ? 'Studio' : 'Script', 'Continue to Publish', 'publish') + '</div>';
      return html;
    }

    // Track filter chips (only show when clips exist)
    if (clips.length) {
      html += '<div class="vpm-clips-filter">';
      var filters = [['all','All',clips.length],['ai','AI',S.clipStats.totalAI],['non-ai','Non-AI',S.clipStats.totalNonAI],['template','Template',S.clipStats.totalTemplate]];
      for (var fi = 0; fi < filters.length; fi++) {
        var f = filters[fi];
        html += '<button class="vpm-chip' + (S.clipTrackFilter === f[0] ? ' vpm-chip-active' : '') + '" data-action="filter-clips" data-filter="' + f[0] + '">' + esc(f[1]) + ' (' + f[2] + ')</button>';
      }
      html += '</div>';
    }

    // Split layout
    html += '<div class="vpm-clips-split">';

    // Left: clip list panel (Phase A)
    html += '<div class="vpm-clips-list-panel">';
    html += '<div class="vpm-clips-list-header"><span>' + (clips.length ? 'Clips (' + clips.length + ')' : 'Script Sections') + '</span>';
    html += '<button class="vpm-btn-icon-sm" data-action="add-clip-modal" title="Add Clip">' + icon('plus') + '</button></div>';
    var filteredClips = clips;
    if (S.clipTrackFilter !== 'all') filteredClips = clips.filter(function(c) { return c.track === S.clipTrackFilter; });

    // Build section map from clips
    var secMap = {};
    for (var ci = 0; ci < filteredClips.length; ci++) {
      var sec = filteredClips[ci].section || 'body';
      if (!secMap[sec]) secMap[sec] = [];
      secMap[sec].push(filteredClips[ci]);
    }

    // Build section order from blueprint (show ALL sections, even empty ones)
    var bpSecs = (S.data.blueprint || {}).sections || [];
    var secOrder = [];
    for (var bsi = 0; bsi < bpSecs.length; bsi++) secOrder.push(bpSecs[bsi].id);
    // Add any sections from clips not in blueprint
    for (var sk in secMap) { if (secOrder.indexOf(sk) === -1) secOrder.push(sk); }
    // If no blueprint sections at all, use 'body'
    if (!secOrder.length && filteredClips.length) secOrder.push('body');

    // Pre-compute section metrics
    var _sWpm = (S.meta.settings || {}).words_per_minute || 150;
    var _sVideoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var _sMCfg = getModelDurationConfig(_sVideoModel);
    var _sMaxClipDur = _sMCfg.maxDuration || _sMCfg.defaultDuration || 8;
    var _sMaxWordsPerClip = Math.floor((_sMaxClipDur / 60) * _sWpm);
    var _scriptSecs = (S.data.script || {}).sections || [];

    // Render section-by-section
    for (var gi = 0; gi < secOrder.length; gi++) {
      var gk = secOrder[gi];
      var gc = secMap[gk] || [];
      var gd = 0, gDone = 0;
      for (var gdi = 0; gdi < gc.length; gdi++) { gd += (gc[gdi].duration || 0); if (_isClipDone(gc[gdi])) gDone++; }
      // Resolve section label from blueprint
      var gl = gk, bpSec = null;
      for (var bli = 0; bli < bpSecs.length; bli++) { if (bpSecs[bli].id === gk || bpSecs[bli].label === gk) { gl = bpSecs[bli].label; bpSec = bpSecs[bli]; break; } }

      // Compute per-section metrics — match script section by ID, then by label, then by index
      var _scriptSec = null;
      for (var _ssi2 = 0; _ssi2 < _scriptSecs.length; _ssi2++) { if (_scriptSecs[_ssi2].id === gk) { _scriptSec = _scriptSecs[_ssi2]; break; } }
      if (!_scriptSec && gl) {
        var _glLow = gl.toLowerCase().trim();
        for (var _ssi3 = 0; _ssi3 < _scriptSecs.length; _ssi3++) { if ((_scriptSecs[_ssi3].label || '').toLowerCase().trim() === _glLow) { _scriptSec = _scriptSecs[_ssi3]; break; } }
      }
      if (!_scriptSec && gi < _scriptSecs.length) _scriptSec = _scriptSecs[gi];
      var _secWordCount = _scriptSec ? countWords(stripHtml(_scriptSec.content || '')) : 0;
      var _expectedClips = _secWordCount ? Math.max(1, Math.ceil(_secWordCount / _sMaxWordsPerClip)) : 0;
      var _secDone = gc.length >= _expectedClips && _expectedClips > 0;

      // Section header
      html += '<div class="vpm-clips-group-head' + (_secDone ? ' vpm-clips-group-done' : '') + '">';
      html += '<div class="vpm-clips-group-info"><span class="vpm-clips-group-label">' + icon('bookmark') + ' ' + (gi + 1) + '. ' + esc(gl) + '</span>';
      // Rich metadata
      var _secMeta = '';
      if (gc.length && _expectedClips) {
        _secMeta = gc.length + '/' + _expectedClips + ' clips';
        if (_secDone) _secMeta += ' ' + icon('circle-check');
      } else if (gc.length) {
        _secMeta = gc.length + ' clip' + (gc.length !== 1 ? 's' : '');
      } else {
        _secMeta = '0/' + (_expectedClips || '?') + ' clips';
      }
      if (_secWordCount) _secMeta += ' \u00B7 ' + _secWordCount + 'w';
      if (gc.length && gd) _secMeta += ' \u00B7 ' + formatDuration(gd);
      html += '<span class="vpm-text-xs vpm-text-muted">' + _secMeta + '</span>';
      html += '</div>';
      html += '<div class="vpm-clips-group-actions">';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-xs" data-action="generate-section-clips" data-section-id="' + esc(gk) + '" title="' + (gc.length ? 'Regenerate clips for this section' : 'Generate clips for this section') + '">' + icon('sparkles') + (gc.length ? ' Regen' : ' Generate') + '</button>';
      html += '</div>';
      // Progress bar for all sections
      var _progressPct = _expectedClips ? Math.min(100, Math.round((gc.length / _expectedClips) * 100)) : (gc.length ? 100 : 0);
      var _progressColor = _progressPct >= 100 ? 'var(--vpm-success)' : 'var(--vpm-primary)';
      if (_expectedClips || gc.length) html += '<div class="vpm-clips-group-progress"><div class="vpm-clips-group-progress-fill" style="width:' + _progressPct + '%;background:' + _progressColor + '"></div></div>';
      html += '</div>';

      // Empty section placeholder
      if (!gc.length) {
        html += '<div class="vpm-clips-section-empty">';
        if (_scriptSec && _scriptSec.content) {
          html += '<div class="vpm-text-xs vpm-text-muted" style="padding:4px 8px">' + icon('file-lines') + ' ' + esc(truncate(stripHtml(_scriptSec.content), 120)) + '</div>';
          html += '<div class="vpm-text-xs vpm-text-muted" style="padding:0 8px 6px">' + _secWordCount + ' words \u00B7 ~' + _expectedClips + ' clip' + (_expectedClips !== 1 ? 's' : '') + ' expected (' + _sMaxClipDur + 's max per clip)</div>';
        }
        html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-section-clips" data-section-id="' + esc(gk) + '" style="width:100%">' + icon('sparkles') + ' Generate Clips for ' + esc(truncate(gl, 25)) + '</button>';
        html += '</div>';
        continue;
      }

      // Render clips in this section
      for (var rci = 0; rci < gc.length; rci++) {
        var c = gc[rci]; var ct = Constants.CLIP_TYPES[c.type] || {}; var track = c.track || ct.track || 'ai';
        var isActive = c.id === S.selectedClipId;
        var durV = (track === 'ai') ? validateClipDuration(c) : { valid: true };
        var isDone = _isClipDone(c);
        html += '<div class="vpm-clips-list-item' + (isActive ? ' vpm-clips-list-active' : '') + (!durV.valid ? ' vpm-clips-list-warn' : '') + '" data-action="select-clip" data-clip-id="' + c.id + '">';
        html += '<span class="vpm-clip-order">#' + c.order + '</span>';
        html += '<div class="vpm-clip-status-dot" style="background:' + _csColor(c.status, track) + '"></div>';
        html += '<div class="vpm-clips-list-info"><div class="vpm-clips-list-title">' + esc(truncate(c.title || 'Untitled', 22)) + '</div>';
        html += '<div class="vpm-clips-list-meta">' + clipTypeBadge(c.type) + ' <span class="vpm-clip-list-dur">' + (c.duration || 0) + 's</span>';
        if (isDone) html += ' <span class="vpm-clip-done-check">' + icon('circle-check') + '</span>';
        if (!durV.valid) html += ' <span class="vpm-dur-warn">' + icon('warning') + '</span>';
        html += '</div></div>';
        html += '<div class="vpm-clip-reorder">';
        html += '<button class="vpm-clip-reorder-btn" data-action="move-clip-up" data-clip-id="' + c.id + '" title="Move up">' + icon('chevron-up') + '</button>';
        html += '<button class="vpm-clip-reorder-btn" data-action="move-clip-down" data-clip-id="' + c.id + '" title="Move down">' + icon('chevron-down') + '</button>';
        html += '</div></div>';
      }
    }
    html += '</div>';

    // Right: detail panel (Phase B container)
    html += '<div class="vpm-clips-detail-panel">';
    var sel = S.selectedClipId ? S.clipMap[S.selectedClipId] : (clips.length > 0 ? clips[0] : null);
    if (sel) {
      html += '<div class="vpm-clip-detail-container">' + _renderClipDetail(sel) + '</div>';
    } else {
      html += '<div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('hand-pointer') + '</div><h3>Select a Clip</h3>';
      html += '<p>Choose a clip from the list to configure prompts, frames, and production details.</p></div>';
    }
    html += '</div></div>';

    html += renderNavButtons(S.mode === 'advanced' ? 'Studio' : 'Script', 'Continue to Publish', 'publish') + '</div>';
    return html;
  }

  function _isClipDone(clip) {
    var s = clip.status || '';
    return s === 'done' || s === 'video-done' || s === 'applied' || s === 'customized';
  }

  // --- Clip Detail Panel (Phase B: container + header + clip nav) ---
  function _renderClipDetail(clip) {
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var track = clip.track || ct.track || 'ai';
    // Lazy-ensure: create heavy structures on-demand when user opens clip detail
    if (track === 'ai') ensurePromptSet(clip);
    if (track === 'non-ai') ensureNonAiPlanning(clip);
    ensureProductionConfig(clip);
    var durV = (track === 'ai') ? validateClipDuration(clip) : { valid: true };
    var clips = S.data.clips || [];
    var clipIdx = -1; for (var ci = 0; ci < clips.length; ci++) { if (clips[ci].id === clip.id) { clipIdx = ci; break; } }
    var html = '<div class="vpm-clip-detail">';

    // Header with action buttons
    html += '<div class="vpm-clip-detail-head">';
    html += '<div class="vpm-clip-detail-head-left">';
    html += '<h3 class="vpm-clip-detail-title">#' + clip.order + ' ' + esc(clip.title || 'Untitled') + '</h3>';
    html += '<div class="vpm-clip-detail-badges">' + clipTypeBadge(clip.type) + ' ' + trackBadge(track) + ' ' + clipStatusBadge(clip.status, track) + ' ' + badge((clip.duration || 0) + 's', '#6b7280');
    if (!durV.valid) html += ' <span class="vpm-dur-warn" title="' + esc(durV.warning) + '">' + icon('warning') + ' ' + esc(durV.snapped + 's') + '</span>';
    html += '</div></div>';
    html += '<div class="vpm-clip-detail-actions">';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-clip-modal" data-clip-id="' + clip.id + '">' + icon('pen') + ' Edit</button>';
    html += '<button class="vpm-btn-icon-subtle" data-action="duplicate-clip" data-clip-id="' + clip.id + '" title="Duplicate">' + icon('copy') + '</button>';
    html += '<button class="vpm-btn-icon-subtle" data-action="delete-clip" data-clip-id="' + clip.id + '" title="Delete" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
    html += '</div></div>';

    // Prerequisite warnings
    var _clipPrereqs = getClipPrerequisites(clip);
    if (_clipPrereqs.length) {
      html += '<div class="vpm-clip-prereqs">';
      for (var wi = 0; wi < _clipPrereqs.length; wi++) {
        var _w = _clipPrereqs[wi];
        var _sevCls = _w.severity === 'error' ? 'vpm-prereq-error' : _w.severity === 'warning' ? 'vpm-prereq-warn' : 'vpm-prereq-info';
        html += '<div class="vpm-prereq-banner ' + _sevCls + '">';
        html += '<span>' + icon(_w.severity === 'error' ? 'triangle-exclamation' : _w.severity === 'warning' ? 'circle-exclamation' : 'circle-info') + ' ' + esc(_w.message) + '</span>';
        html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="' + _w.action + '" data-clip-id="' + clip.id + '">' + icon('sparkles') + ' ' + esc(_w.actionLabel) + '</button>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Clip navigation: prev / next
    html += '<div class="vpm-clip-nav">';
    if (clipIdx > 0) html += '<button class="vpm-clip-nav-btn" data-action="select-clip" data-clip-id="' + clips[clipIdx - 1].id + '">' + icon('chevron-left') + ' #' + clips[clipIdx - 1].order + '</button>';
    else html += '<span></span>';
    html += '<span class="vpm-clip-nav-pos">' + (clipIdx + 1) + ' of ' + clips.length + '</span>';
    if (clipIdx < clips.length - 1) html += '<button class="vpm-clip-nav-btn" data-action="select-clip" data-clip-id="' + clips[clipIdx + 1].id + '">#' + clips[clipIdx + 1].order + ' ' + icon('chevron-right') + '</button>';
    else html += '<span></span>';
    html += '</div>';

    // AI status workflow bar — filter frame steps for non-frames modes
    if (track === 'ai') {
      html += '<div class="vpm-clip-workflow">';
      var _wfPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _wfModelDefaultGenMode = (Constants.VIDEO_MODELS[_wfPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _wfGenMode = ((clip.prompt_set || {}).video || {}).gen_mode || _wfModelDefaultGenMode;
      var _showFrameStatuses = (_wfGenMode === 'frames-to-video');
      var statuses = Constants.AI_CLIP_STATUS_ORDER.filter(function(s) {
        if (!_showFrameStatuses && (s === 'first-frame-ready' || s === 'last-frame-ready')) return false;
        return true;
      });
      var curIdx = statuses.indexOf(clip.status);
      for (var si = 0; si < statuses.length; si++) {
        var isDone = si <= curIdx;
        html += '<div class="vpm-cw-step' + (isDone ? ' vpm-cw-done' : '') + '"><div class="vpm-cw-bar"></div><span class="vpm-cw-label">' + esc((Constants.AI_CLIP_STATUSES[statuses[si]] || {}).label || statuses[si]) + '</span></div>';
      }
      html += '</div>';
    }

    // Track-specific tabs
    html += '<div class="vpm-inner-tabs">';
    if (track === 'ai') {
      var ps = clip.prompt_set || {};
      var _vd = ps.video || {};
      var _tabPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
      var _tabModelDefaultGenMode = (Constants.VIDEO_MODELS[_tabPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
      var _genMode = _vd.gen_mode || _tabModelDefaultGenMode;
      var _showFrameTabs = (_genMode === 'frames-to-video');
      // Mode-aware tab 1 label and icon
      var _tab1Label = _genMode === 'ingredients-to-video' ? 'Script & Assets'
                     : _genMode === 'text-to-video' ? 'Script'
                     : 'Script & Config';
      var _tab1Icon  = _genMode === 'ingredients-to-video' ? 'layer-group'
                     : _genMode === 'text-to-video' ? 'file-lines'
                     : 'sliders';
      var aiTabs = [{ id:'script-config', l: _tab1Label, ic: _tab1Icon }];
      if (_showFrameTabs) {
        aiTabs.push({ id:'first-frame', l:'First Frame', ic:'image' });
        if (ps.requires_last_frame) aiTabs.push({ id:'last-frame', l:'Last Frame', ic:'images' });
      }
      aiTabs.push({ id:'video', l:'Prompt', ic:'wand-magic-sparkles' });
      // Auto-switch to script-config if on a hidden frame tab
      if (!_showFrameTabs && (S.currentClipDetailTab === 'first-frame' || S.currentClipDetailTab === 'last-frame')) {
        S.currentClipDetailTab = 'script-config';
      }
      for (var ti = 0; ti < aiTabs.length; ti++) {
        var t = aiTabs[ti]; var isA = S.currentClipDetailTab === t.id;
        // Tab status indicator
        var tabStatus = _getTabStatus(clip, t.id);
        html += '<button class="vpm-inner-tab' + (isA ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="' + t.id + '">' + icon(t.ic) + ' ' + esc(t.l);
        if (tabStatus === 'done') html += ' <span class="vpm-tab-check">' + icon('circle-check') + '</span>';
        else if (tabStatus === 'partial') html += ' <span class="vpm-tab-partial">\u25CF</span>';
        html += '</button>';
      }
    } else if (track === 'non-ai') {
      html += '<button class="vpm-inner-tab' + (S.currentClipDetailTab === 'planning' ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="planning">' + icon('clipboard-list') + ' Planning</button>';
      html += '<button class="vpm-inner-tab' + (S.currentClipDetailTab === 'creation' ? ' vpm-inner-tab-active' : '') + '" data-action="clip-detail-tab" data-tab="creation">' + icon('camera') + ' Create / Record</button>';
    } else {
      html += '<button class="vpm-inner-tab vpm-inner-tab-active">' + icon('copy') + ' Template</button>';
    }
    html += '</div>';

    // Tab content
    if (track === 'ai') {
      switch (S.currentClipDetailTab) {
        case 'script-config': html += _aiTabScriptConfig(clip); break;
        case 'first-frame': html += _aiTabFrame(clip, 'first_frame'); break;
        case 'last-frame': html += _aiTabFrame(clip, 'last_frame'); break;
        case 'video': html += _aiTabVideo(clip); break;
        default: html += _aiTabScriptConfig(clip);
      }
    } else if (track === 'non-ai') {
      html += (S.currentClipDetailTab === 'creation') ? _nonAiTabCreation(clip) : _nonAiTabPlanning(clip);
    } else {
      html += _templateTab(clip);
    }
    html += '</div>';
    return html;
  }

  function _getTabStatus(clip, tabId) {
    var ps = clip.prompt_set || {};
    if (tabId === 'script-config') return (clip.script_text || clip.visual_direction) ? 'done' : '';
    if (tabId === 'first-frame') { var ff = ps.first_frame || {}; if (ff.marked_done) return 'done'; if (ff.prompt && ff.prompt.status === 'generated') return 'partial'; return ''; }
    if (tabId === 'last-frame') { var lf = ps.last_frame || {}; if (!lf) return ''; if (lf.marked_done) return 'done'; if (lf.prompt && lf.prompt.status === 'generated') return 'partial'; return ''; }
    if (tabId === 'video') { var vp = (ps.video || {}).prompt || {}; if (ps.video && ps.video.marked_done) return 'done'; if (vp.status === 'generated') return 'partial'; return ''; }
    return '';
  }


  // ============================================================
  // SECTION 13: AI CLIP TABS
  // ============================================================

  function _aiTabScriptConfig(clip) {
    var pc = clip.production_config || {};
    var _ps = clip.prompt_set || {};
    var _vd = _ps.video || {};
    var _scPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var _scModelDefaultGenMode = (Constants.VIDEO_MODELS[_scPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
    var _genMode = _vd.gen_mode || _scModelDefaultGenMode;
    var VideoGenModes = Constants.VIDEO_GEN_MODES || {};
    var wpm = (S.meta.settings || {}).words_per_minute || 150;
    var wc = clip.script_text ? countWords(clip.script_text) : 0;
    var estDur = wc > 0 ? Math.round(wc / wpm * 60) : 0;
    var maxWordsForClip = Math.floor(((clip.duration || 8) / 60) * wpm);
    var html = '';

    // --- 1. Video Generation Mode (always shown — drives the rest of the UI) ---
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('sliders') + ' Generation Mode</div>';
    html += '<div class="vpm-gen-mode-cards">';
    for (var _gmk in VideoGenModes) {
      var _gm = VideoGenModes[_gmk]; var _isGmA = _genMode === _gmk;
      html += '<div class="vpm-gen-mode-card' + (_isGmA ? ' vpm-gen-mode-active' : '') + '" data-action="set-video-gen-mode" data-clip="' + clip.id + '" data-value="' + _gmk + '">';
      html += '<div class="vpm-gen-mode-icon">' + icon(_gm.icon) + '</div>';
      html += '<div class="vpm-gen-mode-label">' + esc(_gm.label) + '</div>';
      html += '<div class="vpm-gen-mode-desc">' + esc(_gm.description) + '</div>';
      html += '</div>';
    }
    html += '</div></div>';

    // --- 2. Mode-specific middle sections ---
    if (_genMode === 'ingredients-to-video') {
      // Seedance: Studio-linked character look + up to 3 environments
      html += _renderSeedanceAssetsPanel(clip);

    } else if (_genMode === 'frames-to-video') {
      // VEO 3.1: AI Character Look selector (ai-character clips only)
      if (clip.type === 'ai-character') {
        var _ffScene = ((_ps.first_frame || {}).scene || {});
        var _curLookIds = _ffScene.look_ids || [];
        var _assignedLook = _curLookIds.length && S.lookMap ? S.lookMap[_curLookIds[0]] : null;
        html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('user-tie') + ' Character / Look</div>';
        if (!S.allLooks.length) {
          html += '<div class="vpm-prereq-banner vpm-prereq-error">' + icon('triangle-exclamation') + ' No character looks available. ';
          html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('plus') + ' Create Looks from Script</button></div>';
        } else {
          html += '<div class="vpm-character-selector">';
          for (var _csi = 0; _csi < S.allLooks.length; _csi++) {
            var _clk = S.allLooks[_csi];
            var _isAssigned = _curLookIds.indexOf(_clk.id) >= 0;
            html += '<div class="vpm-char-card' + (_isAssigned ? ' vpm-char-card-active' : '') + '" data-action="assign-clip-look" data-clip="' + clip.id + '" data-look="' + _clk.id + '">';
            html += '<div class="vpm-char-card-info">';
            html += '<div class="vpm-char-card-name">' + esc(_clk.name || 'Unnamed') + '</div>';
            html += '<div class="vpm-char-card-role">' + esc((Constants.LOOK_ROLES[_clk.role] || {}).label || _clk.role || '') + '</div>';
            if (_isAssigned && _clk.voice_profile && (_clk.voice_profile.style || _clk.voice_profile.custom_description)) {
              html += '<div class="vpm-char-card-voice">' + icon('microphone-lines') + ' ' + esc([_clk.voice_profile.gender, _clk.voice_profile.style, _clk.voice_profile.accent].filter(Boolean).join(', ')) + '</div>';
            }
            html += '</div></div>';
          }
          html += '</div>';
          if (_assignedLook) {
            var _avp = _assignedLook.voice_profile || {};
            if (_avp.style || _avp.custom_description) {
              html += '<div class="vpm-voice-preview">' + icon('microphone-lines') + ' <strong>Voice:</strong> ' + esc([_avp.gender, _avp.age_range, _avp.style, _avp.accent].filter(Boolean).join(', '));
              if (_avp.custom_description) html += ' \u2014 ' + esc(_avp.custom_description);
              html += '</div>';
            } else {
              html += '<div class="vpm-info-banner vpm-text-sm" style="margin-top:6px">' + icon('info') + ' No voice profile on this look. Project default voice will be used.</div>';
            }
          }
        }
        html += '</div>';
      }

      // Scene & Visual Setup
      var ffScene = ((_ps.first_frame || {}).scene || {});
      html += '<div class="vpm-clip-section"><div class="vpm-flex-between"><div class="vpm-clip-section-head" style="margin:0">' + icon('image') + ' Scene & Visual Setup</div>';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-clip-scene" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI Suggest</button></div>';
      if (S.allScenes.length) {
        var assignedScene = null;
        for (var asi = 0; asi < S.allScenes.length; asi++) { if (S.allScenes[asi].id === ffScene.scene_template_id) { assignedScene = S.allScenes[asi]; break; } }
        html += '<div class="vpm-form-group"><label class="vpm-form-label">Scene Template</label>';
        html += '<select class="vpm-select" data-action="save-clip-scene" data-clip="' + clip.id + '"><option value="">\u2014 No Scene \u2014</option>';
        for (var sci = 0; sci < S.allScenes.length; sci++) {
          var sc = S.allScenes[sci];
          html += '<option value="' + esc(sc.id) + '"' + (ffScene.scene_template_id === sc.id ? ' selected' : '') + '>' + esc(sc.name) + (sc.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
        if (assignedScene) {
          var envName = '', lookNames = [];
          for (var ei = 0; ei < S.allEnvironments.length; ei++) { if (S.allEnvironments[ei].id === assignedScene.environment_id) { envName = S.allEnvironments[ei].name; break; } }
          for (var li = 0; li < (assignedScene.look_ids || []).length; li++) {
            for (var lki = 0; lki < S.allLooks.length; lki++) { if (S.allLooks[lki].id === assignedScene.look_ids[li]) { lookNames.push(S.allLooks[lki].name); break; } }
          }
          html += '<div class="vpm-scene-preview-card">';
          html += '<div class="vpm-scene-preview-name">' + icon('image') + ' ' + esc(assignedScene.name) + '</div>';
          if (envName) html += '<div class="vpm-scene-preview-detail">' + icon('panorama') + ' ' + esc(envName) + '</div>';
          if (lookNames.length) html += '<div class="vpm-scene-preview-detail">' + icon('user-check') + ' ' + esc(lookNames.join(', ')) + '</div>';
          if (assignedScene.camera_direction) html += '<div class="vpm-scene-preview-detail">' + icon('video') + ' ' + esc(assignedScene.camera_direction) + '</div>';
          html += '</div>';
        }
      }
      html += '<div class="vpm-form-grid" style="margin-top:8px">';
      if (S.allLooks.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-check') + ' Look / Character</label>';
        html += '<select class="vpm-select" data-action="save-clip-look" data-clip="' + clip.id + '"><option value="">\u2014 None \u2014</option>';
        var currentLookIds = ffScene.look_ids || [];
        for (var cli = 0; cli < S.allLooks.length; cli++) {
          var clk = S.allLooks[cli];
          html += '<option value="' + esc(clk.id) + '"' + (currentLookIds.indexOf(clk.id) >= 0 ? ' selected' : '') + '>' + esc(clk.name || 'Unnamed') + (clk.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
      }
      if (S.allEnvironments.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' Environment</label>';
        html += '<select class="vpm-select" data-action="save-clip-environment" data-clip="' + clip.id + '"><option value="">\u2014 None \u2014</option>';
        for (var cei = 0; cei < S.allEnvironments.length; cei++) {
          var env = S.allEnvironments[cei];
          html += '<option value="' + esc(env.id) + '"' + (ffScene.environment_id === env.id ? ' selected' : '') + '>' + esc(env.name || 'Unnamed') + ' (' + esc(env.type || 'indoor') + ')' + (env.source === 'brand' ? ' (brand)' : '') + '</option>';
        }
        html += '</select></div>';
      }
      html += '</div>';
      if (!S.allScenes.length && !S.allLooks.length && !S.allEnvironments.length) {
        html += '<div class="vpm-info-banner">' + icon('info') + ' No visual assets yet. ';
        html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script to Create Assets</button></div>';
      }
      html += '</div>';

      // Production Config (only relevant for frames-to-video / VEO 3.1)
      var mCfg = getModelDurationConfig(_scPrimaryVM);
      html += '<details class="vpm-clip-section vpm-clip-config-details"><summary class="vpm-clip-section-head">' + icon('gears') + ' Production Config</summary>';
      html += '<div class="vpm-form-grid" style="padding-top:10px">';
      html += _cfgSelect('Motion', Constants.MOTION_STRENGTHS, pc.motion_strength, clip.id, 'motion_strength');
      html += _cfgSelect('Camera', Constants.CAMERA_MOVEMENTS, pc.camera_movement, clip.id, 'camera_movement');
      html += _cfgSelect('Transition', Constants.TRANSITION_STYLES, pc.transition_style, clip.id, 'transition_style');
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration <span class="vpm-text-xs vpm-text-muted">(' + mCfg.label + ': ' + mCfg.minDuration + '-' + mCfg.maxDuration + 's)</span></label>';
      html += '<input class="vpm-input" type="number" min="' + mCfg.minDuration + '" max="' + mCfg.maxDuration + '" step="1" value="' + (clip.duration||8) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration">';
      html += '</div></div></details>';
    }
    // text-to-video: no middle sections — just gen mode cards then script

    // --- 3. Script & Narration (all modes) ---
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('file-lines') + ' Script & Narration';
    if (wc > 0) html += ' <span class="vpm-text-xs vpm-text-muted">' + wc + ' words \u00B7 ~' + estDur + 's</span>';
    html += '</div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Voiceover / Script Text</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="script_text" rows="3" placeholder="What the narrator says\u2026">' + esc(clip.script_text || '') + '</textarea></div>';
    if (wc > 0 && wc > maxWordsForClip) {
      html += '<div class="vpm-prereq-banner vpm-prereq-warn" style="margin:-4px 0 8px">';
      html += '<span>' + icon('triangle-exclamation') + ' Script is <strong>' + wc + ' words</strong> but ' + (clip.duration || 8) + 's clip supports max <strong>' + maxWordsForClip + ' words</strong> at ' + wpm + ' WPM. Overflow: ' + (wc - maxWordsForClip) + ' words.</span>';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-split-clip" data-clip-id="' + clip.id + '">' + icon('scissors') + ' AI Split</button>';
      html += '</div>';
    }
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">On-Screen Text</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="onscreen_text" value="' + esc(clip.onscreen_text || '') + '" placeholder="Text overlay\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="visual_direction" value="' + esc(clip.visual_direction || '') + '" placeholder="What to show\u2026"></div>';
    html += '</div></div>';
    return html;
  }

  function _cfgSelect(label, items, selected, clipId, field) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">' + esc(label) + '</label><select class="vpm-select" data-action="save-clip-config" data-clip="' + clipId + '" data-field="' + field + '">';
    for (var k in items) html += '<option value="' + k + '"' + (selected === k ? ' selected' : '') + '>' + esc(items[k].label) + '</option>';
    html += '</select></div>';
    return html;
  }

  // Seedance Assets Panel — character look + up to 3 environments from Studio
  // Data: clip.prompt_set.video.seedance_assets = { character_look_id: '', env_ids: ['', '', ''] }
  function _renderSeedanceAssetsPanel(clip) {
    var _ps = clip.prompt_set || {};
    var _vd = _ps.video || {};
    var _sa = _vd.seedance_assets || {};
    var _envIds = _sa.env_ids || ['', '', ''];
    var html = '<div class="vpm-clip-section">';
    html += '<div class="vpm-flex-between"><div class="vpm-clip-section-head" style="margin:0">' + icon('layer-group') + ' Seedance Assets</div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-suggest-clip-scene" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI Suggest</button></div>';
    html += '<p class="vpm-text-muted vpm-text-sm" style="margin:4px 0 10px">Select the Studio assets Seedance will use as visual ingredients for this clip.</p>';
    if (!S.allLooks.length && !S.allEnvironments.length) {
      html += '<div class="vpm-info-banner">' + icon('info') + ' No visual assets yet. ';
      html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-analyze-studio">' + icon('sparkles') + ' Analyze Script to Create Assets</button></div>';
    } else {
      html += '<div class="vpm-form-grid">';
      // Character Look
      if (S.allLooks.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('user-tie') + ' Character Look</label>';
        html += '<select class="vpm-select" data-action="save-seedance-look" data-clip="' + clip.id + '">';
        html += '<option value="">\u2014 None \u2014</option>';
        for (var _li = 0; _li < S.allLooks.length; _li++) {
          var _lk = S.allLooks[_li];
          html += '<option value="' + esc(_lk.id) + '"' + (_sa.character_look_id === _lk.id ? ' selected' : '') + '>' + esc(_lk.name || 'Unnamed') + ((_lk.role && Constants.LOOK_ROLES && Constants.LOOK_ROLES[_lk.role]) ? ' (' + esc(Constants.LOOK_ROLES[_lk.role].label) + ')' : '') + '</option>';
        }
        html += '</select></div>';
      }
      // Environments 1-3
      if (S.allEnvironments.length) {
        var _envLabels = ['Environment 1', 'Environment 2 (optional)', 'Environment 3 (optional)'];
        for (var _ei = 0; _ei < 3; _ei++) {
          html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('panorama') + ' ' + _envLabels[_ei] + '</label>';
          html += '<select class="vpm-select" data-action="save-seedance-env" data-clip="' + clip.id + '" data-idx="' + _ei + '">';
          html += '<option value="">\u2014 None \u2014</option>';
          for (var _ej = 0; _ej < S.allEnvironments.length; _ej++) {
            var _env = S.allEnvironments[_ej];
            html += '<option value="' + esc(_env.id) + '"' + ((_envIds[_ei] || '') === _env.id ? ' selected' : '') + '>' + esc(_env.name || 'Unnamed') + ' (' + esc(_env.type || 'indoor') + ')' + (_env.source === 'brand' ? ' (brand)' : '') + '</option>';
          }
          html += '</select></div>';
        }
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function _aiTabFrame(clip, frameKey) {
    var ps = clip.prompt_set || {};
    var frame = ps[frameKey] || {};
    var prompt = frame.prompt || {};
    var scene = frame.scene || {};
    var isFirst = frameKey === 'first_frame';
    var html = '';

    // Header with done toggle
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head-row"><div>' + icon(isFirst ? 'image' : 'images') + ' ' + (isFirst ? 'First' : 'Last') + ' Frame';
    var pStatus = prompt.status || 'empty';
    if (pStatus === 'generated') html += ' <span class="vpm-prompt-status vpm-prompt-status-generated">' + icon('circle-check') + ' Generated</span>';
    else if (pStatus === 'edited') html += ' <span class="vpm-prompt-status vpm-prompt-status-edited">' + icon('pen') + ' Edited</span>';
    html += '</div>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-frame-done" data-clip="' + clip.id + '" data-frame="' + frameKey + '"' + (frame.marked_done ? ' checked' : '') + '>' + (frame.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label>';
    html += '</div>';

    // Scene info card
    if (scene.scene_template_id) {
      var sc = S.sceneMap[scene.scene_template_id];
      if (sc) {
        var envName = '';
        for (var ei = 0; ei < S.allEnvironments.length; ei++) { if (S.allEnvironments[ei].id === sc.environment_id) { envName = S.allEnvironments[ei].name; break; } }
        html += '<div class="vpm-scene-info-card">' + icon('image') + ' <strong>' + esc(sc.name) + '</strong>';
        if (envName) html += ' <span class="vpm-text-muted">\u00B7 ' + esc(envName) + '</span>';
        if (sc.camera_direction) html += ' <span class="vpm-text-muted">\u00B7 ' + esc(truncate(sc.camera_direction, 30)) + '</span>';
        html += '</div>';
      }
    }

    // Image prompt
    html += '<div class="vpm-clip-prompt-section"><div class="vpm-flex-between"><span class="vpm-clip-prompt-label">' + icon('wand-magic-sparkles') + ' Image Prompt</span>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-frame-prompt" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('sparkles') + ' Generate</button></div>';
    if (prompt.positive) {
      html += '<div class="vpm-prompt-box vpm-prompt-positive">' + esc(prompt.positive) + '</div>';
      if (prompt.negative) html += '<div class="vpm-prompt-box vpm-prompt-negative">' + esc(prompt.negative) + '</div>';
      if (prompt.style_keywords && prompt.style_keywords.length) {
        html += '<div class="vpm-prompt-keywords">';
        for (var ki = 0; ki < prompt.style_keywords.length; ki++) html += '<span class="vpm-prompt-keyword">' + esc(prompt.style_keywords[ki]) + '</span>';
        html += '</div>';
      }
      html += '<div class="vpm-btn-row" style="margin-top:8px"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc(prompt.positive) + '">' + icon('copy') + ' Copy</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-frame-prompt" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('pen') + ' Edit</button></div>';
    } else {
      html += '<div class="vpm-empty-state vpm-empty-state-sm">' + icon('wand-magic-sparkles') + '<p>Generate or write an image prompt for this frame</p></div>';
    }
    html += '</div></div>';

    // Frame image picker
    html += _renderFrameImagePicker(clip, frameKey);
    return html;
  }

  function _aiTabVideo(clip) {
    var ps = clip.prompt_set || {};
    var vd = ps.video || {};
    var vPrompt = vd.prompt || {};
    var ff = ps.first_frame || {};
    var lf = ps.last_frame || {};
    var _vtPrimaryVM = ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var _vtModelDefaultGenMode = (Constants.VIDEO_MODELS[_vtPrimaryVM] || {}).defaultGenMode || 'frames-to-video';
    var genMode = vd.gen_mode || _vtModelDefaultGenMode;
    var html = '';

    // Header with done toggle
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head-row"><div>' + icon('film') + ' Video Generation</div>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-video-done" data-clip="' + clip.id + '"' + (vd.marked_done ? ' checked' : '') + '>' + (vd.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label>';
    html += '</div>';

    // Frame preview thumbnails (only for frames-to-video)
    if (genMode === 'frames-to-video') {
      var ffUrl = ff.image_url || '', lfUrl = (lf || {}).image_url || '';
      if (ffUrl || lfUrl) {
        html += '<div class="vpm-frame-preview-row">';
        if (ffUrl) html += '<div class="vpm-frame-thumb-preview"><img src="' + esc(ffUrl) + '"><span>First' + (ff.marked_done ? ' ' + icon('circle-check') : '') + '</span></div>';
        if (ffUrl && ps.requires_last_frame) html += '<span class="vpm-frame-arrow">' + icon('arrow-right') + '</span>';
        if (lfUrl) html += '<div class="vpm-frame-thumb-preview"><img src="' + esc(lfUrl) + '"><span>Last' + (lf.marked_done ? ' ' + icon('circle-check') : '') + '</span></div>';
        else if (ps.requires_last_frame && ffUrl) html += '<div class="vpm-frame-thumb-empty">' + icon('image') + '<span>Last Frame</span></div>';
        html += '</div>';
      }
    }

    // Gen mode info badge
    html += '<div class="vpm-text-xs vpm-text-muted" style="padding:4px 0">' + icon('sliders') + ' Mode: <strong>' + esc((Constants.VIDEO_GEN_MODES || {})[genMode] ? (Constants.VIDEO_GEN_MODES[genMode].label || genMode) : genMode) + '</strong></div>';
    html += '</div>';

    // Video Settings — unified model + duration
    var currentModelId = vPrompt.model || ((S.data.start || {}).preferences || {}).primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var mCfg = getModelDurationConfig(currentModelId);
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('gears') + ' Video Settings</div>';
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Model</label><select class="vpm-select" data-action="save-video-model" data-clip="' + clip.id + '">';
    for (var vmk in Constants.VIDEO_MODELS) html += '<option value="' + vmk + '"' + (currentModelId === vmk ? ' selected' : '') + '>' + esc(Constants.VIDEO_MODELS[vmk].label) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration <span class="vpm-text-xs vpm-text-muted">(' + mCfg.minDuration + '-' + mCfg.maxDuration + 's)</span></label>';
    html += '<input class="vpm-input" type="number" min="' + mCfg.minDuration + '" max="' + mCfg.maxDuration + '" step="1" value="' + (clip.duration || 8) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div>';
    html += '</div>';
    if (mCfg.notes) html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:4px">' + icon('info') + ' ' + esc(mCfg.notes) + '</div>';
    html += '</div>';

    // Video prompt — model-aware display
    var isSeedanceDisplay = (currentModelId === 'seedance' || vPrompt.model === 'seedance');
    html += '<div class="vpm-clip-section"><div class="vpm-clip-prompt-section"><div class="vpm-flex-between"><span class="vpm-clip-prompt-label">' + icon('wand-magic-sparkles') + ' Video Prompt</span>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="generate-video-prompt" data-clip="' + clip.id + '">' + icon('sparkles') + ' Generate</button></div>';

    if (isSeedanceDisplay && vPrompt.seedance_prompt) {
      // Seedance 2.0: plain-text prompt in a scrollable pre block
      html += '<div class="vpm-prompt-section">';
      html += '<div class="vpm-prompt-section-label">' + icon('seedling') + ' Seedance 2.0 Prompt <span class="vpm-text-xs vpm-text-muted" style="font-weight:normal">(plain text \u2014 upload to Seedance alongside images & audio)</span></div>';
      html += '<pre class="vpm-prompt-box" style="white-space:pre-wrap;font-family:var(--vpm-font-mono,monospace);font-size:11px;line-height:1.6;max-height:420px;overflow-y:auto;padding:10px">' + esc(vPrompt.seedance_prompt) + '</pre>';
      html += '</div>';
      html += '<div class="vpm-btn-row" style="margin-top:8px">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-seedance-prompt" data-clip="' + clip.id + '">' + icon('copy') + ' Copy Prompt</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-seedance-prompt" data-clip="' + clip.id + '">' + icon('pen') + ' Edit</button>';
      html += '<span class="vpm-text-xs vpm-text-muted" style="margin-left:auto">Seedance 2.0 \u2014 ' + esc(genMode) + '</span>';
      html += '</div>';
    } else if (!isSeedanceDisplay && (vPrompt.visual_prompt || vPrompt.positive)) {
      // VEO 3.1 / other models: structured JSON field display
      html += '<div class="vpm-prompt-section">';
      html += '<div class="vpm-prompt-section-label">' + icon('eye') + ' Visual Prompt</div>';
      html += '<div class="vpm-prompt-box vpm-prompt-positive">' + esc(vPrompt.visual_prompt || vPrompt.positive || '') + '</div>';
      html += '</div>';
      if (vPrompt.motion_description || vPrompt.motion) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('person-running') + ' Motion</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.motion_description || vPrompt.motion) + '</div></div>';
      }
      if (vPrompt.camera) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('video') + ' Camera</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.camera) + '</div></div>';
      }
      if (vPrompt.style) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('palette') + ' Style</div>';
        html += '<div class="vpm-prompt-box">' + esc(vPrompt.style) + '</div></div>';
      }
      if (vPrompt.audio && typeof vPrompt.audio === 'object') {
        html += '<div class="vpm-prompt-section vpm-prompt-audio-section"><div class="vpm-prompt-section-label">' + icon('microphone-lines') + ' Audio</div>';
        if (vPrompt.audio.speech) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Speech:</strong> ' + esc(vPrompt.audio.speech) + '</div>';
        if (vPrompt.audio.voice_description) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Voice:</strong> ' + esc(vPrompt.audio.voice_description) + '</div>';
        if (vPrompt.audio.ambient) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Ambient:</strong> ' + esc(vPrompt.audio.ambient) + '</div>';
        if (vPrompt.audio.music) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>Music:</strong> ' + esc(vPrompt.audio.music) + '</div>';
        if (vPrompt.audio.sound_effects) html += '<div class="vpm-prompt-box vpm-prompt-audio"><strong>SFX:</strong> ' + esc(vPrompt.audio.sound_effects) + '</div>';
        html += '</div>';
      }
      if (vPrompt.negative_prompt || vPrompt.negative) {
        html += '<div class="vpm-prompt-section"><div class="vpm-prompt-section-label">' + icon('ban') + ' Negative</div>';
        html += '<div class="vpm-prompt-box vpm-prompt-negative">' + esc(vPrompt.negative_prompt || vPrompt.negative) + '</div></div>';
      }
      html += '<div class="vpm-btn-row" style="margin-top:8px">';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-video-prompt-full" data-clip="' + clip.id + '">' + icon('copy') + ' Copy Full Prompt</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="edit-video-prompt" data-clip="' + clip.id + '">' + icon('pen') + ' Edit</button>';
      if (vPrompt.model) html += '<span class="vpm-text-xs vpm-text-muted" style="margin-left:auto">Generated for ' + esc((Constants.VIDEO_MODELS[vPrompt.model] || {}).label || vPrompt.model) + '</span>';
      html += '</div>';
    } else {
      html += '<div class="vpm-empty-state vpm-empty-state-sm">' + icon('film');
      if (isSeedanceDisplay) html += '<p>Add ingredient images or describe the scene, then generate the Seedance 2.0 prompt</p>';
      else if (genMode === 'text-to-video') html += '<p>Generate video prompt from your clip description and script</p>';
      else if (genMode === 'ingredients-to-video') html += '<p>Add ingredient images, then generate a prompt to compose them</p>';
      else html += '<p>Generate video prompt from frame images & scene context</p>';
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function _nonAiTabPlanning(clip) {
    var nap = clip.non_ai_planning || {};
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var html = '';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-type-banner" style="border-left-color:' + (ct.color || 'var(--vpm-info)') + '">';
    html += '<div class="vpm-clip-type-banner-icon">' + icon(ct.icon || 'camera') + '</div>';
    html += '<div><strong>' + esc(ct.label || clip.type) + '</strong><div class="vpm-text-xs vpm-text-muted">Requires manual recording or creation</div></div></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Script / Narration</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="script_text" rows="3" placeholder="What the narrator says in this clip\u2026">' + esc(clip.script_text || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label>';
    html += '<textarea class="vpm-textarea" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="visual_direction" rows="2" placeholder="What to show on screen\u2026">' + esc(clip.visual_direction || '') + '</textarea></div></div>';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('clipboard-list') + ' Production Brief</div>';
    html += '<div class="vpm-form-group"><textarea class="vpm-textarea" data-action="save-nonai-field" data-clip="' + clip.id + '" data-field="brief" rows="3" placeholder="Overall brief for what to record\u2026">' + esc(nap.brief || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Step-by-Step Instructions</label>';
    html += '<textarea class="vpm-textarea vpm-textarea-mono" data-action="save-nonai-field" data-clip="' + clip.id + '" data-field="instructions" rows="4" placeholder="1. Open the app\n2. Navigate to...\n3. Click on...">' + esc(nap.instructions || '') + '</textarea></div>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-improve-brief" data-clip="' + clip.id + '">' + icon('sparkles') + ' AI: Improve Brief</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="copy-prompt" data-text="' + esc((nap.brief || '') + '\n\n' + (nap.instructions || '')) + '">' + icon('copy') + ' Export as Task</button></div></div>';
    return html;
  }

  function _nonAiTabCreation(clip) {
    var nap = clip.non_ai_planning || {};
    var html = '';
    html += '<div class="vpm-clip-section"><div class="vpm-clip-section-head">' + icon('upload') + ' Recording / Asset</div>';
    if (nap.recording_ref) {
      html += '<div class="vpm-recording-ref"><div class="vpm-recording-ref-url">' + icon('link') + ' ' + esc(nap.recording_ref) + '</div>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="clear-nonai-recording" data-clip="' + clip.id + '">' + icon('xmark') + ' Remove</button></div>';
    } else {
      html += '<div class="vpm-upload-zone"><div class="vpm-upload-zone-icon">' + icon('cloud-arrow-up') + '</div>';
      html += '<p>Upload recording or paste URL</p>';
      html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="paste-nonai-url" data-clip="' + clip.id + '">' + icon('link') + ' Paste URL</button></div>';
    }
    html += '</div>';
    // Duration
    html += '<div class="vpm-clip-section"><div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" min="1" max="300" value="' + (clip.duration || 15) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div></div>';
    // Status
    html += '<div class="vpm-clip-section"><div class="vpm-flex-between"><span class="vpm-clip-section-head" style="margin:0">' + icon('circle-check') + ' Completion Status</span>';
    html += '<label class="vpm-done-toggle"><input type="checkbox" data-action="toggle-nonai-done" data-clip="' + clip.id + '"' + (nap.marked_done ? ' checked' : '') + '>' + (nap.marked_done ? '<span class="vpm-text-success">' + icon('circle-check') + ' Done</span>' : '<span class="vpm-text-muted">Mark Done</span>') + '</label></div></div>';
    return html;
  }

  function _templateTab(clip) {
    var ct = Constants.CLIP_TYPES[clip.type] || {};
    var isApplied = clip.template_id || clip.status === 'applied' || clip.status === 'customized';
    var html = '<div class="vpm-clip-section">';
    html += '<div class="vpm-template-card">';
    html += '<div class="vpm-template-card-icon" style="background:' + (ct.color || 'var(--vpm-gray-400)') + '20;color:' + (ct.color || 'var(--vpm-gray-600)') + '">' + icon(ct.icon || 'play') + '</div>';
    html += '<div class="vpm-template-card-info"><h4>' + esc(clip.title || ct.label || 'Template') + '</h4>';
    html += '<p>' + esc(ct.label || clip.type) + ' \u00B7 ' + (clip.duration || 0) + 's</p>';
    if (clip.onscreen_text) html += '<p class="vpm-text-xs">' + icon('heading') + ' "' + esc(clip.onscreen_text) + '"</p>';
    html += '</div>';
    html += '<div class="vpm-template-card-status">';
    if (isApplied) html += '<span class="vpm-template-status-applied">' + icon('circle-check') + ' Applied</span>';
    else html += '<span class="vpm-template-status-pending">' + icon('clock') + ' Pending</span>';
    html += '</div></div>';
    // Editable fields
    html += '<div class="vpm-form-group" style="margin-top:12px"><label class="vpm-form-label">On-Screen Text</label>';
    html += '<input class="vpm-input" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="onscreen_text" value="' + esc(clip.onscreen_text || '') + '" placeholder="Text to display\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (seconds)</label>';
    html += '<input class="vpm-input" type="number" min="1" max="30" value="' + (clip.duration || ct.defaultDuration || 4) + '" data-action="save-clip-field" data-clip="' + clip.id + '" data-field="duration"></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 14: FRAME IMAGE PICKER (REVP pattern)
  // ============================================================

  function _renderFrameImagePicker(clip, frameKey) {
    var ps = clip.prompt_set || {};
    var frame = ps[frameKey] || {};
    var imageUrl = frame.image_url || '';
    var version = frame.version || 0;
    var gallery = (S.galleries || {}).frames || [];

    var html = '<div class="vpm-panel vpm-panel-sm vpm-frame-picker" style="margin-top:8px" data-clip="' + clip.id + '" data-frame="' + frameKey + '">';
    html += '<div class="vpm-flex-between" style="margin-bottom:8px"><h4 style="margin:0;font-size:13px">' + icon('image') + ' Frame Image</h4>';
    if (version > 0) html += '<span class="vpm-frame-version">v' + version + '</span>';
    html += '</div>';
    if (imageUrl) {
      html += '<div class="vpm-frame-preview"><img src="' + esc(imageUrl) + '"></div>';
      html += '<div class="vpm-btn-row" style="margin-top:6px"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="remove-frame-image" data-clip="' + clip.id + '" data-frame="' + frameKey + '">' + icon('xmark') + ' Remove</button></div>';
    } else {
      html += '<div class="vpm-frame-empty">' + icon('image') + '<p>No frame image yet. Generate via AI, then upload here.</p></div>';
    }
    // Gallery thumbnails
    if (gallery.length) {
      html += '<div class="vpm-image-thumbstrip" style="margin-top:6px">';
      for (var gi = 0; gi < Math.min(gallery.length, 8); gi++) {
        var isSel = imageUrl === gallery[gi].url;
        html += '<div class="vpm-image-thumb' + (isSel ? ' vpm-image-thumb-selected' : '') + '" data-action="select-frame-image" data-clip="' + clip.id + '" data-frame="' + frameKey + '" data-gallery-idx="' + gi + '"><img src="' + esc(gallery[gi].url) + '"></div>';
      }
      html += '</div>';
    }
    // URL paste
    html += '<div style="margin-top:6px;display:flex;gap:6px;align-items:center"><span class="vpm-text-xs vpm-text-muted">or</span>';
    html += '<input class="vpm-input vpm-input-sm" style="flex:1" data-action="save-frame-image-url" data-clip="' + clip.id + '" data-frame="' + frameKey + '" value="' + esc(imageUrl) + '" placeholder="Paste frame image URL\u2026"></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 15: PUBLISH VIEW — FULL
  // ============================================================

  function renderPublishFull() {
    var pub = S.data.publishing || {};
    var yt = pub.youtube || {};
    var thumbs = S.data.thumbnails || {};

    var html = '<div class="vpm-view"><div class="vpm-view-header"><div><h2 class="vpm-view-title">' + icon('share-nodes') + ' Publish</h2>';
    html += '<p class="vpm-view-subtitle">Metadata, thumbnails & export</p></div>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-metadata">' + icon('sparkles') + ' AI: Generate All Metadata</button></div>';

    // --- Production Checklist ---
    html += '<div class="vpm-publish-checklist">';
    var checks = [
      ['Script finalized', S.scriptFinalized],
      ['Clips created', S.clipsReady],
      ['AI clips done', S.clipStats.totalAI > 0 ? S.clipStats.aiDone >= S.clipStats.totalAI : true],
      ['Recordings done', S.clipStats.totalNonAI > 0 ? S.clipStats.nonAiDone >= S.clipStats.totalNonAI : true],
      ['Templates applied', S.clipStats.totalTemplate > 0 ? S.clipStats.templateDone >= S.clipStats.totalTemplate : true],
      ['Metadata ready', !!(yt.title && yt.description)]
    ];
    for (var ci = 0; ci < checks.length; ci++) {
      html += '<div class="vpm-pub-check' + (checks[ci][1] ? ' vpm-pub-check-done' : '') + '">' + icon(checks[ci][1] ? 'circle-check' : 'circle') + ' ' + esc(checks[ci][0]) + '</div>';
    }
    html += '</div>';

    // --- Platform Tabs ---
    html += '<div class="vpm-inner-tabs">';
    var platforms = [['youtube','YouTube','youtube'],['instagram','Instagram','instagram'],['tiktok','TikTok','clapperboard'],['linkedin','LinkedIn','linkedin']];
    for (var pi = 0; pi < platforms.length; pi++) {
      var p = platforms[pi];
      html += '<button class="vpm-inner-tab' + (S.currentPlatformTab === p[0] ? ' vpm-inner-tab-active' : '') + '" data-action="platform-tab" data-tab="' + p[0] + '">' + icon(p[2]) + ' ' + esc(p[1]) + '</button>';
    }
    html += '</div>';

    // Platform content
    switch (S.currentPlatformTab) {
      case 'youtube':   html += _publishYouTube(pub, yt); break;
      case 'instagram': html += _publishInstagram(pub); break;
      case 'tiktok':    html += _publishTikTok(pub); break;
      case 'linkedin':  html += _publishLinkedIn(pub); break;
      default: html += _publishYouTube(pub, yt);
    }

    // --- Thumbnail Workshop ---
    html += _renderThumbnailWorkshop(thumbs);

    // --- Export ---
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('download') + ' Export</div>';
    html += '<div class="vpm-export-grid">';
    var exports = [
      ['export-json', 'file-lines', 'Production Plan', 'Full project JSON'],
      ['export-shot-list', 'clipboard-list', 'Shot List', 'All clips with timing'],
      ['export-prompts', 'wand-magic-sparkles', 'All Prompts', 'Frame + video prompts'],
      ['export-metadata', 'share-nodes', 'YouTube Metadata', 'Title, desc, tags, chapters'],
      ['export-script', 'file-lines', 'Full Script', 'All sections as text'],
      ['export-social', 'globe', 'Social Posts', 'Platform-ready posts']
    ];
    for (var ei = 0; ei < exports.length; ei++) {
      var exp = exports[ei];
      html += '<button class="vpm-export-card" data-action="' + exp[0] + '"><div class="vpm-export-card-icon">' + icon(exp[1]) + '</div><div class="vpm-export-card-label">' + esc(exp[2]) + '</div><div class="vpm-export-card-desc">' + esc(exp[3]) + '</div></button>';
    }
    html += '</div></div>';

    html += renderNavButtons('Clips', null);
    html += '</div>';
    return html;
  }

  // --- YouTube Tab ---
  function _publishYouTube(pub, yt) {
    var html = '<div class="vpm-panel">';
    // Title with AI alternatives
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
    html += '<input class="vpm-input" data-action="save-publish-field" data-path="youtube.title" value="' + esc(yt.title || '') + '" placeholder="Video title\u2026"></div>';
    var alts = yt.title_options || [];
    if (alts.length) {
      html += '<div class="vpm-pub-title-alts"><span class="vpm-text-xs vpm-text-muted">AI Alternatives:</span>';
      for (var ai = 0; ai < alts.length; ai++) {
        html += '<button class="vpm-pub-alt-btn" data-action="use-title-alt" data-idx="' + ai + '">' + esc(truncate(alts[ai], 60)) + '</button>';
      }
      html += '</div>';
    }
    // Description
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="youtube.description" rows="6" placeholder="Video description with links, timestamps, CTAs\u2026">' + esc(yt.description || '') + '</textarea></div>';
    // Tags + Hashtags
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Tags (comma separated)</label>';
    html += '<input class="vpm-input" data-action="save-publish-tags" data-platform="youtube" value="' + esc((yt.tags || []).join(', ')) + '" placeholder="AI marketing, tutorial\u2026"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="youtube" value="' + esc((yt.hashtags || []).join(' ')) + '" placeholder="#AIMarketing #Tutorial\u2026"></div>';
    html += '</div>';
    // Category + Visibility
    html += '<div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Category</label><select class="vpm-select" data-action="save-publish-field" data-path="youtube.category">';
    var cats = ['education','entertainment','howto','science','people','news','gaming','music','sports','travel','comedy','film','autos','pets','nonprofits'];
    for (var cai = 0; cai < cats.length; cai++) html += '<option value="' + cats[cai] + '"' + (yt.category === cats[cai] ? ' selected' : '') + '>' + esc(cats[cai].charAt(0).toUpperCase() + cats[cai].slice(1)) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Visibility</label><select class="vpm-select" data-action="save-publish-field" data-path="youtube.visibility">';
    html += '<option value="public"' + (yt.visibility === 'public' ? ' selected' : '') + '>Public</option>';
    html += '<option value="unlisted"' + (yt.visibility === 'unlisted' ? ' selected' : '') + '>Unlisted</option>';
    html += '<option value="private"' + (yt.visibility === 'private' ? ' selected' : '') + '>Private</option>';
    html += '</select></div></div>';
    html += '</div>';

    // Chapters
    html += '<div class="vpm-panel"><div class="vpm-flex-between vpm-mb-sm"><span class="vpm-panel-title" style="margin:0">' + icon('clock') + ' Chapters</span>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="ai-generate-chapters">' + icon('sparkles') + ' Auto-Generate</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="add-chapter">' + icon('plus') + ' Add</button></div></div>';
    var chapters = yt.chapters || [];
    if (chapters.length) {
      for (var chi = 0; chi < chapters.length; chi++) {
        var ch = chapters[chi];
        html += '<div class="vpm-chapter-row">';
        html += '<input class="vpm-input vpm-input-sm vpm-chapter-time" data-action="save-chapter" data-idx="' + chi + '" data-field="time" value="' + esc(ch.time || '') + '" placeholder="0:00">';
        html += '<input class="vpm-input vpm-input-sm vpm-chapter-label" data-action="save-chapter" data-idx="' + chi + '" data-field="label" value="' + esc(ch.label || '') + '" placeholder="Chapter name">';
        html += '<button class="vpm-btn-icon-sm" data-action="delete-chapter" data-idx="' + chi + '" style="color:var(--vpm-error)">' + icon('trash') + '</button>';
        html += '</div>';
      }
    } else {
      html += '<p class="vpm-text-sm vpm-text-muted" style="text-align:center;padding:8px">No chapters yet. Auto-generate from clip sections or add manually.</p>';
    }
    html += '</div>';
    return html;
  }

  // --- Instagram Tab ---
  function _publishInstagram(pub) {
    var ig = pub.instagram || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('instagram') + ' Instagram Reels</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Caption</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="instagram.caption" rows="4" placeholder="Write an engaging caption\u2026">' + esc(ig.caption || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="instagram" value="' + esc((ig.hashtags || []).join(' ')) + '" placeholder="#reels #marketing\u2026"></div>';
    html += '</div>';
    return html;
  }

  // --- TikTok Tab ---
  function _publishTikTok(pub) {
    var tt = pub.tiktok || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('clapperboard') + ' TikTok</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Caption</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="tiktok.caption" rows="3" placeholder="Short, punchy caption\u2026">' + esc(tt.caption || '') + '</textarea></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Hashtags</label>';
    html += '<input class="vpm-input" data-action="save-publish-hashtags" data-platform="tiktok" value="' + esc((tt.hashtags || []).join(' ')) + '" placeholder="#fyp #tutorial\u2026"></div>';
    html += '</div>';
    return html;
  }

  // --- LinkedIn Tab ---
  function _publishLinkedIn(pub) {
    var li = pub.linkedin || {};
    var html = '<div class="vpm-panel"><h3 class="vpm-panel-title">' + icon('linkedin') + ' LinkedIn</h3>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Post Text</label>';
    html += '<textarea class="vpm-textarea" data-action="save-publish-field" data-path="linkedin.post_text" rows="6" placeholder="Professional post with context and call-to-action\u2026">' + esc(li.post_text || '') + '</textarea></div>';
    html += '</div>';
    return html;
  }


  // ============================================================
  // SECTION 16: THUMBNAIL WORKSHOP (3-step)
  // ============================================================

  function _renderThumbnailWorkshop(thumbs) {
    var ideas = thumbs.ideas || [];
    var chat = thumbs.chat_history || [];
    var step = S.thumbnailStep || 'ideas';

    var html = '<div class="vpm-thumb-workshop">';
    html += '<div class="vpm-thumb-header"><div class="vpm-thumb-title">' + icon('image') + ' Thumbnail Workshop</div>';
    // Step indicator
    html += '<div class="vpm-thumb-steps">';
    var steps = [['ideas','Ideas','lightbulb'],['refine','Refine','sparkles'],['finalize','Finalize','check']];
    for (var si = 0; si < steps.length; si++) {
      var s = steps[si];
      var stepState = step === s[0] ? 'active' : (steps.indexOf(steps.find(function(x){ return x[0] === step; })) > si ? 'done' : 'pending');
      if (s[0] === 'ideas' && ideas.length && step !== 'ideas') stepState = 'done';
      if (s[0] === 'refine' && step === 'finalize') stepState = 'done';
      html += '<div class="vpm-thumb-step vpm-thumb-step-' + stepState + '"><span class="vpm-thumb-step-num">' + (stepState === 'done' ? icon('check') : (si + 1)) + '</span>' + esc(s[1]) + '</div>';
    }
    html += '</div></div>';

    // Step content
    switch (step) {
      case 'ideas': html += _thumbStepIdeas(ideas); break;
      case 'refine': html += _thumbStepRefine(thumbs); break;
      case 'finalize': html += _thumbStepFinalize(thumbs); break;
      default: html += _thumbStepIdeas(ideas);
    }
    html += '</div>';
    return html;
  }

  // --- Step 1: Ideas ---
  function _thumbStepIdeas(ideas) {
    var html = '';
    if (!ideas.length) {
      html += '<div class="vpm-thumb-empty">';
      html += '<p>Generate 4 thumbnail concepts based on your video content and audience.</p>';
      html += '<button class="vpm-btn vpm-btn-ai" data-action="ai-generate-thumbnail-ideas">' + icon('sparkles') + ' Generate Thumbnail Ideas</button>';
      html += '</div>';
    } else {
      html += '<div class="vpm-thumb-ideas-grid">';
      for (var i = 0; i < ideas.length; i++) {
        var idea = ideas[i];
        var isSelected = S.selectedThumbnailId === idea.id;
        html += '<div class="vpm-thumb-idea' + (isSelected ? ' vpm-thumb-idea-selected' : '') + '" data-action="select-thumbnail" data-id="' + esc(idea.id) + '">';
        // Score badge
        if (idea.score) html += '<div class="vpm-thumb-score">' + idea.score + '%</div>';
        // Visual preview area
        html += '<div class="vpm-thumb-idea-preview">' + icon('image') + '</div>';
        html += '<div class="vpm-thumb-idea-body">';
        html += '<div class="vpm-thumb-idea-title">' + esc(idea.title || 'Concept ' + (i + 1)) + '</div>';
        html += '<div class="vpm-thumb-idea-desc">' + esc(truncate(idea.desc || '', 80)) + '</div>';
        // Meta chips
        html += '<div class="vpm-thumb-idea-meta">';
        if (idea.text) html += '<span class="vpm-thumb-meta-chip">' + icon('heading') + ' ' + esc(truncate(idea.text, 20)) + '</span>';
        if (idea.mood) html += '<span class="vpm-thumb-meta-chip">' + esc(idea.mood) + '</span>';
        if (idea.layout) html += '<span class="vpm-thumb-meta-chip">' + esc(idea.layout) + '</span>';
        html += '</div>';
        html += '<div class="vpm-btn-row" style="margin-top:6px">';
        html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="develop-thumbnail" data-id="' + esc(idea.id) + '">' + icon('sparkles') + ' Develop</button>';
        html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="regenerate-thumbnail-idea" data-id="' + esc(idea.id) + '">' + icon('arrows-rotate') + '</button>';
        html += '</div></div></div>';
      }
      html += '</div>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="ai-generate-thumbnail-ideas" style="margin-top:8px">' + icon('arrows-rotate') + ' Regenerate All</button>';
    }
    return html;
  }

  // --- Step 2: Refine with Chat ---
  function _thumbStepRefine(thumbs) {
    var ideas = thumbs.ideas || [];
    var selId = S.selectedThumbnailId;
    var selIdea = ideas.find(function(i) { return i.id === selId; });
    var chat = thumbs.chat_history || [];

    var html = '<div class="vpm-thumb-refine">';
    // Left: selected idea sidebar
    html += '<div class="vpm-thumb-refine-sidebar">';
    if (selIdea) {
      html += '<div class="vpm-thumb-refine-idea"><h4>' + esc(selIdea.title || 'Selected Concept') + '</h4>';
      html += '<p class="vpm-text-sm vpm-text-muted">' + esc(selIdea.desc || '') + '</p>';
      if (selIdea.text) html += '<div class="vpm-text-xs"><strong>Text:</strong> ' + esc(selIdea.text) + '</div>';
      if (selIdea.colors) html += '<div class="vpm-text-xs"><strong>Colors:</strong> ' + esc(selIdea.colors) + '</div>';
      if (selIdea.mood) html += '<div class="vpm-text-xs"><strong>Mood:</strong> ' + esc(selIdea.mood) + '</div>';
      if (selIdea.layout) html += '<div class="vpm-text-xs"><strong>Layout:</strong> ' + esc(selIdea.layout) + '</div>';
      html += '</div>';
    }
    // Quick suggestion chips
    html += '<div class="vpm-thumb-suggestions"><span class="vpm-text-xs vpm-text-muted">Quick suggestions:</span>';
    var suggestions = ['Make text bigger', 'Change to warm colors', 'Add urgency', 'Simpler layout', 'More contrast', 'Include face close-up'];
    for (var si = 0; si < suggestions.length; si++) {
      html += '<button class="vpm-chip vpm-chip-sm" data-action="thumb-chat-suggest" data-text="' + esc(suggestions[si]) + '">' + esc(suggestions[si]) + '</button>';
    }
    html += '</div>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-back-to-ideas">' + icon('arrow-left') + ' Back to Ideas</button>';
    html += '</div>';

    // Right: chat panel
    html += '<div class="vpm-thumb-chat">';
    html += '<div class="vpm-thumb-chat-messages" id="vpmThumbChatMessages">';
    if (!chat.length) {
      html += '<div class="vpm-thumb-chat-msg vpm-thumb-chat-system"><span class="vpm-thumb-chat-role">System</span>Selected concept: "' + esc((selIdea || {}).title || '') + '". Describe how you want to refine it.</div>';
    }
    for (var mi = 0; mi < chat.length; mi++) {
      var msg = chat[mi];
      html += '<div class="vpm-thumb-chat-msg vpm-thumb-chat-' + (msg.role || 'user') + '">';
      html += '<span class="vpm-thumb-chat-role">' + esc(msg.role === 'assistant' ? 'AI' : msg.role === 'system' ? 'System' : 'You') + '</span>';
      html += '<div class="vpm-thumb-chat-text">' + esc(msg.text || '') + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="vpm-thumb-chat-input">';
    html += '<input class="vpm-input" id="vpmThumbChatInput" placeholder="Describe refinements\u2026 e.g. Make the text bolder, use orange accent" data-action="thumb-chat-keypress">';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-chat-send">' + icon('arrow-right') + '</button>';
    html += '</div>';
    html += '<div class="vpm-btn-row" style="margin-top:8px;justify-content:flex-end"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-finalize">' + icon('check') + ' Finalize Prompt</button></div>';
    html += '</div></div>';
    return html;
  }

  // --- Step 3: Finalize ---
  function _thumbStepFinalize(thumbs) {
    var fp = thumbs.finalized_prompt;
    var selIdea = (thumbs.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
    var html = '<div class="vpm-thumb-finalize">';

    // Left: summary
    html += '<div class="vpm-thumb-final-summary">';
    html += '<h4>' + icon('check') + ' Final Concept</h4>';
    if (selIdea) {
      html += '<div class="vpm-text-sm"><strong>' + esc(selIdea.title || '') + '</strong></div>';
      html += '<p class="vpm-text-sm vpm-text-muted">' + esc(selIdea.desc || '') + '</p>';
    }
    if (fp) {
      if (fp.positive) html += '<div class="vpm-form-group"><label class="vpm-form-label">Prompt</label><div class="vpm-prompt-box">' + esc(fp.positive) + '</div></div>';
      if (fp.text_overlays && fp.text_overlays.length) {
        html += '<div class="vpm-form-group"><label class="vpm-form-label">Text Overlays</label>';
        for (var ti = 0; ti < fp.text_overlays.length; ti++) html += '<div class="vpm-text-sm">\u2022 ' + esc(fp.text_overlays[ti].text || '') + ' <span class="vpm-text-muted">(' + esc(fp.text_overlays[ti].position || '') + ')</span></div>';
        html += '</div>';
      }
    }
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-back-to-refine">' + icon('arrow-left') + ' Back to Refine</button>';
    html += '</div>';

    // Right: JSON output
    html += '<div class="vpm-thumb-final-json">';
    html += '<div class="vpm-flex-between vpm-mb-sm"><h4 style="margin:0">Structured Prompt (JSON)</h4>';
    html += '<div class="vpm-btn-row"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="thumb-copy-json">' + icon('copy') + ' Copy</button>';
    html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="thumb-download-json">' + icon('download') + ' Download</button>';
    html += '<button class="vpm-btn vpm-btn-ai vpm-btn-sm" data-action="thumb-regenerate-json">' + icon('arrows-rotate') + '</button></div></div>';
    var jsonStr = fp ? JSON.stringify(fp, null, 2) : '{ "status": "not finalized yet" }';
    html += '<div class="vpm-json-code">' + esc(jsonStr) + '</div>';
    html += '</div></div>';
    return html;
  }


  // ============================================================
  // SECTION 17: EXPORT HELPERS
  // ============================================================

  function _exportFile(name, content, type) {
    type = type || 'text/plain';
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url;
    a.download = (S.data.video.title || 'vpm-export').replace(/[^a-zA-Z0-9]/g, '-') + '-' + name;
    a.click(); URL.revokeObjectURL(url);
    // Track export
    S.data.publishing.export_history = S.data.publishing.export_history || [];
    S.data.publishing.export_history.push({ type: name, timestamp: new Date().toISOString() });
    logActivity('exported', 'Exported: ' + name);
    syncToTextarea();
    toast(name + ' exported', 'success');
  }

  function _buildScriptExport() {
    var sc = S.data.script || {};
    var v = S.data.video || {};
    var lines = ['=== ' + (v.title || 'Untitled') + ' ===', 'Words: ' + (sc.total_word_count || 0) + ' | Est: ' + formatDuration(sc.estimated_duration || 0), ''];
    var sections = sc.sections || [];
    for (var i = 0; i < sections.length; i++) {
      lines.push('--- ' + (sections[i].label || 'Section ' + (i + 1)).toUpperCase() + ' ---');
      lines.push(stripHtml(sections[i].content || ''));
      lines.push('');
    }
    return lines.join('\n');
  }

  function _buildPromptsExport() {
    var clips = S.data.clips || [];
    var lines = ['=== ALL PROMPTS ===', ''];
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      if (c.track !== 'ai' || !c.prompt_set) continue;
      var ps = c.prompt_set;
      lines.push('--- CLIP ' + c.order + ': ' + (c.title || '') + ' ---');
      var ff = ps.first_frame || {};
      if (ff.prompt && ff.prompt.positive) {
        lines.push('FIRST FRAME: ' + ff.prompt.positive);
        if (ff.prompt.negative) lines.push('  Negative: ' + ff.prompt.negative);
      }
      if (ps.last_frame && ps.last_frame.prompt && ps.last_frame.prompt.positive) {
        lines.push('LAST FRAME: ' + ps.last_frame.prompt.positive);
      }
      if (ps.video && ps.video.prompt && ps.video.prompt.positive) {
        lines.push('VIDEO: ' + ps.video.prompt.positive);
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  function _buildShotListExport() {
    var clips = S.data.clips || [];
    var lines = ['=== SHOT LIST ===', '', '# | Time | Type | Track | Dur | Title | Script'];
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      lines.push(c.order + ' | ' + formatDuration((c.timing || {}).start || 0) + ' | ' + ((Constants.CLIP_TYPES[c.type] || {}).label || c.type) + ' | ' + (c.track || '') + ' | ' + (c.duration || 0) + 's | ' + (c.title || '') + ' | ' + truncate(c.script_text || '', 50));
    }
    return lines.join('\n');
  }

  function _buildMetadataExport() {
    var yt = (S.data.publishing || {}).youtube || {};
    var lines = ['=== YOUTUBE METADATA ===', '', 'Title: ' + (yt.title || ''), '', 'Description:', yt.description || '', '', 'Tags: ' + (yt.tags || []).join(', '), 'Hashtags: ' + (yt.hashtags || []).join(' ')];
    if (yt.chapters && yt.chapters.length) {
      lines.push('', 'Chapters:');
      for (var i = 0; i < yt.chapters.length; i++) lines.push('  ' + (yt.chapters[i].time || '') + ' ' + (yt.chapters[i].label || ''));
    }
    return lines.join('\n');
  }


  // ============================================================
  // SECTION 18: ACTIVITY VIEW — FULL (date-grouped, clear, export)
  // ============================================================

  // ============================================================
  // SECTION 19: EVENT HANDLERS
  // ============================================================

  function setupPart2AEvents() {
    // --- Modal events ---
    $(document).off('click.vpm2a-mc').on('click.vpm2a-mc', '[data-action="close-modal"]', function() { closeModal(); });
    $(document).off('click.vpm2a-ms').on('click.vpm2a-ms', '[data-action="modal-save"]', function() { if (currentModal && currentModal.onSave) currentModal.onSave(); });
    $(document).off('click.vpm2a-mb').on('click.vpm2a-mb', '.vpm-modal-backdrop', function(e) { if ($(e.target).hasClass('vpm-modal-backdrop')) closeModal(); });

    // --- Keyboard shortcuts ---
    $(document).off('keydown.vpm2a-kb').on('keydown.vpm2a-kb', function(e) {
      if ($(e.target).is('input, textarea, select, [contenteditable="true"]')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
        else if (e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
      }
      // Number keys for stage navigation
      var stageOrder = getStageOrder();
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= stageOrder.length) {
        navigateToStage(stageOrder[num - 1]);
      }
    });

    // --- Start stage events ---
    // Mode toggle (with smart redirect if on a mode-specific stage)
    $(document).off('click.vpm2a-mode').on('click.vpm2a-mode', '[data-action="set-mode"]', function() {
      var mode = $(this).data('mode');
      var oldMode = S.mode;
      S.mode = mode;
      S.data.start.mode = mode;
      // If switching to Standard while on an Advanced-only stage, redirect
      if (mode === 'standard') {
        var standardStages = Constants.STAGE_ORDER_STANDARD;
        if (standardStages.indexOf(S.currentStage) === -1 && S.currentStage !== 'activity' && S.currentStage !== 'settings') {
          // Redirect to nearest available stage
          if (S.currentStage === 'research') S.currentStage = 'blueprint';
          else if (S.currentStage === 'studio') S.currentStage = 'clips';
          else S.currentStage = 'start';
        }
      }
      logActivity('mode_set', 'Mode changed: ' + oldMode + ' \u2192 ' + mode);
      _snapshotFull('Mode: ' + mode);
      buildMaps(); syncToTextarea(); render();
      toast('Mode: ' + (mode === 'standard' ? 'Standard (5 stages)' : 'Advanced (7 stages)'), 'success');
    });

    // Preference chip/card selection
    $(document).off('click.vpm2a-pref').on('click.vpm2a-pref', '[data-action="set-pref"]', function() {
      var path = $(this).data('path');
      var value = $(this).data('value');
      if (path && value !== undefined) {
        setNested(S.data.start, path, value);
        _snapshotFull('Pref: ' + path);
        syncToTextarea(); render();
      }
    });

    // Platform selection (also sets aspect ratio)
    $(document).off('click.vpm2a-plat').on('click.vpm2a-plat', '[data-action="set-platform"]', function() {
      var val = $(this).data('value');
      var platform = Constants.PLATFORMS[val];
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.platform = val;
      if (platform && platform.defaultAspect) {
        S.data.start.preferences.aspect_ratio = platform.defaultAspect;
      }
      _snapshotFull('Platform: ' + val);
      syncToTextarea(); render();
    });

    // Duration slider
    $(document).off('input.vpm2a-dur').on('input.vpm2a-dur', '[data-action="set-duration"]', function() {
      var val = parseInt($(this).val(), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      // Live update display
      var $display = $(this).closest('.vpm-dur-control');
      $display.find('.vpm-dur-value').text(val + 's');
      $display.find('.vpm-dur-human').text(formatDuration(val));
    });
    $(document).off('change.vpm2a-dur-c').on('change.vpm2a-dur-c', '[data-action="set-duration"]', function() {
      _snapshotFull('Duration: ' + $(this).val());
      syncToTextarea();
    });

    // Process idea — delegates to Part 2B AI if available
    $(document).off('click.vpm2a-proc').on('click.vpm2a-proc', '[data-action="process-idea"]', function() {
      var input = ($('#vpmStartInput').val() || '').trim();
      if (!input) { toast('Enter a video idea first', 'warning'); return; }
      // Save raw input
      S.data.start.raw_input = input;
      // Copy preferences to video
      var prefs = S.data.start.preferences || {};
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || 120;
      S.data.video.production_mode = prefs.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();
      syncToTextarea();
      // Delegate to Part 2B AI analysis if loaded
      if (window._vpmPart2B && window._vpmPart2B.analyzeIdea) {
        window._vpmPart2B.analyzeIdea('analyze-idea', '');
      } else {
        // Fallback: no AI, mark as processed directly
        S.data.start.processed = true;
        S.data.start.processed_at = new Date().toISOString();
        logActivity('idea_processed', 'Video idea submitted: ' + truncate(input, 80));
        _snapshotFull('Idea processed');
        buildMaps(); syncToTextarea(); render();
        toast('Idea saved! Continue to Blueprint.', 'success');
      }
    });

    // Reset start — FULL FACTORY RESET
    $(document).off('click.vpm2a-reset').on('click.vpm2a-reset', '[data-action="reset-start"]', function() {
      openConfirmDialog({
        title: 'Start Over — Full Reset?',
        message: 'This will clear <strong>everything</strong>: your video idea, preferences, blueprint, script, clips, studio entities, research, publishing, and thumbnails. Your <em>settings and AI preferences</em> will be preserved.\n\nThis cannot be undone.',
        danger: true,
        onConfirm: function() {
          var getDefaultData = window._vpmGetDefaultData;
          // Preserve timestamps
          var now = new Date().toISOString();
          // Full data reset
          S.data = getDefaultData();
          S.data.video.created = now;
          S.data.video.modified = now;
          // Clear entity libraries (but keep settings + aiPreferences)
          S.meta.lookLibrary = [];
          S.meta.environmentLibrary = [];
          S.meta.sceneLibrary = [];
          S.meta.studioRequirements = {};
          // Reset all state flags
          S.mode = 'standard';
          S.currentStage = 'start';
          S.currentStudioTab = 'overview';
          S.currentSettingsTab = 'general';
          S.currentPlatformTab = 'youtube';
          S.currentClipDetailTab = 'script-config';
          S.selectedClipId = null;
          S.selectedThumbnailId = '';
          S.thumbnailStep = 'ideas';
          S.clipTrackFilter = 'all';
          S.activityFilter = { search: '', type: '' };
          // Clear activity
          S.activity = [];
          logActivity('reset', 'Full factory reset \u2014 starting fresh');
          _snapshotFull('Factory reset');
          buildMaps(); syncToTextarea(); render();
          toast('Fresh start! Enter your video idea.', 'success');
        }
      });
    });

    // Save prompt text on blur (auto-save without full process)
    $(document).off('blur.vpm2a-si').on('blur.vpm2a-si', '#vpmStartInput', function() {
      S.data.start.raw_input = $(this).val() || '';
      syncToTextarea();
    });

    // --- Planner Import ---
    $(document).off('click.vpm2a-imp').on('click.vpm2a-imp', '[data-action="import-planner"]', function(e) {
      e.preventDefault();
      if (S.data.start.processed) {
        openConfirmDialog({
          title: 'Import Over Existing Data?',
          message: 'You already have an idea processed. Importing will overwrite blueprint, script, and research data. Continue?',
          danger: true,
          onConfirm: function() { _openPlannerImport(); }
        });
      } else {
        _openPlannerImport();
      }
    });

    // Clear import marker
    $(document).off('click.vpm2a-cimp').on('click.vpm2a-cimp', '[data-action="clear-import"]', function(e) {
      e.preventDefault();
      S.data.start.import_source = null;
      syncToTextarea(); render();
      toast('Import marker cleared', 'info');
    });

    // Import modal — tab switching
    $(document).off('click.vpm-imp-tab').on('click.vpm-imp-tab', '[data-action="planner-import-tab"]', function(e) {
      e.preventDefault();
      var tab = $(this).data('tab');
      $('[data-action="planner-import-tab"]').removeClass('vpm-inner-tab-active');
      $(this).addClass('vpm-inner-tab-active');
      $('[data-import-tab]').hide();
      $('[data-import-tab="' + tab + '"]').show();
    });

    // Import modal — live preview on paste/type
    $(document).off('input.vpm-imp-preview').on('input.vpm-imp-preview', '#vpmPlannerJsonInput', debounce(function() {
      var json = ($(this).val() || '').trim();
      if (!json) { $('#vpmPlannerPreview').hide(); return; }
      var parsed = parseJSON(json);
      if (!parsed) {
        $('#vpmPlannerPreview').html('<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' Invalid JSON — check syntax</div>').show();
        return;
      }
      var validation = _validatePlannerJSON(parsed);
      _renderPlannerPreview(parsed, validation);
    }, 500));

    // Import modal — upload zone click
    $(document).off('click.vpm-imp-uzone').on('click.vpm-imp-uzone', '#vpmPlannerUploadZone', function(e) {
      if ($(e.target).is('input')) return;
      $('#vpmPlannerFileInput').trigger('click');
    });

    // Import modal — file selected
    $(document).off('change.vpm-imp-file').on('change.vpm-imp-file', '#vpmPlannerFileInput', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 500000) { toast('File too large (max 500KB)', 'error'); return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        // Switch to paste tab and populate
        $('[data-import-tab="paste"]').show();
        $('[data-import-tab="upload"]').hide();
        $('[data-action="planner-import-tab"]').removeClass('vpm-inner-tab-active');
        $('[data-action="planner-import-tab"][data-tab="paste"]').addClass('vpm-inner-tab-active');
        $('#vpmPlannerJsonInput').val(text).trigger('input');
        toast('File loaded: ' + file.name, 'info');
      };
      reader.readAsText(file);
    });

    // --- Clip Type Selection ---
    $(document).off('click.vpm2a-tgct').on('click.vpm2a-tgct', '[data-action="toggle-clip-types"]', function(e) {
      e.preventDefault();
      S._clipTypesExpanded = !S._clipTypesExpanded;
      render();
    });

    // Toggle Advanced collapsible group (Voice & TTS / AI Models / Brand Library / Clips & Templates)
    $(document).off('click.vpm2a-tgadv').on('click.vpm2a-tgadv', '[data-action="toggle-adv-panel"]', function(e) {
      e.preventDefault();
      var key = $(this).data('key'); if (!key) return;
      var ui = S.meta._ui = S.meta._ui || {};
      var panels = ui.advanced_panels = ui.advanced_panels || {};
      panels[key] = !panels[key];
      syncToTextarea();
      render();
    });

    $(document).off('click.vpm2a-tct').on('click.vpm2a-tct', '[data-action="toggle-clip-type"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      if (!S.data.start.selected_clip_types) S.data.start.selected_clip_types = [];
      var idx = S.data.start.selected_clip_types.indexOf(val);
      if (idx >= 0) S.data.start.selected_clip_types.splice(idx, 1);
      else S.data.start.selected_clip_types.push(val);
      syncToTextarea(); render();
    });

    $(document).off('click.vpm2a-asct').on('click.vpm2a-asct', '[data-action="auto-select-clip-types"]', function(e) {
      e.preventDefault();
      var mode = ((S.data.start || {}).preferences || {}).production_mode || 'full-ai';
      var pm = Constants.PRODUCTION_MODES[mode];
      S.data.start.selected_clip_types = pm ? (pm.recommended || []).slice() : [];
      syncToTextarea(); render();
      toast('Clip types set from ' + (pm ? pm.label : mode), 'success');
    });

    $(document).off('click.vpm2a-cct').on('click.vpm2a-cct', '[data-action="clear-clip-types"]', function(e) {
      e.preventDefault();
      S.data.start.selected_clip_types = [];
      syncToTextarea(); render();
    });

    // --- Start Step Navigation ---
    $(document).off('click.vpm2a-sgs').on('click.vpm2a-sgs', '[data-action="start-goto-step"]', function(e) {
      e.preventDefault();
      var step = $(this).data('step');
      if (step === 'review') {
        var _title = (S.data.video.title || '').trim();
        var _prefs = (S.data.start || {}).preferences || {};
        if (!_title) { toast('Video title is required before review', 'warning'); return; }
        if (!_prefs.platform && (!_prefs.platforms || !_prefs.platforms.length)) { toast('Select at least one platform', 'warning'); return; }
      }
      if (step) { S.startStep = step; render(); }
    });

    // Start Import — tab switching (inline)
    $(document).off('click.vpm2a-sit').on('click.vpm2a-sit', '[data-action="start-import-tab"]', function(e) {
      e.preventDefault();
      var tab = $(this).data('tab');
      S._startImportTab = tab;
      $('[data-action="start-import-tab"]').removeClass('vpm-inner-tab-active');
      $(this).addClass('vpm-inner-tab-active');
      $('[data-start-import-tab]').hide();
      $('[data-start-import-tab="' + tab + '"]').show();
    });

    // AI extract from free-text description (Describe tab)
    $(document).off('click.vpm2a-saie').on('click.vpm2a-saie', '[data-action="start-ai-extract"]', function(e) {
      e.preventDefault();
      var txt = ($('#vpmStartDescribeText').val() || '').trim();
      if (!txt) { toast('Type a description first', 'warning'); return; }
      // Keep the raw input so it stays available across navigations & saves
      S.data.start.raw_input = txt;
      syncToTextarea();
      if (!window._vpmExtractPreferencesFromText) { toast('AI module still loading — try again in a moment', 'info'); return; }
      window._vpmExtractPreferencesFromText(txt, function(proposed) { _openPrefDiffModal(proposed, txt); });
    });

    // Diff modal — Accept All / Skip All
    $(document).off('click.vpm2a-pdta').on('click.vpm2a-pdta', '[data-action="pref-diff-toggle-all"]', function(e) {
      e.preventDefault();
      var on = $(this).data('state') === 'on';
      $('.vpm-pref-diff-cb').each(function() {
        if ($(this).is(':disabled')) return;
        $(this).prop('checked', on);
      });
    });

    // Start Import — inline live preview
    $(document).off('input.vpm2a-sip').on('input.vpm2a-sip', '#vpmStartImportJson', debounce(function() {
      var json = ($(this).val() || '').trim();
      var $preview = $('#vpmStartImportPreview');
      if (!json) { $preview.hide(); return; }
      var parsed = parseJSON(json);
      if (!parsed) {
        $preview.html('<div class="vpm-info-banner" style="border-color:var(--vpm-error);color:var(--vpm-error)">' + icon('triangle-exclamation') + ' Invalid JSON \u2014 check syntax</div>').show();
        return;
      }
      var validation = _validatePlannerJSON(parsed);
      _renderPlannerPreview(parsed, validation, '#vpmStartImportPreview');
    }, 500));

    // Start Import — upload zone
    $(document).off('click.vpm2a-suz').on('click.vpm2a-suz', '#vpmStartUploadZone', function(e) {
      if ($(e.target).is('input')) return;
      $('#vpmStartFileInput').trigger('click');
    });
    $(document).off('change.vpm2a-suf').on('change.vpm2a-suf', '#vpmStartFileInput', function() {
      var file = this.files && this.files[0];
      if (!file) return;
      if (file.size > 500000) { toast('File too large (max 500KB)', 'error'); return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        var text = e.target.result;
        S._startImportTab = 'paste';
        $('[data-start-import-tab="paste"]').show();
        $('[data-start-import-tab="upload"]').hide();
        $('[data-action="start-import-tab"]').removeClass('vpm-inner-tab-active');
        $('[data-action="start-import-tab"][data-tab="paste"]').addClass('vpm-inner-tab-active');
        $('#vpmStartImportJson').val(text).trigger('input');
        toast('File loaded: ' + file.name, 'info');
      };
      reader.readAsText(file);
    });

    // Start Import — execute import inline (reuses existing _executePlannerImport but stays on start)
    $(document).off('click.vpm2a-sei').on('click.vpm2a-sei', '[data-action="start-execute-import"]', function(e) {
      e.preventDefault();
      var json = ($('#vpmStartImportJson').val() || '').trim();
      if (!json) { toast('Paste or upload JSON first', 'warning'); return; }
      var parsed = parseJSON(json);
      if (!parsed) { toast('Invalid JSON \u2014 check syntax', 'error'); return; }
      var validation = _validatePlannerJSON(parsed);
      if (!validation.valid) { toast(validation.errors[0], 'error'); return; }

      var mapped = _mapPlannerToVPM(parsed);
      var coverage = validation.coverage;
      _snapshotFull('Before planner import');

      // Apply Start
      if (!S.data.start) S.data.start = {};
      S.data.start.raw_input = mapped.start.raw_input || S.data.start.raw_input || '';
      if (!S.data.start.preferences) S.data.start.preferences = {};
      var mp = mapped.start.preferences;
      if (mp.aspect_ratio) S.data.start.preferences.aspect_ratio = mp.aspect_ratio;
      if (mp.target_duration) S.data.start.preferences.target_duration = mp.target_duration;
      if (mp.production_mode) S.data.start.preferences.production_mode = mp.production_mode;
      S.data.start.import_source = {
        type: 'video-planner', imported_at: new Date().toISOString(),
        fields_mapped: Object.keys(coverage).filter(function(k) { return coverage[k]; })
      };

      // Apply Video metadata
      var vm = mapped.video;
      if (vm.title) S.data.video.title = vm.title;
      if (vm.description) S.data.video.description = vm.description;
      if (vm.target_audience) S.data.video.target_audience = vm.target_audience;
      if (vm.tone) S.data.video.tone = vm.tone;
      if (vm.keywords && vm.keywords.length) S.data.video.keywords = vm.keywords;
      if (vm.aspect_ratio) S.data.video.aspect_ratio = vm.aspect_ratio;
      if (vm.duration_target) S.data.video.duration_target = vm.duration_target;
      var prefs = S.data.start.preferences;
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || S.data.video.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || S.data.video.duration_target || 120;
      S.data.video.production_mode = prefs.production_mode || S.data.video.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      S.data.video.audio_mode = prefs.audio_mode || 'ai-audio-with-video';
      S.data.video.voice_profile = prefs.voice_profile ? JSON.parse(JSON.stringify(prefs.voice_profile)) : null;
      S.data.video.selected_video_models = prefs.selected_video_models ? prefs.selected_video_models.slice() : [];
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();

      // Apply Blueprint
      if (mapped.blueprint && mapped.blueprint.sections.length) {
        S.data.blueprint.title = mapped.blueprint.title || S.data.blueprint.title;
        S.data.blueprint.description = mapped.blueprint.description || S.data.blueprint.description;
        S.data.blueprint.tone = mapped.blueprint.tone || S.data.blueprint.tone;
        S.data.blueprint.target_audience = mapped.blueprint.target_audience || S.data.blueprint.target_audience;
        S.data.blueprint.style_notes = mapped.blueprint.style_notes || S.data.blueprint.style_notes;
        S.data.blueprint.sections = mapped.blueprint.sections;
      }

      // Apply Script
      if (mapped.script && mapped.script.sections.length) {
        S.data.script.sections = mapped.script.sections;
        S.data.script.total_word_count = mapped.script.total_word_count;
        S.data.script.estimated_duration = mapped.script.estimated_duration;
      }

      // Apply Research
      if (mapped.research) {
        if (!S.data.research) S.data.research = {};
        if (mapped.research.audience_insights) S.data.research.audience_insights = mapped.research.audience_insights;
        if (mapped.research.content_strategy) S.data.research.content_strategy = mapped.research.content_strategy;
        if (mapped.research.competitor_analysis) S.data.research.competitor_analysis = mapped.research.competitor_analysis;
        if (mapped.research.trending_angles) S.data.research.trending_angles = mapped.research.trending_angles;
        var _anyRes = mapped.research.audience_insights || mapped.research.content_strategy || mapped.research.competitor_analysis || mapped.research.trending_angles;
        if (_anyRes) { S.data.research.generated = true; S.data.research.generated_at = S.data.research.generated_at || new Date().toISOString(); }
      }

      // Apply Clip Types
      if (mapped.clipTypes.length) S.data.start.selected_clip_types = mapped.clipTypes;

      // Auto-switch to advanced if research data
      if (coverage.hasResearch && S.mode !== 'advanced') { S.mode = 'advanced'; S.data.start.mode = 'advanced'; }

      logActivity('planner_imported', 'Imported from Video Planner: ' + truncate(mapped.video.title || 'Untitled', 50));
      _snapshotFull('After planner import');
      buildMaps(); syncToTextarea();

      // Navigate to preferences step (NOT to another stage)
      S.startStep = 'preferences';
      render();

      var importedParts = [];
      if (coverage.hasTitle) importedParts.push('title');
      if (coverage.hasSections) importedParts.push('blueprint');
      if (coverage.hasScript) importedParts.push('script');
      if (coverage.hasResearch) importedParts.push('research');
      toast('Imported: ' + importedParts.join(', ') + '. Review preferences and launch.', 'success');
    });

    // Start Launch — finalize and navigate to next stage
    $(document).off('click.vpm2a-slaunch').on('click.vpm2a-slaunch', '[data-action="start-launch"]', function(e) {
      e.preventDefault();
      var prefs = S.data.start.preferences || {};
      // Copy all preferences to video data
      S.data.video.language = prefs.language || 'english';
      S.data.video.platform = prefs.platform || prefs.platforms[0] || 'youtube';
      S.data.video.aspect_ratio = prefs.aspect_ratio || '16:9';
      S.data.video.duration_target = prefs.target_duration || 120;
      S.data.video.production_mode = prefs.production_mode || 'full-ai';
      S.data.video.presenter_preference = prefs.presenter_preference || 'ai-only';
      S.data.video.video_style = prefs.video_style || '';
      S.data.video.tone = prefs.tone || S.data.video.tone || 'friendly';
      S.data.video.audio_mode = prefs.audio_mode || 'ai-audio-with-video';
      S.data.video.voice_profile = prefs.voice_profile ? JSON.parse(JSON.stringify(prefs.voice_profile)) : null;
      S.data.video.selected_video_models = prefs.selected_video_models ? prefs.selected_video_models.slice() : [];
      if (!S.data.video.created) S.data.video.created = new Date().toISOString();
      S.data.video.modified = new Date().toISOString();
      // Override model preferences for this project
      if (prefs.primary_video_model) S.meta.aiPreferences.videoModel = prefs.primary_video_model;
      if (prefs.primary_image_model) S.meta.aiPreferences.imageModel = prefs.primary_image_model;
      // Mark as processed
      S.data.start.processed = true;
      S.data.start.processed_at = new Date().toISOString();
      logActivity('start_launched', 'Video production launched: ' + truncate(S.data.video.title || 'Untitled', 50));
      _snapshotFull('Start launched');
      buildMaps(); syncToTextarea();
      // Navigate to appropriate stage
      var nextStage = S.mode === 'advanced' ? 'research' : 'blueprint';
      navigateToStage(nextStage);
      toast('Production started! Proceeding to ' + (Constants.APP_STAGES[nextStage] || {}).label + '.', 'success');
    });

    // Toggle Platform (multi-select)
    $(document).off('click.vpm2a-tplat').on('click.vpm2a-tplat', '[data-action="toggle-platform"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.platforms) prefs.platforms = [];
      var idx = prefs.platforms.indexOf(val);
      if (idx >= 0) {
        if (prefs.platforms.length > 1) prefs.platforms.splice(idx, 1);
        else { toast('At least one platform required', 'warning'); return; }
      } else {
        prefs.platforms.push(val);
      }
      // Set primary platform to first selected
      prefs.platform = prefs.platforms[0];
      // Auto-set aspect ratio from primary platform
      var platform = Constants.PLATFORMS[prefs.platform];
      if (platform && platform.defaultAspect) prefs.aspect_ratio = platform.defaultAspect;
      _snapshotFull('Platforms: ' + prefs.platforms.join(','));
      syncToTextarea(); render();
    });

    // Voice profile fields
    $(document).off('click.vpm2a-svp').on('click.vpm2a-svp', '[data-action="set-voice-profile"]', function(e) {
      e.preventDefault();
      var field = $(this).data('field');
      var value = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.voice_profile) prefs.voice_profile = {};
      prefs.voice_profile[field] = value;
      syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-svpt').on('blur.vpm2a-svpt', '[data-action="set-voice-profile-text"]', function() {
      var field = $(this).data('field');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.voice_profile) prefs.voice_profile = {};
      prefs.voice_profile[field] = $(this).val() || '';
      syncToTextarea();
    });

    // Video style (handled by set-pref for standard paths)

    // Duration input (number field)
    $(document).off('change.vpm2a-di').on('change.vpm2a-di', '[data-action="set-duration-input"]', function() {
      var val = Math.max(5, Math.min(600, parseInt($(this).val(), 10) || 120));
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      // Sync slider
      $(this).closest('.vpm-dur-combo').find('.vpm-dur-slider').val(val);
      $(this).closest('.vpm-dur-combo').find('.vpm-dur-human').text(formatDuration(val));
      _snapshotFull('Duration: ' + val);
      syncToTextarea();
    });

    // Duration presets
    $(document).off('click.vpm2a-dp').on('click.vpm2a-dp', '[data-action="set-duration-preset"]', function(e) {
      e.preventDefault();
      var val = parseInt($(this).data('value'), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      _snapshotFull('Duration preset: ' + val);
      syncToTextarea(); render();
    });

    // Duration slider (enhanced version)
    $(document).off('input.vpm2a-dur2').on('input.vpm2a-dur2', '.vpm-dur-combo [data-action="set-duration"]', function() {
      var val = parseInt($(this).val(), 10) || 120;
      S.data.start.preferences = S.data.start.preferences || {};
      S.data.start.preferences.target_duration = val;
      var $combo = $(this).closest('.vpm-dur-combo');
      $combo.find('.vpm-dur-input').val(val);
      $combo.find('.vpm-dur-human').text(formatDuration(val));
    });

    // Model selection toggles
    $(document).off('click.vpm2a-tvm').on('click.vpm2a-tvm', '[data-action="toggle-video-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.selected_video_models) prefs.selected_video_models = [];
      var idx = prefs.selected_video_models.indexOf(val);
      if (idx >= 0) prefs.selected_video_models.splice(idx, 1);
      else prefs.selected_video_models.push(val);
      // If primary was deselected, reassign
      if (prefs.primary_video_model === val && idx >= 0) {
        prefs.primary_video_model = prefs.selected_video_models[0] || '';
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-spvm').on('click.vpm2a-spvm', '[data-action="set-primary-video-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      S.data.start.preferences.primary_video_model = val;
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-tim').on('click.vpm2a-tim', '[data-action="toggle-image-model"]', function(e) {
      e.preventDefault();
      var val = $(this).data('value');
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      if (!prefs.selected_image_models) prefs.selected_image_models = [];
      var idx = prefs.selected_image_models.indexOf(val);
      if (idx >= 0) prefs.selected_image_models.splice(idx, 1);
      else prefs.selected_image_models.push(val);
      if (prefs.primary_image_model === val && idx >= 0) {
        prefs.primary_image_model = prefs.selected_image_models[0] || '';
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-spim').on('click.vpm2a-spim', '[data-action="set-primary-image-model"]', function(e) {
      e.preventDefault();
      S.data.start.preferences.primary_image_model = $(this).data('value');
      syncToTextarea(); render();
    });

    // Brand Library Selection
    $(document).off('change.vpm2a-tbr').on('change.vpm2a-tbr', '[data-action="toggle-brand-resource"]', function() {
      var entityType = $(this).data('entity-type');
      var entityId = $(this).data('entity-id');
      var isChecked = $(this).is(':checked');
      var bs = S.data.start.brand_selections = S.data.start.brand_selections || {};
      var key = 'selected_' + entityType + '_ids';
      if (!bs[key]) bs[key] = [];
      var idx = bs[key].indexOf(entityId);
      if (isChecked && idx < 0) bs[key].push(entityId);
      else if (!isChecked && idx >= 0) bs[key].splice(idx, 1);
      buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-sab').on('click.vpm2a-sab', '[data-action="select-all-brand"]', function(e) {
      e.preventDefault();
      var bs = S.data.start.brand_selections = S.data.start.brand_selections || {};
      bs.selected_look_ids = (S.brandStudio.looks || []).map(function(l) { return l.id; });
      bs.selected_environment_ids = (S.brandStudio.environments || []).map(function(e) { return e.id; });
      bs.selected_scene_ids = (S.brandStudio.scenes || []).map(function(s) { return s.id; });
      bs.selected_character_ids = (S.brandStudio.characters || []).map(function(c) { return c.id; });
      buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-cbs').on('click.vpm2a-cbs', '[data-action="clear-brand-selection"]', function(e) {
      e.preventDefault();
      S.data.start.brand_selections = { selected_look_ids: [], selected_environment_ids: [], selected_scene_ids: [], selected_character_ids: [], custom_uploads: [], ai_suggested: false };
      buildMaps(); syncToTextarea(); render();
    });

    // Template clips toggle
    $(document).off('change.vpm2a-tit').on('change.vpm2a-tit', '[data-action="toggle-include-templates"]', function() {
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      prefs.include_templates = $(this).is(':checked');
      syncToTextarea(); render();
    });

    // Brand library toggle
    $(document).off('change.vpm2a-tbl').on('change.vpm2a-tbl', '[data-action="toggle-brand-library"]', function() {
      S.data.start.use_brand_library = $(this).is(':checked');
      buildMaps(); syncToTextarea(); render();
    });

    // Custom style textarea
    $(document).off('blur.vpm2a-cs').on('blur.vpm2a-cs', '[data-action="set-custom-style"]', function() {
      var prefs = S.data.start.preferences = S.data.start.preferences || {};
      prefs.custom_style_keywords = $(this).val() || '';
      syncToTextarea();
    });

    // --- Research stage events ---
    // Edit research section (modal)
    // Toggle inline research editing
    $(document).off('click.vpm2a-ers').on('click.vpm2a-ers', '[data-action="edit-research-section"]', function(e) {
      e.preventDefault();
      var section = $(this).data('section');
      var $panel = $('[data-research-section="' + section + '"]');
      if (!$panel.length) return;
      var $text = $panel.find('.vpm-research-text');
      var $edit = $panel.find('.vpm-research-inline-edit');
      if ($edit.is(':visible')) {
        // Save and switch back to display
        var newVal = $edit.val() || '';
        S.data.research = S.data.research || {};
        S.data.research[section] = newVal;
        _snapshotFull('Edit research: ' + section);
        syncToTextarea(); render();
        toast('Research section updated', 'success');
      } else {
        // Switch to edit mode
        $text.hide();
        $edit.show().focus();
        $(this).html(icon('check') + ' Save');
      }
    });
    // Save on blur for inline research edit
    $(document).off('blur.vpm2a-ire').on('blur.vpm2a-ire', '[data-action="inline-edit-research"]', function() {
      var section = $(this).data('section');
      var newVal = $(this).val() || '';
      S.data.research = S.data.research || {};
      if (S.data.research[section] !== newVal) {
        S.data.research[section] = newVal;
        syncToTextarea();
      }
    });

    // Add research source (modal)
    $(document).off('click.vpm2a-ars').on('click.vpm2a-ars', '[data-action="add-research-source"]', function(e) {
      e.preventDefault();
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">URL</label>';
      html += '<input class="vpm-input" data-field="url" placeholder="https://youtube.com/watch?v=..."></div>';
      html += '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label>';
      html += '<input class="vpm-input" data-field="title" placeholder="Source title\u2026"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label>';
      html += '<select class="vpm-select" data-field="type"><option value="reference">Reference</option><option value="competitor">Competitor</option><option value="inspiration">Inspiration</option><option value="data">Data / Stats</option></select></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes</label>';
      html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="What\u2019s relevant about this source?"></textarea></div>';
      openModal('Add Reference Source', html, { saveLabel: 'Add', onSave: function() {
        var data = collectModalFields();
        S.data.research = S.data.research || {};
        S.data.research.sources = S.data.research.sources || [];
        S.data.research.sources.push({ url: data.url || '', title: data.title || '', type: data.type || 'reference', notes: data.notes || '' });
        _snapshotFull('Add source');
        syncToTextarea(); closeModal(); render();
        toast('Source added', 'success');
      }});
    });

    // Delete research source
    $(document).off('click.vpm2a-drs').on('click.vpm2a-drs', '[data-action="delete-research-source"]', function(e) {
      e.preventDefault();
      var idx = parseInt($(this).data('idx'), 10);
      var sources = (S.data.research || {}).sources || [];
      if (idx >= 0 && idx < sources.length) {
        sources.splice(idx, 1);
        _snapshotFull('Delete source');
        syncToTextarea(); render();
        toast('Source removed', 'success');
      }
    });

    // --- Blueprint stage events ---
    // Save blueprint field
    $(document).off('change.vpm2a-bpf blur.vpm2a-bpf').on('change.vpm2a-bpf blur.vpm2a-bpf', '[data-action="save-bp-field"]', function() {
      var path = $(this).data('path');
      var val = $(this).val();
      if (path) {
        setNested(S.data, path, val);
        _snapshotFull('Blueprint: ' + path);
        buildMaps(); syncToTextarea();
      }
    });

    // Save blueprint section field
    $(document).off('change.vpm2a-bsf blur.vpm2a-bsf').on('change.vpm2a-bsf blur.vpm2a-bsf', '[data-action="save-bp-section-field"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var field = $(this).data('field');
      var val = $(this).val();
      var sections = (S.data.blueprint || {}).sections || [];
      if (idx >= 0 && idx < sections.length && field) {
        if (field === 'duration') val = parseInt(val, 10) || 0;
        if (field === 'key_points') val = val.split('\n').filter(function(l) { return l.trim(); });
        sections[idx][field] = val;
        _snapshotFull('Section ' + (idx + 1) + ': ' + field);
        buildMaps(); syncToTextarea(); render();
      }
    });

    // Add blueprint section
    $(document).off('click.vpm2a-abs').on('click.vpm2a-abs', '[data-action="add-bp-section"]', function() {
      S.data.blueprint.sections = S.data.blueprint.sections || [];
      var order = S.data.blueprint.sections.length + 1;
      S.data.blueprint.sections.push({
        id: generateId('sec'), label: 'Section ' + order, duration: 15,
        key_points: [], visual_notes: '', order: order
      });
      logActivity('blueprint_updated', 'Added section ' + order);
      _snapshotFull('Add section');
      buildMaps(); syncToTextarea(); render();
      toast('Section added', 'success');
    });

    // Delete blueprint section
    $(document).off('click.vpm2a-dbs').on('click.vpm2a-dbs', '[data-action="delete-bp-section"]', function(e) {
      e.stopPropagation();
      var idx = parseInt($(this).data('idx'), 10);
      var sections = (S.data.blueprint || {}).sections || [];
      if (idx >= 0 && idx < sections.length) {
        var name = sections[idx].label || 'Section ' + (idx + 1);
        openConfirmDialog({
          title: 'Delete "' + name + '"?', message: 'This section will be removed from the blueprint.', danger: true,
          onConfirm: function() {
            sections.splice(idx, 1);
            // Reorder
            for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
            logActivity('blueprint_updated', 'Removed: ' + name);
            _snapshotFull('Delete section');
            buildMaps(); syncToTextarea(); render();
            toast('Section deleted', 'success');
          }
        });
      }
    });

    // Move blueprint section
    $(document).off('click.vpm2a-mbs').on('click.vpm2a-mbs', '[data-action="move-bp-section"]', function(e) {
      e.stopPropagation();
      var idx = parseInt($(this).data('idx'), 10);
      var dir = $(this).data('dir');
      var sections = (S.data.blueprint || {}).sections || [];
      if (dir === 'up' && idx > 0) {
        var temp = sections[idx]; sections[idx] = sections[idx - 1]; sections[idx - 1] = temp;
      } else if (dir === 'down' && idx < sections.length - 1) {
        var temp2 = sections[idx]; sections[idx] = sections[idx + 1]; sections[idx + 1] = temp2;
      }
      for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
      _snapshotFull('Reorder sections');
      buildMaps(); syncToTextarea(); render();
    });

    // Confirm blueprint
    $(document).off('click.vpm2a-cbp').on('click.vpm2a-cbp', '[data-action="confirm-blueprint"]', function() {
      var bp = S.data.blueprint || {};
      if (!bp.sections || bp.sections.length < 1) { toast('Add at least one section', 'warning'); return; }
      var hasDownstream = (S.data.script.sections && S.data.script.sections.length > 0) || (S.data.clips && S.data.clips.length > 0);
      var doConfirm = function() {
        bp.confirmed = true;
        bp.confirmed_at = new Date().toISOString();
        // Auto-create script sections from blueprint
        S.data.script.sections = [];
        S.data.script.total_word_count = 0;
        S.data.script.estimated_duration = 0;
        S.data.script.finalized = false;
        S.data.script.finalized_at = '';
        for (var i = 0; i < bp.sections.length; i++) {
          S.data.script.sections.push(createDefaultBodySection(i + 1, bp.sections[i].label));
        }
        // Clear clips (they were based on old script)
        S.data.clips = [];
        S.selectedClipId = null;
        // Clear publishing (based on old content)
        S.data.publishing.youtube.title = ''; S.data.publishing.youtube.description = '';
        S.data.publishing.youtube.tags = []; S.data.publishing.youtube.chapters = [];
        S.data.thumbnails = { ideas: [], selected_idea_id: '', chat_history: [], finalized_prompt: null, generated_at: '' };
        // Copy title/audience/tone to video
        if (bp.title) S.data.video.title = bp.title;
        if (bp.target_audience) S.data.video.target_audience = bp.target_audience;
        if (bp.tone) S.data.video.tone = bp.tone;
        S.data.video.modified = new Date().toISOString();
        logActivity('blueprint_completed', 'Blueprint confirmed with ' + bp.sections.length + ' sections' + (hasDownstream ? ' (downstream data cleared)' : ''));
        _snapshotFull('Confirm blueprint');
        buildMaps(); syncToTextarea(); render();
        toast('Blueprint confirmed! Script sections created.', 'success');
      };
      if (hasDownstream) {
        openConfirmDialog({
          title: 'Re-confirm Blueprint?',
          message: 'Your <strong>script</strong> (' + (S.data.script.sections || []).length + ' sections, ' + (S.data.script.total_word_count || 0) + ' words) and <strong>clips</strong> (' + (S.data.clips || []).length + ' clips) will be cleared and recreated from the new blueprint structure.\n\nPublishing metadata and thumbnails will also be reset.',
          danger: true,
          onConfirm: doConfirm
        });
      } else {
        doConfirm();
      }
    });

    // Unlock blueprint (warns about downstream impact)
    $(document).off('click.vpm2a-ubp').on('click.vpm2a-ubp', '[data-action="unlock-blueprint"]', function() {
      var hasScript = S.data.script.sections && S.data.script.sections.length > 0 && S.data.script.total_word_count > 0;
      var hasClips = S.data.clips && S.data.clips.length > 0;
      if (hasScript || hasClips) {
        openConfirmDialog({
          title: 'Unlock Blueprint?',
          message: 'Changing the blueprint structure may make your current script' + (hasClips ? ' and clips' : '') + ' out of sync. You will need to re-confirm the blueprint to regenerate script sections.',
          onConfirm: function() {
            S.data.blueprint.confirmed = false;
            S.data.blueprint.confirmed_at = '';
            _snapshotFull('Unlock blueprint');
            buildMaps(); syncToTextarea(); render();
            toast('Blueprint unlocked for editing', 'info');
          }
        });
      } else {
        S.data.blueprint.confirmed = false;
        S.data.blueprint.confirmed_at = '';
        _snapshotFull('Unlock blueprint');
        buildMaps(); syncToTextarea(); render();
        toast('Blueprint unlocked for editing', 'info');
      }
    });

    // --- Activity view events ---
    $(document).off('click.vpm2a-clact').on('click.vpm2a-clact', '[data-action="clear-activity"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Clear Activity Log?', message: 'All ' + (S.activity || []).length + ' entries will be removed.', danger: true, onConfirm: function() {
        S.activity = []; syncToTextarea(); render(); toast('Activity cleared', 'success');
      }});
    });
    $(document).off('click.vpm2a-exact').on('click.vpm2a-exact', '[data-action="export-activity"]', function(e) {
      e.preventDefault();
      var lines = ['=== ACTIVITY LOG ===', ''];
      var acts = S.activity || [];
      for (var i = 0; i < acts.length; i++) {
        var a = acts[i];
        lines.push(formatDate(a.timestamp) + ' | ' + (a.type || '') + ' | ' + (a.description || '') + (a.user_name ? ' | ' + a.user_name : ''));
      }
      if (exportFile) exportFile('activity.txt', lines.join('\n'));
      else { _copyToClipboard(lines.join('\n')); toast('Activity copied to clipboard', 'success'); }
    });
    $(document).off('click.vpm2a-claf').on('click.vpm2a-claf', '[data-action="clear-activity-filters"]', function() {
      S.activityFilter = { search: '', type: '' }; render();
    });

    // --- Publish: Platform tab ---
    $(document).off('click.vpm2a-ptab').on('click.vpm2a-ptab', '[data-action="platform-tab"]', function() {
      S.currentPlatformTab = $(this).data('tab') || 'youtube'; render();
    });

    // --- Publish: Save fields ---
    $(document).off('change.vpm2a-spf blur.vpm2a-spf').on('change.vpm2a-spf blur.vpm2a-spf', '[data-action="save-publish-field"]', function() {
      var path = $(this).data('path'); var val = $(this).val();
      if (path) { setNested(S.data.publishing, path, val); }
      buildMaps(); syncToTextarea();
    });
    $(document).off('blur.vpm2a-spt').on('blur.vpm2a-spt', '[data-action="save-publish-tags"]', function() {
      var platform = $(this).data('platform') || 'youtube';
      S.data.publishing[platform] = S.data.publishing[platform] || {};
      S.data.publishing[platform].tags = $(this).val().split(',').map(function(t) { return t.trim(); }).filter(Boolean);
      syncToTextarea();
    });
    $(document).off('blur.vpm2a-sph').on('blur.vpm2a-sph', '[data-action="save-publish-hashtags"]', function() {
      var platform = $(this).data('platform') || 'youtube';
      S.data.publishing[platform] = S.data.publishing[platform] || {};
      S.data.publishing[platform].hashtags = $(this).val().split(/[\s,]+/).filter(function(t) { return t.startsWith('#') || t.length > 0; });
      syncToTextarea();
    });
    $(document).off('click.vpm2a-uta').on('click.vpm2a-uta', '[data-action="use-title-alt"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var alts = ((S.data.publishing || {}).youtube || {}).title_options || [];
      if (idx >= 0 && idx < alts.length) {
        S.data.publishing.youtube.title = alts[idx];
        _snapshotFull('Use alt title'); syncToTextarea(); render();
      }
    });

    // --- Chapters ---
    $(document).off('click.vpm2a-addch').on('click.vpm2a-addch', '[data-action="add-chapter"]', function() {
      S.data.publishing.youtube = S.data.publishing.youtube || {};
      S.data.publishing.youtube.chapters = S.data.publishing.youtube.chapters || [];
      S.data.publishing.youtube.chapters.push({ time: '0:00', label: 'New Chapter' });
      _snapshotFull('Add chapter'); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-sch blur.vpm2a-sch').on('change.vpm2a-sch blur.vpm2a-sch', '[data-action="save-chapter"]', function() {
      var idx = parseInt($(this).data('idx'), 10); var field = $(this).data('field');
      var chapters = ((S.data.publishing || {}).youtube || {}).chapters || [];
      if (idx >= 0 && idx < chapters.length) { chapters[idx][field] = $(this).val(); syncToTextarea(); }
    });
    $(document).off('click.vpm2a-delch').on('click.vpm2a-delch', '[data-action="delete-chapter"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var chapters = ((S.data.publishing || {}).youtube || {}).chapters || [];
      if (idx >= 0 && idx < chapters.length) { chapters.splice(idx, 1); _snapshotFull('Delete chapter'); syncToTextarea(); render(); }
    });

    // --- Exports ---
    $(document).off('click.vpm2a-ej').on('click.vpm2a-ej', '[data-action="export-json"]', function(e) {
      e.preventDefault();
      var data = { data: deepClone(S.data), meta: deepClone(S.meta), exported_at: new Date().toISOString(), app: 'vpm', version: '1.0' };
      _exportFile('project.json', JSON.stringify(data, null, 2), 'application/json');
    });
    $(document).off('click.vpm2a-es').on('click.vpm2a-es', '[data-action="export-script"]', function(e) { e.preventDefault(); _exportFile('script.txt', _buildScriptExport()); });
    $(document).off('click.vpm2a-ep').on('click.vpm2a-ep', '[data-action="export-prompts"]', function(e) { e.preventDefault(); _exportFile('prompts.txt', _buildPromptsExport()); });
    $(document).off('click.vpm2a-esl2').on('click.vpm2a-esl2', '[data-action="export-shot-list"]', function(e) { e.preventDefault(); _exportFile('shot-list.txt', _buildShotListExport()); });
    $(document).off('click.vpm2a-em').on('click.vpm2a-em', '[data-action="export-metadata"]', function(e) { e.preventDefault(); _exportFile('youtube-metadata.txt', _buildMetadataExport()); });
    $(document).off('click.vpm2a-esoc').on('click.vpm2a-esoc', '[data-action="export-social"]', function(e) {
      e.preventDefault();
      var pub = S.data.publishing || {};
      var lines = ['=== SOCIAL POSTS ==='];
      if (pub.instagram && pub.instagram.caption) lines.push('', '--- INSTAGRAM ---', pub.instagram.caption, (pub.instagram.hashtags || []).join(' '));
      if (pub.tiktok && pub.tiktok.caption) lines.push('', '--- TIKTOK ---', pub.tiktok.caption, (pub.tiktok.hashtags || []).join(' '));
      if (pub.linkedin && pub.linkedin.post_text) lines.push('', '--- LINKEDIN ---', pub.linkedin.post_text);
      _exportFile('social-posts.txt', lines.join('\n'));
    });

    // --- Thumbnail Workshop events ---
    $(document).off('click.vpm2a-selth').on('click.vpm2a-selth', '[data-action="select-thumbnail"]', function() {
      S.selectedThumbnailId = $(this).data('id'); render();
    });
    $(document).off('click.vpm2a-devth').on('click.vpm2a-devth', '[data-action="develop-thumbnail"]', function() {
      S.selectedThumbnailId = $(this).data('id');
      S.thumbnailStep = 'refine';
      // Seed chat with system message
      S.data.thumbnails = S.data.thumbnails || {};
      S.data.thumbnails.chat_history = S.data.thumbnails.chat_history || [];
      if (!S.data.thumbnails.chat_history.length) {
        var idea = (S.data.thumbnails.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
        S.data.thumbnails.chat_history.push({ role: 'system', text: 'Developing concept: "' + ((idea || {}).title || '') + '". Describe how you want to refine it.', timestamp: new Date().toISOString() });
      }
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-bti').on('click.vpm2a-bti', '[data-action="thumb-back-to-ideas"]', function() {
      S.thumbnailStep = 'ideas'; render();
    });
    $(document).off('click.vpm2a-btr').on('click.vpm2a-btr', '[data-action="thumb-back-to-refine"]', function() {
      S.thumbnailStep = 'refine'; render();
    });
    // Chat send — delegates to Part 2B AI when available
    $(document).off('click.vpm2a-tcs').on('click.vpm2a-tcs', '[data-action="thumb-chat-send"]', function() {
      var input = ($('#vpmThumbChatInput').val() || '').trim();
      if (!input) return;
      S.data.thumbnails = S.data.thumbnails || {};
      S.data.thumbnails.chat_history = S.data.thumbnails.chat_history || [];
      S.data.thumbnails.chat_history.push({ role: 'user', text: input, timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      // Delegate to Part 2B AI
      if (window._vpmPart2B && window._vpmPart2B.thumbnailChatAI) {
        window._vpmPart2B.thumbnailChatAI(input);
      } else {
        // Fallback: placeholder response
        S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'I\u2019ve noted your feedback: "' + input + '". Configure AI in Settings for real-time refinement.', timestamp: new Date().toISOString() });
        syncToTextarea(); render();
      }
      // Scroll chat to bottom
      setTimeout(function() { var $msgs = $('#vpmThumbChatMessages'); if ($msgs.length) $msgs.scrollTop($msgs[0].scrollHeight); }, 50);
    });
    // Chat suggestion chip
    $(document).off('click.vpm2a-tcsg').on('click.vpm2a-tcsg', '[data-action="thumb-chat-suggest"]', function() {
      var text = $(this).data('text') || '';
      $('#vpmThumbChatInput').val(text).focus();
    });
    // Enter to send
    $(document).off('keypress.vpm2a-tck').on('keypress.vpm2a-tck', '#vpmThumbChatInput', function(e) {
      if (e.which === 13) { e.preventDefault(); $('[data-action="thumb-chat-send"]').click(); }
    });
    // Finalize
    $(document).off('click.vpm2a-tfin').on('click.vpm2a-tfin', '[data-action="thumb-finalize"]', function() {
      var thumbs = S.data.thumbnails || {};
      var idea = (thumbs.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
      // Build structured prompt from idea + chat context
      thumbs.finalized_prompt = {
        positive: (idea ? idea.desc || '' : '') + '. Professional YouTube thumbnail.',
        negative: 'blurry, low quality, cluttered, too much text',
        style_keywords: ['professional', 'youtube-thumbnail', 'high-contrast', idea ? idea.mood || '' : ''].filter(Boolean),
        parameters: { width: 1280, height: 720, quality: 'ultra' },
        text_overlays: idea && idea.text ? [{ text: idea.text, position: 'center', font_size: 'large', color: '#ffffff', stroke: '#000000' }] : [],
        composition: idea ? idea.layout || 'rule-of-thirds' : 'rule-of-thirds',
        brand_alignment: { colors_used: idea ? idea.colors || '' : '', mood: idea ? idea.mood || '' : '' },
        metadata: { generated_at: new Date().toISOString(), source_idea: S.selectedThumbnailId, chat_turns: (thumbs.chat_history || []).length }
      };
      thumbs.generated_at = new Date().toISOString();
      S.thumbnailStep = 'finalize';
      logActivity('thumbnail_finalized', 'Thumbnail prompt finalized');
      _snapshotFull('Finalize thumbnail'); syncToTextarea(); render();
      toast('Thumbnail prompt finalized!', 'success');
    });
    // Copy/Download JSON
    $(document).off('click.vpm2a-tcj').on('click.vpm2a-tcj', '[data-action="thumb-copy-json"]', function() {
      var fp = (S.data.thumbnails || {}).finalized_prompt;
      if (fp) _copyToClipboard(JSON.stringify(fp, null, 2));
    });
    $(document).off('click.vpm2a-tdj').on('click.vpm2a-tdj', '[data-action="thumb-download-json"]', function() {
      var fp = (S.data.thumbnails || {}).finalized_prompt;
      if (fp) _exportFile('thumbnail-prompt.json', JSON.stringify(fp, null, 2), 'application/json');
    });

    // --- Clips: Track filter ---
    $(document).off('click.vpm2a-fclip').on('click.vpm2a-fclip', '[data-action="filter-clips"]', function() {
      S.clipTrackFilter = $(this).data('filter') || 'all'; render();
    });

    // --- Clips: Tab switch ---
    $(document).off('click.vpm2a-cdt').on('click.vpm2a-cdt', '[data-action="clip-detail-tab"]', function(e) {
      e.preventDefault(); S.currentClipDetailTab = $(this).data('tab'); render();
    });

    // --- Clips: Add clip modal ---
    $(document).off('click.vpm2a-acm').on('click.vpm2a-acm', '[data-action="add-clip-modal"]', function(e) {
      e.preventDefault();
      var bpSecs = (S.data.blueprint || {}).sections || [];
      var html = '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><input class="vpm-input" data-field="title" value="New Clip"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Clip Type</label><select class="vpm-select" data-field="type">';
      for (var ctk in Constants.CLIP_TYPES) html += '<option value="' + ctk + '">' + esc(Constants.CLIP_TYPES[ctk].label) + ' (' + Constants.CLIP_TYPES[ctk].track + ')</option>';
      html += '</select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Section</label><select class="vpm-select" data-field="section">';
      if (bpSecs.length) { for (var bsi = 0; bsi < bpSecs.length; bsi++) html += '<option value="' + esc(bpSecs[bsi].id) + '">' + esc(bpSecs[bsi].label) + '</option>'; }
      else { html += '<option value="body">Body</option>'; }
      html += '</select></div></div>';
      openModal('Add Clip', html, { saveLabel: 'Create Clip', onSave: function() {
        var data = collectModalFields();
        var clip = createDefaultClip(data.type || 'ai-visual', data.section || 'body');
        clip.title = data.title || 'New Clip';
        S.data.clips.push(clip); S.selectedClipId = clip.id;
        recomputeClipTimings();
        logActivity('clip_added', 'Added clip: ' + clip.title);
        _snapshotFull('Add clip'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Clip added', 'success');
      }});
    });

    // --- Clips: Edit clip modal ---
    $(document).off('click.vpm2a-ecm').on('click.vpm2a-ecm', '[data-action="edit-clip-modal"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id');
      var clip = S.clipMap[clipId]; if (!clip) return;
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Title</label><input class="vpm-input" data-field="title" value="' + esc(clip.title || '') + '"></div>';
      html += '<div class="vpm-form-grid">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type">';
      for (var ctk in Constants.CLIP_TYPES) html += '<option value="' + ctk + '"' + (clip.type === ctk ? ' selected' : '') + '>' + esc(Constants.CLIP_TYPES[ctk].label) + '</option>';
      html += '</select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Duration (s)</label><input class="vpm-input" type="number" data-field="duration" value="' + (clip.duration || 8) + '"></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Visual Direction</label><textarea class="vpm-textarea" data-field="visual_direction" rows="2">' + esc(clip.visual_direction || '') + '</textarea></div>';
      openModal('Edit Clip #' + clip.order, html, { saveLabel: 'Update', onSave: function() {
        var data = collectModalFields();
        clip.title = data.title || clip.title;
        var newType = data.type || clip.type;
        if (newType !== clip.type) { clip.type = newType; var ct = Constants.CLIP_TYPES[newType] || {}; clip.track = ct.track || 'ai'; if (clip.track === 'ai' && !clip.prompt_set) clip.prompt_set = createEmptyPromptSet(newType); if (clip.track === 'non-ai' && !clip.non_ai_planning) clip.non_ai_planning = createDefaultNonAiPlanning(); }
        clip.duration = parseInt(data.duration, 10) || clip.duration;
        clip.visual_direction = data.visual_direction || '';
        recomputeClipTimings(); maybeAdvanceClipStatus(clip, 'edited');
        _snapshotFull('Edit clip'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Clip updated', 'success');
      }});
    });

    // --- Clips: Delete / Duplicate / Move ---
    $(document).off('click.vpm2a-delc').on('click.vpm2a-delc', '[data-action="delete-clip"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clip = S.clipMap[clipId]; if (!clip) return;
      openConfirmDialog({ title: 'Delete "' + (clip.title || 'Untitled') + '"?', message: 'This removes the clip and all its data.', danger: true, onConfirm: function() {
        S.data.clips = S.data.clips.filter(function(c) { return c.id !== clipId; });
        if (S.selectedClipId === clipId) S.selectedClipId = S.data.clips.length > 0 ? S.data.clips[0].id : null;
        recomputeClipTimings();
        logActivity('clip_removed', 'Deleted: ' + (clip.title || ''));
        _snapshotFull('Delete clip'); buildMaps(); syncToTextarea(); render(); toast('Clip deleted', 'success');
      }});
    });
    $(document).off('click.vpm2a-dupc').on('click.vpm2a-dupc', '[data-action="duplicate-clip"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clip = S.clipMap[clipId]; if (!clip) return;
      var clone = deepClone(clip); clone.id = generateId('clip'); clone.title += ' (copy)';
      clone.status = (clone.track === 'ai') ? 'draft' : (clone.track === 'non-ai') ? 'planned' : 'pending';
      S.data.clips.push(clone); S.selectedClipId = clone.id;
      recomputeClipTimings();
      _snapshotFull('Duplicate clip'); buildMaps(); syncToTextarea(); render(); toast('Clip duplicated', 'success');
    });
    $(document).off('click.vpm2a-mcup').on('click.vpm2a-mcup', '[data-action="move-clip-up"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clips = S.data.clips || [];
      var idx = clips.findIndex(function(c) { return c.id === clipId; }); if (idx <= 0) return;
      var tmp = clips[idx]; clips[idx] = clips[idx-1]; clips[idx-1] = tmp;
      recomputeClipTimings(); _snapshotFull('Move clip up'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-mcdn').on('click.vpm2a-mcdn', '[data-action="move-clip-down"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip-id'); var clips = S.data.clips || [];
      var idx = clips.findIndex(function(c) { return c.id === clipId; }); if (idx < 0 || idx >= clips.length - 1) return;
      var tmp = clips[idx]; clips[idx] = clips[idx+1]; clips[idx+1] = tmp;
      recomputeClipTimings(); _snapshotFull('Move clip down'); buildMaps(); syncToTextarea(); render();
    });

    // --- Clips: Save fields ---
    $(document).off('change.vpm2a-scf blur.vpm2a-scf').on('change.vpm2a-scf blur.vpm2a-scf', '[data-action="save-clip-field"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field'); var val = $(this).val();
      var clip = S.clipMap[clipId]; if (!clip) return;
      if (field === 'duration') {
        var dur = parseInt(val, 10) || 8;
        var ct = Constants.CLIP_TYPES[clip.type] || {};
        var stg = (S.meta && S.meta.settings) || {};
        if (ct.track === 'ai' && stg.snap_to_model_durations) {
          var mId = ((S.meta.aiPreferences || {}).videoModel || '');
          dur = snapToModelDuration(dur, mId);
        }
        clip.duration = dur; recomputeClipTimings();
      } else { clip[field] = val; }
      maybeAdvanceClipStatus(clip, 'field'); syncToTextarea();
    });
    $(document).off('change.vpm2a-scc').on('change.vpm2a-scc', '[data-action="save-clip-config"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field');
      var clip = S.clipMap[clipId]; if (!clip) return;
      clip.production_config = clip.production_config || {}; clip.production_config[field] = $(this).val();
      syncToTextarea();
    });
    $(document).off('change.vpm2a-svm').on('change.vpm2a-svm', '[data-action="save-video-model"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {}; clip.prompt_set.video.prompt = clip.prompt_set.video.prompt || {};
      clip.prompt_set.video.prompt.model = $(this).val(); syncToTextarea(); render();
    });
    // Video generation mode selector
    $(document).off('click.vpm2a-svgm').on('click.vpm2a-svgm', '[data-action="set-video-gen-mode"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var val = $(this).data('value');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.gen_mode = val;
      // Auto-switch tab if on a frame tab that will be hidden
      if (val !== 'frames-to-video' && (S.currentClipDetailTab === 'first-frame' || S.currentClipDetailTab === 'last-frame')) {
        S.currentClipDetailTab = 'script-config';
      }
      syncToTextarea(); render();
    });
    // Copy Seedance 2.0 plain-text prompt
    $(document).off('click.vpm2a-csp').on('click.vpm2a-csp', '[data-action="copy-seedance-prompt"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var sp = ((clip.prompt_set.video || {}).prompt || {}).seedance_prompt || '';
      if (!sp) { toast('No Seedance prompt to copy', 'warning'); return; }
      if (navigator.clipboard) { navigator.clipboard.writeText(sp).then(function() { toast('Seedance prompt copied', 'success'); }); }
      else toast('Copy not available', 'warning');
    });
    // Edit Seedance 2.0 plain-text prompt
    $(document).off('click.vpm2a-esp').on('click.vpm2a-esp', '[data-action="edit-seedance-prompt"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vp = ((clip.prompt_set.video || {}).prompt || {});
      var mHtml = '<div class="vpm-form-group"><label class="vpm-form-label">Seedance 2.0 Prompt (plain text)</label>';
      mHtml += '<textarea class="vpm-textarea" data-field="seedance_prompt" rows="22" style="font-family:var(--vpm-font-mono,monospace);font-size:11px;line-height:1.6">' + esc(vp.seedance_prompt || '') + '</textarea></div>';
      openModal('Edit Seedance 2.0 Prompt', mHtml, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields();
        vp.seedance_prompt = data.seedance_prompt || '';
        vp.status = 'edited';
        syncToTextarea(); closeModal(); render();
      }});
    });
    // Copy full structured video prompt as JSON
    $(document).off('click.vpm2a-cvpf').on('click.vpm2a-cvpf', '[data-action="copy-video-prompt-full"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vp = ((clip.prompt_set.video || {}).prompt || {});
      var fullPrompt = {};
      if (vp.visual_prompt) fullPrompt.visual_prompt = vp.visual_prompt;
      else if (vp.positive) fullPrompt.visual_prompt = vp.positive;
      if (vp.motion_description) fullPrompt.motion_description = vp.motion_description;
      if (vp.camera) fullPrompt.camera = vp.camera;
      if (vp.style) fullPrompt.style = vp.style;
      if (vp.negative_prompt) fullPrompt.negative_prompt = vp.negative_prompt;
      if (vp.duration) fullPrompt.duration = vp.duration;
      if (vp.audio) fullPrompt.audio = vp.audio;
      var text = JSON.stringify(fullPrompt, null, 2);
      if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { toast('Full prompt copied', 'success'); }); }
      else toast('Copy not available', 'warning');
    });
    // Add ingredient for ingredients-to-video mode
    $(document).off('click.vpm2a-aing').on('click.vpm2a-aing', '[data-action="add-ingredient"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip');
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Label</label><input class="vpm-input" data-field="label" placeholder="e.g. Main Character, Office Background, Laptop"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Type</label><select class="vpm-select" data-field="type"><option value="character">Character</option><option value="environment">Environment</option><option value="object">Object</option></select></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Description</label><textarea class="vpm-textarea" data-field="description" rows="2" placeholder="Describe this ingredient..."></textarea></div>';
      openModal('Add Ingredient', html, { saveLabel: 'Add', onSave: function() {
        var data = collectModalFields();
        var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
        clip.prompt_set.video = clip.prompt_set.video || {};
        if (!clip.prompt_set.video.ingredients) clip.prompt_set.video.ingredients = [];
        clip.prompt_set.video.ingredients.push({ label: data.label || '', type: data.type || 'object', description: data.description || '' });
        syncToTextarea(); closeModal(); render();
      }});
    });
    $(document).off('click.vpm2a-ring').on('click.vpm2a-ring', '[data-action="remove-ingredient"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var idx = $(this).data('idx');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var ings = ((clip.prompt_set.video || {}).ingredients || []);
      if (idx >= 0 && idx < ings.length) { ings.splice(idx, 1); syncToTextarea(); render(); }
    });
    $(document).off('change.vpm2a-scs').on('change.vpm2a-scs', '[data-action="save-clip-scene"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var sceneId = $(this).val();
      clip.prompt_set.first_frame.scene.scene_template_id = sceneId;
      // Also populate look_ids and environment_id from the scene template
      if (sceneId && S.sceneMap[sceneId]) {
        var sc = S.sceneMap[sceneId];
        clip.prompt_set.first_frame.scene.look_ids = (sc.look_ids || []).slice();
        clip.prompt_set.first_frame.scene.environment_id = sc.environment_id || '';
      }
      maybeAdvanceClipStatus(clip, 'scene set');
      logActivity('scene_assigned', 'Scene assigned to clip #' + clip.order);
      syncToTextarea(); render();
    });
    // Direct look selection
    // Card-based look assignment (for ai-character clips)
    $(document).off('click.vpm2a-acl').on('click.vpm2a-acl', '[data-action="assign-clip-look"]', function(e) {
      e.preventDefault();
      var clipId = $(this).data('clip'); var lookId = $(this).data('look');
      var clip = S.clipMap[clipId]; if (!clip) return;
      ensurePromptSet(clip);
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var scene = clip.prompt_set.first_frame.scene;
      if (scene.look_ids && scene.look_ids.indexOf(lookId) >= 0) {
        scene.look_ids = []; // Toggle off
      } else {
        scene.look_ids = [lookId]; // Assign
      }
      scene.scene_template_id = '';
      maybeAdvanceClipStatus(clip, 'character assigned');
      syncToTextarea(); render();
    });
    // Dropdown-based look selection (for generic use)
    $(document).off('change.vpm2a-scl').on('change.vpm2a-scl', '[data-action="save-clip-look"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      var lookId = $(this).val();
      clip.prompt_set.first_frame.scene.look_ids = lookId ? [lookId] : [];
      clip.prompt_set.first_frame.scene.scene_template_id = ''; // Clear template — user overriding manually
      maybeAdvanceClipStatus(clip, 'look set');
      syncToTextarea(); render();
    });
    // Direct environment selection
    $(document).off('change.vpm2a-sce').on('change.vpm2a-sce', '[data-action="save-clip-environment"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
      clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
      clip.prompt_set.first_frame.scene.environment_id = $(this).val() || '';
      clip.prompt_set.first_frame.scene.scene_template_id = ''; // Clear template — user overriding manually
      maybeAdvanceClipStatus(clip, 'environment set');
      syncToTextarea(); render();
    });
    // Seedance character look (saves to ps.video.seedance_assets.character_look_id)
    $(document).off('change.vpm2a-ssl').on('change.vpm2a-ssl', '[data-action="save-seedance-look"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.seedance_assets = clip.prompt_set.video.seedance_assets || {};
      clip.prompt_set.video.seedance_assets.character_look_id = $(this).val() || '';
      maybeAdvanceClipStatus(clip, 'seedance look set');
      syncToTextarea(); render();
    });
    // Seedance environment slots (saves to ps.video.seedance_assets.env_ids[idx])
    $(document).off('change.vpm2a-sse').on('change.vpm2a-sse', '[data-action="save-seedance-env"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var idx = parseInt($(this).data('idx')) || 0;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.seedance_assets = clip.prompt_set.video.seedance_assets || {};
      clip.prompt_set.video.seedance_assets.env_ids = clip.prompt_set.video.seedance_assets.env_ids || ['', '', ''];
      clip.prompt_set.video.seedance_assets.env_ids[idx] = $(this).val() || '';
      maybeAdvanceClipStatus(clip, 'seedance env set');
      syncToTextarea(); render();
    });

    // --- Frame/Video done toggles ---
    $(document).off('change.vpm2a-tfd').on('change.vpm2a-tfd', '[data-action="toggle-frame-done"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      frame.marked_done = $(this).is(':checked'); frame.done_at = frame.marked_done ? new Date().toISOString() : null;
      maybeAdvanceClipStatus(clip, 'frame toggled');
      logActivity('frame_marked_done', 'Clip ' + clip.order + ': ' + (frameKey === 'first_frame' ? 'First' : 'Last') + ' frame ' + (frame.marked_done ? 'done' : 'undone'));
      _snapshotFull('Toggle frame'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-tvd').on('change.vpm2a-tvd', '[data-action="toggle-video-done"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      clip.prompt_set.video = clip.prompt_set.video || {};
      clip.prompt_set.video.marked_done = $(this).is(':checked');
      maybeAdvanceClipStatus(clip, 'video toggled');
      _snapshotFull('Toggle video'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('change.vpm2a-tnd').on('change.vpm2a-tnd', '[data-action="toggle-nonai-done"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {};
      clip.non_ai_planning.marked_done = $(this).is(':checked');
      maybeAdvanceClipStatus(clip, 'non-ai done');
      _snapshotFull('Toggle non-ai done'); buildMaps(); syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-snf').on('blur.vpm2a-snf', '[data-action="save-nonai-field"]', function() {
      var clipId = $(this).data('clip'); var field = $(this).data('field');
      var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning[field] = $(this).val();
      maybeAdvanceClipStatus(clip, 'non-ai field'); syncToTextarea();
    });
    $(document).off('click.vpm2a-cnr').on('click.vpm2a-cnr', '[data-action="clear-nonai-recording"]', function() {
      var clipId = $(this).data('clip'); var clip = S.clipMap[clipId]; if (!clip) return;
      clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning.recording_ref = '';
      syncToTextarea(); render();
    });
    $(document).off('click.vpm2a-pnr').on('click.vpm2a-pnr', '[data-action="paste-nonai-url"]', function() {
      var clipId = $(this).data('clip');
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Recording URL</label><input class="vpm-input" data-field="url" placeholder="https://drive.google.com/..."></div>';
      openModal('Paste Recording URL', html, { saveLabel: 'Save', size: 'sm', onSave: function() {
        var data = collectModalFields();
        var clip = S.clipMap[clipId]; if (!clip) return;
        clip.non_ai_planning = clip.non_ai_planning || {}; clip.non_ai_planning.recording_ref = data.url || '';
        maybeAdvanceClipStatus(clip, 'recording added');
        closeModal(); syncToTextarea(); render(); toast('Recording URL saved', 'success');
      }});
    });

    // --- Frame image picker events ---
    $(document).off('click.vpm2a-sfimg').on('click.vpm2a-sfimg', '[data-action="select-frame-image"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var gIdx = parseInt($(this).data('gallery-idx'), 10);
      var gallery = (S.galleries || {}).frames || [];
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      if (gIdx >= 0 && gIdx < gallery.length) {
        frame.image_url = gallery[gIdx].url; frame.version = (frame.version || 0) + 1;
        logActivity('frame_image_set', 'Clip ' + clip.order + ': frame image set');
        syncToTextarea(); render();
      }
    });
    $(document).off('click.vpm2a-rfimg').on('click.vpm2a-rfimg', '[data-action="remove-frame-image"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      frame.image_url = ''; syncToTextarea(); render();
    });
    $(document).off('blur.vpm2a-sfurl').on('blur.vpm2a-sfurl', '[data-action="save-frame-image-url"]', function() {
      var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      var url = ($(this).val() || '').trim();
      if (url !== frame.image_url) { frame.image_url = url; frame.version = (frame.version || 0) + 1; syncToTextarea(); }
    });

    // --- Edit frame/video prompts ---
    $(document).off('click.vpm2a-efp').on('click.vpm2a-efp', '[data-action="edit-frame-prompt"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip'); var frameKey = $(this).data('frame');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var frame = clip.prompt_set[frameKey]; if (!frame) return;
      var prompt = frame.prompt || {};
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Positive Prompt</label><textarea class="vpm-textarea" data-field="positive" rows="4">' + esc(prompt.positive || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Negative Prompt</label><textarea class="vpm-textarea" data-field="negative" rows="2">' + esc(prompt.negative || '') + '</textarea></div>';
      openModal('Edit ' + (frameKey === 'first_frame' ? 'First' : 'Last') + ' Frame Prompt', html, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields(); prompt.positive = data.positive || ''; prompt.negative = data.negative || '';
        prompt.status = prompt.positive ? 'generated' : 'empty'; frame.prompt = prompt;
        maybeAdvanceClipStatus(clip, 'prompt edited');
        _snapshotFull('Edit frame prompt'); syncToTextarea(); closeModal(); render();
      }});
    });
    $(document).off('click.vpm2a-evp').on('click.vpm2a-evp', '[data-action="edit-video-prompt"]', function(e) {
      e.preventDefault(); var clipId = $(this).data('clip');
      var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
      var vd = clip.prompt_set.video || {}; var prompt = vd.prompt || {};
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Motion / Video Prompt</label><textarea class="vpm-textarea" data-field="positive" rows="4">' + esc(prompt.positive || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Negative</label><textarea class="vpm-textarea" data-field="negative" rows="2">' + esc(prompt.negative || '') + '</textarea></div>';
      openModal('Edit Video Prompt', html, { saveLabel: 'Save', onSave: function() {
        var data = collectModalFields(); prompt.positive = data.positive || ''; prompt.negative = data.negative || '';
        prompt.status = prompt.positive ? 'generated' : 'empty'; vd.prompt = prompt; clip.prompt_set.video = vd;
        maybeAdvanceClipStatus(clip, 'video prompt edited');
        _snapshotFull('Edit video prompt'); syncToTextarea(); closeModal(); render();
      }});
    });

    // --- Studio tab switching ---
    $(document).off('click.vpm2a-stab').on('click.vpm2a-stab', '[data-action="studio-tab"]', function() {
      S.currentStudioTab = $(this).data('tab') || 'overview';
      render();
    });

    // --- Entity CRUD ---
    $(document).off('click.vpm2a-addlk').on('click.vpm2a-addlk', '[data-action="add-look"]', function() { _openLookEditModal(-1, null); });
    $(document).off('click.vpm2a-addenv').on('click.vpm2a-addenv', '[data-action="add-environment"]', function() { _openEnvironmentEditModal(-1, null); });
    $(document).off('click.vpm2a-addsc').on('click.vpm2a-addsc', '[data-action="add-scene"]', function() { _openSceneEditModal(-1, null); });

    $(document).off('click.vpm2a-edent').on('click.vpm2a-edent', '[data-action="edit-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var lib = _getEntityLib(type); if (!lib || idx < 0 || idx >= lib.length) return;
      if (type === 'look') _openLookEditModal(idx, lib[idx]);
      else if (type === 'environment') _openEnvironmentEditModal(idx, lib[idx]);
    });
    $(document).off('click.vpm2a-edsc').on('click.vpm2a-edsc', '[data-action="edit-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var lib = S.meta.sceneLibrary || []; if (idx < 0 || idx >= lib.length) return;
      _openSceneEditModal(idx, lib[idx]);
    });

    $(document).off('click.vpm2a-delent').on('click.vpm2a-delent', '[data-action="delete-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var lib = _getEntityLib(type); if (!lib || idx < 0 || idx >= lib.length) return;
      var name = lib[idx].name || 'Unnamed';
      openConfirmDialog({ title: 'Delete "' + name + '"?', message: 'This ' + type + ' will be permanently removed.', danger: true, onConfirm: function() {
        lib.splice(idx, 1);
        _snapshotFull('Delete ' + type); buildMaps(); syncToTextarea(); render(); toast(type + ' deleted', 'success');
      }});
    });
    $(document).off('click.vpm2a-delsc').on('click.vpm2a-delsc', '[data-action="delete-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var lib = S.meta.sceneLibrary || []; if (idx < 0 || idx >= lib.length) return;
      var name = lib[idx].name || 'Unnamed';
      openConfirmDialog({ title: 'Delete "' + name + '"?', message: 'This scene will be removed. Any clips using it will have their scene reference cleared.', danger: true, onConfirm: function() {
        // Clean up clip references to this scene
        var deletedId = lib[idx].id;
        var allClips = S.data.clips || [];
        for (var ci = 0; ci < allClips.length; ci++) {
          var cps = ((allClips[ci].prompt_set || {}).first_frame || {}).scene;
          if (cps && cps.scene_template_id === deletedId) { cps.scene_template_id = ''; }
        }
        lib.splice(idx, 1);
        _snapshotFull('Delete scene'); buildMaps(); syncToTextarea(); render(); toast('Scene deleted', 'success');
      }});
    });

    // Copy brand entity to video
    $(document).off('click.vpm2a-cpbe').on('click.vpm2a-cpbe', '[data-action="copy-brand-entity"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var brandArr = (type === 'look') ? (S.brandStudio.looks || []) : (type === 'environment') ? (S.brandStudio.environments || []) : [];
      if (idx < 0 || idx >= brandArr.length) return;
      var copy = deepClone(brandArr[idx]);
      copy.id = generateId(type === 'look' ? 'look' : 'env');
      copy.source = 'video'; copy.name = copy.name + ' (Copy)'; copy.modified = new Date().toISOString();
      var lib = _getEntityLib(type);
      if (lib) { lib.push(copy); _snapshotFull('Copy brand ' + type); buildMaps(); syncToTextarea(); render(); toast(type + ' copied to video', 'success'); }
    });
    $(document).off('click.vpm2a-cpbs').on('click.vpm2a-cpbs', '[data-action="copy-brand-scene"]', function() {
      var idx = parseInt($(this).data('idx'), 10);
      var brandScenes = S.brandStudio.scenes || [];
      if (idx < 0 || idx >= brandScenes.length) return;
      var copy = deepClone(brandScenes[idx]);
      copy.id = generateId('scene'); copy.source = 'video'; copy.name = copy.name + ' (Copy)'; copy.modified = new Date().toISOString();
      S.meta.sceneLibrary = S.meta.sceneLibrary || []; S.meta.sceneLibrary.push(copy);
      _snapshotFull('Copy brand scene'); buildMaps(); syncToTextarea(); render(); toast('Scene copied to video', 'success');
    });

    // Image picker events
    $(document).off('click.vpm2a-selimg').on('click.vpm2a-selimg', '[data-action="select-entity-image"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var gIdx = parseInt($(this).data('gallery-idx'), 10);
      var galType = $(this).data('gallery-type');
      var gallery = (S.galleries || {})[galType] || [];
      if (gIdx >= 0 && gIdx < gallery.length) _setEntityImage(type, idx, gallery[gIdx].url, gallery[gIdx].fid);
    });
    $(document).off('click.vpm2a-rmimg').on('click.vpm2a-rmimg', '[data-action="remove-entity-image"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      _setEntityImage(type, idx, '', '');
    });
    $(document).off('blur.vpm2a-imgurl').on('blur.vpm2a-imgurl', '[data-action="save-entity-image-url"]', function() {
      var type = $(this).data('entity-type'); var idx = parseInt($(this).data('entity-idx'), 10);
      var url = ($(this).val() || '').trim();
      _setEntityImage(type, idx, url, '');
    });
    $(document).off('click.vpm2a-uplimg').on('click.vpm2a-uplimg', '[data-action="upload-entity-image"]', function() {
      var galType = $(this).data('gallery-type');
      var entType = $(this).data('entity-type'); var entIdx = $(this).data('entity-idx');
      var $fileInput = $('<input type="file" accept="image/*" style="display:none">');
      $('body').append($fileInput);
      S._imageUploadContext = { entityType: entType, entityIdx: parseInt(entIdx, 10), galleryType: galType };
      $fileInput.trigger('click');
      $fileInput.on('change', function() {
        var file = this.files && this.files[0];
        if (file && S._imageUploadContext) { queueGalleryUpload(S._imageUploadContext.galleryType, file, S._imageUploadContext); }
        $(this).remove();
      });
    });

    // Reload brand library
    $(document).off('click.vpm2a-rbl').on('click.vpm2a-rbl', '[data-action="reload-brand-library"]', function() {
      window._vpmParseBrandStudioLibrary();
      buildMaps(); render(); toast('Brand library reloaded', 'success');
    });

    // --- Script stage events ---
    // Add script section
    $(document).off('click.vpm2a-addss').on('click.vpm2a-addss', '[data-action="add-script-section"]', function(e) {
      e.preventDefault();
      var sections = S.data.script.sections = S.data.script.sections || [];
      var newSec = createDefaultBodySection(sections.length + 1, 'New Section');
      sections.push(newSec);
      recomputeScriptDurations();
      logActivity('script_edited', 'Added script section: ' + newSec.label);
      _snapshotFull('Add script section'); buildMaps(); syncToTextarea(); render();
      toast('Section added', 'success');
    });

    // Remove script section
    $(document).off('click.vpm2a-rmss').on('click.vpm2a-rmss', '[data-action="remove-script-section"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var sec = sections.find(function(s) { return s.id === secId; });
      var name = sec ? sec.label : 'section';
      openConfirmDialog({
        title: 'Delete "' + name + '"?', message: 'This section and its content will be removed.', danger: true,
        onConfirm: function() {
          _destroySectionEditor(secId);
          S.data.script.sections = sections.filter(function(s) { return s.id !== secId; });
          // Re-order
          for (var i = 0; i < S.data.script.sections.length; i++) S.data.script.sections[i].order = i + 1;
          recomputeScriptDurations();
          logActivity('script_edited', 'Removed section: ' + name);
          _snapshotFull('Remove section'); buildMaps(); syncToTextarea(); render();
          toast('Section removed', 'success');
        }
      });
    });

    // Move script section up/down
    $(document).off('click.vpm2a-mssup').on('click.vpm2a-mssup', '[data-action="move-script-section-up"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var idx = sections.findIndex(function(s) { return s.id === secId; });
      if (idx > 0) {
        _destroyAllEditors();
        var temp = sections[idx]; sections[idx] = sections[idx - 1]; sections[idx - 1] = temp;
        for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
        _snapshotFull('Move section up'); buildMaps(); syncToTextarea(); render();
      }
    });
    $(document).off('click.vpm2a-mssdn').on('click.vpm2a-mssdn', '[data-action="move-script-section-down"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var idx = sections.findIndex(function(s) { return s.id === secId; });
      if (idx >= 0 && idx < sections.length - 1) {
        _destroyAllEditors();
        var temp = sections[idx]; sections[idx] = sections[idx + 1]; sections[idx + 1] = temp;
        for (var i = 0; i < sections.length; i++) sections[i].order = i + 1;
        _snapshotFull('Move section down'); buildMaps(); syncToTextarea(); render();
      }
    });

    // Rename script section label
    $(document).off('click.vpm2a-esl').on('click.vpm2a-esl', '[data-action="edit-section-label"]', function(e) {
      e.preventDefault();
      var secId = $(this).data('section-id');
      var sections = S.data.script.sections || [];
      var sec = sections.find(function(s) { return s.id === secId; });
      if (!sec) return;
      var html = '<div class="vpm-form-group"><label class="vpm-form-label">Section Label</label>';
      html += '<input class="vpm-input" data-field="label" value="' + esc(sec.label || '') + '" autofocus></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Notes (optional)</label>';
      html += '<textarea class="vpm-textarea" data-field="notes" rows="2" placeholder="Instructions or context for this section\u2026">' + esc(sec.notes || '') + '</textarea></div>';
      openModal('Edit Section', html, { saveLabel: 'Update', size: 'sm', onSave: function() {
        var data = collectModalFields();
        sec.label = data.label || sec.label;
        sec.notes = data.notes || '';
        _snapshotFull('Rename section'); buildMaps(); syncToTextarea(); closeModal(); render();
        toast('Section updated', 'success');
      }});
    });

    // Finalize script
    $(document).off('click.vpm2a-fscr').on('click.vpm2a-fscr', '[data-action="finalize-script"]', function(e) {
      e.preventDefault();
      _flushAllEditors();
      recomputeScriptDurations();
      var sc = S.data.script;
      if (!sc.total_word_count) { toast('Script is empty \u2014 add content first', 'warning'); return; }
      // Save version
      sc.versions = sc.versions || [];
      sc.versions.push({
        id: generateId('ver'),
        timestamp: new Date().toISOString(),
        label: 'v' + (sc.versions.length + 1) + ' \u2014 Finalized',
        total_word_count: sc.total_word_count || 0,
        snapshot: deepClone(sc.sections)
      });
      sc.finalized = true;
      sc.finalized_at = new Date().toISOString();
      _destroyAllEditors();
      logActivity('script_finalized', 'Script finalized (' + (sc.total_word_count || 0) + ' words, ' + (sc.sections || []).length + ' sections)');
      _snapshotFull('Finalize script'); buildMaps(); syncToTextarea(); render();
      toast('Script finalized!', 'success');
    });

    // Unlock script
    $(document).off('click.vpm2a-uscr').on('click.vpm2a-uscr', '[data-action="unlock-script"]', function(e) {
      e.preventDefault();
      _destroyAllEditors();
      S.data.script.finalized = false;
      logActivity('script_unlocked', 'Script unlocked for editing');
      _snapshotFull('Unlock script'); buildMaps(); syncToTextarea(); render();
      toast('Script unlocked', 'info');
    });

    // Script version history
    $(document).off('click.vpm2a-svh').on('click.vpm2a-svh', '[data-action="show-script-versions"]', function(e) {
      e.preventDefault();
      var versions = (S.data.script || {}).versions || [];
      if (!versions.length) { toast('No versions saved yet', 'info'); return; }
      var html = '<div class="vpm-version-list">';
      for (var i = versions.length - 1; i >= 0; i--) {
        var ver = versions[i];
        var isCurrent = (i === versions.length - 1);
        html += '<div class="vpm-version-item' + (isCurrent ? ' vpm-version-current' : '') + '">';
        html += '<div class="vpm-flex-between"><div>';
        html += '<strong class="vpm-text-sm">' + esc(ver.label || 'Version ' + (i + 1)) + '</strong>';
        if (isCurrent) html += ' ' + badge('Current', '#0d904f');
        html += '</div><div class="vpm-flex-row" style="gap:6px"><span class="vpm-text-xs vpm-text-muted">' + formatRelativeTime(ver.timestamp || '') + '</span>';
        if (!isCurrent && ver.snapshot) html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="restore-script-version" data-ver-idx="' + i + '" style="font-size:10px;padding:2px 8px">' + icon('arrows-rotate') + ' Restore</button>';
        html += '</div></div>';
        html += '<div class="vpm-text-xs vpm-text-muted" style="margin-top:2px">';
        if (ver.total_word_count) html += ver.total_word_count + ' words';
        if (ver.timestamp) html += ' \u00B7 ' + formatDate(ver.timestamp);
        html += '</div></div>';
      }
      html += '</div>';
      html += '<div class="vpm-info-banner" style="margin-top:12px">' + icon('info') + ' <span class="vpm-text-sm">Versions are saved when you finalize or when AI generates a script. Restoring a version creates a backup first.</span></div>';
      openModal('Script Version History', html, { footer: false, size: 'md' });
    });

    // Restore script version
    $(document).off('click.vpm2a-rsv').on('click.vpm2a-rsv', '[data-action="restore-script-version"]', function(e) {
      e.preventDefault();
      var idx = parseInt($(this).data('ver-idx'), 10);
      var versions = (S.data.script || {}).versions || [];
      if (idx < 0 || idx >= versions.length || !versions[idx].snapshot) { toast('Cannot restore this version', 'warning'); return; }
      var ver = versions[idx];
      openConfirmDialog({
        title: 'Restore "' + (ver.label || 'Version') + '"?',
        message: 'This will replace your current script with this version (' + (ver.total_word_count || 0) + ' words). A backup of your current script will be saved first.',
        onConfirm: function() {
          _destroyAllEditors();
          var sc = S.data.script;
          // Backup current
          sc.versions = sc.versions || [];
          sc.versions.push({
            id: generateId('ver'),
            timestamp: new Date().toISOString(),
            label: 'v' + (sc.versions.length + 1) + ' \u2014 Before Restore',
            total_word_count: sc.total_word_count || 0,
            snapshot: deepClone(sc.sections)
          });
          // Restore
          sc.sections = deepClone(ver.snapshot);
          sc.finalized = false;
          recomputeScriptDurations();
          logActivity('script_edited', 'Restored version: ' + (ver.label || 'v' + (idx + 1)));
          _snapshotFull('Restore version'); buildMaps(); syncToTextarea(); closeModal(); render();
          toast('Version restored', 'success');
        }
      });
    });

    // Copy prompt
    $(document).off('click.vpm2a-cp').on('click.vpm2a-cp', '[data-action="copy-prompt"]', function() {
      var text = $(this).data('text') || '';
      if (text) _copyToClipboard(text);
    });
  }


  // ============================================================
  // SECTION 21: API EXPORTS
  // ============================================================

  window._vpmOpenModal = openModal;
  window._vpmCloseModal = closeModal;
  window._vpmOpenConfirmDialog = openConfirmDialog;
  window._vpmCollectModalFields = collectModalFields;
  window._vpmUndo = undo;
  window._vpmRedo = redo;
  window._vpmCopyToClipboard = _copyToClipboard;
  window._vpmInitAllScriptEditors = _initAllScriptEditors;
  window._vpmDestroyAllEditors = _destroyAllEditors;
  window._vpmFlushAllEditors = _flushAllEditors;
  window._vpmRenderImagePicker = _renderImagePicker;
  window._vpmSetEntityImage = _setEntityImage;
  window._vpmGetEntityLib = _getEntityLib;
  window._vpmRenderFrameImagePicker = _renderFrameImagePicker;
  window._vpmExportFile = _exportFile;

  console.log('[VPM] Part 2A v1.0 loaded \u2014 21 sections (all stages + activity)');

})(jQuery, Drupal);


/* ===== src/ai/brand-service.js ===== */
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


/* ===== src/ai/llm-service.js ===== */
/**
 * VPM LLM Service + AI Action System
 *
 * Combined module — LLMService (8 providers, fetch/abort/extract) and the AI
 * Action System (registry, preflight modal, progress overlay, retry wrapper).
 * Kept together because LLMService.callAI() references _aiAbortController and
 * _hideAIProgress that live in the action-system closure.
 *
 * Registers on window._vpm:
 *   - llmService  (the LLMService API)
 *   - aiActions   ({ AI_ACTIONS, _openAIActionModal, _showAIProgress, _hideAIProgress,
 *                    _cancelAI, _buildCustomBlock, _launchAI, _callAIWithRetry,
 *                    _hasRequiredKeys, _extractArray })
 *
 * Reads from window (set by part1 before this file runs):
 *   - window._vpmState  (S)
 *   - window._vpmIcon, _vpmEsc, _vpmTruncate, _vpmToast, _vpmParseJSON,
 *     _vpmSyncToTextarea, _vpmOpenModal, _vpmCloseModal
 *
 * MUST load AFTER vpm-part1.js (which sets the window._vpm* helpers).
 */
(function ($, Drupal) {
  'use strict';

  // ============================================================
  // Dependency capture — pulled from window at parse time.
  // ============================================================
  var S = window._vpmState;
  var icon = window._vpmIcon, esc = window._vpmEsc, truncate = window._vpmTruncate;
  var toast = window._vpmToast, parseJSON = window._vpmParseJSON;
  var syncToTextarea = window._vpmSyncToTextarea;
  var openModal = window._vpmOpenModal, closeModal = window._vpmCloseModal;

// ============================================================
// SECTION 2: LLMService (8 AI Providers)
// ============================================================

var AI_ENDPOINTS = {
  'gemini':      'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
  'claude':      'https://api.anthropic.com/v1/messages',
  'openai':      'https://api.openai.com/v1/chat/completions',
  'grok':        'https://api.x.ai/v1/chat/completions',
  'groq':        'https://api.groq.com/openai/v1/chat/completions',
  'nvidia':      'https://integrate.api.nvidia.com/v1/chat/completions',
  'huggingface': 'https://router.huggingface.co/v1/chat/completions',
  'openrouter':  'https://openrouter.ai/api/v1/chat/completions'
};

var LLMService = (function() {
  var _config = null, _providerMap = {}, _initialized = false;

  function init() {
    _config = null; _providerMap = {};
    var $cfg = $('.llm-config-data'), raw = null;
    if ($cfg.length) { try { raw = JSON.parse($cfg.text().trim()); } catch(e) {} }
    _config = raw;
    if (_config && _config.providers) {
      for (var i = 0; i < _config.providers.length; i++) {
        var p = _config.providers[i]; if (!p.active) continue;
        var activeModels = (p.models || []).filter(function(m) { return m.active; });
        if (!activeModels.length) continue;
        _providerMap[p.id] = { id: p.id, label: p.label || p.id, api_key: p.api_key || '', activeModels: activeModels };
      }
    }
    _initialized = true;
    console.log('[VPM] LLMService: ' + Object.keys(_providerMap).length + ' active providers');
    // Observe for async-loaded config if no providers found
    if (!Object.keys(_providerMap).length) _observeLLMConfig();
  }

  function _observeLLMConfig() {
    try {
      var _llmObserver = new MutationObserver(function() {
        var $cfg = $('.llm-config-data');
        if (!$cfg.length) return;
        _llmObserver.disconnect();
        init();
        if (isConfigured()) {
          console.log('[VPM] LLMService: providers loaded via observer');
          if (window._vpmRender) window._vpmRender();
        }
      });
      _llmObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(function() { _llmObserver.disconnect(); }, 30000);
    } catch (e) { console.warn('[VPM] LLM observer failed:', e); }
  }

  function reinit() { init(); }

  function isConfigured() { return Object.keys(_providerMap).length > 0; }
  function getActiveProviders() { return Object.keys(_providerMap).map(function(id) { return _providerMap[id]; }); }
  function getActiveModels(pid) { var p = _providerMap[pid]; return p ? p.activeModels : []; }

  function getDefault() {
    var providers = getActiveProviders(); if (!providers.length) return null;
    var prefs = (S.meta && S.meta.aiPreferences) || {};
    if (prefs.appDefault && prefs.appDefault.provider && _providerMap[prefs.appDefault.provider]) {
      return { provider: prefs.appDefault.provider, model: prefs.appDefault.model, api_key: _providerMap[prefs.appDefault.provider].api_key };
    }
    var fp = providers[0];
    return { provider: fp.id, model: fp.activeModels[0].id, api_key: fp.api_key };
  }

  function resolveSelection(actionId) {
    var prefs = (S.meta && S.meta.aiPreferences) || {};
    var _resolveModelCfg = function(pid, mid) {
      var p = _providerMap[pid]; if (!p) return null;
      var cfg = { provider: pid, model: mid, api_key: p.api_key, temperature: 1.0, max_tokens: 8192 };
      // Find model-specific settings
      for (var mi = 0; mi < p.activeModels.length; mi++) {
        if (p.activeModels[mi].id === mid) {
          if (p.activeModels[mi].temperature !== undefined) cfg.temperature = p.activeModels[mi].temperature;
          if (p.activeModels[mi].max_tokens) cfg.max_tokens = p.activeModels[mi].max_tokens;
          break;
        }
      }
      return cfg;
    };
    if (actionId && prefs.perAction && prefs.perAction[actionId]) {
      var pa = prefs.perAction[actionId];
      if (_providerMap[pa.provider]) return _resolveModelCfg(pa.provider, pa.model);
    }
    if (prefs.lastProvider && _providerMap[prefs.lastProvider]) return _resolveModelCfg(prefs.lastProvider, prefs.lastModel);
    return getDefault();
  }

  function savePreference(actionId, pid, mid) {
    S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences.perAction = S.meta.aiPreferences.perAction || {};
    S.meta.aiPreferences.lastProvider = pid; S.meta.aiPreferences.lastModel = mid;
    if (actionId) S.meta.aiPreferences.perAction[actionId] = { provider: pid, model: mid };
    syncToTextarea();
  }

  function renderInlinePicker(actionId) {
    if (!isConfigured()) return '<span class="vpm-text-sm vpm-text-muted">' + icon('warning') + ' No AI configured</span>';
    var sel = resolveSelection(actionId), providers = getActiveProviders();
    var html = '<span class="vpm-ai-picker" data-action-id="' + esc(actionId) + '">';
    html += '<select class="vpm-select vpm-select-sm vpm-ai-provider-select" data-action-id="' + esc(actionId) + '">';
    for (var i = 0; i < providers.length; i++) { var p = providers[i]; html += '<option value="' + esc(p.id) + '"' + (sel && sel.provider === p.id ? ' selected' : '') + '>' + esc(p.label) + '</option>'; }
    html += '</select>';
    var curProv = sel ? _providerMap[sel.provider] : providers[0];
    var models = curProv ? curProv.activeModels : [];
    html += '<select class="vpm-select vpm-select-sm vpm-ai-model-select" data-action-id="' + esc(actionId) + '">';
    for (var j = 0; j < models.length; j++) { var m = models[j]; html += '<option value="' + esc(m.id) + '"' + (sel && sel.model === m.id ? ' selected' : '') + ' data-temp="' + (m.temperature !== undefined ? m.temperature : 1.0) + '" data-tokens="' + (m.max_tokens || 8192) + '">' + esc(m.label || m.id) + '</option>'; }
    html += '</select></span>';
    return html;
  }

  function _getSelFromPicker(actionId) {
    var $prov = $('.vpm-ai-provider-select[data-action-id="' + actionId + '"]');
    if (!$prov.length) return resolveSelection(actionId);
    var pid = $prov.val(), mid = $('.vpm-ai-model-select[data-action-id="' + actionId + '"]').val();
    var $opt = $('.vpm-ai-model-select[data-action-id="' + actionId + '"] option:selected');
    return { provider: pid, model: mid, temperature: parseFloat($opt.data('temp')) || 1.0, max_tokens: parseInt($opt.data('tokens'), 10) || 8192, api_key: _providerMap[pid] ? _providerMap[pid].api_key : '' };
  }

  function callAI(prompt, onSuccess, onError, actionId, systemPrompt, overrides) {
    var cfg = _getSelFromPicker(actionId || '');
    if (!cfg || !cfg.api_key) { if (onError) onError('No AI configured. Add API keys in Settings \u2192 AI Providers.'); return; }
    if (overrides) { for (var ok in overrides) cfg[ok] = overrides[ok]; }
    var provider = cfg.provider, model = cfg.model, apiKey = cfg.api_key;
    var endpoint = AI_ENDPOINTS[provider]; if (!endpoint) { if (onError) onError('Unknown provider'); return; }
    systemPrompt = systemPrompt || '';
    var body, headers;
    switch (provider) {
      case 'gemini':
        endpoint = endpoint.replace('{MODEL}', model) + '?key=' + apiKey;
        headers = { 'Content-Type': 'application/json' };
        body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: cfg.max_tokens, temperature: cfg.temperature, topP: 0.95, responseMimeType: 'application/json' } };
        if (systemPrompt) body.system_instruction = { parts: [{ text: systemPrompt }] };
        break;
      case 'claude':
        headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
        body = { model: model, max_tokens: cfg.max_tokens, messages: [{ role: 'user', content: prompt }] };
        if (cfg.temperature !== undefined) body.temperature = cfg.temperature;
        if (systemPrompt) body.system = systemPrompt;
        break;
      default:
        headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey };
        if (provider === 'openrouter') { headers['HTTP-Referer'] = window.location.origin; headers['X-Title'] = 'VPM Video Production'; }
        body = { model: model, max_tokens: cfg.max_tokens, messages: [{ role: 'user', content: prompt }], temperature: cfg.temperature };
        if (systemPrompt) body.messages = [{ role: 'system', content: systemPrompt }].concat(body.messages);
        if (provider === 'groq' && body.temperature === 0) body.temperature = 0.01;
    }
    var fetchOpts = { method: 'POST', headers: headers, body: JSON.stringify(body) };
    if (_aiAbortController && _aiAbortController.signal) fetchOpts.signal = _aiAbortController.signal;
    fetch(endpoint, fetchOpts)
      .then(function(res) { if (!res.ok) return res.text().then(function(t) { var m = 'API ' + res.status; try { m = JSON.parse(t).error.message || m; } catch(e) {} throw new Error(m); }); return res.json(); })
      .then(function(data) {
        var text = _extractText(provider, data);
        console.log('[VPM] AI (' + provider + '/' + model + '):', text.substring(0, 200));
        if (actionId) savePreference(actionId, provider, model);
        _hideAIProgress();
        if (onSuccess) onSuccess(text);
      })
      .catch(function(err) {
        _hideAIProgress();
        if (err.name === 'AbortError') { console.log('[VPM] AI call aborted'); return; }
        console.error('[VPM] AI error:', err);
        if (onError) onError(err.message || 'Request failed');
      });
  }

  function _extractText(provider, data) {
    try {
      if (provider === 'gemini') return (data.candidates && data.candidates[0] && data.candidates[0].content) ? data.candidates[0].content.parts.map(function(p) { return p.text || ''; }).join('') : JSON.stringify(data);
      if (provider === 'claude') return data.content ? data.content.filter(function(c) { return c.type === 'text'; }).map(function(c) { return c.text; }).join('') : '';
      return (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content || '' : '';
    } catch(e) { return JSON.stringify(data); }
  }

  return { init: init, reinit: reinit, isConfigured: isConfigured, getActiveProviders: getActiveProviders, getActiveModels: getActiveModels, getDefault: getDefault, resolveSelection: resolveSelection, savePreference: savePreference, renderInlinePicker: renderInlinePicker, callAI: callAI };
})();


// ============================================================
// SECTION 4: AI ACTION SYSTEM — Registry, Preflight, Progress
// ============================================================

var AI_ACTIONS = {
  'analyze-idea':         { label: 'Analyze Video Idea',         icon: 'lightbulb',           size: 'big' },
  'generate-research':    { label: 'Generate Research Brief',    icon: 'magnifying-glass',    size: 'big' },
  'generate-blueprint':   { label: 'Generate Blueprint',         icon: 'compass-drafting',    size: 'big' },
  'generate-script':      { label: 'Generate Script',            icon: 'file-lines',          size: 'big' },
  'enhance-script':       { label: 'Enhance Script Section',     icon: 'wand-magic-sparkles', size: 'small' },
  'generate-clips':       { label: 'Generate Clip Breakdown',    icon: 'clapperboard',        size: 'big' },
  'analyze-studio':       { label: 'Analyze Studio Needs',       icon: 'palette',             size: 'big' },
  'generate-scenes':      { label: 'Generate Scenes',            icon: 'image',               size: 'big' },
  'generate-prompt':      { label: 'Generate Image Prompt',      icon: 'image',               size: 'small' },
  'generate-video':       { label: 'Generate Video Prompt',      icon: 'film',                size: 'small' },
  'improve-brief':        { label: 'Improve Production Brief',   icon: 'clipboard-list',      size: 'small' },
  'generate-metadata':    { label: 'Generate YouTube Metadata',  icon: 'youtube',             size: 'big' },
  'generate-chapters':    { label: 'Generate Chapters',          icon: 'clock',               size: 'small' },
  'generate-thumbnails':  { label: 'Generate Thumbnail Ideas',   icon: 'image',               size: 'big' },
  'regen-research':       { label: 'Regenerate Research Section', icon: 'magnifying-glass',   size: 'small' },
  'regen-thumbnail':      { label: 'Regenerate Thumbnail Idea',  icon: 'image',               size: 'small' },
  'extract-preferences':  { label: 'Extract Preferences from Idea', icon: 'wand-magic-sparkles', size: 'big' }
};

var _aiProgressActive = false, _aiProgressTimer = null, _aiProgressStartTime = 0, _aiAbortController = null;

function _openAIActionModal(actionId, context, onConfirm) {
  var action = AI_ACTIONS[actionId] || { label: actionId, icon: 'sparkles' };
  var stg = (S.meta && S.meta.settings) || {};
  if (!stg.show_ai_preflight) { var li = ((S.meta.aiPreferences || {}).lastCustomInstructions || {})[actionId] || ''; onConfirm(li); return; }
  if (!LLMService.isConfigured()) { toast('No AI configured. Add API keys in Settings \u2192 AI Providers.', 'warning'); return; }
  var lastInstr = ((S.meta.aiPreferences || {}).lastCustomInstructions || {})[actionId] || '';
  var globalInstr = stg.ai_global_instructions || '';
  var html = '<div class="vpm-ai-preflight">';
  html += '<div class="vpm-ai-preflight-header"><div class="vpm-ai-preflight-icon">' + icon(action.icon) + '</div>';
  html += '<div><div class="vpm-ai-preflight-title">' + esc(action.label) + '</div></div></div>';
  if (context) html += '<div class="vpm-ai-preflight-ctx"><span class="vpm-text-xs vpm-text-muted">' + icon('info') + ' ' + esc(context) + '</span></div>';
  if (globalInstr) html += '<div class="vpm-ai-preflight-global">' + icon('globe') + ' <span class="vpm-text-xs vpm-text-muted">' + esc(truncate(globalInstr, 120)) + '</span></div>';
  html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('robot') + ' AI Model</label>' + LLMService.renderInlinePicker(actionId) + '</div>';
  html += '<div class="vpm-form-group"><label class="vpm-form-label">' + icon('pen') + ' Custom Instructions <span class="vpm-text-muted" style="font-weight:400">(optional)</span></label>';
  html += '<textarea class="vpm-textarea" id="vpmAICustomInstr" rows="3" placeholder="e.g. Focus on beginners, keep tone casual\u2026">' + esc(lastInstr) + '</textarea></div>';
  html += '</div>';
  openModal(action.label, html, { size: 'md', saveLabel: icon('sparkles') + ' Generate', onSave: function() {
    var ci = ($('#vpmAICustomInstr').val() || '').trim();
    S.meta.aiPreferences = S.meta.aiPreferences || {};
    S.meta.aiPreferences.lastCustomInstructions = S.meta.aiPreferences.lastCustomInstructions || {};
    S.meta.aiPreferences.lastCustomInstructions[actionId] = ci;
    // CRITICAL: Save the selected provider/model BEFORE modal closes (fixes model switching bug)
    var $prov = $('.vpm-ai-provider-select[data-action-id="' + actionId + '"]');
    var $model = $('.vpm-ai-model-select[data-action-id="' + actionId + '"]');
    if ($prov.length && $prov.val()) {
      LLMService.savePreference(actionId, $prov.val(), $model.val() || '');
    }
    syncToTextarea(); closeModal();
    onConfirm(ci);
  }});
}

function _showAIProgress(actionId, isBig) {
  _hideAIProgress();
  var action = AI_ACTIONS[actionId] || { label: actionId, icon: 'sparkles' };
  _aiProgressActive = true; _aiProgressStartTime = Date.now();
  _aiAbortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var html = '<div class="vpm-ai-overlay' + (isBig ? ' vpm-ai-overlay-full' : ' vpm-ai-overlay-inline') + '" id="vpmAIOverlay">';
  html += '<div class="vpm-ai-overlay-inner"><div class="vpm-ai-spinner"></div>';
  html += '<div class="vpm-ai-overlay-label">' + esc(action.label) + '</div>';
  html += '<div class="vpm-ai-overlay-timer" id="vpmAITimer">Working\u2026 0s</div>';
  html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="cancel-ai">' + icon('xmark') + ' Cancel</button>';
  html += '</div></div>';
  if (isBig) $('body').append(html);
  else { var $c = $('#vpmContent'); if ($c.length) { $c.css('position', 'relative'); $c.append(html); } else $('body').append(html); }
  _aiProgressTimer = setInterval(function() { var e = Math.floor((Date.now() - _aiProgressStartTime) / 1000); $('#vpmAITimer').text('Working\u2026 ' + e + 's'); }, 1000);
  setTimeout(function() { $('#vpmAIOverlay').addClass('vpm-ai-overlay-visible'); }, 10);
}

function _hideAIProgress() {
  _aiProgressActive = false;
  if (_aiProgressTimer) { clearInterval(_aiProgressTimer); _aiProgressTimer = null; }
  var $o = $('#vpmAIOverlay');
  if ($o.length) { $o.removeClass('vpm-ai-overlay-visible'); setTimeout(function() { $o.remove(); $('#vpmContent').css('position', ''); }, 200); }
  _aiAbortController = null;
}

function _cancelAI() { if (_aiAbortController) { try { _aiAbortController.abort(); } catch(e) {} } _hideAIProgress(); toast('AI action cancelled', 'info'); }

function _buildCustomBlock(actionId, ci) {
  var parts = [];
  var gi = ((S.meta && S.meta.settings) || {}).ai_global_instructions || '';
  if (gi) parts.push('--- GLOBAL INSTRUCTIONS ---\n' + gi);
  if (ci) parts.push('--- CUSTOM INSTRUCTIONS ---\n' + ci);
  return parts.length ? '\n\n' + parts.join('\n\n') : '';
}

function _launchAI(actionId, ctx, fn) { _openAIActionModal(actionId, ctx, function(ci) { fn(ci); }); }

// --- Auto-retry AI call wrapper ---
// First attempt: normal call. If parseAIResponse fails, retry once with strict JSON-only prompt.
function _callAIWithRetry(prompt, systemPrompt, actionId, progressId, isBig, onParsed, requiredKeys, opts) {
  opts = opts || {};
  _showAIProgress(progressId || actionId, isBig);
  LLMService.callAI(prompt, function(text) {
    var r = parseJSON(text);
    if (r && _hasRequiredKeys(r, requiredKeys)) { onParsed(r); return; }
    // Retry with strict prompt
    console.warn('[VPM] Parse failed on first attempt, retrying with strict prompt. Raw:', text ? text.substring(0, 300) : '(empty)');
    var retryPrompt = 'CRITICAL: The previous response was not valid JSON. Return ONLY a valid JSON object. No explanation, no markdown, no text before or after the JSON.\n\n' + prompt;
    LLMService.callAI(retryPrompt, function(text2) {
      var r2 = parseJSON(text2);
      if (r2 && _hasRequiredKeys(r2, requiredKeys)) { onParsed(r2); return; }
      // Both attempts failed
      console.error('[VPM] Parse failed after retry. Raw:', text2 ? text2.substring(0, 500) : '(empty)');
      toast('AI returned unparseable response. Check console for raw output.', 'error');
    }, function(err) { toast('AI retry error: ' + err, 'error'); }, actionId, systemPrompt, opts);
  }, function(err) { toast('AI error: ' + err, 'error'); }, actionId, systemPrompt, opts);
}

function _hasRequiredKeys(obj, keys) {
  if (!keys || !keys.length) return !!obj;
  for (var i = 0; i < keys.length; i++) {
    var val = obj[keys[i]];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val) && val.length === 0) return false;
  }
  return true;
}

// Normalize AI response shape: handles {sections:[...]}, {script:{sections:[...]}}, or [...]
function _extractArray(result, key) {
  if (!result) return null;
  // Direct key
  if (result[key] && Array.isArray(result[key])) return result[key];
  // Nested one level: {script: {sections: [...]}}
  for (var k in result) {
    if (result[k] && typeof result[k] === 'object' && result[k][key] && Array.isArray(result[k][key])) return result[k][key];
  }
  // Root is array
  if (Array.isArray(result)) return result;
  return null;
}

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.llmService = LLMService;
  window._vpm.aiActions = {
    AI_ACTIONS: AI_ACTIONS,
    _openAIActionModal: _openAIActionModal,
    _showAIProgress: _showAIProgress,
    _hideAIProgress: _hideAIProgress,
    _cancelAI: _cancelAI,
    _buildCustomBlock: _buildCustomBlock,
    _launchAI: _launchAI,
    _callAIWithRetry: _callAIWithRetry,
    _hasRequiredKeys: _hasRequiredKeys,
    _extractArray: _extractArray
  };
})(jQuery, Drupal);


/* ===== src/ai/contexts.js ===== */
/**
 * VPM AI Context Builders
 *
 * Pure-ish functions that format S.data.* into prompt-friendly text blocks
 * (video context, script context, clip context, scene context). These are
 * concatenated into prompts in src/ai/vpm-part2b.js (the various generate*
 * action functions).
 *
 * Registers on:
 *   - window._vpm.buildVoiceDescription   (also used by VEO 3.1 prompt template)
 *   - window._vpm.contexts                ({ buildVideoContext, buildScriptContext,
 *                                            buildClipContext, buildSceneContext })
 *
 * Reads from window (set by earlier modules):
 *   - window._vpmState          (S)
 *   - window._vpmConstants      (Constants)
 *   - window._vpmStripHtml      (stripHtml helper from part1)
 *   - window._vpmFormatDurationLong  (formatDurationLong from part1)
 *   - window._vpmResolveVoiceProfile (resolveVoiceProfile from part1)
 *
 * MUST load AFTER vpm-part1.js (deps) and BEFORE vpm-part2b.js (consumer).
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var stripHtml = window._vpmStripHtml;
  var formatDurationLong = window._vpmFormatDurationLong;

  // --- Voice description builder ---
  function _buildVoiceDescription(vp) {
    if (!vp) return '';
    var parts = [];
    if (vp.gender) parts.push(vp.gender);
    if (vp.age_range) parts.push(vp.age_range.replace(/-/g, ' '));
    if (vp.style) parts.push(vp.style + ' tone');
    if (vp.accent && vp.accent !== 'neutral') parts.push(vp.accent + ' accent');
    if (vp.custom_description) parts.push(vp.custom_description);
    return parts.join(', ') || 'natural, clear voice';
  }

  function buildVideoContext() {
    var v = S.data.video || {}; var st = S.data.start || {};
    var prefs = st.preferences || {};
    var lines = ['--- VIDEO CONTEXT ---'];
    if (v.title) lines.push('Title: ' + v.title);
    if (st.raw_input) lines.push('Idea: ' + st.raw_input);
    if (prefs.language) lines.push('Language: ' + ((Constants.LANGUAGES[prefs.language] || {}).label || prefs.language));
    if (prefs.platform) lines.push('Platform: ' + ((Constants.PLATFORMS[prefs.platform] || {}).label || prefs.platform));
    if (prefs.aspect_ratio) lines.push('Aspect ratio: ' + prefs.aspect_ratio);
    if (prefs.target_duration) lines.push('Target duration: ' + formatDurationLong(prefs.target_duration));
    if (prefs.production_mode) lines.push('Production mode: ' + ((Constants.PRODUCTION_MODES[prefs.production_mode] || {}).label || prefs.production_mode));
    if (prefs.presenter_preference) lines.push('Presenter: ' + ((Constants.PRESENTER_PREFS[prefs.presenter_preference] || {}).label || prefs.presenter_preference));
    // Video style
    if (prefs.video_style) {
      var styleDef = (Constants.VIDEO_STYLES || {})[prefs.video_style] || {};
      lines.push('Video style: ' + (styleDef.label || prefs.video_style));
      if (styleDef.promptHint) lines.push('Style keywords: ' + styleDef.promptHint);
    }
    // Audio mode
    if (prefs.audio_mode) {
      var audioLabel = ((Constants.AUDIO_MODES || {})[prefs.audio_mode] || {}).label || prefs.audio_mode;
      lines.push('Audio mode: ' + audioLabel);
    }
    // Seedance audio direction (campaign-level, Seedance 2.0)
    if (prefs.seedance_audio_direction) {
      var sadDef = ((Constants.SEEDANCE_AUDIO_DIRECTIONS || {})[prefs.seedance_audio_direction] || {});
      lines.push('Seedance audio direction: ' + (sadDef.label || prefs.seedance_audio_direction));
    }
    var bp = S.data.blueprint || {};
    if (bp.tone) lines.push('Tone: ' + bp.tone);
    if (bp.target_audience) lines.push('Audience: ' + bp.target_audience);
    return lines.join('\n');
  }

  function buildScriptContext() {
    var sc = S.data.script || {};
    var lines = ['--- SCRIPT ---'];
    var secs = sc.sections || [];
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].content) lines.push(secs[i].label.toUpperCase() + ': ' + stripHtml(secs[i].content));
    }
    return lines.join('\n');
  }

  function buildClipContext(clip) {
    var lines = ['--- CLIP ---'];
    lines.push('Title: ' + (clip.title || '')); lines.push('Type: ' + ((Constants.CLIP_TYPES[clip.type] || {}).label || clip.type));
    lines.push('Track: ' + (clip.track || 'ai')); lines.push('Duration: ' + (clip.duration || 8) + 's');
    if (clip.script_text) lines.push('Script: ' + clip.script_text);
    if (clip.visual_direction) lines.push('Visual: ' + clip.visual_direction);
    // AI Character: the character IS the narrator/speaker
    if (clip.type === 'ai-character') {
      lines.push('');
      lines.push('NARRATOR ROLE: The AI character IS the presenter/narrator. They speak the script text directly on camera.');
      lines.push('The character must be shown speaking — lip movements match the speech. This is NOT a voiceover.');
      var _acLookIds = (((clip.prompt_set || {}).first_frame || {}).scene || {}).look_ids || [];
      if (_acLookIds.length && S.lookMap) {
        var _acLook = S.lookMap[_acLookIds[0]];
        if (_acLook) {
          lines.push('Character: ' + (_acLook.name || 'Unnamed'));
          if (_acLook.combined_prompt_fragment) lines.push('Appearance: ' + _acLook.combined_prompt_fragment);
          var _acVp = (window._vpmResolveVoiceProfile ? window._vpmResolveVoiceProfile(clip) : null) || {};
          if (_acVp.style || _acVp.custom_description) lines.push('Voice: ' + _buildVoiceDescription(_acVp));
        }
      }
    }
    return lines.join('\n');
  }

  function buildSceneContext(clip) {
    var ps = clip.prompt_set || {}; var ff = ps.first_frame || {}; var scene = ff.scene || {};
    var lines = ['--- SCENE ---'];

    // Seedance assets path: ingredients-to-video clips store character+environments in ps.video.seedance_assets
    var _sa = (ps.video || {}).seedance_assets || {};
    var _saHasData = _sa.character_look_id || ((_sa.env_ids || []).some(function (id) { return !!id; }));
    if (_saHasData) {
      if (_sa.character_look_id && S.lookMap) {
        var _saLook = S.lookMap[_sa.character_look_id];
        if (_saLook) lines.push('Character Look: ' + _saLook.name + (_saLook.combined_prompt_fragment ? ' — ' + _saLook.combined_prompt_fragment : ''));
      }
      var _saEnvIds = _sa.env_ids || [];
      for (var _sei = 0; _sei < _saEnvIds.length; _sei++) {
        if (!_saEnvIds[_sei]) continue;
        var _seEnv = S.envMap ? S.envMap[_saEnvIds[_sei]] : null;
        if (_seEnv) lines.push('Environment ' + (_sei + 1) + ': ' + _seEnv.name + (_seEnv.prompt_fragment ? ' — ' + _seEnv.prompt_fragment : ''));
      }
      return lines.join('\n');
    }

    // Frames-to-video path: look up via first_frame.scene (scene template or direct look/env)
    var _sceneResolved = false;
    if (scene.scene_template_id) {
      var sc = S.sceneMap ? S.sceneMap[scene.scene_template_id] : null;
      if (sc) {
        _sceneResolved = true;
        lines.push('Scene: ' + sc.name);
        var lids = sc.look_ids || (sc.looks ? sc.looks.map(function (l) { return l.look_id; }) : []);
        for (var i = 0; i < lids.length; i++) { var lk = S.lookMap[lids[i]]; if (lk) lines.push('Look: ' + lk.name + (lk.combined_prompt_fragment ? ' — ' + lk.combined_prompt_fragment : '')); }
        var env = sc.environment_id ? S.envMap[sc.environment_id] : null;
        if (env) lines.push('Environment: ' + env.name + (env.prompt_fragment ? ' — ' + env.prompt_fragment : ''));
      }
    }
    // Fallback: direct look_ids / environment_id (no scene template or template not found)
    if (!_sceneResolved) {
      var _directLookIds = scene.look_ids || [];
      for (var _dli = 0; _dli < _directLookIds.length; _dli++) {
        var _dlk = S.lookMap ? S.lookMap[_directLookIds[_dli]] : null;
        if (_dlk) lines.push('Look: ' + _dlk.name + (_dlk.combined_prompt_fragment ? ' — ' + _dlk.combined_prompt_fragment : ''));
      }
      var _directEnv = scene.environment_id ? (S.envMap ? S.envMap[scene.environment_id] : null) : null;
      if (_directEnv) lines.push('Environment: ' + _directEnv.name + (_directEnv.prompt_fragment ? ' — ' + _directEnv.prompt_fragment : ''));
    }
    return lines.join('\n');
  }

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.buildVoiceDescription = _buildVoiceDescription;
  window._vpm.contexts = {
    buildVideoContext: buildVideoContext,
    buildScriptContext: buildScriptContext,
    buildClipContext: buildClipContext,
    buildSceneContext: buildSceneContext
  };
})();


/* ===== src/ai/prompt-templates/seedance.js ===== */
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


/* ===== src/ai/prompt-templates/veo-3.1.js ===== */
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


/* ===== src/ai/prompt-templates/kling.js ===== */
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


/* ===== src/ai/prompt-templates/runway.js ===== */
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


/* ===== src/ai/generate-prompt.js ===== */
/**
 * generateVideoPrompt — core video prompt generator
 *
 * Branches on the active model (Seedance plain-text vs structured JSON for VEO 3.1
 * and others). Builds the prompt body, calls the model-specific
 * formatVideoPromptGuidance(), then dispatches to LLMService.callAI().
 *
 * Registers on: window._vpm.generateVideoPrompt
 * Invoked by part2b's click handler for [data-action="generate-video-prompt"]
 * (which now calls window._vpm.generateVideoPrompt(...) directly).
 *
 * Dependencies (captured at parse time from window):
 *   - window._vpmState                       (S)
 *   - window._vpmConstants                   (Constants — VIDEO_MODELS, MOTION_STRENGTHS, …)
 *   - window._vpm.promptTemplates            (PROMPT_TEMPLATES registry)
 *   - window._vpm.llmService                 (LLMService)
 *   - window._vpm.contexts                   (buildVideoContext, buildClipContext, buildSceneContext)
 *   - window._vpm.aiActions                  (_buildCustomBlock, _showAIProgress)
 *   - window._vpmToast, _vpmLogActivity,
 *     _vpmParseJSON, _vpmBuildMaps,
 *     _vpmSyncToTextarea, _vpmRender,
 *     _vpmSnapshot                            (utility callbacks from part1/part2a)
 *
 * MUST load AFTER llm-service.js, contexts.js, and prompt-templates/*.js;
 * loads BEFORE vpm-part2b.js so part2b can capture generateVideoPrompt as a local.
 */
(function () {
  'use strict';

  var S = window._vpmState;
  var Constants = window._vpmConstants;
  var PROMPT_TEMPLATES = (window._vpm && window._vpm.promptTemplates) || {};
  var LLMService = window._vpm && window._vpm.llmService;
  var _ctxMod = window._vpm && window._vpm.contexts || {};
  var buildVideoContext = _ctxMod.buildVideoContext;
  var buildClipContext = _ctxMod.buildClipContext;
  var buildSceneContext = _ctxMod.buildSceneContext;
  var _aaMod = window._vpm && window._vpm.aiActions || {};
  var _buildCustomBlock = _aaMod._buildCustomBlock;
  var _showAIProgress = _aaMod._showAIProgress;

  // Inlined locally so this file does not depend on part2b loading first.
  function _ensureString(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (val.content) return _ensureString(val.content);
      if (val.text) return _ensureString(val.text);
      try { return JSON.stringify(val, null, 2); } catch (e) { return String(val); }
    }
    return String(val);
  }

  // VIDEO_GEN_MODES — labels for the 3 generation modes (kept here so this file
  // is self-contained; the same constant is also on Constants.VIDEO_GEN_MODES).
  var VIDEO_GEN_MODES = (Constants && Constants.VIDEO_GEN_MODES) || {};

  function generateVideoPrompt(clipId, actionId, ci) {
    var toast = window._vpmToast;
    var parseJSON = window._vpmParseJSON;
    var logActivity = window._vpmLogActivity;
    var buildMaps = window._vpmBuildMaps;
    var syncToTextarea = window._vpmSyncToTextarea;
    var render = window._vpmRender;
    var snapshot = window._vpmSnapshot;

    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
    var ps = clip.prompt_set; var ff = ps.first_frame || {};
    var lf = ps.last_frame || {};

    // Resolve model and preferences
    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = prefs.primary_video_model || (S.meta.aiPreferences || {}).videoModel || 'seedance';
    var modelTemplate = PROMPT_TEMPLATES[videoModel] || {};
    var audioMode = prefs.audio_mode || 'ai-audio-with-video';
    var _modelDefaultGenMode = (Constants.VIDEO_MODELS[videoModel] || {}).defaultGenMode || 'frames-to-video';
    var genMode = (ps.video || {}).gen_mode || _modelDefaultGenMode;
    var isSeedance = (videoModel === 'seedance');

    var sp = isSeedance
      ? 'You are an expert Seedance 2.0 video generation prompt engineer. Generate the complete 7-section Seedance prompt as plain text. Output plain text only — no JSON, no markdown, no code blocks, no commentary outside the prompt.'
      : 'You are an expert video generation prompt engineer specializing in ' + ((Constants.VIDEO_MODELS[videoModel] || {}).label || videoModel) + '. Generate a complete, detailed, structured video generation prompt. Output JSON only — no commentary.';

    // Build comprehensive prompt
    var prompt = 'Generate a COMPLETE structured video generation prompt for a ' + (clip.duration || 8) + 's video clip.\n\n';

    // Video generation mode context
    prompt += '--- GENERATION MODE: ' + (VIDEO_GEN_MODES[genMode] || {}).label + ' ---\n';
    if (genMode === 'frames-to-video') {
      prompt += 'This video is generated from reference frame images. The first frame image is the starting point.\n';
      if ((ff.prompt || {}).positive) prompt += 'First frame description: ' + ff.prompt.positive + '\n';
      if (lf && (lf.prompt || {}).positive) prompt += 'Last frame description: ' + lf.prompt.positive + '\n';
      if (ff.image_url) prompt += 'First frame image will be provided as reference.\n';
      if (lf && lf.image_url) prompt += 'Last frame image will be provided as reference.\n';
    } else if (genMode === 'text-to-video') {
      prompt += 'This video is generated purely from text — no reference images. The prompt must be extremely detailed and descriptive.\n';
    } else if (genMode === 'ingredients-to-video') {
      prompt += 'This video is composed from ingredient images (characters, environments, objects). The prompt must describe how to combine these ingredients into a coherent scene.\n';
      // Read seedance_assets (new Studio-linked system) first
      var _gvpSa = (ps.video || {}).seedance_assets || {};
      var _gvpSaHasData = _gvpSa.character_look_id || ((_gvpSa.env_ids || []).some(function (id) { return !!id; }));
      if (_gvpSaHasData) {
        prompt += 'Ingredient images (from Studio assets):\n';
        if (_gvpSa.character_look_id && S.lookMap) {
          var _gvpLk = S.lookMap[_gvpSa.character_look_id];
          if (_gvpLk) prompt += '- CHARACTER: ' + _gvpLk.name + (_gvpLk.combined_prompt_fragment ? ' — ' + _gvpLk.combined_prompt_fragment : '') + '\n';
        }
        var _gvpEnvIds = _gvpSa.env_ids || [];
        for (var _gvpEi = 0; _gvpEi < _gvpEnvIds.length; _gvpEi++) {
          if (!_gvpEnvIds[_gvpEi]) continue;
          var _gvpEnv = S.envMap ? S.envMap[_gvpEnvIds[_gvpEi]] : null;
          if (_gvpEnv) prompt += '- ENVIRONMENT ' + (_gvpEi + 1) + ': ' + _gvpEnv.name + ' (' + (_gvpEnv.type || 'indoor') + ')' + (_gvpEnv.prompt_fragment ? ' — ' + _gvpEnv.prompt_fragment : '') + '\n';
        }
      }
      // Also include legacy ingredients array (backward compat)
      var ingredients = (ps.video || {}).ingredients || [];
      if (ingredients.length) {
        if (_gvpSaHasData) prompt += 'Additional ingredients:\n';
        else prompt += 'Ingredient images:\n';
        for (var ing = 0; ing < ingredients.length; ing++) {
          prompt += '- ' + (ingredients[ing].label || 'Ingredient ' + (ing + 1)) + ': ' + (ingredients[ing].description || '') + '\n';
        }
      }
    }

    prompt += '\n' + buildVideoContext();
    prompt += '\n\n' + buildClipContext(clip);
    prompt += '\n' + buildSceneContext(clip);

    // AI Character speaking reinforcement
    if (clip.type === 'ai-character') {
      prompt += '\n\n=== CRITICAL: AI CHARACTER IS THE SPEAKER ===\n';
      prompt += 'The character described above IS the narrator/presenter. They speak the script text directly to camera.\n';
      prompt += 'The visual_prompt MUST show the character speaking/presenting on camera. Lip movements MUST sync with the speech audio.\n';
      prompt += 'Do NOT use a disembodied voiceover — the on-screen character IS speaking these words.\n';
    }

    var pc = clip.production_config || {};
    prompt += '\nMotion intensity: ' + ((Constants.MOTION_STRENGTHS[pc.motion_strength] || {}).label || 'medium');
    prompt += '\nCamera movement: ' + ((Constants.CAMERA_MOVEMENTS[pc.camera_movement] || {}).label || 'slow-zoom');
    prompt += '\nTransition: ' + ((Constants.TRANSITION_STYLES[pc.transition_style] || {}).label || 'smooth-dissolve');

    // Video style
    var vs = prefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    if (vs && vsDef.promptHint) prompt += '\nVideo style: ' + vsDef.label + ' — ' + vsDef.promptHint;

    // Model-specific guidance
    if (modelTemplate.formatVideoPromptGuidance) {
      prompt += '\n\n' + modelTemplate.formatVideoPromptGuidance(clip, {});
    }

    prompt += _buildCustomBlock(actionId, ci);

    // Model-specific output format
    if (isSeedance) {
      prompt += '\n\nGenerate the complete Seedance 2.0 prompt now. Use the 7-section structure. Plain text only — begin with the HEADER line:';
    } else {
      var outFmt = modelTemplate.getOutputFormat ? modelTemplate.getOutputFormat(audioMode) : JSON.stringify({
        visual_prompt: 'Detailed visual description',
        motion_description: 'Motion description',
        camera: 'Camera work',
        style: 'Style keywords',
        negative_prompt: 'What to avoid'
      }, null, 2);
      prompt += '\n\nGenerate COMPLETE and DETAILED JSON:\n' + outFmt;
    }

    _showAIProgress('generate-video', false);
    LLMService.callAI(prompt, function (text) {
      try {
        ps.video = ps.video || {}; ps.video.prompt = ps.video.prompt || {};

        if (isSeedance) {
          // Seedance: plain text response — store directly, no JSON parsing
          var rawText = (text || '').trim();
          ps.video.prompt.seedance_prompt = rawText;
          // Populate visual_prompt/positive for display compatibility (first non-empty line as summary)
          var firstLine = '';
          var rawLines = rawText.split('\n');
          for (var rl = 0; rl < rawLines.length; rl++) {
            if (rawLines[rl].trim() && rawLines[rl].indexOf('===') === -1) { firstLine = rawLines[rl].trim(); break; }
          }
          ps.video.prompt.visual_prompt = firstLine || rawText.substring(0, 200);
          ps.video.prompt.positive = ps.video.prompt.visual_prompt;
          ps.video.prompt.duration = (clip.duration || 10) + 's';
          ps.video.prompt.status = 'generated';
          ps.video.prompt.model = videoModel;
          ps.video.prompt.gen_mode = genMode;
        } else {
          // All other models: JSON parsing (existing logic)
          var r = parseJSON(text);
          if (!r) { toast('Could not parse', 'error'); return; }
          // Store structured prompt fields
          ps.video.prompt.visual_prompt = _ensureString(r.visual_prompt || r.positive || '');
          ps.video.prompt.positive = _ensureString(r.visual_prompt || r.positive || ''); // backward compat
          ps.video.prompt.motion_description = _ensureString(r.motion_description || r.motion || '');
          ps.video.prompt.motion = _ensureString(r.motion_description || r.motion || ''); // backward compat
          ps.video.prompt.camera = _ensureString(r.camera || '');
          ps.video.prompt.style = _ensureString(r.style || '');
          ps.video.prompt.negative = _ensureString(r.negative_prompt || r.negative || '');
          ps.video.prompt.negative_prompt = _ensureString(r.negative_prompt || r.negative || '');
          ps.video.prompt.duration = (clip.duration || 8) + 's';
          ps.video.prompt.status = 'generated';
          ps.video.prompt.model = videoModel;
          ps.video.prompt.gen_mode = genMode;
          // Store audio data if present (VEO 3.1 with ai-audio-with-video)
          if (r.audio && typeof r.audio === 'object') {
            ps.video.prompt.audio = {
              speech: _ensureString(r.audio.speech || ''),
              voice_description: _ensureString(r.audio.voice_description || r.audio.voice || ''),
              ambient: _ensureString(r.audio.ambient || ''),
              music: _ensureString(r.audio.music || ''),
              sound_effects: _ensureString(r.audio.sound_effects || '')
            };
          }
        }

        logActivity('video_prompt_generated', 'Clip ' + clip.order + ': Video prompt (' + ((Constants.VIDEO_MODELS[videoModel] || {}).label || videoModel) + ', ' + genMode + ')');
        if (snapshot) snapshot('Video prompt'); buildMaps(); syncToTextarea(); render();
        toast('Video prompt ready!', 'success');
      } catch (e) { toast('Parse error: ' + e.message, 'error'); }
    }, function (err) { toast('AI error: ' + err, 'error'); }, 'generate-video', sp);
  }

  // ============================================================
  // EXPORTS
  // ============================================================
  window._vpm = window._vpm || {};
  window._vpm.generateVideoPrompt = generateVideoPrompt;
})();


/* ===== src/ai/vpm-part2b.js ===== */
/**
 * AI Video Production Manager v1.0 - Part 2B: AI & Settings Engine
 *
 * LLMService (8 providers), BrandService, AI action system with preflight/progress,
 * 11 AI actions (research, script, clips, frames, video, studio, metadata, brief,
 * thumbnails, idea analysis, script enhancement), Settings view (5 tabs),
 * config import/export, keyboard shortcuts.
 *
 * @version 1.0.0
 */
(function($, Drupal) {
  'use strict';

  // ============================================================
  // SECTION 1: INIT & IMPORTS
  // ============================================================

  var S, render, navigateToStage, toast, generateId, buildMaps, syncToTextarea;
  var logActivity, esc, deepClone, icon, truncate, stripHtml, countWords;
  var formatDate, formatRelativeTime, formatDuration, formatDurationLong, formatNumber;
  var badge, statusBadge, clipTypeBadge, trackBadge, clipStatusBadge, sourceBadge, roleBadge, progressBar;
  var estimateDuration, parseJSON, getSmartClipDuration, getModelDurationConfig, snapToModelDuration, validateClipDuration;
  var canAccessStage, evaluateClipStatus, maybeAdvanceClipStatus, recomputeClipTimings, recomputeScriptDurations;
  var createDefaultClip, createLightweightClip, createEmptyPromptSet, createDefaultBodySection, createDefaultLook, createDefaultEnvironment, createDefaultScene;
  var ensurePromptSet, ensureNonAiPlanning, ensureProductionConfig, normalizeClipType, resolveSectionId, normalizeToHtml;
  var renderNavButtons, Constants, setNested;
  var snapshot, openModal, closeModal, collectModalFields, openConfirmDialog, copyToClipboard, exportFile;

  var _checkCount = 0;
  var checkInterval = setInterval(function() {
    _checkCount++;
    if (window._vpmState && window._vpmState.initialized && window._vpmPart2AReady) { clearInterval(checkInterval); initPart2B(); }
    else if (_checkCount > 250) {
      clearInterval(checkInterval);
      console.error('[VPM] Part 2B: Timed out. _vpmState:', !!window._vpmState, ', Part2AReady:', !!window._vpmPart2AReady);
    }
  }, 100);

  function initPart2B() {
    console.log('[VPM] Initializing Part 2B...');
    S = window._vpmState;
    render = window._vpmRender; navigateToStage = window._vpmNavigateToStage;
    toast = window._vpmToast; generateId = window._vpmGenerateId;
    buildMaps = window._vpmBuildMaps; syncToTextarea = window._vpmSyncToTextarea;
    logActivity = window._vpmLogActivity; esc = window._vpmEsc;
    deepClone = window._vpmDeepClone; icon = window._vpmIcon;
    truncate = window._vpmTruncate; stripHtml = window._vpmStripHtml; countWords = window._vpmCountWords;
    formatDate = window._vpmFormatDate; formatRelativeTime = window._vpmFormatRelativeTime;
    formatDuration = window._vpmFormatDuration; formatDurationLong = window._vpmFormatDurationLong;
    formatNumber = window._vpmFormatNumber; estimateDuration = window._vpmEstimateDuration;
    parseJSON = window._vpmParseJSON; getSmartClipDuration = window._vpmGetSmartClipDuration;
    getModelDurationConfig = window._vpmGetModelDurationConfig; snapToModelDuration = window._vpmSnapToModelDuration;
    validateClipDuration = window._vpmValidateClipDuration;
    badge = window._vpmBadge; statusBadge = window._vpmStatusBadge;
    clipTypeBadge = window._vpmClipTypeBadge; trackBadge = window._vpmTrackBadge;
    clipStatusBadge = window._vpmClipStatusBadge; sourceBadge = window._vpmSourceBadge; roleBadge = window._vpmRoleBadge;
    progressBar = window._vpmProgressBar;
    canAccessStage = window._vpmCanAccessStage;
    evaluateClipStatus = window._vpmEvaluateClipStatus; maybeAdvanceClipStatus = window._vpmMaybeAdvanceClipStatus;
    recomputeClipTimings = window._vpmRecomputeClipTimings; recomputeScriptDurations = window._vpmRecomputeScriptDurations;
    createDefaultClip = window._vpmCreateDefaultClip; createEmptyPromptSet = window._vpmCreateEmptyPromptSet;
    createLightweightClip = window._vpmCreateLightweightClip;
    ensurePromptSet = window._vpmEnsurePromptSet; ensureNonAiPlanning = window._vpmEnsureNonAiPlanning;
    ensureProductionConfig = window._vpmEnsureProductionConfig;
    normalizeClipType = window._vpmNormalizeClipType; resolveSectionId = window._vpmResolveSectionId;
    normalizeToHtml = window._vpmNormalizeToHtml;
    createDefaultBodySection = window._vpmCreateDefaultBodySection;
    createDefaultLook = window._vpmCreateDefaultLook; createDefaultEnvironment = window._vpmCreateDefaultEnvironment;
    createDefaultScene = window._vpmCreateDefaultScene;
    renderNavButtons = window._vpmRenderNavButtons; Constants = window._vpmConstants;
    setNested = window._vpmSetNested;
    snapshot = window._vpmSnapshot;
    openModal = window._vpmOpenModal; closeModal = window._vpmCloseModal;
    collectModalFields = window._vpmCollectModalFields; openConfirmDialog = window._vpmOpenConfirmDialog;
    copyToClipboard = window._vpmCopyToClipboard;
    exportFile = window._vpmExportFile;

    var R = window._vpmRenderers;
    R.settingsFull = renderSettingsView;

    LLMService.init();
    BrandService.init();
    setupPart2BEvents();
    setupKeyboardShortcuts();
    console.log('[VPM] Part 2B v1.0 initialized \u2014 AI: ' + (LLMService.isConfigured() ? 'configured' : 'none') + ', Brand: ' + (BrandService.isConfigured() ? 'yes' : 'no'));
  }


  // ============================================================
  // LLM Service + AI Action System (defined in src/ai/llm-service.js)
  // ============================================================
  var LLMService = window._vpm.llmService;
  var _aa = window._vpm.aiActions;
  var AI_ACTIONS = _aa.AI_ACTIONS;
  var _openAIActionModal = _aa._openAIActionModal;
  var _showAIProgress = _aa._showAIProgress;
  var _hideAIProgress = _aa._hideAIProgress;
  var _cancelAI = _aa._cancelAI;
  var _buildCustomBlock = _aa._buildCustomBlock;
  var _launchAI = _aa._launchAI;
  var _callAIWithRetry = _aa._callAIWithRetry;
  var _hasRequiredKeys = _aa._hasRequiredKeys;
  var _extractArray = _aa._extractArray;

  // ============================================================
  // BrandService (defined in src/ai/brand-service.js; reference captured here)
  // ============================================================
  var BrandService = window._vpm.brandService;


  // ============================================================
  // Context builders (defined in src/ai/contexts.js)
  // ============================================================
  var _ctxMod = window._vpm.contexts;
  var buildVideoContext = _ctxMod.buildVideoContext;
  var buildScriptContext = _ctxMod.buildScriptContext;
  var buildClipContext = _ctxMod.buildClipContext;
  var buildSceneContext = _ctxMod.buildSceneContext;
  // _buildVoiceDescription is exported by contexts.js as window._vpm.buildVoiceDescription
  var _buildVoiceDescription = window._vpm.buildVoiceDescription;

  // --- Video generation modes ---
  var VIDEO_GEN_MODES = {
    'frames-to-video':      { label: 'Frames to Video',      icon: 'images',              description: 'Generate video from first frame (and optional last frame) reference images' },
    'text-to-video':        { label: 'Text to Video',        icon: 'wand-magic-sparkles', description: 'Generate video purely from text prompt — no reference images needed' },
    'ingredients-to-video': { label: 'Ingredients to Video',  icon: 'layer-group',         description: 'Provide ingredient images (characters, environments, objects) and compose a video from them' }
  };

  // --- Model-specific prompt templates ---
  // Per-model templates live in src/ai/prompt-templates/*.js (seedance.js, veo-3.1.js, kling.js, runway.js).
  // They register themselves on window._vpm.promptTemplates before this file runs.
  var PROMPT_TEMPLATES = (window._vpm && window._vpm.promptTemplates) || {};


  // ============================================================
  // SECTION 6: AI — IDEA ANALYSIS
  // ============================================================

  // Extract video preferences from free-text input (or imported plan).
  // Calls the LLM with a strict JSON schema, then hands the parsed object
  // back to onResult so the caller can show a diff modal before applying.
  function extractPreferencesFromText(rawText, onResult) {
    var text = (rawText || '').trim();
    if (!text) { toast('Paste or describe your video idea first', 'warning'); return; }
    if (!LLMService.isConfigured()) {
      toast('Configure an AI provider in Settings to use auto-mapping', 'warning');
      return;
    }
    var sp = 'You extract structured video-production preferences from a short description. Return JSON only — no markdown, no prose.';
    var prompt = '';
    prompt += 'Read the description below and infer the user\'s video production preferences. For any field where the description is ambiguous or silent, return an empty string (or empty array). Do NOT invent confident values from thin air — be conservative.\n\n';
    prompt += 'DESCRIPTION:\n"""\n' + text + '\n"""\n\n';
    prompt += 'Allowed values:\n';
    prompt += '- language: ' + Object.keys(Constants.LANGUAGES).join(' | ') + '\n';
    prompt += '- platforms (array, 1+): ' + Object.keys(Constants.PLATFORMS).join(' | ') + '\n';
    prompt += '- aspect_ratio: ' + Object.keys(Constants.ASPECT_RATIOS).join(' | ') + '\n';
    prompt += '- target_duration (seconds, integer): typical 60–600\n';
    prompt += '- audio_mode: ' + Object.keys(Constants.AUDIO_MODES).join(' | ') + '\n';
    prompt += '- production_mode: ' + Object.keys(Constants.PRODUCTION_MODES).join(' | ') + '\n';
    prompt += '- presenter_preference: ' + Object.keys(Constants.PRESENTER_PREFS).join(' | ') + '\n';
    prompt += '- video_style: ' + Object.keys(Constants.VIDEO_STYLES).join(' | ') + '\n';
    prompt += '- tone: ' + Object.keys(Constants.TONES).join(' | ') + '\n';
    prompt += '- target_audience (free text, one short phrase)\n';
    prompt += '- title (free text, short and concrete)\n';
    prompt += '- description (one sentence)\n';
    prompt += '- keywords (array of short tags)\n\n';
    prompt += 'Return EXACTLY this JSON shape:\n';
    prompt += '{"language":"","platforms":[],"aspect_ratio":"","target_duration":0,"audio_mode":"","production_mode":"","presenter_preference":"","video_style":"","tone":"","target_audience":"","title":"","description":"","keywords":[]}';
    _callAIWithRetry(prompt, sp, 'extract-preferences', 'extract-preferences', true, function(r) {
      _hideAIProgress();
      try { onResult(r || {}); } catch (e) { console.error('[VPM] extract-preferences callback error:', e); }
    });
  }

  function analyzeIdea(actionId, ci) {
    var input = (S.data.start.raw_input || '').trim();
    if (!input) { toast('Enter your video idea first', 'warning'); return; }
    if (!LLMService.isConfigured()) {
      S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString();
      logActivity('idea_processed', 'Idea saved (no AI)');
      if (snapshot) snapshot('Process idea'); buildMaps(); syncToTextarea(); render();
      toast('Idea saved! Configure AI in Settings for smart analysis.', 'info'); return;
    }
    var sp = 'You are an expert video production planner. Analyze the video idea and extract structured metadata. Output JSON only.';
    var prompt = 'Analyze this video idea:\n\n"' + input + '"';
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += '\nAvailable tones: professional, casual, energetic, educational, entertaining, inspirational';
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"suggested title","description":"one line","tone":"tone","target_audience":"who","suggested_sections":["Section 1","Section 2","Section 3"]}';
    _showAIProgress('analyze-idea', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString();
        if (r) {
          var bp = S.data.blueprint;
          if (r.title) bp.title = r.title;
          if (r.description) bp.description = r.description;
          if (r.tone) bp.tone = r.tone;
          if (r.target_audience) bp.target_audience = r.target_audience;
          if (r.suggested_sections && r.suggested_sections.length) {
            bp.sections = [];
            for (var i = 0; i < r.suggested_sections.length; i++) bp.sections.push({ id: generateId('sec'), label: r.suggested_sections[i], duration: 0, key_points: [], visual_notes: '', order: i + 1 });
          }
        }
        logActivity('idea_processed', 'AI analyzed: ' + (r && r.title ? r.title : input.substring(0, 50)));
        if (snapshot) snapshot('AI idea'); buildMaps(); syncToTextarea(); render();
        toast('Idea analyzed! Blueprint pre-filled.', 'success');
      } catch(e) { S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString(); buildMaps(); syncToTextarea(); render(); toast('Idea saved (parse error)', 'warning'); }
    }, function(err) { S.data.start.processed = true; S.data.start.processed_at = new Date().toISOString(); buildMaps(); syncToTextarea(); render(); toast('AI unavailable \u2014 idea saved', 'warning'); }, 'analyze-idea', sp);
  }


  // ============================================================
  // SECTION 7: AI — RESEARCH GENERATION
  // ============================================================

  // Ensure a value is a plain string (fixes [object Object] bug)
  function _ensureString(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      // If it's an object with a content/text field, extract it
      if (val.content) return _ensureString(val.content);
      if (val.text) return _ensureString(val.text);
      // Otherwise stringify the object in readable format
      try { return JSON.stringify(val, null, 2); } catch(e) { return String(val); }
    }
    return String(val);
  }

  function generateResearch(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var input = S.data.start.raw_input || '';
    var v = S.data.video || {};
    var bp = S.data.blueprint || {};
    var sp = 'You are an expert content researcher for video production. Provide actionable, detailed research to help plan a better video. Every value in the JSON output MUST be a plain text string (not an object). Output JSON only.';

    var prompt = 'Research this video topic thoroughly for planning a video production.\n\n' + buildVideoContext();
    if (input) prompt += '\n\nOriginal idea: "' + input + '"';
    if (v.title) prompt += '\nVideo title: ' + v.title;
    if (v.description) prompt += '\nDescription: ' + v.description;
    if (v.target_audience) prompt += '\nTarget audience: ' + v.target_audience;

    // Include blueprint context if available
    var bpSections = bp.sections || [];
    if (bpSections.length) {
      prompt += '\n\n--- VIDEO STRUCTURE ---\n';
      for (var bi = 0; bi < bpSections.length; bi++) {
        prompt += (bi + 1) + '. ' + (bpSections[bi].label || 'Section') + (bpSections[bi].duration ? ' (' + bpSections[bi].duration + 's)' : '') + '\n';
      }
    }

    var sources = (S.data.research || {}).sources || [];
    if (sources.length) { prompt += '\n\nReference sources:\n'; for (var i = 0; i < sources.length; i++) prompt += '- ' + (sources[i].title || sources[i].url || '') + ' (' + (sources[i].type || '') + ')\n'; }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nProvide research in these 4 areas. Each field MUST be a plain text string with line breaks for formatting (NOT a nested object):\n';
    prompt += '1. audience_insights: Who is the target audience? What are their pain points, search intent, demographics, and viewing habits? What questions do they have?\n';
    prompt += '2. competitor_analysis: What similar videos exist? What content gaps can we fill? What works well in top-performing videos on this topic?\n';
    prompt += '3. trending_angles: What current trends relate to this topic? What hooks are viral? Any seasonal or timely relevance?\n';
    prompt += '4. content_strategy: What approach should this video take? Recommended structure, hook strategy, key differentiators, and CTA suggestions.\n';
    prompt += '\nJSON:\n{"audience_insights":"multi-line detailed text...","competitor_analysis":"multi-line detailed text...","trending_angles":"multi-line detailed text...","content_strategy":"multi-line detailed text..."}';

    _showAIProgress('generate-research', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        S.data.research = S.data.research || {};
        // Use _ensureString to prevent [object Object] display
        if (r.audience_insights) S.data.research.audience_insights = _ensureString(r.audience_insights);
        if (r.competitor_analysis) S.data.research.competitor_analysis = _ensureString(r.competitor_analysis);
        if (r.trending_angles) S.data.research.trending_angles = _ensureString(r.trending_angles);
        if (r.content_strategy) S.data.research.content_strategy = _ensureString(r.content_strategy);
        S.data.research.generated = true; S.data.research.generated_at = new Date().toISOString();
        logActivity('research_generated', 'AI research brief generated');
        if (snapshot) snapshot('Research'); buildMaps(); syncToTextarea(); render();
        toast('Research brief generated!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-research', sp, { max_tokens: 8000 });
  }


  // ============================================================
  // SECTION 8: AI — SCRIPT GENERATION
  // ============================================================

  function generateScript(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    if (!bpSections.length) { toast('Confirm blueprint first', 'warning'); return; }
    var sp = 'You are an expert video scriptwriter. Write a compelling script structured into sections. Output ONLY valid JSON — no explanation, no markdown.';
    var prompt = 'Generate a full video script.\n\n' + buildVideoContext();
    if (bp.style_notes) prompt += '\nStyle notes: ' + bp.style_notes;
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    // Explicitly list each section for the AI
    prompt += '\n\n--- SECTIONS TO WRITE ---\n';
    for (var si = 0; si < bpSections.length; si++) {
      var bs = bpSections[si];
      prompt += (si + 1) + '. "' + bs.label + '" (~' + (bs.duration || 30) + 's, ~' + Math.round((bs.duration || 30) * ((S.meta.settings || {}).words_per_minute || 150) / 60) + ' words)';
      if (bs.key_points && bs.key_points.length) prompt += ' — cover: ' + bs.key_points.join(', ');
      prompt += '\n';
    }
    prompt += '\nWrite content as plain text paragraphs separated by newlines. Do NOT use HTML tags.\n';
    prompt += '\nJSON format:\n{"sections":[{"label":"section label","content":"paragraph 1\\n\\nparagraph 2","notes":"any production notes"}]}';
    _callAIWithRetry(prompt, sp, 'generate-script', 'generate-script', true, function(r) {
      try {
        var sections = _extractArray(r, 'sections');
        if (!sections || !sections.length) { toast('No sections found in response', 'error'); return; }
        if (snapshot) snapshot('Before script gen');
        var sc = S.data.script;
        sc.versions = sc.versions || [];
        if (sc.sections && sc.sections.length) {
          sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 Before AI', total_word_count: sc.total_word_count || 0, snapshot: deepClone(sc.sections) });
        }
        sc.sections = [];
        for (var i = 0; i < sections.length; i++) {
          var rs = sections[i];
          var label = rs.label || rs.title || rs.name || 'Section ' + (i + 1);
          var sec = createDefaultBodySection(i + 1, label);
          // Normalize content: handle both HTML and plain text
          var rawContent = rs.content || rs.text || rs.body || '';
          sec.content = normalizeToHtml(rawContent);
          sec.word_count = countWords(stripHtml(sec.content));
          sec.notes = rs.notes || rs.direction || '';
          // Try to match to blueprint section ID
          if (i < bpSections.length) sec.id = bpSections[i].id;
          sc.sections.push(sec);
        }
        sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 AI Generated', total_word_count: 0, snapshot: deepClone(sc.sections) });
        recomputeScriptDurations();
        logActivity('script_generated', 'AI generated script (' + sc.sections.length + ' sections, ' + sc.total_word_count + ' words)');
        if (snapshot) snapshot('After script gen'); buildMaps(); syncToTextarea(); render();
        toast('Script generated!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Script gen error:', e); }
    }, ['sections'], { max_tokens: 12000 });
  }


  // ============================================================
  // SECTION 9: AI — SCRIPT ENHANCEMENT
  // ============================================================

  // Generate script for a SINGLE section
  function generateScriptSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var bpSec = null;
    for (var bsi = 0; bsi < bpSections.length; bsi++) { if (bpSections[bsi].id === sectionId) { bpSec = bpSections[bsi]; break; } }
    var sc = S.data.script || {};
    var sec = (sc.sections || []).find(function(s) { return s.id === sectionId; });
    if (!sec) { toast('Script section not found', 'error'); return; }

    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var targetWords = Math.round(((bpSec ? bpSec.duration : 30) || 30) * wpm / 60);

    var sp = 'You are an expert video scriptwriter. Write compelling, natural script content for this ONE section. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Generate the script for this ONE section of the video.\n\n' + buildVideoContext();
    if (bp.style_notes) prompt += '\nStyle notes: ' + bp.style_notes;
    if (bp.tone) prompt += '\nTone: ' + bp.tone;

    // Section context
    prompt += '\n\n--- SECTION TO WRITE ---\n';
    prompt += 'Section: "' + (sec.label || 'Untitled') + '"\n';
    prompt += 'Target duration: ~' + ((bpSec ? bpSec.duration : 30) || 30) + 's\n';
    prompt += 'Target word count: ~' + targetWords + ' words (at ' + wpm + ' WPM)\n';
    if (bpSec && bpSec.key_points && bpSec.key_points.length) prompt += 'Key points to cover: ' + bpSec.key_points.join(', ') + '\n';
    if (bpSec && bpSec.visual_notes) prompt += 'Visual notes: ' + bpSec.visual_notes + '\n';

    // Context from other sections (so AI knows what comes before/after)
    var allSecs = sc.sections || [];
    var secIdx = -1;
    for (var asi = 0; asi < allSecs.length; asi++) { if (allSecs[asi].id === sectionId) { secIdx = asi; break; } }
    if (secIdx > 0 && allSecs[secIdx - 1].content) {
      prompt += '\nPrevious section ("' + (allSecs[secIdx - 1].label || '') + '") ends with: "' + truncate(stripHtml(allSecs[secIdx - 1].content), 150) + '"\n';
      prompt += 'Continue naturally from where the previous section left off.\n';
    }
    if (secIdx >= 0 && secIdx < allSecs.length - 1 && allSecs[secIdx + 1].content) {
      prompt += '\nNext section ("' + (allSecs[secIdx + 1].label || '') + '") starts with: "' + truncate(stripHtml(allSecs[secIdx + 1].content), 100) + '"\n';
      prompt += 'End this section in a way that flows into the next.\n';
    }

    // Existing content (for regeneration)
    var existingText = sec.content ? stripHtml(sec.content) : '';
    if (existingText && existingText.length > 10) {
      prompt += '\nExisting content (replace with improved version): "' + truncate(existingText, 300) + '"\n';
    }

    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nWrite content as plain text paragraphs separated by newlines. Aim for ~' + targetWords + ' words. Do NOT use HTML tags.\n';
    prompt += 'JSON:\n{"content":"paragraph 1\\n\\nparagraph 2","notes":"any production notes"}';

    _callAIWithRetry(prompt, sp, 'generate-script', 'generate-script', false, function(r) {
      try {
        var content = r.content || r.text || r.body || r.enhanced || '';
        if (!content) { toast('No content generated', 'error'); return; }
        if (snapshot) snapshot('Before section script gen');
        // Version snapshot
        sc.versions = sc.versions || [];
        sc.versions.push({ id: generateId('ver'), timestamp: new Date().toISOString(), label: 'v' + (sc.versions.length + 1) + ' \u2014 Before "' + (sec.label || 'section') + '" gen', total_word_count: sc.total_word_count || 0, snapshot: deepClone(sc.sections) });
        // Update section
        sec.content = normalizeToHtml(_ensureString(content));
        sec.word_count = countWords(stripHtml(sec.content));
        if (r.notes) sec.notes = _ensureString(r.notes);
        recomputeScriptDurations();
        logActivity('script_section_generated', 'AI generated script for "' + (sec.label || sectionId) + '" (' + sec.word_count + ' words)');
        if (snapshot) snapshot('After section script gen'); buildMaps(); syncToTextarea(); render();
        toast('Script generated for "' + (sec.label || 'section') + '"!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, null, { max_tokens: 4000 });
  }

  function enhanceSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sc = S.data.script || {};
    var sec = (sc.sections || []).find(function(s) { return s.id === sectionId; });
    if (!sec || !sec.content) { toast('Write some content first', 'warning'); return; }
    var currentText = stripHtml(sec.content);
    var sp = 'You are an expert video scriptwriter. Improve the given section. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Enhance this script section.\n\n' + buildVideoContext();
    prompt += '\n\nSection: ' + (sec.label || 'Unknown') + '\nCurrent text: ' + currentText;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nReturn plain text paragraphs separated by \\n\\n. No HTML tags.\n';
    prompt += 'JSON:\n{"enhanced":"improved paragraph 1\\n\\nimproved paragraph 2","notes":"what changed"}';
    _callAIWithRetry(prompt, sp, 'enhance-script', 'enhance-script', false, function(r) {
      try {
        var enhanced = r.enhanced || r.content || r.text || r.improved || '';
        if (!enhanced) { toast('Could not parse enhanced content', 'error'); return; }
        if (snapshot) snapshot('Before enhance');
        sec.content = normalizeToHtml(enhanced);
        sec.word_count = countWords(stripHtml(sec.content));
        recomputeScriptDurations();
        logActivity('script_enhanced', 'AI enhanced: ' + (sec.label || sectionId));
        if (snapshot) snapshot('After enhance'); buildMaps(); syncToTextarea(); render();
        toast('Section enhanced!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, null);
  }


  // ============================================================
  // SECTION 10: AI — CLIP BREAKDOWN
  // ============================================================

  // Video types that should get auto-injected template clips (intro/outro/chapters)
  var AUTO_TEMPLATE_PLATFORMS = { 'youtube': true, 'youtube-shorts': false, 'instagram-reels': false, 'tiktok': false, 'linkedin': true };

  function generateClips(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var v = S.data.video || {};
    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var modelCfg = getModelDurationConfig(videoModel);

    var sp = 'You are a video production expert. Break the script into production-ready clips. Output ONLY valid JSON — no markdown, no explanation.';
    var prompt = 'Generate clip breakdown from script.\n\n' + buildVideoContext() + '\n\n' + buildScriptContext();

    // --- Explicit valid type IDs ---
    prompt += '\n\n--- VALID CLIP TYPES (use EXACT IDs) ---\n';
    prompt += 'AI track:       ai-character, ai-visual, ai-broll\n';
    prompt += 'Non-AI track:   screen-recording, screen-with-cam, human-presenter\n';
    prompt += 'Template track: branded-intro, branded-outro, chapter-title, text-card\n';
    prompt += 'DO NOT invent new type IDs. Use ONLY the ones above.\n';

    // --- Preferred clip types (from user selection in Start stage) ---
    var selectedClipTypes = ((S.data.start || {}).selected_clip_types || []);
    if (selectedClipTypes.length) {
      prompt += '\n--- PREFERRED CLIP TYPES ---\n';
      prompt += 'The user has selected these clip types: ' + selectedClipTypes.join(', ') + '\n';
      prompt += 'Prioritize using these types. You MAY use other valid types if needed, but prefer the selected ones.\n';
    }

    // --- Explicit section IDs ---
    prompt += '\n--- SECTION IDs (use EXACT IDs) ---\n';
    for (var si = 0; si < bpSections.length; si++) {
      prompt += '"' + bpSections[si].id + '" = ' + bpSections[si].label + '\n';
    }
    if (!bpSections.length) prompt += '(no blueprint sections — use "body" for all clips)\n';

    // --- Duration + Script Word Budget constraints ---
    var _wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var _maxClipDur = modelCfg.maxDuration || modelCfg.defaultDuration || 8;
    var _maxWordsPerClip = Math.floor((_maxClipDur / 60) * _wpm);
    prompt += '\n--- DURATION & WORD BUDGET RULES ---\n';
    prompt += 'AI track clips: valid durations = ' + (modelCfg.durations || []).join('s, ') + 's (default: ' + modelCfg.defaultDuration + 's)\n';
    prompt += 'Words per minute (WPM): ' + _wpm + '\n';
    prompt += 'CRITICAL: Each clip\'s script_text MUST be <= ' + _maxWordsPerClip + ' words (for ' + _maxClipDur + 's at ' + _wpm + ' WPM).\n';
    prompt += 'If a section has too many words for one clip, split it into MULTIPLE clips.\n';
    prompt += 'Formula: max_words = floor((duration / 60) * ' + _wpm + ')\n';
    prompt += 'Non-AI clips: 10-60s depending on content\n';
    prompt += 'Template clips: branded-intro=4s, branded-outro=8s, chapter-title=3s, text-card=4s\n';

    // --- Section-by-section word budgets ---
    var _scriptSections = (S.data.script || {}).sections || [];
    if (_scriptSections.length) {
      prompt += '\n--- PER-SECTION WORD BUDGETS ---\n';
      for (var _wbi = 0; _wbi < _scriptSections.length; _wbi++) {
        var _wbSec = _scriptSections[_wbi];
        var _secText = stripHtml(_wbSec.content || '');
        var _secWords = countWords(_secText);
        var _sugClips = Math.max(1, Math.ceil(_secWords / _maxWordsPerClip));
        prompt += 'Section "' + (_wbSec.label || 'Section ' + (_wbi + 1)) + '": ' + _secWords + ' words → suggest ' + _sugClips + ' clip(s), max ' + _maxWordsPerClip + ' words each\n';
      }
    }

    // --- Character awareness ---
    var _charLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador'; });
    if (_charLooks.length) {
      prompt += '\n--- AVAILABLE CHARACTERS ---\n';
      for (var _cli = 0; _cli < _charLooks.length; _cli++) {
        prompt += '- ' + _charLooks[_cli].name + ' (look_id: ' + _charLooks[_cli].id + '): ' + (_charLooks[_cli].combined_prompt_fragment || '').substring(0, 100) + '\n';
      }
      prompt += 'For ai-character clips, include "look_id" field referencing one of these characters.\n';
    }

    // --- Presenter preference ---
    var presPref = prefs.presenter_preference || v.presenter_preference || 'ai-only';
    prompt += '\n--- PRESENTER: ' + presPref.toUpperCase() + ' ---\n';
    if (presPref === 'ai-only') prompt += 'Use ai-character for narration. NO human-presenter.\n';
    else if (presPref === 'human-only') prompt += 'Use human-presenter for narration. ai-visual/ai-broll allowed for visuals.\n';
    else prompt += 'Mix ai-character and human-presenter as appropriate.\n';

    // --- Structural rules ---
    // User can override template injection: prefs.include_templates (true/false/undefined)
    var _templatePref = prefs.include_templates;
    var autoInject = (_templatePref !== undefined) ? !!_templatePref : (AUTO_TEMPLATE_PLATFORMS[prefs.platform || v.platform || 'youtube'] !== false);
    if (autoInject) {
      prompt += '\n--- STRUCTURE ---\n';
      prompt += 'DO NOT include branded-intro, branded-outro, or chapter-title clips.\n';
      prompt += 'The app will auto-inject those. Focus ONLY on content clips.\n';
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nFor each blueprint section, create 1-5 clips.\n';
    prompt += 'CRITICAL: Each clip\'s script_text must contain the ACTUAL voiceover narration text COPIED from the script. Do NOT summarize or use placeholders.\n';
    prompt += 'Each clip gets up to ' + _maxWordsPerClip + ' words. The clips must collectively contain ALL the script text — no words left out.\n';
    prompt += 'JSON:\n{"clips":[{"title":"short title","type":"exact_type_id","section":"exact_section_id","duration":' + _maxClipDur + ',"script_text":"FULL voiceover narration text from the script (up to ' + _maxWordsPerClip + ' words per clip, copy exact words from the script)","onscreen_text":"overlay text","visual_direction":"what to show","look_id":"optional_look_id_for_ai-character"}]}';

    _callAIWithRetry(prompt, sp, 'generate-clips', 'generate-clips', true, function(r) {
      try {
        var rawClips = _extractArray(r, 'clips');
        if (!rawClips || !rawClips.length) { toast('No clips found in response', 'error'); return; }
        if (snapshot) snapshot('Before clip gen');

        // --- Build lightweight clips with normalization ---
        var contentClips = [];
        var stg = (S.meta && S.meta.settings) || {};
        var snappedCount = 0;
        for (var i = 0; i < rawClips.length; i++) {
          var ic = rawClips[i];
          var clipType = normalizeClipType(ic.type);
          var sectionId = resolveSectionId(ic.section);
          var clip = createLightweightClip(clipType, sectionId, i + 1);
          clip.title = ic.title || ic.name || 'Clip ' + (i + 1);
          // Duration: validate and snap
          var aiDur = parseInt(ic.duration, 10) || 0;
          clip.duration = (aiDur >= 2 && aiDur <= 120) ? aiDur : getSmartClipDuration(clipType);
          if (clip.track === 'ai' && (stg.strict_ai_duration || stg.snap_to_model_durations)) {
            var snapped = snapToModelDuration(clip.duration, videoModel);
            if (snapped !== clip.duration) { snappedCount++; clip.duration = snapped; }
          }
          clip.script_text = ic.script_text || ic.voiceover || ic.narration || '';
          clip.onscreen_text = ic.onscreen_text || ic.text_overlay || '';
          clip.visual_direction = ic.visual_direction || ic.visuals || ic.direction || '';
          // Assign look if AI provided look_id (for ai-character clips)
          if (ic.look_id && S.lookMap && S.lookMap[ic.look_id]) {
            ensurePromptSet(clip);
            clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
            clip.prompt_set.first_frame.scene.look_ids = [ic.look_id];
          }
          contentClips.push(clip);
        }

        // --- Auto-inject template clips ---
        var finalClips = [];
        if (autoInject) {
          // Branded Intro
          var introClip = createLightweightClip('branded-intro', bpSections.length ? bpSections[0].id : 'body', 1);
          introClip.title = 'Branded Intro';
          introClip.duration = 4;
          introClip.status = 'pending';
          finalClips.push(introClip);

          // Group content clips by section and inject chapter titles
          var currentSection = '';
          for (var ci2 = 0; ci2 < contentClips.length; ci2++) {
            var cc = contentClips[ci2];
            if (cc.section !== currentSection) {
              currentSection = cc.section;
              // Find section label
              var secLabel = currentSection;
              for (var bsi = 0; bsi < bpSections.length; bsi++) {
                if (bpSections[bsi].id === currentSection) { secLabel = bpSections[bsi].label; break; }
              }
              var chClip = createLightweightClip('chapter-title', currentSection, 0);
              chClip.title = secLabel;
              chClip.onscreen_text = secLabel;
              chClip.duration = 3;
              chClip.status = 'pending';
              finalClips.push(chClip);
            }
            finalClips.push(cc);
          }

          // Branded Outro
          var outroClip = createLightweightClip('branded-outro', bpSections.length ? bpSections[bpSections.length - 1].id : 'body', 0);
          outroClip.title = 'Branded Outro';
          outroClip.duration = 8;
          outroClip.status = 'pending';
          finalClips.push(outroClip);
        } else {
          finalClips = contentClips;
        }

        // --- Recompute order + timing ---
        var t = 0;
        for (var fi = 0; fi < finalClips.length; fi++) {
          finalClips[fi].order = fi + 1;
          finalClips[fi].timing = { start: t, end: t + finalClips[fi].duration };
          t += finalClips[fi].duration;
        }

        // --- Stats ---
        var aiCount = finalClips.filter(function(c) { return c.track === 'ai'; }).length;
        var nonAiCount = finalClips.filter(function(c) { return c.track === 'non-ai'; }).length;
        var tplCount = finalClips.filter(function(c) { return c.track === 'template'; }).length;

        S.data.clips = finalClips;
        recomputeClipTimings();
        logActivity('clips_generated', 'AI generated ' + finalClips.length + ' clips (' + aiCount + ' AI, ' + nonAiCount + ' Non-AI, ' + tplCount + ' Template)' + (snappedCount > 0 ? ' \u2014 ' + snappedCount + ' durations snapped' : ''));
        if (snapshot) snapshot('After clip gen'); buildMaps(); syncToTextarea(); render();
        // Check for script overflow
        var _overflowCount = 0;
        for (var _oci = 0; _oci < finalClips.length; _oci++) {
          if (finalClips[_oci].script_text && getClipScriptOverflow(finalClips[_oci])) _overflowCount++;
        }
        var _msg = finalClips.length + ' clips generated!';
        if (snappedCount > 0) _msg += ' (' + snappedCount + ' durations adjusted)';
        if (_overflowCount > 0) _msg += ' \u26a0 ' + _overflowCount + ' clip(s) exceed word limit \u2014 use AI Split';
        toast(_msg, _overflowCount > 0 ? 'warning' : 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Clip gen error:', e); }
    }, ['clips'], { max_tokens: 16000 });
  }


  // --- Generate clips for a SINGLE section ---
  function generateClipsForSection(sectionId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bp = S.data.blueprint || {};
    var bpSections = bp.sections || [];
    var bpSec = null;
    for (var bsi = 0; bsi < bpSections.length; bsi++) { if (bpSections[bsi].id === sectionId) { bpSec = bpSections[bsi]; break; } }
    if (!bpSec) { toast('Section not found in blueprint', 'error'); return; }

    // Find script content for this section — match by ID first, then by label, then by index
    var scriptSecs = (S.data.script || {}).sections || [];
    var scriptSec = null;
    // Match 1: by ID
    for (var ssi = 0; ssi < scriptSecs.length; ssi++) { if (scriptSecs[ssi].id === sectionId) { scriptSec = scriptSecs[ssi]; break; } }
    // Match 2: by label (if ID match failed)
    if (!scriptSec && bpSec) {
      var _bpLabel = (bpSec.label || '').toLowerCase().trim();
      for (var ssi2 = 0; ssi2 < scriptSecs.length; ssi2++) {
        if ((scriptSecs[ssi2].label || '').toLowerCase().trim() === _bpLabel) { scriptSec = scriptSecs[ssi2]; break; }
      }
    }
    // Match 3: by index position in blueprint
    if (!scriptSec) {
      var _bpIdx = -1;
      for (var _bi = 0; _bi < bpSections.length; _bi++) { if (bpSections[_bi].id === sectionId) { _bpIdx = _bi; break; } }
      if (_bpIdx >= 0 && _bpIdx < scriptSecs.length) scriptSec = scriptSecs[_bpIdx];
    }
    var secText = scriptSec ? stripHtml(scriptSec.content || '') : '';
    var secWords = countWords(secText);
    if (!secText || secWords < 3) { toast('No script content for this section. Write the script in the Script stage first.', 'warning'); return; }

    var prefs = ((S.data.start || {}).preferences || {});
    var videoModel = (S.meta.aiPreferences || {}).videoModel || 'google-veo-3.1';
    var modelCfg = getModelDurationConfig(videoModel);
    var _wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var _maxClipDur = modelCfg.maxDuration || modelCfg.defaultDuration || 8;
    var _maxWordsPerClip = Math.floor((_maxClipDur / 60) * _wpm);
    var sugClips = Math.max(1, Math.ceil(secWords / _maxWordsPerClip));

    var sp = 'You are a video production expert. Break this script section into production-ready clips. Output ONLY valid JSON.';
    var prompt = 'Generate clips for this ONE section of the video.\n\n' + buildVideoContext();
    prompt += '\n\n--- SECTION TO PROCESS ---\n';
    prompt += 'Section: "' + bpSec.label + '" (id: ' + sectionId + ')\n';
    prompt += 'Script text (' + secWords + ' words): ' + secText + '\n';
    prompt += 'Target duration: ' + (bpSec.duration || 30) + 's\n';
    prompt += 'Suggested clips: ' + sugClips + ' (max ' + _maxWordsPerClip + ' words per clip at ' + _wpm + ' WPM)\n';

    // Valid types and preferences
    prompt += '\n--- VALID CLIP TYPES ---\nai-character, ai-visual, ai-broll, screen-recording, screen-with-cam, human-presenter\n';
    prompt += 'DO NOT create template clips (branded-intro, branded-outro, chapter-title, text-card). Focus ONLY on content clips.\n';
    var selectedClipTypes = ((S.data.start || {}).selected_clip_types || []);
    if (selectedClipTypes.length) prompt += 'Preferred: ' + selectedClipTypes.join(', ') + '\n';

    // Duration and word rules
    prompt += '\n--- RULES ---\n';
    prompt += 'Duration range: ' + modelCfg.minDuration + '-' + _maxClipDur + 's\n';
    if (modelCfg.durations && modelCfg.durations.length) prompt += 'Valid AI durations: ' + modelCfg.durations.join('s, ') + 's (default: ' + modelCfg.defaultDuration + 's)\n';
    prompt += 'EACH clip script_text MUST be <= ' + _maxWordsPerClip + ' words.\n';
    prompt += 'CRITICAL: COPY the EXACT script text into the clips. The script_text field must contain the ACTUAL voiceover narration, NOT a summary or placeholder.\n';
    prompt += 'The clips must collectively contain the ENTIRE script text for this section. No words should be left out.\n';
    prompt += 'Split the text sequentially \u2014 each clip picks up exactly where the previous clip ended.\n';
    prompt += 'Do NOT write "max N words" or placeholders in script_text \u2014 write the real narration text from the script above.\n';
    prompt += 'Section ID for all clips: "' + sectionId + '"\n';

    // Presenter preference
    var presPref = prefs.presenter_preference || 'ai-only';
    if (presPref === 'ai-only') prompt += 'Use ai-character for narration. NO human-presenter.\n';
    else if (presPref === 'human-only') prompt += 'Use human-presenter. ai-visual/ai-broll for visuals.\n';

    // Character awareness
    var _charLooks = (S.allLooks || []).filter(function(l) { return l.role === 'primary-presenter' || l.role === 'brand-ambassador'; });
    if (_charLooks.length) {
      prompt += '\n--- CHARACTERS ---\n';
      for (var _cli = 0; _cli < _charLooks.length; _cli++) prompt += '- ' + _charLooks[_cli].name + ' (look_id: ' + _charLooks[_cli].id + ')\n';
      prompt += 'For ai-character clips, include "look_id".\n';
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"clips":[{"title":"short title","type":"exact_type_id","duration":' + _maxClipDur + ',"script_text":"FULL voiceover narration text copied from the script (up to ' + _maxWordsPerClip + ' words per clip)","onscreen_text":"overlay","visual_direction":"what to show","look_id":"optional"}]}';

    _callAIWithRetry(prompt, sp, 'generate-clips', 'generate-clips', false, function(r) {
      try {
        var rawClips = _extractArray(r, 'clips');
        if (!rawClips || !rawClips.length) { toast('No clips generated for this section', 'error'); return; }
        if (snapshot) snapshot('Before section clip gen');

        // Remove existing clips for this section
        var existingClips = S.data.clips || [];
        var keptClips = existingClips.filter(function(c) { return c.section !== sectionId; });

        // Build new clips for this section
        var stg = (S.meta && S.meta.settings) || {};
        var newClips = [];
        for (var i = 0; i < rawClips.length; i++) {
          var ic = rawClips[i];
          var clipType = normalizeClipType(ic.type);
          var clip = createLightweightClip(clipType, sectionId, 0);
          clip.title = ic.title || ic.name || bpSec.label + ' Clip ' + (i + 1);
          var aiDur = parseInt(ic.duration, 10) || 0;
          clip.duration = (aiDur >= 2 && aiDur <= 120) ? aiDur : getSmartClipDuration(clipType);
          if (clip.track === 'ai') clip.duration = snapToModelDuration(clip.duration, videoModel);
          clip.script_text = ic.script_text || ic.voiceover || ic.narration || '';
          clip.onscreen_text = ic.onscreen_text || ic.text_overlay || '';
          clip.visual_direction = ic.visual_direction || ic.visuals || ic.direction || '';
          if (ic.look_id && S.lookMap && S.lookMap[ic.look_id]) {
            ensurePromptSet(clip);
            clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
            clip.prompt_set.first_frame.scene.look_ids = [ic.look_id];
          }
          newClips.push(clip);
        }

        // Insert new clips at the correct position (by section order)
        var insertIdx = keptClips.length; // default: append
        for (var ki = 0; ki < keptClips.length; ki++) {
          // Find first clip whose section comes AFTER the target section
          var kSec = keptClips[ki].section || 'body';
          var kSecOrder = -1, targetSecOrder = -1;
          for (var bo = 0; bo < bpSections.length; bo++) {
            if (bpSections[bo].id === kSec) kSecOrder = bo;
            if (bpSections[bo].id === sectionId) targetSecOrder = bo;
          }
          if (targetSecOrder >= 0 && kSecOrder > targetSecOrder) { insertIdx = ki; break; }
        }
        // Splice in new clips
        for (var ni = 0; ni < newClips.length; ni++) keptClips.splice(insertIdx + ni, 0, newClips[ni]);

        // Reorder all clips
        for (var ri = 0; ri < keptClips.length; ri++) { keptClips[ri].order = ri + 1; }
        S.data.clips = keptClips;
        recomputeClipTimings();

        logActivity('section_clips_generated', 'Generated ' + newClips.length + ' clips for "' + bpSec.label + '"');
        if (snapshot) snapshot('After section clip gen'); buildMaps(); syncToTextarea(); render();

        // Overflow check
        var _ofc = 0;
        for (var _oi = 0; _oi < newClips.length; _oi++) { if (newClips[_oi].script_text && getClipScriptOverflow(newClips[_oi])) _ofc++; }
        var _msg = newClips.length + ' clips generated for "' + bpSec.label + '"';
        toast(_msg + (_ofc > 0 ? ' \u2014 ' + _ofc + ' exceed word limit' : ''), _ofc > 0 ? 'warning' : 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); console.error('[VPM] Section clip gen error:', e); }
    }, ['clips'], { max_tokens: 8000 });
  }


  // ============================================================
  // SECTION 11: AI — FRAME & VIDEO PROMPTS
  // ============================================================

  function generateFramePrompt(clipId, frameKey, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip || !clip.prompt_set) return;
    var frame = clip.prompt_set[frameKey]; if (!frame) return;
    var isFirst = frameKey === 'first_frame';
    var ar = ((S.data.start || {}).preferences || {}).aspect_ratio || '16:9';
    var sp = 'You are an expert AI image prompt engineer. Write detailed image prompts. Output JSON only.';
    var prompt = 'Generate a ' + (isFirst ? 'FIRST' : 'LAST') + ' FRAME prompt.\n\n' + buildClipContext(clip) + '\n\n' + buildSceneContext(clip);
    if (!isFirst && clip.prompt_set.first_frame && clip.prompt_set.first_frame.prompt && clip.prompt_set.first_frame.prompt.positive) {
      prompt += '\n\nFirst frame: ' + clip.prompt_set.first_frame.prompt.positive + '\nThis LAST FRAME shows the END state.';
    }
    // AI Character: show in speaking/presenting pose
    if (clip.type === 'ai-character') {
      var _fgLookIds = (((clip.prompt_set || {}).first_frame || {}).scene || {}).look_ids || [];
      var _fgLook = (_fgLookIds.length && S.lookMap) ? S.lookMap[_fgLookIds[0]] : null;
      prompt += '\n\n=== AI CHARACTER FRAME REQUIREMENTS ===';
      prompt += '\n- The character IS the narrator. Show them in a speaking/presenting pose, facing the camera.';
      if (_fgLook) prompt += '\n- Character: ' + (_fgLook.name || 'Unnamed') + ' \u2014 ' + (_fgLook.combined_prompt_fragment || 'professional presenter');
      prompt += '\n- Facial expression should match the tone of the script text.';
      prompt += '\n- Show the character naturally mid-speech (mouth slightly open, engaged expression).';
      if (isFirst) prompt += '\n- This is the OPENING shot \u2014 the character begins speaking to the viewer.';
    }
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += '\nAspect ratio: ' + ar;
    // Video style
    var _fvs = ((S.data.start || {}).preferences || {}).video_style || '';
    var _fvsDef = (Constants.VIDEO_STYLES || {})[_fvs] || {};
    if (_fvs && _fvsDef.promptHint) prompt += '\nVideo style: ' + _fvsDef.label + ' \u2014 ' + _fvsDef.promptHint;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"positive":"detailed prompt","negative":"watermark, blurry, low quality","style_keywords":[]}';
    _showAIProgress('generate-prompt', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.positive) { toast('Could not parse', 'error'); return; }
        frame.prompt.positive = r.positive; frame.prompt.negative = r.negative || '';
        frame.prompt.status = 'generated'; frame.prompt.generated_at = new Date().toISOString();
        maybeAdvanceClipStatus(clip, (isFirst ? 'first' : 'last') + ' frame prompt');
        logActivity('prompt_generated', 'Clip ' + clip.order + ': ' + (isFirst ? 'First' : 'Last') + ' frame prompt');
        if (snapshot) snapshot('Frame prompt'); buildMaps(); syncToTextarea(); render();
        toast('Frame prompt ready!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-prompt', sp);
  }

  // generateVideoPrompt is now in src/ai/generate-prompt.js — captured as a local
  var generateVideoPrompt = window._vpm.generateVideoPrompt;


  // ============================================================
  // SECTION 12: AI — STUDIO, METADATA, BRIEF, THUMBNAILS
  // ============================================================

  function analyzeStudio(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    var aiClips = clips.filter(function(c) { return c.track === 'ai'; });
    if (!aiClips.length) { toast('No AI clips to analyze', 'info'); return; }
    var sp = 'You are a video production studio manager. Analyze clips and determine needed looks, environments, scenes. Output JSON only.';
    var prompt = 'Analyze these AI clips for studio requirements.\n\n' + buildVideoContext() + '\n\n--- AI CLIPS ---\n';
    for (var i = 0; i < aiClips.length; i++) { var c = aiClips[i]; prompt += '#' + c.order + ' ' + c.title + ' (' + c.type + '): ' + (c.visual_direction || c.script_text || '') + '\n'; }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"looks":[{"name":"","description":"","prompt_fragment":""}],"environments":[{"name":"","type":"studio-set|indoor|outdoor","prompt_fragment":""}],"scenes":[{"name":"","look":"look name","environment":"env name"}]}';
    _showAIProgress('analyze-studio', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before studio');
        var created = 0;
        if (r.looks) { for (var li = 0; li < r.looks.length; li++) { var rl = r.looks[li]; var lk = createDefaultLook(); lk.name = rl.name || 'Look ' + (li+1); lk.combined_prompt_fragment = rl.prompt_fragment || rl.description || ''; lk._draft = true; S.meta.lookLibrary.push(lk); created++; } }
        if (r.environments) { for (var ei = 0; ei < r.environments.length; ei++) { var re = r.environments[ei]; var env = createDefaultEnvironment(); env.name = re.name || 'Env ' + (ei+1); env.type = re.type || 'indoor'; env.prompt_fragment = re.prompt_fragment || ''; env._draft = true; S.meta.environmentLibrary.push(env); created++; } }
        logActivity('studio_analyzed', 'AI created ' + created + ' draft entities');
        if (snapshot) snapshot('After studio'); buildMaps(); syncToTextarea(); render();
        toast(created + ' draft entities created!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'analyze-studio', sp, { max_tokens: 8000 });
  }

  function generateMetadata(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sp = 'You are a YouTube SEO expert. Generate optimized metadata. Output JSON only.';
    var prompt = 'Generate YouTube metadata.\n\n' + buildVideoContext() + '\n\n' + buildScriptContext();
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"SEO title","title_options":["alt1","alt2","alt3"],"description":"full description with timestamps","tags":["tag1","tag2"],"hashtags":["#tag1"],"category":"education","chapters":[{"time":"0:00","label":"Intro"}]}';
    _showAIProgress('generate-metadata', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before metadata');
        var yt = S.data.publishing.youtube = S.data.publishing.youtube || {};
        if (r.title) yt.title = r.title;
        if (r.title_options) yt.title_options = r.title_options;
        if (r.description) yt.description = r.description;
        if (r.tags) yt.tags = r.tags;
        if (r.hashtags) yt.hashtags = r.hashtags;
        if (r.category) yt.category = r.category;
        if (r.chapters) yt.chapters = r.chapters;
        logActivity('metadata_generated', 'AI generated YouTube metadata');
        if (snapshot) snapshot('After metadata'); buildMaps(); syncToTextarea(); render();
        toast('Metadata generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-metadata', sp, { max_tokens: 4000 });
  }

  function improveBrief(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) return;
    var nap = clip.non_ai_planning || {};
    var sp = 'You are a video production manager. Improve the recording brief. Output JSON only.';
    var prompt = 'Improve this production brief.\n\n' + buildVideoContext() + '\n\n' + buildClipContext(clip);
    prompt += '\nCurrent brief: ' + (nap.brief || 'none') + '\nCurrent instructions: ' + (nap.instructions || 'none');
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"brief":"improved brief","instructions":"step-by-step"}';
    _showAIProgress('improve-brief', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before brief');
        clip.non_ai_planning = clip.non_ai_planning || {};
        if (r.brief) clip.non_ai_planning.brief = r.brief;
        if (r.instructions) clip.non_ai_planning.instructions = r.instructions;
        maybeAdvanceClipStatus(clip, 'brief improved');
        logActivity('clip_edited', 'Clip ' + clip.order + ': AI improved brief');
        if (snapshot) snapshot('After brief'); buildMaps(); syncToTextarea(); render();
        toast('Brief improved!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'improve-brief', sp);
  }

  function generateThumbnailIdeas(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var sp = 'You are a YouTube thumbnail design expert. Generate 4 distinctive concepts. Output JSON only.';
    var prompt = 'Generate 4 thumbnail concepts.\n\n' + buildVideoContext();
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"ideas":[{"title":"concept name","desc":"description","text":"main text overlay","subtext":"optional subtitle","colors":"color palette","mood":"energetic|calm|dramatic","layout":"center|rule-of-thirds|split","score":85}]}';
    _showAIProgress('generate-thumbnails', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.ideas || !r.ideas.length) { toast('No ideas parsed', 'error'); return; }
        S.data.thumbnails = S.data.thumbnails || {};
        S.data.thumbnails.ideas = [];
        for (var i = 0; i < r.ideas.length; i++) { r.ideas[i].id = generateId('thumb'); S.data.thumbnails.ideas.push(r.ideas[i]); }
        S.thumbnailStep = 'ideas';
        logActivity('thumbnails_generated', 'AI generated ' + r.ideas.length + ' thumbnail concepts');
        if (snapshot) snapshot('Thumbnail ideas'); buildMaps(); syncToTextarea(); render();
        toast(r.ideas.length + ' thumbnail concepts ready!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, 'generate-thumbnails', sp);
  }


  // ============================================================
  // SECTION 12B: AI — BLUEPRINT, CHAPTERS, SCENES, RESEARCH REGEN, THUMBNAIL CHAT
  // ============================================================

  function generateBlueprint(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var input = S.data.start.raw_input || '';
    var prefs = (S.data.start || {}).preferences || {};
    var sp = 'You are an expert video production planner. Create a structured video blueprint with sections. Output JSON only.';
    var prompt = 'Generate a video blueprint.\n\n' + buildVideoContext();
    if (input) prompt += '\n\nOriginal idea: "' + input + '"';
    prompt += '\nTarget duration: ' + (prefs.target_duration || 120) + 's';
    if (BrandService.isConfigured()) prompt += '\n\n' + BrandService.getSystemPrompt();
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"video title","description":"one sentence","tone":"casual|professional|energetic","target_audience":"who","style_notes":"visual style notes","sections":[{"label":"Section Name","duration":60,"key_points":["point 1","point 2"],"visual_notes":"what to show"}]}';
    _showAIProgress('analyze-idea', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.sections || !r.sections.length) { toast('No sections parsed', 'error'); return; }
        if (snapshot) snapshot('Before AI blueprint');
        var bp = S.data.blueprint;
        if (r.title) bp.title = r.title;
        if (r.description) bp.description = r.description;
        if (r.tone) bp.tone = r.tone;
        if (r.target_audience) bp.target_audience = r.target_audience;
        if (r.style_notes) bp.style_notes = r.style_notes;
        bp.sections = [];
        for (var i = 0; i < r.sections.length; i++) {
          var rs = r.sections[i];
          bp.sections.push({ id: generateId('sec'), label: rs.label || 'Section ' + (i + 1), duration: parseInt(rs.duration, 10) || 0, key_points: rs.key_points || [], visual_notes: rs.visual_notes || '', order: i + 1 });
        }
        logActivity('blueprint_generated', 'AI generated blueprint with ' + bp.sections.length + ' sections');
        if (snapshot) snapshot('After AI blueprint'); buildMaps(); syncToTextarea(); render();
        toast('Blueprint generated with ' + bp.sections.length + ' sections!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'analyze-idea', sp, { max_tokens: 4000 });
  }

  function generateChapters(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    if (!clips.length) { toast('Need clips to generate chapters', 'warning'); return; }
    var sp = 'You are a YouTube SEO expert. Generate video chapters from clip data. Output JSON only.';
    var prompt = 'Generate YouTube chapters.\n\n' + buildVideoContext() + '\n\n--- CLIPS ---\n';
    var t = 0;
    for (var i = 0; i < clips.length; i++) {
      var c = clips[i];
      var m = Math.floor(t / 60), s = t % 60;
      prompt += m + ':' + (s < 10 ? '0' : '') + s + ' - #' + c.order + ' ' + (c.title || c.type) + ' (' + c.duration + 's)\n';
      t += c.duration || 0;
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"chapters":[{"time":"0:00","label":"Chapter Name"}]}';
    _showAIProgress('generate-metadata', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.chapters) { toast('Could not parse', 'error'); return; }
        S.data.publishing = S.data.publishing || {};
        S.data.publishing.youtube = S.data.publishing.youtube || {};
        S.data.publishing.youtube.chapters = r.chapters;
        logActivity('chapters_generated', 'AI generated ' + r.chapters.length + ' chapters');
        if (snapshot) snapshot('Chapters'); buildMaps(); syncToTextarea(); render();
        toast(r.chapters.length + ' chapters generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-metadata', sp);
  }

  function generateScenes(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var looks = S.allLooks || [];
    var envs = S.allEnvironments || [];
    if (!looks.length && !envs.length) { toast('Create looks or environments first', 'warning'); return; }
    var sp = 'You are a video production scene designer. Create scenes by combining looks and environments for visual consistency. Output JSON only.';
    var prompt = 'Generate scenes for this video.\n\n' + buildVideoContext();

    // Video style context
    var prefs = ((S.data.start || {}).preferences || {});
    var vs = prefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    if (vs && vsDef.promptHint) {
      prompt += '\n\n--- VIDEO STYLE ---\n' + vsDef.label + ': ' + vsDef.promptHint;
      prompt += '\nAll scenes should be visually consistent with this style.';
    }

    // Audio context
    var audioMode = prefs.audio_mode || '';
    if (audioMode === 'ai-audio-with-video') {
      prompt += '\n\n--- AUDIO ---\nThis video uses AI-generated audio with video. Scenes should consider audio/acoustic environment (e.g. indoor reverb, outdoor ambient).';
    }

    prompt += '\n\n--- AVAILABLE LOOKS ---\n';
    for (var li = 0; li < looks.length; li++) prompt += '- ' + looks[li].name + ' (id: ' + looks[li].id + ', role: ' + (looks[li].role || 'unspecified') + ')' + (looks[li].combined_prompt_fragment ? ' \u2014 ' + looks[li].combined_prompt_fragment : '') + '\n';
    prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
    for (var ei = 0; ei < envs.length; ei++) prompt += '- ' + envs[ei].name + ' (id: ' + envs[ei].id + ', type: ' + (envs[ei].type || 'indoor') + ')' + (envs[ei].prompt_fragment ? ' \u2014 ' + envs[ei].prompt_fragment : '') + '\n';

    // Clip-requirement-aware generation
    var aiClips = (S.data.clips || []).filter(function(c) { return c.track === 'ai'; });
    if (aiClips.length) {
      prompt += '\n--- CLIP REQUIREMENTS ---\n';
      prompt += 'Generate scenes that cover the needs of these clips:\n';
      for (var ci2 = 0; ci2 < aiClips.length; ci2++) {
        var c = aiClips[ci2];
        prompt += '#' + c.order + ' ' + (c.title || 'Untitled') + ' (' + c.type + '): ' + (c.visual_direction || c.script_text || 'No description').substring(0, 100) + '\n';
        if (c.type === 'ai-character') prompt += '  ^ NEEDS CHARACTER LOOK in scene\n';
      }
    }

    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"scenes":[{"name":"Scene Name","look_ids":["look_id"],"environment_id":"env_id","camera_direction":"camera description","notes":"usage notes","suggested_clips":[1,2]}]}';
    _showAIProgress('analyze-studio', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.scenes) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before scenes gen');
        var created = 0;
        for (var si = 0; si < r.scenes.length; si++) {
          var rs = r.scenes[si];
          var scene = createDefaultScene();
          scene.name = rs.name || 'Scene ' + (si + 1);
          if (rs.look_ids) scene.look_ids = rs.look_ids;
          if (rs.environment_id) scene.environment_id = rs.environment_id;
          scene.camera_direction = rs.camera_direction || '';
          scene.notes = rs.notes || '';
          S.meta.sceneLibrary.push(scene);
          created++;

          // Auto-assign scene to suggested clips
          if (rs.suggested_clips && rs.suggested_clips.length) {
            for (var sc = 0; sc < rs.suggested_clips.length; sc++) {
              var clipOrder = rs.suggested_clips[sc];
              var matchClip = aiClips.find(function(ac) { return ac.order === clipOrder; });
              if (matchClip) {
                ensurePromptSet(matchClip);
                var ff = matchClip.prompt_set.first_frame;
                if (ff && (!ff.scene || !ff.scene.scene_template_id)) {
                  ff.scene = ff.scene || {};
                  ff.scene.scene_template_id = scene.id;
                  ff.scene.look_ids = scene.look_ids || [];
                  ff.scene.environment_id = scene.environment_id || '';
                }
              }
            }
          }
        }
        logActivity('scene_created', 'AI generated ' + created + ' scenes (style-aware)');
        if (snapshot) snapshot('After scenes gen'); buildMaps(); syncToTextarea(); render();
        toast(created + ' scenes generated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'analyze-studio', sp);
  }

  // --- AI Suggest: Brand Library Items ---
  // --- AI Split: Split an overflowing clip into multiple clips ---
  function aiSplitClip(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) { toast('Clip not found', 'error'); return; }
    var wpm = (S.meta && S.meta.settings && S.meta.settings.words_per_minute) || 150;
    var maxWords = getMaxWordsForDuration(clip.duration || 8, wpm);
    var actualWords = countWords(clip.script_text || '');
    if (actualWords <= maxWords) { toast('Script fits within duration — no split needed', 'info'); return; }
    var numClips = Math.ceil(actualWords / maxWords);
    var sp = 'You are a script editor. Split the voiceover script into ' + numClips + ' segments, each max ' + maxWords + ' words. Preserve natural breaks and narrative flow. Output JSON only.';
    var prompt = 'Split this clip\'s voiceover script into ' + numClips + ' segments.\n\n';
    prompt += 'Clip: "' + (clip.title || 'Untitled') + '" (' + clip.type + ', ' + (clip.duration || 8) + 's per clip)\n';
    prompt += 'Max words per segment: ' + maxWords + ' (at ' + wpm + ' WPM for ' + (clip.duration || 8) + 's)\n';
    prompt += 'Original script (' + actualWords + ' words): "' + (clip.script_text || '') + '"\n';
    prompt += 'Visual direction: "' + (clip.visual_direction || '') + '"\n\n';
    prompt += 'Split into EXACTLY ' + numClips + ' segments. Each MUST be <= ' + maxWords + ' words.\n';
    prompt += 'JSON:\n{"segments":[{"title":"short descriptive title","script_text":"voiceover segment (max ' + maxWords + ' words)","visual_direction":"what to show"}]}';

    _showAIProgress('ai-split', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.segments || !r.segments.length) { toast('Could not parse split', 'error'); return; }
        if (snapshot) snapshot('Before clip split');
        // Find clip index
        var clips = S.data.clips || [];
        var clipIdx = -1;
        for (var ci2 = 0; ci2 < clips.length; ci2++) { if (clips[ci2].id === clipId) { clipIdx = ci2; break; } }
        if (clipIdx === -1) { toast('Clip not found', 'error'); return; }
        // Create replacement clips
        var newClips = [];
        for (var si = 0; si < r.segments.length; si++) {
          var seg = r.segments[si];
          var nc = createLightweightClip(clip.type, clip.section, clip.order + si);
          nc.title = _ensureString(seg.title || clip.title + ' (Part ' + (si + 1) + ')');
          nc.script_text = _ensureString(seg.script_text || '');
          nc.visual_direction = _ensureString(seg.visual_direction || clip.visual_direction || '');
          nc.onscreen_text = clip.onscreen_text || '';
          nc.duration = clip.duration || 8;
          nc.timing = { start: 0, end: nc.duration };
          newClips.push(nc);
        }
        // Replace original clip with new clips
        clips.splice(clipIdx, 1);
        for (var ni = newClips.length - 1; ni >= 0; ni--) { clips.splice(clipIdx, 0, newClips[ni]); }
        // Reorder
        for (var ri = 0; ri < clips.length; ri++) { clips[ri].order = ri + 1; }
        recomputeClipTimings();
        logActivity('clip_split', 'Split clip "' + (clip.title || '#' + clip.order) + '" into ' + newClips.length + ' clips');
        if (snapshot) snapshot('After clip split'); buildMaps(); syncToTextarea(); render();
        toast('Clip split into ' + newClips.length + ' segments!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'ai-split', sp);
  }

  // --- Auto-Assign: AI assigns looks/environments to unassigned clips ---
  function autoAssignAssets(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clips = S.data.clips || [];
    var unassigned = clips.filter(function(c) {
      if ((c.track || (Constants.CLIP_TYPES[c.type] || {}).track) !== 'ai') return false;
      var scene = (((c.prompt_set || {}).first_frame || {}).scene || {});
      return !scene.scene_template_id && !(scene.look_ids && scene.look_ids.length) && !scene.environment_id;
    });
    if (!unassigned.length) { toast('All AI clips are assigned', 'info'); return; }
    if (!S.allLooks.length && !S.allEnvironments.length) { toast('Create looks or environments first', 'warning'); return; }

    var sp = 'You are a video production assistant. Assign the best matching look and environment to each unassigned clip. Output JSON only.';
    var prompt = 'Auto-assign looks and environments to these unassigned clips.\n\n' + buildVideoContext();
    if (S.allLooks.length) {
      prompt += '\n\n--- AVAILABLE LOOKS ---\n';
      for (var li = 0; li < S.allLooks.length; li++) { var lk = S.allLooks[li]; prompt += '- ' + lk.id + ': ' + (lk.name || 'Unnamed') + ' (' + (lk.role || '') + ') ' + (lk.combined_prompt_fragment || '').substring(0, 80) + '\n'; }
    }
    if (S.allEnvironments.length) {
      prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
      for (var ei = 0; ei < S.allEnvironments.length; ei++) { var env = S.allEnvironments[ei]; prompt += '- ' + env.id + ': ' + (env.name || 'Unnamed') + ' (' + (env.type || 'indoor') + ') ' + (env.prompt_fragment || '').substring(0, 80) + '\n'; }
    }
    prompt += '\n--- UNASSIGNED CLIPS ---\n';
    for (var ci2 = 0; ci2 < unassigned.length; ci2++) {
      var c = unassigned[ci2];
      prompt += '#' + c.order + ' ' + c.id + ' (' + c.type + '): ' + (c.title || '') + ' \u2014 ' + (c.visual_direction || c.script_text || '').substring(0, 80) + '\n';
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\nFor ai-character clips, ALWAYS assign a look. For all clips, assign an environment.\n';
    prompt += 'JSON:\n{"assignments":[{"clip_id":"clip_id","look_id":"look_id or empty string","environment_id":"env_id or empty string"}]}';

    _showAIProgress('auto-assign', true);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.assignments) { toast('Could not parse', 'error'); return; }
        if (snapshot) snapshot('Before auto-assign');
        var count = 0;
        for (var ai = 0; ai < r.assignments.length; ai++) {
          var a = r.assignments[ai];
          var clip = S.clipMap[a.clip_id]; if (!clip) continue;
          ensurePromptSet(clip);
          clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
          clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
          if (a.look_id && S.lookMap[a.look_id]) { clip.prompt_set.first_frame.scene.look_ids = [a.look_id]; count++; }
          if (a.environment_id && S.envMap[a.environment_id]) { clip.prompt_set.first_frame.scene.environment_id = a.environment_id; count++; }
          maybeAdvanceClipStatus(clip, 'auto-assigned');
        }
        logActivity('auto_assigned', 'AI auto-assigned ' + count + ' assets to ' + r.assignments.length + ' clips');
        if (snapshot) snapshot('After auto-assign'); buildMaps(); syncToTextarea(); render();
        toast(count + ' assignments made!', 'success');
      } catch(e) { toast('Parse error: ' + e.message, 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'auto-assign', sp, { max_tokens: 4000 });
  }

  function suggestBrandItems(actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var bs = S.brandStudio || {};
    if (!bs.loaded || (!bs.looks.length && !bs.environments.length && !bs.characters.length)) {
      toast('No brand library items available', 'info'); return;
    }
    var sp = 'You are a video production assistant. Recommend which brand library assets best fit this video project. Output JSON only.';
    var prompt = 'Suggest which brand library items to use for this video.\n\n' + buildVideoContext();
    prompt += '\n\n--- AVAILABLE BRAND LIBRARY ---\n';
    if (bs.looks.length) {
      prompt += 'LOOKS:\n';
      for (var li = 0; li < bs.looks.length; li++) prompt += '- id: ' + bs.looks[li].id + ', name: ' + (bs.looks[li].name || 'Unnamed') + ', role: ' + (bs.looks[li].role || '') + ', desc: ' + (bs.looks[li].combined_prompt_fragment || '').substring(0, 80) + '\n';
    }
    if (bs.environments.length) {
      prompt += 'ENVIRONMENTS:\n';
      for (var ei = 0; ei < bs.environments.length; ei++) prompt += '- id: ' + bs.environments[ei].id + ', name: ' + (bs.environments[ei].name || 'Unnamed') + ', type: ' + (bs.environments[ei].type || '') + '\n';
    }
    if (bs.scenes.length) {
      prompt += 'SCENES:\n';
      for (var si = 0; si < bs.scenes.length; si++) prompt += '- id: ' + bs.scenes[si].id + ', name: ' + (bs.scenes[si].name || 'Unnamed') + '\n';
    }
    if (bs.characters.length) {
      prompt += 'CHARACTERS:\n';
      for (var chi = 0; chi < bs.characters.length; chi++) prompt += '- id: ' + bs.characters[chi].id + ', name: ' + (bs.characters[chi].name || 'Unnamed') + '\n';
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nSelect the most relevant items. Return ONLY IDs of items that fit this video.\nJSON:\n{"selected_look_ids":["id1"],"selected_environment_ids":["id1"],"selected_scene_ids":["id1"],"selected_character_ids":["id1"],"reasoning":"brief explanation"}';
    _showAIProgress('suggest-brand', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        S.data.start.brand_selections = S.data.start.brand_selections || {};
        if (r.selected_look_ids) S.data.start.brand_selections.selected_look_ids = r.selected_look_ids;
        if (r.selected_environment_ids) S.data.start.brand_selections.selected_environment_ids = r.selected_environment_ids;
        if (r.selected_scene_ids) S.data.start.brand_selections.selected_scene_ids = r.selected_scene_ids;
        if (r.selected_character_ids) S.data.start.brand_selections.selected_character_ids = r.selected_character_ids;
        S.data.start.brand_selections.ai_suggested = true;
        if (snapshot) snapshot('AI brand suggest'); buildMaps(); syncToTextarea(); render();
        toast('Brand items suggested!' + (r.reasoning ? ' ' + r.reasoning.substring(0, 80) : ''), 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'suggest-brand', sp);
  }

  // --- AI Suggest: Clip Scene Assignment ---
  function suggestClipScene(clipId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var clip = S.clipMap[clipId]; if (!clip) { toast('Clip not found', 'error'); return; }
    var hasAssets = (S.allScenes || []).length || (S.allLooks || []).length || (S.allEnvironments || []).length;
    if (!hasAssets) { toast('Create looks, environments, or scenes first', 'warning'); return; }
    var sp = 'You are a video production scene designer. Recommend the best scene, look, and environment for this specific clip. Output JSON only.';
    var prompt = 'Suggest the best scene setup for this clip.\n\n' + buildVideoContext() + '\n\n' + buildClipContext(clip);
    // List available assets
    if ((S.allScenes || []).length) {
      prompt += '\n\n--- AVAILABLE SCENES ---\n';
      for (var si = 0; si < S.allScenes.length; si++) {
        var sc = S.allScenes[si];
        prompt += '- id: ' + sc.id + ', name: ' + (sc.name || 'Unnamed') + ', camera: ' + (sc.camera_direction || '') + '\n';
      }
    }
    if ((S.allLooks || []).length) {
      prompt += '\n--- AVAILABLE LOOKS ---\n';
      for (var li = 0; li < S.allLooks.length; li++) {
        var lk = S.allLooks[li];
        prompt += '- id: ' + lk.id + ', name: ' + (lk.name || 'Unnamed') + ', role: ' + (lk.role || '') + '\n';
      }
    }
    if ((S.allEnvironments || []).length) {
      prompt += '\n--- AVAILABLE ENVIRONMENTS ---\n';
      for (var ei = 0; ei < S.allEnvironments.length; ei++) {
        var env = S.allEnvironments[ei];
        prompt += '- id: ' + env.id + ', name: ' + (env.name || 'Unnamed') + ', type: ' + (env.type || 'indoor') + '\n';
      }
    }
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nPick the best match. If a scene template fits, use it. Otherwise suggest direct look + environment.\nJSON:\n{"scene_template_id":"scene_id or empty","look_ids":["look_id"],"environment_id":"env_id","reasoning":"why this fits"}';
    _showAIProgress('suggest-clip-scene', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r) { toast('Could not parse', 'error'); return; }
        ensurePromptSet(clip);
        clip.prompt_set.first_frame = clip.prompt_set.first_frame || {};
        clip.prompt_set.first_frame.scene = clip.prompt_set.first_frame.scene || {};
        if (r.scene_template_id && S.sceneMap && S.sceneMap[r.scene_template_id]) {
          clip.prompt_set.first_frame.scene.scene_template_id = r.scene_template_id;
          var sc = S.sceneMap[r.scene_template_id];
          clip.prompt_set.first_frame.scene.look_ids = (sc.look_ids || []).slice();
          clip.prompt_set.first_frame.scene.environment_id = sc.environment_id || '';
        } else {
          clip.prompt_set.first_frame.scene.scene_template_id = '';
          if (r.look_ids) clip.prompt_set.first_frame.scene.look_ids = r.look_ids;
          if (r.environment_id) clip.prompt_set.first_frame.scene.environment_id = r.environment_id;
        }
        maybeAdvanceClipStatus(clip, 'AI scene suggestion');
        logActivity('scene_suggested', 'AI suggested scene for clip #' + clip.order + (r.reasoning ? ': ' + r.reasoning.substring(0, 60) : ''));
        if (snapshot) snapshot('AI scene suggest'); buildMaps(); syncToTextarea(); render();
        toast('Scene suggested for clip #' + clip.order + '!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'suggest-clip-scene', sp);
  }

  function regenerateResearchSection(sectionKey, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var labels = { audience_insights: 'Audience Insights', competitor_analysis: 'Competitor Analysis', trending_angles: 'Trending Angles', content_strategy: 'Content Strategy' };
    var sp = 'You are an expert content researcher. Regenerate this specific research section with fresh insights. Output JSON only.';
    var prompt = 'Regenerate the "' + (labels[sectionKey] || sectionKey) + '" section.\n\n' + buildVideoContext();
    var currentContent = (S.data.research || {})[sectionKey] || '';
    if (currentContent) prompt += '\n\nCurrent content (improve upon this): ' + currentContent;
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"content":"detailed fresh analysis"}';
    _showAIProgress('generate-research', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.content) { toast('Could not parse', 'error'); return; }
        S.data.research = S.data.research || {};
        S.data.research[sectionKey] = _ensureString(r.content);
        logActivity('research_updated', 'Regenerated: ' + (labels[sectionKey] || sectionKey));
        if (snapshot) snapshot('Regen research'); buildMaps(); syncToTextarea(); render();
        toast((labels[sectionKey] || 'Section') + ' regenerated!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-research', sp);
  }

  function regenerateThumbnailIdea(ideaId, actionId, ci) {
    if (!LLMService.isConfigured()) { toast('No AI configured', 'warning'); return; }
    var ideas = (S.data.thumbnails || {}).ideas || [];
    var idx = -1;
    for (var i = 0; i < ideas.length; i++) { if (ideas[i].id === ideaId) { idx = i; break; } }
    if (idx === -1) return;
    var sp = 'You are a YouTube thumbnail expert. Generate ONE fresh thumbnail concept to replace the current one. Output JSON only.';
    var prompt = 'Regenerate this thumbnail concept.\n\n' + buildVideoContext();
    prompt += '\nCurrent concept: ' + (ideas[idx].title || '') + ' — ' + (ideas[idx].desc || '');
    prompt += '\nOther concepts to differ from: ' + ideas.filter(function(_, i) { return i !== idx; }).map(function(i) { return i.title; }).join(', ');
    prompt += _buildCustomBlock(actionId, ci);
    prompt += '\n\nJSON:\n{"title":"concept name","desc":"description","text":"overlay text","subtext":"optional","colors":"palette","mood":"energetic|calm|dramatic","layout":"center|split|rule-of-thirds","score":85}';
    _showAIProgress('generate-thumbnails', false);
    LLMService.callAI(prompt, function(text) {
      try {
        var r = parseJSON(text);
        if (!r || !r.title) { toast('Could not parse', 'error'); return; }
        r.id = ideas[idx].id; // preserve ID
        ideas[idx] = r;
        logActivity('thumbnail_updated', 'Regenerated thumbnail: ' + r.title);
        if (snapshot) snapshot('Regen thumbnail'); buildMaps(); syncToTextarea(); render();
        toast('Thumbnail concept refreshed!', 'success');
      } catch(e) { toast('Parse error', 'error'); }
    }, function(err) { toast('AI error: ' + err, 'error'); }, actionId || 'generate-thumbnails', sp);
  }

  function thumbnailChatAI(userMessage) {
    if (!LLMService.isConfigured()) {
      // Fallback: echo-style placeholder
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'AI not configured. Your feedback "' + userMessage + '" has been noted. Configure AI in Settings for real-time refinement.', timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      return;
    }
    var idea = (S.data.thumbnails.ideas || []).find(function(i) { return i.id === S.selectedThumbnailId; });
    var sp = 'You are a YouTube thumbnail design expert. Help refine a thumbnail concept based on user feedback. Be specific about visual changes. Respond naturally in 2-3 sentences.';
    var prompt = 'Thumbnail concept: "' + ((idea || {}).title || '') + '"\nDescription: ' + ((idea || {}).desc || '');
    prompt += '\n\nChat history:\n';
    var history = S.data.thumbnails.chat_history || [];
    for (var i = Math.max(0, history.length - 6); i < history.length; i++) {
      prompt += history[i].role + ': ' + history[i].text + '\n';
    }
    prompt += '\nUser: ' + userMessage;
    prompt += '\n\nRespond with specific visual refinement advice. Do NOT output JSON.';
    _showAIProgress('generate-thumbnails', false);
    LLMService.callAI(prompt, function(text) {
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: text, timestamp: new Date().toISOString() });
      syncToTextarea(); render();
      setTimeout(function() { var $msgs = $('#vpmThumbChatMessages'); if ($msgs.length) $msgs.scrollTop($msgs[0].scrollHeight); }, 50);
    }, function(err) {
      S.data.thumbnails.chat_history.push({ role: 'assistant', text: 'Sorry, I encountered an error: ' + err + '. Please try again.', timestamp: new Date().toISOString() });
      syncToTextarea(); render();
    }, 'generate-thumbnails', sp);
  }


  // ============================================================
  // SECTION 13: SETTINGS VIEW — WIREFRAME-ACCURATE (5 tabs)
  // ============================================================

  function renderSettingsView() {
    var html = '<div class="vpm-view"><div class="vpm-view-header"><h2 class="vpm-view-title">' + icon('gear') + ' Settings</h2></div>';
    html += '<div class="vpm-inner-tabs">';
    for (var tk in Constants.SETTINGS_TABS) {
      var t = Constants.SETTINGS_TABS[tk];
      html += '<button class="vpm-inner-tab' + (S.currentSettingsTab === tk ? ' vpm-inner-tab-active' : '') + '" data-action="settings-tab" data-tab="' + tk + '">' + icon(t.icon) + ' ' + esc(t.label) + '</button>';
    }
    html += '</div>';
    switch (S.currentSettingsTab) {
      case 'general':        html += _settingsGeneral(); break;
      case 'ai':             html += _settingsAI(); break;
      case 'defaults':       html += _settingsDefaults(); break;
      case 'brand':          html += _settingsBrand(); break;
      case 'import-export':  html += _settingsImportExport(); break;
      default: html += _settingsGeneral();
    }
    html += '</div>';
    return html;
  }

  // --- TAB: GENERAL (Video Info + Default Preferences) ---
  function _settingsGeneral() {
    var v = S.data.video || {}; var st = S.data.start || {}; var prefs = st.preferences || {};
    var clips = S.data.clips || []; var totalDur = 0; for (var i = 0; i < clips.length; i++) totalDur += clips[i].duration || 0;
    var html = '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('info') + ' Video Info</div>';
    html += '<div class="vpm-settings-grid">';
    html += _infoRow('Title', esc(v.title || 'Untitled'));
    html += _infoRow('Status', statusBadge(S.computedStatus));
    html += _infoRow('Mode', badge(S.mode === 'advanced' ? 'Advanced \u00B7 7 stages' : 'Standard \u00B7 5 stages', S.mode === 'advanced' ? '#7c3aed' : '#1a73e8'));
    html += _infoRow('Platform', esc(((Constants.PLATFORMS[prefs.platform] || {}).label || prefs.platform || 'YouTube') + ' \u00B7 ' + (prefs.aspect_ratio || '16:9')));
    html += _infoRow('Clips', clips.length + ' clips \u00B7 ' + formatDuration(totalDur));
    html += _infoRow('Script', (S.data.script.total_word_count || 0) + ' words \u00B7 ' + formatDuration(S.data.script.estimated_duration || 0));
    html += _infoRow('Created', v.created ? formatDate(v.created) : '\u2014');
    html += _infoRow('Modified', v.modified ? formatRelativeTime(v.modified) : '\u2014');
    html += _infoRow('Language', (Constants.LANGUAGES[prefs.language] || {}).label || prefs.language || 'English');
    html += '</div></div>';

    // Default Preferences
    var stg = S.meta.settings || {};
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('sliders') + ' Default Preferences</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">These defaults apply when creating new videos. Override per-video in Start stage.</p>';
    html += '<div class="vpm-form-grid">';
    html += _settingsSelect('Default Language', 'default_language', stg.default_language, Constants.LANGUAGES);
    html += _settingsSelect('Default Platform', 'default_platform', stg.default_platform, Constants.PLATFORMS);
    html += _settingsSelect('Default Production Mode', 'default_production_mode', stg.default_production_mode, Constants.PRODUCTION_MODES);
    html += _settingsSelect('Default Presenter', 'default_presenter', stg.default_presenter, Constants.PRESENTER_PREFS);
    html += _settingsSelect('Default Aspect Ratio', 'default_aspect_ratio', stg.default_aspect_ratio, Constants.ASPECT_RATIOS);
    html += _settingsSelect('Default Audio Mode', 'default_audio_mode', stg.default_audio_mode, Constants.AUDIO_MODES);
    html += '</div></div>';
    return html;
  }

  function _infoRow(label, value) {
    return '<div class="vpm-info-row"><span class="vpm-info-label">' + label + '</span><span class="vpm-info-value">' + value + '</span></div>';
  }

  function _settingsSelect(label, path, currentVal, options) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">' + esc(label) + '</label><select class="vpm-select" data-setting-path="' + path + '">';
    for (var k in options) html += '<option value="' + k + '"' + (currentVal === k ? ' selected' : '') + '>' + esc(options[k].label || k) + '</option>';
    html += '</select></div>';
    return html;
  }

  // --- TAB: AI PROVIDERS (wireframe layout with provider cards) ---
  function _settingsAI() {
    var html = '';
    // Info banner
    html += '<div class="vpm-info-banner">' + icon('info') + ' <span>Providers are configured in your <strong>Drupal user profile</strong>. Active providers and their enabled models appear below.</span></div>';

    if (!LLMService.isConfigured()) {
      html += '<div class="vpm-panel"><div class="vpm-empty-hero"><div class="vpm-empty-hero-icon">' + icon('microchip') + '</div><h3>No AI Providers</h3><p>Configure AI providers in your Drupal user profile to enable AI features.</p></div></div>';
      return html;
    }

    // Text AI Default Selector
    var def = LLMService.getDefault();
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('robot') + ' Text AI Default</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:10px">This model is used for all AI actions unless overridden per-action in the preflight modal.</p>';
    if (def) {
      html += '<div class="vpm-settings-ai-current"><span class="vpm-text-xs vpm-text-muted">Current Default:</span> <strong class="vpm-text-sm">' + esc(def.provider) + ' / ' + esc(def.model) + '</strong></div>';
    }
    html += '<div class="vpm-settings-ai-picker">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Provider</label>' + LLMService.renderInlinePicker('app-default').split('</select>')[0] + '</select></div>';
    html += '<button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="set-app-ai-default" style="align-self:flex-end">' + icon('check') + ' Set Default</button>';
    html += '</div></div>';

    // Provider Cards
    var providers = LLMService.getActiveProviders();
    html += '<div class="vpm-settings-section-label">' + icon('microchip') + ' Active Providers (' + providers.length + ')</div>';
    for (var pi = 0; pi < providers.length; pi++) {
      var p = providers[pi]; var isD = def && def.provider === p.id;
      html += '<div class="vpm-provider-card' + (isD ? ' vpm-provider-card-default' : '') + '">';
      html += '<div class="vpm-provider-header"><div class="vpm-provider-header-left"><span class="vpm-provider-icon">' + icon('sparkles') + '</span><span class="vpm-provider-name">' + esc(p.label) + '</span></div>';
      html += '<span class="vpm-text-xs vpm-text-muted">' + p.activeModels.length + ' model' + (p.activeModels.length > 1 ? 's' : '') + '</span></div>';
      html += '<div class="vpm-provider-key"><span class="vpm-provider-key-icon">' + icon('lock') + '</span><span class="vpm-provider-key-text">\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' + (p.api_key ? p.api_key.slice(-4) : '') + '</span></div>';
      html += '<div class="vpm-provider-models">';
      for (var mi = 0; mi < p.activeModels.length; mi++) {
        var m = p.activeModels[mi]; var isMD = def && def.provider === p.id && def.model === m.id;
        html += '<div class="vpm-provider-model-row' + (isMD ? ' vpm-provider-model-default' : '') + '">';
        html += '<span class="vpm-provider-model-name">' + esc(m.label || m.id);
        if (isMD) html += ' <span class="vpm-provider-default-star">\u2605</span>';
        html += '</span>';
        html += '<span class="vpm-provider-model-meta"><span>temp ' + (m.temperature !== undefined ? m.temperature : 1) + '</span><span>' + ((m.max_tokens || 8192) >= 1000 ? ((m.max_tokens || 8192) / 1000) + 'k' : (m.max_tokens || 8192)) + ' tok</span></span>';
        html += '</div>';
      }
      html += '</div></div>';
    }

    // Image & Video Models
    var prefs = S.meta.aiPreferences || {};
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('image') + ' Image & Video Models</div><div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Image Generation Model</label><select class="vpm-select" data-action="save-ai-pref" data-field="imageModel">';
    for (var imk in Constants.IMAGE_MODELS) html += '<option value="' + imk + '"' + (prefs.imageModel === imk ? ' selected' : '') + '>' + esc(Constants.IMAGE_MODELS[imk].label) + '</option>';
    html += '</select></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Video Generation Model</label><select class="vpm-select" data-action="save-ai-pref" data-field="videoModel">';
    for (var vmk in Constants.VIDEO_MODELS) { var vm = Constants.VIDEO_MODELS[vmk]; html += '<option value="' + vmk + '"' + (prefs.videoModel === vmk ? ' selected' : '') + '>' + esc(vm.label) + ' \u2014 max ' + (vm.maxDuration || vm.defaultDuration || 8) + 's</option>'; }
    html += '</select></div></div>';
    html += '<div class="vpm-form-group" style="margin-top:8px"><label class="vpm-form-label">Global Negative Prompt</label>';
    html += '<textarea class="vpm-textarea" data-action="save-ai-pref-text" data-field="globalNegative" rows="2" style="font-family:var(--vpm-font-mono);font-size:11px">' + esc(prefs.globalNegative || '') + '</textarea>';
    html += '<span class="vpm-text-xs vpm-text-muted" style="margin-top:3px;display:block">Applied to all image/video generation prompts automatically.</span></div></div>';

    // Current Video Profile (read-only from start preferences)
    var startPrefs = ((S.data.start || {}).preferences || {});
    var vs = startPrefs.video_style || '';
    var vsDef = (Constants.VIDEO_STYLES || {})[vs] || {};
    var am = startPrefs.audio_mode || '';
    var amDef = (Constants.AUDIO_MODES || {})[am] || {};
    var vp = startPrefs.voice_profile || {};
    if (vs || am || vp.style) {
      html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('palette') + ' Current Video Profile</div>';
      html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:8px">Configured in the Start stage for this video.</p>';
      if (vs) html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Video Style:</strong> <span class="vpm-text-sm">' + esc(vsDef.label || vs) + '</span></div>';
      if (am) html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Audio Mode:</strong> <span class="vpm-text-sm">' + esc(amDef.label || am) + '</span></div>';
      if (vp.style || vp.gender || vp.custom_description) {
        var vpParts = [];
        if (vp.gender) vpParts.push(vp.gender);
        if (vp.age_range) vpParts.push(vp.age_range.replace(/-/g, ' '));
        if (vp.style) vpParts.push(vp.style);
        if (vp.accent && vp.accent !== 'neutral') vpParts.push(vp.accent + ' accent');
        if (vp.custom_description) vpParts.push(vp.custom_description);
        html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><strong class="vpm-text-sm">Voice Profile:</strong> <span class="vpm-text-sm">' + esc(vpParts.join(', ')) + '</span></div>';
      }
      html += '</div>';
    }

    return html;
  }

  // --- TAB: DEFAULTS (Production + Duration + AI Behavior) ---
  function _settingsDefaults() {
    var stg = S.meta.settings || {};
    // Production Defaults
    var html = '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('film') + ' Production Defaults</div><div class="vpm-form-grid">';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Default Clip Duration (seconds)</label><input class="vpm-input" type="number" value="' + (stg.default_clip_duration || 8) + '" data-setting-path="default_clip_duration" data-setting-type="int"></div>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Words Per Minute (WPM)</label><input class="vpm-input" type="number" value="' + (stg.words_per_minute || 150) + '" data-setting-path="words_per_minute" data-setting-type="int"><span class="vpm-text-xs vpm-text-muted">Used for estimating script section durations.</span></div>';
    html += '</div></div>';

    // Video Duration Control
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('clock') + ' Video Duration Control</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Control how AI clip durations are enforced based on video model limits.</p>';
    html += _settingsToggle('strict_ai_duration', stg.strict_ai_duration, 'Strict Duration Mode', 'AI clip durations are restricted to exact valid values for the selected model.');
    html += _settingsToggle('snap_to_model_durations', stg.snap_to_model_durations, 'Auto-Snap Durations', 'Automatically round clip durations to the nearest valid value when editing or generating clips.');
    // Model duration cards
    html += '<div class="vpm-settings-section-label" style="margin-top:16px">' + icon('film') + ' Model Duration Ranges</div>';
    var prefs = S.meta.aiPreferences || {};
    for (var vmId in Constants.VIDEO_MODELS) {
      var vm = Constants.VIDEO_MODELS[vmId];
      var isActive = (prefs.videoModel || '') === vmId;
      html += '<div class="vpm-dur-model-card' + (isActive ? ' vpm-dur-model-active' : '') + '">';
      html += '<div class="vpm-dur-model-header"><span class="vpm-dur-model-name">' + esc(vm.label) + '</span>';
      if (isActive) html += badge('Default', '#0d904f');
      html += '</div><div class="vpm-dur-model-details">';
      html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Max Duration</span><span class="vpm-dur-detail-value">' + (vm.maxDuration || 8) + 's</span></div>';
      if (vm.durations && vm.durations.length) {
        html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Valid Durations</span><span class="vpm-dur-detail-value">';
        for (var di = 0; di < vm.durations.length; di++) html += '<span class="vpm-dur-chip">' + vm.durations[di] + 's</span>';
        html += '</span></div>';
      }
      if (vm.notes) html += '<div class="vpm-dur-detail"><span class="vpm-dur-detail-label">Notes</span><span class="vpm-dur-detail-value vpm-text-muted">' + esc(vm.notes) + '</span></div>';
      html += '</div></div>';
    }
    html += '</div>';

    // AI Behavior
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('sparkles') + ' AI Behavior</div>';
    html += _settingsToggle('show_ai_preflight', stg.show_ai_preflight, 'Show AI Preflight Modal', 'Opens a modal before every AI action where you can pick the model and add custom instructions.');
    html += '<div class="vpm-form-group" style="margin-top:12px"><label class="vpm-form-label">' + icon('globe') + ' Global AI Instructions</label>';
    html += '<textarea class="vpm-textarea" data-action="save-setting-text" data-setting-path="ai_global_instructions" rows="3" placeholder="e.g. Always use simple English, focus on beginners\u2026">' + esc(stg.ai_global_instructions || '') + '</textarea>';
    html += '<span class="vpm-text-xs vpm-text-muted" style="margin-top:3px;display:block">These instructions are included in every AI prompt across all actions.</span></div></div>';
    return html;
  }

  function _settingsToggle(path, isOn, label, desc) {
    return '<div class="vpm-settings-toggle" data-action="toggle-setting-bool" data-setting-path="' + path + '"><div class="vpm-toggle-track' + (isOn ? ' vpm-toggle-on' : '') + '"><div class="vpm-toggle-thumb"></div></div><div class="vpm-toggle-text"><span class="vpm-toggle-label">' + esc(label) + '</span><span class="vpm-toggle-desc">' + esc(desc) + '</span></div></div>';
  }

  // --- TAB: BRAND CONTEXT ---
  function _settingsBrand() {
    var bo = S.meta.brandOverrides || {};
    var brandLoaded = S.brand && S.brand.configured;
    var html = '';
    html += '<div class="vpm-info-banner">' + icon('info') + ' <span>Brand context is loaded from the <strong>.brand-data</strong> element on the page. If no brand is configured, enable the override below.</span></div>';

    // Brand from page (read-only)
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('palette') + ' Brand Context (from Page)</div>';
    if (brandLoaded) {
      var core = (S.brand || {}).core || {};
      html += '<div class="vpm-settings-grid">';
      html += _infoRow('Brand Name', esc(core.brand_name || '\u2014'));
      html += _infoRow('Tagline', esc(core.tagline || '\u2014'));
      html += _infoRow('Voice / Tone', esc(core.voice || '\u2014'));
      html += _infoRow('Target Audience', esc(typeof core.audience === 'string' ? core.audience : '\u2014'));
      html += '</div>';
      html += '<div class="vpm-brand-status"><span class="vpm-brand-status-dot vpm-brand-status-on"></span> Brand context loaded</div>';
    } else {
      html += '<div class="vpm-brand-status"><span class="vpm-brand-status-dot"></span> No brand data detected on page</div>';
    }
    html += '</div>';

    // Override
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('pen') + ' Brand Override</div>';
    html += _settingsToggle('_brand_override', bo.enabled, 'Override brand context for this video', 'Use custom brand values instead of the page-level brand data.');
    if (bo.enabled) {
      html += '<div class="vpm-info-banner" style="margin-top:12px;background:var(--vpm-warning-light);border-color:var(--vpm-warning)">' + icon('warning') + ' Overrides only affect <strong>this video</strong>. The page-level brand context is not modified.</div>';
      html += '<div class="vpm-form-grid" style="margin-top:12px">';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Brand Name</label><input class="vpm-input" data-action="save-brand-override" data-field="name" value="' + esc(bo.name || '') + '"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Tagline</label><input class="vpm-input" data-action="save-brand-override" data-field="tagline" value="' + esc(bo.tagline || '') + '"></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Primary Color</label><div class="vpm-flex-row"><input type="color" value="' + esc(bo.primary_color || '#1a73e8') + '" data-action="save-brand-override" data-field="primary_color" style="width:32px;height:32px;border:none;cursor:pointer;border-radius:4px"><input class="vpm-input" style="flex:1" data-action="save-brand-override" data-field="primary_color" value="' + esc(bo.primary_color || '') + '"></div></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Secondary Color</label><div class="vpm-flex-row"><input type="color" value="' + esc(bo.secondary_color || '#0d904f') + '" data-action="save-brand-override" data-field="secondary_color" style="width:32px;height:32px;border:none;cursor:pointer;border-radius:4px"><input class="vpm-input" style="flex:1" data-action="save-brand-override" data-field="secondary_color" value="' + esc(bo.secondary_color || '') + '"></div></div>';
      html += '</div>';
      html += '<div class="vpm-form-group" style="margin-top:8px"><label class="vpm-form-label">Voice / Tone</label><textarea class="vpm-textarea" data-action="save-brand-override" data-field="voice" rows="2">' + esc(bo.voice || '') + '</textarea></div>';
      html += '<div class="vpm-form-group"><label class="vpm-form-label">Target Audience</label><textarea class="vpm-textarea" data-action="save-brand-override" data-field="target_audience" rows="2">' + esc(bo.target_audience || '') + '</textarea></div>';
    }
    html += '</div>';
    return html;
  }

  // --- TAB: IMPORT / EXPORT ---
  function _settingsImportExport() {
    var html = '';
    // Config Export
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('download') + ' Export Configuration</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Export your settings, AI preferences, and brand overrides as a portable JSON file to reuse across videos.</p>';
    html += '<div class="vpm-ie-checklist">';
    var exportItems = [
      { icon: 'gear', label: 'General settings & defaults' },
      { icon: 'microchip', label: 'AI preferences (provider selections, per-action prefs)' },
      { icon: 'palette', label: 'Brand overrides' },
      { icon: 'user-check', label: 'Entity library (looks, environments, scenes)' }
    ];
    for (var ei = 0; ei < exportItems.length; ei++) {
      html += '<div class="vpm-ie-check-item">' + icon(exportItems[ei].icon) + ' <span>' + esc(exportItems[ei].label) + '</span></div>';
    }
    html += '</div>';
    html += '<div class="vpm-info-banner" style="margin-top:8px">' + icon('lock') + ' API keys are <strong>never</strong> exported. They remain in your Drupal user profile.</div>';
    html += '<div class="vpm-btn-row" style="margin-top:12px"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="export-config">' + icon('download') + ' Export Settings (JSON)</button></div>';
    html += '</div>';

    // Config Import
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('upload') + ' Import Configuration</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Import settings from a previously exported JSON file. Existing settings will be merged.</p>';
    html += '<div class="vpm-form-group"><label class="vpm-form-label">Paste Configuration JSON</label>';
    html += '<textarea class="vpm-textarea" id="vpmSettingsImportJson" rows="6" style="font-family:var(--vpm-font-mono);font-size:11px" placeholder=\'{"_type":"vpm-config","_version":"1.0.0","settings":{...}}\'></textarea></div>';
    html += '<div class="vpm-btn-row" style="margin-top:8px"><button class="vpm-btn vpm-btn-primary vpm-btn-sm" data-action="import-config-inline">' + icon('upload') + ' Import & Merge</button></div>';
    html += '</div>';

    // Entity Export/Import
    html += '<div class="vpm-panel"><div class="vpm-panel-title">' + icon('layer-group') + ' Entity Library Export / Import</div>';
    html += '<p class="vpm-text-xs vpm-text-muted" style="margin-bottom:12px">Export or import your visual entities separately from settings.</p>';
    html += '<div class="vpm-entity-ie-grid">';
    var entities = [
      { type: 'look', icon: 'user-check', label: 'Looks / Avatars', count: (S.meta.lookLibrary || []).length },
      { type: 'environment', icon: 'panorama', label: 'Environments', count: (S.meta.environmentLibrary || []).length },
      { type: 'scene', icon: 'image', label: 'Scenes', count: (S.meta.sceneLibrary || []).length }
    ];
    for (var eni = 0; eni < entities.length; eni++) {
      var ent = entities[eni];
      html += '<div class="vpm-entity-ie-card"><div class="vpm-entity-ie-head">' + icon(ent.icon) + ' ' + esc(ent.label) + ' <span class="vpm-entity-ie-count">' + ent.count + '</span></div>';
      html += '<div class="vpm-entity-ie-actions"><button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="export-all-entities" data-entity-type="' + ent.type + '">' + icon('download') + ' Export</button>';
      html += '<button class="vpm-btn vpm-btn-outline vpm-btn-sm" data-action="import-entity" data-entity-type="' + ent.type + '">' + icon('upload') + ' Import</button></div></div>';
    }
    html += '</div></div>';

    // Danger Zone
    html += '<div class="vpm-panel vpm-panel-danger"><div class="vpm-panel-title" style="color:var(--vpm-error)">' + icon('warning') + ' Danger Zone</div>';
    html += '<div class="vpm-danger-grid">';
    html += _dangerItem('Reset All Prompts', 'Clear all generated image/video prompts from clips. Scene assignments remain.', icon('arrows-rotate') + ' Reset Prompts', 'reset-all-prompts');
    html += _dangerItem('Delete All Clips', 'Remove all clips from this video. Script and blueprint remain intact.', icon('trash') + ' Delete Clips', 'clear-all-clips');
    html += _dangerItem('Reset Studio Entities', 'Delete all looks, environments, and scenes for this video.', icon('trash') + ' Reset Studio', 'reset-studio');
    html += _dangerItem('Factory Reset Meta', 'Reset all meta settings to default values. Video data is not affected.', icon('warning') + ' Factory Reset', 'factory-reset-meta');
    html += '</div></div>';
    return html;
  }

  function _dangerItem(title, desc, btnHtml, action) {
    return '<div class="vpm-danger-item"><div class="vpm-danger-item-text"><strong>' + esc(title) + '</strong><span class="vpm-text-xs vpm-text-muted">' + esc(desc) + '</span></div><button class="vpm-btn vpm-btn-danger vpm-btn-sm" data-action="' + action + '">' + btnHtml + '</button></div>';
  }


  // ============================================================
  // SECTION 14: IMPORT / EXPORT HELPERS
  // ============================================================

  function _exportAllEntities(type) {
    var lib = S.meta[type + 'Library'] || [];
    if (!lib.length) { toast('No ' + type + 's to export', 'info'); return; }
    if (exportFile) exportFile(type + 's.json', JSON.stringify(lib, null, 2), 'application/json');
  }

  function _importEntity(type) {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Paste JSON</label>';
    html += '<textarea class="vpm-textarea" data-field="json" rows="8" placeholder="Paste entity JSON\u2026"></textarea></div>';
    openModal('Import ' + type, html, { saveLabel: 'Import', onSave: function() {
      var data = collectModalFields(); var parsed = parseJSON(data.json);
      if (!parsed) { toast('Invalid JSON', 'error'); return; }
      var lib = type + 'Library'; S.meta[lib] = S.meta[lib] || [];
      if (Array.isArray(parsed)) { for (var i = 0; i < parsed.length; i++) { parsed[i].id = generateId(type.substring(0, 3)); parsed[i].source = 'video'; S.meta[lib].push(parsed[i]); } }
      else { parsed.id = generateId(type.substring(0, 3)); parsed.source = 'video'; S.meta[lib].push(parsed); }
      logActivity(type + '_created', 'Imported ' + type + '(s)');
      if (snapshot) snapshot('Import ' + type); buildMaps(); syncToTextarea(); closeModal(); render();
      toast(type + ' imported!', 'success');
    }});
  }

  function _exportConfig() {
    var config = { _type: 'vpm-config', _version: '1.0.0', _exported_at: new Date().toISOString(), settings: deepClone(S.meta.settings || {}), aiPreferences: deepClone(S.meta.aiPreferences || {}), brandOverrides: deepClone(S.meta.brandOverrides || {}) };
    if (exportFile) exportFile('config.json', JSON.stringify(config, null, 2), 'application/json');
  }

  function _importConfig() {
    var html = '<div class="vpm-form-group"><label class="vpm-form-label">Paste Config JSON</label>';
    html += '<textarea class="vpm-textarea" data-field="json" rows="10" placeholder="Paste vpm-config JSON\u2026"></textarea></div>';
    openModal('Import Configuration', html, { saveLabel: icon('upload') + ' Import', onSave: function() {
      var data = collectModalFields(); var parsed = parseJSON(data.json);
      if (!parsed || parsed._type !== 'vpm-config') { toast('Invalid config file', 'error'); return; }
      if (snapshot) snapshot('Before config import');
      if (parsed.settings) S.meta.settings = $.extend(true, {}, S.meta.settings || {}, parsed.settings);
      if (parsed.aiPreferences) { var imp = deepClone(parsed.aiPreferences); delete imp.lastCustomInstructions; S.meta.aiPreferences = $.extend(true, {}, S.meta.aiPreferences || {}, imp); }
      if (parsed.brandOverrides) S.meta.brandOverrides = $.extend(true, {}, S.meta.brandOverrides || {}, parsed.brandOverrides);
      logActivity('settings_changed', 'Imported configuration');
      if (snapshot) snapshot('After config import'); buildMaps(); syncToTextarea(); closeModal(); render();
      toast('Config imported!', 'success');
    }});
  }


  // ============================================================
  // SECTION 15: EVENT HANDLERS
  // ============================================================

  function setupPart2BEvents() {
    // Settings tabs
    $(document).off('click.vpm2b-stab').on('click.vpm2b-stab', '[data-action="settings-tab"]', function(e) { e.preventDefault(); S.currentSettingsTab = $(this).data('tab'); render(); });

    // Settings save
    $(document).off('change.vpm2b-ssi blur.vpm2b-ssi').on('change.vpm2b-ssi blur.vpm2b-ssi', 'input[data-setting-path]', function() {
      var path = $(this).data('setting-path'); var type = $(this).data('setting-type');
      S.meta.settings = S.meta.settings || {};
      S.meta.settings[path] = type === 'int' ? (parseInt($(this).val(), 10) || 0) : $(this).val();
      syncToTextarea();
    });
    $(document).off('change.vpm2b-ssc').on('change.vpm2b-ssc', 'select[data-setting-path]', function() {
      S.meta.settings = S.meta.settings || {}; S.meta.settings[$(this).data('setting-path')] = $(this).val(); syncToTextarea();
    });
    // Toggle switches (div-based, not checkbox)
    $(document).off('click.vpm2b-stb').on('click.vpm2b-stb', '[data-action="toggle-setting-bool"]', function() {
      var path = $(this).data('setting-path');
      if (path === '_brand_override') {
        // Special: brand override toggle
        S.meta.brandOverrides = S.meta.brandOverrides || {};
        S.meta.brandOverrides.enabled = !S.meta.brandOverrides.enabled;
        BrandService.init(); syncToTextarea(); render();
        return;
      }
      S.meta.settings = S.meta.settings || {};
      S.meta.settings[path] = !S.meta.settings[path];
      logActivity('settings_changed', path + ' = ' + (S.meta.settings[path] ? 'ON' : 'OFF'));
      syncToTextarea(); render();
    });
    $(document).off('blur.vpm2b-sst').on('blur.vpm2b-sst', '[data-action="save-setting-text"]', function() {
      S.meta.settings = S.meta.settings || {}; S.meta.settings[$(this).data('setting-path')] = $(this).val(); syncToTextarea();
    });
    $(document).off('click.vpm2b-sad').on('click.vpm2b-sad', '[data-action="set-app-ai-default"]', function() {
      var sel = LLMService.resolveSelection('app-default');
      var $p = $('.vpm-ai-provider-select[data-action-id="app-default"]'), $m = $('.vpm-ai-model-select[data-action-id="app-default"]');
      if ($p.length) sel = { provider: $p.val(), model: $m.val() };
      S.meta.aiPreferences = S.meta.aiPreferences || {};
      S.meta.aiPreferences.appDefault = { provider: sel.provider, model: sel.model };
      syncToTextarea(); toast('Default AI set: ' + sel.provider + '/' + sel.model, 'success');
    });
    $(document).off('change.vpm2b-sap').on('change.vpm2b-sap', '[data-action="save-ai-pref"]', function() {
      S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences[$(this).data('field')] = $(this).val(); syncToTextarea();
    });
    $(document).off('blur.vpm2b-sapt').on('blur.vpm2b-sapt', '[data-action="save-ai-pref-text"]', function() {
      S.meta.aiPreferences = S.meta.aiPreferences || {}; S.meta.aiPreferences[$(this).data('field')] = $(this).val(); syncToTextarea();
    });
    // Brand override field saves
    $(document).off('blur.vpm2b-sbo').on('blur.vpm2b-sbo', '[data-action="save-brand-override"]', function() {
      S.meta.brandOverrides = S.meta.brandOverrides || {};
      S.meta.brandOverrides[$(this).data('field')] = $(this).val();
      BrandService.init(); syncToTextarea();
    });

    // Inline config import (from Import/Export tab textarea)
    $(document).off('click.vpm2b-ici').on('click.vpm2b-ici', '[data-action="import-config-inline"]', function(e) {
      e.preventDefault();
      var json = ($('#vpmSettingsImportJson').val() || '').trim();
      if (!json) { toast('Paste config JSON first', 'warning'); return; }
      var parsed = parseJSON(json);
      if (!parsed || parsed._type !== 'vpm-config') { toast('Invalid config file', 'error'); return; }
      if (snapshot) snapshot('Before config import');
      if (parsed.settings) S.meta.settings = $.extend(true, {}, S.meta.settings || {}, parsed.settings);
      if (parsed.aiPreferences) { var imp = deepClone(parsed.aiPreferences); delete imp.lastCustomInstructions; S.meta.aiPreferences = $.extend(true, {}, S.meta.aiPreferences || {}, imp); }
      if (parsed.brandOverrides) S.meta.brandOverrides = $.extend(true, {}, S.meta.brandOverrides || {}, parsed.brandOverrides);
      logActivity('settings_changed', 'Imported configuration');
      if (snapshot) snapshot('After config import'); buildMaps(); syncToTextarea(); render();
      toast('Config imported & merged!', 'success');
    });

    // Reset Studio Entities
    $(document).off('click.vpm2b-rse').on('click.vpm2b-rse', '[data-action="reset-studio"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Reset Studio Entities?', message: 'Delete all looks, environments, and scenes for this video. Brand entities are unaffected.', danger: true, onConfirm: function() {
        S.meta.lookLibrary = []; S.meta.environmentLibrary = []; S.meta.sceneLibrary = [];
        S.meta.studioRequirements = {};
        logActivity('settings_changed', 'Reset all studio entities');
        if (snapshot) snapshot('Reset studio'); buildMaps(); syncToTextarea(); render();
        toast('Studio entities cleared', 'success');
      }});
    });

    // Factory Reset Meta
    $(document).off('click.vpm2b-frm').on('click.vpm2b-frm', '[data-action="factory-reset-meta"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Factory Reset Settings?', message: 'Reset all meta settings and AI preferences to default values. Video data (script, clips) is <strong>not</strong> affected.', danger: true, onConfirm: function() {
        var getDefaultMeta = window._vpmGetDefaultMeta;
        var fresh = getDefaultMeta();
        S.meta.settings = fresh.settings;
        S.meta.aiPreferences = fresh.aiPreferences;
        S.meta.brandOverrides = fresh.brandOverrides;
        // Keep entity libraries intact
        logActivity('settings_changed', 'Factory reset — settings restored to defaults');
        if (snapshot) snapshot('Factory reset meta'); BrandService.init(); buildMaps(); syncToTextarea(); render();
        toast('Settings reset to defaults', 'success');
      }});
    });
    // AI provider picker cascade
    $(document).off('change.vpm2b-apch').on('change.vpm2b-apch', '.vpm-ai-provider-select', function() {
      var aid = $(this).data('action-id'); var pid = $(this).val();
      var models = LLMService.getActiveModels(pid); var $m = $('.vpm-ai-model-select[data-action-id="' + aid + '"]');
      var html = ''; for (var i = 0; i < models.length; i++) { var _m = models[i]; html += '<option value="' + esc(_m.id) + '" data-temp="' + (_m.temperature !== undefined ? _m.temperature : 1.0) + '" data-tokens="' + (_m.max_tokens || 8192) + '">' + esc(_m.label || _m.id) + '</option>'; }
      $m.html(html);
    });

    // --- AI Actions (wiring buttons to execution functions) ---
    $(document).off('click.vpm2b-aia').on('click.vpm2b-aia', '[data-action="ai-generate-research"]', function(e) { e.preventDefault(); _launchAI('generate-research', 'Research brief from video idea', generateResearch); });
    $(document).off('click.vpm2b-ags').on('click.vpm2b-ags', '[data-action="ai-generate-script"]', function(e) { e.preventDefault(); _launchAI('generate-script', 'Full script from blueprint sections', generateScript); });
    $(document).off('click.vpm2b-aes').on('click.vpm2b-aes', '[data-action="ai-enhance-section"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('enhance-script', 'Enhance section', function(ci) { enhanceSection(sid, 'enhance-script', ci); }); });
    $(document).off('click.vpm2b-agss').on('click.vpm2b-agss', '[data-action="ai-generate-section-script"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('generate-script', 'Generate script for section', function(ci) { generateScriptSection(sid, 'generate-script', ci); }); });
    $(document).off('click.vpm2b-agc').on('click.vpm2b-agc', '[data-action="ai-generate-clips"]', function(e) { e.preventDefault(); _launchAI('generate-clips', 'Break entire script into clips', generateClips); });
    $(document).off('click.vpm2b-gsc').on('click.vpm2b-gsc', '[data-action="generate-section-clips"]', function(e) { e.preventDefault(); var sid = $(this).data('section-id'); _launchAI('generate-clips', 'Generate clips for section', function(ci) { generateClipsForSection(sid, 'generate-clips', ci); }); });
    $(document).off('click.vpm2b-aas').on('click.vpm2b-aas', '[data-action="ai-analyze-studio"]', function(e) { e.preventDefault(); _launchAI('analyze-studio', 'Analyze clips for studio needs', analyzeStudio); });
    $(document).off('click.vpm2b-agfp').on('click.vpm2b-agfp', '[data-action="generate-frame-prompt"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'), fk = $(this).data('frame'); _launchAI('generate-prompt', 'Image prompt for frame', function(ci) { generateFramePrompt(cid, fk, 'generate-prompt', ci); }); });
    $(document).off('click.vpm2b-agvp').on('click.vpm2b-agvp', '[data-action="generate-video-prompt"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('generate-video', 'Video motion prompt', function(ci) { generateVideoPrompt(cid, 'generate-video', ci); }); });
    $(document).off('click.vpm2b-aib').on('click.vpm2b-aib', '[data-action="ai-improve-brief"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('improve-brief', 'Improve recording brief', function(ci) { improveBrief(cid, 'improve-brief', ci); }); });
    $(document).off('click.vpm2b-agm').on('click.vpm2b-agm', '[data-action="ai-generate-metadata"]', function(e) { e.preventDefault(); _launchAI('generate-metadata', 'YouTube SEO metadata', generateMetadata); });
    $(document).off('click.vpm2b-agti').on('click.vpm2b-agti', '[data-action="ai-generate-thumbnail-ideas"]', function(e) { e.preventDefault(); _launchAI('generate-thumbnails', 'Thumbnail concepts', generateThumbnailIdeas); });

    // --- New AI actions ---
    $(document).off('click.vpm2b-agbp').on('click.vpm2b-agbp', '[data-action="ai-generate-blueprint"]', function(e) { e.preventDefault(); _launchAI('analyze-idea', 'Generate blueprint sections from idea', generateBlueprint); });
    $(document).off('click.vpm2b-agch').on('click.vpm2b-agch', '[data-action="ai-generate-chapters"]', function(e) { e.preventDefault(); _launchAI('generate-metadata', 'Auto-generate YouTube chapters from clips', generateChapters); });
    $(document).off('click.vpm2b-agsc').on('click.vpm2b-agsc', '[data-action="ai-generate-scenes"]', function(e) { e.preventDefault(); _launchAI('analyze-studio', 'Auto-generate scenes from looks + environments', generateScenes); });
    $(document).off('click.vpm2b-arrs').on('click.vpm2b-arrs', '[data-action="ai-regenerate-research-section"]', function(e) { e.preventDefault(); var sec = $(this).data('section'); _launchAI('generate-research', 'Regenerate research section', function(ci) { regenerateResearchSection(sec, 'generate-research', ci); }); });
    $(document).off('click.vpm2b-arti').on('click.vpm2b-arti', '[data-action="regenerate-thumbnail-idea"]', function(e) { e.preventDefault(); var tid = $(this).data('id'); _launchAI('generate-thumbnails', 'Regenerate thumbnail concept', function(ci) { regenerateThumbnailIdea(tid, 'generate-thumbnails', ci); }); });
    $(document).off('click.vpm2b-asb').on('click.vpm2b-asb', '[data-action="ai-suggest-brand"]', function(e) { e.preventDefault(); _launchAI('suggest-brand', 'Suggest brand library items', suggestBrandItems); });
    $(document).off('click.vpm2b-aisc').on('click.vpm2b-aisc', '[data-action="ai-split-clip"]', function(e) { e.preventDefault(); var cid = $(this).data('clip-id'); _launchAI('ai-split', 'Split overflowing clip', function(ci) { aiSplitClip(cid, 'ai-split', ci); }); });
    $(document).off('click.vpm2b-ascs').on('click.vpm2b-ascs', '[data-action="ai-suggest-clip-scene"]', function(e) { e.preventDefault(); var cid = $(this).data('clip'); _launchAI('suggest-clip-scene', 'Suggest scene for clip', function(ci) { suggestClipScene(cid, 'suggest-clip-scene', ci); }); });
    $(document).off('click.vpm2b-aaa').on('click.vpm2b-aaa', '[data-action="ai-auto-assign"]', function(e) { e.preventDefault(); _launchAI('auto-assign', 'AI auto-assign assets to clips', autoAssignAssets); });

    // Cancel AI
    $(document).off('click.vpm2b-cai').on('click.vpm2b-cai', '[data-action="cancel-ai"]', function(e) { e.preventDefault(); _cancelAI(); });

    // Danger zone
    $(document).off('click.vpm2b-rap').on('click.vpm2b-rap', '[data-action="reset-all-prompts"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Reset All Prompts?', message: 'All generated prompts cleared.', danger: true, onConfirm: function() {
        var clips = S.data.clips || [];
        for (var i = 0; i < clips.length; i++) { var ps = clips[i].prompt_set || {}; if (ps.first_frame && ps.first_frame.prompt) { ps.first_frame.prompt.positive = ''; ps.first_frame.prompt.status = 'empty'; } if (ps.last_frame && ps.last_frame.prompt) { ps.last_frame.prompt.positive = ''; ps.last_frame.prompt.status = 'empty'; } if (ps.video && ps.video.prompt) { ps.video.prompt.positive = ''; ps.video.prompt.status = 'empty'; } }
        logActivity('settings_changed', 'Reset all prompts');
        if (snapshot) snapshot('Reset prompts'); buildMaps(); syncToTextarea(); render(); toast('All prompts reset', 'success');
      }});
    });
    $(document).off('click.vpm2b-cac').on('click.vpm2b-cac', '[data-action="clear-all-clips"]', function(e) {
      e.preventDefault();
      openConfirmDialog({ title: 'Delete All Clips?', message: 'Cannot be undone.', danger: true, onConfirm: function() {
        S.data.clips = []; S.selectedClipId = null;
        logActivity('settings_changed', 'Cleared all clips');
        if (snapshot) snapshot('Clear clips'); buildMaps(); syncToTextarea(); render(); toast('All clips cleared', 'success');
      }});
    });

    // Entity export/import
    $(document).off('click.vpm2b-expa').on('click.vpm2b-expa', '[data-action="export-all-entities"]', function(e) { e.preventDefault(); _exportAllEntities($(this).data('entity-type')); });
    $(document).off('click.vpm2b-imp').on('click.vpm2b-imp', '[data-action="import-entity"]', function(e) { e.preventDefault(); _importEntity($(this).data('entity-type')); });
    $(document).off('click.vpm2b-exc').on('click.vpm2b-exc', '[data-action="export-config"]', function(e) { e.preventDefault(); _exportConfig(); });
    $(document).off('click.vpm2b-imc').on('click.vpm2b-imc', '[data-action="import-config"]', function(e) { e.preventDefault(); _importConfig(); });

    // Shortcuts help
    $(document).off('click.vpm2b-skh').on('click.vpm2b-skh', '[data-action="show-shortcuts-help"]', function(e) { e.preventDefault(); _showShortcutsHelp(); });
  }


  // ============================================================
  // SECTION 16: KEYBOARD SHORTCUTS
  // ============================================================

  function setupKeyboardShortcuts() {
    $(document).off('keydown.vpm2b-sk').on('keydown.vpm2b-sk', function(e) {
      if ($(e.target).is('input, textarea, select, [contenteditable="true"]')) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); if (window._vpmUndo) window._vpmUndo(); }
        else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); if (window._vpmRedo) window._vpmRedo(); }
        else if (e.key === 's') { e.preventDefault(); syncToTextarea(); if (S.$submitBtn && S.$submitBtn.length) S.$submitBtn.click(); toast('Saved', 'success'); }
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); _showShortcutsHelp(); return; }
      var num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        var stages = S.mode === 'advanced' ? Constants.STAGE_ORDER_ADVANCED : Constants.STAGE_ORDER_STANDARD;
        if (stages[num - 1]) navigateToStage(stages[num - 1]);
      }
    });
  }

  function _showShortcutsHelp() {
    var shortcuts = [
      { keys: 'Ctrl + S', desc: 'Save to Drupal' },
      { keys: 'Ctrl + Z', desc: 'Undo' },
      { keys: 'Ctrl + Shift + Z / Y', desc: 'Redo' },
      { keys: '1 \u2013 7', desc: 'Jump to stage' },
      { keys: '?', desc: 'Show this help' }
    ];
    var html = '<div style="display:flex;flex-direction:column;gap:8px">';
    for (var i = 0; i < shortcuts.length; i++) {
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--vpm-border-light)">';
      html += '<span class="vpm-text-sm">' + esc(shortcuts[i].desc) + '</span>';
      html += '<kbd class="vpm-kbd">' + esc(shortcuts[i].keys) + '</kbd></div>';
    }
    html += '</div>';
    openModal('Keyboard Shortcuts', html, { footer: false, size: 'sm' });
  }


  // ============================================================
  // SECTION 17: API EXPORTS
  // ============================================================

  window._vpmExtractPreferencesFromText = extractPreferencesFromText;
  window._vpmPart2B = {
    LLMService: LLMService, BrandService: BrandService,
    isAIConfigured: LLMService.isConfigured.bind(LLMService),
    renderInlinePicker: LLMService.renderInlinePicker.bind(LLMService),
    extractPreferencesFromText: extractPreferencesFromText,
    analyzeIdea: analyzeIdea, generateResearch: generateResearch,
    generateScript: generateScript, enhanceSection: enhanceSection,
    generateClips: generateClips, generateFramePrompt: generateFramePrompt,
    generateVideoPrompt: generateVideoPrompt, analyzeStudio: analyzeStudio,
    generateMetadata: generateMetadata, improveBrief: improveBrief,
    generateThumbnailIdeas: generateThumbnailIdeas,
    generateBlueprint: generateBlueprint, generateChapters: generateChapters,
    generateScenes: generateScenes, regenerateResearchSection: regenerateResearchSection,
    regenerateThumbnailIdea: regenerateThumbnailIdea, thumbnailChatAI: thumbnailChatAI,
    buildVideoContext: buildVideoContext, buildScriptContext: buildScriptContext,
    buildClipContext: buildClipContext, buildSceneContext: buildSceneContext
  };

  console.log('[VPM] Part 2B v1.0 loaded \u2014 18 sections');
})(jQuery, Drupal);
