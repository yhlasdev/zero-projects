/* eslint-disable no-unused-vars */
import { Card, CardContent, Box, Typography } from "@mui/material";

export const StatisticCard = ({
  icon: Icon,
  count,
  text,
  bgColor,
  iconColor,
}) => {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: "12px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: "20px !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "8px",
            bgcolor: bgColor,
          }}
        >
          <Icon sx={{ color: iconColor, fontSize: "22px" }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: "700", color: "#101828" }}>
          {count}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#667085", fontWeight: "500" }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};
