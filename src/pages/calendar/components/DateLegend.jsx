import { Box, Typography } from "@mui/material";
import { LEGEND_STATIC, getStyle } from "./DateUtils";

export default function DateLegend({ EVENT_STYLES, dynamicTypes, isDark, t }) {
  return (
    <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
          {t("calendar.legendTitle")}
        </Typography>
        {LEGEND_STATIC.map((type) => {
          const s = getStyle(type, EVENT_STYLES);
          return (
            <Box
              key={type}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "2px",
                  bgcolor: s.dot,
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  color: isDark ? "#d1d5db" : "#374151",
                }}
              >
                {s.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {dynamicTypes.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          {dynamicTypes.map((type) => {
            const s = getStyle(type, EVENT_STYLES);
            return (
              <Box
                key={type}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "2px",
                    bgcolor: s.dot,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
