import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearRecentSearches,
  getRecentSearches,
  recordSearch,
} from "../data/searches.repo";

export const useRecentSearches = () =>
  useQuery({
    queryKey: ["recentSearches"],
    queryFn: () => getRecentSearches(),
  });

export const useRecordSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (term: string) => recordSearch(term),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] }),
  });
};

export const useClearRecentSearches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearRecentSearches(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] }),
  });
};
