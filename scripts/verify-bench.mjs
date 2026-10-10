// Dependency-free browser smoke checks against the static export.
// Run npm start, start Chrome with --headless=new --remote-debugging-port=9333
// and a temporary --user-data-dir, then: node scripts/verify-bench.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.BENCH_ORIGIN ?? 'http://localhost:4173';
const debuggerOrigin = process.env.BENCH_DEBUGGER ?? 'http://localhost:9333';
const base = `${origin}/portfolio`;
const route = `${base}/`;
const screenshots = 'docs/bench';
const tab = await fetch(`${debuggerOrigin}/json/new?about:blank`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let sequence = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', (message) => {
  const event = JSON.parse(message.data);
  if (event.id) {
    const request = pending.get(event.id);
    pending.delete(event.id);
    if (event.error) request?.reject(new Error(JSON.stringify(event.error)));
    else request?.resolve(event.result);
  }
  if (event.method === 'Runtime.exceptionThrown') errors.push(event.params.exceptionDetails.text + ': ' + (event.params.exceptionDetails.exception?.description ?? ''));
  if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') errors.push(event.params.args.map((arg) => arg.value ?? arg.description).join(' '));
  if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) errors.push(`${event.params.response.status}: ${event.params.response.url}`);
});
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? 'Evaluation failed');
  return response.result.value;
}
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
async function waitFor(expression, label) {
  for (let i = 0; i < 80; i++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(100); }
  throw new Error(`Timed out: ${label}; ${JSON.stringify(await evaluate("({url:location.href,focus:document.activeElement?.outerHTML.slice(0,400),title:document.querySelector('#bench-inspection-title')?.textContent,bench:!!document.querySelector('.bench-workspace'),heading:document.querySelector('h1')?.textContent,state:history.state,scroll:[scrollX,scrollY]})"))}; errors: ${errors.join('; ')}`);
}
async function viewport(width, height, mobile = false) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
}
async function go(url) {
  await cdp('Page.navigate', { url });
  await waitFor("document.readyState === 'complete'", 'page load');
}
async function inspection(target) {
  await waitFor(`location.hash === '#${target}' && document.querySelector('#bench-inspection-title')`, target);
  await delay(850);
}
async function clickObject(id) {
  return clickElement(`document.querySelector('[data-object="${id}"]')`);
}
async function clickElement(expression) {
  const point = await evaluate(`(() => {const el = (${expression}); el.scrollIntoView({block:'nearest'}); const r = el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function key(key, code, windowsVirtualKeyCode) {
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
}
async function screenshot(name) {
  await evaluate('document.fonts.ready.then(() => true)');
  await evaluate('Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))).then(() => true)');
  await delay(150);
  const capture = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(`${screenshots}/${name}.png`, Buffer.from(capture.data, 'base64'));
}
async function selectedVisible(id) {
  return evaluate(`(() => {const r=document.querySelector('[data-object="${id}"]').getBoundingClientRect();const p=document.querySelector('.bench-inspection').getBoundingClientRect();return r.left>=0 && r.top>=0 && r.right<=innerWidth && r.bottom<=innerHeight && (r.right<=p.left || r.bottom<=p.top || r.left>=p.right);})()`);
}

try {
  await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
  await mkdir(screenshots, { recursive: true });
  await viewport(1440, 900);
  await go(route);
  await waitFor("document.querySelector('[data-object=" + '"stm32"' + "]') && location.hash === ''", 'bench hydration');
  await delay(900);
  assert.equal(await evaluate("document.body.querySelector(':scope > header, :scope > footer') === null"), true, 'retired chrome is absent on the bench');
  assert.equal(await evaluate("document.title"), "Ziad's Portfolio");
  assert.equal(await evaluate("document.querySelectorAll('[data-object]').length"), 12);
  assert.equal(await evaluate("document.querySelector('.bench-work-area, .bench-view-controls') === null"), true, 'work-area outline and top-right location removed');
  assert.equal(await evaluate("document.querySelector('[data-object=kinetic] [data-device]').dataset.device"), 'kinetic-seven-segment');
  assert.equal(await evaluate("(() => { const lid=document.querySelector('.laptop-lid'), base=document.querySelector('.laptop-base'); return Math.abs(lid.offsetWidth-base.offsetWidth)<1; })()"), true, 'laptop lid and keyboard base share a width');
  assert.equal(await evaluate("document.querySelectorAll('.bench-view-controls button').length"), 0, 'view angle is fixed');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.bench-plane')).getPropertyValue('--bench-angle').trim()"), '28deg');
  assert.equal(await evaluate("document.querySelector('[data-object=debug] [data-device]').dataset.device"), 'jtag-probe');
  assert.equal(await evaluate("document.querySelector('[data-object=logic] [data-device]').dataset.device"), 'logic-analyzer');
  assert.equal(await evaluate("document.querySelector('.scope-capture').complete && document.querySelector('.scope-capture').naturalWidth > 0"), true);
  const overviewTransform = await evaluate("getComputedStyle(document.querySelector('.bench-camera')).transform");
  assert.equal(await evaluate("[...document.querySelectorAll('[data-object]')].every(el=>{const r=el.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight-75})"), true, 'all objects fit desktop overview');
  await screenshot('desktop-bench');
  await clickObject('stm32');
  await inspection('stm32');
  assert.equal(await evaluate("document.activeElement.id"), 'bench-inspection-title');
  assert.equal(await evaluate("document.querySelector('.inspection-link').getAttribute('href')"), '/portfolio/projects/stm32-mixed-signal-instrument/');
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('.bench-camera')).transform"), overviewTransform);
  assert.equal(await selectedVisible('stm32'), true, 'scope remains visible beside inspection');
  assert.equal(await evaluate("[...document.querySelectorAll('[data-object]:not(.is-selected)')].every(el=>el.tabIndex===-1)"), true, 'clipped objects do not receive keyboard focus during inspection');
  await screenshot('stm32-inspection');
  await evaluate("document.querySelector('[role=tab]').focus()");
  await key('ArrowRight', 'ArrowRight', 39);
  await waitFor("document.querySelector('[role=tab][data-state=active]').textContent==='Build'", 'keyboard project tab');
  assert.equal(await evaluate("document.querySelectorAll('.inspection-system details').length"), 6);
  await evaluate("document.querySelector('.inspection-system summary').focus()");
  await key('Enter', 'Enter', 13);
  assert.equal(await evaluate("document.querySelector('.inspection-system details').open"), true, 'keyboard component inspection');
  await clickElement("[...document.querySelectorAll('[role=tab]')].find(el=>el.textContent==='Evidence')");
  await waitFor("document.querySelector('.inspection-gallery img')?.complete && document.querySelector('.inspection-gallery img')?.naturalWidth > 0", 'real capture loads');
  const captureSrc = await evaluate("document.querySelector('.inspection-gallery img').src");
  await evaluate("document.querySelector('[aria-label=\"Next project image\"]').click()");
  await waitFor(`document.querySelector('.inspection-gallery img')?.src !== ${JSON.stringify(captureSrc)} && document.querySelector('.inspection-gallery img')?.complete`, 'gallery navigation');
  await key('Escape', 'Escape', 27);
  await waitFor("location.hash==='' && !document.querySelector('#bench-inspection')", 'Escape returns to bench');
  assert.equal(await evaluate("document.activeElement.dataset.object"), 'stm32');
  await delay(850);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.bench-camera')).transform"), overviewTransform);

  // Real keyboard input, with the same inspection behavior as pointer input.
  await key('Tab', 'Tab', 9);
  assert.equal(await evaluate("document.activeElement.dataset.object"), 'experience');
  await key('Enter', 'Enter', 13);
  await inspection('experience');
  await key('Escape', 'Escape', 27);
  await delay(850);
  await clickObject('eeg');
  await inspection('eeg');
  assert.equal(await selectedVisible('eeg'), true, 'EEG board remains visible beside inspection');
  await screenshot('eeg-inspection');
  await evaluate('history.back()');
  await waitFor("location.hash === '' && !document.querySelector('#bench-inspection')", 'browser Back');
  await evaluate('history.forward()');
  await inspection('eeg');
  await key('Escape', 'Escape', 27);
  await delay(850);
  await clickObject('board');
  await inspection('board');
  assert.equal(await evaluate("document.querySelector('.inspection-link').getAttribute('href')"), '/portfolio/projects/stm32-mixed-signal-instrument/#lens-hardware');
  assert.equal(await evaluate("history.state.benchObject"), 'board', 'accessory remembers its camera target');
  assert.equal(await selectedVisible('board'), true, 'development board focus fits');

  const instrumentSummaries = [];
  for (const target of ['stm32', 'board', 'logic', 'eeg', 'waypoint', 'debug', 'experience', 'about', 'contact', 'projects', 'kinetic', 'camera', 'iot', 'charging', 'iguard']) {
    await go(`${route}#${target}`);
    await inspection(target);
    assert.equal(await evaluate("document.querySelectorAll('[role=dialog]').length"), 1);
    const object = ['camera', 'iot', 'charging', 'iguard'].includes(target) ? 'projects' : target;
    if (['stm32', 'board', 'logic'].includes(target)) instrumentSummaries.push(await evaluate("document.querySelector('.inspection-summary').textContent"));
    assert.equal(await selectedVisible(object), true, `${target} focus fits viewport`);
    assert.equal(await evaluate("(()=>{const b=document.querySelector('.back-to-bench').getBoundingClientRect();const p=document.querySelector('.bench-inspection').getBoundingClientRect();return b.height>=44 && b.top>=p.top && b.bottom<=p.bottom;})()"), true, 'return control stays visible');
    if (['board', 'kinetic', 'logic', 'debug', 'waypoint', 'projects', 'experience'].includes(target)) await screenshot(`${target}-inspection`);
  }
  assert.equal(new Set(instrumentSummaries).size, 3, 'scope, board, and logic have distinct content');
  await go(`${route}#projects`);
  await inspection('projects');
  assert.equal(await evaluate("document.querySelectorAll('.inspection-project-row').length"), 8);
  await evaluate("[...document.querySelectorAll('.inspection-project-row')].find(el=>el.textContent.includes('Kinetic')).click()");
  await inspection('kinetic');
  assert.equal(await selectedVisible('kinetic'), true);
  await key('Escape', 'Escape', 27);
  assert.equal(await evaluate("document.activeElement.dataset.object"), 'kinetic', 'library selection restores dedicated display focus');
  await go(`${route}#debug`);
  await inspection('debug');
  assert.equal(await evaluate("document.querySelectorAll('.inspection-debug-stories details').length"), 3);
  const postmortems = await evaluate("[...document.querySelectorAll('.inspection-debug-stories a')].map(el=>el.href)");
  for (const url of postmortems) {
    assert.match(new URL(url).hash, /^#postmortem-/);
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(`id=\"${new URL(url).hash.slice(1)}\"`), 'postmortem target exists');
  }
  await clickElement("document.querySelector('.back-to-bench')");
  await waitFor("location.hash==='' && !document.querySelector('#bench-inspection')", 'pointer Back to bench');
  await go(`${route}#about`);
  await inspection('about');
  await clickElement("[...document.querySelectorAll('[role=tab]')].find(el=>el.textContent==='Skills')");
  assert.equal(await evaluate("document.querySelectorAll('.inspection-skill-layers details').length"), 8);
  assert.equal(await evaluate("document.querySelectorAll('.inspection-skill-layers a').length"), 0, 'skills have no project links');
  await clickElement("[...document.querySelectorAll('[role=tab]')].find(el=>el.textContent==='Credentials')");
  assert.equal(await evaluate("document.querySelectorAll('.inspection-credentials li').length"), 6);
  assert.equal(await evaluate("document.querySelector('.inspection-body').textContent.includes('Also:')"), false);
  await screenshot('credentials-inspection');
  await go(`${route}#research-experience`);
  await waitFor("document.querySelector('#bench-inspection-title')?.textContent === 'Experience / Research'", 'legacy homepage hash');
  assert.equal(await evaluate("document.querySelectorAll('.inspection-timeline article').length"), 3);
  assert.equal(await evaluate("document.querySelectorAll('.inspection-timeline .inspection-technologies').length"), 0, 'experience entries consistently use prose');
  await go(`${route}#invalid`);
  await waitFor("location.hash === '' && !document.querySelector('#bench-inspection')", 'invalid hash fallback');
  await go(`${route}?ref=bench#bench`);
  await waitFor("location.hash === '' && !document.querySelector('#bench-inspection')", 'legacy bench URL becomes the base URL');
  assert.equal(await evaluate("location.search"), '?ref=bench', 'normalization preserves query parameters');
  await go(`${route}?ref=bench#stm32`);
  await inspection('stm32');
  await clickElement("document.querySelector('.bench-dock button')");
  await waitFor("location.hash === '' && !document.querySelector('#bench-inspection')", 'Bench dock uses the base URL');
  assert.equal(await evaluate("location.search"), '?ref=bench', 'returning to the bench preserves query parameters');
  await go(`${route}#stm32`);
  await inspection('stm32');
  assert.equal(await evaluate("document.querySelector('.bench-identity a').getAttribute('href')"), '/portfolio/');
  await clickElement("document.querySelector('.bench-identity a')");
  await waitFor("location.hash === '' && !document.querySelector('#bench-inspection')", 'identity link returns to the base URL');
  await viewport(1920, 1080);
  await delay(900);
  assert.equal(await evaluate("[...document.querySelectorAll('[data-object]')].every(el=>{const r=el.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight-75})"), true, '1920px overview fits');
  await screenshot('desktop-bench-1920');
  await viewport(1024, 768);
  await go(`${route}#stm32`);
  await inspection('stm32');
  assert.equal(await selectedVisible('stm32'), true, 'laptop-width focus fits');
  await viewport(820, 900);
  await go(`${route}#eeg`);
  await inspection('eeg');
  assert.equal(await selectedVisible('eeg'), true, 'tablet board visible above inspection');

  await viewport(390, 844, true);
  await go(route);
  await delay(900);
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, 'no horizontal mobile overflow');
  assert.equal(await evaluate("document.querySelector('.bench-viewport').scrollHeight > document.querySelector('.bench-viewport').clientHeight"), true, 'mobile scene scrolls');
  assert.equal(await evaluate("[...document.querySelectorAll('.bench-dock button, .bench-dock a')].every(el=>el.getBoundingClientRect().height>=44)"), true, 'dock touch targets');
  await screenshot('mobile-bench');
  await clickObject('stm32');
  await inspection('stm32');
  assert.equal(await selectedVisible('stm32'), true, 'mobile scope visible above inspection');
  await screenshot('mobile-inspection');
  await key('Escape', 'Escape', 27);
  await delay(650);
  await evaluate("document.querySelector('[data-object=stm32]').focus()");
  await key('Tab', 'Tab', 9);
  assert.equal(await evaluate("document.activeElement.dataset.object"), 'board', 'mobile keyboard order matches visual order');
  await go(`${route}#eeg`);
  await inspection('eeg');
  assert.equal(await selectedVisible('eeg'), true, 'direct mobile hash scrolls to board');
  await key('Escape', 'Escape', 27);
  await delay(650);
  assert.equal(await evaluate("document.querySelector('.bench-viewport').scrollTop"), 0, 'mobile Back to bench restores top');
  await evaluate('history.back()');
  await inspection('eeg');
  await evaluate('history.forward()');
  await waitFor("location.hash==='' && !document.querySelector('#bench-inspection')", 'mobile history overview');
  await delay(650);
  assert.equal(await evaluate("document.querySelector('.bench-viewport').scrollTop"), 0, 'mobile hash overview restores top');
  await viewport(320, 700, true);
  await go(route);
  await delay(900);
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, '320px width has no horizontal overflow');
  assert.equal(await evaluate("[...document.querySelectorAll('.bench-dock button, .bench-dock a')].every(el=>el.getBoundingClientRect().width>=44)"), true, 'small-screen dock touch targets');
  await clickObject('stm32');
  await inspection('stm32');
  assert.equal(await selectedVisible('stm32'), true, 'small-screen scope stays visible');

  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const [width, height] of [[1440, 500], [844, 390], [667, 375]]) {
    await viewport(width, height);
    for (const target of ['contact', 'stm32', 'about']) {
      await go(`${route}#${target}`);
      await inspection(target);
      assert.equal(await evaluate("[document.querySelector('.bench-dock'),document.querySelector('.bench-inspection')].every(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth})"), true, `${width}x${height}: navigation and inspection fit a short window`);
      assert.equal(await evaluate("document.querySelector('.inspection-body').clientHeight>=64"), true, `${width}x${height}: inspection retains a usable scrolling area`);
      if (target === 'contact') await screenshot(`landscape-${width}x${height}`);
    }
  }
  console.log('PASS: short desktop and landscape phone navigation, inspection controls, and scrollable content.');
  await viewport(1440, 900);
  await go(`${route}#waypoint`);
  await inspection('waypoint');
  assert.equal(await evaluate("parseFloat(getComputedStyle(document.querySelector('.bench-camera')).transitionDuration) <= 0.001"), true, 'reduced motion uses an instant or 1ms transition');
  await evaluate("document.querySelector('.inspection-link').click()");
  await waitFor("location.pathname.endsWith('/projects/led-waypoint-compass/') && document.querySelector('h1')", 'full project link navigation');
  assert.equal(await evaluate("document.body.querySelector(':scope > header, :scope > footer') === null"), true, 'old portfolio chrome is removed');
  assert.equal(await evaluate("document.querySelector('a[href=\"/portfolio/#waypoint\"]').textContent.includes('Back to workbench')"), true, 'project return link opens its bench inspection');
  await evaluate('history.back()');
  await inspection('waypoint');
  assert.equal(await evaluate("!!document.querySelector('.bench-workspace')"), true, 'browser Back restores the bench after opening a project');
  await evaluate("document.querySelector('.inspection-link').click()");
  await waitFor("location.pathname.endsWith('/projects/led-waypoint-compass/') && document.querySelector('h1')", 'reopen project');
  await clickElement("[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Back to workbench'))");
  await inspection('waypoint');
  assert.equal(await selectedVisible('waypoint'), true, 'explicit project return restores the focused object');

  // Technical content remains accessible without the retired portfolio shell.
  for (const path of ['stm32-mixed-signal-instrument', 'eeg-acquisition-neurofeedback-system', 'led-waypoint-compass', 'electromagnetic-kinetic-7-segment-display', 'smart-security-camera-raspberry-pi', 'iot-device-automation', 'nyc-dynamic-wireless-charging-roads', 'iguard-incident-reporting-app'].map((slug) => `/projects/${slug}/`)) {
    await go(`${base}${path}`);
    await waitFor("document.querySelector('h1')", path);
    assert.equal(await evaluate("document.title"), "Ziad's Portfolio");
    assert.equal(await evaluate("document.body.querySelector(':scope > header, :scope > footer') === null"), true);
    assert.equal(await evaluate("!![...document.querySelectorAll('a')].find(a=>a.textContent.includes('Back to workbench') && a.hash && a.pathname==='/portfolio/')"), true, 'each project returns to a bench target');
  }
  assert.equal((await fetch(`${base}/overview/`)).status, 404, 'old overview route is removed');
  for (const retired of ['bench-prototype', 'project-sample']) assert.equal((await fetch(`${base}/${retired}/`)).status, 404, `${retired} route is removed`);
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  await go(route);
  assert.equal(await evaluate("document.querySelector('a[href*=\"/overview\"]') === null"), true, 'no links to the retired design');
  assert.equal(await evaluate("document.querySelectorAll('.bench-noscript li').length"), 8, 'non-JavaScript project fallback');
  await cdp('Emulation.setScriptExecutionDisabled', { value: false });
  assert.equal((await fetch(`${base}/resume.pdf`)).status, 200);
  assert.deepEqual(errors, [], 'no runtime, hydration, or network errors');
  console.log('PASS: bench homepage, fixed angle, distinct devices, all 8 projects, architecture and evidence tabs, gallery, debugging, experience, education/skills/credentials, desktop/laptop/tablet/mobile, pointer/keyboard, Escape/focus restoration, direct/legacy hashes, Back/Forward, reduced motion, retired overview and portfolio chrome removed, project return links, all project pages, retired prototype routes, non-JavaScript fallback, basePath assets, resume, and no browser errors.');
  console.log(`Screenshots saved to ${screenshots}/.`);
} finally {
  await new Promise((resolve) => { socket.addEventListener('close', resolve, { once: true }); socket.close(); });
  await fetch(`${debuggerOrigin}/json/close/${tab.id}`).catch(() => {});
}
