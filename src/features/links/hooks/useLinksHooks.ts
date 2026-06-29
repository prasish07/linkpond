import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLink,
  getAllLinks,
  getLinkById,
  getLinkCountsByGroup,
  insertLink,
  markLinkOpened,
  updateLink,
  updateLinkPreview,
} from "@/features/links/data/links.repo";
import { useRouter } from "expo-router";
import { fetchPreview } from "@/lib/fetchPreview";
import { useToast } from "@/components/Toast";

type AddLinkFields = {
  url: string;
  title: string;
  note: string;
  group_id?: string;
};

export const useLinks = (groupId?: string, search?: string) =>
  useQuery({
    queryKey: ["links", groupId, search],
    queryFn: () => getAllLinks(groupId, search),
  });

export const useGroupLinkCounts = () =>
  useQuery({
    queryKey: ["linkCountsByGroup"],
    queryFn: async () => {
      const rows = await getLinkCountsByGroup();

      return Object.fromEntries(rows.map((row) => [row.group_id, row.count]));
    },
  });

export const useLinkById = (id: string) =>
  useQuery({
    queryKey: ["link", id],
    queryFn: () => getLinkById(id),
  });

export const useAddLink = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: async (fields: AddLinkFields) => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      await insertLink({
        id,
        url: fields.url,
        title: fields.title,
        note: fields.note,
        group_id: fields.group_id,
      });
      const preview = await fetchPreview(fields.url);
      await updateLinkPreview(id, preview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      options?.onSuccess ? options.onSuccess() : router.back();
      toast("Link saved");
    },
    onError: (error) => {
      console.error("Failed to add link:", error);
      alert("Failed to add link. Please try again.");
    },
  });
};

export const useUpdateLink = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: (fields: {
      id: string;
      title: string;
      note: string;
      group_id?: string;
    }) => updateLink(fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["link"] });
      queryClient.invalidateQueries({ queryKey: ["linkCountsByGroup"] });
      router.back();
      toast("Link updated");
    },
    onError: (error) => {
      console.error("Failed to update link:", error);
      alert("Failed to update link. Please try again.");
    },
  });
};

export const useMarkOpened = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markLinkOpened(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["link"] });
    },
  });
};

export const useDeleteLink = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      router.back();
      toast("Link deleted");
    },
  });
};
