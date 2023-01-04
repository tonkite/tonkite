import { Slice } from 'ton3-core';
import { CommonMessageInfoExternalOut } from './CommonMessageInfoExternalOut';
import { loadExternalAddress } from '../../message-address-external';

export function loadCommonMessageInfoExternalOut(slice: Slice): CommonMessageInfoExternalOut {
  const src = slice.loadAddress()!;
  const dest = loadExternalAddress(slice);
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
