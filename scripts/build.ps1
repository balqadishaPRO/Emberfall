$ErrorActionPreference = 'Stop'
$go = (Get-Command go -ErrorAction SilentlyContinue).Source
if (-not $go) { $go = Join-Path $env:TEMP 'gamat-toolchain/go/bin/go.exe' }
if (-not (Test-Path -LiteralPath $go)) { throw 'Install Go 1.23 or newer: https://go.dev/dl/' }
$oldOS = $env:GOOS
$oldArch = $env:GOARCH
try {
    $env:GOOS = 'js'
    $env:GOARCH = 'wasm'
    & $go build -trimpath -ldflags='-s -w' -o dist/game.wasm ./cmd/game
    if ($LASTEXITCODE -ne 0) { throw 'WebAssembly build failed' }
    $goroot = & $go env GOROOT
    Copy-Item -LiteralPath (Join-Path $goroot 'lib/wasm/wasm_exec.js') -Destination dist/wasm_exec.js
} finally {
    $env:GOOS = $oldOS
    $env:GOARCH = $oldArch
}
Write-Output 'Go WebAssembly build ready in dist/'
