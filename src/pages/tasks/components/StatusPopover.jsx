import { Popover, Typography } from "@mui/material";
import { STATUS_OPTIONS, StatusItem } from "./CreateTaskUtils";

export default function StatusPopover({ anchorEl, onClose, status, setStatus, t }) {
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
          minWidth: 180,
          p: 1,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 0.5,
          px: 1,
          pt: 0.5,
          pb: 0.3,
        }}
      >
        {t("tasks.notStarted")}
      </Typography>
      <StatusItem
        opt={STATUS_OPTIONS[0]}
        selected={status === "todo"}
        t={t}
        onClick={() => {
          setStatus("todo");
          onClose();
        }}
      />

      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 0.5,
          px: 1,
          pt: 1,
          pb: 0.3,
        }}
      >
        {t("common.active")}
      </Typography>
      <StatusItem
        opt={STATUS_OPTIONS[1]}
        selected={status === "in_progress"}
        t={t}
        onClick={() => {
          setStatus("in_progress");
          onClose();
        }}
      />
      <StatusItem
        opt={STATUS_OPTIONS[2]}
        selected={status === "done"}
        t={t}
        onClick={() => {
          setStatus("done");
          onClose();
        }}
      />
    </Popover>
  );
}
