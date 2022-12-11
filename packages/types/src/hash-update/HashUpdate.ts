/**
 * update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
 *   = HASH_UPDATE X;
 */
export interface HashUpdate {
  oldHash: Uint8Array;
  newHash: Uint8Array;
}
