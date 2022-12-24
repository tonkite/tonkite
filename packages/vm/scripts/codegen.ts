import * as fs from 'fs';
import * as path from 'path';

const wasmBinary = fs.readFileSync(
  path.join(__dirname, '../artifacts/emulator-emscripten.wasm'),
);

fs.writeFileSync(
  path.join(__dirname, '../artifacts/emulator-emscripten.wasm.js'),
  `module.exports = { wasmBinary: "${wasmBinary.toString("base64")}" };`,
);
