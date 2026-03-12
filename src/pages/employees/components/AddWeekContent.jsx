import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createWeaklySchedule } from "../../../api/queries/post";

// ─── Week options (generate current + next 4 weeks) ──────────────────────────
const generateWeeks = () => {
  const weeks = [];
  const today = new Date();
  // start from most recent Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  for (let i = 0; i < 5; i++) {
    const start = new Date(monday);
    start.setDate(monday.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = (d) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const isoDate = (d) => d.toISOString().slice(0, 10);

    weeks.push({
      label: `${fmt(start)} - ${fmt(end)}, ${start.getFullYear()}`,
      start: isoDate(start),
      end: isoDate(end),
      monday: new Date(start),
    });
  }
  return weeks;
};

const WEEK_OPTIONS = generateWeeks();

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SHIFT_TYPES = [
  "Day Off",
  "Morning Shift",
  "Afternoon Shift",
  "Night Shift",
];

// day_of_week: Monday=1 ... Sunday=7
const buildDays = (mondayDate) =>
  DAY_NAMES.map((day, i) => {
    const date = new Date(mondayDate);
    date.setDate(mondayDate.getDate() + i);
    return {
      day,
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      isoDate: date.toISOString().slice(0, 10),
      day_of_week: i + 1,
      shift: "Day Off",
      start: "08:00",
      end: "16:00",
      hours: "0.0",
    };
  });

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateScheduleModalContent({ onClose, employeeId }) {
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [schedule, setSchedule] = useState(() =>
    buildDays(WEEK_OPTIONS[0].monday),
  );

  // Rebuild rows when week changes
  const handleWeekChange = (idx) => {
    setSelectedWeekIdx(idx);
    setSchedule(buildDays(WEEK_OPTIONS[idx].monday));
  };

  const handleShiftChange = (index, value) => {
    setSchedule((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, shift: value, hours: value === "Day Off" ? "0.0" : "8.0" }
          : row,
      ),
    );
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createWeaklySchedule,
    onSuccess: () => {
      onClose?.();
    },
    onError: (err) => {
      console.error("Create schedule error:", err);
    },
  });

  const handleSubmit = () => {
    const week = WEEK_OPTIONS[selectedWeekIdx];

    const payload = {
      employee_id: employeeId ?? 0,
      week_start: week.start,
      week_end: week.end,
      days: schedule.map((row) => ({
        date: row.isoDate,
        day_of_week: row.day_of_week,
        shift_type: row.shift,
        start_time: row.start,
        end_time: row.end,
      })),
    };

    mutate(payload);
  };

  return (
    <Box p={3}>
      {/* Title */}
      <Typography fontSize={20} fontWeight={700} mb={3}>
        Create New Weekly Schedule
      </Typography>

      {/* Select Week */}
      <Box mb={3}>
        <Typography fontSize="0.875rem" fontWeight={500} mb={1}>
          Select Week
        </Typography>
        <Select
          fullWidth
          size="small"
          value={selectedWeekIdx}
          onChange={(e) => handleWeekChange(e.target.value)}
          sx={{ borderRadius: 2 }}
        >
          {WEEK_OPTIONS.map((w, i) => (
            <MenuItem key={w.label} value={i}>
              {w.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          px={2}
          py={1.25}
          sx={{ bgcolor: "#FAFAFA" }}
        >
          <Box flex={2}>
            <Typography
              fontSize="0.8rem"
              fontWeight={600}
              color="text.secondary"
            >
              Day
            </Typography>
          </Box>
          <Box flex={2}>
            <Typography
              fontSize="0.8rem"
              fontWeight={600}
              color="text.secondary"
            >
              Shift Type
            </Typography>
          </Box>
          <Box flex={3}>
            <Typography
              fontSize="0.8rem"
              fontWeight={600}
              color="text.secondary"
            >
              Work Time
            </Typography>
          </Box>
          <Box flex={1} textAlign="right">
            <Typography
              fontSize="0.8rem"
              fontWeight={600}
              color="text.secondary"
            >
              Hours
            </Typography>
          </Box>
        </Stack>

        <Divider />

        {/* Rows */}
        {schedule.map((item, index) => (
          <Box key={item.day}>
            <Stack
              direction="row"
              alignItems="center"
              px={2}
              py={1.25}
              spacing={1}
            >
              {/* Day */}
              <Box flex={2}>
                <Typography fontWeight={600} fontSize="0.875rem">
                  {item.day}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.date}
                </Typography>
              </Box>

              {/* Shift */}
              <Box flex={2}>
                <Select
                  fullWidth
                  size="small"
                  value={item.shift}
                  onChange={(e) => handleShiftChange(index, e.target.value)}
                  sx={{ borderRadius: 1.5, fontSize: "0.8rem" }}
                >
                  {SHIFT_TYPES.map((shift) => (
                    <MenuItem
                      key={shift}
                      value={shift}
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {shift}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Work Time */}
              <Box flex={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    type="time"
                    size="small"
                    value={item.start}
                    onChange={(e) =>
                      handleTimeChange(index, "start", e.target.value)
                    }
                    inputProps={{
                      style: { fontSize: "0.8rem", padding: "6px 10px" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      width: 110,
                    }}
                  />
                  <Typography fontSize="0.875rem" color="text.secondary">
                    -
                  </Typography>
                  <TextField
                    type="time"
                    size="small"
                    value={item.end}
                    onChange={(e) =>
                      handleTimeChange(index, "end", e.target.value)
                    }
                    inputProps={{
                      style: { fontSize: "0.8rem", padding: "6px 10px" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                      width: 110,
                    }}
                  />
                </Stack>
              </Box>

              {/* Hours */}
              <Box flex={1} textAlign="right">
                <Typography fontSize="0.875rem" fontWeight={500}>
                  {item.hours}
                </Typography>
              </Box>
            </Stack>

            {index < schedule.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      {/* Footer */}
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isPending}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontWeight: 500,
            color: "text.primary",
            borderColor: "grey.300",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress size={14} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            fontWeight: 600,
            bgcolor: "#1a2e44",
            "&:hover": { bgcolor: "#243d58" },
            px: 3,
          }}
        >
          {isPending ? "Creating..." : "Create Schedule"}
        </Button>
      </Stack>
    </Box>
  );
}
