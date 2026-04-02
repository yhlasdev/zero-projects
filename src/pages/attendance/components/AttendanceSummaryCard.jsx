import { Paper, Typography } from "@mui/material";

export default function AttendanceSummaryCard({ title, subtitle }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#9F9F9F33",
        width: "130px",
      }}
      elevation={0}
    >
      <Typography fontSize={"9px"} fontWeight={600} color="#9F9F9F">
        {subtitle}
      </Typography>
      <Typography fontWeight={600}>{title}</Typography>
    </Paper>
  );
}
