import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { blockId, BlockId, BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';

export interface LookupBlockInput {
  id: BlockId;
  lt?: bigint;
  utime?: number;
}

export const lookupBlock = (bufferWriter: BufferWriter, input: LookupBlockInput) => {
  bufferWriter.writeInt32LE(
    crc32(
      'liteServer.lookupBlock mode:# id:tonNode.blockId lt:mode.1?long utime:mode.2?int = liteServer.BlockHeader',
    ),
  );

  bufferWriter.writeUInt32LE(1); // mode
  blockId.write(bufferWriter, input.id);

  // if (input.lt) {
  //   bufferWriter.writeInt64LE(input.lt);
  // }
  //
  // if (input.utime) {
  //   bufferWriter.writeInt32LE(input.utime);
  // }

  // blockIdExt.write(bufferWriter, blockId);
};
