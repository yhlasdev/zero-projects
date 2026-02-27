import { Box, Typography, Paper, Stack, Chip, IconButton, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDetail } from "../../api/queries/getters";
import DateRangeSelect from "./components/DateRangeSelect";
import CloseIcon from "@mui/icons-material/Close";
import { formatTime } from "../../utils/formatTime";

export default function AttendanceDetailsContent({ employee, onClose }) {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs(),
  ]); const startDate = dateRange[0]?.format("YYYY-MM-DD");
  const endDate = dateRange[1]?.format("YYYY-MM-DD");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["employee-attendance", employee?.employee_id, startDate, endDate],
    queryFn: () =>
      getEmployeeDetail({
        employee_id: employee.employee_id,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!employee,
  });

  useEffect(() => {
    if (employee && startDate && endDate) refetch();
  }, [employee, startDate, endDate]);

  const attendance = data?.data?.data || {};
  const records = attendance?.attendances || [];
  const avgCheckIn = formatTime(attendance?.avg_check_in);
  const avgCheckOut = formatTime(attendance?.avg_check_out);
  const totalHours = attendance?.total_hours?.toFixed(1) || "-";
  const presentDays = attendance?.present_days || "-";
  const departmentName = employee?.department || "-";
  const position = employee?.position || "-";
  const employeeName = employee?.name || '';

  return (
    <Paper sx={{ padding: 3, position: "relative" }}>
      {/* LOADING OVERLAY */}
      {isFetching && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Box>
          <Typography variant="body2" color="text.secondary">Attendance Details</Typography>
          <Typography py={1} fontSize={25} fontWeight={600}>{employeeName}</Typography>
          <Typography variant="body2" color="text.secondary">{position} • {departmentName}</Typography>
        </Box>
        <IconButton size="small" onClick={() => onClose(false)}><CloseIcon /></IconButton>
      </Stack>

      {/* SUMMARY CARDS */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={1.5} mb={1}>
        <SummaryCard title={avgCheckIn} subtitle="Avg Check In" />
        <SummaryCard title={avgCheckOut} subtitle="Avg Check Out" />
        <SummaryCard title={totalHours} subtitle="Total Hours" />
        <SummaryCard title={presentDays} subtitle="Present Days" />
      </Stack>

      {/* DATE RANGE SELECT */}
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography>Daily Check in / Check out Records</Typography>
        <DateRangeSelect value={dateRange} onChange={setDateRange} />
      </Box>

      {/* RECORDS LIST */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "calc(100vh - 420px)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 2
        }}
      >
        {records.map((item) => {
          const dayNumber = dayjs(item.work_date).format("DD");
          return (
            <Paper
              key={item.attendance_id}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                width: "100%",
                boxSizing: "border-box",
              }}
              elevation={0}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                justifyContent={'space-between'}
                spacing={3}
              >
                <Box display={'flex'} gap={2} alignItems={'center'}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      backgroundColor: "#0A2540",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography fontWeight={600}>{dayNumber}</Typography>
                  </Box>

                  <Box width={{ xs: "100%", sm: "auto" }}>
                    <Typography fontWeight={500}>{dayjs(item.work_date).format("DD.MM.YYYY")}</Typography>
                    <Typography variant="body2" color="text.secondary">{dayjs(item.work_date).format("ddd")}</Typography>
                  </Box>
                </Box>
                <InfoBlock label="CHECK IN" value={formatTime(item.check_in)} />
                <InfoBlock label="CHECK OUT" value={formatTime(item.check_out)} />
                <InfoBlock label="HOURS" value={item.hours?.toFixed(1) || "-"} />

                <Box ml="auto">
                  <Chip label={item.status} color={item.status === "Present" ? "success" : "default"} />
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}

function SummaryCard({ title, subtitle }) {
  return (
    <Paper sx={{ flex: 1, p: 2, borderRadius: 3, border: "1px solid #e0e0e0" }} elevation={0}>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Paper>
  );
}

function InfoBlock({ label, value }) {
  return (
    <Box width={100}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  );
}