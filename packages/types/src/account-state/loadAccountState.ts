import { Slice } from 'ton3-core';
import { loadStateInit } from '../state-init';
import { AccountState } from './AccountState';

export function loadAccountState(slice: Slice): AccountState {
  if (slice.loadBit()) {
    return {
      type: 'active',
      ...loadStateInit(slice),
    };
  }

  if (slice.loadBit()) {
    return {
      type: 'frozen',
      stateHash: slice.loadBytes(256),
    };
  }

  return {
    type: 'uninitialized',
  };
}
