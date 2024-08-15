/**
 * Copyright 2024 Scaleton Labs LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class HighloadWalletV3QueryIdSequence {
  static readonly BIT_NUMBER_SIZE = 10; // 10 bit
  static readonly BIT_NUMBER_MASK = 1023;
  static readonly SHIFT_SIZE = 13;
  static readonly MAX_BIT_NUMBER = 1022;
  static readonly MAX_SHIFT = 8191;

  constructor(
    private shift: number,
    private bitNumber: number,
  ) {
    if (shift < 0) {
      throw new Error('Parameter `shift` cannot be negative');
    }

    if (shift > HighloadWalletV3QueryIdSequence.MAX_SHIFT) {
      throw new Error('Parameter `shift` exceeded `MAX_SHIFT`');
    }

    if (bitNumber < 0) {
      throw new Error('Parameter `bitNumber` cannot be negative');
    }

    if (bitNumber > HighloadWalletV3QueryIdSequence.MAX_BIT_NUMBER) {
      throw new Error('Parameter `bitNumber` exceeded `MAX_BIT_NUMBER`');
    }
  }

  static emergency() {
    return new HighloadWalletV3QueryIdSequence(
      HighloadWalletV3QueryIdSequence.MAX_SHIFT,
      HighloadWalletV3QueryIdSequence.MAX_BIT_NUMBER,
    );
  }

  static restore(queryId: number): HighloadWalletV3QueryIdSequence {
    const shift = queryId >> HighloadWalletV3QueryIdSequence.BIT_NUMBER_SIZE;
    const bitNumber = queryId & HighloadWalletV3QueryIdSequence.BIT_NUMBER_MASK;

    return new HighloadWalletV3QueryIdSequence(shift, bitNumber);
  }

  current() {
    return (this.shift << HighloadWalletV3QueryIdSequence.BIT_NUMBER_SIZE) | this.bitNumber;
  }

  hasNext() {
    return (
      this.shift < HighloadWalletV3QueryIdSequence.MAX_SHIFT ||
      this.bitNumber < HighloadWalletV3QueryIdSequence.MAX_BIT_NUMBER - 1
    );
  }

  next() {
    let nextShift = this.shift;
    let nextBitNumber = this.bitNumber + 1;

    if (nextBitNumber > HighloadWalletV3QueryIdSequence.MAX_BIT_NUMBER) {
      nextShift += 1;
      nextBitNumber = 0;
    }

    this.shift = nextShift % HighloadWalletV3QueryIdSequence.MAX_SHIFT;
    this.bitNumber = nextBitNumber;

    return this.current();
  }
}
