# PRD: Cognara, a YouTube Shorts Blocker

*Draft v0.2 · October 8, 2026 · Status: Planning (no build started)*

## 1. Overview

Cognara is a lightweight browser extension for Chrome and Brave that removes YouTube Shorts from the YouTube experience. It is built on Manifest V3, relies mainly on CSS rather than JavaScript, and collects no data. One codebase serves both browsers, and Brave users install it directly from the Chrome Web Store.

**MVP scope:** the Cognara logo and one toggle button that hides or shows Shorts, on desktop and laptop browsers only.

## 2. Problem Statement

Shorts appear on the home feed, in the sidebar, in search results, and on channel pages. For many users they are a distraction that pulls attention away from the longer content they came for. YouTube offers no built-in way to turn Shorts off entirely. Existing extensions are often heavy, request broad permissions, or run continuous scripts that cost CPU and memory.

## 3. Goals

Correctness and low resource use come first; the other goals support them.

1. Hide Shorts across all major YouTube surfaces with no visible flash of content.
2. Keep resource use close to zero, with no persistent background work.
3. Request only the permissions the extension strictly needs.
4. Work identically on Chrome and Brave from a single Manifest V3 package.
5. Pass Chrome Web Store review on the first submission.

## 4. Non-Goals

- Mobile browsers and the YouTube mobile site (`m.youtube.com`)
- Blocking ads or any other YouTube content
- Support for Firefox or Safari (possible later)
- Analytics, telemetry, or accounts
- Blocking Shorts in the YouTube mobile app
- Customizing or recommending other videos
- Settings beyond one on/off toggle in the MVP

## 5. Target Users

- People who find Shorts addictive or distracting and want a calmer YouTube
- Parents and students wanting a focused viewing environment
- Privacy-minded Brave users who prefer minimal-permission extensions

## 6. Functional Requirements

### 6.1 Core (MVP)

| ID | Requirement | Priority |
| --- | --- | --- |
| F1 | Hide the Shorts shelf on the home page and subscriptions feed | Must |
| F2 | Hide the Shorts entry in the left sidebar and mini guide | Must |
| F3 | Hide Shorts results in search | Must |
| F4 | Hide the Shorts tab and shelves on channel pages | Must |
| F5 | Redirect `/shorts/ID` URLs to `/watch?v=ID` so they play in the standard player | Must |
| F6 | Handle YouTube's single-page navigation so redirects and hiding work without a page reload | Must |
| F7 | Apply hiding at `document_start` to avoid layout flashes | Must |
| F8 | Toolbar popup with only the Cognara logo and one toggle button that hides or shows Shorts | Must |
| F9 | Remember the toggle across browser restarts and apply changes to open YouTube tabs without a manual reload | Must |
| F10 | Support desktop and laptop Chrome and Brave only; no mobile site | Must |

### 6.2 Optional (post-MVP)

| ID | Requirement | Priority |
| --- | --- | --- |
| F11 | Mode choice: "hide only" or "hide and redirect" | Could |
| F12 | Per-surface toggles (for example, keep Shorts on channel pages) | Could |

## 7. Technical Approach

- **Platform:** Manifest V3, desktop Chrome 105+ and current Brave on Windows, macOS, and Linux. Mobile is not supported.
- **Hiding:** a static stylesheet injected at `document_start`. It uses `:has()` and `/shorts/` link patterns, which are more stable than class names, and applies only while the toggle is on.
- **Redirect:** a small content script listens for YouTube's navigation events (such as `yt-navigate-finish`) and rewrites Shorts URLs to the watch format. An optional declarative network rule can cover direct URL loads.
- **Fallback:** a throttled observer, used only for elements CSS cannot target. No polling and no persistent service worker.
- **Popup:** one small HTML page with the Cognara logo and one toggle. No framework and no external assets; it runs only while open.
- **Storage:** one on/off value in `storage.local`. Content scripts read it at `document_start` and react to changes, so tabs update without a reload.

## 8. Permissions

| Permission | Reason |
| --- | --- |
| Host access: `*://*.youtube.com/*` | Inject CSS and the redirect script |
| `storage` | Remember the on/off toggle |

No other permissions are requested. No remote code is loaded.

## 9. Non-Functional Requirements

- **Correctness:** with the toggle on, no Shorts appear on any supported surface; with it off, YouTube looks exactly as it does without the extension.
- **Performance:** no measurable increase in page load time; idle CPU impact near zero.
- **Memory:** no persistent background process; content script footprint under 50 KB.
- **Privacy:** no data collection, network calls, or third-party services.
- **Compatibility:** latest two major versions of desktop Chrome and Brave on Windows, macOS, and Linux.
- **Maintainability:** all selectors kept in a single file for fast updates.

## 10. Success Metrics

- With the toggle on, Shorts are not visible on the home, search, channel, or sidebar surfaces in manual QA on Chrome and Brave
- With the toggle off, YouTube is identical to a browser without Cognara
- The toggle state survives a browser restart and updates open tabs without a reload
- Resource use shows no measurable difference from the extension being disabled, checked with the browser task manager and a DevTools performance profile (page load, idle CPU, memory)
- Zero visible layout flash on page load
- Store review approved without permission-related rejection
- Store rating of 4.5 or higher after the first 100 reviews
- Selector fixes shipped within 7 days of a YouTube markup change

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| YouTube changes its markup | Shorts reappear | Use `/shorts/` link-based selectors; keep selectors in one file; set up a monthly check |
| `:has()` unsupported in old browsers | Rules fail silently | Set a minimum browser version in the manifest |
| Store rejects broad host access | Launch delay | Limit to `*.youtube.com` and write a clear permission justification |
| Redirect breaks legitimate links | User frustration | Test shared links, embeds, and history navigation; the toggle turns Cognara off in one click |
| Toggle state differs between open tabs | Shorts show or hide inconsistently | Listen for storage changes in every YouTube tab and test with several tabs open |

## 12. Release Plan

1. **Milestone 1: MVP.** F1 to F10: hiding, redirect, and the popup with logo and toggle; internal testing and resource measurement on Chrome and Brave.
2. **Milestone 2: Store prep.** Icons (16/48/128), 1280×800 screenshots, short and long descriptions, single-purpose statement, permission justification, privacy policy.
3. **Milestone 3: Submission.** Chrome Web Store developer account (one-time $5 fee), then submit for review.
4. **Milestone 4: v1.1.** Mode choice and per-surface toggles (F11, F12), based on user feedback.

## 13. Decisions and Open Questions

1. **Decided:** the MVP has only the Cognara logo and one toggle button to hide or show Shorts.
2. **Proposed, please confirm:** one behavior when the toggle is on. Cognara hides Shorts and also sends Shorts links to the normal video player, with no separate setting.
3. **Decided:** desktop and laptop only; no mobile site in v1.
4. **Decided:** the extension name is Cognara.
5. **Open:** do you have a logo file, or should a simple placeholder be designed?
6. **Open:** should the toggle be on by default after install? Proposed: yes.

## 14. Next Step

This PRD is a plan only. No code will be written until you confirm the remaining open items and tell me to start building.
