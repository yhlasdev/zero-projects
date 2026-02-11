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
  IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

// 🎨 Local status color mapping
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

// 🎨 Leave type color mapping
const leaveTypeColors = {
  Annual: { bg: "#DBEAFE", color: "#2563EB" },
  Sick: { bg: "#FEF9C3", color: "#CA8A04" },
  Unpaid: { bg: "#E5E7EB", color: "#374151" }
};

export default function LeaveTable({ onView }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ bgcolor: '#fff' }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
          <TableRow>
            <TableCell><b>Employee</b></TableCell>
            <TableCell><b>Department</b></TableCell>
            <TableCell><b>Leave Type</b></TableCell>
            <TableCell><b>Start Date</b></TableCell>
            <TableCell><b>End Date</b></TableCell>
            <TableCell><b>Days</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "#F3F4F6"
                }
              }}
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
                  label={row.leaveType}
                  size="small"
                  sx={{
                    backgroundColor: leaveTypeColors[row.leaveType].bg,
                    color: leaveTypeColors[row.leaveType].color,
                    fontWeight: 500
                  }}
                />
              </TableCell>

              <TableCell>{row.startDate}</TableCell>
              <TableCell>{row.endDate}</TableCell>
              <TableCell>{row.days}</TableCell>

              <TableCell>
                <Chip
                  label={row.status}
                  size="small"
                  sx={{
                    backgroundColor: statusColors[row.status].bg,
                    color: statusColors[row.status].color,
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
