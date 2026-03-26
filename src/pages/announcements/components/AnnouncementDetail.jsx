import {
  Box,
  Typography,
  Divider,
  IconButton,
  Grid,
  LinearProgress,
  useColorScheme,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAnnouncementById } from "../../../api/queries/getters";
import StatusChip from "../../../components/table/StatusChip";
import { useLocale } from "../../../hooks/useLocale";

const DetailSkeleton = () => (
  <Box px={3} pb={5}>
    <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
    <Box display="flex" gap={3} mb={3}>
      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 4 }} />
    </Box>
    <Skeleton variant="rounded" height={150} sx={{ mb: 4 }} />
    <Grid container spacing={4}>
      <Grid size={6}><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="80%" /></Grid>
      <Grid size={6}><Skeleton variant="text" width="40%" /><Skeleton variant="text" width="80%" /></Grid>
    </Grid>
  </Box>
);
const AnnouncementDetail = ({ onClose, id }) => {
  const { t } = useLocale();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
  const { mode } = useColorScheme();
  const val = data?.data?.data;

  const readCount = val?.ReadCount || 0;
  const sendCount = val?.SendCount || 0;
  const percentage =
    sendCount > 0 ? Math.round((readCount / sendCount) * 100) : 0;

  const targetAudienceLabel =
    val?.TargetAudience === "all_employees"
      ? t("announcements.allEmployees")
      : val?.TargetAudience;

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        px={3}
        pt={2}
        alignItems="center"
      >
        <Typography fontSize={18} fontWeight={600}>
          {t("announcements.details")}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, mt: 1 }} />

      {isLoading ? (
        <DetailSkeleton />
      ) : isError ? (
        <Box>{t("common.error")}</Box>
      ) : (
        <Box px={3} pb={5}>
          {/* Title */}
          <Typography fontSize={20} fontWeight={600} mb={2}>
            {val?.Text?.split("\n")[0] || t("announcements.untitled")}
          </Typography>

          {/* Meta Info */}
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonOutlineIcon fontSize="small" />
              <Typography color="text.secondary">{t("announcements.company")}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <CalendarTodayIcon fontSize="small" />
              <Typography color="text.secondary">
                {dayjs(val?.CreatedAt).format("YYYY-MM-DD")}
              </Typography>
            </Box>

            <StatusChip status={val?.Status} />
          </Box>

          {/* Description Box */}
          <Box
            sx={{
              backgroundColor: mode == "dark" ? "#1F2937" : "#F4F4F4",
              borderRadius: "10px",
              padding: 3,
              mb: 4,
              whiteSpace: "pre-line",
            }}
          >
            <Typography color="text.secondary">{val?.Text}</Typography>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={4}>
            <Grid size={6}>
              <Typography fontSize={14} color="text.secondary" mb={0.5}>
                {t("announcements.targetAudience")}
              </Typography>
              <Typography fontWeight={600}>{targetAudienceLabel}</Typography>
            </Grid>

            <Grid size={6}>
              <Typography fontSize={14} color="text.secondary" mb={0.5}>
                {t("announcements.readStatistics")}
              </Typography>
              <Typography fontWeight={600}>
                {readCount} / {sendCount} ({percentage}%)
              </Typography>
            </Grid>
          </Grid>

          {/* Progress */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={14}>{t("announcements.readProgress")}</Typography>
              <Typography fontSize={14}>{percentage}%</Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#E0E0E0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1E8E5A",
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AnnouncementDetail;
