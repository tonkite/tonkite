import { BufferReader } from '../../buffer';
import { crc32 } from '../../utils';

export const answerMessage = {
  tag: crc32('adnl.message.answer query_id:int256 answer:bytes = adnl.Message'),
  read: (dataReader: BufferReader) => {
    if (dataReader.readUint32LE() !== answerMessage.tag) {
      throw new Error('Malformed ADNL message answer.');
    }

    const queryId = dataReader.readBuffer(32);
    const answer = dataReader.readBytes();

    return {
      queryId,
      answer: new BufferReader(answer),
    };
  },
};
