import { Slice } from 'ton3-core';
import { SimpleLibrary } from './SimpleLibrary';

export function loadSimpleLibrary(slice: Slice): SimpleLibrary {
  const isPublic = !!slice.loadBit();
  const root = slice.loadRef();

  return {
    isPublic,
    root,
  };
}
