import { TransactionComputePhaseTag } from '../TransactionComputePhaseTag';
import { Coins } from 'ton3-core';

export interface TransactionComputePhaseVM {
  type: 'vm';
  success: boolean;
  messageStateUsed: boolean;
  accountActivated: boolean;
  gasFees: Coins;
  gasUsed: number;
  gasLimit: number;
  gasCredit: number | null;
  mode: number;
  exitCode: number;
  exitArg: number | null;
  vmSteps: number | null;
  vmInitStateHash: Uint8Array;
  vmFinalStateHash: Uint8Array;
}
