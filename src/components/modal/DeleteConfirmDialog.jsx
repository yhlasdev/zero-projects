import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocale } from "../../hooks/useLocale";
import { toast } from "react-toastify";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isPending,
  title,
  itemName,
  successMessage,
  errorMessage,
}) => {
  const { t } = useLocale();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(successMessage || t("settings.deleteSuccess"));
    } catch (e) {
      console.log(e);
      toast.error(errorMessage || t("settings.deleteFailed"));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 480,
          borderRadius: "12px",
          boxShadow: "0px 25px 50px -12px #00000040",
          p: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2.5,
          pb: 2,
        }}
      >
        <Typography fontSize="16px" fontWeight={600}>
          {title || t("settings.deleteConfirmTitle")}
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 3, py: 1, mt: 2 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "text.secondary",
            lineHeight: "20px",
          }}
        >
          {t("settings.deleteConfirmDescPrefix")}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {itemName}
          </Box>
          {t("settings.deleteConfirmDescSuffix")}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 2,
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isPending}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            height: "36px",
            color: "#111827",
            borderColor: "#D1D5DB",
          }}
        >
          {t("common.cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress size={14} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            height: "36px",
            bgcolor: "#DC2626",
            "&:hover": { bgcolor: "#B91C1C" },
          }}
        >
          {isPending ? t("common.deleting") : t("common.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
