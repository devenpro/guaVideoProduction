# VPM Project Configuration

## Drupal Content Type Setup

### Content Type
| Property | Value |
|----------|-------|
| Name | Video Production |
| Machine name | `video_production` |
| Body class | `node--type-video-production` |
| URL pattern | `/node/{nid}/edit` (standard Drupal) |

### Fields Required

#### JSON Data Fields (3)
| Label | Machine Name | Type | Text Format | Widget |
|-------|-------------|------|-------------|--------|
| Video Data | `field_json_data` | Text (plain, long) | Raw HTML | Textarea |
| Video Meta | `field_json_meta` | Text (plain, long) | Raw HTML | Textarea |
| Activity Log | `field_activity_log` | Text (plain, long) | Raw HTML | Textarea |

**Critical:** Text format MUST be "Raw HTML" (or "Plain text") — NOT "Basic HTML" or "Filtered HTML". CKEditor5 will try to process these fields otherwise.

#### Image Gallery Fields (3)
| Label | Machine Name | Type | Cardinality | Upload Location |
|-------|-------------|------|-------------|-----------------|
| Looks Gallery | `field_looks_gallery` | Image | Unlimited | public://looks/ |
| Environments Gallery | `field_environments_gallery` | Image | Unlimited | public://environments/ |
| Frames Gallery | `field_frames_gallery` | Image | Unlimited | public://frames/ |

**Important:** These use Drupal's auto-upload AJAX behavior. The app triggers uploads via `queueGalleryUpload()` which sets files on the native file input and lets Drupal handle the rest.

### Asset Injector Setup

VPM uses **Drupal Asset Injector** module to attach CSS/JS files to pages matching the content type.

#### CSS Assets (2 files)
| File | Injector Label | Conditions | Weight |
|------|---------------|------------|--------|
| `vpm-part1.css` | VPM Part 1 CSS | Content type = video_production | -10 |
| `vpm-part2.css` | VPM Part 2 CSS | Content type = video_production | -9 |

#### JS Assets (3 files — ORDER MATTERS)
| File | Injector Label | Conditions | Weight | Dependencies |
|------|---------------|------------|--------|-------------|
| `vpm-part1.js` | VPM Part 1 JS | Content type = video_production | -10 | jQuery, Drupal |
| `vpm-part2a.js` | VPM Part 2A JS | Content type = video_production | -9 | Part 1 (polls) |
| `vpm-part2b.js` | VPM Part 2B JS | Content type = video_production | -8 | Part 1 + 2A (polls) |

**Weight order is critical.** Part 1 must load first (lowest weight), Part 2A second, Part 2B last. Each file polls for the previous one's readiness via `setInterval`.

#### External Dependencies
| Resource | How Loaded | Purpose |
|----------|-----------|---------|
| Font Awesome Pro | Drupal theme or CDN link | Icons via `icon()` helper |
| Plus Jakarta Sans | Google Fonts or local | Primary font |
| JetBrains Mono | Google Fonts or local | Code/mono font |
| Tiptap | CDN (loaded by Part 2A JS) | Rich text script editors |

---

## Global Resources (Views Blocks)

These are **Drupal Views blocks** placed on the node edit page. They output hidden HTML elements that the app reads on initialization.

### 1. AI Configuration Block
| Block | Output Element | Content |
|-------|---------------|---------|
| LLM Config | `.llm-config-data` | JSON with providers array |

**Source:** User profile fields containing API keys and model selections per provider.

**JSON Structure:**
```json
{
  "providers": [
    {
      "id": "gemini",
      "label": "Google Gemini",
      "active": true,
      "api_key": "AIza...",
      "models": [
        { "id": "gemini-2.5-flash", "label": "Gemini 2.5 Flash", "active": true, "temperature": 1, "max_tokens": 8192 },
        { "id": "gemini-2.5-pro", "label": "Gemini 2.5 Pro", "active": true, "temperature": 1, "max_tokens": 8192 }
      ]
    }
  ]
}
```

### 2. Brand Context Block
| Block | Output Element | Content |
|-------|---------------|---------|
| Brand Data | `.brand-data` | Nested divs with brand info |

**Child elements:**
- `.brand-name` — text
- `.brand-id` — text
- `.brand-logo-url` — text
- `.brand-core-data` — JSON (name, tagline, voice, colors)
- `.brand-video-data` — JSON (video-specific brand settings)
- `.brand-content-data` — JSON (content guidelines)

### 3. User Info Block
| Block | Output Element | Content |
|-------|---------------|---------|
| User Data | `#guau-userdata` | Spans with user fields |

**Child elements:**
- `#guau-userid` — user ID
- `#guau-username` — username
- `#guau-useremail` — email
- `#guau-userfullname` — display name
- `#guau-usertimezone` — timezone
- `#guau-userroles` — comma-separated roles

### 4. Brand Studio Library Block
| Block | Output Element | Content |
|-------|---------------|---------|
| Brand Studio | `.brand-studio-library` | JSON arrays per entity type |

**Child elements:**
- `.brand-studio-characters` — JSON array of character entities
- `.brand-studio-outfits` — JSON array of outfit entities
- `.brand-studio-looks` — JSON array of look entities
- `.brand-studio-environments` — JSON array of environment entities
- `.brand-studio-scenes` — JSON array of scene entities

All entities get `source: 'brand'` flag. Read-only in the app — users copy to video library to customize.

---

## Session Templates

### Workflow 1: Bug Fix / Small Improvement
```
Goal: [describe the bug or small feature]

Steps:
1. Read relevant section of uploaded code
2. Plan the fix (which files, which functions)
3. Implement with str_replace or full function replacement
4. Verify with node -c syntax check
5. Describe how to test
6. If satisfied → generate final files
```

### Workflow 2: Major Feature / Rebuild
```
Goal: [describe the major feature]

Steps:
1. Requirements — clarify scope, ask questions
2. Architecture — design approach, identify affected files
3. Create phased implementation plan
4. Implement phase by phase (verify each)
5. Testing walkthrough
6. Generate final production files
7. Update changelog
```

### Session Ending: Generate Production Files
```
When changes are complete:
1. Ask: "Generate final production-ready files"
2. Claude outputs all changed files
3. Download and replace in project Knowledge
4. Update VPM-CHANGELOG.md with what changed
```
