import { Stack, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AttendanceHeader({ employeeName, position, departmentName, onClose }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={"start"}
      mb={1}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          Attendance Details
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
