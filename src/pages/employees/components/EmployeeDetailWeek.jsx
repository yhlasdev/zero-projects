import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  useColorScheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import { useEmployeeWeekSchedule } from "../../../hooks/useEmployeeWeekSchedule";
import GlobalModal from "../../../components/modal/GlobalModal";
import CreateScheduleModalContent from "./AddWeekContent";
import { CgCalendar } from "react-icons/cg";
import { IoMdPerson } from "react-icons/io";
import { RiHomeFill } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import EditWeekContent from "./EditWeekContent";
import { useDeleteSchedule } from "./useMutation";
import CloseIcon from "@mui/icons-material/Close";

dayjs.extend(isoWeek);

const shiftColors = {
  morning: { bg: "#E3F2FD", text: "#1565C0" },
  afternoon: { bg: "#FDECEC", text: "#D32F2F" },
  night: { bg: "#EDE7F6", text: "#4527A0" },
  on_leave: { bg: "#FFF8E1", text: "#F57C00" },
  day_off: { bg: "#EEEEEE", text: "#616161" },
};

const normalizeShiftKey = (raw = "") =>
  raw.toLowerCase().replace(" shift", "").trim().replace(/\s+/g, "_");

const formatTime = (val) => {
  if (!val) return null;
  if (typeof val === "string" && /^\d{2}:\d{2}:\d{2}$/.test(val)) {
    return val.substring(0, 5);
  }
  if (typeof val === "string" && /^\d{2}:\d{2}$/.test(val)) {
    return val;
  }

  const parsed = dayjs(val, "HH:mm:ss", true);
  return parsed.isValid() ? parsed.format("HH:mm") : val;
};

