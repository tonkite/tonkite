import {
  beginCell,
  Builder,
  internal,
  OutActionSendMsg,
  SendMode,
  storeOutList,
  Writable,
} from '@ton/core';
import { HighloadWalletV3QueryIdSequence } from '../highload-wallet-v3-query-id-sequence';

export class InternalMessage implements Writable {
  /**
   * @dev internal_transfer#ae42e5a4 n:# query_id:uint64 actions:^OutList n = InternalMsgBody n
   */
  static readonly TAG = 0xae42e5a4;

  constructor(
    public readonly queryId: number,
    public readonly actions: OutActionSendMsg[],
  ) {
    if (actions.length > 254) {
      throw new Error('Max allowed action count is 254.');
    }
  }

  writeTo(builder: Builder) {
    builder
      .storeUint(InternalMessage.TAG, 32)
      .storeUint(this.queryId, 64)
      .storeRef(beginCell().store(storeOutList(this.actions)).endCell());
  }

  toCell() {
    return beginCell().store(this).endCell();
  }
}
