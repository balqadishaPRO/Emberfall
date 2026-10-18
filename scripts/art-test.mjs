import assert from 'node:assert/strict';
import {paintHero} from '../dist/heroes.mjs';
import {classes} from '../dist/engine.mjs';
const signatures=new Set();
for(const cl of classes){const poses=[];for(const frame of [0,1,2,3,...(cl.id==='shapeshifter'?[4,5]:[])]){const calls=[],c=new Proxy({},{get:(_,key)=>(...args)=>{assert.ok(args.filter(x=>typeof x==='number').every(Number.isFinite));calls.push([key,...args])},set:(_,key,value)=>{calls.push([key,value]);return true}});paintHero(c,cl.id,'#aaaaaa',frame);assert.ok(calls.length>250,'class models contain layered details');poses.push(JSON.stringify(calls))}signatures.add(poses[0]);assert.notEqual(poses[0],poses[1],cl.id+' walking pose');assert.notEqual(poses[0],poses[3],cl.id+' attack pose')}
assert.equal(signatures.size,7,'all seven models differ even with identical palette colors');
console.log('Class artwork checks passed: seven distinct detailed silhouettes, finite drawing coordinates, movement, and attack poses.');

const {paintEnemyDetails}=await import('../dist/monster-details.mjs');const {monsters}=await import('../dist/engine.mjs');const enemySignatures=new Set();for(const kind of Object.keys(monsters)){const calls=[],c=new Proxy({},{get:(_,key)=>(...args)=>{assert.ok(args.filter(x=>typeof x==='number').every(Number.isFinite));calls.push([key,...args])},set:(_,key,value)=>{calls.push([key,value]);return true}});paintEnemyDetails(c,kind,'#aaa',0);assert.ok(calls.length>50,kind+' has detailed role-specific equipment/materials');enemySignatures.add(JSON.stringify(calls))}assert.equal(enemySignatures.size,14);console.log('Enemy art checks passed: fourteen distinct detailed models with finite coordinates.');
