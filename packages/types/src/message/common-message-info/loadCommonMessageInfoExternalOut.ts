import { Slice } from 'ton3-core';
import { CommonMessageInfoExternalOut } from './CommonMessageInfoExternalOut';
import { CommonMessageInfoKind } from './CommonMessageInfoKind';

export function loadCommonMessageInfoExternalOut(slice: Slice): CommonMessageInfoExternalOut {
  const src = slice.loadAddress()!;
  const dest = slice.loadAddress();
  const createdLt = slice.loadBigUint(64);
  const createdAt = slice.loadUint(32);

  return {
    type: 'external-out',
    src,
    dest,
    createdLt,
    createdAt,
  };
}
