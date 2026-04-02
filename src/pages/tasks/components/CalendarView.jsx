import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useColorScheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect } from "react";
import { getTaskCalendar } from "../../../api/queries/getters";

import {
  WEEKDAYS,
  MONTHS,
  getDaysInMonth,
  getFirstDayOfMonth,
  fmtKey,
  STATUS_CONFIG,
  getStatusCfg,
} from "./CalendarUtils";
import DayPanel from "./CalendarDayPanel";
import CalendarCell from "./CalendarCell";

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
