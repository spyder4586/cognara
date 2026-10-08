# 04: SPA + fallback hardening

**What to build:** Hiding stays solid as the viewer navigates YouTube without reloads, with no polling or background work.

**Blocked by:** 03 Enabled toggle + live sync.

**Status:** done

- [x] Single-page navigations keep Shorts hidden with no flash
- [x] Throttled observer covers only what CSS cannot target
- [x] No polling and no persistent background process

## Comments

Implemented: `src/spa-fallback.js` (throttled MutationObserver on `documentElement` childList+subtree, 200ms throttle collapsing bursts to one pass, `yt-navigate-finish` hook for SPA navigations, fallback-only scan that skips all 13 CSS-covered containers and the Shorts player scope per ADR-0001, hides only unknown future wrappers or `[id="dismissible"]`/link itself, tracks Hidden elements for restore on not Enabled, reads single Enabled bool default true + `onChanged` live sync with no `setInterval` polling), wired in `manifest.json` alongside `enabled-sync.js` at `document_start` with same matches/excludes. Verified: manifest JSON valid with storage-only perms and no background/DNR, JS syntax clean, CSS gate audit (13 selectors preserved), mocked functional tests for covered-skip/fallback-hide/player-untouched/disable-restore/burst-throttle/spa-event/no-polling-no-network-no-redirect. Manual QA still needed on Chrome + Brave (SPA navigate home/search/channel without reload, zero-flash, task manager + DevTools profile for load/idle/memory).
