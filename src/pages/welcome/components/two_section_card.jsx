import { Box, Card, Typography } from "@mui/material";

export const TwoSectionCard = ({ icon, title, description }) => {
  const Icon = icon;

  return (
    <Card
      sx={{
        width: "413px",
        height: "320px",
        borderRadius: "25px",
        p: 5,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "flex-start",

        background: "#FFFFFFE5",
        border: "1px solid #0F32541A",
        boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Icon Box */}
      <Box
        sx={{
          width: "70px",
          height: "70px",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "linear-gradient(135deg,#0F3254 0%,#1A4D7A 100%)",
          boxShadow: "0px 8px 25px rgba(15,50,84,0.3)",
          color: "white",
        }}
      >
        <Icon sx={{ fontSize: 34 }} />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "24px",
          color: "#0F3254",
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "27px",
          color: "#666666",
        }}
      >
        {description}
      </Typography>
    </Card>
  );
};
