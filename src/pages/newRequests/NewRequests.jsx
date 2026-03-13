import {
  Box,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Chip,
  Skeleton,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../components/pageTitle/pageTitle";
import { CustomDivider } from "../../components/customDivider";
import HeaderAppBar from "../../components/appBar/AppBar";
import { getNewRequest } from "../../api/queries/getters";
import { formatTimeYear } from "../../utils/formatTime";
import { updateNewRequest } from "../../api/queries/put";
import GlobalLoader from "../../components/Loading";
import toast from "react-hot-toast";

const TABS = [
  { label: "All", status: null },
  { label: "Pending", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "Rejected", status: "rejected" },
];

const statusStyles = {
  pending: { label: "Pending", bgcolor: "#FEF9C3", color: "#854D0E" },
  approved: { label: "Approved", bgcolor: "#DCFCE7", color: "#166534" },
  rejected: { label: "Rejected", bgcolor: "#FFE4E6", color: "#9F1239" },
};

const StatusChip = ({ status }) => {
  const s = statusStyles[status?.toLowerCase()] ?? statusStyles.pending;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        bgcolor: s.bgcolor,
        color: s.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        height: 28,
        borderRadius: "8px",
        px: 0.5,
      }}
    />
  );
};

const RequestCard = ({ request, isActive, onReject, onApprove, loadingId }) => {
  const isUpdating = loadingId === request.id;

  return (
    <Card
      variant="outlined"
      sx={{
        width: 346,
        minHeight: 326,
        borderRadius: "12px",
        border: isActive ? "1px solid #299764" : "1px solid #E5E7EB",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: "25px", "&:last-child": { pb: "25px" } }}>
        <Avatar
          src={request.profileImage ?? request.avatarUrl}
          sx={{ width: 60, height: 60, mb: 2.5 }}
        />

        {[
          ["First name:", request.first_name ?? ""],
          ["Last name:", request.last_name ?? ""],
          ["Prefered name:", request.preferred_name ?? ""],
          ["Request date:", formatTimeYear(request.create_date)],
        ].map(([label, value]) => (
          <Box
            key={label}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography color="text.secondary" fontSize="14px" fontWeight={400}>
              {label}
            </Typography>
            <Typography fontWeight={500} fontSize="14px" color="#333333">
              {value ?? "—"}
            </Typography>
          </Box>
        ))}

        <Box mt={1.5} mb={2}>
          <StatusChip status={request.status} />
        </Box>

        <Box display="flex" gap={1.5}>
          <Button
            variant="contained"
            size="small"
            disabled={isUpdating}
            onClick={() => onReject(request)}
            sx={{
              width: 135,
              height: 32,
              flexShrink: 0,
              bgcolor: "#D93B2D",
              "&:hover": { bgcolor: "#B83224" },
              "&.Mui-disabled": { bgcolor: "#D93B2D", opacity: 0.6 },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.875rem",
              boxShadow: "0px 1px 2px 0px #0000000D",
            }}
          >
            {isUpdating ? (
              <CircularProgress size={14} sx={{ color: "#fff" }} />
            ) : (
              "Reject"
            )}
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={isUpdating}
            onClick={() => onApprove(request)}
            sx={{
              flex: 1,
              height: 32,
              bgcolor: "#299764",
              "&:hover": { bgcolor: "#1F7A50" },
              "&.Mui-disabled": { bgcolor: "#299764", opacity: 0.6 },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: "0.875rem",
              boxShadow: "0px 1px 2px 0px #0000000D",
            }}
          >
            {isUpdating ? (
              <CircularProgress size={14} sx={{ color: "#fff" }} />
            ) : (
              "Approved"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const CardSkeleton = () => (
  <Card
    variant="outlined"
    sx={{ width: 346, minHeight: 326, borderRadius: "12px" }}
  >
    <CardContent sx={{ p: "25px", "&:last-child": { pb: "25px" } }}>
      <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2.5 }} />
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="text" height={22} sx={{ mb: 0.75 }} />
      ))}
      <Skeleton
        variant="rounded"
        width={80}
        height={28}
        sx={{ mt: 1.5, mb: 2, borderRadius: "8px" }}
      />
      <Box display="flex" gap={1.5}>
        <Skeleton
          variant="rounded"
          width={135}
          height={32}
          sx={{ borderRadius: "8px" }}
        />
        <Skeleton
          variant="rounded"
          sx={{ flex: 1, height: 32, borderRadius: "8px" }}
        />
      </Box>
    </CardContent>
  </Card>
);

const NewRequestsPage = () => {
  const [tab, setTab] = useState(0);
  const [activeCardId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const queryClient = useQueryClient();
  const currentStatus = TABS[tab].status;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["join-requests", currentStatus],
    queryFn: () =>
      getNewRequest(currentStatus ? { status: currentStatus } : ""),
    select: (res) => {
      if (Array.isArray(res?.data?.data)) return res.data.data;
      return [];
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: updateNewRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["join-requests"] });
      toast.success(
        data?.data?.message || "Join request status successfully updated !",
      );
    },
    onSettled: () => {
      setLoadingId(null);
    },
    onError: () => {
      toast.error("Josin request status some problems");
    },
  });

  const handleApprove = (request) => {
    setLoadingId(request.request_id);
    updateStatus({ request_id: request.request_id, status: "approved" });
  };

  const handleReject = (request) => {
    setLoadingId(request.request_id);
    updateStatus({ request_id: request.request_id, status: "rejected" });
  };

  return (
    <Box>
      <PageTitle
        title="New Employee Requests"
        subTitle="Review and process new employee applications"
      />

      <CustomDivider sx={{ mb: 3 }} />

      <HeaderAppBar>
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: 40,
            "& .MuiTabs-flexContainer": { gap: 0.5 },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 36,
              px: 2,
              py: 0.75,
              borderRadius: "8px",
              transition: "background-color 0.2s, color 0.2s",
            },
            "& .Mui-selected": {
              backgroundColor: "#1a2e44",
              fontWeight: 600,
              color: "#fff",
              borderRadius: "8px",
            },
            ".css-n6e6a9-MuiButtonBase-root-MuiTab-root.Mui-selected": {
              backgroundColor: "#1a2e44",
              fontWeight: 600,
              color: "#fff",
              borderRadius: "8px",
            }
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
      </HeaderAppBar>

      <Paper sx={{ height: "calc(100vh - 303px)", overflow: "auto", p: 3 }}>
        {isLoading && <GlobalLoader />}

        {isError && (
          <Alert severity="error">
            Getting the data {error?.message ?? "Some problems server error"}
          </Alert>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <Typography color="text.secondary" py={4} textAlign="center">
            Not found this status
          </Typography>
        )}

        {!isLoading && !isError && data?.length > 0 && (
          <Box display={"flex"} gap={3} flex={"wrap"}>
            {data.map((request, i) => (
              <Box key={i}>
                <RequestCard
                  request={request}
                  isActive={activeCardId === request.request_id}
                  onReject={handleReject}
                  onApprove={handleApprove}
                  loadingId={loadingId}
                />
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default NewRequestsPage;
