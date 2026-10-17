import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
let go = 'go';
if (spawnSync(go, ['version']).error) {
  go = join(tmpdir(), 'gamat-toolchain', 'go', 'bin', process.platform === 'win32' ? 'go.exe' : 'go');
  if (!existsSync(go)) throw new Error('Install Go 1.23 or newer from https://go.dev/dl/');
}
const build = spawnSync(go, ['build', '-trimpath', '-ldflags=-s -w', '-o', 'dist/game.wasm', './cmd/game'], { env: { ...process.env, GOOS: 'js', GOARCH: 'wasm' }, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);
const root = spawnSync(go, ['env', 'GOROOT'], { encoding: 'utf8' }).stdout.trim();
copyFileSync(join(root, 'lib', 'wasm', 'wasm_exec.js'), 'dist/wasm_exec.js');
console.log('Go WebAssembly build ready in dist/');
