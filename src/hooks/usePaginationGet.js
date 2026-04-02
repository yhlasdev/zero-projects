import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const usePaginationGet = ({
  apiFn,
  key,
  page = 1,
  limit = 10,
  filters = {},
  enabled = true,
  dataKey = "data",
  countKey = "count",
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: [key, page, limit, filters],
    enabled,
    queryFn: () =>
      apiFn({
        page,
        limit,
        ...filters,
      }),
  });

  const listData = useMemo(() => {
    if (!data?.data?.data) return [];
    
    const pageData = data.data.data[dataKey];
    const pageData2 = data.data.data;

    if (Array.isArray(pageData)) {
      return pageData;
    }
    if (Array.isArray(pageData2)) {
      return pageData2;
    }
    return [];
  }, [data, dataKey]);
  const totalCount = data?.data?.data?.[countKey] ?? 0;

  return {
    data: listData,
    totalItems: totalCount,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
