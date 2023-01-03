import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';

export const currentTime = {
  tag: crc32('liteServer.currentTime now:int = liteServer.CurrentTime'),
  read: (dataReader: BufferReader) => {
    const now = dataReader.readUint32LE();

    return new Date(now * 1000).toISOString();
  },
};
