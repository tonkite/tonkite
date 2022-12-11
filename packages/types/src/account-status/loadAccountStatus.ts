import type { Slice } from 'ton3-core';
import type { AccountStatus } from './AccountStatus';

export function loadAccountStatus(slice: Slice): AccountStatus {
  return slice.loadUint(2);
}
