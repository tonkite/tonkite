import { Address, BOC, Builder, Cell, Coins, Slice, Utils } from 'ton3-core';
import process from 'process';
import util from 'util';

function normalize(value: unknown): any {
  if (value === null || typeof value === 'undefined') {
    return null;
  }

  if (
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    typeof value === 'function' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (value instanceof Address) {
    return value.toString('raw');
  }

  if (value instanceof Cell) {
    return BOC.toBase64Standard(value);
  }

  if (value instanceof Coins) {
    return value.toNano();
  }

  if (value instanceof Slice) {
    return BOC.toBase64Standard(new Builder().storeSlice(value).cell());
  }

  if (value instanceof Uint8Array) {
    return Utils.Helpers.bytesToHex(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([propertyKey, propertyValue]) => [
        propertyKey,
        normalize(propertyValue),
      ]),
    );
  }

  throw new Error(`Cannot dump value (type "${typeof value}")`);
}

export function dump(value: unknown) {
  process.stdout.write(
    util.inspect(normalize(value), {
      colors: true,
      depth: 10,
    }),
  );
}
