import { AccountStatusChange } from './AccountStatusChange';
import { Slice } from 'ton3-core';

export function loadAccountStatusChange(slice: Slice): AccountStatusChange {
  if (!slice.loadBit()) return AccountStatusChange.UNCHANGED;

  return slice.loadBit() ? AccountStatusChange.DELETED : AccountStatusChange.FROZEN;
}
