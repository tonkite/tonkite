import { Address, Cell, Contract, ContractProvider } from '@ton/core';
import { HighloadWalletV3QueryIdSequence } from './highload-wallet-v3-query-id-sequence';

export class HighloadWalletV3Reader implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  async getPublicKey(provider: ContractProvider) {
    const { stack } = await provider.get('get_public_key', []);
    const publicKeyHex = stack.readBigNumber().toString(16).padStart(64, '0');
    return Buffer.from(publicKeyHex, 'hex');
  }

  async getSubwalletId(provider: ContractProvider) {
    const { stack } = await provider.get('get_subwallet_id', []);
    return stack.readNumber();
  }

  async getTimeout(provider: ContractProvider) {
    const { stack } = await provider.get('get_timeout', []);
    return stack.readNumber();
  }

  async getLastCleaned(provider: ContractProvider) {
    const { stack } = await provider.get('get_last_clean_time', []);
    return stack.readNumber();
  }

  async getProcessed(
    provider: ContractProvider,
    queryId: HighloadWalletV3QueryIdSequence,
    needClean = true,
  ) {
    const { stack } = await provider.get('processed?', [
      { type: 'int', value: BigInt(queryId.current()) },
      {
        type: 'int',
        value: needClean ? -1n : 0n,
      },
    ]);

    return stack.readBoolean();
  }
}
