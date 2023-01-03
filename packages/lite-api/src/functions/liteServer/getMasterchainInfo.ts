import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export const getMasterchainInfo = (bufferWriter: BufferWriter) => {
  bufferWriter.writeInt32LE(crc32('liteServer.getMasterchainInfo = liteServer.MasterchainInfo'));
};
