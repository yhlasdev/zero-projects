import { Box, Typography, Avatar, Chip, Tooltip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getStatusConfig, parseDateBlock } from "./TaskViewUtils";

// ─── Status Chip ──────────────────────────────────────────────────────────────
export const StatusChip = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <Chip
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: cfg.dot,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{ fontSize: "11px", fontWeight: 700, letterSpacing: 0.5 }}
          >
            {status?.toUpperCase()}
          </Typography>
        </Box>
      }
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        height: 26,
        borderRadius: "6px",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
};

// ─── Assignee Avatar ──────────────────────────────────────────────────────────
export const AssigneeAvatar = ({ assignee }) => (
  <Avatar
    sx={{
      width: 34,
      height: 34,
      // bgcolor: "#0A2540",
      fontSize: "12px",
      fontWeight: 700,
    }}
  >
    {assignee?.length > 0 ? assignee?.slice(0, 2)?.toUpperCase() : ''}
  </Avatar>
);

// ─── Team Avatars ─────────────────────────────────────────────────────────────
export const TeamAvatars = ({ team = [] }) => {
  const isMoreThanFour = team.length > 4;
  const visible = isMoreThanFour ? team.slice(0, 4) : team;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {visible.map((member, i) => (
        <Tooltip key={i} title={member}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: "10px",
              fontWeight: 600,
              ml: i === 0 ? 0 : "-8px",
              border: "2px solid #fff",
              bgcolor: ["#90CAF9", "#A5D6A7", "#FFCC80", "#E1BEE7"][i % 4],
              color: "#333",
              zIndex: visible.length - i,
            }}
          >
            {member?.slice(0, 2).toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
      {isMoreThanFour && (
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: "10px",
            fontWeight: 700,
            ml: "-8px",
            border: "2px solid #fff",
            bgcolor: "#0A2540",
            color: "#fff",
            zIndex: 0,
          }}
        >
          4+
        </Avatar>
      )}
    </Box>
  );
};

// ─── Date Range ───────────────────────────────────────────────────────────────
export const DateRange = ({ startDate, endDate }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
    <CalendarTodayIcon sx={{ fontSize: 13, color: "text.secondary" }} />
    <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
      {startDate} – {endDate}
    </Typography>
  </Box>
);

// ─── Date Block (timeline left side) ─────────────────────────────────────────
export const DateBlock = ({ date, isActive, statusDot }) => {
  const { day, month, year } = parseDateBlock(date);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 48,
        pt: 0.5,
      }}
    >
      {/* Date text */}
      <Typography sx={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.1 }}>
        {day}
      </Typography>
      <Typography
        sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 500 }}
      >
        {month}
      </Typography>
      <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
        {year}
      </Typography>

      {/* Timeline dot */}
      <Box
        sx={{
          mt: 1,
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${statusDot}`,
          bgcolor: isActive ? statusDot : "transparent",
          flexShrink: 0,
        }}
      />

      {/* Timeline line */}
      <Box
        sx={{
          flex: 1,
          width: 2,
          bgcolor: "#e0e0e0",
          mt: 0.5,
          minHeight: 40,
        }}
      />
    </Box>
  );
};
