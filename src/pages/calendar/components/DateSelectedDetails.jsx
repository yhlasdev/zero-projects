import { Box, Typography, IconButton, Popover, Button, Stack } from "@mui/material";
import { getStyle } from "./DateUtils";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useLocale } from "../../../hooks/useLocale";

export default function DateSelectedDetails({
  selectedEvents,
  EVENT_STYLES,
  borderColor,
  onEdit,
  onDelete,
}) {
  const { t } = useLocale();
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  if (!selectedEvents || selectedEvents.length === 0) return null;

  const handleDeleteClick = (event, eventObj) => {
    setAnchorEl(event.currentTarget);
    setEventToDelete(eventObj);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setEventToDelete(null);
  };

  const handleConfirm = () => {
    if (eventToDelete) {
      onDelete?.(eventToDelete);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        mx: 3,
        mb: 2,
        pt: 2,
        borderTop: `1px solid ${borderColor}`,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {selectedEvents.map((event) => {
        const s = getStyle(event.event_type, EVENT_STYLES);

        return (
          <Box
            key={event.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
              minWidth: "200px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "2px",
                  bgcolor: s.dot,
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: "13px" }}>
                {event.event_title}
              </Typography>
            </Box>

            <Box>
              <IconButton size="small" onClick={() => onEdit?.(event)}>
                <FiEdit2 size={16} />
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => handleDeleteClick(e, event)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </Box>
          </Box>
        );
      })}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              mb: 1.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
            },
          },
        }}
      >
        <Typography sx={{ fontSize: "14px", fontWeight: 500, mb: 2 }}>
          {t("settings.deleteConfirmTitle")}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={handleClose}
            sx={{ borderRadius: "6px", textTransform: "none" }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleConfirm}
            sx={{ borderRadius: "6px", textTransform: "none" }}
          >
            {t("common.delete")}
          </Button>
        </Stack>
      </Popover>
    </Box>
  );
}