export default function EmployeeView({ employee, onClose }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [openCreate, setCreate] = useState(false);
  const [openEdit, setEdit] = useState(false);
  const { mutate: deleteScheduleMutate } = useDeleteSchedule();
  const weekStart = dayjs(currentDate).startOf("isoWeek").format("YYYY-MM-DD");

  const { data, isLoading, refetch } = useEmployeeWeekSchedule(
    employee?.employee_id,
    weekStart,
  );

  const handleDeleteSchedule = () => {
    if (!data?.id) return;
    deleteScheduleMutate(data.id, {
      onSuccess: () => {
        setEdit(false);
        refetch();
      },
    });
  };

  const handleEditSuccess = () => {
    setEdit(false);
    refetch();
  };

  const start = dayjs(
    data?.week_start ?? data?.weekStart ?? currentDate,
  ).startOf("isoWeek");

  const end = dayjs(data?.week_end ?? data?.weekEnd ?? currentDate).endOf(
    "isoWeek",
  );

  const weekLabel = `${start.format("MMM DD")} - ${end.format("DD, YYYY")}`;

  return (
    <Box p={3}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #eee",
          height: 123,
          position: "relative",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          marginTop={1.5}
          marginLeft={2}
          alignItems="center"
        >
          <Avatar src={employee?.avatar} sx={{ width: 56, height: 56 }} />

          <Box>
            <Box display="flex" gap={1}>
              <Typography fontWeight={700} fontSize={20}>
                {employee?.user?.first_name}
              </Typography>
              <Typography fontWeight={700} fontSize={20}>
                {employee?.user?.last_name}
              </Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              color={"#9F9F9F"}
              fontSize={12}
              gap={2}
            >
              <Box display="flex" gap={0.5} alignItems="center">
                <CgCalendar fontSize={15} />
                <Typography variant="body2" color="text.secondary">
                  ID: {employee?.employee_id}
                </Typography>
              </Box>

              <Box display="flex" gap={0.5} alignItems="center">
                <IoMdPerson fontSize={15} />
                <Typography variant="body2">
                  {employee?.user?.preferred_name}
                </Typography>
              </Box>

              <Box display="flex" gap={0.5} alignItems="center">
                <RiHomeFill fontSize={15} />
                <Typography variant="body2">
                  {employee?.department?.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 41,
            right: 35,
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
      </Paper>

      {/* ── Weekly Header ── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography fontWeight={700} fontSize={21}>
            Weekly Schedules
          </Typography>
          <Typography variant="body2" fontWeight={400} color="text.secondary">
            View and manage work schedules by week
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.74393 2.45215H2.45226C2.12706 2.45215 1.81517 2.58134 1.58522 2.81129C1.35526 3.04125 1.22607 3.35313 1.22607 3.67834V12.2617C1.22607 12.5869 1.35526 12.8988 1.58522 13.1287C1.81517 13.3587 2.12706 13.4879 2.45226 13.4879H11.0356C11.3608 13.4879 11.6727 13.3587 11.9026 13.1287C12.1326 12.8988 12.2618 12.5869 12.2618 12.2617V7.97001"
                  stroke="white"
                  strokeWidth="1.22619"
                />
                <path
                  d="M11.3418 1.53278C11.5857 1.28888 11.9165 1.15186 12.2614 1.15186C12.6064 1.15186 12.9372 1.28888 13.1811 1.53278C13.425 1.77669 13.562 2.10749 13.562 2.45243C13.562 2.79736 13.425 3.12817 13.1811 3.37207L7.35668 9.19647L4.9043 9.80957L5.51739 7.35719L11.3418 1.53278Z"
                  stroke="white"
                  strokeWidth="1.22619"
                />
              </svg>
            }
            variant="contained"
            onClick={() => setEdit(true)}
            disabled={!data?.days?.length || isLoading}
            sx={{
              textTransform: "none",
              bgcolor: "#299764",
              width: 126,
              height: 36,
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              borderRadius: "6px",
              "&:hover": { bgcolor: "#1e6b4f" },
            }}
          >
            Edit Week
          </Button>

          <Button
            startIcon={<AddIcon />}
            onClick={() => setCreate(true)}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#0F3254",
              height: 36,
              fontSize: 11.5,
              fontWeight: 400,
              "&:hover": { backgroundColor: "#081C30" },
            }}
          >
            Create New Week
          </Button>
        </Stack>
      </Stack>

      {/* ── Navigation ── */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 2, borderRadius: 3, border: "1px solid #eee" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              disabled={isLoading}
              onClick={() => setCurrentDate((prev) => prev.subtract(1, "week"))}
              startIcon={<FiChevronLeft size={13} />}
              sx={{
                minWidth: 80,
                borderRadius: "8px",
                backgroundColor: "#f3f3f3",
                fontSize: 10,
                "&:hover": {
                  backgroundColor: "#e6e6e6",
                },
              }}
            >
              Previous
            </Button>
            <Typography>{weekLabel}</Typography>
            <Button
              disabled={isLoading}
              onClick={() => setCurrentDate((prev) => prev.add(1, "week"))}
              endIcon={<FiChevronRight size={13} />}
              sx={{
                minWidth: 80,
                borderRadius: "8px",
                fontSize: 10,
                backgroundColor: "#f3f3f3",
                "&:hover": {
                  backgroundColor: "#e6e6e6",
                },
              }}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ── Schedule Table ── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee" }}>
        <Stack
          direction="row"
          p={2}
          fontWeight={600}
          color="text.secondary"
          bgcolor="background.default"
        >
          <Box flex={2}>Day</Box>
          <Box flex={2}>Shift</Box>
          <Box flex={2}>Work Time</Box>
          <Box flex={1}>Hours</Box>
        </Stack>

        <Divider />

        {isLoading ? (
          <Box p={3} textAlign="center">
            <CircularProgress size={24} />
          </Box>
        ) : !data?.days?.length ? (
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">
              No schedule found for this week.
            </Typography>
          </Box>
        ) : (
          data.days.map((item) => {
            const shiftKey = normalizeShiftKey(
              item.shiftType ?? item.shift_type,
            );
            const color = shiftColors[shiftKey] || shiftColors.day_off;

            const startFmt = formatTime(item.startTime ?? item.start_time);
            const endFmt = formatTime(item.endTime ?? item.end_time);

            const shiftLabel = (item.shiftType ?? item.shift_type ?? "")
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            const hours =
              typeof item.hours === "number"
                ? item.hours.toFixed(1)
                : (item.hours ?? "—");

            return (
              <Stack
                key={item.id ?? item.date}
                direction="row"
                p={2}
                alignItems="center"
              >
                <Box flex={2}>
                  <Typography fontWeight={500}>
                    {start.add((item.dayOfWeek ?? item.day_of_week ?? 1) - 1, "day").format("dddd")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {start.add((item.dayOfWeek ?? item.day_of_week ?? 1) - 1, "day").format("MMM DD")}
                  </Typography>
                </Box>

                <Box flex={2}>
                  <Chip
                    label={shiftLabel}
                    sx={{
                      backgroundColor: color.bg,
                      color: color.text,
                      borderRadius: "5px",
                      fontSize: "11px",
                    }}
                  />
                </Box>

                <Box flex={2}>
                  {startFmt && endFmt ? `${startFmt} - ${endFmt}` : "—"}
                </Box>

                <Box flex={1}>{hours}</Box>
              </Stack>
            );
          })
        )}
      </Paper>

      <Paper sx={{ padding: 3, borderRadius: 3, mt: 3 }}>
        <Box sx={{ fontWeight: 700 }}>Week Summary</Box>

        <Stack direction="row" spacing={2} mt={3}>
          <SummaryCard
            title={
              data?.total_hours != null
                ? Number(data.total_hours).toFixed(1)
                : "0"
            }
            subtitle="Total Hours"
          />
          <SummaryCard
            title={data?.work_day ?? data?.workDay ?? "0"}
            subtitle="Work Days"
          />
          <SummaryCard
            title={data?.day_off ?? data?.dayOff ?? "0"}
            subtitle="Days Off"
          />
        </Stack>
      </Paper>

      <GlobalModal
        open={openCreate}
        onClose={() => setCreate(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateScheduleModalContent
          onClose={() => setCreate(false)}
          employeeId={employee?.employee_id}
        />
      </GlobalModal>

      <GlobalModal
        open={openEdit}
        onClose={() => setEdit(false)}
        maxWidth="md"
        fullWidth
      >
        <EditWeekContent
          onClose={handleEditSuccess}
          scheduleData={data}
          onDelete={handleDeleteSchedule}
        />
      </GlobalModal>
    </Box>
  );
}

function SummaryCard({ title, subtitle }) {
  const { mode } = useColorScheme();
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        borderRadius: 3,
        border: "1px solid #eee",
        textAlign: "center",
        backgroundColor: mode === 'light' && "#eeeeee",
      }}
    >
      <Typography fontSize={22} fontWeight={600}>
        {title}
      </Typography>
      <Typography color="text.secondary">{subtitle}</Typography>
    </Paper>
  );
}
