import { Popover, Typography, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { PRIORITY_OPTIONS } from "./CreateTaskUtils";

export default function PriorityPopover({ anchorEl, onClose, priority, setPriority, t }) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          mt: 0.5,
          boxShadow: (theme) => theme.shadows[8],
          minWidth: 160,
          p: 1,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 0.5,
          px: 1,
          pt: 0.5,
          pb: 0.5,
        }}
      >
        {t("tasks.priority")}
      </Typography>
      {PRIORITY_OPTIONS.map((p) => (
        <Box
          key={p.value}
          onClick={() => {
            setPriority(p.value === "clear" ? null : p.value);
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            px: 1,
            py: 0.8,
            borderRadius: "6px",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
        >
          {p.value === "clear" ? (
            <Box
              sx={{
                width: 16,
                height: 16,
                border: "1.5px solid #cbd5e1",
                borderRadius: "4px",
              }}
            />
          ) : (
            <FlagOutlinedIcon sx={{ fontSize: 16, color: p.flagColor }} />
          )}
          <Typography
            sx={{
              fontSize: 13,
              color: p.value === "clear" ? "text.secondary" : "text.primary",
              fontWeight: priority === p.value ? 600 : 400,
            }}
          >
            {t(`tasks.priorityLevels.${p.value}`)}
          </Typography>
          {priority === p.value && (
            <CheckIcon sx={{ fontSize: 14, color: "#3b82f6", ml: "auto" }} />
          )}
        </Box>
      ))}
    </Popover>
  );
}
