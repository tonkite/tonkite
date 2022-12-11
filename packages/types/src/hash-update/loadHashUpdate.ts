import { HashUpdate } from './HashUpdate';
import { Slice } from 'ton3-core';

export function loadHashUpdate(slice: Slice): HashUpdate {
  if (slice.loadUint(8) !== 0x72) {
    throw new Error('Not a HASH_UPDATE');
  }

  return {
    oldHash: slice.loadBytes(256),
    newHash: slice.loadBytes(256),
  };
}
