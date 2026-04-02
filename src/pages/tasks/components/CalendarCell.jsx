import { Box, Typography } from "@mui/material";
import { getStatusCfg } from "./CalendarUtils";

export const StatusDot = ({ status }) => {
  const cfg = getStatusCfg(status);
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "4px",
        bgcolor: cfg.border,
        flexShrink: 0,
      }}
    />
  );
};

export const TaskPill = ({ task }) => {
  const cfg = getStatusCfg(task.status);
  return (
    <Box
      sx={{
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: "0 4px 4px 0",
        bgcolor: cfg.bg,
        px: 0.5,
        py: "1px",
        mb: "2px",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: "10px",
          fontWeight: 600,
          color: cfg.color,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.4,
        }}
      >
        {task.title}
      </Typography>
    </Box>
  );
};

const CalendarCell = ({ cell, mode, today_, selected, handleDayClick, tasks }) => {
  const showDots = tasks.length > 2;

  return (
    <Box
      onClick={() => handleDayClick(cell)}
      sx={{
        width: 148,
        height: 130,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: selected
          ? "#16a34a"
          : today_
            ? "#1a2b4a"
            : "#e5e7eb",
        borderWidth: selected || today_ ? "2px" : "1px",
        p: "6px",
        boxSizing: "border-box",
        bgcolor:
          mode === "dark"
            ? selected
              ? "#0f2a1f"
              : today_
                ? "#0a172c"
                : "#111827"
            : selected
              ? "#e8f5f0"
              : today_
                ? "#f0f4ff"
                : "",
        cursor: cell.currentMonth ? "pointer" : "default",
        transition: "background 0.15s",
        overflow: "hidden",
        "&:hover": cell.currentMonth
          ? {
              bgcolor:
                mode === "dark"
                  ? selected
                    ? "#133528"
                    : today_
                      ? "#26324a"
                      : "#1f2937"
                  : selected
                    ? "#ddf0e8"
                    : today_
                      ? "#e8eeff"
                      : "#f8fafc",
            }
          : {},
      }}
    >
      {/* Day number */}
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          bgcolor: today_ ? "#1a2b4a" : "transparent",
          color: today_
            ? "#fff"
            : cell.currentMonth
              ? "text.primary"
              : "text.disabled",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: today_ || selected ? 700 : 400,
          mb: 0.5,
        }}
      >
        {cell.day}
      </Box>

      {showDots ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "3px",
            mt: 0.3,
          }}
        >
          {tasks.map((task) => (
            <StatusDot key={task.id} status={task.status} />
          ))}
        </Box>
      ) : (
        <>
          {tasks.slice(0, 2).map((task) => (
            <TaskPill key={task.id} task={task} />
          ))}
          {tasks.length > 2 && (
            <Typography
              sx={{ fontSize: "9px", color: "text.secondary", pl: 0.5 }}
            >
              +{tasks.length - 2} more
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default CalendarCell;
