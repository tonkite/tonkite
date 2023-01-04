import { BlockchainClient, BlockId } from '@tonkite/core';
import { Address, Utils } from 'ton3-core';
import { groupBy } from 'lodash';
import PRetry, { AbortError } from 'p-retry';
import PQueue from 'p-queue';

export const getBlockKey = (blockId: BlockId) =>
  `(${blockId.workchain},${blockId.shard.toString(16)})`;

export class BlockTracker {
  private readonly shardsCursors = new Map<string, number>();

  constructor(private readonly blockchainClient: BlockchainClient) {}

  importTransactionsQueue = new PQueue({ concurrency: 1 });

  async importBlockTransactions(workchain: number, shard: bigint, seqno: number) {
    const blockId = await this.blockchainClient.lookupBlock({
      workchain,
      shard,
      seqno,
    });

    await this.importTransactionsQueue.add(() =>
      PRetry(
        async () => {
          console.log(
            '@importBlock',
            `(${blockId.workchain.toString(10).padStart(2, ' ')},${blockId.shard.toString(16)},${
              blockId.seqno
            })`,
          );

          // NOTE: It may throw "block is not applied".
          const transactions = groupBy(
            await this.blockchainClient.getBlockTransactions(blockId),
            (transaction) => transaction.account.toString('raw'),
          );

          console.log(
            '@importBlock',
            `(${blockId.workchain},${blockId.shard.toString(16)},${blockId.seqno})`,
          );

          Object.entries(transactions).map(([account, transactions]) => {
            console.log(`Account ${new Address(account).toString('base64')}:`);
            transactions.forEach((transaction) =>
              console.log(
                ' *',
                transaction.lt.toString(),
                Utils.Helpers.bytesToHex(transaction.hash),
              ),
            );
          });
        },
        {
          retries: 5,
          onFailedAttempt(error) {
            if (error.attemptNumber === 5 && error.message.includes('block is not applied')) {
              throw new AbortError(error);
            }

            console.error('@onFailedAttempt', error);
          },
        },
      ),
    );
  }

  async importMasterchainBlock(masterBlock: BlockId) {
    const masterBlockKey = getBlockKey(masterBlock);

    // Import masterchain block.
    await this.importBlockTransactions(masterBlock.workchain, masterBlock.shard, masterBlock.seqno);

    let cleanupNeeded = false;

    const shards = await this.blockchainClient.getAllShardsInfo(masterBlock);

    for (const shard of shards) {
      const shardBlockKey = getBlockKey(shard);
      const previousSeqno = this.shardsCursors.get(shardBlockKey);

      // Import workchain blocks.
      if (previousSeqno) {
        for (let seqno = previousSeqno + 1; seqno <= shard.seqno; seqno++) {
          await this.importBlockTransactions(shard.workchain, shard.shard, seqno);
        }
      } else {
        // either after split/merge or first run
        await this.importBlockTransactions(shard.workchain, shard.shard, shard.seqno);
        cleanupNeeded = true;
      }

      this.shardsCursors.set(shardBlockKey, shard.seqno);
    }

    this.shardsCursors.set(masterBlockKey, masterBlock.seqno);

    if (cleanupNeeded) {
      const currentShardKeys = shards.map(
        (shard: BlockId) => `(${shard.workchain},${shard.shard.toString(16)})`,
      );

      // NOTE: After splitting/merging shards may disappear,
      // so we may stop tracking positions for these shards.
      this.shardsCursors.forEach((seqno, blockKey) => {
        if (!currentShardKeys.includes(blockKey) && blockKey !== masterBlockKey) {
          this.shardsCursors.delete(blockKey);
        }
      });
    }
  }

  async tick() {
    const masterBlock = await this.blockchainClient.getMasterchainInfo();
    const masterBlockKey = getBlockKey(masterBlock);

    const previousSeqno = this.shardsCursors.get(masterBlockKey);

    if (previousSeqno) {
      for (let seqno = previousSeqno + 1; seqno <= masterBlock.seqno; seqno += 1) {
        // NOTE: It doesn't work this way due to root/file hashes mismatch.
        await this.importMasterchainBlock({ ...masterBlock, seqno });
      }
    } else {
      await this.importMasterchainBlock(masterBlock);
    }
  }
}
