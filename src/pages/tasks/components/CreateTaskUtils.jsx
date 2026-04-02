import { Box, Typography, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import dayjs from "dayjs";

export const STATUS_OPTIONS = [
  {
    value: "todo",
    label: "TO DO",
    icon: <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />,
    section: "Not started",
  },
  {
    value: "in_progress",
    label: "IN PROGRESS",
    icon: (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: "#3b82f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
      </Box>
    ),
    section: "Active",
  },
  {
    value: "done",
    label: "COMPLETE",
    icon: (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
      </Box>
    ),
    section: "Active",
  },
];

export const STATUS_STYLE = {
  todo: { bgcolor: "action.selected", color: "text.secondary" },
  in_progress: { bgcolor: "primary.light", color: "primary.contrastText" },
  done: { bgcolor: "success.light", color: "success.contrastText" },
};

export const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", color: "#ef4444", flagColor: "#ef4444" },
  { value: "high", label: "High", color: "#f59e0b", flagColor: "#f59e0b" },
  { value: "normal", label: "Normal", color: "#3b82f6", flagColor: "#3b82f6" },
  { value: "low", label: "Low", color: "#94a3b8", flagColor: "#94a3b8" },
  {
    value: "clear",
    label: "Clear",
    color: "#94a3b8",
    flagColor: "#94a3b8",
    isIcon: true,
  },
];

export const DATE_SHORTCUTS = [
  { label: "Today", days: 0 },
  { label: "Later", days: 1, note: () => dayjs().format("HH:mm") },
  {
    label: "Tomorrow",
    days: 1,
    note: () => dayjs().add(1, "day").format("ddd"),
  },
  {
    label: "This weekend",
    days: null,
    note: () => "Sat",
    fn: () => dayjs().day(6),
  },
  {
    label: "Next week",
    days: null,
    note: () => "Mon",
    fn: () => dayjs().add(1, "week").startOf("week").add(1, "day"),
  },
  {
    label: "Next weekend",
    days: null,
    note: () => dayjs().add(1, "week").day(6).format("D MMM"),
    fn: () => dayjs().add(1, "week").day(6),
  },
  {
    label: "2 weeks",
    days: 14,
    note: () => dayjs().add(14, "day").format("D MMM"),
  },
  {
    label: "4 weeks",
    days: 28,
    note: () => dayjs().add(28, "day").format("D MMM"),
  },
];

export const AVATAR_COLORS = [
  "#4f8ef7",
  "#f7904f",
  "#4fc9a4",
  "#f74f6a",
  "#a04ff7",
  "#f7c94f",
  "#4fe0f7",
  "#f74fbd",
];

export const avatarColor = (id) =>
  AVATAR_COLORS[Number(String(id || 0).slice(-1)) % AVATAR_COLORS.length];

export const getInitials = (first = "", last = "") =>
  `${first[0] || ""}${last[0] || ""}`.toUpperCase();

export function StatusItem({ opt, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 0.8,
        borderRadius: "6px",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {opt.icon}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: selected ? 700 : 400,
            color: "text.primary",
          }}
        >
          {opt.label}
        </Typography>
      </Stack>
      {selected && <CheckIcon sx={{ fontSize: 14, color: "#3b82f6" }} />}
    </Box>
  );
}

export function PillButton({ icon, label, active, color, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.5,
        py: 0.6,
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        color: color || (active ? "primary.main" : "text.secondary"),
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        bgcolor: active ? "action.selected" : "background.paper",
        "&:hover": { bgcolor: "action.hover", borderColor: "primary.light" },
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

export const labelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: "text.primary",
  mb: 0.8,
};

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "primary.light" },
    "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1.5 },
  },
  "& .MuiInputBase-input": { fontSize: 14, color: "text.primary" },
};
