import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaintenance, setMaintenance } from "../api/config.api";

export function useMaintenance() {
  const queryClient = useQueryClient();

  const maintenanceQuery = useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenance,
  });

  const toggleMutation = useMutation({
    mutationFn: (value: boolean) => setMaintenance(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });

  return {
    mantenimiento: maintenanceQuery.data ?? false,
    isLoading: maintenanceQuery.isLoading,
    toggleMaintenance: (value: boolean) => toggleMutation.mutate(value),
  };
}
