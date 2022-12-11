import { Slice } from 'ton3-core';
import { StorageUsed } from './StorageUsed';

export function loadStorageUsed(slice: Slice): StorageUsed {
  return {
    cells: slice.loadVarUint(7),
    bits: slice.loadVarUint(7),
    publicCells: slice.loadVarUint(7),
  };
}
