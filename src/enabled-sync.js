/* Cognara: Enabled state seam (ticket 03).
 *
 * Reads the single Enabled bool from storage.local (default true)
 * at document_start and mirrors it onto
 * documentElement[data-cognara-enabled], which gates src/hide-shorts.css.
 * Listens to storage.onChanged so open tabs update without a reload.
 * No polling, no background worker.
 */

(function () {
  var ATTR = "cognaraEnabled";
  var DEFAULT_ENABLED = true;

  function apply(enabled) {
    var value = enabled ? "true" : "false";
    var root = document.documentElement;
    if (root) {
      if (root.dataset[ATTR] !== value) root.dataset[ATTR] = value;
      return;
    }
    // documentElement not ready yet (document_start edge): wait for it.
    var observer = new MutationObserver(function () {
      var el = document.documentElement;
      if (el) {
        el.dataset[ATTR] = value;
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  function readEnabled() {
    try {
      chrome.storage.local.get({ enabled: DEFAULT_ENABLED }, function (items) {
        apply(items && items.enabled !== false);
      });
    } catch (e) {
      // Storage unavailable: leave attribute unset, CSS defaults to hiding.
    }
  }

  try {
    chrome.storage.onChanged.addListener(function (changes, area) {
      if (area === "local" && changes && changes.enabled) {
        apply(changes.enabled.newValue !== false);
      }
    });
  } catch (e) {
    // Listener unavailable: one-shot read below still applies.
  }

  readEnabled();
})();
