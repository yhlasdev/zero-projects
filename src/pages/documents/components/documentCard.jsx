import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    IconButton,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const DocumentCard = ({
    title,
    size,
    description,
    date,
    author,
    type = "other",
    onDownload,
    onEdit,
    onDelete,
}) => {
    const getIcon = () => {
        switch (type) {
            case "pdf":
                return <PictureAsPdfIcon sx={{ color: "#E53935", fontSize: 28 }} />;
            case "doc":
                return <DescriptionIcon sx={{ color: "#1976D2", fontSize: 28 }} />;
            case "xls":
                return (
                    <InsertDriveFileIcon sx={{ color: "#2E7D32", fontSize: 28 }} />
                );
            default:
                return <InsertDriveFileIcon sx={{ fontSize: 28 }} />;
        }
    };

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid #e5e7eb",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* TOP SECTION */}
                <Box sx={{ display: "flex", gap: 2 }}>

                    {/* ICON BOX */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {getIcon()}
                    </Box>

                    {/* TITLE + SIZE */}
                    <Box>
                        <Typography fontWeight={600} fontSize={18}>
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ mt: 0.5 }}
                        >
                            {size}
                        </Typography>
                    </Box>
                </Box>

                {/* DESCRIPTION */}
                <Typography
                    variant="body1"
                    sx={{
                        mt: 2.5,
                        lineHeight: 1.6,
                    }}
                >
                    {description}
                </Typography>

                {/* DATE + AUTHOR */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2.5,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {date}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {author}
                    </Typography>
                </Box>

                {/* ACTIONS */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mt: 3,
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={onDownload}
                        sx={{
                            textTransform: "none",
                            borderRadius: 3,
                            backgroundColor: "#e5e7eb",
                            color: "#111827",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#d1d5db",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Download
                    </Button>

                    <IconButton
                        onClick={onEdit}
                        sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                        }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={onDelete}
                        sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                        }}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};
