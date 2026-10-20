# Persistent leaderboard deployment

Research checked **20 October 2026**, using provider documentation. Free plans can change; none is a contractual promise of six months of uptime.

## Recommendation: Neon Free Postgres

[Neon's pricing](https://neon.com/pricing) explicitly offers a free plan with **no time limits**, currently **1 GB per project**, **100 CU-hours per project per month**, and **5 GB public network transfer per project**. This fits a small game's player profiles and one best run per player, and uses ordinary Postgres so you can move providers later.

[Idle compute sleeps after five minutes and automatically wakes on the next query](https://neon.com/docs/introduction/scale-to-zero). The storage remains separate from compute. You do not have to recreate the database or redeploy the app to wake it. [Exhausting compute or transfer quotas suspends compute until the next billing period or an upgrade; hitting storage limits blocks storage-increasing operations. These limits do not delete data.](https://neon.com/docs/introduction/plans)

This is suitable for the requested six-month lifetime **within quotas**, with your account/project kept in good standing. It is not unlimited always-on compute. At a constant 0.25 CU, 100 CU-hours would cover about 400 active hours/month; frequent queries can keep it awake. Do not add database-polling health checks or keep-alive cron jobs. The app queries only when loading a profile, opening the leaderboard, or saving a result. Its HTTP health check serves a static file.

| Service | Free storage | Expiration / idle behavior | Assessment |
| --- | --- | --- | --- |
| [Neon](https://neon.com/pricing) | 1 GB per project | No free-plan time limit; compute sleeps and wakes automatically | Best fit: familiar Postgres, portable schema, no manual wake-up |
| [Supabase](https://supabase.com/pricing) | 500 MB database | Pauses after one week of inactivity | Good integrated auth option, but less convenient for a quiet game |
| [MongoDB Atlas](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) | 512 MB | Free forever, but [pauses after 30 idle days and requires resuming](https://www.mongodb.com/docs/atlas/pause-terminate-cluster/) | Viable, with more idle maintenance and no benefit for this data model |
| [Cloudflare D1](https://developers.cloudflare.com/d1/platform/limits/) | 500 MB per free DB; 5 GB/account | [Recurring free daily quotas: 5M rows read, 100k rows written](https://developers.cloudflare.com/d1/platform/pricing/) | Strong SQLite alternative if moving the backend to Workers; less portable with the current server |
| [Render Postgres Free](https://render.com/docs/free) | 1 GB | Expires after 30 days; deleted after a further 14-day upgrade grace period | Does not meet the six-month requirement |

Supabase's [current pausing guide](https://supabase.com/docs/guides/platform/free-project-pausing) describes a one-year Studio restoration window for paused projects. Old 90-day guidance still appears in older pages. Paused service is different from an automatically available leaderboard. Atlas also cautions that very old paused versions may not resume, so export data before long inactivity.

## What is implemented

- A random UUID per player; a separate 256-bit private browser credential authenticates updates. Only its SHA-256 hash is stored in Postgres. Public IDs cannot authorize changes.
- Editable nickname and one best run per player: survival milliseconds, kills **on that run**, chosen class, and achievement time.
- Top 50 ordered by survival descending, kills descending, first achievement, then player ID. Lower scores and duplicate retries cannot overwrite a best; an atomic SQL comparison also protects concurrent submissions.
- Saves on death and explicit **End run & change class**. An abandoned tab is not submitted. The existing local personal-best counter remains available.
- Local pending-best queue retries on profile restore, leaderboard refresh, and restored connectivity. A timeout after a successful write is safe to retry.
- No email/password account recovery. Clearing browser storage loses control of that identity; the public score remains. Guest runs can be published after choosing a nickname. The old local time-only record cannot be imported because it lacks kills and class.
- Server validation, parameterized queries, bounded request bodies, request throttling, escaped display names, no public database credentials. The token must remain private; use HTTPS in deployment.

**Fairness limitation:** the game runs in the browser, and scores are client-reported. Validation and authentication protect account ownership and record consistency, but do not prove that a run happened. A determined player can forge a score. Use server-authoritative simulation or verified deterministic input replays before offering prizes or treating this as a competitive ranking.

## Local setup

1. Install Node.js 22+ and run `npm ci` (`npm.cmd ci` if PowerShell blocks npm.ps1).
2. Create a Neon **Free** project in a region close to your app server. Use its main production branch, and copy the **pooled** Postgres connection string, retaining the supplied TLS options.
3. Copy `.env.example` to `.env` and fill `DATABASE_URL`. This file is ignored by Git. Never put the URL into `dist/` or browser scripts.
4. Create the schema, then start the game:

   ```sh
   node --env-file=.env server/migrate.mjs
   node --env-file=.env scripts/serve.mjs
   ```

5. Open http://127.0.0.1:8080, select the trophy button, and save a nickname. Complete a run, then check the leaderboard in another browser.

Without `DATABASE_URL`, `npm start` still supports local gameplay and queues run results, while online endpoints clearly return HTTP 503. There is no volatile in-memory database silently standing in for persistence.

## Deploy app on Render, database on Neon

The supplied `render.yaml` is a **Node web service**, not a Render database. Import this repository as a Render Blueprint (or configure the same values manually):

- Runtime: Node, free web instance, Node 22.
- Build: `npm ci --omit=dev && npm run db:migrate`.
- Start: `npm start`.
- Environment: `HOST=0.0.0.0` and secret `DATABASE_URL` set to your Neon pooled URL. Render supplies `PORT`.
- Health check: `/`.

Both assets and API are served on the same origin; no CORS configuration or frontend secret is needed. The schema migration only creates missing tables/indexes and can be rerun. **Keep the same Neon project, branch and connection string across app redeploys.** Never recreate/reset that database during app deployments.

[Render's free web service can spin down after 15 minutes of inactivity and has monthly limits](https://render.com/docs/free), so expect a cold start. That does not remove records in the separate Neon database. Render may restrict unusually high service-initiated outbound traffic to external databases; monitor the app and provider limits if the game grows.

Static-only hosting of `dist/` and the legacy Go server do **not** supply these API routes. Deploy the Node server for the online leaderboard. The Go/WebAssembly prototype and gameplay engine do not need a rebuild.

## Backups and portability

Free compute retention is not a backup. Neon Free has only a short restore history (currently up to six hours or 1 GB of changes). Use a separate backup routine for data you want to keep for months.

Install the matching PostgreSQL client tools. Set `DATABASE_URL` securely in your shell (prefer a direct connection for backup tools). A weekly backup in PowerShell can be made with:

```powershell
New-Item -ItemType Directory -Force backups
pg_dump --dbname=$env:DATABASE_URL --format=custom --no-owner --no-acl --file="backups/emberfall-$(Get-Date -Format yyyy-MM-dd).dump"
```

Keep dated copies off the app host, restrict access (they include credential hashes), and periodically restore into a **new empty database** to verify them:

```powershell
pg_restore --dbname=$env:RESTORE_DATABASE_URL --no-owner --no-acl backups/emberfall-YYYY-MM-DD.dump
```

This repository does not provision a live cloud project or a scheduled backup account. Monitor quota usage, export regularly, and retain the same persistent database through app deployments.

## Verification

`npm run test:leaderboard` tests the real HTTP handlers against PGlite's embedded PostgreSQL engine, including disk persistence through an engine/server restart, migration repeatability, identity isolation, concurrent submissions, top-50 ranking, tie-breaking, validation, and client offline retry. It does not test a live Neon connection or its TLS/network behavior. `node scripts/ui-smoke.mjs` checks the game controller. The API contract is in `openapi.json`.

An optional Postman smoke check against a running configured server is:

```sh
postman request GET http://127.0.0.1:8080/api/leaderboard --script-post-request @scripts/leaderboard-check.cjs
```

During implementation, both Postman assertions passed against the local PGlite-backed HTTP server. Browser QA verified creating a profile, displaying records, and publishing an explicitly ended run with its matching class and kills. No cloud deployment was made.
