/**
 * acc_state_uninit$00 = AccountStatus;
 * acc_state_frozen$01 = AccountStatus;
 * acc_state_active$10 = AccountStatus;
 * acc_state_nonexist$11 = AccountStatus;
 */
export enum AccountStatus {
  UNINITIALIZED = 0b00,
  FROZEN = 0b01,
  ACTIVE = 0b10,
  NON_EXIST = 0b11,
}
