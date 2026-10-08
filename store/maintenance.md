# Selector maintenance — monthly check

YouTube markup changes can bring Shorts surfaces back. All selectors live in one file: `src/hide-shorts.css` (15 selectors, all `:has()` + `/shorts/` link patterns, per ADR-0002).

## Monthly (or on user report)

1. Enabled on, open Home / Search / Channel / sidebar on Chrome.
2. For any visible Shorts surface: DevTools → inspect → confirm which selector missed (or whether it is a new wrapper with a `/shorts/` link and no covered ancestor — the `spa-fallback.js` case).
3. Fix in `src/hide-shorts.css` only (keep the `html:not([data-cognara-enabled="false"])` gate). Keep `src/spa-fallback.js` COVERED list in sync if a new container becomes CSS-covered.
4. Re-run `store/qa-checklist.md` rows A1–A4 + C1 on Chrome and Brave.

## Target

Fixes shipped within 7 days of a markup change (PRD success metric).

## Log

| Date | Checker | Result |
| --- | --- | --- |
| 2026-10-08 | MVP prep | Baseline recorded: 13 selectors, link-pattern audit clean; no markup change yet |
| 2026-10-08 | user report | Search Shorts used `grid-shelf-view-model` + `ytm-shorts-lockup-view-model-v2` (uncovered) and fallback hid `ytd-item-section-renderer` (endless loading). Added 2 selectors (now 15), narrowed fallback to tile level. Loop `scripts/check-search-coverage.js` green. |
| | | |
