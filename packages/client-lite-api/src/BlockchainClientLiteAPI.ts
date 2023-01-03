import {
  Account,
  AccountStatus,
  AccountTransactionId,
  BlockchainClient,
  BlockId,
  Message,
  Transaction,
  TransactionId,
} from '@tonkite/core';
import { Address, BOC, Coins, Hashmap, Slice, Utils } from 'ton3-core';
import { LiteClient } from '@tonkite/lite-api/dist/LiteClient';
import {
  loadAccount,
  loadCurrencyCollection,
  loadShardAccount,
  loadShardHashes,
  loadTransaction,
  ShardAccount,
} from '@tonkite/types';

export class TransactionCursor implements AsyncIterable<Transaction> {
  static readonly CHUNK_SIZE = 30;

  constructor(
    private readonly liteClient: LiteClient,
    private readonly account: Address,
    private readonly offset: AccountTransactionId,
    private readonly take: number,
  ) {}

  async *[Symbol.asyncIterator](): AsyncIterator<Transaction> {
    let taken = 0;
    let last: AccountTransactionId | null = null;
    let complete = false;

    let result;

    do {
      result = await this.liteClient.getTransactions(
        {
          workchain: this.account.workchain,
          id: this.account.hash,
        },
        last?.lt ?? this.offset.lt,
        last?.hash ?? this.offset.hash,
        TransactionCursor.CHUNK_SIZE,
      );

      const cells = BOC.from(result.transactions);

      for (let cellIndex in cells) {
        const block = result.ids[cellIndex];
        const transaction = loadTransaction(Slice.parse(cells[cellIndex]));

        yield {
          block,
          transaction,
        };

        last = transaction.id;
        taken += 1;

        if (transaction.previousTransaction.lt === 0n) {
          // NOTE: The first transaction is reached.
          complete = true;
          break;
        }
      }

      complete ||= taken >= this.take;
    } while (!complete);
  }
}

export class BlockchainClientLiteAPI implements BlockchainClient {
  constructor(private readonly liteClient: LiteClient) {}

  async getLatestBlock(): Promise<BlockId> {
    const masterchainInfo = await this.liteClient.getMasterchainInfo();
    return {
      workchain: masterchainInfo.last.workchain,
      shard: masterchainInfo.last.shard,
      seqno: masterchainInfo.last.seqno,
      rootHash: masterchainInfo.last.root_hash,
      fileHash: masterchainInfo.last.file_hash,
    };
  }

  async getShards(blockId: BlockId): Promise<BlockId[]> {
    const allShards = await this.liteClient.getAllShardsInfo({
      workchain: blockId.workchain,
      shard: blockId.shard,
      seqno: blockId.seqno,
      root_hash: blockId.rootHash,
      file_hash: blockId.fileHash,
    });

    const shardHashes = loadShardHashes(Slice.parse(BOC.fromStandard(allShards.data)));

    return shardHashes
      .map((workchain) =>
        workchain.shards.map(
          (shard): BlockId => ({
            workchain: workchain.workchain,
            shard: shard.id,
            seqno: shard.description.seq_no,
            rootHash: shard.description.root_hash,
            fileHash: shard.description.file_hash,
          }),
        ),
      )
      .flat();
  }

