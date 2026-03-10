import { Box } from "@mui/material";
import { MonthStatistic } from "./components/monthStatistic";
import { useQuery } from "@tanstack/react-query";
import { getDahsboardDayHour } from "../../../../api/queries/getters";

const CurrentLastMonthSection = () => {

  const { data: response } = useQuery({
    queryKey: ["dahsboardHourStatistic"],
    queryFn: getDahsboardDayHour,
  });

  const allData = response?.data?.data || [];

  const currentlyMonth = [
    {
      suffix: allData.max_day_30_to_60?.hours,
      suffixUp: allData.max_day_30_to_60?.day,
    },
    {
      suffix: allData.min_stats_30_to_60?.hours,
      suffixUp: allData.min_stats_30_to_60?.day,
    },
    {
      suffix: allData.avg_max_30_to_60?.hours,
      suffixUp: allData.avg_max_30_to_60?.day,
    },
  ];

  const lastMonth = [
    {
      suffix: allData.max_day_last_30?.hours,
      suffixUp: allData.max_day_last_30?.day,
    },
    {
      suffix: allData.min_stats_last_30?.hours,
      suffixUp: allData.min_stats_last_30?.day,
    },
    {
      suffix: allData.avg_max_last_30?.hours,
      suffixUp: allData.avg_max_last_30?.day,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <MonthStatistic titleColor={'#1D61E7'} title={"Su ay (jikme-jik)"} data={currentlyMonth} />
        <MonthStatistic titleColor={'#D93B2D'} title={"Gecen ay (jikme-jik)"} data={lastMonth} />
      </Box>
    </Box>
  );
};

export default CurrentLastMonthSection;
