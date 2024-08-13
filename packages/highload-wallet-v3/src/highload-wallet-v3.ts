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

import {
  beginCell,
  Cell,
  contractAddress,
  ContractProvider,
  internal,
  MessageRelaxed,
  OutActionSendMsg,
  SendMode,
  storeMessageRelaxed,
} from '@ton/core';
import { sign } from '@ton/crypto';
import { HighloadWalletV3QueryIdSequence } from './highload-wallet-v3-query-id-sequence';
import { HIGHLOAD_WALLET_V3_CODE_HEX } from './highload-wallet-v3-code';
import { InternalMessage } from './messages/internal-message';
import { HighloadWalletV3Reader } from './highload-wallet-v3-reader';

const TIMESTAMP_SIZE = 64;
const TIMEOUT_SIZE = 22;

export function highloadWalletV3ConfigToCell({
  publicKey,
  subwalletId,
  timeout,
}: {
  publicKey: Buffer;
  subwalletId: number;
  timeout: number;
}): Cell {
  return beginCell()
    .storeBuffer(publicKey)
    .storeUint(subwalletId, 32)
    .storeDict(null) // old queries
    .storeDict(null) // queries
    .storeUint(0, TIMESTAMP_SIZE)
    .storeUint(timeout, TIMEOUT_SIZE)
    .endCell();
}

export class HighloadWalletV3 extends HighloadWalletV3Reader {
  static readonly DEFAULT_SUBWALLET_ID = 0x10ad;
  static readonly DEFAULT_TIMEOUT = 60 * 60 * 24; // 24 hours

  constructor(
    readonly sequence: HighloadWalletV3QueryIdSequence,
    readonly publicKey: Buffer,
    readonly timeout: number = HighloadWalletV3.DEFAULT_TIMEOUT,
    readonly subwalletId: number = HighloadWalletV3.DEFAULT_SUBWALLET_ID,
    workchain: number = 0,
    code?: Cell,
  ) {
    const init = {
      code: code ?? Cell.fromBoc(Buffer.from(HIGHLOAD_WALLET_V3_CODE_HEX, 'hex'))[0],
      data: highloadWalletV3ConfigToCell({
        publicKey,
        timeout,
        subwalletId,
      }),
    };

    super(contractAddress(workchain, init), init);
  }

  static newSequence() {
    return new HighloadWalletV3QueryIdSequence(0, 0);
  }

  static restoreSequence(lastQueryId: number) {
    return HighloadWalletV3QueryIdSequence.restore(lastQueryId);
  }

  static emergencySequence() {
    return HighloadWalletV3QueryIdSequence.emergency();
  }

  async sendBatch(
    provider: ContractProvider,
    secretKey: Buffer,
    {
      messages,
      createdAt,
      valuePerBatch,
    }: {
      messages: {
        mode: SendMode;
        message: MessageRelaxed;
      }[];
      createdAt?: number;
      valuePerBatch?: bigint;
    },
  ) {
    const actions = messages.map(
      ({ message, mode }): OutActionSendMsg => ({
        type: 'sendMsg',
        mode,
        outMsg: message,
      }),
    );

    const queryId = this.sequence.next();

    return this.sendExternal(provider, secretKey, {
      message: this.rollupActions(actions, valuePerBatch ?? 0n, queryId),
      mode:
        valuePerBatch && valuePerBatch > 0n
          ? SendMode.PAY_GAS_SEPARATELY
          : SendMode.CARRY_ALL_REMAINING_BALANCE,
      queryId,
      createdAt: createdAt ?? Math.floor(Date.now() / 1000),
    });
  }

  protected async sendExternal(
    provider: ContractProvider,
    secretKey: Buffer,
    {
      message,
      mode,
      queryId,
      createdAt,
    }: {
      message: MessageRelaxed;
      mode: number;
      queryId: number;
      createdAt: number;
    },
  ) {
    const signingMessage = beginCell()
      .storeUint(this.subwalletId, 32)
      .storeRef(beginCell().store(storeMessageRelaxed(message)).endCell())
      .storeUint(mode, 8)
      .storeUint(
        queryId,
        HighloadWalletV3QueryIdSequence.SHIFT_SIZE +
          HighloadWalletV3QueryIdSequence.BIT_NUMBER_SIZE,
      )
      .storeUint(createdAt, TIMESTAMP_SIZE)
      .storeUint(this.timeout, TIMEOUT_SIZE)
      .endCell();

    await provider.external(
      beginCell()
        .storeBuffer(sign(signingMessage.hash(), secretKey))
        .storeRef(signingMessage)
        .endCell(),
    );
  }

  private rollupActions(actions: OutActionSendMsg[], valuePerBatch: bigint, queryId: number) {
    if (actions.length > 254) {
      const tail = actions.splice(253);

      actions.push({
        type: 'sendMsg',
        mode:
          valuePerBatch > 0n ? SendMode.PAY_GAS_SEPARATELY : SendMode.CARRY_ALL_REMAINING_BALANCE,
        outMsg: this.rollupActions(tail, valuePerBatch, queryId),
      });
    }

    return internal({
      to: this.address,
      value: valuePerBatch,
      body: new InternalMessage(queryId, actions).toCell(),
    });
  }
}
