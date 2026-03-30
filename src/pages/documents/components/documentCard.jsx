import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
  Grid,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiEditLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";
import { useLocale } from "../../../hooks/useLocale";

const getFileConfig = (type) => {
  const t = type?.toLowerCase() ?? "";

  if (["pdf"].includes(t)) {
    return {
      icon: <PictureAsPdfIcon sx={{ color: "#E53935", fontSize: 22 }} />,
      bg: "#FDECEA",
    };
  }

  if (["docx", "doc", "word"].includes(t)) {
    return {
      icon: <ArticleIcon sx={{ color: "#2563EB", fontSize: 22 }} />,
      bg: "#DBEAFE",
    };
  }

  if (["xlsx", "xls", "excel", "csv", "table"].includes(t)) {
    return {
      icon: <TableChartIcon sx={{ color: "#2E7D32", fontSize: 22 }} />,
      bg: "#E8F5E9",
    };
  }

  if (["jpg", "jpeg", "png", "webp", "gif", "image", "png"].includes(t)) {
    return {
      icon: <ImageIcon sx={{ color: "#D97706", fontSize: 22 }} />, // Amber/Orange
      bg: "#FFFBEB",
    };
  }

  // Default / Other files
  return {
    icon: <DescriptionIcon sx={{ color: "#6B7280", fontSize: 22 }} />,
    bg: "#F3F4F6",
  };
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const DocumentCard = ({
  title,
  description,
  file_type,
  updated_at,
  manager_name,
  previewUrl,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const { t } = useLocale();
  const { icon, bg } = getFileConfig(file_type);
  const formattedDate = formatDate(updated_at);

  return (
    <Paper
      elevation={0}
      sx={{
        p: "25px",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        width: "346px",
        height: "234px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "8px",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 15,
              color: "#111827",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "230px",
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#9CA3AF", mt: 0.2 }}>
            {file_type?.toUpperCase()}
          </Typography>
        </Box>
      </Stack>

      {/* Description */}
      <Typography
        sx={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 1.5,
          mt: 1,
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </Typography>

      {/* Date + Author */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>
          {formattedDate}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>
          {manager_name}
        </Typography>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
        <Button
          startIcon={<LiaDownloadSolid size={16} />}
          onClick={onDownload}
          disableRipple={false}
          sx={{
            background: "#9F9F9F33",
            color: "#374151",
            boxShadow: "none",
            borderRadius: "8px",
            width: "216px",
            height: "32px",
            fontSize: 13,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              background: "#9F9F9F55",
              boxShadow: "none",
            },
          }}
        >
          {t("documents.card.download")}
        </Button>

        <IconButton
          onClick={onEdit}
          size="small"
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            width: 32,
            height: 32,
            color: "#6B7280",
            "&:hover": { background: "#F3F4F6" },
          }}
        >
          <RiEditLine size={15} />
        </IconButton>

        <IconButton
          onClick={onDelete}
          size="small"
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            width: 32,
            height: 32,
            color: "#6B7280",
            "&:hover": { background: "#FEE2E2", color: "#EF4444" },
          }}
        >
          <RiDeleteBinLine size={15} />
        </IconButton>
      </Stack>
    </Paper>
  );
};

