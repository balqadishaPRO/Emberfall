// Cosmetics never use gameplay RNG. Recycle a fixed pool and reserve room for class casts.
export const EFFECT_LIMIT=32;
const stores=new WeakMap();
function state(g){let s=stores.get(g);if(!s){s={free:Array.from({length:EFFECT_LIMIT},()=>({})),tokens:16};stores.set(g,s)}return s}
export function effect(g,kind,x,y,r=20,color='#ffe4ac',x2=x,y2=y,important=false){
 const s=state(g),limit=g.enemies.length>64?12:24;
 if(g.effects.length>=EFFECT_LIMIT||(!important&&(g.effects.length>=limit||s.tokens<1)))return;
 if(['ring','earth','electric','fire','frost','nature','holy','arcane','cyclone'].includes(kind)&&g.effects.some(e=>e.kind===kind&&e.color===color&&e.max-e.life<.09&&(e.x-x)**2+(e.y-y)**2<1600))return;
 const e=s.free.pop();if(!e)return;if(!important)s.tokens--;
 const duration=kind==='sacrifice'?1:kind==='roots'?.8:kind==='shield-hit'?.35:kind==='rapidfire'?.5:kind==='cleaver'?.65:kind==='quake'?.8:kind==='meteor-impact'?.7:kind==='orbit-hit'?.3:kind==='bolt'?.18:kind==='muzzle'?.14:kind==='spark'?.22:kind==='death'?.42:kind==='cast'?.55:kind==='cyclone'?.25:['earth','electric','fire','frost','nature','holy','arcane','cyclone'].includes(kind)?.55:.36;
 Object.assign(e,{actorKind:null,actorColor:null,actorScale:1,kind,x,y,r,color,x2,y2,life:duration,max:duration});g.effects.push(e);return e;
}
export function updateEffects(g,dt){const s=state(g);s.tokens=Math.min(16,s.tokens+60*dt);let n=0;for(const e of g.effects){e.life-=dt;if(e.life>0)g.effects[n++]=e;else s.free.push(e)}g.effects.length=n}
