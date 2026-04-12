import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getStatusConfig, getBorderColor, mapApiTask } from "./TaskViewUtils";
import {
  StatusChip,
  AssigneeAvatar,
  TeamAvatars,
  DateRange,
  DateBlock,
} from "./TaskViewComponent";
import { getTaskList } from "../../../api/queries/getters";

const TaskRow = ({ task }) => {
  const cfg = getStatusConfig(task.status);
  const isActive = task.status?.toUpperCase() !== "TO DO";
  const borderColor = getBorderColor(task.status);

  return (
    <Box sx={{ display: "flex", alignItems: "stretch", gap: 2, mb: 2 }}>
      <DateBlock date={task.date} isActive={isActive} statusDot={cfg.dot} />
      <Box
        sx={{
          flex: 1,
          border: "1px solid #f0f0f0",
          borderLeft: `13px solid ${borderColor}`,
          borderRadius: "10px",
          p: 2,
          bgcolor: "background.paper",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <StatusChip status={task.status} />
          <AssigneeAvatar assignee={task.assignee} />
        </Box>

        <Typography sx={{ fontWeight: 600, fontSize: "14px", mb: 0.5 }}>
          {task.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            color: "text.secondary",
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DateRange startDate={task.startDate} endDate={task.endDate} />
          <TeamAvatars team={task.team} />
        </Box>
      </Box>
    </Box>
  );
};

const ListView = ({ filters = {} }) => {
  const {
    status,
    priority,
    task_name,
    is_closed,
    search,
    page = 1,
    limit = 10,
  } = filters;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () =>
      getTaskList({
        page,
        limit,
        ...filters,
      }),
    select: (res) => {
      const raw = res?.data?.data?.tasks || [];
      return raw.map(mapApiTask);
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error?.message ?? "Failed to load tasks."}
      </Alert>
    );
  }

  if (!data?.length) {
    return (
      <Typography color="text.secondary" textAlign="center" pt={6}>
        No tasks found.
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowX: "auto", height: "calc(100vh - 300px)", pr: 1 }}>
      {data.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </Box>
  );
};

export default ListView;
