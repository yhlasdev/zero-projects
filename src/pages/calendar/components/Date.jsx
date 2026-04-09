import { useState } from "react";
import GlobalModal from "../../../components/modal/GlobalModal";
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
import HeaderAppBar from "../../../components/appBar/AppBar";
import { deleteCalendar } from "../../../api/queries/delete";
import { useAppMutation } from "../../../hooks/useMutation";

import {
  LEGEND_STATIC,
  getEventStyles,
  getDaysInMonth,
  getFirstDayOfMonth,
  fmtKey,
  getThemeColors,
} from "./DateUtils";
import DateCell from "./DateCell";
import DateLegend from "./DateLegend";
import DateSelectedDetails from "./DateSelectedDetails";
import EditCalendarModal from "./EditCalendarModal";

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
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEditEvent = (event) => setEditingEvent(event);
  const handleCloseEditModal = () => setEditingEvent(null);

  const deleteMutation = useAppMutation({
    mutationFn: deleteCalendar,
    queryKey: ["mainCalendar"],
  });

  const handleDeleteEvent = async (event) => {
    await deleteMutation.mutateAsync(event.id);
  };

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
        if (key) {
          map[key] = (events ?? []).map((ev) => ({ ...ev, date: key }));
        }
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

  const { borderColor } = getThemeColors(isDark);

  return (
    <Box sx={{ position: "relative" }}>
      <HeaderAppBar>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handlePrev}
            size="small"
            sx={{
              color: isDark ? "#9ca3af" : "#6b7280",
              "&:hover": { color: isDark ? "#e5e7eb" : "#111827" },
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>

          <Typography
            sx={{ fontWeight: 700, fontSize: "18px", letterSpacing: 0, color: "text.primary" }}
          >
            {MONTHS[month]} {year}
          </Typography>

          <IconButton
            onClick={handleNext}
            size="small"
            sx={{
              color: isDark ? "#9ca3af" : "#6b7280",
              "&:hover": { color: isDark ? "#e5e7eb" : "#111827" },
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      </HeaderAppBar>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "0 0 10px 10px",
          border: `1px solid ${borderColor}`,
          borderTop: "none",
          overflow: "hidden",
          position: "relative",
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
              bgcolor: isDark ? "rgba(18,24,33,0.6)" : "rgba(255,255,255,0.6)",
              borderRadius: 2,
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}

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

            return (
              <DateCell
                key={idx}
                cell={cell}
                idx={idx}
                totalCells={totalCells}
                events={events}
                today_={today_}
                sel={sel}
                handleDayClick={handleDayClick}
                isDark={isDark}
                EVENT_STYLES={EVENT_STYLES}
              />
            );
          })}
        </Box>

        {/* ── Legend ── */}
        <DateLegend
          EVENT_STYLES={EVENT_STYLES}
          dynamicTypes={dynamicTypes}
          isDark={isDark}
          t={t}
        />

        {/* ── Selected day detail ── */}
        <DateSelectedDetails
          selectedEvents={eventMap[selectedKey]}
          EVENT_STYLES={EVENT_STYLES}
          borderColor={borderColor}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </Paper>

      {/* ── Edit Task Modal ── */}
      <GlobalModal
        open={Boolean(editingEvent)}
        onClose={handleCloseEditModal}
        width="708"
      >
        <EditCalendarModal
          event={editingEvent}
          onClose={handleCloseEditModal}
        />
      </GlobalModal>
    </Box>
  );
};

export default MainCalendar;
