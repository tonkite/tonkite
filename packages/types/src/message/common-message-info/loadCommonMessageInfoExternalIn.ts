import { Slice } from 'ton3-core';
import { CommonMessageInfoExternalIn } from './CommonMessageInfoExternalIn';
import { CommonMessageInfoKind } from './CommonMessageInfoKind';

/**
 * ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
 *   import_fee:Grams = CommonMsgInfo;
 */

export function loadCommonMessageInfoExternalIn(slice: Slice): CommonMessageInfoExternalIn {
  const src = slice.loadAddress();
  const dest = slice.loadAddress()!;
  const importFee = slice.loadCoins();

  return {
    type: 'external-in',
    src,
    dest,
    importFee,
  };
}
