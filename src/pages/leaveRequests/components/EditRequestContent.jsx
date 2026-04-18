import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { CustomForm } from "../../../components/form/CustomForm";
import { getLeavesById } from "../../../api/queries/getters";
import { useAppMutation } from "../../../hooks/useMutation";
import { updateLeaves } from "../../../api/queries/put";
import { formatTimeYear } from "../../../utils/formatTime";
import { useLocale } from "../../../hooks/useLocale";

const leaveTypeColors = {
  annual: { bg: "#0a64da", color: "#2563EB" },
  sick: { bg: "#FEF9C3", color: "#CA8A04" },
  unpaid: { bg: "#E5E7EB", color: "#374151" },
};

const statusColors = {
  pending: { bg: "#FEF3C7", color: "#D97706" },
  approve: { bg: "#DCFCE7", color: "#15803D" },
  reject: { bg: "#FEE2E2", color: "#B91C1C" },
};
  
const EditLeaveRequest = ({ leave_id, onClose }) => {
  const { t } = useLocale();
  const {
    data: leaveResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leavesById", leave_id],
    queryFn: () => getLeavesById(leave_id),
    enabled: !!leave_id,
  });

  const data = leaveResponse?.data?.data;

  const mutation = useAppMutation({
    mutationFn: (newStatus) =>
      updateLeaves({
        leave_id: leave_id,
        status: newStatus,
        reason: data?.reason || "",
      }),
    queryKey: ["leaves"],
    onSuccess: () => onClose(),
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate("approve");
  };

  return (
    <Box minHeight="400px" display="flex" flexDirection="column">
      {isLoading ? (
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={40} />
        </Box>
      ) : isError ? (
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Typography color="error" gutterBottom>
            {t('leaveRequests.failedToLoad')}
          </Typography>
          <Button variant="outlined" onClick={onClose}>
            {t('leaveRequests.close')}
          </Button>
        </Box>
      ) : (
        <CustomForm handleSubmit={handleSubmit}>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "28px",
                verticalAlign: "middle",
              }}
            >
              {t('leaveRequests.editAttendanceRecord')}
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon sx={{ width: "21px", height: "21px" }} />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box px={4} py={2}>
            <Paper
              elevation={0}
              sx={{ borderRadius: "8px", p: 3, mb: 3, bgcolor: "#F4F4F4" }}
            >
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                <Box>
                  <Typography fontSize={13} color="text.secondary">
                    {t('common.employee')}
                  </Typography>
                  <Typography
                    fontWeight={500}
                    fontSize={16}
                    color="#333333"
                    mb={1}
                  >
                    {data?.user
                      ? `${data.user.first_name} ${data.user.last_name}`
                      : "-"}
                  </Typography>
                  <Typography fontSize={13} mt={3} color="text.secondary">
                    {t('common.position')}
                  </Typography>
                  <Typography>{data?.job?.title || "-"}</Typography>
                </Box>
                <Box>
                  <Typography fontSize={13} color="text.secondary">
                    {t('common.department')}
                  </Typography>
                  <Typography fontWeight={500} mb={1}>
                    {data?.department?.name || "-"}
                  </Typography>
                  <Typography fontSize={13} mt={2.5} color="text.secondary">
                    {t('leaveRequests.leaveBalance')}
                  </Typography>
                  <Typography>{data?.leave_balance || 0}</Typography>
                </Box>
              </Box>
            </Paper>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('leaveRequests.leaveType')}
                </Typography>
                <Chip
                  label={data?.leave_type || t('leaveRequests.unknown')}
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor:
                      leaveTypeColors[data?.leave_type]?.bg || "#eee",
                    color: leaveTypeColors[data?.leave_type]?.color || "#333",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('common.status')}
                </Typography>
                <Chip
                  label={data?.leave_status || t('common.pending')}
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor:
                      statusColors[data?.leave_status]?.bg || "#eee",
                    color: statusColors[data?.leave_status]?.color || "#333",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('leaveRequests.startDate')}
                </Typography>
                <Typography fontSize={"16px"}>
                  {formatTimeYear(data?.start_date)}
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('leaveRequests.endDate')}
                </Typography>
                <Typography>{formatTimeYear(data?.end_date)}</Typography>
              </Box>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('leaveRequests.days')}
                </Typography>
                <Typography>{data?.total_days || 0}</Typography>
              </Box>
              <Box>
                <Typography fontSize={13} color="text.secondary">
                  {t('leaveRequests.appliedDate')}
                </Typography>
                <Typography>{formatTimeYear(data?.applied_date)}</Typography>
              </Box>
              <Box gridColumn="span 2">
                <Typography fontSize={13} color="text.secondary" mb={0.5}>
                  {t('leaveRequests.reason')}
                </Typography>
                <Typography
                  sx={{
                    borderRadius: 2,
                    p: 1.5,
                    bgcolor: "#F4F4F4",
                    border: "1px solid #e9ecef",
                  }}
                >
                  {data?.reason || t('leaveRequests.noReasonProvided')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mt: 2 }} />

            {(data?.leave_status === "pending" || !data?.leave_status) && (
              <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#D93B2D", borderRadius: "8px" }}
                  onClick={() => mutation.mutate("reject")}
                  disabled={mutation.isPending}
                >
                  {t("leaveRequests.reject")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ bgcolor: "#299764", borderRadius: "8px" }}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t("leaveRequests.approve")
                  )}
                </Button>
              </Box>
            )}
          </Box>
        </CustomForm>
      )}
    </Box>
  );
};

export default EditLeaveRequest;
