import { StorageUsedShort } from './StorageUsedShort';
import { Slice } from 'ton3-core';

export function loadStorageUsedShort(slice: Slice): StorageUsedShort {
  const cells = slice.loadVarUint(7);
  const bits = slice.loadVarUint(7);

  return {
    cells,
    bits,
  };
}
