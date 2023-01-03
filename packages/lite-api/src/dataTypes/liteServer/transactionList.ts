import { crc32 } from '../../utils';
import { BufferReader } from '../../buffer';
import { blockIdExt, BlockIdExt } from '../tonNode';

export interface TransactionList {
  ids: BlockIdExt[];
  transactions: Uint8Array;
}

export const transactionList = {
  tag: crc32(
    'liteServer.transactionList ids:(vector tonNode.blockIdExt) transactions:bytes = liteServer.TransactionList',
  ),
  read: (reader: BufferReader): TransactionList => {
    const ids = reader.readVector(blockIdExt.read);
    const transactions = reader.readBytes();

    return {
      ids,
      transactions,
    };
  },
};
