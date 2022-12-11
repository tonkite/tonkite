export enum AccountStatusChange {
  /** x -> x */
  UNCHANGED = 0b0,
  /** init -> frozen */
  FROZEN = 0b10,
  /** frozen -> deleted */
  DELETED = 0b11,
}
