import { BufferWriter } from '../../buffer';

export interface BlockId {
  workchain: number;
  shard: bigint;
  seqno: number;
}

export const blockId = {
  write: (bufferWriter: BufferWriter, blockId: BlockId) => {
    bufferWriter.writeInt32LE(blockId.workchain);
    bufferWriter.writeUint64LE(blockId.shard);
    bufferWriter.writeUInt32LE(blockId.seqno);
  },
};
