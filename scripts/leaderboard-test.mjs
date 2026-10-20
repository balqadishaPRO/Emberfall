import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {PGlite} from '@electric-sql/pglite';
import {createApi} from '../server/api.mjs';
import {migrate} from '../server/database.mjs';

test('HTTP API uses persistent Postgres semantics for identity, best-run integrity and ordering',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'emberfall-db-'));
  let db=new PGlite(dir), server;
  const start=async()=>{
    const api=createApi(db);server=http.createServer(async(req,res)=>{if(!await api(req,res)){res.writeHead(404);res.end()}});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    return 'http://127.0.0.1:'+server.address().port;
  };
  const stop=async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve))};
  try{
    await migrate({query:sql=>db.exec(sql)});await migrate({query:sql=>db.exec(sql)});
    let base=await start();
    const a='a'.repeat(64),b='b'.repeat(64),unknown='c'.repeat(64);
    const call=async(path,method='GET',token,data)=>{
      const r=await fetch(base+'/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});
      return {status:r.status,data:await r.json()};
    };
    assert.equal((await call('leaderboard')).data.entries.length,0);
    assert.equal((await call('player','PUT',null,{nickname:'Hero'})).status,401);
    assert.equal((await call('player','PUT',a,{nickname:'<script>'})).status,400);
    const player=(await call('player','PUT',a,{nickname:'Hero'})).data;
    assert.match(player.id,/^[a-f0-9-]{36}$/);assert.equal(player.token_hash,undefined);
    assert.equal((await call('player','PUT',a,{nickname:'Renamed'})).data.id,player.id);
    assert.equal((await call('records','POST',unknown,{survivedMs:1,kills:1,classId:'mage'})).status,401);
    for(const invalid of [{survivedMs:-1,kills:1,classId:'mage'},{survivedMs:1.5,kills:1,classId:'mage'},{survivedMs:100,kills:-1,classId:'mage'},{survivedMs:100,kills:1,classId:'admin'}])assert.equal((await call('records','POST',a,invalid)).status,400);
    const best={survivedMs:90000,kills:10,classId:'mage'};
    assert.equal((await call('records','POST',a,best)).data.improved,true);
    assert.equal((await call('records','POST',a,best)).data.improved,false);
    const worse=await call('records','POST',a,{survivedMs:80000,kills:900,classId:'tank'});
    assert.equal(worse.data.player.kills,10);assert.equal(worse.data.player.classId,'mage');
    await Promise.all([call('records','POST',a,{survivedMs:110000,kills:2,classId:'fighter'}),call('records','POST',a,{survivedMs:100000,kills:999,classId:'healer'})]);
    const concurrent=(await call('player','GET',a)).data;
    assert.equal(concurrent.survivedMs,110000);assert.equal(concurrent.kills,2);assert.equal(concurrent.classId,'fighter');
    await call('player','PUT',b,{nickname:'Runner'});
    await call('records','POST',b,{survivedMs:110000,kills:3,classId:'assassin'});
    const leaderboard=(await call('leaderboard')).data.entries;
    assert.deepEqual(leaderboard.map(p=>p.nickname),['Runner','Renamed']);
    assert.deepEqual(leaderboard.map(p=>p.rank),[1,2]);
    assert.equal(JSON.stringify(leaderboard).includes(a),false);
    const stored=(await db.query('SELECT token_hash FROM players WHERE id=$1',[player.id])).rows[0];
    assert.notEqual(stored.token_hash,a);
    // Restart the app AND the PostgreSQL engine, keeping its disk directory.
    await stop();await db.close();db=new PGlite(dir);await migrate({query:sql=>db.exec(sql)});base=await start();
    assert.equal((await call('player','GET',a)).data.survivedMs,110000);
    assert.equal((await call('leaderboard')).data.entries[0].classId,'assassin');
    const publicIdAuth=await call('player','GET',player.id);assert.equal(publicIdAuth.status,401);
    assert.equal((await call('player','PUT',a,{nickname:'O\'Brien'})).data.nickname,"O'Brien");
    await db.query(`INSERT INTO players(id,token_hash,nickname)
      SELECT gen_random_uuid(), 'fixture-' || n, 'Survivor ' || n FROM generate_series(1,55) n`);
    await db.query(`INSERT INTO records(player_id,survived_ms,kills,class_id)
      SELECT id,120000,1,'tank' FROM players WHERE token_hash LIKE 'fixture-%'`);
    const top=(await call('leaderboard')).data.entries;
    assert.equal(top.length,50);assert.equal(top[49].rank,50);
    assert.equal(top.every(p=>p.survivedMs===120000),true);
  }finally{if(server?.listening)await stop();await db.close();await rm(dir,{recursive:true,force:true})}
});

test('unconfigured database returns an explicit offline response',async()=>{
  const api=createApi(null);let status,body;
  await api({url:'/api/leaderboard',method:'GET',socket:{remoteAddress:'test'}},{writeHead(s){status=s},end(b){body=JSON.parse(b)}});
  assert.equal(status,503);assert.match(body.error,/not configured/);
});
