import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useColorScheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskCalendar } from "../../../api/queries/getters";
import CalendarCell from "./CalendarCell";
import CalendarDayPanel from "./CalendarDayPanel";
import GlobalModal from "../../../components/modal/GlobalModal";
import EditTaskContent from "./EditTaskContent";
import { useLocale } from "../../../hooks/useLocale";

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

const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const CalendarView = () => {
  const { t } = useLocale();
  const { mode } = useColorScheme();

  const WEEKDAYS = [
    t("calendar.sun", { defaultValue: "Sun" }),
    t("calendar.mon", { defaultValue: "Mon" }),
    t("calendar.tue", { defaultValue: "Tue" }),
    t("calendar.wed", { defaultValue: "Wed" }),
    t("calendar.thu", { defaultValue: "Thu" }),
    t("calendar.fri", { defaultValue: "Fri" }),
    t("calendar.sat", { defaultValue: "Sat" }),
  ];

  const MONTHS = [
    t("calendar.months.january", { defaultValue: "January" }),
    t("calendar.months.february", { defaultValue: "February" }),
    t("calendar.months.march", { defaultValue: "March" }),
    t("calendar.months.april", { defaultValue: "April" }),
    t("calendar.months.may", { defaultValue: "May" }),
    t("calendar.months.june", { defaultValue: "June" }),
    t("calendar.months.july", { defaultValue: "July" }),
    t("calendar.months.august", { defaultValue: "August" }),
    t("calendar.months.september", { defaultValue: "September" }),
    t("calendar.months.october", { defaultValue: "October" }),
    t("calendar.months.november", { defaultValue: "November" }),
    t("calendar.months.december", { defaultValue: "December" }),
  ];

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
  const { year, month } = current;
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [editingTask, setEditingTask] = useState(null);

  const { data: response, isLoading: loading } = useQuery({
    queryKey: ["taskCalendar", year, month],
    queryFn: () => getTaskCalendar({ month: month + 1, year }),
    select: (res) => (Array.isArray(res?.data?.data) ? res?.data?.data : []),
  });
  const calendarData = response || [];

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

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        position: "relative",
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

          return (
            <CalendarCell
              key={i}
              cell={cell}
              mode={mode}
              today_={today_}
              selected={selected}
              handleDayClick={handleDayClick}
              tasks={tasks}
            />
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
                width: 16,
                height: 16,
                borderRadius: "4px",
                bgcolor: cfg.border,
              }}
            />
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
              {cfg.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <CalendarDayPanel
        dateKey={selectedKey}
        tasks={selectedKey ? (taskMap[selectedKey] ?? []) : []}
        onEdit={(task) => setEditingTask(task)}
      />

      <GlobalModal
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        maxWidth="sm"
        fullWidth
      >
        <EditTaskContent
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      </GlobalModal>
    </Box>
  );
};

export default CalendarView;
