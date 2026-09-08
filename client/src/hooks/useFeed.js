import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "../api/feed.api";

export const useFeed = (groupId) => {
  return useInfiniteQuery({
    queryKey: ["feed", groupId],
    queryFn: ({ pageParam = 1 }) => getFeed({ pageParam, limit: 20, groupId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasMore) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
  });
};
