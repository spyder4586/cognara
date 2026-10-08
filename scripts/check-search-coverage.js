/* Repro/loop for: Shorts visible after YouTube search + page keeps loading.
 *
 * Replays the real search-results structure (grid-shelf-view-model shelf of
 * ytm-shorts-lockup-view-model-v2 tiles, per live ytInitialData Oct 2026)
 * through the EXTENSION'S OWN selector lists (parsed from src/, not copied),
 * asserting the user's exact symptoms:
 *   1. every /shorts/ link has a CSS-covered ancestor (else Shorts stay visible)
 *   2. the fallback never hides a section-level container (else results blank
 *      out and YouTube keeps firing continuations = "loading unnecessarily")
 * Exit non-zero (red) while the bug is present.
 */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'src');

const css = fs.readFileSync(path.join(SRC, 'hide-shorts.css'), 'utf8');
const fallbackJs = fs.readFileSync(path.join(SRC, 'spa-fallback.js'), 'utf8');

function extractList(js, name) {
  const m = js.match(new RegExp('var ' + name + ' =([\\s\\S]*?);'));
  return [...m[1].matchAll(/"([^"]+)"/g)].flatMap(x => x[1].split(',')).map(s => s.trim()).filter(Boolean);
}
const cssTags = [...css.matchAll(/([a-z0-9-]+):has\(a\[href/g)].map(m => m[1]);
const COVERED = extractList(fallbackJs, 'COVERED');
const FALLBACK_CONTAINER = extractList(fallbackJs, 'FALLBACK_CONTAINER');
const SECTION_LEVEL = new Set([
  'ytd-item-section-renderer', 'ytd-two-column-search-results-renderer',
  'ytd-search', 'ytd-app', 'ytd-page-manager', 'html', 'body',
]);

// Fixture: real search-results shape. Shelf of v2 lockups + one normal video,
// all inside the results section.
function link(href) { return { tag: 'a', href, children: [] }; }
function el(tag, children, extra) { return Object.assign({ tag, children }, extra); }
const fixture = el('ytd-app', [
  el('ytd-search', [
    el('ytd-two-column-search-results-renderer', [
      el('ytd-item-section-renderer', [
        el('grid-shelf-view-model', [
          el('ytm-shorts-lockup-view-model-v2', [link('/shorts/aaa')]),
          el('ytm-shorts-lockup-view-model-v2', [link('/shorts/bbb')]),
        ]),
        el('ytd-video-renderer', [link('/watch?v=ccc')]),
      ]),
    ]),
  ]),
]);

function walk(node, ancestors, out) {
  const chain = ancestors.concat(node.tag);
  if (node.tag === 'a' && node.href && node.href.startsWith('/shorts/')) out.push(chain);
  (node.children || []).forEach(c => walk(c, chain, out));
}
const shortsChains = [];
walk(fixture, [], shortsChains);

let failures = 0;
// Check 1: CSS coverage (mirrors tag:has(a[href^="/shorts/"])).
for (const chain of shortsChains) {
  const covered = chain.slice(0, -1).some(t => cssTags.includes(t));
  console.log((covered ? 'PASS' : 'FAIL') + ' css-cover ' + chain.join(' > '));
  if (!covered) failures++;
}
// Check 2: fallback restraint (mirrors handleLink target selection).
function closestIn(chain, tags) {
  for (let i = chain.length - 2; i >= 0; i--) if (tags.includes(chain[i])) return chain[i];
  return null;
}
for (const chain of shortsChains) {
  if (chain.slice(0, -1).some(t => COVERED.includes(t))) { console.log('PASS fallback-skip (css-covered) ' + chain.join(' > ')); continue; }
  const target = closestIn(chain, FALLBACK_CONTAINER) || chain[chain.length - 1];
  const ok = !SECTION_LEVEL.has(target);
  console.log((ok ? 'PASS' : 'FAIL') + ' fallback-target=' + target + ' for ' + chain.join(' > '));
  if (!ok) failures++;
}
console.log(failures ? 'RED: ' + failures + ' failing assertion(s)' : 'GREEN: search Shorts covered, fallback restrained');
process.exit(failures ? 1 : 0);
