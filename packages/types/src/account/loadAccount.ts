import { Slice } from 'ton3-core';
import { Account } from './Account';
import { loadStorageInfo } from '../storage-info';
import { loadAccountStorage } from '../account-storage';

export function loadAccount(slice: Slice): Account | null {
  if (!slice.loadBit()) {
    return null;
  }

  const address = slice.loadAddress()!;
  const storageStat = loadStorageInfo(slice);
  const storage = loadAccountStorage(slice);

  return {
    address,
    storageStat,
    storage,
  };
}
