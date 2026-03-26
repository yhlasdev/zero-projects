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
import { useLocale } from "../../../hooks/useLocale";

const getEventStyles = (t) => ({
  public_holiday: {
    bg: "#fce4ec",
    color: "#c62828",
    dot: "#e53935",
    label: t("calendar.types.public_holiday"),
  },
  company_event: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: t("calendar.types.company_event"),
  },
  department_event: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: t("calendar.types.department_event"),
  },
  note: { bg: "#fffde7", color: "#f57f17", dot: "#fdd835", label: t("calendar.types.note") },
  engineering_team: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: t("calendar.types.engineering_team"),
  },
  all_hands: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: t("calendar.types.all_hands"),
  },
  default: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: t("calendar.types.event") },
});

const LEGEND_STATIC = [
  "public_holiday",
  "company_event",
  "department_event",
  "note",
];

const getStyle = (event_type = "", styles) =>
  styles[event_type.toLowerCase()] ?? styles.default;

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const MainCalendar = () => {
  const { t } = useLocale();
  const today = new Date();
  const { mode } = useColorScheme();
  const isDark = mode === "dark";

  const MONTHS = [
    t("calendar.months.january"),
    t("calendar.months.february"),
    t("calendar.months.march"),
    t("calendar.months.april"),
    t("calendar.months.may"),
    t("calendar.months.june"),
    t("calendar.months.july"),
    t("calendar.months.august"),
    t("calendar.months.september"),
    t("calendar.months.october"),
    t("calendar.months.november"),
    t("calendar.months.december"),
  ];

  const WEEKDAYS = [
    t("calendar.weekdays.sun"),
    t("calendar.weekdays.mon"),
    t("calendar.weekdays.tue"),
    t("calendar.weekdays.wed"),
    t("calendar.weekdays.thu"),
    t("calendar.weekdays.fri"),
    t("calendar.weekdays.sat"),
  ];

  const EVENT_STYLES = getEventStyles(t);

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

  /* ─── border / bg tokens (light / dark) ─── */
  const borderColor = isDark ? "#2a3441" : "#e5e7eb";
  const cellBg = isDark ? "#18212F" : "#ffffff";
  const cellBgOther = isDark ? "#121821" : "#fafafa";
  const cellBgSel = isDark ? "#1f3a44" : "#e8f6f5";
  const cellBgSelHov = isDark ? "#274a55" : "#d5eeec";
  const cellBgHov = isDark ? "#1f2937" : "#f5f5f5";
  const tealAccent = "#4db6ac";

  return (
    /* ── Outer wrapper positions arrows at absolute edges ── */
    <Box sx={{ position: "relative" }}>
      {/* ── Left arrow — flush to the outer left edge ── */}
      <IconButton
        onClick={handlePrev}
        size="small"
        sx={{
          position: "absolute",
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          color: isDark ? "#9ca3af" : "#6b7280",
          "&:hover": { color: isDark ? "#e5e7eb" : "#111827" },
        }}
      >
        <ChevronLeft fontSize="small" />
      </IconButton>

      {/* ── Right arrow — flush to the outer right edge ── */}
      <IconButton
        onClick={handleNext}
        size="small"
        sx={{
          position: "absolute",
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          color: isDark ? "#9ca3af" : "#6b7280",
          "&:hover": { color: isDark ? "#e5e7eb" : "#111827" },
        }}
      >
        <ChevronRight fontSize="small" />
      </IconButton>

      {/* ── Card ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              bgcolor: isDark ? "rgba(18,24,33,0.6)" : "rgba(255,255,255,0.6)",
              borderRadius: 2,
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}

        {/* ── Month / Year title ── */}
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: "18px", letterSpacing: 0 }}
          >
            {MONTHS[month]} {year}
          </Typography>
        </Box>

        {/* ── Weekday header row ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          {WEEKDAYS.map((d, i) => (
            <Box
              key={d}
              sx={{
                py: 1,
                textAlign: "center",
                borderRight: i < 6 ? `1px solid ${borderColor}` : "none",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "12px",
                  color: isDark ? "#9ca3af" : "#6b7280",
                }}
              >
                {d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ── Day cell grid ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
          }}
        >
          {cells.map((cell, idx) => {
            const key = cell.currentMonth
              ? fmtKey(year, month, cell.day)
              : null;
            const events = key ? (eventMap[key] ?? []) : [];
            const today_ = isToday(cell);
            const sel = isSelected(cell);

            /* column position (0-based) */
            const col = idx % 7;
            /* last row index */
            const lastRowStart = totalCells - 7;
            const isLastRow = idx >= lastRowStart;

            return (
              <Box
                key={idx}
                onClick={() => handleDayClick(cell)}
                sx={{
                  minHeight: 130,
                  p: 0.75,
                  /* borders: right for all except last col, bottom for all except last row */
                  borderRight: col < 6 ? `1px solid ${borderColor}` : "none",
                  borderBottom: !isLastRow
                    ? `1px solid ${borderColor}`
                    : "none",
                  /* selected ring drawn with outline so it overlaps borders */
                  outline: sel ? `2px solid ${tealAccent}` : "none",
                  outlineOffset: "-1px",
                  bgcolor: sel
                    ? cellBgSel
                    : cell.currentMonth
                      ? cellBg
                      : cellBgOther,
                  cursor: cell.currentMonth ? "pointer" : "default",
                  transition: "background 0.12s",
                  "&:hover": cell.currentMonth
                    ? { bgcolor: sel ? cellBgSelHov : cellBgHov }
                    : {},
                }}
              >
                {cell.currentMonth && (
                  <>
                    {/* Day number */}
                    <Typography
                      sx={{
                        display: "block",
                        mb: 0.5,
                        fontSize: "13px",
                        fontWeight: today_ ? 700 : 400,
                        color: today_
                          ? tealAccent
                          : isDark
                            ? "#e5e7eb"
                            : "#111827",
                      }}
                    >
                      {cell.day}
                    </Typography>

                    {/* Events */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                      }}
                    >
                      {events.map((event) => {
                        const s = getStyle(event.event_type, EVENT_STYLES);
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
        <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
              {t("calendar.legendTitle")}
            </Typography>
            {LEGEND_STATIC.map((type) => {
              const s = getStyle(type, EVENT_STYLES);
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
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: isDark ? "#d1d5db" : "#374151",
                    }}
                  >
                    {s.label}
                  </Typography>
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
                const s = getStyle(type, EVENT_STYLES);
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
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: isDark ? "#d1d5db" : "#374151",
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* ── Selected day detail ── */}
        {selectedKey && (eventMap[selectedKey] ?? []).length > 0 && (
          <Box
            sx={{
              mx: 3,
              mb: 2,
              pt: 2,
              borderTop: `1px solid ${borderColor}`,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {(eventMap[selectedKey] ?? []).map((event) => {
              const s = getStyle(event.event_type, EVENT_STYLES);
              return (
                <Box
                  key={event.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.8,
                  }}
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
    </Box>
  );
};

export default MainCalendar;
