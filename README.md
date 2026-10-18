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

The compact top-right panel holds health, XP, level, time, kills, a small elite countdown, and the active button. A ready ultimate has a saturated class color, bright border, and larger icon; it does not pulse or animate. Hover over the clock for wave and difficulty budget. Boss/miniboss names and health bars appear above their heads. There is no bottom dock, top-center counter strip, minimap, floating damage text, screen shake, or particle swarms. A 32-unit basic attack cooldown bar sits directly above each class’s head, filling amber and turning pale green when ready. Melee classes have a transparent primary attack-range circle that follows reach and area upgrades.

The renderer plays four baked illustrated poses (idle, two walking/flying frames, attack) from sprite atlases, including mirrored frames. No character paths or glow filters run in the frame loop. System reduced-motion preference disables pose playback. Pausing freezes the simulation/animation clock. Rendering targets 60 FPS with corrected frame pacing and drops to 30 if measured draw submission cost exceeds the budget. Simulation remains at 60 Hz. Canvas pixel density is capped at 1.5 and 1.8 million backing pixels, dropping to 1× for crowded fights. Terrain has a separate canvas and redraws only when camera position or size changes. Render lists and collision buckets are reused. CSS transitions remain disabled.

## Seven classes

| Class | Starting features | Space active |
|---|---|---|
| Archer | 100 HP, 340 range, one extra piercing target | Scattershot: 9 arrows, 150% weapon damage each, shotgun fan, fixed 360-unit travel limit and fixed 5s cooldown |
| Fighter | 130 HP, 20% damage reduction, broad melee attacks | Iron cyclone: repeated area strikes for 2s, 40% additional damage reduction; 14s cooldown |
| Assassin | 95 HP, 23 damage, 235 speed, 0.36s attack interval, 100 melee range, 18% dodge, 30% crit, 210% crit multiplier | Shadowstep: dash through enemies for 400% weapon damage, 0.6s invulnerability; 10s cooldown |
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

