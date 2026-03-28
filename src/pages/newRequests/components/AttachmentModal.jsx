import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Button,
  Typography,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const AttachmentModal = ({ open, onClose, imageUrl, fileName = "certificate.jpg" }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Document Preview
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main', bgcolor: 'rgba(217, 59, 45, 0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
            overflow: 'hidden',
            bgcolor: '#f8fafc',
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt="Attachment"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            />
          ) : (
            <Typography color="text.secondary">No image available</Typography>
          )}
        </DialogContent>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            bgcolor: '#fff',
          }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              bgcolor: '#1a2e44',
              '&:hover': { bgcolor: '#2c4a6b' },
              borderRadius: '8px',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            Download Document
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AttachmentModal;
