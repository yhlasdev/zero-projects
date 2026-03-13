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
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0px 2px 10px rgba(0,0,0,0.4)"
            : "0px 2px 10px rgba(0,0,0,0.05)",
        width: 208,
        height: 170,
        backgroundColor: "background.paper",
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
            width: 48,
            height: 48,
            borderRadius: "8px",
            bgcolor: bgColor,
          }}
        >
          <Icon sx={{ color: iconColor, fontSize: "22px" }} />
        </Box>

        <Typography fontSize={25} sx={{ fontWeight: "700", lineHeight: '32px' }}>
          {count}
        </Typography>

        <Typography
          fontSize={14}
          sx={{ fontWeight: "400", lineHeight: '20px' }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};
