// Browser verification for all eight project dossiers against the static export.
// Requires npm start and headless Chrome with --remote-debugging-port=9333.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.BENCH_ORIGIN ?? 'http://localhost:4173';
const debuggerOrigin = process.env.BENCH_DEBUGGER ?? 'http://localhost:9333';
const base = `${origin}/portfolio`;
const entries = [
  ['stm32-mixed-signal-instrument', 'stm32', 'board'],
  ['eeg-acquisition-neurofeedback-system', 'eeg', 'eeg'],
  ['led-waypoint-compass', 'waypoint', 'waypoint'],
  ['electromagnetic-kinetic-7-segment-display', 'kinetic', 'kinetic'],
  ['smart-security-camera-raspberry-pi', 'camera', 'camera'],
  ['iot-device-automation', 'iot', 'iot'],
  ['nyc-dynamic-wireless-charging-roads', 'charging', 'study'],
  ['iguard-incident-reporting-app', 'iguard', 'app'],
];
const tab = await fetch(`${debuggerOrigin}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
const pending = new Map();
const errors = [];
let id = 0;
socket.addEventListener('message', ({ data }) => {
  const event = JSON.parse(data);
  if (event.id) { const call = pending.get(event.id); pending.delete(event.id); if (event.error) call.reject(new Error(JSON.stringify(event.error))); else call.resolve(event.result); }
  if (event.method === 'Runtime.exceptionThrown') errors.push(event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text);
  if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') errors.push(event.params.args.map(arg => arg.value ?? arg.description).join(' '));
  if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) errors.push(`${event.params.response.status} ${event.params.response.url}`);
});
function cdp(method, params = {}) { return new Promise((resolve, reject) => { const seq = ++id; pending.set(seq, { resolve, reject }); socket.send(JSON.stringify({ id: seq, method, params })); }); }
async function evaluate(expression) { const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'Evaluation failed'); return result.result.value; }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function settleScroll() {
  let previous = -1;
  let stable = 0;
  for (let i = 0; i < 80; i++) {
    await delay(50);
    const position = await evaluate('scrollY');
    stable = position === previous ? stable + 1 : 0;
    if (stable >= 4) return;
    previous = position;
  }
  throw new Error('Scroll did not settle');
}
async function waitFor(expression, label = expression) { for (let i = 0; i < 80; i++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(100); } throw new Error(`Timed out: ${label}; ${await evaluate('location.href')}; ${errors.join('; ')}`); }
async function viewport(width, height) { await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }); }
async function go(slug, hash = '') {
  await cdp('Page.navigate', { url: `${base}/projects/${slug}/${hash}` });
  await waitFor(`document.readyState==='complete' && document.querySelector('.project-dossier')?.dataset.project===${JSON.stringify(slug)}`, slug);
  await evaluate('document.fonts.ready.then(() => true)');
  await delay(150);
}
async function click(expression) {
  await evaluate(`(${expression}).scrollIntoView({behavior:'instant',block:'center'})`);
  await delay(200);
  const point = await evaluate(`(() => { const r = (${expression}).getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2 }; })()`);
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
}
async function key(key, code, windowsVirtualKeyCode) {
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(key === 'Enter' ? { text:'\r' } : {}) });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
}
async function screenshot(name) {
  await evaluate('Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))).then(()=>true)');
  await delay(150);
  const capture = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(`docs/projects/${name}.png`, Buffer.from(capture.data, 'base64'));
}
async function fits(label) {
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, `${label}: document overflow; ${JSON.stringify(await evaluate("[...document.querySelectorAll('.project-dossier *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(el=>({tag:el.tagName,class:el.className,right:el.getBoundingClientRect().right}))"))}`);
}
async function checkChapter(id, label) {
  await evaluate(`document.getElementById(${JSON.stringify(id)}).scrollIntoView({behavior:'instant',block:'start'})`);
  await delay(100);
  await fits(label);
  await waitFor("[...document.querySelectorAll('img')].filter(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0}).every(img=>img.complete&&img.naturalWidth>0)", `${label} visible media`);
}

try {
  await Promise.all([cdp('Page.enable'), cdp('Runtime.enable'), cdp('Network.enable')]);
  await mkdir('docs/projects', { recursive: true });
  await viewport(1440, 1100);
  for (const [slug, target, artifact] of entries) {
    await go(slug);
    await fits(slug);
    assert.equal(await evaluate("document.title"), "Ziad's Portfolio");
    assert.equal(await evaluate("document.querySelectorAll('h1').length"), 1, 'one document title');
    assert.equal(await evaluate(`!!document.querySelector('.dossier-device-${artifact}')`), true, 'project-specific angled artifact');
    assert.equal(await evaluate(`document.querySelector('.dossier-topbar a').getAttribute('href')`), `/portfolio/#${target}`, 'bench return target');
    assert.equal(await evaluate("document.querySelector('link[rel=canonical]').href"), `https://zgeez.github.io/portfolio/projects/${slug}/`, 'canonical URL retained');
    const chapters = await evaluate("[...document.querySelectorAll('.dossier-chapters a[href^=\"#\"]')].map(a=>a.hash.slice(1))");
    assert.ok(chapters.length >= 5, 'substantive project chapters');
    assert.deepEqual(await evaluate("[...document.querySelectorAll('[data-project-chapter]')].map(el=>el.id)"), chapters, 'rail exactly matches content and order');
    assert.equal(await evaluate("[...document.querySelectorAll('[id]')].length===new Set([...document.querySelectorAll('[id]')].map(el=>el.id)).size"), true, 'unique identifiers');
    assert.equal(await evaluate("[...document.querySelectorAll('[data-project-chapter]')].every(el=>getComputedStyle(el).display!=='none')"), true, 'technical layers are readable without tab switching');
    await screenshot(`${target}-desktop`);
    for (const chapter of chapters) await checkChapter(chapter, `${target}/${chapter}`);
    for (const chapter of chapters.slice(-2)) {
      await click(`document.querySelector('.dossier-chapters a[href="#${chapter}"]')`);
      await settleScroll();
      assert.equal(await evaluate("document.querySelector('.dossier-chapters [aria-current]').hash"), `#${chapter}`, `${target}: a near-bottom anchor keeps its selected chapter`);
    }
    assert.equal(await evaluate("document.querySelector('.dossier-topbar').getBoundingClientRect().top>=0 && document.querySelector('.dossier-topbar').getBoundingClientRect().bottom<=innerHeight"), true, 'return control stays visible at end');
    const html = await fetch(`${base}/projects/${slug}/`).then(response => response.text());
    for (const chapter of chapters) assert.ok(html.includes(`id="${chapter}"`), 'chapter is statically exported');
  }
  console.log('PASS: all eight desktop dossiers, exact chapter maps, preserved metadata, static content, media, and fixed-angle artifacts.');

  await viewport(1440, 600);
  await go(entries[0][0]);
  await click("document.querySelector('.dossier-chapters a[href=\"#source\"]')");
  await settleScroll();
  assert.equal(await evaluate("document.querySelector('.dossier-chapters [aria-current]').hash"), '#source', 'short-window rail agrees with the chapter destination');
  assert.equal(await evaluate("(()=>{const r=document.querySelector('.dossier-chapters a[href=\"#source\"]').getBoundingClientRect();return r.top>=68&&r.bottom<=innerHeight})()"), true, 'last chapter is reachable in a short desktop rail');
  await screenshot('stm32-short-window');
  await viewport(390, 844);
  await delay(300);
  assert.equal(await evaluate("(()=>{const r=document.querySelector('.dossier-chapters [aria-current]').getBoundingClientRect();const nav=document.querySelector('.dossier-chapters').getBoundingClientRect();return r.left>=nav.left&&r.right<=nav.right})()"), true, 'active chapter remains visible when the rail changes to mobile');
  await viewport(1440, 1100);

  const stm32 = entries[0][0];
  await go(stm32);
  await click("document.querySelector('#overview .dossier-evidence-toolbar button')");
  await waitFor("document.querySelector('#overview dialog').open", 'image expands');
  await evaluate("document.querySelector('.dossier-topbar a').focus()");
  assert.equal(await evaluate("document.activeElement.closest('dialog')?.open"), true, 'dialog contains keyboard focus');
  await key('Escape', 'Escape', 27);
  await waitFor("!document.querySelector('#overview dialog').open", 'Escape closes image');
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-label').startsWith('Expand image:')"), true, 'dialog returns focus');
  await go(stm32, '#lens-system');
  await waitFor("document.querySelector('.dossier-chapters [aria-current]').hash==='#lens-system'", 'legacy system anchor');
  await evaluate("document.querySelector('#lens-system svg g[role=button]').focus()");
  await key('Enter', 'Enter', 13);
  assert.equal(await evaluate("document.querySelector('#lens-system .dossier-probe-detail h4').textContent"), 'Host application', 'keyboard component selection');
  await key('Escape', 'Escape', 27);
  assert.equal(await evaluate("document.querySelector('#lens-system svg g[aria-pressed=true]')===null"), true, 'Escape releases component');
  await screenshot('stm32-system');
  await go(stm32, '#lens-signals');
  await waitFor("document.querySelector('.dossier-chapters [aria-current]').hash==='#lens-signals'", 'legacy signals anchor');
  await evaluate("document.querySelector('[aria-label=\"Time cursor\"]').focus()");
  const cursor = await evaluate("document.querySelector('[aria-label=\"Time cursor\"]').getAttribute('aria-valuenow')");
  await key('ArrowRight', 'ArrowRight', 39);
  assert.equal(Number(await evaluate("document.querySelector('[aria-label=\"Time cursor\"]').getAttribute('aria-valuenow')")), Number(cursor) + 1, 'recorded time cursor retained');
  await screenshot('stm32-signals');
  await go(stm32, '#lens-firmware');
  await click("[...document.querySelectorAll('#lens-firmware button')].find(button=>button.textContent.trim()==='after fix')");
  await waitFor("[...document.querySelectorAll('#lens-firmware button')].find(button=>button.textContent.trim()==='after fix').getAttribute('aria-pressed')==='true'", 'latency wake-path demo retained');

  await go(entries[2][0], '#lens-navigation');
  const heading = await evaluate("document.querySelector('input[type=range]').value");
  await evaluate("document.querySelector('input[type=range]').focus()");
  await key('ArrowRight', 'ArrowRight', 39);
  assert.equal(Number(await evaluate("document.querySelector('input[type=range]').value")), Number(heading) + 1, 'Waypoint heading demo retained');
  await go(entries[3][0], '#lens-firmware');
  const before = await evaluate("document.querySelector('#lens-firmware [aria-live]').textContent");
  await click("[...document.querySelectorAll('#lens-firmware button')].find(button=>button.textContent.includes('Next count'))");
  await waitFor(`document.querySelector('#lens-firmware [aria-live]').textContent!==${JSON.stringify(before)}`, 'kinetic XOR demo retained');
  console.log('PASS: native image dialog, Escape/focus, component keyboard controls, timing cursor, latency, Waypoint, and XOR demos.');

  for (const width of [1024, 768, 390, 320]) {
    await viewport(width, 844);
    for (const [slug, target] of entries) {
      await go(slug);
      await fits(`${target}/${width}px`);
      assert.equal(await evaluate("document.querySelector('.dossier-device-platform').getBoundingClientRect().right<=innerWidth"), true, 'angled equipment fits');
      if (width === 390) await screenshot(`${target}-mobile`);
      const ids = await evaluate("[...document.querySelectorAll('[data-project-chapter]')].map(el=>el.id)");
      for (const chapter of ids) await checkChapter(chapter, `${target}/${width}px/${chapter}`);
      if (width < 700) assert.equal(await evaluate("[...document.querySelectorAll('.dossier-probe-selectors button')].every(button=>{const r=button.getBoundingClientRect();return r.width>=44&&r.height>=44})"), true, 'mobile component touch controls');
      if (width === 390 && target === 'stm32') { await checkChapter('overview', 'mobile STM32 overview'); await screenshot('stm32-mobile-content'); }
    }
    console.log(`PASS: all project chapters at ${width}px.`);
  }

  await viewport(1440, 1100);
  await cdp('Page.navigate', { url: `${base}/#logic` });
  await waitFor("document.querySelector('.bench-workspace') && document.querySelector('#bench-inspection-title') && location.hash==='#logic'", 'logic inspection');
  await click("document.querySelector('.inspection-link')");
  await waitFor("document.querySelector('.project-dossier') && location.hash==='#lens-signals'", 'inspection deep link');
  await waitFor("document.querySelector('.dossier-chapters [aria-current]').hash==='#lens-signals'", 'focused project chapter');
  await evaluate('history.back()');
  await waitFor("document.querySelector('.bench-workspace') && location.hash==='#logic'", 'Back to source inspection');
  await evaluate('history.forward()');
  await waitFor("document.querySelector('.project-dossier') && location.hash==='#lens-signals'", 'Forward to dossier');
  await evaluate("document.querySelector('.dossier-chapters a[href=\"#lens-system\"]').click()");
  await waitFor("location.hash==='#lens-system' && document.querySelector('.dossier-chapters [aria-current]').hash==='#lens-system'", 'native chapter link');
  await click("document.querySelector('.dossier-topbar a')");
  await waitFor("document.querySelector('.bench-workspace') && location.hash==='#stm32' && document.querySelector('#bench-inspection-title')", 'explicit return to instrument');
  await evaluate('history.back()');
  await waitFor("document.querySelector('.project-dossier') && location.hash==='#lens-system'", 'Back restores native chapter entry');
  await click("document.querySelector('.dossier-next-project')");
  await waitFor(`document.querySelector('.project-dossier')?.dataset.project===${JSON.stringify(entries[1][0])}`, 'next project');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion', value:'reduce' }] });
  await go(stm32, '#lens-system');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.trace-flow')).animationName"), 'none', 'reduced motion stops diagram flow');
  await cdp('Emulation.setScriptExecutionDisabled', { value:true });
  await go(stm32, '?verify-nojs=1#lens-signals');
  assert.equal(await evaluate("document.querySelectorAll('[data-project-chapter]').length"), 10, 'all technical chapters without JavaScript');
  assert.equal(await evaluate("document.querySelectorAll('#lens-system noscript details').length>0"), true, 'component details without JavaScript');
  assert.equal(await evaluate("document.querySelector('#overview .dossier-evidence-toolbar button').hidden"), true, 'no inert expansion control without JavaScript');
  await cdp('Emulation.setScriptExecutionDisabled', { value:false });
  assert.equal((await fetch(`${base}/project-sample/`)).status, 404, 'retired sample route is absent');
  assert.deepEqual(errors, [], 'no runtime/hydration/resource failures');
  console.log('PASS: bench deep links and Back/Forward, native chapter history, explicit return, next project, reduced motion, non-JavaScript chapters/details, and retired sample removal. No browser errors.');
} finally {
  await new Promise(resolve => { socket.addEventListener('close', resolve, { once:true }); socket.close(); });
  await fetch(`${debuggerOrigin}/json/close/${tab.id}`).catch(() => {});
}
