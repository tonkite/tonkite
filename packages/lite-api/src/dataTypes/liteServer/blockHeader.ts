import { tonNode } from '..';
import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, ZeroStateIdExt } from '../tonNode';

export interface BlockHeader {
  id: BlockIdExt;
  mode: number;
  header_proof: Uint8Array;
}

export const blockHeader = {
  tag: crc32(
    'liteServer.blockHeader id:tonNode.blockIdExt mode:# header_proof:bytes = liteServer.BlockHeader',
  ),
  read: (bufferReader: BufferReader): BlockHeader => {
    const id = tonNode.blockIdExt.read(bufferReader);
    const mode = bufferReader.readUint32LE();
    const header_proof = bufferReader.readBytes();

    return {
      id,
      mode,
      header_proof,
    };
  },
};
