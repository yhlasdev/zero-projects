import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  Add as AddIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { getTaskList } from "../../../api/queries/getters";
import BoardCard, { CardSkeleton } from "./BoardCard";

const ColumnHeader = ({ col, count }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, px: 0.5 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        bgcolor: col.chipBg,
        border: `1px solid ${col.borderColor}`,
        borderRadius: "20px",
        px: 1.5,
        py: 0.5,
        flex: 1,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: col.dotColor,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "12px",
          color: col.chipColor,
          letterSpacing: "0.5px",
        }}
      >
        {col.label}
      </Typography>
      <Box
        sx={{
          ml: "auto",
          minWidth: 20,
          height: 20,
          borderRadius: "50%",
          bgcolor: col.chipColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
          {count}
        </Typography>
      </Box>
    </Box>
  </Box>
);

const TaskColumn = ({ col, onOpenCreateModal }) => {
  const limit = 10;
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tasks", col.key],
    queryFn: ({ pageParam = 1 }) =>
      getTaskList({ status: col.key, page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      const tasks = lastPage.data?.data?.tasks ?? [];
      const morePages = tasks.length === limit;
      return morePages ? allPages.length + 1 : undefined;
    },
  });

  const tasks = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data?.tasks ?? []) ?? [];
  }, [data]);

  const totalCount = data?.pages[0]?.data?.data?.count ?? tasks.length;

  if (isError) {
    return (
      <Box sx={{ minWidth: 270, flex: 1, maxWidth: 340 }}>
        <ColumnHeader col={col} count={0} />
        <Paper
          variant="outlined"
          sx={{ p: 2, textAlign: "center", borderColor: col.borderColor }}
        >
          <Typography color="error" sx={{ mb: 1, fontSize: "12px" }}>
            Error: {error?.message}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 270, flex: 1, maxWidth: 340 }}>
      <ColumnHeader col={col} count={totalCount} />

      <Paper
        variant="outlined"
        sx={{
          borderRadius: "14px",
          p: "12px 10px",
          minHeight: 140,
          bgcolor: col.headerBg,
          borderColor: col.borderColor,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : tasks.length === 0 ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: "#9ca3af",
              textAlign: "center",
              py: 3,
            }}
          >
            Not added task
          </Typography>
        ) : (
          <>
            {tasks.map((task) => (
              <BoardCard key={task.id} task={task} />
            ))}

            {hasNextPage && (
              <Box
                onClick={() => !isFetchingNextPage && fetchNextPage()}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0.5,
                  cursor: isFetchingNextPage ? "default" : "pointer",
                  color: "#6b7280",
                  "&:hover": { color: isFetchingNextPage ? "#6b7280" : "#374151" },
                }}
              >
                <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                  {isFetchingNextPage ? <CircularProgress size={16} /> : "Ýene-de ýükle"}
                </Typography>
                {!isFetchingNextPage && (
                  <ExpandMore
                    sx={{
                      fontSize: 16,
                    }}
                  />
                )}
              </Box>
            )}
          </>
        )}

        <Box
          onClick={onOpenCreateModal}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
            px: 0.5,
            py: 0.75,
            borderRadius: "8px",
            cursor: "pointer",
            color: "#9ca3af",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)", color: "#374151" },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
            Add Task
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskColumn;
