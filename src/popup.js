/* Cognara: popup seam (ticket 03).
 *
 * One toggle bound to the single Enabled bool in storage.local.
 * Default true. Runs only while the popup is open; no framework,
 * no external assets.
 */

(function () {
  var DEFAULT_ENABLED = true;
  var HIDE_TEXT = "Shorts surfaces are hidden.";
  var SHOW_TEXT = "Shorts surfaces are shown.";

  function render(toggle, status, enabled) {
    toggle.checked = enabled !== false;
    if (status) status.textContent = toggle.checked ? HIDE_TEXT : SHOW_TEXT;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("enabledToggle");
    var status = document.getElementById("statusText");
    if (!toggle) return;

    try {
      chrome.storage.local.get({ enabled: DEFAULT_ENABLED }, function (items) {
        render(toggle, status, items && items.enabled);
      });
    } catch (e) {
      render(toggle, status, DEFAULT_ENABLED);
    }

    toggle.addEventListener("change", function () {
      var enabled = toggle.checked;
      try {
        chrome.storage.local.set({ enabled: enabled }, function () {
          render(toggle, status, enabled);
        });
      } catch (e) {
        render(toggle, status, enabled);
      }
    });

    // Keep popup in sync if Enabled changes elsewhere while open.
    try {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (area === "local" && changes && changes.enabled) {
          render(toggle, status, changes.enabled.newValue);
        }
      });
    } catch (e) {
      // No-op: popup still writes on change.
    }
  });
})();
