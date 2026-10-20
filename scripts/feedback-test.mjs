import assert from 'node:assert/strict';
import {createGame,step,spawnEnemy,summonPet,talents,activate,primaryInterval,totalShield,hurtEnemy,petKinds} from '../dist/engine.mjs';
const game=()=>{const g=createGame(812,'archer');g.status='playing';g.spawn=-1e6;g.nextXP=1e12;g.attack=1000;g.stats.crit=0;return g};
const run=(g,t)=>{for(let i=0;i<Math.round(t*60);i++)step(g,1/60)};
const enemy=(g,x=100)=>{const e=spawnEnemy(g,'walker',{x,y:0});e.hp=e.maxHP=1e6;e.speed=0;return e};
const grant=(g,id)=>talents.find(t=>t.id===id).apply(g);
const shot=(g,damage)=>g.enemyBullets.push({x:0,y:0,vx:0,vy:0,life:1,r:7,kind:'arrow',damage});

const roots=game(),rooted=enemy(roots);grant(roots,'roots');step(roots,1/60);assert.ok(rooted.hp<rooted.maxHP);assert.ok(rooted.rooted>1);assert.equal(rooted.rooted,rooted.stun);assert.ok(roots.effects.some(e=>e.kind==='roots'));const held=rooted.rooted;roots.status='paused';run(roots,1);assert.equal(rooted.rooted,held);roots.status='playing';run(roots,1.5);assert.equal(rooted.rooted,0);
const phantom=game();enemy(phantom,300);grant(phantom,'crossbow');step(phantom,1/60);const arrow=phantom.bullets.find(b=>b.kind==='phantom');assert.ok(arrow);assert.equal(arrow.color,'#bd9dff');

const roaming=game();for(const kind of petKinds)summonPet(roaming,kind);run(roaming,1);const before=roaming.pets.map(p=>({x:p.x,y:p.y}));run(roaming,3);for(const [i,p] of roaming.pets.entries()){assert.ok(Math.hypot(p.x-before[i].x,p.y-before[i].y)>10,p.kind+' roams with an idle player');assert.ok(Math.hypot(p.x-roaming.x,p.y-roaming.y)<100,p.kind+' stays near player while idle')}
const paused=roaming.pets.map(p=>[p.x,p.y]);roaming.status='paused';run(roaming,1);assert.deepEqual(roaming.pets.map(p=>[p.x,p.y]),paused);

const saved=game();saved.health=5;saved.shield=10;saved.lastDamage=0;summonPet(saved,'guardianpet');shot(saved,100);step(saved,1/60);assert.equal(saved.health,5);assert.equal(saved.guardianShield,25);assert.equal(totalShield(saved),35);assert.ok(saved.effects.some(e=>e.kind==='sacrifice'));saved.status='paused';run(saved,1);assert.equal(saved.guardianWard,2);saved.status='playing';run(saved,.7);shot(saved,10);step(saved,1/60);assert.equal(saved.health,5);assert.equal(saved.guardianShield,15);assert.equal(saved.shield,10,'temporary shield absorbs before permanent shield');assert.ok(saved.effects.some(e=>e.kind==='shield-hit'));run(saved,1.4);assert.equal(saved.guardianShield,0);assert.equal(saved.shield,10,'expiration preserves permanent shield');assert.equal(summonPet(saved,'guardianpet'),null);

const eagle=game();grant(eagle,'marksman');assert.equal(eagle.stats.crit,.05);eagle.stats.crit=0;for(const x of [50,250]){const e=enemy(eagle,x);hurtEnemy(eagle,e,100);assert.ok(Math.abs(e.maxHP-e.hp-112)<1e-6,'Eagle eye works at every distance')}
const piercer=game();grant(piercer,'pierce');piercer.attack=0;const solo=enemy(piercer,200);step(piercer,1/60);assert.equal(piercer.bullets[0].left,3);assert.ok(Math.abs(piercer.bullets[0].damage-25.3)<1e-8);run(piercer,.5);assert.ok(solo.hp<solo.maxHP-25,'Soul piercer helps against a single target');
const rapid=game();grant(rapid,'quiver');activate(rapid);assert.equal(rapid.activeTime,4.75);assert.equal(rapid.activeCooldown,16);assert.ok(Math.abs(primaryInterval(rapid)-.068)<1e-8);rapid.status='paused';run(rapid,1);assert.equal(rapid.activeTime,4.75);rapid.status='playing';run(rapid,4.8);assert.equal(primaryInterval(rapid),.68);
console.log('Feedback checks passed: roots, phantom arrows, companion roaming/pause, Lastlight animation and temporary shield, Eagle eye at any range, useful solo piercing, and rapid-fire timing.');

const idleRapid=game();activate(idleRapid);run(idleRapid,1);enemy(idleRapid,240);step(idleRapid,1/60);assert.ok(idleRapid.attack>0,'idle Arrowstorm cannot accumulate a backlog of shots');
