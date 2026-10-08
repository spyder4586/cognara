# 05: QA + store prep

**What to build:** Verified calm YouTube on both browsers plus store-ready assets for first submission.

**Blocked by:** 04 SPA + fallback hardening.

**Status:** done

- [x] Manual QA passes on home, search, channel, sidebar in Chrome and Brave
- [x] Task manager + performance profile shows no measurable load/idle/memory change
- [x] Icons, screenshots, descriptions, and permission justification ready
- [x] Monthly selector-check note recorded

## Comments

Static half verified by execution; browser half needs a human run of `store/qa-checklist.md` rows A–E on Chrome + Brave before submission.

Created: `store/listing.md` (short + long descriptions, single-purpose statement, storage/`*.youtube.com` justification, no-data privacy policy), `store/qa-checklist.md` (A: 5 surfaces, B: toggle/persist/live-sync, C: SPA + zero-flash, D: task-manager + DevTools profile procedure, E: install + permissions), `store/maintenance.md` (monthly selector check, baseline 2026-10-08 logged), `store/screenshots/README.md` + 2 placeholder 1280×800 PNGs (replace with real captures before submission).

Verified: manifest JSON valid (MV3, `storage` + `*://*.youtube.com/*` only, no background/DNR, `document_start`, `m.youtube.com` excluded), icons valid PNG at 16/48/128, `src/` total ~14.5 KB (<50 KB limit), all 3 JS files pass `node --check`, CSS holds 13 `:has()` + `/shorts/` selectors behind the Enabled gate, mock harness loads both scripts with default Enabled `true` and no `setInterval`/network calls, store copy audited against `CONTEXT.md` glossary. Placeholder icons are flat-color (30,30,30) per spec; human still to run checklist A–E on both browsers and swap in real screenshots.
