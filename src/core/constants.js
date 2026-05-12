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
