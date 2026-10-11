// Geometry checks for the visual feedback: captions, USB attachment, and
// postmortem destinations. Run against the static preview and Chrome on 9333.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.BENCH_ORIGIN ?? 'http://localhost:4173';
const debuggerOrigin = process.env.BENCH_DEBUGGER ?? 'http://localhost:9333';
const tab = await fetch(`${debuggerOrigin}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
socket.addEventListener('message', ({data}) => {
  const event=JSON.parse(data);
  if (!event.id) return;
  const call=pending.get(event.id); pending.delete(event.id);
  if (event.error) call.reject(new Error(JSON.stringify(event.error))); else call.resolve(event.result);
});
function cdp(method, params={}) { return new Promise((resolve,reject) => { const seq=++id; pending.set(seq,{resolve,reject}); socket.send(JSON.stringify({id:seq,method,params})); }); }
async function evaluate(expression) { const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description); return result.result.value; }
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function settleScroll() {
  let previous=-1, stable=0;
  for(let i=0;i<80;i++) {
    await delay(100);
    const position=await evaluate('scrollY');
    stable=position===previous?stable+1:0;
    if(stable>=4) return;
    previous=position;
  }
  throw new Error('Native fragment scroll did not settle');
}
async function go(path) { await cdp('Page.navigate',{url:`${origin}/${path}`}); for(let i=0;i<80;i++) { if(await evaluate("Boolean(document.readyState==='complete' && (document.querySelector('.bench-workspace') || document.querySelector('.project-dossier')))")) break; await delay(100); } await evaluate('document.fonts.ready.then(()=>true)'); await delay(1000); }
async function capture(name) { const result=await cdp('Page.captureScreenshot',{format:'png'}); await writeFile(`docs/bench/${name}.png`,Buffer.from(result.data,'base64')); }
async function checkCaptions(label) {
  const collisions=await evaluate(`(() => {
    const objects=[...document.querySelectorAll('[data-object]')];
    const overlap=(a,b)=>a.left<b.right-2 && a.right>b.left+2 && a.top<b.bottom-2 && a.bottom>b.top+2;
    return objects.flatMap(object => {
      const caption=object.querySelector('.bench-object-caption').getBoundingClientRect();
      return objects.filter(other=>other!==object && overlap(caption,other.querySelector('.bench-equipment').getBoundingClientRect())).map(other=>object.dataset.object+' caption overlaps '+other.dataset.object);
    });
  })()`);
  assert.deepEqual(collisions,[],`${label}: caption space`);
}
async function checkUsb() {
  const distances=await evaluate(`(() => ['debug','logic'].map((id,index) => {
    const svg=document.querySelector('[data-object='+id+'] svg');
    const cable=document.querySelector('[data-cable='+id+'-usb] path');
    const start=cable.getPointAtLength(0).matrixTransform(cable.getScreenCTM());
    const plug=new DOMPoint(20,index===0?67:81).matrixTransform(svg.getScreenCTM());
    return {id,distance:Math.hypot(start.x-plug.x,start.y-plug.y)};
  }))()`);
  for(const item of distances) assert.ok(item.distance<1,`${item.id}: USB gap ${item.distance}px`);
}

try {
  await Promise.all([cdp('Page.enable'),cdp('Runtime.enable')]);
  await mkdir('docs/bench',{recursive:true});
  for(const [width,height] of [[1440,900],[1920,1080],[1024,768],[820,900],[390,844],[320,700],[844,390]]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await go('');
    await checkCaptions(`${width}×${height}`);
    if(width>=768) {
      await checkUsb();
      for(const device of ['debug','logic','waypoint']) {
        const point=await evaluate(`(() => { const r=document.querySelector('[data-object=${device}]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
        await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...point}); await delay(250);
        await checkUsb(); await checkCaptions(`${width}×${height} hover ${device}`);
      }
      if(width===1440) {
        await capture('desktop-hover-waypoint');
        await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});
        await delay(250);
        await capture('desktop-bench');
        for(const [target,name] of [['debug','debug-inspection'],['logic','logic-inspection'],['experience','experience-inspection']]) {
          await go(`#${target}`);
          await capture(name);
        }
      }
    }
  }
  for(const [width,height] of [[1440,900],[390,844]]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    for(const [slug,anchor,text] of [
      ['stm32-mixed-signal-instrument','postmortem-usb-latency','20 ms'],
      ['stm32-mixed-signal-instrument','postmortem-sync-skew','−120 ns'],
      ['eeg-acquisition-neurofeedback-system','postmortem-eeg-labels','Labels come from the task launcher'],
    ]) {
      await go(`projects/${slug}/#${anchor}`);
      await settleScroll();
      const target=await evaluate(`(() => {const el=document.getElementById('${anchor}'); return {top:el?.getBoundingClientRect().top,text:el?.textContent};})()`);
      assert.ok(target.text.includes(text),`${anchor}: relevant postmortem content`);
      assert.ok(target.top >= (width<768?110:80) && target.top<height*.6,`${anchor}: target clears navigation (${target.top})`);
      if(anchor==='postmortem-eeg-labels') await capture(`postmortem-${width}`);
    }
  }
  console.log('PASS: all captions clear adjacent equipment across desktop/tablet/mobile/landscape; USB endpoints stay attached on hover; all three postmortems land below navigation on desktop and phone.');
} finally {
  await new Promise(resolve => { socket.addEventListener('close',resolve,{once:true}); socket.close(); });
  await fetch(`${debuggerOrigin}/json/close/${tab.id}`);
}
