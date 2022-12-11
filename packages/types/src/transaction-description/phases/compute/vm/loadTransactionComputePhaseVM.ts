import { TransactionComputePhaseVM } from './TransactionComputePhaseVM';
import { Slice } from 'ton3-core';

/**
 * tr_phase_compute_vm$1 success:Bool msg_state_used:Bool
 *   account_activated:Bool gas_fees:Grams
 *   ^[ gas_used:(VarUInteger 7)
 *   gas_limit:(VarUInteger 7) gas_credit:(Maybe (VarUInteger 3))
 *   mode:int8 exit_code:int32 exit_arg:(Maybe int32)
 *   vm_steps:uint32
 *   vm_init_state_hash:bits256 vm_final_state_hash:bits256 ]
 *   = TrComputePhase;
 */

export function loadTransactionComputePhaseVM(slice: Slice): TransactionComputePhaseVM {
  const success = !!slice.loadBit();
  const messageStateUsed = !!slice.loadBit();
  const accountActivated = !!slice.loadBit();
  const gasFees = slice.loadCoins();

  const next = Slice.parse(slice.loadRef());

  const gasUsed = next.loadVarUint(7);
  const gasLimit = next.loadVarUint(7);
  const gasCredit = next.loadBit() ? next.loadVarUint(3) : null;
  const mode = next.loadInt(8);
  const exitCode = next.loadInt(32);
  const exitArg = next.loadBit() ? next.loadInt(32) : null;
  const vmSteps = next.loadUint(32);
  const vmInitStateHash = next.loadBytes(256);
  const vmFinalStateHash = next.loadBytes(256);

  return {
    type: 'vm',
    success,
    messageStateUsed,
    accountActivated,
    gasFees,
    gasUsed,
    gasLimit,
    gasCredit,
    mode,
    exitCode,
    exitArg,
    vmSteps,
    vmInitStateHash,
    vmFinalStateHash,
  };
}
