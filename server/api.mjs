import {createHash, randomUUID} from 'node:crypto';
import {classes} from '../dist/engine.mjs';

const classIds = new Set(classes.map(c => c.id));
const publicColumns = 'p.id, p.nickname, r.survived_ms AS "survivedMs", r.kills, r.class_id AS "classId"';
const playerQuery = `SELECT ${publicColumns} FROM players p LEFT JOIN records r ON r.player_id=p.id WHERE p.token_hash=$1`;
const order = 'r.survived_ms DESC, r.kills DESC, r.achieved_at, r.player_id';
function fail(status, message) { throw Object.assign(new Error(message), {status}); }
function credential(req) {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization || '');
  if (!match) fail(401, 'A private player credential is required.');
  return createHash('sha256').update(match[1]).digest('hex');
}
async function body(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) fail(415, 'Send application/json.');
  let bytes = 0, chunks = [];
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 2048) fail(413, 'Request is too large.');
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'Send a JSON object.');
    return value;
  } catch { fail(400, 'Send a valid JSON object.'); }
}
export function createApi(db, {now=Date.now}={}) {
  // Bound memory and request volume. Proxy headers are deliberately not trusted.
  const clients = new Map();
  return async function api(req, res) {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (!path.startsWith('/api/')) return false;
    const send = (status, value) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}); res.end(JSON.stringify(value)); };
    try {
      const time = now(), ip = req.socket.remoteAddress || 'unknown';
      let bucket = clients.get(ip);
      if (!bucket || time-bucket.since >= 60000) {
        for (const [key, value] of clients) if (time-value.since >= 60000) clients.delete(key);
        if (clients.size >= 10000 && !clients.has(ip)) fail(429, 'Too many requests. Try again shortly.');
        clients.set(ip, bucket={since:time, count:0});
      }
      if (++bucket.count > 120) { res.setHeader('Retry-After','60'); fail(429, 'Too many requests. Try again shortly.'); }
      if (!db) fail(503, 'Online records are not configured. You can still play locally.');
      if (req.method === 'GET' && path === '/api/leaderboard') {
        const result = await db.query(`SELECT ${publicColumns} FROM records r JOIN players p ON p.id=r.player_id ORDER BY ${order} LIMIT 50`);
        send(200, {entries:result.rows.map((row,i)=>({...row, rank:i+1}))});
      } else if (req.method === 'GET' && path === '/api/player') {
        const result = await db.query(playerQuery, [credential(req)]);
        if (!result.rows.length) fail(404, 'Player not found. Save your nickname to create a profile.');
        send(200, result.rows[0]);
      } else if (req.method === 'PUT' && path === '/api/player') {
        const hash = credential(req), data = await body(req);
        const nickname = typeof data.nickname === 'string' ? data.nickname.trim().normalize('NFC') : '';
        if ([...nickname].length < 2 || [...nickname].length > 24 || !/^[\p{L}\p{N} _.'-]+$/u.test(nickname)) fail(400, 'Use 2–24 letters, numbers, spaces, or _ . apostrophe - for your nickname.');
        // Retrying registration with the same credential keeps the same random ID.
        await db.query(`INSERT INTO players(id,token_hash,nickname) VALUES($1,$2,$3)
          ON CONFLICT(token_hash) DO UPDATE SET nickname=excluded.nickname`, [randomUUID(),hash,nickname]);
        send(200, (await db.query(playerQuery, [hash])).rows[0]);
      } else if (req.method === 'POST' && path === '/api/records') {
        const hash=credential(req), data=await body(req);
        if (!Number.isInteger(data.survivedMs) || data.survivedMs<1 || data.survivedMs>86400000 ||
            !Number.isInteger(data.kills) || data.kills<0 || data.kills>10000000 || !classIds.has(data.classId)) fail(400, 'Invalid survival time, kill count, or class.');
        const player=(await db.query(playerQuery,[hash])).rows[0];
        if (!player) fail(401, 'Save a player profile before submitting a run.');
        // One atomic comparison: a worse/concurrent/retried run cannot replace a best.
        const result=await db.query(`INSERT INTO records(player_id,survived_ms,kills,class_id) VALUES($1,$2,$3,$4)
          ON CONFLICT(player_id) DO UPDATE SET survived_ms=excluded.survived_ms,kills=excluded.kills,class_id=excluded.class_id,achieved_at=now()
          WHERE (excluded.survived_ms,excluded.kills) > (records.survived_ms,records.kills) RETURNING player_id`,
          [player.id,data.survivedMs,data.kills,data.classId]);
        send(200, {improved:result.rows.length>0, player:(await db.query(playerQuery,[hash])).rows[0]});
      } else fail(404, 'API endpoint not found.');
    } catch (error) {
      if (!error.status) console.error('Leaderboard database operation failed.');
      send(error.status || 503, {error:error.status ? error.message : 'Online records are temporarily unavailable. Your run can be retried.'});
    }
    return true;
  };
}
