import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";


// ✅ Status Color Map
const statusColors = {
  Pending: "warning",
  Accepted: "success",
  Rejected: "error",
  Salary: "primary",
  Complaint: "warning",
  Transfer: "default"
};

export default function RequestCard({
  title,
  type,
  status,
  name,
  department,
  date,
  description,
  hasAttachment,
  onViewDetails
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.25s ease",
        marginTop: 1.5,
        "&:hover": {
          borderColor: "success.main",
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems='center'>
            <Box>
              <Typography fontWeight={600}>{title}</Typography>

              <Stack direction="row" spacing={1} mt={1}>
                <Chip
                  label={type}
                  color={statusColors[type] || "default"}
                  size="small"
                />

                <Chip
                  label={status}
                  color={statusColors[status] || "default"}
                  size="small"
                />
              </Stack>
            </Box>

            <Button variant="outlined" size="small"
              onClick={() => onViewDetails?.()}
            >
              View Details
            </Button>
          </Box>

          {/* Meta Info */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonOutlineIcon fontSize="small" />
              <Typography variant="body2">{name}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">{department}</Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon fontSize="small" />
              <Typography variant="body2">{date}</Typography>
            </Stack>

            {hasAttachment && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AttachFileIcon fontSize="small" />
                <Typography variant="body2">Attachment</Typography>
              </Stack>
            )}
          </Stack>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
