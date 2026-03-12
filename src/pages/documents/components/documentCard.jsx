import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

const getFileIcon = (type) => {
  if (type?.includes("pdf"))
    return <PictureAsPdfIcon sx={{ color: "#E53935" }} />;
  if (type?.includes("excel") || type?.includes("sheet"))
    return <TableChartIcon sx={{ color: "#2E7D32" }} />;

  return <DescriptionIcon sx={{ color: "#1976D2" }} />;
};

export const DocumentCard = ({
  title,
  description,
  file_type,
  updated_at,
  manager_name,
  onDownload,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "0.2s",
        width: "350px",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getFileIcon(file_type)}
        </Box>

        <Box>
          <Typography fontWeight={600}>{title}</Typography>
          <Typography fontSize={12} color="text.secondary">
            {file_type}
          </Typography>
        </Box>
      </Stack>

      <Typography
        sx={{
          mt: 2,
          fontSize: 14,
          color: "text.secondary",
        }}
      >
        {description}
      </Typography>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Typography fontSize={12} color="text.secondary">
          {updated_at}
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          {manager_name}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          startIcon={<DownloadIcon />}
          fullWidth
          variant="contained"
          sx={{
            background: "#F3F4F6",
            color: "#111",
            boxShadow: "none",
            "&:hover": { background: "#E5E7EB" },
          }}
          onClick={onDownload}
        >
          Download
        </Button>

        <IconButton onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
};
