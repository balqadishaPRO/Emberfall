import {connectDatabase, migrate} from './database.mjs';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running migrations.');
const db = connectDatabase(process.env.DATABASE_URL);
try { await migrate(db); console.log('Leaderboard schema ready.'); }
finally { await db.end(); }
