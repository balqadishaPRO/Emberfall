import assert from 'node:assert/strict';
import {createGame,chooseUpgrade,rollChoices,step,spawnEnemy,hurtEnemy,activate,talents,MAP} from '../dist/engine.mjs';
const game=(id='archer')=>{const g=createGame(345,id);g.status='playing';g.spawn=-1e4;return g};
const grant=(g,id)=>{g.status='levelup';g.choices=[id];assert.ok(chooseUpgrade(g,id));g.levelGuard=0};
const run=(g,seconds)=>{for(let i=0;i<Math.ceil(seconds*60);i++)step(g,1/60)};
const foe=(g,x=100,y=0)=>{const e=spawnEnemy(g,'brute',{x,y});e.hp=e.maxHP=100000;e.speed=0;e.armor=0;e.damage=0;return e};
assert.equal((MAP.right-MAP.left)*(MAP.bottom-MAP.top),1372000);
for(const id of ['archer','fighter','assassin','mage']){const g=game(id);for(let level=2;level<80;level++){g.level=level;const choices=rollChoices(g);assert.equal(new Set(choices).size,3);assert.ok(choices.some(key=>talents.find(t=>t.id===key).classes?.includes(id)));assert.ok(choices.every(key=>!talents.find(t=>t.id===key).classes||talents.find(t=>t.id===key).classes.includes(id)));if(level===2)assert.ok(choices.some(key=>['wolf','stormpet','frostpet','firepet'].includes(key)))}
 const exhausted=game(id);exhausted.level=2;exhausted.build=Object.fromEntries(talents.filter(t=>t.max).map(t=>[t.id,t.max]));assert.equal(rollChoices(exhausted).length,3);
}
// Shots and ground hazards cannot injure the hero during post-choice protection.
const safe=game();safe.status='levelup';safe.choices=['might'];chooseUpgrade(safe,'might');const hp=safe.health;
const shot=g=>g.enemyBullets.push({x:g.x,y:g.y,vx:0,vy:0,life:1,damage:20,kind:'arrow',r:7});
shot(safe);safe.hazards.push({x:0,y:0,r:70,damage:20,delay:0,life:5});run(safe,1);assert.equal(safe.health,hp);safe.status='paused';const guard=safe.levelGuard;run(safe,2);assert.equal(safe.levelGuard,guard);safe.status='playing';run(safe,1.1);assert.ok(safe.health<hp);
const archer=game();grant(archer,'marksman');const near=foe(archer,100),far=foe(archer,250);archer.stats.crit=0;hurtEnemy(archer,near,100);hurtEnemy(archer,far,100);assert.equal(near.maxHP-near.hp,100);assert.equal(Math.round(far.maxHP-far.hp),115);grant(archer,'barrage');archer.attack=100;step(archer,1/60);assert.equal(archer.bullets.length,5);grant(archer,'quiver');activate(archer);assert.equal(archer.activeCooldown,5);
const fighter=game('fighter');grant(fighter,'tempest');activate(fighter);assert.equal(fighter.activeTime,2.4);const f=foe(fighter,165);fighter.activeTime=0;fighter.attack=100;grant(fighter,'warcry');step(fighter,1/60);assert.ok(f.stun>0);assert.ok(f.hp<f.maxHP);
const defense=game('fighter');grant(defense,'ironwill');for(const x of [-120,100,130])foe(defense,x);shot(defense);step(defense,1/60);assert.ok(Math.abs((130-defense.health)-20*.8*.92)<1e-8);
const assassin=game('assassin');grant(assassin,'toxicblade');const victim=foe(assassin);hurtEnemy(assassin,victim,1);assert.equal(victim.poisonPower,8);grant(assassin,'shadowecho');assassin.attack=100;const before=victim.hp;step(assassin,1/60);assert.ok(victim.hp<before-20);grant(assassin,'pursuit');activate(assassin,{x:-1,y:0});const victim2=foe(assassin,300);hurtEnemy(assassin,victim2,1e6);assert.equal(assassin.activeCooldown,7.75);
const mage=game('mage');grant(mage,'shatter');mage.stats.crit=0;const frozen=foe(mage,250);frozen.freeze=2;hurtEnemy(mage,frozen,100);assert.equal(frozen.maxHP-frozen.hp,125);grant(mage,'comet');mage.attack=100;step(mage,1/60);assert.ok(mage.bullets.some(b=>b.splash===110));grant(mage,'arcanecycle');activate(mage);assert.equal(mage.activeCooldown,13.6);
// Audio cues are bounded even without a controller draining them.
for(let i=0;i<100;i++){const e=foe(mage,300);hurtEnemy(mage,e,1e6)}assert.ok(mage.audioEvents.length<=24);
console.log('Expansion checks passed: all 12 class upgrades, eligible guaranteed choices, exhausted pools, smaller map, protection expiration/pause, damage and cooldown effects, and bounded audio cues.');
