import { OrdinaryTransactionDescription } from './OrdinaryTransactionDescription';
import { Slice } from 'ton3-core';
import { TransactionDescriptionKind } from '../TransactionDescriptionKind';
import { loadTransactionComputePhase } from '../phases/compute';
import { loadTransactionStoragePhase } from '../phases/storage';
import { loadTransactionCreditPhase } from '../phases/credit';
import { loadTransactionActionPhase } from '../phases/action';
import { loadTransactionBouncePhase } from '../phases/bounce';

/**
 * trans_ord$0000 credit_first:Bool
 *   storage_ph:(Maybe TrStoragePhase)
 *   credit_ph:(Maybe TrCreditPhase)
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool bounce:(Maybe TrBouncePhase)
 *   destroyed:Bool
 *   = TransactionDescr;
 */

export function loadOrdinaryTransactionDescription(slice: Slice): OrdinaryTransactionDescription {
  const creditFirst = !!slice.loadBit();
  const storage = slice.loadBit() ? loadTransactionStoragePhase(slice) : null;
  const credit = slice.loadBit() ? loadTransactionCreditPhase(slice) : null;
  const compute = loadTransactionComputePhase(slice);
  const action = slice.loadBit() ? loadTransactionActionPhase(Slice.parse(slice.loadRef())) : null;
  const aborted = !!slice.loadBit();
  const bounce = slice.loadBit() ? loadTransactionBouncePhase(slice) : null;
  const destroyed = !!slice.loadBit();

  return {
    type: 'ordinary',
    creditFirst,
    storage,
    credit,
    compute,
    action,
    aborted,
    bounce,
    destroyed,
  };
}
