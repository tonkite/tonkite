import { TransactionDescription } from './TransactionDescription';
import { Slice } from 'ton3-core';
import { TransactionDescriptionKind } from './TransactionDescriptionKind';
import { loadOrdinaryTransactionDescription } from './ordinary';
import { loadTickTockTransactionDescription } from './tick-tock';

export function loadTransactionDescription(slice: Slice): TransactionDescription {
  const kind = slice.loadUint(4);

  switch (kind) {
    case TransactionDescriptionKind.ORDINARY:
      return loadOrdinaryTransactionDescription(slice);

    // /** trans_storage$0001 */
    // STORAGE = 0b0001,

    case TransactionDescriptionKind.TICK_TOCK << 1:
    case (TransactionDescriptionKind.TICK_TOCK << 1) | 1:
      return loadTickTockTransactionDescription(slice, !!(kind & 1));

    // /** trans_split_prepare$0100 */
    // SPLIT_PREPARE = 0b0100,
    // /** trans_split_install$0101 */
    // SPLIT_INSTALL = 0b0101,
    // /** trans_merge_prepare$0110 */
    // MERGE_PREPARE = 0b0110,
    // /** trans_merge_install$0111 */
    // MERGE_INSTALL = 0b0111,

    default:
      throw new Error(
        `Unsupported kind of TransactionDescription (0b${kind.toString(2).padStart(4, '0')}).`,
      );
  }
}