New common AoE choices include Wide impact (larger melee areas or projectile splash) and Pressure ring. Tank has Seismic shield area strikes. Healer has Consecration and larger Dawnfire explosions. Shapeshifter has wider claws, adaptation, and companion synergy, in addition to elite aspects. Existing melee cleaves, orbit blades, slams, frost novas, lightning chains, fire aura, and death bursts use brief colored pulses, impact sparks, and lightning traces.

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
node scripts/spatial-test.mjs
node scripts/effects-test.mjs
node scripts/art-test.mjs
node scripts/performance-bench.mjs
```

Checks cover all seven class attacks, unique ranked pets, buffed pet damage, fixed healer rates, non-compounding projectile slowdown, guardian sacrifice and permanent loss, shotgun travel/cooldown limits, Assassin stats and dash damage, Tank defenses/AoE, Healer splash/sustain, all six inherited aspects and repeated ranks, eligible choices, deterministic ten-minute runs, the enemy budget on every crowded-test step, audio routing/limits, compact UI behavior, cached animation playback, reduced motion, exact melee circles, stable collection identities, swept hits across grid boundaries, reused terrain, adaptive quality, and overhead boss health. Browser QA checks actual desktop and phone layouts and runtime errors. Automated audio tests inspect signal graphs rather than perceived sound quality.

## Source

- `dist/engine.mjs`: deterministic combat, classes, passives, pets, elite aspects, and encounter director.
- `dist/effects.mjs`: recycled, rate-limited visual effects with reserved capacity for class casts.
- `dist/render.mjs`: cached illustrated animation atlases, terrain layer, melee reach circles, warning geometry, projectiles, adaptive resolution, and overhead health.
- `dist/heroes.mjs`: detailed class-specific models baked into mirrored movement and attack atlases.
- `dist/pixel-effects.mjs`: six-frame pixel burst atlases, shared across casts, impacts, and deaths.
- `dist/illustrations.mjs`: the original organic terrain and detailed character/companion art, rasterized only when creating cached textures.
- `dist/survival.mjs`: menu, compact HUD, decisions, controls, guide, audio settings, and records.
- `dist/audio.mjs`: original music and combat synthesis.
- `dist/survival.css`: responsive layout without animations or transitions.
- `scripts/serve.mjs`: dependency-free preview server.

The illustrated visual style is restored from the earlier forest version. All seven classes and seven pet types retain the illustrated art with cached movement and attack poses; the Tank has a tower shield, the Healer a dawn staff, and the Shapeshifter claws and inherited palette colors. Bright arrows, ice shards, and spell orbs are cached images as well. There are no per-frame character drawing paths, particle swarms, screen shake, or dynamic glow filters. Wings and limbs animate by switching cached frames. The compact HUD and all current gameplay rules are retained.

## Crowded-fight profiling

The simulation reuses numeric spatial buckets instead of rebuilding string-keyed Maps every tick. Projectile hits use squared swept-distance checks; collection removal compacts arrays in place. Companion target IDs use a reusable lookup. Obstacle and area/orbit checks avoid unnecessary square roots. Melee target acquisition and its visible circle share the same primaryRange function.

In a synchronous browser CPU benchmark at 1280 × 720, with 96 enemies and 219 hostile shots, the previous renderer averaged 2.29 ms per draw (p95 10.50 ms). With animation enabled, the updated renderer averaged 1.42 ms (p95 2.30 ms) in the same scenario. Average simulation time was 0.28 ms before and 0.27 ms after in that short browser sample. A separate 15,000-step Node profile fell from about 1553 ms total to 1250 ms. Timings depend on the machine and are CPU/submission measurements, not display FPS guarantees. The old fixed 30 FPS gate was also replaced with a cadence that preserves fractional frame time and targets smooth 60 FPS.

## Combat feedback and effect budget

Shapeshifter claw attacks have separate cached wind-up, strike, and recovery poses, plus three directional claw trails. A pre-baked red overlay flashes the hero for 0.24 seconds on actual health loss. Full shield blocks, dodges, invulnerability, level-up protection, and guardian saves do not trigger it.

Class actives, area passives, elemental explosions, lightning chains, companion hits, elite absorption, guardian sacrifice, and level-up protection have brief colored feedback. Effect objects are recycled from a fixed 32-object pool. Normal effects admit at most 24 at once, falling to 12 above 64 enemies, with a 60-per-second token budget and duplicate pulse suppression. Reserved capacity keeps class casts visible. Effects expire on the simulation clock, freeze during pause, and never consume gameplay randomness. Offscreen effects are culled; reduced motion removes pulse expansion and claw trails. There are no particle swarms, runtime gradients, filters, or screen shake.

A 15,000-step Node sample measured 1324 ms before and 1356 ms after adding effects (about 2% overhead). A browser stress scene with 96 enemies, 219 hostile shots, and deliberately saturated effects stayed at the 32-effect ceiling; average simulation CPU time was 0.28 ms and average draw submission 2.41 ms in that run. These measurements are machine-dependent CPU timings, not display FPS guarantees.

## Detailed models and pixel feedback

All seven classes have separate silhouettes and layered equipment: Archer quiver/longbow/forest cloak, Fighter plume/plate/greatsword, Assassin scarf/mask/twin daggers, Mage pointed hat/embroidered robe/crystal staff, Tank reinforced armor/tower shield, Healer halo/ceremonial vestments/dawn staff, and Shapeshifter antlers/fur wraps/feral claws. Details are baked into existing sprite atlases once; walking, attack poses, mirrored facing, inherited colors, and red damage masks remain cached.

Effects now include six-frame pixel sparks, embers, frost stars, holy glints, death fragments, damage bursts, and cast flashes. Large ability pulses have pixel fragments along the rim; lightning has pixel impacts, and Shadowstep leaves a short segmented trail. A local burst is a single draw call; all its particles share one atlas. The 32-object pool, 60-event/s token limit, offscreen culling, reduced motion, and lower crowded-scene limits still apply. Bursts last 0.14–0.45 seconds. No individually simulated particles are added.

Assassin’s starting expected basic DPS fell from about 127 to 85 before enemy defenses and passives. Movement fell from 255 to 235, dodge from 25% to 18%, and kill healing from 0.2 to 0.1. Shadowstep changed from 550% / 8s / 0.8s safety to 400% / 10s / 0.6s safety. HP and melee reach are unchanged. Menu perks and ability descriptions match the new values.

The pixel update’s crowded browser sample held 96 enemies, 219 hostile shots, and 32 effects, averaging 0.17 ms simulation and 2.14 ms draw submission. A 15,000-step Node run measured 1329 ms against 1383 ms before this update; these samples show no simulation regression, but are not a guarantee of display FPS.
