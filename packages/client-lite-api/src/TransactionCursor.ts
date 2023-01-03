import { AccountTransactionId, Transaction } from '@tonkite/core';
import { LiteClient } from '@tonkite/lite-api';
import { Address, BOC, Slice } from 'ton3-core';
import { loadTransaction } from '@tonkite/types';

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
