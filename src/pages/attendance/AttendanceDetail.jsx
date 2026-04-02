import {
  Box,
  Typography,
  Stack,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getEmployeeDetail } from "../../api/queries/getters";
import DateRangeSelect from "./components/DateRangeSelect";
import ExportModal from "./components/EmportModalDetail";
import DownloadIcon from "@mui/icons-material/Download";
import { formatTime } from "../../utils/formatTime";

import AttendanceSummaryCard from "./components/AttendanceSummaryCard";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceRecordCard from "./components/AttendanceRecordCard";

export default function AttendanceDetailsContent({ employee, onClose }) {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs(),
  ]);
  const [exportOpen, setExportOpen] = useState(false);

  const startDate = dateRange[0]?.format("YYYY-MM-DD");
  const endDate = dateRange[1]?.format("YYYY-MM-DD");

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      "employee-attendance",
      employee?.employee_id,
      startDate,
      endDate,
    ],
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
  const employeeName = employee?.name || "";

  return (
    <>
      <Box
        sx={{
          padding: 3,
          position: "relative",
          minHeight: "80vh",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
        <AttendanceHeader
          employeeName={employeeName}
          position={position}
          departmentName={departmentName}
          onClose={onClose}
        />

        {/* SUMMARY CARDS */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mt={1.5}
          mb={1}
        >
          <AttendanceSummaryCard
            title={avgCheckIn}
            subtitle="Avg Check In"
          />
          <AttendanceSummaryCard
            title={avgCheckOut}
            subtitle="Avg Check Out"
          />
          <AttendanceSummaryCard
            title={totalHours}
            subtitle="Total Hours"
          />
          <AttendanceSummaryCard
            title={presentDays}
            subtitle="Present Days"
          />
        </Stack>

        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ position: "relative", zIndex: 100, marginTop: 3 }}
        >
          <Typography
            fontSize={"14px"}
            fontWeight={700}
            fontStyle={"bold"}
          >
            Daily Check in / Check out Records
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              onClick={() => setExportOpen(true)}
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon sx={{ width: "14px", height: "14px" }} />}
              sx={{
                borderRadius: "8px",
                width: "88px",
                height: "32px",
                textTransform: "none",
                fontWeight: 400,
                fontSize: "14px",
                color: "#333333",
                border: "1px solid #e0e0e0",
                bgcolor: "#fff",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#1e3a5f", color: "#fff" },
              }}
            >
              Export
            </Button>
            <DateRangeSelect value={dateRange} onChange={setDateRange} />
          </Stack>
        </Box>

        {/* RECORDS LIST */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0, // Crucial for flex box scrolling
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 2,
          }}
        >
          {records.map((item) => (
            <AttendanceRecordCard key={item.attendance_id} item={item} />
          ))}
        </Box>
      </Box>

      {/* EXPORT MODAL */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        employee={employee}
        attendance={attendance}
        dateRange={dateRange}
      />
    </>
  );
}
