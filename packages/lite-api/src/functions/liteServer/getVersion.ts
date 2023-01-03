import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export const getVersion = (bufferWriter: BufferWriter) => {
  bufferWriter.writeInt32LE(crc32('liteServer.getVersion = liteServer.Version'));
};
