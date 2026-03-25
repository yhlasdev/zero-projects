import { Box, Typography } from "@mui/material";
import { DiagramSection } from "./diagramSection/diagramSection";
import { CustomDivider } from "../../../../components/customDivider";
import CurrentLastMonthSection from "../currentLastMonthSection/currentLastMonthSection";
import { useLocale } from "../../../../hooks/useLocale";

export const TimeStaticSection = () => {
  const { t } = useLocale();
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
