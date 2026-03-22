import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  useColorScheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getMainCalendar } from "../../../api/queries/getters";

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

const EVENT_STYLES = {
  public_holiday: {
    bg: "#fce4ec",
    color: "#c62828",
    dot: "#e53935",
    label: "Public Holiday",
  },
  company_event: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: "Company Event",
  },
  department_event: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: "Department Event",
  },
  note: { bg: "#fffde7", color: "#f57f17", dot: "#fdd835", label: "Note" },
  engineering_team: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: "Engineering Team",
  },
  all_hands: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: "All Hands Meeting",
  },
  default: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: "Event" },
};

const LEGEND_STATIC = [
  "public_holiday",
  "company_event",
  "department_event",
  "note",
];

const getStyle = (event_type = "") =>
  EVENT_STYLES[event_type.toLowerCase()] ?? EVENT_STYLES.default;

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const MainCalendar = () => {
  const today = new Date();
  const { mode } = useColorScheme();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedKey, setSelectedKey] = useState(
    fmtKey(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: eventMap = {}, isLoading } = useQuery({
    queryKey: ["mainCalendar", year, month],
    queryFn: () => getMainCalendar({ month: month + 1, year }),
    staleTime: 5 * 60 * 1000,
    select: (res) => {
      const raw = Array.isArray(res?.data?.data)
        ? res.data.data
        : (res?.data ?? []);
      const map = {};
      raw.forEach(({ date, events }) => {
        const key = date?.split("T")[0];
        if (key) map[key] = events ?? [];
      });
      return map;
    },
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const diff = i - firstDay;
    if (diff < 0) return { day: prevDays + diff + 1, currentMonth: false };
    if (diff < daysInMonth) return { day: diff + 1, currentMonth: true };
    return { day: diff - daysInMonth + 1, currentMonth: false };
  });

  const isToday = (cell) =>
    cell.currentMonth &&
    today.getDate() === cell.day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const isSelected = (cell) =>
    cell.currentMonth && fmtKey(year, month, cell.day) === selectedKey;

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleDayClick = (cell) => {
    if (!cell.currentMonth) return;
    setSelectedKey(fmtKey(year, month, cell.day));
  };

  const dynamicTypes = [
    ...new Set(
      Object.values(eventMap)
        .flat()
        .map((e) => e.event_type),
    ),
  ].filter((t) => !LEGEND_STATIC.includes(t));

  const isDark = mode === "dark";

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
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

      {/* ── Navigation header — arrows flush to card edges ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1.5,
        }}
      >
        <IconButton onClick={handlePrev} size="small">
          <ChevronLeft fontSize="small" />
        </IconButton>

        <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
          {MONTHS[month]} {year}
        </Typography>

        <IconButton onClick={handleNext} size="small">
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Weekday header row ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {WEEKDAYS.map((d, i) => (
          <Box
            key={d}
            sx={{
              py: 1,
              textAlign: "center",
              borderTop: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
              borderRight: "1px solid #e0e0e0",
              ...(i === 0 && {
                borderLeft: "1px solid #e0e0e0",
                borderRadius: "8px 0 0 0",
              }),
              ...(i === 6 && { borderRadius: "0 8px 0 0" }),
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: "12px" }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Day cells ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          border: "1px solid #e0e0e0",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
        }}
      >
        {cells.map((cell, idx) => {
          const key = cell.currentMonth ? fmtKey(year, month, cell.day) : null;
          const events = key ? (eventMap[key] ?? []) : [];
          const today_ = isToday(cell);
          const selected = isSelected(cell);

          return (
            <Box
              key={idx}
              onClick={() => handleDayClick(cell)}
              sx={{
                minHeight: 130,
                p: 0.75,
                borderRight: isDark ? "1px solid #2a3441" : "1px solid #e0e0e0",
                borderBottom: isDark
                  ? "1px solid #2a3441"
                  : "1px solid #e0e0e0",
                outline: selected ? "2px solid #4db6ac" : "none",
                outlineOffset: "-1px",
                bgcolor: selected
                  ? isDark
                    ? "#1f3a44"
                    : "#e8f4f8"
                  : cell.currentMonth
                    ? isDark
                      ? "#18212F"
                      : "#fff"
                    : isDark
                      ? "#121821"
                      : "#fafafa",
                cursor: cell.currentMonth ? "pointer" : "default",
                transition: "background 0.15s",
                "&:hover": cell.currentMonth
                  ? {
                      bgcolor: selected
                        ? isDark
                          ? "#274a55"
                          : "#dceef5"
                        : isDark
                          ? "#1f2937"
                          : "#f9f9f9",
                    }
                  : {},
              }}
            >
              {cell.currentMonth && (
                <>
                  <Typography
                    sx={{
                      display: "block",
                      mb: 0.5,
                      fontSize: "13px",
                      fontWeight: today_ ? 700 : 400,
                    }}
                  >
                    {cell.day}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    {events.map((event) => {
                      const s = getStyle(event.event_type);
                      return (
                        <Box
                          key={event.id}
                          sx={{
                            bgcolor: s.bg,
                            borderRadius: "4px",
                            px: 0.75,
                            py: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontSize: "10px",
                              fontWeight: 500,
                              color: s.color,
                              lineHeight: 1.5,
                            }}
                          >
                            {event.event_title}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── Legend ── */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
            Conditional characters:
          </Typography>
          {LEGEND_STATIC.map((type) => {
            const s = getStyle(type);
            return (
              <Box
                key={type}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: s.dot,
                  }}
                />
                <Typography sx={{ fontSize: "12px" }}>{s.label}</Typography>
              </Box>
            );
          })}
        </Box>

        {dynamicTypes.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mt: 1,
            }}
          >
            {dynamicTypes.map((type) => {
              const s = getStyle(type);
              return (
                <Box
                  key={type}
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: s.dot,
                    }}
                  />
                  <Typography sx={{ fontSize: "12px" }}>{s.label}</Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ── Selected day events ── */}
      {selectedKey && (eventMap[selectedKey] ?? []).length > 0 && (
        <Box
          sx={{
            mx: 3,
            mb: 2,
            pt: 2,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {(eventMap[selectedKey] ?? []).map((event) => {
            const s = getStyle(event.event_type);
            return (
              <Box
                key={event.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: s.dot,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: "13px" }}>
                  {event.event_title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default MainCalendar;
