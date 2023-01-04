import { Slice } from 'ton3-core';
import { ExternalAddress } from './ExternalAddress';

export function loadExternalAddress(slice: Slice): ExternalAddress | null {
  if (!slice.loadUint(2)) {
    return null;
  }

  const length = slice.loadUint(9);
  const address = slice.loadBytes(length);

  return {
    length,
    address,
  };
}
