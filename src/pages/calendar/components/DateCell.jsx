import { Box, Typography } from "@mui/material";
import { getThemeColors, getStyle } from "./DateUtils";

export default function DateCell({
  cell,
  idx,
  totalCells,
  events,
  today_,
  sel,
  handleDayClick,
  isDark,
  EVENT_STYLES,
}) {
  const {
    borderColor,
    cellBg,
    cellBgOther,
    cellBgSel,
    cellBgSelHov,
    cellBgHov,
    tealAccent,
  } = getThemeColors(isDark);

  const col = idx % 7;
  const lastRowStart = totalCells - 7;
  const isLastRow = idx >= lastRowStart;

  return (
    <Box
      onClick={() => handleDayClick(cell)}
      sx={{
        minHeight: 130,
        p: 0.75,
        borderRight: col < 6 ? `1px solid ${borderColor}` : "none",
        borderBottom: !isLastRow ? `1px solid ${borderColor}` : "none",
        outline: sel ? `2px solid ${tealAccent}` : "none",
        outlineOffset: "-1px",
        bgcolor: sel
          ? cellBgSel
          : cell.currentMonth
            ? cellBg
            : cellBgOther,
        cursor: cell.currentMonth ? "pointer" : "default",
        transition: "background 0.12s",
        "&:hover": cell.currentMonth
          ? { bgcolor: sel ? cellBgSelHov : cellBgHov }
          : {},
      }}
    >
      {cell.currentMonth && (
        <>
          <Typography
            sx={{
              display: "block",
              mb: 0.5,
              fontSize: "13px",
              fontWeight: today_ ? 700 : 400,
              color: today_
                ? tealAccent
                : isDark
                  ? "#e5e7eb"
                  : "#111827",
            }}
          >
            {cell.day}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            {events.map((event) => {
              const s = getStyle(event.event_type, EVENT_STYLES);
              return (
                <Box
                  key={event.id}
                  sx={{
                    bgcolor: s.bg,
                    borderRadius: "4px",
                    px: 0.75,
                    py: "2px",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      fontSize: "10px",
                      fontWeight: 500,
                      color: s.color,
                      lineHeight: 1.5,
                    }}
                  >
                    {event.event_title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
