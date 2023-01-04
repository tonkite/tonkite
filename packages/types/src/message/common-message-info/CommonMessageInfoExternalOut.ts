import { Address } from 'ton3-core';
import { ExternalAddress } from '../../message-address-external';

/**
 * ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
 *   created_lt:uint64 created_at:uint32 = CommonMsgInfo;
 */

export interface CommonMessageInfoExternalOut {
  type: 'external-out';
  src: Address;
  dest: ExternalAddress | null;
  createdLt: bigint;
  createdAt: number;
}
