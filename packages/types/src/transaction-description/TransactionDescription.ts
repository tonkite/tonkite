import { OrdinaryTransactionDescription } from './ordinary';
import { StorageTransactionDescription } from './storage/StorageTransactionDescription';
import { TickTockTransactionDescription } from './tick-tock/TickTockTransactionDescription';
import { SplitPrepareTransactionDescription } from './split-prepare/SplitPrepareTransactionDescription';
import { SplitInstallTransactionDescription } from './split-install/SplitInstallTransactionDescription';
import { MergePrepareTransactionDescription } from './merge-prepare/MergePrepareTransactionDescription';
import { MergeInstallTransactionDescription } from './merge-install/MergeInstallTransactionDescription';

/**
 * trans_ord$0000 credit_first:Bool
 *   storage_ph:(Maybe TrStoragePhase)
 *   credit_ph:(Maybe TrCreditPhase)
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool bounce:(Maybe TrBouncePhase)
 *   destroyed:Bool
 *   = TransactionDescr;
 *
 * trans_storage$0001 storage_ph:TrStoragePhase
 *   = TransactionDescr;
 *
 * trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool destroyed:Bool = TransactionDescr;
 *
 * split_merge_info$_ cur_shard_pfx_len:(## 6)
 *   acc_split_depth:(## 6) this_addr:bits256 sibling_addr:bits256
 *   = SplitMergeInfo;
 *
 * trans_split_prepare$0100 split_info:SplitMergeInfo
 *   storage_ph:(Maybe TrStoragePhase)
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool destroyed:Bool
 *   = TransactionDescr;
 *
 * trans_split_install$0101 split_info:SplitMergeInfo
 *   prepare_transaction:^Transaction
 *   installed:Bool = TransactionDescr;
 *
 * trans_merge_prepare$0110 split_info:SplitMergeInfo
 *   storage_ph:TrStoragePhase aborted:Bool
 *   = TransactionDescr;
 *
 * trans_merge_install$0111 split_info:SplitMergeInfo
 *   prepare_transaction:^Transaction
 *   storage_ph:(Maybe TrStoragePhase)
 *   credit_ph:(Maybe TrCreditPhase)
 *   compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
 *   aborted:Bool destroyed:Bool
 *   = TransactionDescr;
 */
export type TransactionDescription =
  | OrdinaryTransactionDescription
  | StorageTransactionDescription // TODO: Implement it.
  | TickTockTransactionDescription // TODO: Implement it.
  | SplitPrepareTransactionDescription // TODO: Implement it.
  | SplitInstallTransactionDescription // TODO: Implement it.
  | MergePrepareTransactionDescription // TODO: Implement it.
  | MergeInstallTransactionDescription; // TODO: Implement it.
