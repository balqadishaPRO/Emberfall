# Emberfall — The Endless Wilds

An endless, single-player 2D browser survival game. Move the Emberkeeper through an infinite forest while automatic attacks fight an escalating horde. Every kill grants experience immediately; each level-up freezes the game and offers three distinct passive abilities. Pick one and keep surviving.

## Run locally

Node.js 18+; no installation or build step:

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8080. To use another port in PowerShell:

```powershell
$env:PORT = '8081'
node scripts/serve.mjs
```

Upload `dist/` to any static host supporting JavaScript modules to deploy. A Go static server is also included: `go run ./cmd/server`. Rebuild/restart any already-running Go server after updating source so `.mjs` files receive the correct JavaScript content type.

## Controls

- WASD / arrow keys: move. Attacks automatically target nearby enemies.
- Touch: drag the arena to use the movement stick.
- Esc / P or the pause button: pause/resume.
- Click/tap a passive or press 1, 2, 3: choose a level-up ability.
- Optional synthesized sound can be toggled in the header.

Kills grant immediate XP. XP thresholds rise each level. Passive upgrades stack; multi-projectile, piercing, orbiting-blade, and nova upgrades have rank caps. Spawn rates and enemy health grow with elapsed game time. Bats unlock after 25 seconds, brutes after 55 seconds, wraiths after 105 seconds; an elite spawns every minute. There is no final wave or victory condition. Health reaching zero ends the run; restart starts a fresh build. Longest survival is stored on this device when browser storage is available. Changing tabs automatically pauses.

Scenery is decorative and does not block movement. Simultaneous common enemies are limited to 450 for browser performance; ongoing spawn pressure and scaling continue. The game uses a fixed 60 Hz simulation, spatial buckets for projectile collision, cached pixel sprites, and a Canvas renderer. Fonts have system fallbacks; no external asset is required to play.

## Verification

```sh
node --check dist/survival.mjs
node scripts/survival-test.mjs
node scripts/ui-smoke.mjs
```

The simulation checks cover automatic combat, immediate XP, three unique upgrade choices, passive application, time freezing during upgrades, capped upgrades, increasing spawn density, death, and a ten-minute run.

## Source

- `dist/engine.mjs`: standalone deterministic game simulation and passive definitions.
- `dist/survival.mjs`: renderer, controls, UI, audio, and local records.
- `dist/survival.css`: responsive game interface.
- `scripts/serve.mjs`: dependency-free local server.

The earlier Go micro-RTS prototype is retained at `/micro-command.html` with its original Go source and WebAssembly assets. It is separate from the current survival game. The survival game needs no Go toolchain.
