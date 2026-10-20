import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PlayerRecords,escapeHTML} from '../dist/records.mjs';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)}};
const response=data=>({ok:true,json:async()=>data});
test('offline best run survives reload, publishes once, and keeps its class and kills',async()=>{
  const disk=storage(),calls=[];let offline=true;
  const request=async(path,options)=>{
    if(offline)throw new Error('offline');
    calls.push({path,options});
    if(path==='/api/player')return response({id:'test-id',nickname:'Hero'});
    return response({player:{id:'test-id',nickname:'Hero',...JSON.parse(options.body)}});
  };
  let records=new PlayerRecords({storage:disk,request});
  records.complete({time:120,kills:12,classId:'mage'});
  records.complete({time:100,kills:999,classId:'tank'});
  records=new PlayerRecords({storage:disk,request});
  assert.equal(records.pending.classId,'mage');
  await assert.rejects(records.saveNickname('Hero'));
  const token=records.identity.token;assert.equal(token.length,64);
  offline=false;await records.saveNickname('Hero');
  assert.equal(records.identity.token,token);assert.equal(records.pending,null);
  assert.equal(records.player.kills,12);assert.equal(records.player.classId,'mage');
  assert.equal(calls.filter(c=>c.path==='/api/records').length,1);
  assert.equal(new PlayerRecords({storage:disk,request}).pending,null);
});
test('failed submission retries with the same identity and no concurrent duplicate requests',async()=>{
  const disk=storage();let fail=false,posts=0,release;
  const records=new PlayerRecords({storage:disk,request:async(path,options)=>{
    if(path==='/api/player')return response({id:'id',nickname:'Hero'});
    posts++;if(fail)throw new Error('offline');
    await new Promise(resolve=>release=resolve);
    return response({player:{id:'id',nickname:'Hero',...JSON.parse(options.body)}});
  }});
  await records.saveNickname('Hero');fail=true;
  records.complete({time:10,kills:1,classId:'archer'});await records.flush();
  assert.ok(records.pending);assert.match(records.message,/Upload pending/);
  fail=false;const a=records.flush(),b=records.flush();assert.equal(a,b);
  release();await a;assert.equal(posts,2);assert.equal(records.pending,null);
});
test('public nicknames are escaped before HTML rendering',()=>{
  assert.equal(escapeHTML('<img src="x">'), '&lt;img src=&quot;x&quot;&gt;');
});
test('blocked browser storage keeps local gameplay usable and explains the limitation',async()=>{
  const records=new PlayerRecords({storage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}}});
  records.complete({time:3,kills:1,classId:'fighter'});
  assert.equal(records.pending.survivedMs,3000);
  assert.match(records.message,/storage is blocked/);
  await assert.rejects(records.saveNickname('Hero'),/Allow browser storage/);
});
