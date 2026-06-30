import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLink,
  getAllLinks,
  getArchivedLinks,
  getLinkById,
  getLinkCountsByGroup,
  insertLink,
  markLinkOpened,
  setLinkArchived,
  updateLink,
  updateLinkPreview,
} from "@/features/links/data/links.repo";
import { setTagsForLink } from "@/features/tags/data/tags.repo";
import { useRouter } from "expo-router";
import { fetchPreview } from "@/lib/fetchPreview";
import { useToast } from "@/components/Toast";

type AddLinkFields = {
  url: string;
  title: string;
  note: string;
  group_id?: string;
  tagIds?: string[];
};

export const useLinks = (groupId?: string, search?: string, tagId?: string) =>
  useQuery({
    queryKey: ["links", groupId, search, tagId],
    queryFn: () => getAllLinks(groupId, search, tagId),
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
      if (fields.tagIds?.length) await setTagsForLink(id, fields.tagIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["linkTagsMap"] });
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
    mutationFn: async (fields: {
      id: string;
      title: string;
      note: string;
      group_id?: string;
      tagIds?: string[];
    }) => {
      await updateLink(fields);
      if (fields.tagIds !== undefined) {
        await setTagsForLink(fields.id, fields.tagIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["link"] });
      queryClient.invalidateQueries({ queryKey: ["linkCountsByGroup"] });
      queryClient.invalidateQueries({ queryKey: ["linkTagsMap"] });
      queryClient.invalidateQueries({ queryKey: ["tagsForLink"] });
      router.back();
      toast("Link updated");
    },
    onError: (error) => {
      console.error("Failed to update link:", error);
      alert("Failed to update link. Please try again.");
    },
  });
};

export const useArchivedLinks = () =>
  useQuery({
    queryKey: ["archivedLinks"],
    queryFn: getArchivedLinks,
  });

export const useSetArchived = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      setLinkArchived(id, archived),
    onSuccess: (_data, { archived }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["archivedLinks"] });
      queryClient.invalidateQueries({ queryKey: ["linkCountsByGroup"] });
      queryClient.invalidateQueries({ queryKey: ["link"] });
      toast(archived ? "Link archived" : "Link restored");
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

export const useDeleteLink = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["archivedLinks"] });
      queryClient.invalidateQueries({ queryKey: ["linkCountsByGroup"] });
      toast("Link deleted");
      options?.onSuccess?.();
    },
  });
};
