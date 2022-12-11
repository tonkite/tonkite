import { StorageUsed } from '../storage-used/StorageUsed';
import { Coins } from 'ton3-core';

/**
 * storage_info$_ used:StorageUsed last_paid:uint32
 *               due_payment:(Maybe Grams) = StorageInfo;
 */
export interface StorageInfo {
  used: StorageUsed;
  lastPaid: number;
  duePayment: Coins | null;
}
