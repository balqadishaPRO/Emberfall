# GAMAT — Micro Command

A five-minute browser RTS with a Go simulation compiled to WebAssembly and a Canvas UI. No runtime dependencies, accounts, or backend required for bot matches.

## Run

With Go 1.23+ installed, run in PowerShell:

```powershell
node scripts/build.mjs
go run ./cmd/server
```

Open http://localhost:8080. Precompiled browser assets are also included in `dist/` and can be hosted on any static host. Serve over HTTP rather than opening index.html directly.

On Linux/macOS:

```sh
GOOS=js GOARCH=wasm go build -trimpath -ldflags='-s -w' -o dist/game.wasm ./cmd/game
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" dist/wasm_exec.js
go run ./cmd/server
```

## Play

Select a teal outpost, then click another outpost to deploy the chosen percentage of troops. Capture neutrals to increase production. Upgrade with 20/40 troops to reach production levels 2/3. Eliminate the bot's territory and moving fleets to win. After five minutes, army size plus territory value determines the winner. A tie is a draw.

Three bot difficulties are available. Difficulty changes bot timing and troop production. Maps use seeded neutral garrisons. Share challenge encodes the seed, difficulty, and (after finishing) score in the URL. Friends play independently against the same bot; this version has no live multiplayer. The link must point to a deployment accessible to your friend; localhost and owner-private hosting are not accessible to them.

Keyboard: Tab into the map, arrows cycle outposts, Enter selects/attacks. U upgrades, Escape clears selection, Space pauses. Switching tabs automatically pauses. Personal best is stored locally when browser storage is available.

## Validate

```sh
go test ./...
go vet ./...
```

The game engine is in `internal/game`; `cmd/game` exposes the WebAssembly bridge, `cmd/server` is the optional Go static server. The renderer uses JavaScript Canvas. Shared seeded games use a fixed 20 Hz simulation step; rendering follows the browser refresh rate.
