import assert from 'node:assert/strict';
import {createGame,classes,step,activate,summonPet} from '../dist/engine.mjs';
import {effect,updateEffects,EFFECT_LIMIT} from '../dist/effects.mjs?v=ember-10';
const game=(id='archer')=>{const g=createGame(91,id);g.status='playing';g.spawn=-1e6;g.stats.evade=0;return g};
const hit=g=>{g.enemyBullets.push({x:g.x,y:g.y,vx:0,vy:0,life:1,damage:10,kind:'arrow',r:7});step(g,1/60)};
for(const c of classes){const g=game(c.id);g.shield=0;hit(g);assert.ok(g.hitFlash>0,c.id);assert.ok(g.health<g.stats.maxHealth);activate(g);assert.ok(g.effects.some(e=>e.kind==='cast'||e.kind==='dash'),c.id+' active has visible feedback')}
for(const defense of ['shield','invulnerable','levelGuard','evade','guardian']){const g=game();if(defense==='shield')g.shield=g.stats.shieldMax=20;else if(defense==='evade')g.stats.evade=1;else if(defense==='guardian'){g.health=1;summonPet(g,'guardianpet')}else g[defense]=1;const health=g.health;hit(g);assert.equal(g.health,health,defense);assert.equal(g.hitFlash,0,defense+' must not report health loss')}
const g=game(),random=g.random;let calls=0;g.random=()=>{calls++;return random()};const array=g.effects;
for(let i=0;i<1000;i++)effect(g,'spark',i,0);assert.ok(g.effects.length<=24);effect(g,'cast',0,0,100,'#fff',0,0,true);assert.ok(g.effects.some(e=>e.kind==='cast'),'critical cast has reserved space');
for(let i=0;i<100;i++)effect(g,'cast',i,0,20,'#fff',0,0,true);assert.equal(g.effects.length,EFFECT_LIMIT);const identities=new Set(g.effects);updateEffects(g,1);assert.equal(g.effects.length,0);assert.equal(g.effects,array);
for(let i=0;i<32;i++)effect(g,'cast',i,0,20,'#fff',0,0,true);assert.ok(g.effects.every(e=>identities.has(e)),'effect objects are reused');assert.equal(calls,0,'cosmetics never consume combat RNG');
g.status='paused';const life=g.effects[0].life;step(g,.05);assert.equal(g.effects[0].life,life);g.status='playing';step(g,.05);assert.ok(g.effects[0].life<life);
const dense=game();dense.enemies.length=96;for(let i=0;i<100;i++)effect(dense,'spark',i,0);assert.equal(dense.effects.length,12);
console.log('Effects checks passed: health-only flash, seven class casts, protected-hit handling, hard/adaptive limits, object reuse, pause, and RNG independence.');
