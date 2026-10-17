# Emberfall — The Hollow Wood

A fullscreen, single-player 2D browser survival game. Choose Archer, Fighter, Assassin, or Mage; survive an escalating horde in a finite 2200 × 1600 arena. Every kill grants immediate XP. Each level freezes the game and offers three distinct, stacking passives.

## Run

Node.js 18+, no dependencies or build step:

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8080. Use a different port in PowerShell if another server is already running:

```powershell
$env:PORT = '8082'
node scripts/serve.mjs
```

Deploy `dist/` on any static host that serves `.mjs` as JavaScript. The optional Go server also works: `go run ./cmd/server`. Restart an existing server after source changes.

## Controls and interface

- WASD / arrows: move. On touch screens, drag the arena to use a movement stick.
- Primary attacks fire automatically. Fighter and Assassin strike in melee; Archer and Mage attack at range.
- Space or the circular ability button: use your unique class active. The ring and timer show cooldown.
- P / Esc or the pause button: pause/resume. Leaving the tab pauses automatically.
- 1–3 or click/tap: choose one of the three level-up cards.
- F or Fullscreen: toggle browser fullscreen. Starting a run requests fullscreen when the browser supports it; the game always fills the window.
- B, View build, or a passive icon: inspect your build in a paused, readable panel.
- Field guide: all 42 abilities, all 14 monsters, XP rewards, boss patterns, and controls.
- Sound: optional synthesized audio.

A centered combat dock shows health, shield, XP, recent passives, and the class active with cooldown. Health loss has an immediate red pulse and a trailing damage bar. Kills, survival time, wave, level, and the next elite countdown appear above the arena. Active elites have named health bars. The minimap shows the finite arena, stone ruins, enemies, elites, hero, and camera viewport. Walls and ruins block movement. The longest survival is saved locally when browser storage is available.

## Classes

| Class | Primary weapon | Starting perks |
|---|---|---|
| Archer | Longbow | 340 range, pierces one foe, +10% movement speed |
| Fighter | Greatsword | Wide melee attacks, 130 health, 20% damage reduction |
| Assassin | Twin daggers | Fast melee, 25% critical chance, +15% speed, 0.2 health per kill |
| Mage | Ember staff | Explosive fireballs, burning, +20% elemental damage |

## Class actives

Use Space or tap the circular ability button. Movement direction takes priority for directional skills; otherwise they aim toward a nearby enemy. Cooldowns freeze while paused or choosing upgrades. Starting a new run resets them.

| Class | Active | Cooldown |
|---|---|---:|
| Archer | Piercing volley: 9 arrows dealing 150% weapon damage, piercing 4 additional enemies | 10s |
| Fighter | Iron cyclone: strike nearby foes for 2 seconds and take 40% less damage | 14s |
| Assassin | Shadowstep: a short invulnerable dash that cuts through foes and respects walls and ruins | 8s |
| Mage | Glacial nova: freeze and damage nearby enemies; erase nearby hostile projectiles | 16s |

## Combat and recovery balance

Enemies have higher health, movement speed, and damage. Enemy health and damage scale with elapsed time. Waves spawn faster; ranged and special enemies unlock earlier. Primary hero damage and attack frequency are reduced. Melee enemies wind up before striking; archers and spitters aim before releasing projectiles.

- Second wind: **0.2 HP/s per rank**, capped at **1 HP/s**. Requires **6 seconds without taking damage**.
- Blood pact: **0.15 HP per kill per rank**. Sustained kill-healing is limited to **0.8 HP/s**, with a maximum 0.8-point burst budget.
- Iron heart: +20 maximum health and 10 immediate healing per rank, capped at 5 ranks.
- Fresh resolve: 6 healing per rank on acquisition and future level-ups, capped at 3 ranks.
- Ember ward: 15 shield per rank, capped at 4 ranks. Recharge is 2 points/s after 8 seconds without damage.
- Stone skin: 8% damage reduction per rank, capped at 5 ranks.

Hostile projectiles have bright white cores, saturated colors, and long luminous trails: hot-pink arrows, orange-red fire, cyan ice, and neon-green poison. Ground warnings pulse and carry labels. Hits produce visible health-loss numbers, red impact bursts, a screen-edge flash, and a brief camera shake. Reduced-motion preferences disable the shake.

Characters are drawn as articulated shapes, not static pixel grids. Legs walk, wings flap, weapons swing and recoil, spellcasters raise their hands and staff, enemies flash and recoil on damage, and defeated humanoids collapse and fade. Rocks use irregular faceted shapes instead of blocks.

