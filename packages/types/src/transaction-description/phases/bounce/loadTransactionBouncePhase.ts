import { Slice } from 'ton3-core';
import { TransactionBouncePhase } from './TransactionBouncePhase';
import { loadStorageUsedShort } from '../../../storage-used-short';
import { TransactionBouncePhaseKind } from './TransactionBouncePhaseKind';

/**
 * tr_phase_bounce_negfunds$00 = TrBouncePhase;
 *
 * tr_phase_bounce_nofunds$01 msg_size:StorageUsedShort
 *   req_fwd_fees:Grams = TrBouncePhase;
 *
 * tr_phase_bounce_ok$1 msg_size:StorageUsedShort
 *   msg_fees:Grams fwd_fees:Grams = TrBouncePhase;
 */

export function loadTransactionBouncePhase(slice: Slice): TransactionBouncePhase {
  if (slice.loadBit()) {
    const messageSize = loadStorageUsedShort(slice);
    const messageFees = slice.loadCoins();
    const forwardFees = slice.loadCoins();
    return {
      kind: TransactionBouncePhaseKind.OK,
      messageSize,
      messageFees,
      forwardFees,
    };
  }

  if (slice.loadBit()) {
    const messageSize = loadStorageUsedShort(slice);
    const requestedForwardFees = slice.loadCoins();
    return {
      kind: TransactionBouncePhaseKind.NO_FUNDS,
      messageSize,
      requestedForwardFees,
    };
  }

  return {
    kind: TransactionBouncePhaseKind.NEGATIVE_FUNDS,
  };
}
