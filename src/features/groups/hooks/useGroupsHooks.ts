import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllGroups, insertGroup } from "@/features/groups/data/groups.repo";
import { useRouter } from "expo-router";

export const useGroups = () =>
  useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroups,
  });

export const useAddGroup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (group: { name: string; color: string; icon: string }) => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      return insertGroup({ id, ...group });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to create group:", error);
      alert("Failed to create group. Please try again.");
    },
  });
};
