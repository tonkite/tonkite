import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';

export const getBlock = (bufferWriter: BufferWriter, blockId: BlockIdExt) => {
  bufferWriter.writeInt32LE(
    crc32('liteServer.getBlock id:tonNode.blockIdExt = liteServer.BlockData'),
  );

  blockIdExt.write(bufferWriter, blockId);
};
