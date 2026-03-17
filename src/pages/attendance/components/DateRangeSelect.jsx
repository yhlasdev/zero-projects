import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function InlineCalendar({ value, rangeStart, rangeEnd, onSelect }) {
  const [viewDate, setViewDate] = useState(value || dayjs());

  const startOfMonth = viewDate.startOf("month");
  const daysInMonth = viewDate.daysInMonth();
  const firstDayOfWeek = startOfMonth.day();
  const offset = (firstDayOfWeek + 6) % 7;

  const prevMonth = () => setViewDate((d) => d.subtract(1, "month"));
  const nextMonth = () => setViewDate((d) => d.add(1, "month"));

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const isRangeStart = (d) => {
    if (!d || !rangeStart) return false;
    return viewDate.date(d).isSame(rangeStart, "day");
  };
  const isRangeEnd = (d) => {
    if (!d || !rangeEnd) return false;
    return viewDate.date(d).isSame(rangeEnd, "day");
  };
  const isInRange = (d) => {
    if (!d || !rangeStart || !rangeEnd) return false;
    const day = viewDate.date(d);
    return day.isAfter(rangeStart, "day") && day.isBefore(rangeEnd, "day");
  };
  // const isToday = (d) => d && viewDate.date(d).isSame(dayjs(), "day");

  return (
    <Paper
      elevation={0}
      sx={{
        width: 300,
        borderRadius: "16px",
        p: 2.5,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      {/* Header */}
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
            fontWeight: 700,
            fontSize: 16,
            // color: "#1a1a2e",
            letterSpacing: 1,
          }}
        >
          {viewDate.format("MMMM YYYY").toUpperCase()}
        </Typography>
        <Box>
          <IconButton size="small" onClick={prevMonth} >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={nextMonth} >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 1.5 }} />

      <Grid container columns={7} sx={{ mb: 0.5 }}>
        {weekDays.map((wd) => (
          <Grid size={1} key={wd} sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: 13, color: "#999", fontWeight: 400 }}>
              {wd}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Days */}
      <Grid container columns={7}>
        {days.map((d, idx) => {
          const start = isRangeStart(d);
          const end = isRangeEnd(d);
          const inRange = isInRange(d);
          const startOrEnd = start || end;

          return (
            <Grid
              item
              xs={1}
              key={idx}
              sx={{ textAlign: "center", position: "relative" }}
            >
              {d ? (
                <>
                  {(inRange || (start && rangeEnd) || (end && rangeStart)) && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: 36,
                        bgcolor: "#e8eaf6",
                        left: start ? "50%" : 0,
                        right: end ? "50%" : 0,
                        zIndex: 0,
                      }}
                    />
                  )}
                  <Box
                    onClick={() => onSelect && onSelect(viewDate.date(d))}
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: 36,
                      height: 36,
                      mx: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      cursor: "pointer",
                      bgcolor: startOrEnd ? "#0d2b5e" : "transparent",
                      color: startOrEnd
                        ? "#fff"
                        : inRange
                          ? "#1a1a2e"
                          : "",
                      fontWeight: startOrEnd ? 700 : 400,
                      fontSize: 14,
                      "&:hover": {
                        bgcolor: startOrEnd ? "#0d2b5e" : "#e3e8f0",
                      },
                    }}
                  >
                    {d}
                  </Box>
                </>
              ) : (
                <Box sx={{ width: 36, height: 36, mx: "auto" }} />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}

export default function DateRangeSelect({ value, onChange }) {
  const defaultStart = dayjs().subtract(7, "day");
  const defaultEnd = dayjs();

  const [start, setStart] = useState(
    value?.[0] ? dayjs(value[0]) : defaultStart,
  );
  const [end, setEnd] = useState(value?.[1] ? dayjs(value[1]) : defaultEnd);
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState(null);
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

  const handleInputClick = () => {
    setTempStart(start);
    setTempEnd(end);
    setSelecting("start");
    setOpen(true);
  };

  const handleSelect = (day) => {
    if (selecting === "start") {
      setTempStart(day);
      setTempEnd(null);
      setSelecting("end");
    } else {
      if (day.isBefore(tempStart)) {
        setTempEnd(tempStart);
        setTempStart(day);
      } else {
        setTempEnd(day);
      }
      setSelecting(null);
    }
  };

  const handleOk = () => {
    const s = tempStart || start;
    const e = tempEnd || end;
    setStart(s);
    setEnd(e);
    if (onChange) onChange([s, e]);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setTempStart(null);
    setTempEnd(null);
    setSelecting(null);
  };

  const displayStart = start ? start.format("DD/MM/YYYY") : "__/__/____";
  const displayEnd = end ? end.format("DD/MM/YYYY") : "__/__/____";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Box
          onClick={handleInputClick}
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #afa9a9",
            borderRadius: "12px",
            px: 1.5,
            py: 0.5,
            cursor: "pointer",
            gap: 1,
            "&:hover": { borderColor: "#0d2b5e" },
          }}
        >
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            {displayStart}
          </Typography>
          <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 300 }}>
            -
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            {displayEnd}
          </Typography>
          <CalendarMonthIcon sx={{ fontSize: 19 }} />
        </Box>

        {/* Calendar dropdown */}
        {open && (
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 1000,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: "1.5px solid #1565c0",
                borderRadius: "16px",
                overflow: "hidden",
                // bgcolor: "#fff",
              }}
            >
              <InlineCalendar
                value={tempStart || start}
                rangeStart={tempStart || start}
                rangeEnd={tempEnd || (selecting === null ? end : null)}
                onSelect={handleSelect}
              />
              {/* Cancel / Ok buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 3,
                  py: 1.5,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Button
                  onClick={handleCancel}
                  sx={{
                    color: "#1565c0",
                    fontWeight: 600,
                    fontSize: 16,
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                    "&:hover": { bgcolor: "transparent", color: "#0d2b5e" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOk}
                  sx={{
                    color: "#1565c0",
                    fontWeight: 600,
                    fontSize: 16,
                    textTransform: "none",
                    p: 0,
                    minWidth: 0,
                    "&:hover": { bgcolor: "transparent", color: "#0d2b5e" },
                  }}
                >
                  Ok
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}
