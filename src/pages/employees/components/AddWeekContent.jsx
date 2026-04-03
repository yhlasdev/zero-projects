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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createWeaklySchedule } from "../../../api/queries/post";
import { useLocale } from "../../../hooks/useLocale";

const SHIFT_DEFAULTS = {
  "Morning Shift": { start: "08:00", end: "16:00" },
  "Afternoon Shift": { start: "12:00", end: "20:00" },
  "Night Shift": { start: "16:00", end: "00:00" },
  "Day Off": { start: "00:00", end: "00:00" },
};

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatTimeForAPI = (time) => {
  if (!time) return null;
  return `${time}:00.000000`;
};

const calculateHours = (start, end) => {
  if (!start || !end) return "0.0";

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin <= startMin) {
    endMin += 24 * 60;
  }

  return ((endMin - startMin) / 60).toFixed(1);
};

const generateWeeks = () => {
  const weeks = [];
  const today = new Date();

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  for (let i = 0; i < 5; i++) {
    const start = new Date(monday);
    start.setDate(monday.getDate() + i * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const fmt = (d) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    weeks.push({
      label: `${fmt(start)} - ${fmt(end)}, ${start.getFullYear()}`,
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
      monday: new Date(start),
    });
  }

  return weeks;
};

const WEEK_OPTIONS = generateWeeks();

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
      start: "00:00",
      end: "00:00",
      hours: "0.0",
    };
  });

export default function CreateScheduleModalContent({ onClose, employeeId }) {
  const { t } = useLocale();
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [schedule, setSchedule] = useState(() =>
    buildDays(WEEK_OPTIONS[0].monday),
  );

  const handleWeekChange = (idx) => {
    setSelectedWeekIdx(idx);
    setSchedule(buildDays(WEEK_OPTIONS[idx].monday));
  };

  const handleShiftChange = (index, value) => {
    setSchedule((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const def = SHIFT_DEFAULTS[value];

        return {
          ...row,
          shift: value,
          start: def.start,
          end: def.end,
          hours:
            value === "Day Off" ? "0.0" : calculateHours(def.start, def.end),
        };
      }),
    );
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated = { ...row, [field]: value };
        updated.hours = calculateHours(updated.start, updated.end);

        return updated;
      }),
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createWeaklySchedule,
    onSuccess: () => {
      toast.success(t("employees.scheduleCreated"));
      onClose?.();
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || t("employees.scheduleExist");
      toast.error(errorMessage);
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
        start_time:
          row.shift === "Day Off" ? null : formatTimeForAPI(row.start),
        end_time: row.shift === "Day Off" ? null : formatTimeForAPI(row.end),
      })),
    };

    mutate(payload);
  };

  return (
    <>
      <Box>
        <Box
          pt={3}
          pl={3}
          pr={3}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography fontSize={20} fontWeight={700} mb={3}>
            {t("employees.createNewWeeklySchedule")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              border: "1px solid #E5E7EB",
              bgcolor: "#9F9F9F33",
              borderRadius: "6px",
              height: 32,
              width: 32,
              "&:hover": {
                bgcolor: "#E5E7EB",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box px={3}>
          {/* WEEK SELECT */}
          <Box mb={3}>
            <Typography mb={1} fontSize={14} fontWeight={500}>
              {t("employees.selectWeek")}
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedWeekIdx}
              onChange={(e) => handleWeekChange(e.target.value)}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E5E7EB",
                },
              }}
            >
              {WEEK_OPTIONS.map((w, i) => (
                <MenuItem key={w.label} value={i}>
                  {w.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* TABLE */}
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <Stack
              direction="row"
              px={2}
              py={1.5}
              bgcolor={(theme) =>
                theme.palette.mode === "light" ? "#F4F4F4" : "#1A1A1A"
              }
              sx={{ borderBottom: "1px solid #E5E7EB" }}
            >
              <Box flex={2}>
                <Typography fontSize={14} fontWeight={600} color="#6B7280">
                  {t("employees.day")}
                </Typography>
              </Box>
              <Box flex={2}>
                <Typography fontSize={14} fontWeight={600} color="#6B7280">
                  {t("employees.shift")}
                </Typography>
              </Box>
              <Box flex={3}>
                <Typography fontSize={14} fontWeight={600} color="#6B7280">
                  {t("employees.workTime")}
                </Typography>
              </Box>
              <Box flex={1} textAlign="right">
                <Typography fontSize={14} fontWeight={600} color="#6B7280">
                  {t("employees.hours")}
                </Typography>
              </Box>
            </Stack>

            {/* ROWS */}
            {schedule.map((item, index) => (
              <Box key={item.day}>
                <Stack
                  direction="row"
                  px={2}
                  py={2}
                  alignItems="center"
                  sx={{
                    // "&:hover": { bgcolor: "#F3F4F6" },
                    transition: "background-color 0.2s",
                  }}
                >
                  {/* DAY */}
                  <Box flex={2}>
                    <Typography fontWeight={600} fontSize={14}>
                      {item.day}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>

                  {/* SHIFT */}
                  <Box flex={2} mr={1}>
                    <Select
                      fullWidth
                      size="small"
                      value={item.shift}
                      onChange={(e) => handleShiftChange(index, e.target.value)}
                      sx={{
                        borderRadius: 2,
                        fontSize: 14,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E5E7EB",
                        },
                      }}
                    >
                      {Object.keys(SHIFT_DEFAULTS).map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  {/* TIME */}
                  <Box flex={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        type="time"
                        size="small"
                        value={item.start}
                        disabled={item.shift === "Day Off"}
                        onChange={(e) =>
                          handleTimeChange(index, "start", e.target.value)
                        }
                        sx={{
                          width: 110,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: 14,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#E5E7EB",
                            },
                          },
                        }}
                      />

                      <Typography color="text.secondary" fontSize={14}>
                        -
                      </Typography>

                      <TextField
                        type="time"
                        size="small"
                        value={item.end}
                        disabled={item.shift === "Day Off"}
                        onChange={(e) =>
                          handleTimeChange(index, "end", e.target.value)
                        }
                        sx={{
                          width: 110,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            // backgroundColor:
                            //   item.shift === "Day Off" ? "#F3F4F6" : "#F9FAFB",
                            fontSize: 14,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#E5E7EB",
                            },
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* HOURS */}
                  <Box flex={1} textAlign="right">
                    <Typography fontWeight={600} fontSize={14}>
                      {item.hours}
                    </Typography>
                  </Box>
                </Stack>

                {index < 6 && <Divider sx={{ borderColor: "#E5E7EB" }} />}
              </Box>
            ))}
          </Paper>

          {/* FOOTER */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            mt={3}
            pb={3}
            spacing={2}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#6B7280",
                fontWeight: 500,
                borderRadius: "8px",
                px: 3,
                "&:hover": { bgcolor: "#F3F4F6" },
              }}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={16} /> : null}
              sx={{
                bgcolor: "#1E3A5F",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                borderRadius: "8px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                "&:hover": { bgcolor: "#2C4E73" },
                "&:disabled": { bgcolor: "#9CA3AF" },
              }}
            >
              {isPending ? t("employees.creating") : t("employees.createSchedule")}
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
