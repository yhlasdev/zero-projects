import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";

export const useInfiniteGet = ({
  apiFn,
  key,
  limit = 10,
  filters = {},
  enabled = true,
  dataKey = "employees", // default array key
  countKey = "count", // toplam item sayısı
}) => {
  const lastFetchRef = useRef(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [key, filters, limit],
    initialPageParam: 1,
    enabled,
    queryFn: ({ pageParam }) =>
      apiFn({
        page: pageParam,
        limit,
        ...filters,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage?.data?.data?.[countKey] ?? 0;
      const fetchedSoFar = allPages.flatMap(
        (p) => p?.data?.data?.[dataKey] ?? []
      ).length;

      return fetchedSoFar < totalCount ? allPages.length + 1 : undefined;
    },
  });

  // Flatten edilmiş data
  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data?.data?.[dataKey] ?? []) ?? [];
  }, [data, dataKey]);

  const totalCount = data?.pages?.[0]?.data?.data?.[countKey] ?? 0;

  // Scroll handler
  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const scrollPercent = (scrollTop + clientHeight) / scrollHeight;
      const now = Date.now();

      if (
        scrollPercent > 0.85 &&
        hasNextPage &&
        !isFetchingNextPage &&
        now - lastFetchRef.current > 400
      ) {
        lastFetchRef.current = now;
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return {
    data: flatData,
    totalItems: totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    handleScroll,
  };
};