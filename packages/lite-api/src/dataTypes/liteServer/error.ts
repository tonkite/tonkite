import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';

export const error = {
  tag: crc32('liteServer.error code:int message:string = liteServer.Error'),
  read: (dataReader: BufferReader) => {
    const code = dataReader.readUint32LE();
    const message = dataReader.tail;

    return {
      code,
      message,
    };
  },
};
