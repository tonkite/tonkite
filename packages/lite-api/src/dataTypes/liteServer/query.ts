import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export const query = {
  tag: crc32('liteServer.query data:bytes = Object'),
  write: (bufferWriter: BufferWriter, data: Buffer) => {
    bufferWriter.writeUInt32LE(query.tag);

    // TODO: Change it.
    bufferWriter.writeBytes(data);
  },
};
