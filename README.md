# Emberfall — The Hollow Wood

A lightweight, fullscreen, solo 2D survival game for the browser. Seven classes fight an escalating horde inside a bounded 1400 × 980 arena. Kills grant XP immediately; every level pauses combat and offers three eligible passive upgrades. Choosing grants two seconds of protection.

## Run

Node.js 18+, no dependencies or build step:

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8080. For a different port in PowerShell:

```powershell
$env:PORT = '8084'
node scripts/serve.mjs
```

Deploy `dist/` on a static host that serves `.mjs` as JavaScript. The optional Go server also works with `go run ./cmd/server`. The earlier Go micro-RTS prototype is preserved at `/micro-command.html`, along with its Go/WebAssembly source and assets.

## Controls and compact interface

- WASD / arrows: move. Drag the arena on touch screens.
- Attacks are automatic. Space or the colored active button uses your class ultimate.
- P / Escape: pause. B: inspect your build. F: fullscreen. M: mute.
- 1–3 / click / tap: choose a level-up card. 1–7 select a class in the menu.
- Leaving the tab pauses the run. Opening the guide, audio settings, or build also pauses.

The compact top-right panel holds health, XP, level, time, kills, a small elite countdown, and the active button. A ready ultimate has a saturated class color, bright border, and larger icon; it does not pulse or animate. Hover over the clock for wave and difficulty budget. Boss/miniboss names and health bars appear above their heads. There is no bottom dock, top-center counter strip, minimap, particle system, floating damage text, screen shake, walking cycle, or attack animation.

The renderer uses cached, static pixel sprites and a cached terrain image. Movement, projectiles, charge paths, and warning areas remain part of combat. There are no cosmetic animation allocations. Rendering is capped at 30 FPS while deterministic simulation runs at 60 Hz; paused/menu scenes redraw only on status or size changes. Canvas pixel density is capped at 1.5. CSS transitions and animations are disabled.

## Seven classes

| Class | Starting features | Space active |
|---|---|---|
| Archer | 100 HP, 340 range, one extra piercing target | Scattershot: 9 arrows, 150% weapon damage each, shotgun fan, fixed 360-unit travel limit and fixed 5s cooldown |
| Fighter | 130 HP, 20% damage reduction, broad melee attacks | Iron cyclone: repeated area strikes for 2s, 40% additional damage reduction; 14s cooldown |
| Assassin | 95 HP, 255 speed, 0.30s attack interval, 100 melee range, 25% dodge, 40% crit, 230% crit multiplier | Shadowstep: dash through enemies for 550% weapon damage, 0.8s invulnerability; 8s cooldown |
| Mage | 90 HP, explosive primary bolts, burning, +20% elemental damage | Glacial nova: 230% elemental damage, freezing, projectile removal; 16s cooldown |
| Tank | 200 HP, 40% damage reduction, 30-point rechargeable shield, area shield bashes | Bastion: 240% damage in a 185-unit area, shield refill, 60% extra damage reduction for 4s; 16s cooldown |
| Healer | 110 HP, radiant splash bolts, steady 0.25 HP/s self-recovery | Sanctuary: restore 12 HP, 210% damage in a 200-unit area, slow foes, remove nearby shots; 18s cooldown |
| Shapeshifter | 70 HP and weak claws; permanently inherits every elite kill | Primal surge: 200% damage and a brief stun in a 175-unit area; 12s cooldown |

Cooldowns pause during decisions and reset for a new run. Directional actives prioritize current movement, then a nearby target. Ultimate data is separate from the passive pool. Class-only upgrades never appear for another class. Archer's Endless quiver now upgrades Scattershot damage, keeping its 5s cooldown and 360 range fixed.

## Shapeshifter inheritance

Each miniboss or boss kill grants an automatic permanent aspect, including kills made by pets or status damage. Repeated kills add another rank. Every elite absorption also multiplies weapon damage by 1.15 and flat ability power by 1.1. The most recent aspect changes the static hero palette; the build panel lists inherited ranks.

| Elite | Inherited passive |
|---|---|
| Thorn Ravager | +8% movement speed, +5% crit, periodic close-area predatory strike |
| Broodmother | Poisonous direct hits, periodic venom pulse |
| Mire Hexer | Periodic area curse that damages and slows clustered enemies |
| Stone Warden | 15% less incoming damage, +20 maximum HP, stunning ground slams |
| Frost Revenant | Chilling direct hits and freezing novas |
| Ashen Dragon | Burning direct hits, flame aura, extra explosive fireballs |

## Seven unique companions

Each kind can exist at most once. Selecting the same combat pet again upgrades that same object; it never creates a duplicate. Combat pets keep independent targets, preferring alternatives to the hero's target, and cannot take ordinary enemy damage.

