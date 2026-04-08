import {
  Box,
  Typography,
  Paper,
  Avatar,
  AvatarGroup,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { CalendarToday, Flag } from "@mui/icons-material";

export const getPriorityStyle = (priority = "") => {
  const p = priority.toLowerCase();
  if (p === "urgent") return { color: "#dc2626", bg: "#fef2f2" };
  if (p === "high") return { color: "#2563eb", bg: "#eff6ff" };
  if (p === "medium") return { color: "#d97706", bg: "#fffbeb" };
  return { color: "#6b7280", bg: "#f3f4f6" };
};

export const stringToColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
  ];
  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (p) => {
  if (!p) return "?";
  const name =
    p.preferred_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

export const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "string") return null;
  try {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return null;
  }
};

export const ParticipantAvatars = ({ participants = [] }) => {
  const isMoreThanTwo = participants.length > 2;
  const visible = isMoreThanTwo ? participants.slice(0, 2) : participants;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <AvatarGroup
        sx={{
          "& .MuiAvatar-root": {
            width: 24,
            height: 24,
            fontSize: "9px",
            border: "1.5px solid #fff",
          },
        }}
      >
        {visible.map((p) => (
          <Tooltip
            key={p.participant_id}
            title={p.preferred_name || `${p.first_name} ${p.last_name}`}
          >
            <Avatar
              sx={{
                bgcolor: stringToColor(
                  (p.first_name ?? "") + (p.last_name ?? ""),
                ),
              }}
            >
              {getInitials(p)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
      {isMoreThanTwo && (
        <Typography
          sx={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}
        >
          2+
        </Typography>
      )}
    </Box>
  );
};

export const CardSkeleton = () => (
  <Paper
    elevation={0}
    sx={{
      border: "1px solid #f0f0f0",
      borderRadius: "12px",
      p: "12px 14px",
      mb: 1.5,
    }}
  >
    <Skeleton variant="text" width="70%" height={18} />
    <Skeleton variant="text" width="100%" height={14} sx={{ mt: 0.5 }} />
    <Skeleton variant="text" width="85%" height={14} />
    <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
      <Skeleton variant="rounded" width={80} height={22} />
      <Skeleton variant="rounded" width={60} height={22} />
    </Box>
  </Paper>
);

const BoardCard = ({ task }) => {
  const priorityStyle = getPriorityStyle(task.priority);
  const startFmt = formatDate(task.start_date);
  const endFmt = formatDate(task.end_date);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #f0f0f0",
        borderRadius: "12px",
        p: "12px 14px",
        mb: 1.5,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.15s",
        "&:hover": {
          boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "13px",
            lineHeight: 1.4,
            pr: 1,
          }}
        >
          {task.title}
        </Typography>
        {task.owner?.manager_name && (
          <Tooltip title={task.owner.manager_name}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "9px",
                bgcolor: stringToColor(task.owner.manager_name),
                flexShrink: 0,
              }}
            >
              {task.owner.manager_name.slice(0, 2).toUpperCase()}
            </Avatar>
          </Tooltip>
        )}
      </Box>

      {task.description && task.description !== "string" && (
        <Typography
          sx={{
            fontSize: "11.5px",
            color: "#6b7280",
            mb: 1.25,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.75,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexWrap: "wrap",
          }}
        >
          {startFmt && endFmt && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                bgcolor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                px: 0.75,
                py: 0.3,
              }}
            >
              <CalendarToday sx={{ fontSize: 10, color: "#9ca3af" }} />
              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: "#6b7280",
                  whiteSpace: "nowrap",
                }}
              >
                {startFmt}–{endFmt}
              </Typography>
            </Box>
          )}
          {task.priority && task.priority !== "string" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                bgcolor: priorityStyle.bg,
                borderRadius: "6px",
                px: 0.75,
                py: 0.3,
              }}
            >
              <Flag sx={{ fontSize: 11, color: priorityStyle.color }} />
              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: priorityStyle.color,
                  fontWeight: 600,
                }}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Typography>
            </Box>
          )}
        </Box>
        {task.participants?.length > 0 && (
          <ParticipantAvatars participants={task.participants} />
        )}
      </Box>
    </Paper>
  );
};

export default BoardCard;
