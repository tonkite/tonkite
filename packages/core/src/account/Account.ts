import { AccountStatus } from './AccountStatus';
import { StorageStats } from './storage/StorageStats';
import { FrozenAccount } from './states/FrozenAccount';
import { ActiveAccount } from './states/ActiveAccount';
import { UninitializedAccount } from './states/UninitializedAccount';
import { BlockId } from '../block';
import { AccountTransactionId } from './AccountTransactionId';
import { Address, Cell, Coins } from 'ton3-core';

export class Account {
  constructor(
    readonly blockId: BlockId,
    readonly address: Address,
    readonly balance: Coins,
    readonly lastTransaction: AccountTransactionId,
    readonly status: AccountStatus,
    readonly frozenHash: Uint8Array | null,
    readonly code: Cell | null,
    readonly data: Cell | null,
    readonly storage: StorageStats,
  ) {}

  isFrozen(): this is FrozenAccount {
    return this.status === AccountStatus.FROZEN;
  }

  isActive(): this is ActiveAccount {
    return this.status === AccountStatus.ACTIVE;
  }

  isUninitialized(): this is UninitializedAccount {
    return this.status === AccountStatus.UNINITIALIZED;
  }
}
