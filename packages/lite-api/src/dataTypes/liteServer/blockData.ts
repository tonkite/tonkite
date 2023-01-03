import { tonNode } from '..';
import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, ZeroStateIdExt } from '../tonNode';

export interface BlockData {
  id: BlockIdExt;
  data: Uint8Array;
}

export const blockData = {
  tag: crc32('liteServer.blockData id:tonNode.blockIdExt data:bytes = liteServer.BlockData'),
  read: (bufferReader: BufferReader): BlockData => {
    const id = tonNode.blockIdExt.read(bufferReader);
    const data = bufferReader.readBytes();

    return {
      id,
      data,
    };
  },
};
