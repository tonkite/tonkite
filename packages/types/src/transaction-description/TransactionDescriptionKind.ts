export enum TransactionDescriptionKind {
  /** trans_ord$0000 */
  ORDINARY = 0b0000,
  /** trans_storage$0001 */
  STORAGE = 0b0001,
  /** trans_tick_tock$001 */
  TICK_TOCK = 0b001,
  /** trans_split_prepare$0100 */
  SPLIT_PREPARE = 0b0100,
  /** trans_split_install$0101 */
  SPLIT_INSTALL = 0b0101,
  /** trans_merge_prepare$0110 */
  MERGE_PREPARE = 0b0110,
  /** trans_merge_install$0111 */
  MERGE_INSTALL = 0b0111,
}
