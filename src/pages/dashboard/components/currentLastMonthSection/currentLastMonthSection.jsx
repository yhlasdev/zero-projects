import { Box } from "@mui/material";
import { MonthStatistic } from "./components/monthStatistic";
import { useQuery } from "@tanstack/react-query";
import { getDahsboardDayHour } from "../../../../api/queries/getters";

const exampleData = [
  {
    suffix: 340,
  },
  {
    suffix: 50,
    suffixUp: "13.11.2025",
  },
  {
    suffix: 183,
    suffixUp: "22.11.2025",
  },
];

const CurrentLastMonthSection = () => {
  const { data: response } = useQuery({
    queryKey: ["dahsboardHourStatistic"],
    queryFn: getDahsboardDayHour,
  });

  console.log(response?.data);
  
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <MonthStatistic title={"Su ay (jikme-jik)"} data={exampleData} />
        <MonthStatistic title={"Gecen ay (jikme-jik)"} data={exampleData} />
      </Box>
    </Box>
  );
};

export default CurrentLastMonthSection;
