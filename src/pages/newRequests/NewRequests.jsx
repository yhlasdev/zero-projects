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
import { useLocale } from "../../hooks/useLocale";
import { toast } from "react-toastify";
import Seo from "../../components/seo/seo";

const getTabs = (t) => [
  { label: t("newRequests.all"), status: null },
  { label: t("newRequests.pending"), status: "pending" },
  { label: t("newRequests.approved"), status: "approved" },
  { label: t("newRequests.rejected"), status: "rejected" },
];

const getStatusStyles = (t) => ({
  pending: { label: t("newRequests.pending"), bgcolor: "#FEF9C3", color: "#854D0E" },
  approved: { label: t("newRequests.approved"), bgcolor: "#DCFCE7", color: "#166534" },
  rejected: { label: t("newRequests.rejected"), bgcolor: "#FFE4E6", color: "#9F1239" },
});

const StatusChip = ({ status, statusStyles }) => {
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

const RequestCard = ({ request, isActive, onReject, onApprove, loadingId, t, statusStyles }) => {
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
          [t("newRequests.firstName"), request.first_name ?? ""],
          [t("newRequests.lastName"), request.last_name ?? ""],
          [t("newRequests.preferredName"), request.preferred_name ?? ""],
          [t("newRequests.requestDate"), formatTimeYear(request.create_date)],
        ].map(([label, value]) => (
          <Box
            key={label}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Typography fontSize="14px" fontWeight={400}>
              {label}
            </Typography>
            <Typography fontWeight={500} fontSize="14px">
              {value ?? "—"}
            </Typography>
          </Box>
        ))}

        <Box mt={1.5} mb={2}>
          <StatusChip status={request.status} statusStyles={statusStyles} />
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
              t("newRequests.reject")
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
              t("newRequests.approveBtn")
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
  const { t } = useLocale();
  const TABS = getTabs(t);
  const statusStyles = getStatusStyles(t);

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
        data?.data?.message || t("newRequests.successUpdate"),
      );
    },
    onSettled: () => {
      setLoadingId(null);
    },
    onError: () => {
      toast.error(t("newRequests.errorUpdate"));
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
      <Seo
        title={t("newRequests.title")}
        description={t("newRequests.subTitle")}
        name="Yerinde"
        type="website"
      />
      <PageTitle
        title={t("newRequests.title")}
        subTitle={t("newRequests.subTitle")}
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
              "&.Mui-selected": {
                backgroundColor: "#1a2e44",
                fontWeight: 600,
                color: "#fff !important",
                borderRadius: "8px",
              },
            },
            "& .MuiButtonBase-root.MuiTab-root.Mui-selected": {
              backgroundColor: "#1a2e44",
              color: "#fff",
            }
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
      </HeaderAppBar>

      <Box sx={{
        height: "calc(100vh - 303px)",
        overflow: "auto",
        p: 3,
        borderTop: '1px solid #eeeeee'
      }}
        className="wrapper-component"
      >
        {isLoading && <GlobalLoader />}

        {isError && (
          <Alert severity="error">
            {t("newRequests.errorData")} {error?.message ?? t("newRequests.serverError")}
          </Alert>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <Typography color="text.secondary" py={4} textAlign="center">
            {t("newRequests.notFound")}
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
                  t={t}
                  statusStyles={statusStyles}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box >
  );
};

export default NewRequestsPage;
