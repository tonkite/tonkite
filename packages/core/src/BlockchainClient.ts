import { Address } from 'ton3-core';
import { Account, AccountTransactionId } from './account';
import { BlockId } from './block';
import { Transaction, TransactionId } from './transaction';
import { Message } from './message';

export interface BlockchainClient {
  /* Blocks */

  getMasterchainInfo(): Promise<BlockId>;

  getAllShardsInfo(blockId: BlockId): Promise<BlockId[]>;

  getBlockTransactions(blockId: BlockId): Promise<TransactionId[]>;

  lookupBlock(blockId: Pick<BlockId, 'workchain' | 'shard' | 'seqno'>): Promise<BlockId>;

  /* Accounts */

  getAccountState(account: Address, blockId: BlockId): Promise<Account>;

  getTransactions(
    account: Address,
    after: AccountTransactionId,
    take: number,
  ): AsyncIterable<Transaction>;

  /* Others */

  invokeGetMethod<R extends any[]>(account: Account, method: string, stack: any[]): Promise<R>;

  sendMessage(message: Message): Promise<void>;
}
