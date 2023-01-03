import { BufferReader, BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export interface BlockIdExt {
  workchain: number;
  shard: bigint;
  seqno: number;
  root_hash: Uint8Array;
  file_hash: Uint8Array;
}

export const blockIdExt = {
  tag: crc32(
    'tonNode.blockIdExt workchain:int shard:long seqno:int root_hash:int256 file_hash:int256 = tonNode.BlockIdExt',
  ),

  read: (dataReader: BufferReader): BlockIdExt => {
    const workchain = dataReader.readInt32LE();
    const shard = dataReader.readUint64LE();
    const seqno = dataReader.readInt32LE();
    const root_hash = dataReader.readBuffer(32);
    const file_hash = dataReader.readBuffer(32);

    return {
      workchain,
      shard,
      seqno,
      root_hash,
      file_hash,
    };
  },

  write: (bufferWriter: BufferWriter, blockId: BlockIdExt) => {
    bufferWriter.writeInt32LE(blockId.workchain);
    bufferWriter.writeUint64LE(blockId.shard);
    bufferWriter.writeUInt32LE(blockId.seqno);
    bufferWriter.writeBuffer(blockId.root_hash);
    bufferWriter.writeBuffer(blockId.file_hash);
  },
};
