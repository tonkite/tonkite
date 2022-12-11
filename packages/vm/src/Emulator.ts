import { BOC, Cell, Coins, Utils } from 'ton3-core';
import { parseShardAccount, parseTransaction } from '@tonkite/types';
import {
  emulateTransaction,
  runGetMethod,
  RunGetMethodParams,
} from './internal/emulateTransaction';
import { EmulatorVerbosityLevel } from './EmulatorVerbosityLevel';
import { Stack, StackValue } from './internal/Stack';
import { parseOutList } from './internal/parseActions';

export class EmulatorError extends Error {
  constructor(message: string, readonly logs?: string) {
    super(message);
    this.name = 'EmulatorError';
  }
}

export type RunGetMethodExtraParams = Partial<
  Pick<RunGetMethodParams, 'balance' | 'gasLimit' | 'now' | 'randomSeed'>
>;

export interface RunGetMethodResult<S> {
  stack: S;
  gasUsed: number;
  exitCode: number;
  log: string;
  missingLibrary: Uint8Array | null;
}

export class Emulator {
  constructor(
    readonly config: Cell,
    readonly libraries: Cell | null,
    readonly verbosity: EmulatorVerbosityLevel = EmulatorVerbosityLevel.INFO,
  ) {}

  async emulateTransaction(shardAccount: Cell, message: Cell) {
    const { output, logs, ...rest } = await emulateTransaction(
      this.config,
      this.libraries,
      this.verbosity,
      shardAccount,
      message,
    );

    if (!output.success) {
      throw new EmulatorError(output.error, logs);
    }

    return {
      transaction: parseTransaction(BOC.fromStandard(output.transaction)),
      shardAccount: parseShardAccount(BOC.fromStandard(output.shard_account)),
      actions: output.actions ? parseOutList(BOC.fromStandard(output.actions)) : [],
      vmLog: output.vm_log,
      logs,
    };
  }

  async runGetMethodExtended<S extends StackValue[] = StackValue[]>(
    shardAccount: Cell,
    method: string | number,
    stack: StackValue[] = [],
    extra: RunGetMethodExtraParams = {},
  ): Promise<RunGetMethodResult<S>> {
    const { account } = parseShardAccount(shardAccount);

    if (account.storage.state.type !== 'active') {
      throw new EmulatorError('Get-method can be run only against active accounts.');
    }

    if (!account.storage.state.code || !account.storage.state.data) {
      throw new EmulatorError(
        'Get-method can be run only against accounts with both code and data.',
      );
    }

    const { output, logs } = await runGetMethod(
      this.config,
      account.storage.state.code,
      account.storage.state.data,
      null, // TODO: Merge with account.storage.state.libraries?
      method,
      Stack.serialize(stack),
      {
        address: account.address,
        verbosity: this.verbosity,
        ...extra,
      },
    );

    if (!output.success) {
      throw new EmulatorError(output.error, logs);
    }

    return {
      stack: Stack.deserialize<S>(BOC.fromStandard(output.stack)),
      gasUsed: Number(output.gas_used),
      exitCode: output.vm_exit_code,
      log: output.vm_log,
      missingLibrary: output.missing_library
        ? Utils.Helpers.hexToBytes(output.missing_library)
        : null,
    };
  }

  async runGetMethod<S extends StackValue[] = StackValue[]>(
    shardAccount: Cell,
    method: string | number,
    stack: StackValue[] = [],
    extra: RunGetMethodExtraParams = {},
  ): Promise<S> {
    const result = await this.runGetMethodExtended<S>(shardAccount, method, stack, extra);
    return result.stack;
  }
}
