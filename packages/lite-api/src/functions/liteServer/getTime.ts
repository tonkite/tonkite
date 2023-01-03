import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export const getTime = (bufferWriter: BufferWriter) => {
  bufferWriter.writeInt32LE(crc32('liteServer.getTime = liteServer.CurrentTime'));
};
