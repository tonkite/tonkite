import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';

export interface SendMsgStatus {
  status: number;
}

export const sendMsgStatus = {
  tag: crc32('liteServer.sendMsgStatus status:int = liteServer.SendMsgStatus'),
  read: (dataReader: BufferReader): SendMsgStatus => {
    const status = dataReader.readUint32LE();

    return {
      status,
    };
  },
};
