import { crc32 } from '../../utils';
import { BufferReader } from '../../buffer';
import { BlockIdExt, blockIdExt } from '../tonNode';

export interface AccountState {
  id: BlockIdExt;
  shardblk: BlockIdExt;
  shard_proof: Uint8Array;
  proof: Uint8Array;

  /**
   * Serialized BoC with Account.
   */
  state: Uint8Array;
}

export const accountState = {
  tag: crc32(
    'liteServer.accountState id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:bytes proof:bytes state:bytes = liteServer.AccountState',
  ),
  read: (bufferReader: BufferReader): AccountState => {
    const id = blockIdExt.read(bufferReader);
    const shardblk = blockIdExt.read(bufferReader);
    const shard_proof = bufferReader.readBytes();
    const proof = bufferReader.readBytes();
    const state = bufferReader.readBytes();

    return {
      id,
      shardblk,
      shard_proof,
      proof,
      state,
    };
  },
};
