# 03: Enabled toggle + live sync

**What to build:** One logo-plus-toggle popup that turns hiding on/off instantly across all open tabs and remembers the choice.

**Blocked by:** 02 hide Shorts surfaces.

**Status:** done

- [x] Popup shows only logo and one toggle with no framework
- [x] Toggle state persists across browser restarts, default on
- [x] Open tabs update without manual reload when toggle changes
- [x] Toggle off restores pixel-identical YouTube

## Comments

Implemented: `src/enabled-sync.js` (Enabled state seam, reads `storage.local` default true at `document_start`, mirrors to `data-cognara-enabled`, `onChanged` live sync, no polling/worker), `src/hide-shorts.css` gated behind `html:not([data-cognara-enabled="false"])` (13 selectors preserved, missing attribute means Enabled for zero flash), `src/popup.html` + `src/popup.js` (logo + one checkbox toggle, inline style only, no framework/external assets), `manifest.json` adds JS alongside CSS at `document_start` with same matches/excludes. Verified: manifest JSON valid with storage-only perms and no background/DNR, JS syntax clean, CSS gate audit, mocked functional tests for default-on/persist/live-update both directions. Manual QA still needed on Chrome + Brave (toggle on/off, restart persist, multi-tab live update, off restores untouched YouTube).
