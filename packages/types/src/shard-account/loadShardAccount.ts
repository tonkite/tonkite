import { ShardAccount } from './ShardAccount';
import { BOC, Builder, Slice } from 'ton3-core';
import { loadAccount } from '../account';

/**
 * account_descr$_ account:^Account last_trans_hash:bits256
 *   last_trans_lt:uint64 = ShardAccount;
 */

export function loadShardAccount(slice: Slice): ShardAccount {
  const account = loadAccount(Slice.parse(slice.loadRef()))!;
  const lastTransactionHash = slice.loadBytes(256);
  const lastTransactionLt = slice.loadBigUint(64);

  return {
    account,
    lastTransactionId: {
      hash: lastTransactionHash,
      lt: lastTransactionLt,
    },
  };
}