## Pacing

Waves last 30 seconds. Spawn pressure and monster health increase with elapsed time, with no final wave. Common enemies are limited to 380 for performance; scheduled elites can exceed this limit.

Minibosses rotate every 45 seconds:

1. Thorn Ravager: telegraphed charges.
2. The Broodmother: summons nightwings and spits venom.
3. The Mire Hexer: delayed cursed pools.

Main bosses rotate every 120 seconds, starting at 02:00:

1. The Stone Warden: charges and wide ground slams.
2. The Frost Revenant: radial ice volleys and freezing zones.
3. The Ashen Dragon: fire volleys and persistent burning ground.

The sequence repeats with stronger enemies. Dashed circles and charge paths warn of incoming attacks. Solid pools deal damage. Bosses resist knockback, stun, and freeze duration.

## Monster rewards

| Monster | Base XP |
|---|---:|
| Hollow | 3 |
| Nightwing | 2 |
| Ironhide | 9 |
| Bone archer | 6 |
| Blight spitter | 8 |
| Briar ram | 7 |
| Grave caller | 12 |
| Pale wraith | 10 |
| Thorn Ravager | 45 |
| The Broodmother | 50 |
| The Mire Hexer | 55 |
| The Stone Warden | 130 |
| The Frost Revenant | 150 |
| The Ashen Dragon | 180 |

XP bonuses multiply these rewards. Killing a monster with a companion or damage over time grants the same XP as a primary attack.

## Abilities and companions

42 passives across Combat, Fire, Frost, Lightning, Vitality, Nature, Arcane, and Companion categories. Colors and text labels identify each school. Upgrade descriptions use 16px text on desktop and 14px on narrow screens; guide descriptions use 14–15px. Capped passives stop appearing at their maximum rank. Primary projectile upgrades are class-specific. Every class can acquire secondary weapons, elemental spells, melee abilities, and companions. A companion is guaranteed among the first level-up choices.

Four companion types can be summoned up to three times each. They choose and retain their own targets, preferring alternatives to the hero's current target. Companions are invulnerable spirits:

- Moonfang: a wolf that pursues foes and bites in melee.
- Storm sprite: chains lightning through multiple targets.
- Frost owl: fires freezing shards.
- Cinder drake: launches explosive fireballs that burn.

Melee options include Spectral cleaver, Warden's ring, Earthshatter, Crushing force, Briar armor, and Vengeful spirit. Elemental builds support burning, poison, slow, freeze, stun, chain lightning, and death explosions. Shielding, healing, evasion, critical hits, and companion buffs provide additional build paths.

## Verification

```sh
node --check dist/engine.mjs
node --check dist/render.mjs
node --check dist/survival.mjs
node scripts/survival-test.mjs
node scripts/ui-smoke.mjs
node scripts/combat-test.mjs
```

Simulation checks cover all four class attacks, finite boundaries and obstacles, all XP rewards, distinct and eligible level-up choices, upgrade time freezing, independent companion targeting, companion attacks/statuses, hostile arrows, charges, each boss pattern, warned ground slams, freezing and burning, elite schedules, death, deterministic runs, and a ten-minute mixed build.

The combat checks cover all four active abilities, cooldown and pause rules, cyclone damage reduction, dash collisions, nova projectile removal, regeneration delays and caps, kill-healing budgets, visible hit events, and idle-player survival pressure. The controller also verifies the active button, cooldown display, and reset on class changes.

The controller smoke executes the real interface with a minimal DOM/canvas stand-in, checking class selection, class health, the HUD, colored upgrade cards, ability selection, paused build inspection, menu navigation, resetting a run, and the ability/monster guide. Browser QA checks the actual layout and controls separately.

## Source

- `dist/engine.mjs`: deterministic simulation, map, classes, monsters, passives, and companions.
- `dist/render.mjs`: Canvas renderer, cached organic terrain, articulated illustrated characters, walking and attack animation, bright projectiles, combat effects, and minimap.
- `dist/survival.mjs`: menu, HUD, upgrade cards, input, fullscreen, field guide, audio, and local records.
- `dist/survival.css`: fullscreen and responsive interface.
- `scripts/serve.mjs`: dependency-free local server.

The earlier Go micro-RTS prototype remains at `/micro-command.html` with its Go source and WebAssembly assets. The survival game does not require Go.
