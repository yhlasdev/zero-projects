import { useQuery } from "@tanstack/react-query";
import { Card, Box, Typography, Stack, Divider, Skeleton } from "@mui/material";
import { getAttendanceStatistic } from "../../../../../api/queries/getters";

export default function AttendanceStats() {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attendanceStats"],
    queryFn: getAttendanceStatistic,
  });

  const stats = response?.data?.data;

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        height={240}
        sx={{ borderRadius: "16px" }}
      />
    );
  }

  if (isError || !stats) {
    return <Typography color="error">Statistikler yüklenemedi.</Typography>;
  }

  const chartData = [
    {
      label: "Present",
      value: Math.round(stats?.presents_last_30 || 0),
      color: "#27ae60",
    },
    {
      label: "Late",
      value: Math.round(stats.lates_last_30 || 0),
      color: "#f1c40f",
    },
    {
      label: "Absent",
      value: Math.round(stats.absents_last_30 || 0),
      color: "#e74c3c",
    },
  ];

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        borderRadius: "16px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Typography fontSize={20} fontWeight={700} mb={4}>
        Attendance Statistics
      </Typography>

      <Stack spacing={3}>
        {chartData.map((item) => (
          <Box
            key={item.label}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: item.color,
                }}
              />
              <Typography variant="body1" fontWeight={500}>
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={600}>
              {item.value}%
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 3, opacity: 0.6 }} />

      <Box
        sx={{
          display: "flex",
          height: 12,
          borderRadius: 6,
          overflow: "hidden",
          bgcolor: "#F2F4F7",
          gap: "4px",
        }}
      >
        {chartData.map(
          (item) =>
            item.value > 0 && (
              <Box
                key={item.label}
                sx={{
                  width: `${item.value}%`,
                  bgcolor: item.color,
                  transition: "width 1s ease-in-out",
                  borderRadius: item.value === 100 ? 6 : 0,
                }}
              />
            ),
        )}
      </Box>

      {chartData.every((item) => item.value === 0) && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 2, display: "block", textAlign: "center" }}
        >
          Son 30 güne maglumat tapylmady
        </Typography>
      )}
    </Card>
  );
}
