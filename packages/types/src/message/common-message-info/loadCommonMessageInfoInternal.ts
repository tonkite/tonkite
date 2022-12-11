import { Slice } from 'ton3-core';
import { CommonMessageInfoInternal } from './CommonMessageInfoInternal';
import { loadCurrencyCollection } from '../../currency-collection';

/**
 * int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
 *   src:MsgAddressInt dest:MsgAddressInt
 *   value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
 *   created_lt:uint64 created_at:uint32 = CommonMsgInfo;
 */

export function loadCommonMessageInfoInternal(slice: Slice): CommonMessageInfoInternal {
  const ihrDisabled = !!slice.loadBit();
  const bounce = !!slice.loadBit();
  const bounced = !!slice.loadBit();
  const src = slice.loadAddress()!;
  const dest = slice.loadAddress()!;
  const value = loadCurrencyCollection(slice);
  const ihrFee = slice.loadCoins();
  const forwardFee = slice.loadCoins();
  const createdLt = slice.loadBigUint(64);
  const createdAt = slice.loadUint(32);

  return {
    type: 'internal',
    ihrDisabled,
    bounce,
    bounced,
    src,
    dest,
    value,
    ihrFee,
    forwardFee,
    createdLt,
    createdAt,
  };
}
