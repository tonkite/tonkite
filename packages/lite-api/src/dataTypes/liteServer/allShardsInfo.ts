import { crc32 } from '../../utils';
import { BufferReader } from '../../buffer';
import { BlockIdExt, blockIdExt } from '../tonNode';

export interface AllShardsInfo {
  id: BlockIdExt;
  proof: Uint8Array;

  /**
   * Contains serialized BoC with ShardHashes.
   */
  data: Uint8Array;
}

export const allShardsInfo = {
  tag: crc32(
    'liteServer.allShardsInfo id:tonNode.blockIdExt proof:bytes data:bytes = liteServer.AllShardsInfo',
  ),
  read: (bufferReader: BufferReader): AllShardsInfo => {
    const id = blockIdExt.read(bufferReader);
    const proof = bufferReader.readBytes();
    const data = bufferReader.readBytes();

    return {
      id,
      proof,
      data,
    };
  },
};
