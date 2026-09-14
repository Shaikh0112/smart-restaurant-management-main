// RESPONSIBILITY: Handles complex table operations like Transfer and Merge.
// DATA FLOW: UI → React Query Mutation → API
"use client";

import { useTransferTableMutation } from "./useWaiterMutations";

export function useWaiterTableActions() {
  const transferMutation = useTransferTableMutation();

  const moveTable = async (orderId: string, sourceTableId: string, targetTableId: string) => {
    return transferMutation.mutateAsync({ orderId, sourceTableId, targetTableId, mode: "TRANSFER" });
  };

  const mergeTable = async (sourceTableId: string, targetTableId: string) => {
    return transferMutation.mutateAsync({ sourceTableId, targetTableId, mode: "MERGE" });
  };

  return {
    moveTable,
    mergeTable,
    isWorking: transferMutation.isPending
  };
}
