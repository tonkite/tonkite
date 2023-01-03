import { BufferReader } from '../../buffer';
import { BlockIdExt, blockIdExt } from '../tonNode';
import { crc32 } from '../../utils';
import { TransactionId, transactionId } from './transactionId';

export interface BlockTransactions {
  id: BlockIdExt;
  req_count: number;
  incomplete: boolean;
  ids: TransactionId[];
  proof: Uint8Array;
}

export const blockTransactions = {
  tag: crc32(
    'liteServer.blockTransactions id:tonNode.blockIdExt req_count:# incomplete:Bool ids:(vector liteServer.transactionId) proof:bytes = liteServer.BlockTransactions',
  ),
  read: (bufferReader: BufferReader): BlockTransactions => {
    const id = blockIdExt.read(bufferReader);
    const req_count = bufferReader.readUint32LE();
    const incomplete = bufferReader.readBool();

    const ids = bufferReader.readVector(transactionId.read);
    const proof = bufferReader.readBytes();

    return {
      id,
      req_count,
      incomplete,
      ids,
      proof,
    };
  },
};
