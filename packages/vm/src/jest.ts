import { Transaction, TransactionComputePhaseSkipReason } from '@tonkite/types';

declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      toSkipComputePhase: T extends Transaction
        ? (reason?: TransactionComputePhaseSkipReason) => R
        : never;
      toHaveExitCode: T extends Transaction ? (exitCode: number) => R : never;
    }
  }
}

export function toSkipComputePhase(
  this: jest.MatcherContext,
  transaction: Transaction,
  reason?: TransactionComputePhaseSkipReason,
) {
  return {
    pass:
      (transaction.description.type === 'ordinary' ||
        transaction.description.type === 'tick-tock') &&
      transaction.description.compute.type === 'skipped' &&
      (!reason || transaction.description.compute.reason === reason),
    message: () => {
      return reason
        ? `Received transaction is ${this.isNot ? '' : 'not '}skipped because of "${reason}".`
        : `Received transaction is ${this.isNot ? '' : 'not '}skipped.`;
    },
  };
}

export function toHaveExitCode(
  this: jest.MatcherContext,
  transaction: Transaction,
  exitCode: number,
) {
  return {
    pass:
      (transaction.description.type === 'ordinary' ||
        transaction.description.type === 'tick-tock') &&
      transaction.description.compute.type === 'vm' &&
      transaction.description.compute.exitCode === exitCode,
    message: () =>
      `Received transaction does ${this.isNot ? '' : 'not '}have exit code "${exitCode}".`,
  };
}

export const matchers = {
  toSkipComputePhase,
  toHaveExitCode,
};
