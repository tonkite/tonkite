import { Slice } from 'ton3-core';
import { loadExternalAddress } from '../../message-address-external';
import { CommonMessageInfoExternalIn } from './CommonMessageInfoExternalIn';

/**
 * ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
 *   import_fee:Grams = CommonMsgInfo;
 */

export function loadCommonMessageInfoExternalIn(slice: Slice): CommonMessageInfoExternalIn {
  const src = loadExternalAddress(slice);
  const dest = slice.loadAddress()!;
  const importFee = slice.loadCoins();

  return {
    type: 'external-in',
    src,
    dest,
    importFee,
  };
}
