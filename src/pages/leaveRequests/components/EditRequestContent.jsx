import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const statusColors = {
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Approved: { bg: "#DCFCE7", color: "#15803D" },
  Rejected: { bg: "#FEE2E2", color: "#B91C1C" }
};

const leaveTypeColors = {
  Annual: { bg: "#DBEAFE", color: "#2563EB" },
  Sick: { bg: "#FEF9C3", color: "#CA8A04" },
  Unpaid: { bg: "#E5E7EB", color: "#374151" }
};

const LeaveRequestDetail = ({ data, onClose }) => {
  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={600}>
          Leave Request Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {/* Top Info Card */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#F3F4F6",
          borderRadius: 3,
          p: 3,
          mb: 3
        }}
      >
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={0}>
          {/* Left */}
          <Box>
            <Typography fontSize={13} color="text.secondary">
              Employee
            </Typography>
            <Typography fontWeight={600} mb={1}>
              {data.name}
            </Typography>

            <Typography fontSize={13} mt={3} color="text.secondary">
              Position
            </Typography>
            <Typography>{data.role}</Typography>
          </Box>

          {/* Right */}
          <Box>
            <Typography fontSize={13} color="text.secondary">
              Department
            </Typography>
            <Typography fontWeight={600} mb={1}>
              {data.department}
            </Typography>

            <Typography fontSize={13} mt={3} color="text.secondary">
              Leave Balance
            </Typography>
            <Typography>{data.balance} days</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Leave Info */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
        <Box>
          <Typography fontSize={13} color="text.secondary">
            Leave Type
          </Typography>
          <Chip
            label={data.leaveType}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: leaveTypeColors[data.leaveType].bg,
              color: leaveTypeColors[data.leaveType].color,
              fontWeight: 500
            }}
          />
        </Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            Status
          </Typography>
          <Chip
            label={data.status}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: statusColors[data.status].bg,
              color: statusColors[data.status].color,
              fontWeight: 500
            }}
          />
        </Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            Start Date
          </Typography>
          <Typography>{data.startDate}</Typography>
        </Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            End Date
          </Typography>
          <Typography>{data.endDate}</Typography>
        </Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            Total Days
          </Typography>
          <Typography>{data.days} days</Typography>
        </Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            Applied Date
          </Typography>
          <Typography>{data.appliedDate}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Reason */}
      <Box>
        <Typography fontSize={13} color="text.secondary" mb={1}>
          Reason
        </Typography>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#F3F4F6",
            p: 2,
            borderRadius: 2
          }}
        >
          <Typography>{data.reason}</Typography>
        </Paper>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button variant="outlined" sx={{ backgroundColor: 'red', color: 'white' }} onClick={onClose}>
          Reject
        </Button>
        <Button variant="contained" sx={{ backgroundColor: 'green' }}>Approve</Button>
      </Box>
    </Box>
  );
};

export default LeaveRequestDetail;
