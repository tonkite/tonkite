import { Builder } from 'ton3-core';
import { ShardAccount } from './ShardAccount';
import { storeAccount } from '../account';

export const storeShardAccount =
  (shardAccount: ShardAccount) =>
  (builder: Builder): Builder =>
    builder
      .storeRef(storeAccount(shardAccount.account)(new Builder()).cell()) // account:^Account
      .storeBytes(shardAccount.lastTransactionId.hash)
      .storeUint(shardAccount.lastTransactionId.lt, 64); // last_trans_lt:uint64;
