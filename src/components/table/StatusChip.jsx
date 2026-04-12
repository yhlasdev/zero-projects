import { Chip } from "@mui/material";
import { useLocale } from "../../hooks/useLocale";

export default function StatusChip({ status = "default" }) {
  const { t } = useLocale();
  const statusStyles = {
    approve: { bg: "#D1FAE5", text: "#299764" },
    present: { bg: "var(--complete-20, #29976433)", text: "#299764" },
    active: { bg: "#D1FAE5", text: "#299764" },
    absent: { bg: "#D93B2D33", text: "#D93B2D" },
    publish: { bg: "#D1FAE5", text: "#299764" },
    draft: { bg: "#F3F4F6", text: "#333333" },
    late: { bg: "#FEF3C7", text: "#B45309" },
    annual: { bg: "#DBEAFE", text: "#1D61E7" },
    sick: { bg: "#FEF3C7", text: "#B45309" },
    unpaid: { bg: "#F3F4F6", text: "#333333" },
  };

  const { bg, text } = statusStyles[status?.toLowerCase()] || {
    bg: "#e2e3e5",
    text: "#6c757d",
  };
  return (
    <Chip
      label={t([`attendance.${status?.toLowerCase()}`, `common.${status?.toLowerCase()}`, status])}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: bg,
        fontSize: "14px",
        py: 0.5,
        color: text,
        textTransform: "capitalize",
      }}
    />
  );
}
