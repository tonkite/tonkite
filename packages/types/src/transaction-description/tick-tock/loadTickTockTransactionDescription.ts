import { Slice } from 'ton3-core';
import { TickTockTransactionDescription } from './TickTockTransactionDescription';
import { loadTransactionStoragePhase } from '../phases/storage';
import { loadTransactionComputePhase } from '../phases/compute';
import { loadTransactionActionPhase } from '../phases/action';
import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

/**
 * trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool destroyed:Bool = TransactionDescr;
 */

export function loadTickTockTransactionDescription(
  slice: Slice,
  isTock: boolean,
): TickTockTransactionDescription {
  const storage = loadTransactionStoragePhase(slice);
  const compute = loadTransactionComputePhase(slice);
  const action = slice.loadBit() ? loadTransactionActionPhase(Slice.parse(slice.loadRef())) : null;
  const aborted = !!slice.loadBit();
  const destroyed = !!slice.loadBit();

  return {
    type: 'tick-tock',
    kind: TransactionDescriptionKind.TICK_TOCK,
    isTock,
    storage,
    compute,
    action,
    aborted,
    destroyed,
  };
}
