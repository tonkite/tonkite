import { TransactionActionPhase } from './TransactionActionPhase';
import { Slice } from 'ton3-core';
import { loadAccountStatusChange } from '../../../account-status-change';
import { loadStorageUsedShort } from '../../../storage-used-short';

/**
 * tr_phase_action$_ success:Bool valid:Bool no_funds:Bool
 *   status_change:AccStatusChange
 *   total_fwd_fees:(Maybe Grams) total_action_fees:(Maybe Grams)
 *   result_code:int32 result_arg:(Maybe int32) tot_actions:uint16
 *   spec_actions:uint16 skipped_actions:uint16 msgs_created:uint16
 *   action_list_hash:bits256 tot_msg_size:StorageUsedShort
 *   = TrActionPhase;
 */

export function loadTransactionActionPhase(slice: Slice): TransactionActionPhase {
  const success = !!slice.loadBit();
  const valid = !!slice.loadBit();
  const noFunds = !!slice.loadBit();
  const statusChange = loadAccountStatusChange(slice);
  const totalForwardFees = slice.loadBit() ? slice.loadCoins() : null;
  const totalActionFees = slice.loadBit() ? slice.loadCoins() : null;
  const resultCode = slice.loadInt(32);
  const resultArg = slice.loadBit() ? slice.loadInt(32) : null;
  const totalActions = slice.loadUint(16);
  const specialActions = slice.loadUint(16);
  const skippedActions = slice.loadUint(16);
  const messagesCreated = slice.loadUint(16);
  const actionListHash = slice.loadBytes(256);
  const totalMessagesSize = loadStorageUsedShort(slice);

  return {
    success,
    valid,
    noFunds,
    statusChange,
    totalForwardFees,
    totalActionFees,
    resultCode,
    resultArg,
    totalActions,
    specialActions,
    skippedActions,
    messagesCreated,
    actionListHash,
    totalMessagesSize,
  };
}
