import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllGroups,
  insertGroup,
  updateGroup,
  deleteGroup,
} from "@/features/groups/data/groups.repo";
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

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (group: {
      id: string;
      name: string;
      color: string;
      icon: string;
    }) => updateGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to update group:", error);
      alert("Failed to update group. Please try again.");
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["linkCountsByGroup"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to delete group:", error);
      alert("Failed to delete group. Please try again.");
    },
  });
};
