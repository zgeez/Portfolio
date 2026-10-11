// Visual/text audit captures for the local static portfolio (Chrome CDP, no dependencies).
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.BENCH_ORIGIN ?? 'http://localhost:4173';
const debug = process.env.BENCH_DEBUGGER ?? 'http://localhost:9333';
const output = process.env.AUDIT_OUTPUT ?? 'docs/audit/captures';
await mkdir(output, { recursive: true });
const tab = await fetch(`${debug}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', ({ data }) => {
  const event = JSON.parse(data);
  if (event.id) { const call = pending.get(event.id); pending.delete(event.id); event.error ? call.reject(new Error(JSON.stringify(event.error))) : call.resolve(event.result); }
  if (event.method === 'Runtime.exceptionThrown') errors.push(event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text);
  if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) errors.push(`${event.params.response.status} ${event.params.response.url}`);
});
const cdp = (method, params = {}) => new Promise((resolve, reject) => { const seq = ++id; pending.set(seq, { resolve, reject }); socket.send(JSON.stringify({ id: seq, method, params })); });
async function evaluate(expression) { const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value; }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) { for (let attempt = 0; attempt < 100; attempt++) { if (await evaluate(expression)) return; await delay(100); } throw new Error(`Timed out: ${expression}`); }
async function go(url) { await cdp('Page.navigate', { url }); await waitFor("document.readyState==='complete'"); await evaluate('document.fonts.ready.then(()=>true)'); await delay(250); }
async function viewport(width, height) { await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }); }
async function capture(name) {
  await waitFor("[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.height&&r.top<innerHeight&&r.bottom>0}).every(img=>img.complete&&img.naturalWidth)");
  const screenshot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(`${output}/${name}.png`, Buffer.from(screenshot.data, 'base64'));
}
const routes = ['stm32-mixed-signal-instrument', 'eeg-acquisition-neurofeedback-system', 'led-waypoint-compass', 'electromagnetic-kinetic-7-segment-display', 'smart-security-camera-raspberry-pi', 'iot-device-automation', 'nyc-dynamic-wireless-charging-roads', 'iguard-incident-reporting-app'];
const report = { projects: [], bench: [], errors };
try {
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const slug of routes) {
    await viewport(1440, 1000); await go(`${base}/projects/${slug}/`);
    const entry = await evaluate(`({slug:${JSON.stringify(slug)},text:document.querySelector('.dossier-content').innerText,chapters:[...document.querySelectorAll('[data-project-chapter]')].map(el=>({id:el.id,title:el.querySelector('h2').innerText})),links:[...document.querySelectorAll('a[href]')].map(el=>({text:el.innerText,href:el.href})),media:[...document.images].map(img=>({src:img.src,alt:img.alt}))})`);
    await capture(`${slug}-header`);
    for (const chapter of entry.chapters) {
      await evaluate(`document.getElementById(${JSON.stringify(chapter.id)}).scrollIntoView({behavior:'instant',block:'start'})`); await delay(100);
      await capture(`${slug}-${chapter.id}`);
    }
    await viewport(390, 844); await go(`${base}/projects/${slug}/`);
    entry.mobileOverflow = await evaluate('document.documentElement.scrollWidth>innerWidth');
    report.projects.push(entry);
    console.log(`Captured ${slug}: ${entry.chapters.length} chapters.`);
  }
  for (const [width, height] of [[1440,900],[1440,600],[844,390],[667,375],[320,568]]) {
    await viewport(width,height);
    for (const target of ['bench','contact','experience','about','projects']) {
      await go(`${base}/${target === 'bench' ? '' : '#' + target}`); await waitFor(target==='bench' ? "!document.querySelector('.bench-inspection') && location.hash===''" : "!!document.querySelector('.bench-inspection')"); await delay(150);
      report.bench.push(await evaluate(`({width:innerWidth,height:innerHeight,target:${JSON.stringify(target)},dock:(()=>{const r=document.querySelector('.bench-dock').getBoundingClientRect();return {top:r.top,bottom:r.bottom}})(),panel:(()=>{const el=document.querySelector('.bench-inspection');if(!el)return null;const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,scrollWidth:el.scrollWidth,width:r.width}})(),text:document.querySelector('.bench-inspection')?.innerText})`));
      await capture(`bench-${width}x${height}-${target}`);
    }
  }
  const links = [...new Set(report.projects.flatMap(p=>p.links.map(l=>l.href)).filter(href=>href.startsWith(base)))];
  report.localLinks = [];
  for (const href of links) {
    const response = await fetch(href); const html = await response.text(); const hash = new URL(href).hash.slice(1);
    report.localLinks.push({ href, status: response.status, anchorFound: !hash || href.includes('/#') || html.includes(`id="${hash}"`) });
  }
  await writeFile(`${output}/report.json`, JSON.stringify(report,null,2));
  console.log(JSON.stringify({errors,overflow:report.projects.filter(p=>p.mobileOverflow).map(p=>p.slug),shortWindowIssues:report.bench.filter(p=>p.dock.bottom>p.height||p.panel?.bottom>p.height||p.panel?.top<0),brokenLinks:report.localLinks.filter(l=>l.status!==200||!l.anchorFound)},null,2));
} finally {
  await new Promise(resolve => { socket.addEventListener('close', resolve, { once: true }); socket.close(); });
  await fetch(`${debug}/json/close/${tab.id}`);
}
