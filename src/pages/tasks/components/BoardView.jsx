import { Box } from "@mui/material";
import TaskColumn from "./TaskColumn";

const COLUMNS = [
  {
    key: "todo",
    label: "TO DO",
    chipColor: "#6b7280",
    chipBg: "#f3f4f6",
    headerBg: "#f9fafb",
    borderColor: "#e5e7eb",
    dotColor: "#9ca3af",
  },
  {
    key: "in_progress",
    label: "IN PROGRESS",
    chipColor: "#2563eb",
    chipBg: "#eff6ff",
    headerBg: "#eff6ff",
    borderColor: "#bfdbfe",
    dotColor: "#3b82f6",
  },
  {
    key: "done",
    label: "COMPLETE",
    chipColor: "#16a34a",
    chipBg: "#f0fdf4",
    headerBg: "#f0fdf4",
    borderColor: "#bbf7d0",
    dotColor: "#22c55e",
  },
];

const BoardView = ({ filters, onOpenCreateModal }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 2,
        pt: 1,
        alignItems: "flex-start",
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-track": { bgcolor: "#f1f5f9" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 3 },
        height: "calc(100vh - 300px)",
      }}
    >
      {COLUMNS.map((col) => (
        <TaskColumn key={col.key} col={col} onOpenCreateModal={onOpenCreateModal} />
      ))}
    </Box>
  );
};

export default BoardView;
