import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';

export const getAllShardsInfo = (bufferWriter: BufferWriter, blockId: BlockIdExt) => {
  bufferWriter.writeInt32LE(
    crc32('liteServer.getAllShardsInfo id:tonNode.blockIdExt = liteServer.AllShardsInfo'),
  );

  blockIdExt.write(bufferWriter, blockId);
};
