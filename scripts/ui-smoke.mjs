// Exercise the real browser controller with a minimal DOM/canvas stand-in.
import assert from 'node:assert/strict';
const elements=new Map();
const gradient={addColorStop(){}};
const context=new Proxy({createRadialGradient:()=>gradient},{get:(obj,key)=>key in obj?obj[key]:()=>{},set:(obj,key,value)=>(obj[key]=value,true)});
function element(key){if(!elements.has(key))elements.set(key,{textContent:'',innerHTML:'',style:{},dataset:{},open:false,disabled:false,events:{},classList:{add(){},remove(){}},setAttribute(){},focus(){},getContext:()=>context,getBoundingClientRect:()=>({width:1000,height:625,left:0,top:0}),addEventListener(name,fn){this.events[name]=fn},querySelector:()=>({focus(){}})});return elements.get(key)}
globalThis.document={querySelector:element,createElement:()=>element(`created-${elements.size}`),addEventListener(){},hidden:false};
globalThis.window={addEventListener(){}};globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.devicePixelRatio=1;
globalThis.ResizeObserver=class{constructor(cb){this.cb=cb}observe(){this.cb()}};
let frame;globalThis.requestAnimationFrame=cb=>frame=cb;
await import('../dist/survival.mjs');
element('#start').onclick();
const base=performance.now();let ticks=0;
while(!element('#overlay').innerHTML.includes('data-talent')&&ticks<4000){ticks++;frame(base+ticks*1000/60)}
const html=element('#overlay').innerHTML;
assert.equal((html.match(/data-talent=/g)||[]).length,3,'level-up UI must offer exactly three cards');
const level=Number(element('#level').textContent),time=element('#time').textContent;
assert.ok(level>=2,'HUD must show the new level while choosing an upgrade');
for(let i=0;i<120;i++)frame(base+(++ticks)*1000/60);
assert.equal(element('#time').textContent,time,'upgrade screen must pause the live controller');
const id=html.match(/data-talent="([^"]+)"/)[1];
element('#overlay').events.click({target:{closest:()=>({dataset:{talent:id}})}});
assert.equal(element('#ability-count').textContent,1,'chosen passive must appear in the build');
assert.ok(element('#build').innerHTML.includes('ability-item'));
element('#pause').onclick();assert.ok(element('#overlay').innerHTML.includes('Your run is paused'));
element('#pause').onclick();
element('#start').onclick();assert.equal(element('#ability-count').textContent,0,'restart must clear the previous build');
assert.ok(element('#build').innerHTML.includes('Your story is unwritten'));
console.log(`Controller smoke passed: real combat reached level ${level}, three cards rendered, choosing updates the build, pause and restart work.`);
