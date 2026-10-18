import assert from 'node:assert/strict';
import {createGame,spawnEnemy,step,primaryRange} from '../dist/engine.mjs';
const game=()=>{const g=createGame(9,'archer');g.status='playing';g.spawn=-1e6;g.nextXP=1e12;g.attack=1000;g.stats.crit=0;return g};
const bullet=(g,x,y,vx=500)=>g.bullets.push({x,y,vx,vy:0,life:1,damage:50,kind:'arrow',left:1,hits:new Set()});
// A segment crossing a cell edge still finds a target in the neighboring bucket.
for(const x of [-605,-510,-414,-318,-222,-126,-30,66,162,258,354,450]){const g=game(),e=spawnEnemy(g,'brute',{x,y:0});e.speed=0;e.armor=0;const hp=e.hp;bullet(g,x-35,0,1000);step(g,.05);assert.equal(e.hp,hp-50,'grid boundary '+x)}
const large=game(),dragon=spawnEnemy(large,'dragon',{x:-315,y:0});dragon.speed=0;dragon.armor=0;const dragonHP=dragon.hp;bullet(large,-362,0,0);step(large,.02);assert.equal(dragon.hp,dragonHP-50,'the largest boss hit radius must be included across a bucket edge');
// Entity/projectile collections retain stable identities instead of allocating replacement arrays.
const stable=game(),enemies=stable.enemies,shots=stable.bullets,hostile=stable.enemyBullets,hazards=stable.hazards;spawnEnemy(stable,'walker',{x:300,y:0});bullet(stable,500,200);stable.bullets[0].life=.01;step(stable,.05);assert.equal(stable.enemies,enemies);assert.equal(stable.bullets,shots);assert.equal(stable.enemyBullets,hostile);assert.equal(stable.hazards,hazards);assert.equal(shots.length,0);
// Enlarging the primary AoE also enlarges automatic acquisition to the shown radius.
const melee=createGame(7,'fighter');melee.status='playing';melee.spawn=-1e6;melee.stats.primarySplash=60;melee.stats.crit=0;const e=spawnEnemy(melee,'brute',{x:150,y:0});e.speed=0;e.armor=0;const hp=e.hp;assert.equal(primaryRange(melee),168);step(melee,.02);assert.ok(e.hp<hp);
// Reusing index buffers cannot leak entities from an earlier tick or a different run.
const old=game(),newer=game();spawnEnemy(old,'walker',{x:100,y:0});step(old,.02);bullet(newer,70,0,1000);step(newer,.05);assert.equal(newer.kills,0);old.enemies.length=0;bullet(old,70,0,1000);step(old,.05);assert.equal(old.kills,0);
console.log('Spatial checks passed: cross-cell swept hits, stable arrays, expired projectile cleanup, melee range acquisition, and isolated/rebuilt indexes.');
