import { Slice } from 'ton3-core';
import { loadCurrencyCollection } from '../currency-collection';
import { loadAccountState } from '../account-state';
import { AccountStorage } from './AccountStorage';

export function loadAccountStorage(slice: Slice): AccountStorage {
  const lastTransactionLt = slice.loadBigUint(64);
  const balance = loadCurrencyCollection(slice);
  const state = loadAccountState(slice);

  return {
    lastTransactionLt,
    balance,
    state,
  };
}
