import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  AvatarGroup,
  IconButton,
  Skeleton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  Flag,
  MoreHoriz,
  Add,
  ExpandMore,
} from "@mui/icons-material";
import { getAllBoardTask } from "../../../api/queries/getters";

// ─── TanStack Query Hook (inline) ──────────────────────────────────────────
const useBoardTasks = ({ page = 1, limit = 50 } = {}) => {
  return useQuery({
    queryKey: ["boardTasks", page, limit],
    queryFn: () => getAllBoardTask({ page, limit }),
    select: (data) => ({
      todo: data?.data?.data?.todo ?? { count: 0, tasks: [] },
      in_progress: data?.data?.in_progress ?? { count: 0, tasks: [] },
      done: data?.data?.data?.done ?? { count: 0, tasks: [] },
    }),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
};

// ─── Kolon Konfigürasyonu ───────────────────────────────────────────────────
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

// ─── Yardımcı Fonksiyonlar ──────────────────────────────────────────────────
const getPriorityStyle = (priority = "") => {
  const p = priority.toLowerCase();
  if (p === "urgent") return { color: "#dc2626", bg: "#fef2f2" };
  if (p === "high") return { color: "#2563eb", bg: "#eff6ff" };
  if (p === "medium") return { color: "#d97706", bg: "#fffbeb" };
  return { color: "#6b7280", bg: "#f3f4f6" };
};

const stringToColor = (str = "") => {
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

const getInitials = (p) => {
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

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "string") return null;
  try {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return null;
  }
};

// ─── Katılımcı Avatarları ───────────────────────────────────────────────────
const ParticipantAvatars = ({ participants = [] }) => {
  const visible = participants.slice(0, 4);
  const extra = participants.length - 4;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <AvatarGroup
        max={4}
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
      {extra > 0 && (
        <Typography
          sx={{ fontSize: "11px", color: "#6b7280", fontWeight: 600 }}
        >
          {extra}+
        </Typography>
      )}
    </Box>
  );
};

// ─── Skeleton ───────────────────────────────────────────────────────────────
const CardSkeleton = () => (
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

// ─── Task Kartı ─────────────────────────────────────────────────────────────
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
        bgcolor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.15s",
        "&:hover": {
          boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {/* Başlık + Owner */}
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
            color: "#111827",
            lineHeight: 1.4,
            pr: 1,
          }}
        >
          {task.title}
        </Typography>
        {task.owner && (
          <Tooltip title={task.owner}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "9px",
                bgcolor: stringToColor(task.owner),
                flexShrink: 0,
              }}
            >
              {task?.owner?.slice?.(0, 2)?.toUpperCase()}
            </Avatar>
          </Tooltip>
        )}
      </Box>

      {/* Açıklama */}
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

      {/* Alt Satır */}
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

// ─── Kolon Başlığı ──────────────────────────────────────────────────────────
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
        <Typography sx={{ fontSize: "10px", color: "#fff", fontWeight: 700 }}>
          {count}
        </Typography>
      </Box>
    </Box>
    <IconButton size="small" sx={{ color: "#9ca3af", p: 0.5 }}>
      <MoreHoriz sx={{ fontSize: 16 }} />
    </IconButton>
    <IconButton size="small" sx={{ color: "#9ca3af", p: 0.5 }}>
      <Add sx={{ fontSize: 16 }} />
    </IconButton>
  </Box>
);

// ─── Ana Bileşen ────────────────────────────────────────────────────────────
const SHOW_MORE_LIMIT = 2;

const BoardView = ({ page = 1, limit = 50 }) => {
  const { data, isLoading, isError, error, refetch } = useBoardTasks({
    page,
    limit,
  });

  const [showMore, setShowMore] = useState({});

  const toggleShowMore = (key) =>
    setShowMore((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" sx={{ mb: 1 }}>
          Hata: {error?.message}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => refetch()}>
          Tekrar Dene
        </Button>
      </Box>
    );
  }

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
      }}
    >
      {COLUMNS.map((col) => {
        const tasks = data?.[col.key]?.tasks ?? [];
        const count = data?.[col.key]?.count ?? tasks.length;
        const isExpanded = showMore[col.key];
        const visibleTasks = isExpanded
          ? tasks
          : tasks.slice(0, SHOW_MORE_LIMIT);
        const hasMore = tasks.length > SHOW_MORE_LIMIT;

        return (
          <Box key={col.key} sx={{ minWidth: 270, flex: 1, maxWidth: 340 }}>
            <ColumnHeader col={col} count={count} />

            <Paper
              variant="outlined"
              sx={{
                borderRadius: "14px",
                p: "12px 10px",
                minHeight: 140,
                bgcolor: col.headerBg,
                borderColor: col.borderColor,
              }}
            >
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : visibleTasks.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    textAlign: "center",
                    py: 3,
                  }}
                >
                  Görev yok
                </Typography>
              ) : (
                visibleTasks.map((task) => (
                  <BoardCard key={task.id} task={task} />
                ))
              )}

              {/* Show more */}
              {!isLoading && hasMore && (
                <Box
                  onClick={() => toggleShowMore(col.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 0.5,
                    cursor: "pointer",
                    color: "#6b7280",
                    "&:hover": { color: "#374151" },
                  }}
                >
                  <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                    {isExpanded
                      ? "Daha az göster"
                      : `${tasks.length - SHOW_MORE_LIMIT} daha göster`}
                  </Typography>
                  <ExpandMore
                    sx={{
                      fontSize: 16,
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Box>
              )}

              {/* Add Task */}
              <Box
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
                <Add sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                  Add Task
                </Typography>
              </Box>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default BoardView;
