import { Slice } from 'ton3-core';
import { StorageInfo } from './StorageInfo';
import { loadStorageUsed } from '../storage-used/loadStorageUsed';

export function loadStorageInfo(slice: Slice): StorageInfo {
  return {
    used: loadStorageUsed(slice),
    lastPaid: slice.loadUint(32),
    duePayment: slice.loadBit() ? slice.loadCoins() : null,
  };
}
