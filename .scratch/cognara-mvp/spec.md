# Spec: Cognara hide-only MVP

Status: ready-for-agent

## Problem Statement

Shorts surfaces distract from longer content across home, sidebar, search, and channel pages, with no built-in off switch.

## Solution

Cognara hides all Shorts surfaces when Enabled, shows untouched YouTube when not Enabled, via one logo + toggle popup.

## User Stories

1. As a viewer, I want Shorts shelves hidden on home/subs, so I stay focused
2. As a viewer, I want the sidebar/mini-guide Shorts entry hidden, so I don't navigate into Shorts
3. As a viewer, I want Shorts hidden in search results, so search stays on long-form
4. As a viewer, I want channel Shorts tabs/shelves hidden, so channel pages stay focused
5. As a viewer, I want hiding applied before first paint on SPA navigations, so I see no flash
6. As a viewer, I want one toggle to hide/show, so control is one click
7. As a viewer, I want Enabled remembered across restarts, so I don't re-configure
8. As a viewer, I want open tabs updating without reload on toggle, so change is instant
9. As a Brave user, I want identical behavior to Chrome from one package, so install is trivial
10. As a privacy-minded user, I want no data collection, so I trust the toggle

## Implementation Decisions

- Manifest V3, desktop Chrome 105+ / current Brave, Windows/macOS/Linux, no `m.youtube.com`
- Hide-only per ADR-0001: no redirect, direct `/shorts/ID` visits stay in Shorts player
- CSS-only per ADR-0002: static stylesheet at `document_start` using `:has()` + `/shorts/` links, all selectors in one file, min-version cutoff, no fallback
- Throttled observer fallback only for CSS-untargetable elements, no polling, no persistent worker
- Single Enabled bool in `storage.local`, default `true`, read at start + `onChanged` live sync
- Popup: placeholder logo + one toggle, no framework, no external assets, runs only while open
- Permissions: `*://*.youtube.com/*` + `storage` only
- Seams: (1) CSS hide seam, (2) Enabled state seam, (3) popup seam

## Testing Decisions

- Good test = external behavior: Shorts surface not visible when Enabled, pixel-identical YouTube when not Enabled, no implementation-detail asserts
- Modules: selectors file (static CSS parse + link-pattern review), Enabled sync (toggle persist/restart + multi-tab live update), popup (manual open/toggle)
- Prior art: none in repo — new manual QA checklist on Chrome + Brave (home/search/channel/sidebar), task manager + DevTools profile for load/idle/memory, zero-flash check

## Out of Scope

- Redirect, network blocking, `declarativeNetRequest`
- Mobile site/app, Firefox/Safari, ads/other content
- Analytics, accounts, recommendations, per-surface or mode settings (F11/F12 to v1.1)

## Further Notes

- Placeholder icons 16/48/128 + 1280x800 screenshots template for store prep
- Monthly selector check; fixes within 7 days of markup change
- Uses glossary: Hide, Shorts surface, Enabled (`CONTEXT.md`)
