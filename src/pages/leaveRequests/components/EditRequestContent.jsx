import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { CustomForm } from "../../../components/form/CustomForm";
import { getLeavesById } from "../../../api/queries/getters";
import { useAppMutation } from "../../../hooks/useMutation";
import { updateLeaves } from "../../../api/queries/put";
import { formatTimeYear } from "../../../utils/formatTime";

const leaveTypeColors = {
  Annual: { bg: "#DBEAFE", color: "#2563EB" },
  Sick: { bg: "#FEF9C3", color: "#CA8A04" },
  Unpaid: { bg: "#E5E7EB", color: "#374151" }
};

const statusColors = {
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Approved: { bg: "#DCFCE7", color: "#15803D" },
  Rejected: { bg: "#FEE2E2", color: "#B91C1C" }
};

const EditLeaveRequest = ({ leave_id, onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!leave_id) return;
    getLeavesById(leave_id)
      .then((res) => { setData(res?.data?.data) })
      .catch(() => setData(null));
  }, [leave_id]);

  const mutation = useAppMutation({
    mutationFn: ({ status }) => updateLeaves({
      leave_id: data.leave_id,
      status,
      reason: data.reason || ''
    }),
    queryKey: ["leaves"],
    onSuccess: () => onClose(),
  });


  const handleAction = (status) => {
    mutation.mutate({ status });
  };


  return (
    <Box p={3}>
      <CustomForm handleSubmit={(e) => e.preventDefault()}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontSize={18} fontWeight={600}>
            Leave Request Details
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Top Info */}
        <Paper elevation={0} sx={{ borderRadius: 3, p: 3, mb: 3, bgcolor: '#d3d6db' }}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
            <Box>
              <Typography fontSize={13} color="text.secondary">Employee</Typography>
              <Typography fontWeight={600} mb={1}>
                {`${data?.user.first_name} ${data?.user.last_name}`}
              </Typography>
              <Typography fontSize={13} mt={3} color="text.secondary">Position</Typography>
              <Typography>{data?.job?.title || '-'}</Typography>
            </Box>
            <Box>
              <Typography fontSize={13} color="text.secondary">Department</Typography>
              <Typography fontWeight={600} mb={1}>{data?.department?.name || '-'}</Typography>
              <Typography fontSize={13} mt={3} color="text.secondary">Leave Balance</Typography>
              <Typography>{data?.leave_balance} days</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Leave Info */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
          <Box>
            <Typography fontSize={13} color="text.secondary">Leave Type</Typography>
            <Chip
              label={data?.leave_type}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: leaveTypeColors[data?.leave_type]?.bg,
                color: leaveTypeColors[data?.leave_type]?.color,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box>
            <Typography fontSize={13} color="text.secondary">Status</Typography>
            <Chip
              label={data?.leave_status}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: statusColors[data?.leave_status]?.bg,
                color: statusColors[data?.leave_status]?.color,
                fontWeight: 500,
              }}
            />
          </Box>
          <Box>
            <Typography fontSize={13} color="text.secondary">Start Date</Typography>
            <Typography>{formatTimeYear(data?.start_date)}</Typography>
          </Box>
          <Box>
            <Typography fontSize={13} color="text.secondary">End Date</Typography>
            <Typography>{formatTimeYear(data?.end_date)}</Typography>
          </Box>
          <Box>
            <Typography fontSize={13} color="text.secondary">Total Days</Typography>
            <Typography>{data?.total_days} days</Typography>
          </Box>
          <Box>
            <Typography fontSize={13} color="text.secondary">Applied Date</Typography>
            <Typography>{formatTimeYear(data?.applied_date)}</Typography>
          </Box>
          <Box gridColumn="span 2">
            <Typography fontSize={13} color="text.secondary" mb={0.5}>Reason</Typography>
            <Typography sx={{ borderRadius: 3, p: 1.5, mb: 1, bgcolor: '#d3d6db' }} width={'full'}>{data?.reason}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mt: 2 }} />

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>

          <Button
            variant="contained"
            color="error"
            onClick={() => handleAction('pending')}
            disabled={mutation.isPending || data?.leave_status === 'Rejected'}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAction('pending')}
            disabled={mutation.isPending || data?.leave_status === 'Approved'}
          >
            Approve
          </Button>
        </Box>
      </CustomForm>
    </Box>
  );
};

export default EditLeaveRequest;