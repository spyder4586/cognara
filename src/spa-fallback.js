/* Cognara: SPA + fallback hardening (ticket 04).
 *
 * Keeps hiding solid across YouTube single-page navigations with no
 * polling and no background work. The static stylesheet
 * (src/hide-shorts.css) remains the single hide seam and already covers
 * all 15 known Shorts surfaces; this script only covers what CSS cannot
 * target: unknown future wrappers containing a "/shorts/" link that no
 * CSS selector matches. Hide-only: never touches the fullscreen Shorts
 * player itself, never blocks network, never redirects.
 */

(function () {
  var THROTTLE_MS = 200;
  var MAX_NODES_PER_PASS = 100;
  var MAX_LINKS_PER_PASS = 200;
  var DEFAULT_ENABLED = true;
  var MARK = "cognaraFallbackHidden";

  // Every container already hidden by hide-shorts.css. Links inside one
  // of these are skipped: CSS handles them, so JS stays fallback-only.
  var COVERED =
    "ytd-guide-entry-renderer," +
    "ytd-mini-guide-entry-renderer," +
    "ytd-rich-shelf-renderer," +
    "ytd-reel-shelf-renderer," +
    "ytd-rich-section-renderer," +
    "ytd-shelf-renderer," +
    "ytd-rich-item-renderer," +
    "ytd-video-renderer," +
    "ytd-grid-video-renderer," +
    "ytd-compact-video-renderer," +
    "ytd-reel-item-renderer," +
    "yt-tab-shape," +
    "ytd-grid-shelf-renderer," +
    "grid-shelf-view-model," +
    "ytm-shorts-lockup-view-model-v2";

  // Containers CSS does not target. Only used when a "/shorts/" link has
  // NO covered ancestor, i.e. a future wrapper YouTube introduced after
  // the stylesheet was written. Tile/row level only: section-level
  // containers (e.g. ytd-item-section-renderer, the whole results column)
  // must never be hidden, or the page blanks and YouTube keeps firing
  // continuations that look like endless loading.
  var FALLBACK_CONTAINER =
    "ytd-horizontal-card-list-renderer," +
    "ytd-compact-radio-renderer," +
    "ytd-playlist-panel-video-renderer," +
    "ytd-statement-banner-renderer";

  // Never hide inside the Shorts player itself (ADR-0001 hide-only:
  // direct /shorts/ID visits stay in the Shorts player).
  var PLAYER_SCOPE =
    "ytd-reel-video-renderer,ytd-shorts,#shorts-player," +
    "ytd-reel-player-overlay-renderer";

  var enabled = DEFAULT_ENABLED;
  var pending = [];
  var timer = null;
  var observer = null;
  var hidden = [];

  function isEnabledByAttr() {
    var root = document.documentElement;
    if (!root || !root.dataset) return enabled;
    // enabled-sync.js mirrors storage onto this attribute; missing means
    // Enabled (default-on, zero flash). An explicit "false" wins.
    if (root.dataset.cognaraEnabled === "false") return false;
    return enabled;
  }

  function restoreAll() {
    for (var i = 0; i < hidden.length; i++) {
      var el = hidden[i];
      if (el && el.dataset && el.dataset[MARK] === "true") {
        el.style.display = "";
        delete el.dataset[MARK];
      }
    }
    hidden = [];
  }

  function hideFallbackContainer(el) {
    if (!el || el.dataset[MARK] === "true") return;
    // Don't fight CSS: if CSS already hides it, leave it alone.
    try {
      var computed = window.getComputedStyle
        ? window.getComputedStyle(el).display
        : "";
      if (computed === "none") return;
    } catch (e) {
      // getComputedStyle unavailable in edge contexts: still hide.
    }
    el.dataset[MARK] = "true";
    el.style.display = "none";
    hidden.push(el);
  }

  function handleLink(link) {
    if (!link || link.nodeType !== 1) return;
    try {
      // Player scope: never hide the reel player itself.
      if (link.closest && link.closest(PLAYER_SCOPE)) return;
      // Already covered by CSS: skip, fallback-only.
      if (link.closest && link.closest(COVERED)) return;
      var target = null;
      if (link.closest) {
        // Tile level first: never hide more than one tile/row, so an
        // unknown future wrapper cannot blank a whole section.
        target =
          link.closest('[id="dismissible"]') ||
          link.closest(FALLBACK_CONTAINER);
      }
      if (!target || target === document.documentElement) {
        // Last resort: hide just the link, minimal collateral.
        target = link;
      }
      // Refuse to hide page-level or player-level ancestors.
      if (
        target === document.documentElement ||
        target === document.body ||
        (target.closest && target.closest(PLAYER_SCOPE))
      ) {
        return;
      }
      hideFallbackContainer(target);
    } catch (e) {
      // Selector quirks on exotic nodes: skip, CSS still applies.
    }
  }

  function scanNode(node, budget) {
    if (!node || node.nodeType !== 1 || budget.count >= budget.max) return;
    if (typeof node.matches === "function") {
      try {
        if (
          node.matches('a[href^="/shorts/"]') &&
          budget.count < budget.max
        ) {
          budget.count++;
          handleLink(node);
        }
      } catch (e) {
        // Ignore bad-match errors on custom elements.
      }
    }
    var links = null;
    try {
      links = node.querySelectorAll
        ? node.querySelectorAll('a[href^="/shorts/"]')
        : null;
    } catch (e) {
      links = null;
    }
    if (links) {
      for (var i = 0; i < links.length && budget.count < budget.max; i++) {
        budget.count++;
        handleLink(links[i]);
      }
    }
  }

  function process() {
    timer = null;
    if (!isEnabledByAttr()) {
      pending = [];
      restoreAll();
      return;
    }
    var nodes = pending;
    pending = [];
    var budget = { count: 0, max: MAX_LINKS_PER_PASS };
    var seen = Math.min(nodes.length, MAX_NODES_PER_PASS);
    for (var i = 0; i < seen; i++) {
      scanNode(nodes[i], budget);
      if (budget.count >= budget.max) break;
    }
  }

  function schedule() {
    if (timer !== null) return;
    try {
      timer = setTimeout(process, THROTTLE_MS);
    } catch (e) {
      // setTimeout unavailable: run inline as a degraded pass.
      process();
    }
  }

  function onMutations(mutations) {
    for (var m = 0; m < mutations.length; m++) {
      var added = mutations[m] && mutations[m].addedNodes;
      if (!added) continue;
      for (var i = 0; i < added.length; i++) {
        var node = added[i];
        if (node && node.nodeType === 1) {
          if (pending.length < MAX_NODES_PER_PASS) pending.push(node);
        }
      }
    }
    if (pending.length > 0) schedule();
  }

  function attach() {
    var root = document.documentElement;
    if (!root) return false;
    if (observer) return true;
    try {
      observer = new MutationObserver(onMutations);
      observer.observe(root, { childList: true, subtree: true });
    } catch (e) {
      observer = null;
      return false;
    }
    // YouTube SPA navigation event: schedule one throttled pass so
    // unknown wrappers inserted without a reload are still caught.
    // CSS already hides known surfaces before paint; this is only the
    // fallback scan, still throttled, still no polling.
    try {
      window.addEventListener("yt-navigate-finish", schedule, true);
    } catch (e) {
      // Event hookup optional: observer alone still catches insertions.
    }
    return true;
  }

  function ensureAttached() {
    if (attach()) return;
    // documentElement not ready yet (document_start edge): wait for it.
    try {
      var waiter = new MutationObserver(function () {
        if (document.documentElement) {
          waiter.disconnect();
          attach();
        }
      });
      waiter.observe(document, { childList: true, subtree: true });
    } catch (e) {
      // No observer support: CSS-only hiding still applies.
    }
  }

  function readEnabled() {
    try {
      chrome.storage.local.get({ enabled: DEFAULT_ENABLED }, function (
        items
      ) {
        enabled = !items || items.enabled !== false;
        if (!enabled) restoreAll();
        else schedule();
      });
    } catch (e) {
      enabled = DEFAULT_ENABLED;
    }
  }

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === "local" && changes && changes.enabled) {
        enabled = changes.enabled.newValue !== false;
        if (!enabled) {
          if (timer !== null) {
            try {
              clearTimeout(timer);
            } catch (e) {
              // Ignore clear failure; process() re-checks Enabled.
            }
            timer = null;
          }
          pending = [];
          restoreAll();
        } else {
          schedule();
        }
      }
    });
  } catch (e) {
    // Listener unavailable: one-shot read below still applies.
  }

  readEnabled();
  ensureAttached();
})();
