import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';

export const getState = (bufferWriter: BufferWriter, blockId: BlockIdExt) => {
  bufferWriter.writeInt32LE(
    crc32('liteServer.getState id:tonNode.blockIdExt = liteServer.BlockState'),
  );

  blockIdExt.write(bufferWriter, blockId);
};
