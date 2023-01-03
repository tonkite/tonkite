import { tonNode } from '..';
import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, ZeroStateIdExt } from '../tonNode';

export interface MasterchainInfo {
  last: BlockIdExt;
  state_root_hash: Uint8Array;
  init: ZeroStateIdExt;
}

export const masterchainInfo = {
  tag: crc32(
    'liteServer.masterchainInfo last:tonNode.blockIdExt state_root_hash:int256 init:tonNode.zeroStateIdExt = liteServer.MasterchainInfo',
  ),
  read: (bufferReader: BufferReader) => {
    const last = tonNode.blockIdExt.read(bufferReader);
    const state_root_hash = bufferReader.readBuffer(32);
    const init = tonNode.zeroStateIdExt.read(bufferReader);

    return {
      last,
      state_root_hash,
      init,
    };
  },
};
