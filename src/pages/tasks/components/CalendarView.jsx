import {
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  useColorScheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";
import { getTaskCalendar } from "../../../api/queries/getters";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

const STATUS_CONFIG = {
  in_progress: {
    label: "In progress",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#2563eb",
  },
  to_do: { label: "To do", color: "#6b7280", bg: "#f9fafb", border: "#9ca3af" },
  done: {
    label: "Complete",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#16a34a",
  },
};

const normalizeStatus = (s = "") => s.toLowerCase().replace(/\s+/g, "_");
const getStatusCfg = (s) =>
  STATUS_CONFIG[normalizeStatus(s)] ?? STATUS_CONFIG.to_do;

const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const getInitials = (p) => {
  const name = p.preferred_name || `${p.first_name} ${p.last_name}`;
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const StatusDot = ({ status }) => {
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

const TaskPill = ({ task }) => {
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

const DayPanel = ({ dateKey, tasks }) => {
  if (!dateKey) return null;

  const dt = new Date(dateKey + "T00:00:00");
  const dateLabel = `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;

  return (
    <Box sx={{ mt: 2, borderTop: "1px solid #e5e7eb", pt: 2 }}>
      {/* Date heading */}
      <Typography sx={{ fontWeight: 700, fontSize: "13px", mb: 1.5 }}>
        {dateLabel}
        <Typography
          component="span"
          sx={{
            fontWeight: 400,
            fontSize: "12px",
            color: "text.secondary",
            ml: 1,
          }}
        >
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </Typography>
      </Typography>

      {tasks.length === 0 ? (
        <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
          No tasks for this day
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {tasks.map((task) => {
            const cfg = getStatusCfg(task.status);
            return (
              <Box
                key={task.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  border: "1px solid #e5e7eb",
                  borderLeft: `4px solid ${cfg.border}`,
                  borderRadius: "0 8px 8px 0",
                  bgcolor: cfg.bg,
                }}
              >
                {/* Task info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#1a2b4a",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={cfg.label}
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        color: cfg.color,
                        fontWeight: 600,
                        fontSize: "10px",
                        height: 20,
                        border: `1px solid ${cfg.border}`,
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  {/* Participants */}
                  {task.participants?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {task.participants.map((p) => (
                        <Box
                          key={p.participant_id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 18,
                              height: 18,
                              fontSize: "9px",
                              bgcolor: cfg.border,
                              color: "#fff",
                            }}
                          >
                            {getInitials(p)}
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "11px", color: "text.secondary" }}
                          >
                            {p.preferred_name ||
                              `${p.first_name} ${p.last_name}`}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const CalendarView = () => {
  const today = new Date();
  const todayKey = fmtKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(todayKey);

  const { year, month } = current;

  useEffect(() => {
    let cancelled = false;
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await getTaskCalendar({ month: month + 1, year });
        if (!cancelled) {
          setCalendarData(
            Array.isArray(res?.data?.data) ? res?.data?.data : [],
          );
        }
      } catch (err) {
        console.error("CalendarView fetch error:", err);
        if (!cancelled) setCalendarData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch_();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const taskMap = {};
  calendarData.forEach(({ date, tasks }) => {
    const key = date?.split("T")[0];
    if (key) taskMap[key] = tasks ?? [];
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1);

  const cells = [];
  for (let i = 0; i < firstDayIdx; i++)
    cells.push({ day: prevDays - firstDayIdx + 1 + i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, currentMonth: true });
  while (cells.length % 7 !== 0)
    cells.push({
      day: cells.length - daysInMonth - firstDayIdx + 1,
      currentMonth: false,
    });

  const isToday = (cell) =>
    cell.currentMonth &&
    today.getDate() === cell.day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const isSelected = (cell) =>
    cell.currentMonth && fmtKey(year, month, cell.day) === selectedKey;

  const prevMonth = () =>
    setCurrent((c) => ({
      year: c.month === 0 ? c.year - 1 : c.year,
      month: c.month === 0 ? 11 : c.month - 1,
    }));
  const nextMonth = () =>
    setCurrent((c) => ({
      year: c.month === 11 ? c.year + 1 : c.year,
      month: c.month === 11 ? 0 : c.month + 1,
    }));
  const handleDayClick = (cell) => {
    if (!cell.currentMonth) return;
    setSelectedKey(fmtKey(year, month, cell.day));
  };

  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        p: 3,
        // bgcolor: "#fff",
        borderRadius: 2,
        position: "relative",
        height: "calc(100vh - 305px)",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <IconButton size="small" onClick={prevMonth}>
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
          {MONTHS[month]} {year}
        </Typography>
        <IconButton size="small" onClick={nextMonth}>
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            // bgcolor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: 2,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      {/* Weekday headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 150px)",
          mb: 0.5,
        }}
      >
        {WEEKDAYS.map((d) => (
          <Typography
            key={d}
            sx={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 500,
              py: 0.5,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 148px)",
          gap: "4px",
        }}
      >
        {cells.map((cell, i) => {
          const key = cell.currentMonth ? fmtKey(year, month, cell.day) : null;
          const tasks = key ? (taskMap[key] ?? []) : [];
          const today_ = isToday(cell);
          const selected = isSelected(cell);

          const showDots = tasks.length > 2;

          return (
            <Box
              key={i}
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
                // bgcolor: selected ? "#e8f5f0" : today_ ? "#f0f4ff" : "",
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
                  ? // ? {
                    //     bgcolor: selected
                    //       ? "#ddf0e8"
                    //       : today_
                    //         ? "#e8eeff"
                    //         : "#f8fafc",
                    //   }
                    {
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
        })}
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "12px", fontWeight: 700, color: "text.secondary" }}
        >
          Conditional characters:
        </Typography>
        {Object.values(STATUS_CONFIG).map((cfg) => (
          <Box
            key={cfg.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: cfg.border,
              }}
            />
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {cfg.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {(() => {
        const allTasks = calendarData.flatMap((d) => d.tasks ?? []);
        const unique = [...new Map(allTasks.map((t) => [t.title, t])).values()];
        if (!unique.length) return null;
        return (
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {unique.map((task) => {
              const cfg = getStatusCfg(task.status);
              return (
                <Box
                  key={task.id}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "3px",
                      bgcolor: cfg.border,
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "12px", color: "text.secondary" }}
                  >
                    {task.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        );
      })()}

      <DayPanel
        dateKey={selectedKey}
        tasks={selectedKey ? (taskMap[selectedKey] ?? []) : []}
      />
    </Box>
  );
};

export default CalendarView;
