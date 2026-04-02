import { Paper, Stack, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { formatTime } from "../../../utils/formatTime";
import StatusChip from "../../../components/table/StatusChip";

function InfoBlock({ label, value }) {
  return (
    <Box width={100}>
      <Typography variant="body2" fontSize={11} color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Box>
  );
}

export default function AttendanceRecordCard({ item }) {
  const dayNumber = dayjs(item.work_date).format("DD");

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        width: "100%",
        boxSizing: "border-box",
      }}
      elevation={0}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent={"space-between"}
        spacing={3}
      >
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: "#0A2540",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography fontWeight={600} fontSize={"11px"}>
              {dayNumber}
            </Typography>
          </Box>

          <Box width={{ xs: "100%", sm: "auto" }}>
            <Typography fontWeight={600} fontSize={"13px"}>
              {dayjs(item.work_date).format("DD.MM.YYYY")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs(item.work_date).format("ddd")}
            </Typography>
          </Box>
        </Box>
        <InfoBlock label="CHECK IN" value={formatTime(item.check_in)} />
        <InfoBlock label="CHECK OUT" value={formatTime(item.check_out)} />
        <InfoBlock label="HOURS" value={item.hours?.toFixed?.(1) || "-"} />

        <Box ml="auto">
          <StatusChip status={item.status} />
        </Box>
      </Stack>
    </Paper>
  );
}
