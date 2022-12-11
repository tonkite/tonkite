import { CommonMessageInfoInternal } from './CommonMessageInfoInternal';
import { Builder } from 'ton3-core';

// /**
//  * int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
//  *   src:MsgAddressInt dest:MsgAddressInt
//  *   value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
//  *   created_lt:uint64 created_at:uint32 = CommonMsgInfo;
//  */

export function storeCommonMessageInfoInternal(info: CommonMessageInfoInternal) {
  return (builder: Builder) => {
    builder.storeBit(0); // int_msg_info$0
    builder.storeBit(info.ihrDisabled ? 1 : 0); // ihr_disabled:Bool
    builder.storeBit(info.bounce ? 1 : 0); // bounce:Bool
    builder.storeBit(info.bounced ? 1 : 0); // bounced:Bool
    builder.storeAddress(info.src); // src:MsgAddressInt
    builder.storeAddress(info.dest); // dest:MsgAddressInt

    // TODO: Extract to storeCurrencyCollection()
    // value:CurrencyCollection
    builder.storeCoins(info.value.coins); // grams:Grams
    builder.storeBit(0); // other:ExtraCurrencyCollection

    builder.storeCoins(info.ihrFee); // ihr_fee:Grams
    builder.storeCoins(info.forwardFee); // fwd_fee:Grams
    builder.storeUint(info.createdLt, 64); // created_lt:uint64
    builder.storeUint(info.createdAt, 32); // created_at:uint32

    return builder;
  };
}
