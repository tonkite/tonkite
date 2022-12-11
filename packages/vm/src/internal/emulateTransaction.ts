import * as fs from 'fs';
import * as path from 'path';
import { Cell, BOC, Address, Coins, Utils } from 'ton3-core';
import { EmulatorVerbosityLevel } from '../EmulatorVerbosityLevel';
import crc16xmodem from 'crc/crc16xmodem';

const ZERO_ADDRESS = new Address(
  '0:0000000000000000000000000000000000000000000000000000000000000000',
);

const createModule: (options: {
  wasmBinary: Buffer;
}) => Promise<any> = require('../../artifacts/emulator-emscripten');

const wasmBinary = fs.readFileSync(
  path.join(__dirname, '../../artifacts/emulator-emscripten.wasm'),
);

type Pointer = unknown;

const writeToCString = (mod: any, data: string): Pointer => {
  const len = mod.lengthBytesUTF8(data) + 1;
  const ptr = mod._malloc(len);
  mod.stringToUTF8(data, ptr, len);
  return ptr;
};

const readFromCString = (mod: any, pointer: Pointer): string => mod.UTF8ToString(pointer);

export interface EmulationResult {
  output:
    | {
        success: true;
        transaction: string;
        shard_account: string;
        vm_log: string;
        actions: string | null;
      }
    | {
        success: false;
        error: string;
      };
  logs: string;
}

interface EmulateTransactionParams {
  now: number;
  lt: bigint;
  ignoreCheckSignature: boolean;
  randomSeed: Uint8Array;
}

export async function emulateTransaction(
  config: Cell,
  libs: Cell | null,
  verbosityLevel: EmulatorVerbosityLevel,
  shardAccount: Cell,
  message: Cell,
  extra: Partial<EmulateTransactionParams> = {},
): Promise<EmulationResult> {
  const emulatorModule = await createModule({
    wasmBinary,
  });

  const allocatedPointers: Pointer[] = [];

  const trackPointer = (pointer: Pointer): Pointer => {
    allocatedPointers.push(pointer);
    return pointer;
  };

  try {
    const configPointer = trackPointer(
      writeToCString(emulatorModule, BOC.toBase64Standard(config)),
    );

    const libsPointer = libs
      ? trackPointer(writeToCString(emulatorModule, BOC.toBase64Standard(libs)))
      : 0;

    const shardAccountPointer = trackPointer(
      writeToCString(emulatorModule, BOC.toBase64Standard(shardAccount)),
    );

    const messagePointer = trackPointer(
      writeToCString(emulatorModule, BOC.toBase64Standard(message)),
    );

    const params = {
      utime: extra.now ?? 0,
      lt: extra.lt?.toString() ?? '0',
      rand_seed: Utils.Helpers.bytesToHex(extra.randomSeed ?? new Uint8Array(32)),
      ignore_chksig: extra.ignoreCheckSignature ?? false,
    };

    const paramsPointer = trackPointer(writeToCString(emulatorModule, JSON.stringify(params)));

    const resultPointer = trackPointer(
      emulatorModule._emulate(
        configPointer,
        libsPointer,
        verbosityLevel,
        shardAccountPointer,
        messagePointer,
        paramsPointer,
      ),
    );

    const resultJSON = readFromCString(emulatorModule, resultPointer);

    return JSON.parse(resultJSON);
  } finally {
    allocatedPointers.forEach((pointer) => emulatorModule._free(pointer));
  }
}

interface RunGetMethodResult {
  logs: string;
  output:
    | {
        success: true;
        stack: string;
        gas_used: string;
        vm_exit_code: number;
        vm_log: string;
        missing_library: string | null;
      }
    | {
        success: false;
        error: string;
      };
}

export interface RunGetMethodParams {
  address: Address;
  balance: Coins;
  now: number;
  gasLimit: number;
  randomSeed: Uint8Array;
  verbosity: EmulatorVerbosityLevel;
}

export async function runGetMethod(
  config: Cell,
  code: Cell,
  data: Cell,
  libraries: Cell | null,
  method: string | number,
  stack: Cell,
  extraParams: Partial<RunGetMethodParams>,
): Promise<RunGetMethodResult> {
  const emulatorModule = await createModule({
    wasmBinary,
  });

  const trackPointer = (pointer: Pointer): Pointer => {
    allocatedPointers.push(pointer);
    return pointer;
  };

  const allocatedPointers: Pointer[] = [];

  try {
    const configPointer = trackPointer(
      writeToCString(emulatorModule, BOC.toBase64Standard(config)),
    );

    const stackPointer = trackPointer(writeToCString(emulatorModule, BOC.toBase64Standard(stack)));

    const params /*: GetMethodInternalParams */ = {
      code: BOC.toBase64Standard(code),
      data: BOC.toBase64Standard(data),
      verbosity: extraParams.verbosity ?? EmulatorVerbosityLevel.INFO,
      libs: libraries ? BOC.toBase64Standard(libraries) : '',
      address: (extraParams.address ?? ZERO_ADDRESS).toString('raw'),
      unixtime: extraParams.now ?? Math.floor(Date.now() / 1000),
      balance: (extraParams.balance ?? new Coins(0)).toNano(),
      rand_seed: Utils.Helpers.bytesToHex(extraParams.randomSeed ?? new Uint8Array(32)),
      gas_limit: (extraParams.gasLimit ?? 0).toString(),
      method_id: typeof method === 'number' ? method : (crc16xmodem(method) & 0xffff) | 0x10000,
    };

    const paramsPointer = trackPointer(writeToCString(emulatorModule, JSON.stringify(params)));
    const resultPointer = trackPointer(
      emulatorModule._run_get_method(paramsPointer, stackPointer, configPointer),
    );

    const resultJSON = readFromCString(emulatorModule, resultPointer);

    return JSON.parse(resultJSON);
  } finally {
    allocatedPointers.forEach((pointer) => emulatorModule._free(pointer));
  }
}
