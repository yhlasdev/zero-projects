import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { StatisticCard } from "./statisticCard";

import PeopleIcon from "@mui/icons-material/Groups2";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/HighlightOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/TimerOutlined";
import { getAttendanceDetailHour } from "../../../../api/queries/getters";

export const StatisticSection = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["baseStats"],
    queryFn: getAttendanceDetailHour,
  });

  const stats = response?.data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", gap: 2, height: "150px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{ flex: 1, borderRadius: "12px" }}
            height="100%"
          />
        ))}
      </Box>
    );
  }

  const cards = [
    {
      text: "Total Employees",
      count: stats?.total_employees || 0,
      icon: PeopleIcon,
      bgColor: "#E7F4EE",
      iconColor: "#065F46",
    },
    {
      text: "Present Today",
      count: stats?.present_today || 0,
      icon: CheckCircleIcon,
      bgColor: "#D1FAE5",
      iconColor: "#10B981",
    },
    {
      text: "Absent Today",
      count: stats?.absent_today || 0,
      icon: CancelIcon,
      bgColor: "#FEE2E2",
      iconColor: "#EF4444",
    },
    {
      text: "Late Today",
      count: stats?.late_today || 0,
      icon: AccessTimeIcon,
      bgColor: "#FEF3C7",
      iconColor: "#F59E0B",
    },
    {
      text: "Total Hours Month",
      count: Math.floor(stats?.total_hours_month) || 0,
      icon: TimerIcon,
      bgColor: "#E0E7FF",
      iconColor: "#6366F1",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        mb: 4,
      }}
    >
      {cards.map((card, index) => (
        <StatisticCard
          key={index}
          icon={card.icon}
          count={card.count}
          text={card.text}
          bgColor={card.bgColor}
          iconColor={card.iconColor}
        />
      ))}
    </Box>
  );
};
