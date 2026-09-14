// RESPONSIBILITY: Handles Void Requests approval and rejection.
// DATA FLOW: UI -> Mutation Hook -> API -> Invalidates Queries

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kitchenApiClient } from "@/app/kitchen/kitchen_api/kitchen_api_client";

export function useKitchenVoidMutations() {
  const queryClient = useQueryClient();

  const voidDecisionMutation = useMutation({
    mutationFn: async ({ orderId, kotId, itemId, approved }: { orderId: string, kotId: string, itemId: string, approved: boolean }) => {
      return kitchenApiClient(`/api/kitchen/kots/${kotId}/items/${itemId}/void`, {
        method: "POST",
        body: JSON.stringify({ orderId, approved }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen', 'activeKots'] });
    },
  });

  return {
    handleVoidDecision: (orderId: string, kotId: string, itemId: string, approved: boolean) => 
      voidDecisionMutation.mutate({ orderId, kotId, itemId, approved }),
  };
}
