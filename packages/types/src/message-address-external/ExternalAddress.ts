/**
 * addr_none$00 = MsgAddressExt;
 * addr_extern$01 len:(## 9) external_address:(bits len)
 *              = MsgAddressExt;
 */
export interface ExternalAddress {
  length: number;
  address: Uint8Array;
}
