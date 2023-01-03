import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';
import { transactionId3, TransactionId3 } from '../../dataTypes/liteServer';

const tag = crc32(
  'liteServer.listBlockTransactions id:tonNode.blockIdExt mode:# count:# after:mode.7?liteServer.transactionId3 reverse_order:mode.6?true want_proof:mode.5?true = liteServer.BlockTransactions',
);

export const listBlockTransactions = (
  bufferWriter: BufferWriter,
  blockId: BlockIdExt,
  count: number,
  after: TransactionId3 | null,
  reverseOrder: boolean,
  wantProof: boolean,
) => {
  let mode = 1 | (1 << 1) | (1 << 2); // includeAccount | includeLT | includeHash

  mode |= wantProof ? 1 << 5 : 0;
  mode |= reverseOrder ? 1 << 6 : 0;
  mode |= after ? 1 << 7 : 0;

  bufferWriter.writeInt32LE(tag);

  blockIdExt.write(bufferWriter, blockId);
  bufferWriter.writeUInt32LE(mode);
  bufferWriter.writeUInt32LE(count);

  if (after) {
    transactionId3.write(bufferWriter, after);
  }
};
