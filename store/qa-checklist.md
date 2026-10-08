# QA checklist — ticket 05 (Chrome + Brave, manual)

Run every row on **desktop Chrome (latest) and current Brave**. Record pass/fail + browser version. Two columns per row: Chrome / Brave.

Uses glossary: Hide, Shorts surface, Enabled (`CONTEXT.md`).

## A. Shorts surfaces hidden when Enabled (default on)

| # | Surface | Steps | Expect |
| --- | --- | --- | --- |
| A1 | Home shelf | Fresh profile, install, open `youtube.com/` | No Shorts shelves or tiles visible |
| A2 | Sidebar entry | Same tab, check left sidebar | No Shorts entry; mini-guide (collapsed) also has none |
| A3 | Search | Search `lofi hip hop` | No Shorts tiles or shelves in results |
| A4 | Channel tab + shelf | Open a channel with Shorts (e.g. a music channel `/shorts` tab) | No Shorts tab, no Shorts shelves |
| A5 | Direct visit (hide-only) | Open any `/shorts/<id>` directly | Player still plays (ADR-0001: hide-only, never hidden) |

## B. Toggle + persist + live sync

| # | Steps | Expect |
| --- | --- | --- |
| B1 | Click Cognara popup toggle off | Popup reads "Shorts surfaces are shown"; all surfaces reappear without reload |
| B2 | Toggle back on | "Shorts surfaces are hidden"; surfaces hide again without reload |
| B3 | With 2+ YouTube tabs open, toggle once | Every open tab updates without manual reload |
| B4 | Enabled on → restart browser | Still on, still hidden after restart |
| B5 | Enabled off → restart browser | Still off, YouTube pixel-identical to no-extension |

## C. SPA navigation, zero flash

| # | Steps | Expect |
| --- | --- | --- |
| C1 | Enabled on, click Home → Search → Channel → video (no reloads) | Surfaces stay hidden on every navigation |
| C2 | Hard reload + cold navigation to Home/Search/Channel | No visible flash of Shorts before hiding |
| C3 | Throttle CPU 4× in DevTools, repeat C1 | Still hidden, no flash, no layout jump |

## D. Performance — no measurable change

Do with extension Enabled vs. disabled (same profile, same URLs):

| # | Tool | Steps | Expect |
| --- | --- | --- | --- |
| D1 | Browser task manager (Shift+Esc) | Open YouTube Home, note Memory + CPU for the tab, idle 60 s | No measurable delta (within run-to-run noise) |
| D2 | DevTools Performance | Record page load on Home and Search; record 10 s idle | No new long tasks from Cognara; scripting <5 ms per navigation burst; idle CPU ~0 |
| D3 | Footprint | `src/` total on disk | <50 KB (currently ~14.5 KB: CSS ~2.2 KB, JS ~11.4 KB) |

How to attribute: Narrow the Performance recording to `enabled-sync` / `spa-fallback`; the fallback observer is throttled to one pass per 200 ms burst and skips all CSS-covered containers.

## E. Install + permissions

| # | Steps | Expect |
| --- | --- | --- |
| E1 | `Load unpacked` on Chrome 105+ and Brave | Installs with no warnings |
| E2 | Inspect requested permissions | Only `*.youtube.com` + `storage`, matching `store/listing.md` justification |
| E3 | Popup open | Only logo + one toggle, no console errors |

## Sign-off

- [ ] All A–E pass on Chrome (version: ___)
- [ ] All A–E pass on Brave (version: ___)
- [ ] Deltas recorded: load ___ ms, idle ___ , memory ___
- [ ] Screenshots in `store/screenshots/` replaced with real 1280×800 captures
- [ ] If any row fails, file a follow-up under `.scratch/cognara-mvp/issues/`; do not mark 05 done
