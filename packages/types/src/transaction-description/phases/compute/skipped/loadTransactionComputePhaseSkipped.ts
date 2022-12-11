import { TransactionComputePhaseSkipped } from './TransactionComputePhaseSkipped';
import { Slice } from 'ton3-core';
import { TransactionComputeSkipReasonTag } from './TransactionComputeSkipReasonTag';
import { TransactionComputePhaseSkipReason } from './TransactionComputePhaseSkipReason';

/**
 * cskip_no_state$00 = ComputeSkipReason;
 * cskip_bad_state$01 = ComputeSkipReason;
 * cskip_no_gas$10 = ComputeSkipReason;
 *
 * tr_phase_compute_skipped$0 reason:ComputeSkipReason
 *   = TrComputePhase;
 */

const reasons = {
  [TransactionComputeSkipReasonTag.NO_STATE]: 'no-state',
  [TransactionComputeSkipReasonTag.BAD_STATE]: 'bad-state',
  [TransactionComputeSkipReasonTag.NO_GAS]: 'no-gas',
};

export function loadTransactionComputePhaseSkipped(slice: Slice): TransactionComputePhaseSkipped {
  const reason = slice.loadUint(2) as TransactionComputeSkipReasonTag;

  return {
    type: 'skipped',
    reason: reasons[reason] as TransactionComputePhaseSkipReason,
  };
}
