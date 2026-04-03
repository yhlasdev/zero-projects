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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { updateSchedule } from "../../../api/queries/put";
import { useLocale } from "../../../hooks/useLocale";

const SHIFT_DEFAULTS = {
  MORNING: { start: "08:00", end: "16:00" },
  AFTERNOON: { start: "12:00", end: "20:00" },
  NIGHT: { start: "16:00", end: "00:00" },
  DAY_OFF: { start: "00:00", end: "00:00" },
  ON_LEAVE: { start: "00:00", end: "00:00" },
};

const formatTimeForAPI = (time) => {
  if (!time) return null;
  return `${time}:00.000000`;
};

const formatTimeFromAPI = (time) => {
  if (!time) return "00:00";
  return time.slice(0, 5);
};

const calculateHours = (start, end) => {
  if (!start || !end) return "0.0";
  if (start === "00:00" && end === "00:00") return "0.0";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin <= startMin) {
    endMin += 24 * 60;
  }

  return ((endMin - startMin) / 60).toFixed(1);
};

export default function EditWeekContent({ onClose, scheduleData, onDelete }) {
  const { t } = useLocale();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (scheduleData?.days) {
      const formattedDays = scheduleData.days.map((day) => {
        const rawShift = (day.shift_type || day.shiftType).toUpperCase();

        const startTime = formatTimeFromAPI(
          day.start_time || day.startTime || "00:00",
        );
        const endTime = formatTimeFromAPI(
          day.end_time || day.endTime || "00:00",
        );

        return {
          day: dayjs(day.date).format("dddd"),
          date: dayjs(day.date).format("MMM DD"),
          isoDate: day.date,
          day_of_week: day.day_of_week || day.dayOfWeek,
          shift: rawShift,
          start: startTime,
          end: endTime,
          hours: day.hours,
        };
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedule(formattedDays);
    }
  }, [scheduleData]);

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
    mutationFn: updateSchedule,
    onSuccess: () => {
      toast.success(t("employees.scheduleUpdated"));
      onClose?.();
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.message || t("employees.updateScheduleFail");
      toast.error(errorMessage);
    },
  });

  const handleSubmit = () => {
    const payload = {
      schedule_id: scheduleData?.id || scheduleData?.schedule_id,
      days: schedule.map((row) => ({
        day_of_week: row.day_of_week,
        shift_type: row.shift
          .toLowerCase()
          .replace(/ /g, "_")
          .replace("_shift", ""),
        start_time:
          row.shift === "Day Off" ? null : formatTimeForAPI(row.start),
        end_time: row.shift === "Day Off" ? null : formatTimeForAPI(row.end),
      })),
    };

    mutate(payload);
  };

  const weekLabel =
    scheduleData?.week_start && scheduleData?.week_end
      ? `${dayjs(scheduleData.week_start).format("MMM DD")}-${dayjs(scheduleData.week_end).format("DD, YYYY")}`
      : scheduleData?.weekStart && scheduleData?.weekEnd
        ? `${dayjs(scheduleData.weekStart).format("MMM DD")}-${dayjs(scheduleData.weekEnd).format("DD, YYYY")}`
        : t("common.loading");

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
            {t("employees.editWeeklySchedule")}
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

        <Box px={3}>
          {/* CURRENT WEEK */}
          <Box mb={3}>
            <Typography mb={1} fontSize={14} fontWeight={500}>
              {t("employees.currentWeek")}
            </Typography>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                // bgcolor: "#F9FAFB",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography fontSize={14} color="text.primary">
                {weekLabel}
              </Typography>
            </Box>
          </Box>

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
              sx={{
                borderBottom: "1px solid #E5E7EB",
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "#F4F4F4" : "#1A1A1A",
              }}
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
                  <Box flex={2}>
                    <Typography fontWeight={600} fontSize={14}>
                      {item.day}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>

                  {/* SHIFT */}
                  <Box flex={2} mr={2}>
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
                            // backgroundColor:
                            //   item.shift === "Day Off" ? "#F3F4F6" : "#F9FAFB",
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
          <Stack direction="row" justifyContent="space-between" mt={3} pb={3}>
            <Button
              startIcon={<DeleteOutlineIcon />}
              onClick={onDelete}
              sx={{
                textTransform: "none",
                color: "#EF4444",
                fontWeight: 500,
                px: 2,
                border: "1px solid #FEE2E2",
                "&:hover": {
                  bgcolor: "#FEF2F2",
                  borderColor: "#FECACA",
                },
              }}
            >
              {t("common.delete")}
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  textTransform: "none",
                  color: "#6B7280",
                  fontWeight: 500,
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
                  borderRadius: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  "&:hover": { bgcolor: "#2C4E73" },
                  "&:disabled": { bgcolor: "#9CA3AF" },
                }}
              >
                {isPending ? t("employees.updating") : t("employees.updateSchedule")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
