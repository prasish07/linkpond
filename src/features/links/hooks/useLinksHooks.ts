import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLinks,
  getLinkById,
  insertLink,
  updateLinkPreview,
} from "@/features/links/data/links.repo";
import { useRouter } from "expo-router";
import { fetchPreview } from "@/lib/fetchPreview";

type AddLinkFields = {
  url: string;
  title: string;
  note: string;
  group_id?: string;
};

export const useLinks = () =>
  useQuery({
    queryKey: ["links"],
    queryFn: getAllLinks,
  });

export const useLinkById = (id: string) =>
  useQuery({
    queryKey: ["link", id],
    queryFn: () => getLinkById(id),
  });

export const useAddLink = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      router.back();
    },
    onError: (error) => {
      console.error("Failed to add link:", error);
      alert("Failed to add link. Please try again.");
    },
  });
};
