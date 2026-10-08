# Cognara — store listing (hide-only MVP)

## Short description (≤132 chars)

Hides YouTube Shorts shelves, entries, and tabs for a calmer YouTube. One toggle, no data collected.

## Long description

Cognara hides Shorts surfaces on desktop YouTube for a calmer viewing environment.

When Enabled, Cognara hides:

- Home and Subscriptions Shorts shelves
- Sidebar and mini-guide Shorts entries
- Shorts in search results
- Channel Shorts tabs and shelves

When not Enabled, YouTube appears untouched — pixel-identical to a browser without Cognara.

How it works:

- One logo + one toggle popup. No framework, no external assets.
- A single Enabled value in `storage.local`, default on. It is remembered across restarts and open tabs update without reload.
- Hiding is a static stylesheet applied at `document_start`, so Shorts surfaces stay hidden before first paint, including single-page navigations.
- Hide-only: direct `/shorts/ID` visits stay in the Shorts player. Cognara leaves those visits in place, makes no network requests, runs no persistent background process, and collects no data.

Works identically on desktop Chrome 105+ and current Brave (Windows, macOS, Linux) from one package. The mobile site (`m.youtube.com`) is excluded.

## Single-purpose statement

Hide YouTube Shorts surfaces on desktop YouTube.

## Permission justification

| Permission | Why it is needed |
| --- | --- |
| Host access `*://*.youtube.com/*` | Inject the Shorts-hiding stylesheet and the Enabled-state sync scripts on YouTube pages only. No other sites. |
| `storage` | Remember the single Enabled on/off value across restarts and sync it to open tabs. |

No other permissions. No `declarativeNetRequest`, no background worker, no remote code, no third-party services.

## Privacy policy

Cognara collects no data. It makes no network requests, uses no analytics, accounts, or third-party services. The only stored value is the on/off Enabled preference in local browser storage on your device.

## Store assets

- Icons: `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png` (placeholder set, correct sizes, valid PNG).
- Screenshots: `store/screenshots/` — 1280×800 placeholders. Replace with real captures before submission (see `store/screenshots/README.md`).
- Category: Productivity. Language: English.
