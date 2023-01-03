import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';

export const getBlockHeader = (bufferWriter: BufferWriter, blockId: BlockIdExt, mode: number) => {
  bufferWriter.writeInt32LE(
    crc32('liteServer.getBlockHeader id:tonNode.blockIdExt mode:# = liteServer.BlockHeader'),
  );

  blockIdExt.write(bufferWriter, blockId);
  bufferWriter.writeUInt32LE(mode);
};
