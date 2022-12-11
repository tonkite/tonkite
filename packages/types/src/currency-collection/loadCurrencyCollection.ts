import type { Slice } from 'ton3-core';
import type { CurrencyCollection } from './CurrencyCollection';
import { loadExtraCurrencyCollection } from '../extra-currency-collection';

export function loadCurrencyCollection(slice: Slice): CurrencyCollection {
  return {
    coins: slice.loadCoins(),
    other: loadExtraCurrencyCollection(slice),
  };
}
