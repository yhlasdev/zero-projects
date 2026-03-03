import { Chip } from "@mui/material";

export default function StatusChip({ status = "default" }) {
  const statusStyles = {
    present: { bg: "#D1FAE5", text: "#299764" },
    active: { bg: "#D1FAE5", text: "#299764" },
    absent: { bg: "#D93B2D33", text: "#D93B2D" },
    publish: { bg: "#67e091", color: "#24693d" },
    draft: { bg: "#E5E7EB", color: "#374151" },
    late: { bg: "#FEF3C7", color: "#B45309" },
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
        fontSize: '14px',
        py: 0.5,
        color: text,
        textTransform: "capitalize",
      }}
    />
  );
}
