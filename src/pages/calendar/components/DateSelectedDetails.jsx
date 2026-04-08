import { Box, Typography } from "@mui/material";
import { getStyle } from "./DateUtils";

export default function DateSelectedDetails({ selectedEvents, EVENT_STYLES, borderColor }) {
  if (!selectedEvents || selectedEvents.length === 0) return null;

  return (
    <Box
      sx={{
        mx: 3,
        mb: 2,
        pt: 2,
        borderTop: `1px solid ${borderColor}`,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {selectedEvents.map((event) => {
        const s = getStyle(event.event_type, EVENT_STYLES);
        return (
          <Box
            key={event.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.8,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "2px",
                bgcolor: s.dot,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: "13px" }}>
              {event.event_title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
