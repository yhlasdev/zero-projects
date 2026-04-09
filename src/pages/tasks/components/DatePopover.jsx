import { Popover, Box, Typography, IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { DATE_SHORTCUTS } from "./CreateTaskUtils";

export default function DatePopover({
  anchorEl,
  onClose,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  t,
  isSingleDate = false,
}) {
  const [pickingDate, setPickingDate] = useState("start");
  const [calView, setCalView] = useState(dayjs());

  useEffect(() => {
    if (anchorEl) {
      setPickingDate("start");
      setCalView(startDate || dayjs());
    }
  }, [anchorEl, startDate]);

  const calDays = useMemo(() => {
    const start = calView.startOf("month");
    const offset = (start.day() + 6) % 7;
    const total = start.daysInMonth();
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [calView]);

  const WEEK_DAYS = [
    t("calendar.mon", { defaultValue: "Пн" }),
    t("calendar.tue", { defaultValue: "Вт" }),
    t("calendar.wed", { defaultValue: "Ср" }),
    t("calendar.thu", { defaultValue: "Чт" }),
    t("calendar.fri", { defaultValue: "Пт" }),
    t("calendar.sat", { defaultValue: "Сб" }),
    t("calendar.sun", { defaultValue: "Вс" }),
  ];

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          mt: 0.5,
          boxShadow: (theme) => theme.shadows[10],
          overflow: "hidden",
          width: isSingleDate ? 500 : 580,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 2.5,
          pt: 2.5,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          onClick={() => setPickingDate("start")}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
            bgcolor: "action.hover",
            border:
              pickingDate === "start"
                ? "2px solid var(--mui-palette-primary-main)"
                : "2px solid transparent",
            borderRadius: "10px",
            px: 1.5,
            py: 1.2,
            transition: "border 0.15s",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              bgcolor: "#e0e0e0",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 15, color: "#555" }} />
          </Box>
          <Typography
            sx={{
              fontSize: 15,
              color: startDate ? "#0f172a" : "#777",
              fontWeight: startDate ? 500 : 400,
            }}
          >
            {startDate ? startDate.format("DD MMM YYYY") : t("tasks.dueDate")}
          </Typography>
        </Box>

        {!isSingleDate && (
          <Box
            onClick={() => setPickingDate("end")}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              bgcolor: "background.paper",
              border:
                pickingDate === "end"
                  ? "2px solid var(--mui-palette-primary-main)"
                  : "2px solid var(--mui-palette-divider)",
              borderRadius: "10px",
              px: 1.5,
              py: 1.2,
              transition: "border 0.15s",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                border: "1.5px solid #ccc",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 15, color: "#aaa" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                color: endDate ? "#0f172a" : "#aaa",
                fontWeight: endDate ? 500 : 400,
              }}
            >
              {endDate ? endDate.format("DD MMM YYYY") : t("tasks.dueDate")}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: 210, borderRight: "1px solid #f0f3f8", py: 1 }}>
          {DATE_SHORTCUTS.map((s) => {
            const targetDate = s.fn
              ? s.fn()
              : s.days !== null
                ? s.days === 0
                  ? dayjs()
                  : dayjs().add(s.days, "day")
                : null;
            const note = s.note ? s.note() : null;
            const activeDate = pickingDate === "start" ? startDate : endDate;
            const isSelected =
              activeDate &&
              targetDate &&
              activeDate.isSame(targetDate, "day");
            return (
              <Box
                key={s.label}
                onClick={() => {
                  if (!targetDate) return;
                  if (pickingDate === "start") {
                    setStartDate(targetDate);
                    setCalView(targetDate);
                    if (isSingleDate) {
                      onClose();
                    } else {
                      setPickingDate("end");
                    }
                  } else {
                    setEndDate(targetDate);
                    setCalView(targetDate);
                    onClose();
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 3,
                  py: 1.1,
                  cursor: "pointer",
                  bgcolor: isSelected ? "action.selected" : "transparent",
                  "&:hover": { bgcolor: "action.hover" },
                  transition: "background 0.1s",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "text.primary",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {s.label}
                </Typography>
                {note && (
                  <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
                    {note}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Right: calendar */}
        <Box sx={{ flex: 1, px: 2.5, py: 2 }}>
          {/* Month nav */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: 0.5,
              }}
            >
              {calView.format("MMMM YYYY").toUpperCase()}
            </Typography>
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="small"
                onClick={() => setCalView((v) => v.subtract(1, "month"))}
                sx={{
                  p: 0.4,
                  color: "#9ca3af",
                  "&:hover": { bgcolor: "#f0f4ff" },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setCalView((v) => v.add(1, "month"))}
                sx={{
                  p: 0.4,
                  color: "#9ca3af",
                  "&:hover": { bgcolor: "#f0f4ff" },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Weekday headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              mb: 0.5,
            }}
          >
            {WEEK_DAYS.map((d) => (
              <Typography
                key={d}
                sx={{
                  fontSize: 12,
                  color: "#9ca3af",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              rowGap: 0.2,
            }}
          >
            {calDays.map((d, i) => {
              if (!d) return <Box key={i} sx={{ height: 38 }} />;
              const thisDay = calView.date(d);
              const isToday = thisDay.isSame(dayjs(), "day");
              const isStart = startDate && thisDay.isSame(startDate, "day");
              const isEnd = endDate && thisDay.isSame(endDate, "day");
              const isMarked = isStart || isEnd;
              return (
                <Box
                  key={i}
                  onClick={() => {
                    if (pickingDate === "start") {
                      setStartDate(thisDay);
                      if (isSingleDate) {
                        onClose();
                      } else {
                        setPickingDate("end");
                      }
                    } else {
                      setEndDate(thisDay);
                      onClose();
                    }
                  }}
                  sx={{
                    height: 38,
                    width: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    mx: "auto",
                    bgcolor: isMarked ? "primary.main" : "transparent",
                    color: isMarked ? "primary.contrastText" : "text.primary",
                    fontWeight: isMarked || isToday ? 700 : 400,
                    fontSize: 14,
                    outline:
                      isToday && !isMarked
                        ? (theme) => `2px solid ${theme.palette.primary.main}`
                        : "none",
                    outlineOffset: "-2px",
                    "&:hover": {
                      bgcolor: isMarked ? "primary.dark" : "action.hover",
                    },
                    transition: "all 0.1s",
                  }}
                >
                  {d}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}
