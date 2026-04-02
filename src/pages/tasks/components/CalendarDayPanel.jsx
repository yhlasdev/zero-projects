import { Box, Typography, Chip, Avatar } from "@mui/material";
import { MONTHS, getStatusCfg, getInitials } from "./CalendarUtils";

const DayPanel = ({ dateKey, tasks }) => {
  if (!dateKey) return null;

  const dt = new Date(dateKey + "T00:00:00");
  const dateLabel = `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;

  return (
    <Box sx={{ mt: 2, borderTop: "1px solid #e5e7eb", pt: 2 }}>
      {/* Date heading */}
      <Typography sx={{ fontWeight: 700, fontSize: "13px", mb: 1.5 }}>
        {dateLabel}
        <Typography
          component="span"
          sx={{
            fontWeight: 400,
            fontSize: "12px",
            color: "text.secondary",
            ml: 1,
          }}
        >
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </Typography>
      </Typography>

      {tasks.length === 0 ? (
        <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
          No tasks for this day
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {tasks.map((task) => {
            const cfg = getStatusCfg(task.status);
            return (
              <Box
                key={task.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  border: "1px solid #e5e7eb",
                  borderLeft: `4px solid ${cfg.border}`,
                  borderRadius: "0 8px 8px 0",
                  bgcolor: cfg.bg,
                }}
              >
                {/* Task info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#1a2b4a",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={cfg.label}
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        color: cfg.color,
                        fontWeight: 600,
                        fontSize: "10px",
                        height: 20,
                        border: `1px solid ${cfg.border}`,
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  {/* Participants */}
                  {task.participants?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {task.participants.map((p) => (
                        <Box
                          key={p.participant_id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 18,
                              height: 18,
                              fontSize: "9px",
                              bgcolor: cfg.border,
                              color: "#fff",
                            }}
                          >
                            {getInitials(p)}
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "11px", color: "text.secondary" }}
                          >
                            {p.preferred_name ||
                              `${p.first_name} ${p.last_name}`}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default DayPanel;
