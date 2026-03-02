import { Chip } from "@mui/material";

export default function StatusChip({ status = "default" }) {
  const statusStyles = {
    present: { bg: "#e6f4ea", text: "#237b4b" },
    active: { bg: "#D1FAE5", text: "#299764" },
    absent: { bg: "#fde8e8", text: "#b02a37" },
    late: { bg: "#fff8e6", text: "#a87d00" },
    publish: { bg: "#67e091", color: "#24693d" },
    draft: { bg: "#E5E7EB", color: "#374151" },
  };

  const { bg, text } = statusStyles[status?.toLowerCase()] || {
    bg: "#e2e3e5",
    text: "#6c757d",
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: bg,
        color: text,
        textTransform: "capitalize",
      }}
    />
  );
}
