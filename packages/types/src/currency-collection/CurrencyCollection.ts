import type { Coins } from 'ton3-core';
import type { ExtraCurrencyCollection } from '../extra-currency-collection';

/**
 * currencies$_ grams:Grams other:ExtraCurrencyCollection
 *            = CurrencyCollection;
 */
export interface CurrencyCollection {
  coins: Coins;
  other: ExtraCurrencyCollection;
}
