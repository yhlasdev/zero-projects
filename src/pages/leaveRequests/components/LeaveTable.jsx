import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  IconButton,
  CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocale } from "../../../hooks/useLocale";

const rows = [
  {
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    department: "Engineering",
    leaveType: "Annual",
    startDate: "2024-02-05",
    endDate: "2024-02-09",
    days: 5,
    status: "Pending"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    department: "Marketing",
    leaveType: "Sick",
    startDate: "2024-01-24",
    endDate: "2024-01-25",
    days: 2,
    status: "Approved"
  },
  {
    name: "James Thompson",
    role: "Sales Representative",
    department: "Sales",
    leaveType: "Annual",
    startDate: "2024-02-12",
    endDate: "2024-02-16",
    days: 5,
    status: "Pending"
  },
  {
    name: "Jennifer Lee",
    role: "Financial Analyst",
    department: "Finance",
    leaveType: "Unpaid",
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    days: 7,
    status: "Pending"
  },
  {
    name: "Rachel Green",
    role: "Software Engineer",
    department: "Engineering",
    leaveType: "Annual",
    startDate: "2024-01-29",
    endDate: "2024-02-02",
    days: 5,
    status: "Approved"
  }
];

const statusColors = {
  Pending: {
    bg: "#FEF3C7",
    color: "#D97706"
  },
  Approved: {
    bg: "#DCFCE7",
    color: "#15803D"
  },
  Rejected: {
    bg: "#FEE2E2",
    color: "#B91C1C"
  }
};

const leaveTypeColors = {
  Annual: { bg: "#DBEAFE", color: "#2563EB" },
  Sick: { bg: "#FEF9C3", color: "#CA8A04" },
  Unpaid: { bg: "#E5E7EB", color: "#374151" }
};

export default function LeaveTable({ rows = [], onView, isLoading }) {
  const { t } = useLocale();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <Typography color="text.secondary">{t("common.noData")}</Typography>
      </Box>
    );
  }
  return (
    <TableContainer
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>{t("common.employee")}</b></TableCell>
            <TableCell><b>{t("common.department")}</b></TableCell>
            <TableCell><b>{t("leaveRequests.leaveType")}</b></TableCell>
            <TableCell><b>{t("leaveRequests.startDate")}</b></TableCell>
            <TableCell><b>{t("leaveRequests.endDate")}</b></TableCell>
            <TableCell><b>{t("leaveRequests.days")}</b></TableCell>
            <TableCell><b>{t("common.status")}</b></TableCell>
            <TableCell align="center"><b>{t("common.actions")}</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              hover
            >
              <TableCell>
                <Box>
                  <Typography fontWeight={600}>
                    {row.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.role}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{row.department}</TableCell>

              <TableCell>
                <Chip
                  label={t(`leaveRequests.types.${row.leaveType?.toLowerCase()}`) || row.leaveType}
                  size="small"
                  sx={{
                    backgroundColor: leaveTypeColors[row.leaveType]?.bg || "#f3f4f6",
                    color: leaveTypeColors[row.leaveType]?.color || "#374151",
                    fontWeight: 500
                  }}
                />
              </TableCell>

              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
              <TableCell>{row.days}</TableCell>

              <TableCell>
                <Chip
                  label={t(`attendance.${row.status?.toLowerCase()}`) || row.status}
                  size="small"
                  sx={{
                    backgroundColor: statusColors[row.status]?.bg || "#f3f4f6",
                    color: statusColors[row.status]?.color || "#374151",
                    fontWeight: 500
                  }}
                />
              </TableCell>

              <TableCell align="center">
                <IconButton size="small" onClick={() => onView(row)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
