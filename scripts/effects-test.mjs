import assert from 'node:assert/strict';
import {createGame,classes,step,activate,summonPet,spawnEnemy} from '../dist/engine.mjs';
import {effect,updateEffects,EFFECT_LIMIT} from '../dist/effects.mjs?v=ember-16';
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

for(const [stat,kind]of [['shockring','electric'],['thunder','electric'],['fireaura','fire'],['nova','frost'],['roots','roots'],['consecrate','holy']]){const g=game();g.attack=1000;g.nextXP=1e12;g.stats[stat]=1;const e=spawnEnemy(g,'brute',{x:90,y:0});e.hp=e.maxHP=1e6;e.speed=0;const hp=e.hp;step(g,1/60);assert.ok(e.hp<hp,stat+' damages enemies');assert.ok(g.effects.some(e=>e.kind===kind),stat+' emits its own elemental particle field')}const cyclone=game('fighter');activate(cyclone);step(cyclone,1/60);assert.ok(cyclone.effects.some(e=>e.kind==='cyclone'));console.log('Elemental checks passed: Pressure ring, Thunderclap, fire aura, frost nova, roots, consecration, and cyclone have distinct field events.');

// These passive attacks must report actual damage as well as recognizable feedback.
for(const [stat,kind,x] of [['orbits','orbit-hit',80],['cleave','cleaver',70],['quake','quake',100],['fireaura','fire',70]]){
 const g=game();g.attack=1000;g.nextXP=1e12;g.stats[stat]=1;const e=spawnEnemy(g,'walker',{x,y:0});e.hp=e.maxHP=1e6;e.speed=0;
 const hp=e.hp;step(g,1/60);assert.ok(e.hp<hp,stat+' applies damage');assert.ok(g.effects.some(e=>e.kind===kind),stat+' has visible attack feedback');if(stat==='quake')assert.ok(e.stun>0);
}
const meteor=game();meteor.attack=1000;meteor.nextXP=1e12;meteor.stats.fireball=1;const victim=spawnEnemy(meteor,'walker',{x:240,y:0});victim.hp=victim.maxHP=1e6;victim.speed=0;
step(meteor,1/60);assert.equal(meteor.meteors.length,1);assert.equal(meteor.bullets.length,0,'Falling star is not fired from the hero');assert.equal(victim.hp,1e6,'meteor does not damage before landing');
const fall=meteor.meteors[0].life;meteor.status='paused';step(meteor,.05);assert.equal(meteor.meteors[0].life,fall,'meteor descent pauses with combat');meteor.status='playing';
for(let i=0;i<14;i++)step(meteor,.05);assert.equal(meteor.meteors.length,0);assert.ok(victim.hp<1e6,'landing applies area damage');assert.ok(victim.burn>0);assert.ok(meteor.effects.some(e=>e.kind==='meteor-impact'));assert.ok(meteor.audioEvents.includes('blast'));
const miss=game();miss.attack=1000;miss.nextXP=1e12;miss.stats.fireball=1;const runner=spawnEnemy(miss,'walker',{x:240,y:0});runner.hp=runner.maxHP=1e6;runner.speed=0;step(miss,1/60);runner.x=500;for(let i=0;i<14;i++)step(miss,.05);assert.equal(runner.hp,1e6,'meteor strikes its marked area, not a target that has moved away');
console.log('Passive feedback checks passed: four damaging area abilities, meteor descent, paused flight, impact damage/burn/audio, and fixed impact location.');
