import { Address, Coins } from 'ton3-core';
import { ExternalAddress } from '../../message-address-external';

/**
 * ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
 *   import_fee:Grams = CommonMsgInfo;
 */

export interface CommonMessageInfoExternalIn {
  type: 'external-in';
  src: ExternalAddress | null;
  dest: Address;
  importFee: Coins;
}
