import { Slice } from 'ton3-core';
import { TransactionComputePhase } from './TransactionComputePhase';
import { TransactionComputePhaseTag } from './TransactionComputePhaseTag';
import { loadTransactionComputePhaseSkipped } from './skipped';
import { loadTransactionComputePhaseVM } from './vm';

export function loadTransactionComputePhase(slice: Slice): TransactionComputePhase {
  const tag = slice.loadBit();

  switch (tag) {
    case TransactionComputePhaseTag.SKIPPED:
      return loadTransactionComputePhaseSkipped(slice);

    case TransactionComputePhaseTag.VM:
      return loadTransactionComputePhaseVM(slice);

    default:
      // NOTE: Unreachable section but a transpiler doesn't understand it.
      throw new Error('Unsupported kind of Compute Phase');
  }
}
