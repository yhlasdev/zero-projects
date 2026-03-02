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
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import { useEmployeeWeekSchedule } from "../../../hooks/useEmployeeWeekSchedule";
import GlobalModal from "../../../components/modal/GlobalModal";
import CreateScheduleModalContent from "./AddWeekContent";

dayjs.extend(isoWeek);

const shiftColors = {
  morning: { bg: "#E3F2FD", text: "#1565C0" },
  afternoon: { bg: "#FDECEC", text: "#D32F2F" },
  night: { bg: "#EDE7F6", text: "#4527A0" },
  on_leave: { bg: "#FFF8E1", text: "#F57C00" },
  day_off: { bg: "#EEEEEE", text: "#616161" },
};

export default function EmployeeView({ employee }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [openCreate, setCreate] = useState(false);

  const weekStart = dayjs(currentDate).startOf("isoWeek").format("YYYY-MM-DD");

  const { data, isLoading } = useEmployeeWeekSchedule(
    employee?.employee_id,
    weekStart,
  );

  const weekLabel = data
    ? `${dayjs(data.weekStart).format("MMM DD")} - ${dayjs(data.weekEnd).format(
        "DD, YYYY",
      )}`
    : "";

  return (
    <Box p={3}>
      {/* EMPLOYEE HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #eee",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={employee?.avatar} sx={{ width: 56, height: 56 }} />

          <Box>
            <Box display="flex" gap={1}>
              <Typography fontWeight={600}>
                {employee?.user?.first_name}
              </Typography>
              <Typography fontWeight={600}>
                {employee?.user?.last_name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                ID: {employee?.employee_id}
              </Typography>

              <Box display="flex" gap={0.5} alignItems="center">
                <PersonOutlineIcon fontSize="small" />
                <Typography variant="body2">
                  {employee?.user?.preferred_name}
                </Typography>
              </Box>

              <Box display="flex" gap={0.5} alignItems="center">
                <HomeOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  {employee?.department?.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* WEEKLY HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography fontWeight={600}>Weekly Schedules</Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage work schedules by week
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
          >
            Edit Week
          </Button>

          <Button
            startIcon={<AddIcon />}
            onClick={() => setCreate(true)}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#0A2540",
              "&:hover": { backgroundColor: "#081C30" },
            }}
          >
            Create New Week
          </Button>
        </Stack>
      </Stack>

      {/* NAVIGATION */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid #eee",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setCurrentDate((prev) => prev.subtract(1, "week"))}
            >
              Previous
            </Button>

            <Typography fontWeight={500}>{weekLabel}</Typography>

            <Button
              size="small"
              variant="outlined"
              onClick={() => setCurrentDate((prev) => prev.add(1, "week"))}
            >
              Next
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button size="small" startIcon={<PrintIcon />} variant="outlined">
              Print
            </Button>

            <Button
              size="small"
              startIcon={<FileDownloadIcon />}
              variant="outlined"
            >
              Export
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => setCurrentDate(dayjs())}
            >
              Current Week
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #eee",
        }}
      >
        <Stack direction="row" p={2} fontWeight={600} color="text.secondary">
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
        ) : (
          data?.days?.map((item) => {
            const color = shiftColors[item.shiftType] || shiftColors.day_off;

            return (
              <Stack key={item.id} direction="row" p={2} alignItems="center">
                <Box flex={2}>
                  <Typography fontWeight={500}>
                    {dayjs(item.date).format("dddd")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(item.date).format("MMM DD")}
                  </Typography>
                </Box>

                <Box flex={2}>
                  <Chip
                    label={item.shiftType
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    sx={{
                      backgroundColor: color.bg,
                      color: color.text,
                    }}
                  />
                </Box>

                <Box flex={2}>
                  {item.startTime && item.endTime
                    ? `${dayjs(item.startTime).format("HH:mm")} - ${dayjs(
                        item.endTime,
                      ).format("HH:mm")}`
                    : "—"}
                </Box>

                <Box flex={1}>{item.hours.toFixed(1)}</Box>
              </Stack>
            );
          })
        )}
      </Paper>

      {/* SUMMARY */}
      <Paper sx={{ padding: 3, borderRadius: 3, mt: 3 }}>
        <Box sx={{ fontWeight: 700 }}>Week Summary</Box>

        <Stack direction="row" spacing={2} mt={3}>
          <SummaryCard
            title={data?.total_hours?.toFixed(1)}
            subtitle="Total Hours"
          />
          <SummaryCard title={data?.work_day} subtitle="Work Days" />
          <SummaryCard title={data?.day_off} subtitle="Days Off" />
        </Stack>
      </Paper>

      <GlobalModal
        open={openCreate}
        onClose={() => setCreate(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateScheduleModalContent onClose={() => setCreate(false)} />
      </GlobalModal>
    </Box>
  );
}

function SummaryCard({ title, subtitle }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        borderRadius: 3,
        border: "1px solid #eee",
        textAlign: "center",
      }}
    >
      <Typography fontSize={22} fontWeight={600}>
        {title}
      </Typography>
      <Typography color="text.secondary">{subtitle}</Typography>
    </Paper>
  );
}
