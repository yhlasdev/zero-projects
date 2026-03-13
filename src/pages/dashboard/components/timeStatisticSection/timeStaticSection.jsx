import { Box, Typography } from "@mui/material";
import { DiagramSection } from "./diagramSection/diagramSection";
import { CustomDivider } from "../../../../components/customDivider";
import CurrentLastMonthSection from "../currentLastMonthSection/currentLastMonthSection";
import { getDahsboardHourStat } from "../../../../api/queries/getters";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "../../../../hooks/useLocale";

export const TimeStaticSection = () => {
  const { t } = useLocale();
  const {
    data: response,
  } = useQuery({
    queryKey: ["dahsboardHourStatistic"],
    queryFn: getDahsboardHourStat,
  });

  console.log(response?.data)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3"> {t('dashboard.workingHoursStats')}</Typography>
      <CustomDivider sx={{ mb: 2 }} />
      <DiagramSection />
      <CustomDivider sx={{ mb: 2 }} />
      <CurrentLastMonthSection />
    </Box>
  );
};
