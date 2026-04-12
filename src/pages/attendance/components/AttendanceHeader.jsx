import { Stack, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocale } from "../../../hooks/useLocale";

export default function AttendanceHeader({ employeeName, position, departmentName, onClose }) {
  const { t } = useLocale();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={"start"}
      mb={1}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          {t("attendance.attendanceDetails")}
        </Typography>
        <Typography py={1} fontSize={25} fontWeight={600}>
          {employeeName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {position} • {departmentName}
        </Typography>
      </Box>
      <IconButton size="small" onClick={() => onClose(false)}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}
