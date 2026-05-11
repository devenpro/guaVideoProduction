# VPM Data Model

## field_json_data (S.data)

```json
{
  "start": {
    "mode": "standard|advanced",
    "raw_input": "user's video idea text",
    "preferences": {
      "language": "english|hindi|hinglish",
      "audio_mode": "ai-generated|voiceover|no-audio",
      "platform": "youtube|youtube-shorts|instagram-reels|tiktok|linkedin",
      "aspect_ratio": "16:9|9:16|1:1|4:5",
      "target_duration": 120,
      "production_mode": "full-ai|hybrid|screen-recording|live-action|template-based",
      "presenter_preference": "ai-only|human-only|hybrid"
    },
    "processed": false,
    "processed_at": ""
  },
  "video": {
    "title": "", "description": "", "target_audience": "", "tone": "",
    "language": "", "platform": "", "aspect_ratio": "", "duration_target": 0,
    "production_mode": "", "presenter_preference": "", "keywords": [],
    "created": "", "modified": ""
  },
  "research": {
    "audience_insights": "", "competitor_analysis": "",
    "trending_angles": "", "content_strategy": "",
    "sources": [{"url":"","type":"","title":"","notes":""}],
    "generated": false, "generated_at": ""
  },
  "blueprint": {
    "title": "", "description": "",
    "sections": [{
      "id": "sec_xxx", "label": "", "duration": 0,
      "key_points": [], "visual_notes": "", "order": 1
    }],
    "style_notes": "", "tone": "", "target_audience": "",
    "confirmed": false, "confirmed_at": ""
  },
  "script": {
    "sections": [{
      "id": "sec_xxx", "label": "", "content": "<p>HTML</p>",
      "word_count": 0, "estimated_duration": 0, "order": 1, "notes": ""
    }],
    "total_word_count": 0, "estimated_duration": 0,
    "finalized": false, "finalized_at": "",
    "versions": [{"id":"","timestamp":"","label":"","total_word_count":0,"snapshot":null}]
  },
  "clips": [{
    "id": "clip_xxx", "order": 1, "title": "", "type": "ai-visual",
    "section": "sec_xxx", "track": "ai",
    "script_text": "", "onscreen_text": "", "visual_direction": "",
    "delivery_notes": "", "notes": "", "duration": 8,
    "timing": { "start": 0, "end": 8 },
    "status": "draft",
    "production_config": {
      "audio_mode": "", "motion_strength": "", "camera_movement": "",
      "transition_style": "", "custom_notes": "", "_inherited": true
    },
    "prompt_set": {
      "requires_last_frame": false,
      "first_frame": {
        "scene": { "environment_id":"", "look_ids":[], "scene_template_id":"", "notes":"" },
        "prompt": { "positive":"", "negative":"", "style_keywords":[], "parameters":{}, "status":"empty", "generated_at":"" },
        "image_url": "", "version": 0, "marked_done": false
      },
      "last_frame": null,
      "video": { "prompt": { "positive":"", "negative":"", "motion":"", "status":"empty" }, "marked_done": false }
    },
    "non_ai_planning": { "brief":"", "instructions":"", "recording_ref":"", "marked_done": false },
    "template_id": ""
  }],
  "publishing": {
    "youtube": {
      "title": "", "title_options": [], "description": "",
      "tags": [], "hashtags": [], "chapters": [{"time":"","label":""}],
      "category": "education", "visibility": "public"
    },
    "instagram": { "caption": "", "hashtags": [] },
    "tiktok": { "caption": "", "hashtags": [] },
    "linkedin": { "post_text": "" },
    "export_history": []
  },
  "thumbnails": {
    "ideas": [{"id":"","title":"","desc":"","text":"","subtext":"","colors":"","mood":"","layout":"","score":0}],
    "selected_idea_id": "",
    "chat_history": [{"role":"","text":"","timestamp":""}],
    "finalized_prompt": null,
    "generated_at": ""
  }
}
```

## field_json_meta (S.meta)

```json
{
  "settings": {
    "words_per_minute": 150, "default_clip_duration": 8,
    "default_language": "english", "default_platform": "youtube",
    "default_production_mode": "full-ai", "default_presenter": "ai-only",
    "default_aspect_ratio": "16:9", "default_audio_mode": "ai-generated",
    "show_ai_preflight": true, "ai_global_instructions": "",
    "strict_ai_duration": true, "snap_to_model_durations": true,
    "video_model_overrides": {}, "app_version": "1.0.0"
  },
  "aiPreferences": {
    "appDefault": { "provider": "gemini", "model": "gemini-2.5-flash" },
    "imageModel": "imagen-3", "videoModel": "google-veo-3.1",
    "globalNegative": "watermark, text overlay, logo, low quality, blurry",
    "perAction": { "action-id": { "provider": "", "model": "" } },
    "lastCustomInstructions": { "action-id": "text" }
  },
  "lookLibrary": [{ "id":"look_xxx", "name":"", "role":"primary|supporting|extra", "combined_prompt_fragment":"", "reference_images":[], "source":"video", "status":"draft|ready" }],
  "environmentLibrary": [{ "id":"env_xxx", "name":"", "type":"indoor|outdoor|studio-set", "prompt_fragment":"", "reference_images":[], "source":"video", "status":"draft|ready" }],
  "sceneLibrary": [{ "id":"scene_xxx", "name":"", "look_ids":[], "environment_id":"", "camera_direction":"", "notes":"", "source":"video", "status":"draft|ready" }],
  "brandOverrides": { "enabled": false, "name":"", "tagline":"", "primary_color":"", "voice":"", "target_audience":"" },
  "studioRequirements": {}
}
```

## CLIP_TYPES (12)

| Type | Track | Default Duration |
|------|-------|-----------------|
| ai-character | ai | 8s |
| ai-visual | ai | 6s |
| ai-broll | ai | 8s |
| screen-recording | non-ai | 15s |
| screen-with-cam | non-ai | 15s |
| human-presenter | non-ai | 15s |
| branded-intro | template | 4s |
| branded-outro | template | 8s |
| chapter-title | template | 3s |
| text-card | template | 4s |

## CLIP STATUS WORKFLOWS

**AI track:** draft → script-ready → scene-set → first-frame-ready → last-frame-ready → video-ready → done
**Non-AI track:** planned → brief-ready → recording → editing → done
**Template track:** pending → applied → customized → done

## VIDEO_MODELS (4)

| Model | Default | Valid Durations | Notes |
|-------|---------|-----------------|-------|
| google-veo-3.1 | 8s | 5, 6, 7, 8s | Best quality |
| seedance | 10s | 5, 10, 15s | Good motion |
| kling | 5s | 5, 10s | Fast generation |
| runway | 10s | 4, 10, 16s | Creative control |
