import {BufferReader} from '../../buffer';
import {crc32} from '../../utils';

export interface Version {
  version: number;
  capabilities: bigint;
  now: number;
}

export const version = {
  tag: crc32('liteServer.version mode:# version:int capabilities:long now:int = liteServer.Version'),
  read: (dataReader: BufferReader) => {
    const version = dataReader.readUint32LE();
    const capabilities = dataReader.readUint64LE();
    const now = dataReader.readUint32LE();

    return {
      version,
      capabilities,
      now,
    };
  },
};
