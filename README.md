# Image Budget for Pi Desktop

Independent image reader with bounded previews, high-detail crops, and source preservation.

Auto: 2048px longest edge / 512KiB. High: 4096px / 1MiB. Crop original pixels with `crop: {x,y,width,height}`. Supports PNG/JPEG/WebP/GIF (first frame). Reads through scoped host fs APIs; no network or write permissions. Existing history and pasted attachments are not rewritten. Disable old Vision Kit to avoid duplicate image-reader tools.

Build: `npm ci --ignore-scripts` then `node build.cjs`. Validate/package through Pi Desktop PluginCheck and PluginPack.

MIT; includes original Vision Kit helpers by muzimu217 and bundled dependencies. See LICENSE, ATTRIBUTION.md, THIRD-PARTY-NOTICES.txt.
