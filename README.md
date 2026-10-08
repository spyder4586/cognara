# Cognara

Hides YouTube Shorts for a calmer viewing environment. Desktop Chrome and Brave only. No data collected.

## What it does

When Enabled, every Shorts surface stays hidden: home shelves, sidebar entry, search results, channel tab and shelves. When not Enabled, YouTube appears untouched. Hide-only: direct `/shorts/ID` visits stay in the Shorts player. No redirect, no network blocking.

## Install from source

1. Open `chrome://extensions` (or `brave://extensions`).
2. Enable Developer mode.
3. Load unpacked → select this folder.
4. Open YouTube. Shorts are hidden by default.

## Use

Toolbar icon → Cognara popup → Hide Shorts toggle. State persists across restarts and updates open tabs without reload.

## Permissions

- `*://*.youtube.com/*` — inject hiding stylesheet and sync script.
- `storage` — remember the on/off toggle.

No remote code, no background worker, no analytics.

## Project layout

- `manifest.json` — MV3, Chrome 105+, minimal permissions.
- `src/hide-shorts.css` — single hide seam, `:has()` + `/shorts/` link patterns.
- `src/enabled-sync.js` — Enabled state seam.
- `src/spa-fallback.js` — throttled observer fallback, no polling.
- `src/popup.html`, `src/popup.js` — logo + one toggle.
- `icons/` — 16, 48, 128 px placeholders.
- `store/` — listing copy, QA checklist, maintenance note.
- `.scratch/cognara-mvp/` — spec and tickets.
- `docs/adr/` — hide-only and CSS-only decisions.

## QA

See `store/qa-checklist.md` rows A–E on Chrome and Brave before submission.

## Privacy

No collection, no network calls, no third-party services.
