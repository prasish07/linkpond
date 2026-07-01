import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTags,
  getAllLinkTagsMap,
  getTagsForLink,
  insertTag,
  updateTag,
  deleteTag,
  setTagsForLink,
} from "@/features/tags/data/tags.repo";
import { TAG_COLORS } from "@/features/tags/types";
import { useToast } from "@/components/Toast";

export const useTags = () =>
  useQuery({ queryKey: ["tags"], queryFn: getAllTags });

export const useAllLinkTagsMap = () =>
  useQuery({ queryKey: ["linkTagsMap"], queryFn: getAllLinkTagsMap });

export const useTagsForLink = (linkId: string) =>
  useQuery({
    queryKey: ["tagsForLink", linkId],
    queryFn: () => getTagsForLink(linkId),
    enabled: !!linkId,
  });

export const useAddTag = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (name: string) => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
      return insertTag({ id, name: name.trim(), color }).then(() => ({ id, name: name.trim(), color }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast("Tag created");
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (tag: { id: string; name: string }) => updateTag(tag),
    onSuccess: () => {
      // the tag name is denormalized into these caches, so a rename must
      // invalidate all three or cards keep showing the old name.
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["linkTagsMap"] });
      queryClient.invalidateQueries({ queryKey: ["tagsForLink"] });
      toast("Tag updated");
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["linkTagsMap"] });
      queryClient.invalidateQueries({ queryKey: ["tagsForLink"] });
      toast("Tag deleted");
    },
  });
};

export const useSetTagsForLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, tagIds }: { linkId: string; tagIds: string[] }) =>
      setTagsForLink(linkId, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkTagsMap"] });
      queryClient.invalidateQueries({ queryKey: ["tagsForLink"] });
    },
  });
};