| Companion | Function and ranks |
|---|---|
| Moonfang | Wolf bites for 120% weapon damage; up to 5 ranks |
| Storm sprite | Lightning chains through 3 targets for 100% weapon damage; up to 5 ranks |
| Frost owl | Freezing shards for 100% weapon damage; up to 5 ranks |
| Cinder drake | Explosive fireballs for 120% weapon damage plus burning; up to 5 ranks |
| Dew sprite | Exactly 0.1 HP/s, no attacks, one rank. Pet damage/haste bonuses cannot amplify healing |
| Hourglass moth | Slow hostile projectiles by 35% within 145 units of the hero. Up to 3 ranks: +25 radius and +10% slowing each, capped at 55% |
| Lastlight | No attacks. Absorbs one otherwise fatal hit and is sacrificed. One second of safety prevents immediate follow-up death. Cannot be summoned again that run |

Combat pets use at least 18 base weapon damage, improving usefulness for a weak starting Shapeshifter. Additional ranks add 45% of base damage, 6% faster attacks multiplicatively, and 12 movement speed. Global companion damage and haste upgrades remain available. A combat companion is guaranteed at the first level-up. Lastlight is not spent on ordinary nonfatal hits; its sacrifice preserves the hero's health against the blocked hit.

## Passive builds, AoE, and healing

There are 68 passives across Combat, Fire, Frost, Lightning, Vitality, Nature, Arcane, and Companion categories. All seven classes have exclusive passives. Each level-up offers an eligible class option while one remains, with distinct choices and capped upgrades removed at maximum rank.

New common AoE choices include Wide impact (larger melee areas or projectile splash) and Pressure ring. Tank has Seismic shield area strikes. Healer has Consecration and larger Dawnfire explosions. Shapeshifter has wider claws, adaptation, and companion synergy, in addition to elite aspects. Existing melee cleaves, orbit blades, slams, frost novas, lightning chains, fire aura, and death bursts remain functional with static visual indicators.

Second wind grants 0.2 HP/s per rank, capped at 1 HP/s, after six seconds without damage. Kill-healing is limited to a 0.8 HP/s token budget. Shields recharge at 2 points/s after eight seconds without damage. Healer's innate recovery is separate at 0.25 HP/s; Dew sprite remains fixed at 0.1 HP/s. Healing never exceeds maximum HP.

## Encounters and spawn budget

Waves last 30 seconds. Minibosses rotate every 45 seconds: Ravager, Broodmother, Hexer. Main bosses rotate every 120 seconds: Warden, Frost Revenant, Dragon. Elite arrivals may wait for room in the enemy budget. Health, damage, and spawn pressure grow over time.

Live enemy difficulty must fit `floor(18 + elapsedSeconds × 0.45)`. Costs: Hollow 1, Nightwing 1.5, Bone archer 3, Ironhide/Ram 4, Spitter/Wraith 5, Grave caller 7; minibosses 18/20/22; bosses 42/46/54. Summons, regular spawns, and elites use the same admission check. Death immediately frees points. A separate 96-enemy ceiling bounds late-game work.

The director reserves room before elites and prioritizes due bosses. It retains at most one pending boss and one pending miniboss. Blocked spawn credit is capped at 1.5, preventing catch-up floods. Heavier types gain more selection weight later. `spawnEnemy` is a low-level fixture constructor; production spawn paths use `trySpawnEnemy`.

Fourteen enemy types have distinct XP rewards and attacks, shown in the field guide. Hostile arrows are pink, ice cyan, fire orange, and poison green. Outlined static warning zones, melee markers, and charge/aim lines show danger. Bosses resist crowd-control duration and knockback.

## Audio

Original procedural ambient music and synthesized bow, melee, spell, hit, kill, active, level, death, and boss cues. Music begins after interaction. Audio settings have separate saved music/effect volumes and master mute. Hidden tabs suspend audio; a player action resumes it. Voice and cue rate limits bound audio work. There are no third-party audio downloads.

## Verification

```sh
node --check dist/engine.mjs
node --check dist/render.mjs
node --check dist/survival.mjs
node --check dist/audio.mjs
node scripts/survival-test.mjs
node scripts/combat-test.mjs
node scripts/expansion-test.mjs
node scripts/director-test.mjs
node scripts/audio-test.mjs
node scripts/ui-smoke.mjs
node scripts/indie-test.mjs
node scripts/renderer-test.mjs
```

Checks cover all seven class attacks, unique ranked pets, buffed pet damage, fixed healer rates, non-compounding projectile slowdown, guardian sacrifice and permanent loss, shotgun travel/cooldown limits, Assassin stats and dash damage, Tank defenses/AoE, Healer splash/sustain, all six inherited aspects and repeated ranks, eligible choices, deterministic ten-minute runs, the enemy budget on every crowded-test step, audio routing/limits, compact UI behavior, static rendering despite clock changes, cached sprites, and overhead boss health. Browser QA checks actual desktop and phone layouts and runtime errors. Automated audio tests inspect signal graphs rather than perceived sound quality.

## Source

- `dist/engine.mjs`: deterministic combat, classes, passives, pets, elite aspects, and encounter director.
- `dist/render.mjs`: cached static pixel art, terrain, warning geometry, projectiles, and overhead health.
- `dist/survival.mjs`: menu, compact HUD, decisions, controls, guide, audio settings, and records.
- `dist/audio.mjs`: original music and combat synthesis.
- `dist/survival.css`: responsive layout without animations or transitions.
- `scripts/serve.mjs`: dependency-free preview server.
