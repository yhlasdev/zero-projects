import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
} from "@mui/icons-material";

const DateSelect = () => {
  const EVENTS = [
    {
      id: 1,
      date: "2026-01-01",
      title: "New Year Holiday",
      type: "publicHoliday",
    },
    {
      id: 2,
      date: "2026-01-09",
      title: "Engineering Team Meeting",
      type: "engineeringTeam",
    },
    {
      id: 3,
      date: "2026-01-23",
      title: "All Hands Meeting",
      type: "allHandsMeeting",
    },
    {
      id: 4,
      date: "2026-01-23",
      title: "Engineering Team Meeting",
      type: "engineeringTeam",
    },
    {
      id: 5,
      date: "2026-01-25",
      title: "Engineering Team Meeting",
      type: "engineeringTeam",
    },
  ];

  const EVENT_STYLES = {
    publicHoliday: {
      bg: "#fce4ec",
      color: "#c62828",
      dot: "#e53935",
      label: "Public Holiday",
    },
    companyEvent: {
      bg: "#e8f5e9",
      color: "#2e7d32",
      dot: "#43a047",
      label: "Company Event",
    },
    departmentEvent: {
      bg: "#e3f2fd",
      color: "#1565c0",
      dot: "#1e88e5",
      label: "Department Event",
    },
    note: {
      bg: "#fffde7",
      color: "#f57f17",
      dot: "#fdd835",
      label: "Note",
    },
    engineeringTeam: {
      bg: "#e3f2fd",
      color: "#1565c0",
      dot: "#1e88e5",
      label: "Engineering Team",
    },
    allHandsMeeting: {
      bg: "#e8f5e9",
      color: "#2e7d32",
      dot: "#43a047",
      label: "All Hands Meeting",
    },
  };

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [view, setView] = useState("month");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return EVENTS.filter((e) => e.date === dateStr);
  };

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null;
  });

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const legendItems = [
    { type: "publicHoliday" },
    { type: "companyEvent" },
    { type: "departmentEvent" },
    { type: "note" },
    { type: "engineeringTeam" },
    { type: "allHandsMeeting" },
  ];

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      {/* Month Navigation */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, gap: 2 }}>
        <IconButton onClick={handlePrev} size="small" sx={{ color: "#555" }}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#1a1a1a", minWidth: 140, textAlign: "center" }}>
          {MONTHS[month]} {year}
        </Typography>
        <IconButton onClick={handleNext} size="small" sx={{ color: "#555" }}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* Day Headers */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0 }}>
        {DAYS.map((day) => (
          <Box
            key={day}
            sx={{
              py: 1,
              textAlign: "center",
              borderBottom: "1px solid #e0e0e0",
              borderRight: "1px solid #e0e0e0",
              "&:first-of-type": { borderLeft: "1px solid #e0e0e0" },
            }}
          >
            <Typography variant="caption" sx={{ color: "#666", fontWeight: 500, fontSize: "0.75rem" }}>
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          border: "1px solid #e0e0e0",
          borderTop: "none",
        }}
      >
        {cells.map((day, idx) => {
          const events = day ? getEventsForDay(day) : [];
          const isCurrentDay = day ? isToday(day) : false;
          const isSelected = day === 23 && month === 0 && year === 2026;

          return (
            <Box
              key={idx}
              sx={{
                minHeight: 130,
                p: 0.75,
                borderRight: "1px solid #e0e0e0",
                borderBottom: "1px solid #e0e0e0",
                bgcolor: isSelected ? "#e8f4f8" : day ? "#fff" : "#fafafa",
                "&:nth-of-type(7n+1)": { borderLeft: "none" },
                cursor: day ? "pointer" : "default",
                "&:hover": day ? { bgcolor: isSelected ? "#dceef5" : "#f9f9f9" } : {},
              }}
            >
              {day && (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 0.5,
                      color: isCurrentDay ? "#1a2e4a" : "#333",
                      fontWeight: isCurrentDay ? 700 : 400,
                      fontSize: "0.8rem",
                    }}
                  >
                    {day}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                    {events.map((event) => {
                      const style = EVENT_STYLES[event.type];
                      return (
                        <Box
                          key={event.id}
                          sx={{
                            bgcolor: style.bg,
                            borderRadius: 0.5,
                            px: 0.75,
                            py: 0.2,
                            overflow: "hidden",
                          }}
                        >
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{
                              color: style.color,
                              fontSize: "0.65rem",
                              fontWeight: 500,
                              display: "block",
                            }}
                          >
                            {event.title}
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

      {/* Legend */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="caption" sx={{ color: "#555", fontWeight: 600, fontSize: "0.75rem" }}>
            Conditional characters:
          </Typography>
          {["publicHoliday", "companyEvent", "departmentEvent", "note"].map((type) => {
            const style = EVENT_STYLES[type];
            return (
              <Box key={type} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: style.dot,
                  }}
                />
                <Typography variant="caption" sx={{ color: "#555", fontSize: "0.72rem" }}>
                  {style.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mt: 1 }}>
          {["engineeringTeam", "allHandsMeeting"].map((type) => {
            const style = EVENT_STYLES[type];
            return (
              <Box key={type} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: style.dot,
                  }}
                />
                <Typography variant="caption" sx={{ color: "#555", fontSize: "0.72rem" }}>
                  {style.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  )
}

export default DateSelect