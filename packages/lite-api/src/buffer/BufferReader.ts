import { TLBoolean } from './TLBoolean';
import { transactionId } from '../dataTypes/liteServer';

export class BufferReader {
  private offset: number = 0;

  constructor(private readonly buffer: Buffer) {}

  readInt32LE(): number {
    const value = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  readUint64LE(): bigint {
    return BigInt(this.readUint32LE()) | (BigInt(this.readUint32LE()) << 32n);
  }

  readInt64LE(): bigint {
    const value = this.readUint64LE();
    const sign = 1n << 63n;

    return value >= sign ? value - sign * 2n : value;
  }

  readUint32LE(): number {
    const value = this.buffer.readUint32LE(this.offset);
    this.offset += 4;
    return value;
  }

  readUint8(): number {
    const value = this.buffer.readUint8(this.offset);
    this.offset += 1;
    return value;
  }

  readBuffer(length: number): Buffer {
    const value = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  readBytes(): Buffer {
    let length = this.readUint8();
    let lengthSize = 1;

    if (length === 0xfe) {
      length = this.buffer.readUintLE(this.offset, 3);
      this.offset += 3;
      lengthSize += 3;
    }

    const buffer = this.readBuffer(length);

    // Padding
    this.offset += 4 - ((lengthSize + length) % 4);

    return buffer;
  }

  readBool() {
    switch (this.readUint32LE()) {
      case TLBoolean.TRUE:
        return true;
      case TLBoolean.FALSE:
        return false;
      default:
        throw new Error('Cannot parse boolean - unexpected value reached.');
    }
  }

  readVector<T>(reader: (bufferReader: BufferReader) => T): T[] {
    const length = this.readUint32LE();
    const result = [];

    for (let index = 0; index < length; index += 1) {
      result.push(reader(this));
    }

    return result;
  }

  slice(length: number): BufferReader {
    return new BufferReader(this.readBuffer(length));
  }

  get position() {
    return this.offset;
  }

  get tail(): Buffer {
    return this.buffer.subarray(this.offset);
  }
}