  async getAccountState(account: Address, blockId: BlockId): Promise<Account> {
    const accountStateRaw = await this.liteClient.getAccountState(
      {
        workchain: blockId.workchain,
        shard: blockId.shard,
        seqno: blockId.seqno,
        root_hash: blockId.rootHash,
        file_hash: blockId.fileHash,
      },
      {
        workchain: account.workchain,
        id: account.hash,
      },
    );

    if (!accountStateRaw.state.length) {
      return new Account(
        {
          workchain: accountStateRaw.id.workchain,
          shard: accountStateRaw.id.shard,
          seqno: accountStateRaw.id.seqno,
          rootHash: accountStateRaw.id.root_hash,
          fileHash: accountStateRaw.id.file_hash,
        },
        account,
        Coins.fromNano(0),
        {
          lt: 0n,
          hash: new Uint8Array(32),
        },
        AccountStatus.UNINITIALIZED,
        null,
        null,
        null,
        {
          lastPaid: null,
          duePayment: null,
          usage: {
            bits: 0,
            cells: 0,
            publicCells: 0,
          },
        },
      );
    }

    const proof = BOC.from(accountStateRaw.proof);

    /**
     * shard_ident$00 shard_pfx_bits:(#<= 60)
     *   workchain_id:int32 shard_prefix:uint64 = ShardIdent;
     */
    const loadShardIdent = (slice: Slice) => {
      if (slice.loadUint(2) !== 0b00) {
        throw new Error('Incorrect ShardIdent');
      }

      const shardPrefixBits = slice.loadBigUint(6); // NOTE: log2(60 + 1) = 5.93
      const workchainId = slice.loadInt(32);
      const shardPrefix = slice.loadBigUint(64);

      return {
        shardPrefixBits,
        workchainId,
        shardPrefix,
      };
    };

    const loadDepthBalanceInfo = (slice: Slice) => {
      const splitDepth = slice.loadUint(5); // log2(30 + 1) = 4.95
      const balance = loadCurrencyCollection(slice);

      return {
        splitDepth,
        balance,
      };
    };

    /**
     * depth_balance$_ split_depth:(#<= 30) balance:CurrencyCollection = DepthBalanceInfo;
     * _ (HashmapAugE 256 ShardAccount DepthBalanceInfo) = ShardAccounts;
     */
    const loadShardAccounts = (slice: Slice): [Uint8Array, { shardAccount: ShardAccount }][] => {
      return [
        ...Hashmap.parse<Uint8Array, { shardAccount: ShardAccount }>(
          256,
          Slice.parse(slice.refs[0]),
          {
            deserializers: {
              key: Utils.Helpers.bitsToBytes,
              value: (cell) => {
                const cs = Slice.parse(cell);

                const depthBalanceInfo = loadDepthBalanceInfo(cs);
                const shardAccount = loadShardAccount(cs);

                return {
                  shardAccount,
                  depthBalanceInfo,
                };
              },
            },
          },
        ),
      ];
    };

    /**
     * shard_state#9023afe2 global_id:int32
     *   shard_id:ShardIdent
     *   seq_no:uint32 vert_seq_no:#
     *   gen_utime:uint32 gen_lt:uint64
     *   min_ref_mc_seqno:uint32
     *   out_msg_queue_info:^OutMsgQueueInfo
     *   before_split:(## 1)
     *   accounts:^ShardAccounts
     *   ^[ overload_history:uint64 underload_history:uint64
     *   total_balance:CurrencyCollection
     *   total_validator_fees:CurrencyCollection
     *   libraries:(HashmapE 256 LibDescr)
     *   master_ref:(Maybe BlkMasterInfo) ]
     *   custom:(Maybe ^McStateExtra)
     *   = ShardStateUnsplit;
     */
    const loadShardStateUnsplit = (slice: Slice) => {
      if (slice.loadUint(32) !== 0x9023afe2) {
        throw new Error('Incorrect ShardStateUnsplit');
      }

      const global_id = slice.loadInt(32);
      const shard_id = loadShardIdent(slice);
      const seq_no = slice.loadUint(32);
      const vert_seq_no = slice.loadUint(32);
      const gen_utime = slice.loadUint(32);
      const gen_lt = slice.loadBigUint(64);
      const min_ref_mc_seqno = slice.loadUint(32);
      const out_msg_queue_info = slice.loadRef(); // ^OutMsgQueueInfo
      const before_split = slice.loadBit();
      const shardAccounts = loadShardAccounts(Slice.parse(slice.loadRef()));

      const next = Slice.parse(slice.loadRef());

      const overload_history = next.loadBigUint(64);
      const underload_history = next.loadBigUint(64);
      // const total_balance = loadCurrencyCollection(next);
      // const total_validator_fees = loadCurrencyCollection(next);

      return {
        global_id,
        shard_id,
        seq_no,
        vert_seq_no,
        gen_utime,
        gen_lt,
        min_ref_mc_seqno,
        out_msg_queue_info,
        before_split,
        shardAccounts,
        overload_history,
        underload_history,
        // total_balance,
        // total_validator_fees,
      };
    };

    const shardState = loadShardStateUnsplit(Slice.parse(proof[1].refs[0]));
    const accountState = loadAccount(Slice.parse(BOC.fromStandard(accountStateRaw.state)))!;

    const shardAccount = shardState.shardAccounts
      .filter(([accountHash]) => {
        return Buffer.from(accountHash).equals(Buffer.from(account.hash, 0));
      })
      .map(([_, { shardAccount }]) => shardAccount)[0];

    return new Account(
      {
        workchain: accountStateRaw.id.workchain,
        shard: accountStateRaw.id.shard,
        seqno: accountStateRaw.id.seqno,
        rootHash: accountStateRaw.id.root_hash,
        fileHash: accountStateRaw.id.file_hash,
      },
      account,
      accountState.storage.balance.coins,
      {
        lt: shardAccount.lastTransactionId.lt,
        hash: shardAccount.lastTransactionId.hash,
      },
      accountState.storage.state.type as AccountStatus,
      accountState.storage.state.type === 'frozen' ? accountState.storage.state.stateHash : null,
      accountState.storage.state.type === 'active' ? accountState.storage.state.code : null,
      accountState.storage.state.type === 'active' ? accountState.storage.state.data : null,
      {
        lastPaid: new Date(accountState.storageStat.lastPaid * 1000),
        duePayment: accountState.storageStat.duePayment,
        usage: {
          bits: accountState.storageStat.used.bits,
          cells: accountState.storageStat.used.cells,
          publicCells: accountState.storageStat.used.publicCells,
        },
      },
    );
  }

  async getBlockTransactions(
    blockId: BlockId,
    after: Pick<TransactionId, 'account' | 'lt'> | null = null,
  ): Promise<TransactionId[]> {
    const result = await this.liteClient.listBlockTransactions(
      {
        workchain: blockId.workchain,
        shard: blockId.shard,
        seqno: blockId.seqno,
        root_hash: blockId.rootHash,
        file_hash: blockId.fileHash,
      },
      40,
      after
        ? {
            account: after.account.hash,
            lt: after.lt,
          }
        : null,
    );

    return result.ids.map((id) => ({
      account: new Address(`${result.id.workchain}:${Utils.Helpers.bytesToHex(id.account!)}`),
      lt: id.lt!,
      hash: id.hash!,
    }));
  }

  getTransactions(
    account: Address,
    after: AccountTransactionId,
    take: number = Infinity,
  ): AsyncIterable<Transaction> {
    return new TransactionCursor(this.liteClient, account, after, take);
  }

  async invokeGetMethod<R extends any[]>(
    account: Account,
    method: string,
    stack: any[],
  ): Promise<R> {
    // TODO: Use `liteServer.runSmcMethod`.
    return [] as any;
  }

  async sendMessage(message: Message): Promise<void> {
    // TODO: Use `liteServer.sendMessage`.
  }
}
