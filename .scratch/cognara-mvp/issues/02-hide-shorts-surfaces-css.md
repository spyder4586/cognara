# 02: Hide Shorts surfaces (always-on CSS)

**What to build:** When Enabled, every Shorts surface stays hidden so the viewer never sees Shorts shelves, entries, or tabs.

**Blocked by:** 01 scaffold MV3 package.

**Status:** done

- [x] Home/subs shelves, sidebar entry, search results, channel tab/shelves are hidden
- [x] Hiding applies before first paint with no visible flash
- [x] All selectors live in one file using link patterns, not fragile class names

## Comments

Implemented: `src/hide-shorts.css` (single hide seam, 13 selectors, all `:has()` + `/shorts/` link patterns) wired via `content_scripts` at `document_start` in `manifest.json`, excluding `m.youtube.com`. Verified: manifest JSON valid, `run_at` is `document_start`, every selector audited for link-pattern `:has()`, Shorts player left untouched per ADR-0001, no network blocking per ADR-0002. Manual QA still needed on Chrome + Brave (home/search/channel/sidebar, zero-flash).
