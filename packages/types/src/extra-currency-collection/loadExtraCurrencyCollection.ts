import { HashmapE, Slice, Utils } from 'ton3-core';
import type { Bit, Cell } from 'ton3-core';
import type { ExtraCurrencyCollection } from './ExtraCurrencyCollection';

/**
 * extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
 *                  = ExtraCurrencyCollection;
 */

export function loadExtraCurrencyCollection(slice: Slice): ExtraCurrencyCollection {
  if (!slice.loadBit()) {
    return null;
  }

  const dict = slice.loadRef();

  return HashmapE.parse<number, bigint>(32, Slice.parse(dict), {
    deserializers: {
      key: (key: Bit[]) => parseInt(Utils.Helpers.bitsToHex(key), 16),
      value: (value: Cell) => Slice.parse(value).loadVarBigUint(32),
    },
  });
}
