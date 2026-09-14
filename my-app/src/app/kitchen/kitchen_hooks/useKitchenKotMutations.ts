// RESPONSIBILITY: Handles KOT status mutations (single item, batch, and recall).
// DATA FLOW: UI -> Mutation Hook -> API -> Invalidates Queries -> Updates UI
// Resolves issue: Eliminates heuristic inventory deduction from client side.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenApiClient } from "@/app/kitchen/kitchen_api/kitchen_api_client";
import type { KotItemStatus } from "@/types/appTypes";
import type { KitchenPipelineStep } from "@/app/kitchen/kitchen_types/KitchenTypes";
import { playReadyChime } from "@/lib/audioHelper";

export function useKitchenKotMutations() {
  const queryClient = useQueryClient();

  // Single Item Status Update
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, kotId, itemId, newStatus }: { orderId: string, kotId: string, itemId: string, newStatus: KotItemStatus }) => {
      // The backend will now handle auto-inventory deduction based on the true Recipe BOM
      return kitchenApiClient(`/api/kitchen/kots/${kotId}/items/${itemId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ orderId, newStatus }),
      });
    },
    onSuccess: (_, { newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'activeKots'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'completedKots'] });
      
      if (newStatus === "READY") {
        playReadyChime();
      }
    },
  });

  // Batch Kot Status Update
  const batchUpdateMutation = useMutation({
    mutationFn: async ({ kotId, targetStatus }: { kotId: string, targetStatus: KitchenPipelineStep }) => {
      return kitchenApiClient(`/api/kitchen/kots/${kotId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ targetStatus }),
      });
    },
    onSuccess: (_, { targetStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'activeKots'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'completedKots'] });
      
      if (targetStatus === "READY") {
        playReadyChime();
      }
    },
  });

  // Recall Completed Kot
  const recallKotMutation = useMutation({
    mutationFn: async (kotId: string) => {
      return kitchenApiClient(`/api/kitchen/kots/${kotId}/recall`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'activeKots'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'completedKots'] });
    },
  });

  // Set Item Prep Time (Replaces client-side fake timestamp calculation)
  const setPrepTimeMutation = useMutation({
    mutationFn: async ({ orderId, kotId, itemId, mins }: { orderId: string, kotId: string, itemId: string, mins: number }) => {
      return kitchenApiClient(`/api/kitchen/kots/${kotId}/items/${itemId}/prep-time`, {
        method: "PATCH",
        body: JSON.stringify({ orderId, mins }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'activeKots'] });
    },
  });

  return {
    updateKotItemStatus: (orderId: string, kotId: string, itemId: string, newStatus: KotItemStatus) => 
      updateStatusMutation.mutate({ orderId, kotId, itemId, newStatus }),
    batchUpdateKotStatus: (kotId: string, targetStatus: KitchenPipelineStep) => 
      batchUpdateMutation.mutate({ kotId, targetStatus }),
    recallCompletedKot: (kotId: string) => 
      recallKotMutation.mutate(kotId),
    setItemPrepTime: (orderId: string, kotId: string, itemId: string, mins: number) => 
      setPrepTimeMutation.mutate({ orderId, kotId, itemId, mins }),
    savingKey: updateStatusMutation.isPending ? updateStatusMutation.variables?.itemId : "", // Rough fallback for UI blocking
  };
}
