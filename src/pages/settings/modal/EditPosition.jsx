import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobs } from "../../../api/queries/put";
import { useLocale } from "../../../hooks/useLocale";
import { toast } from "react-toastify";

const EditPositionModal = ({
  open,
  onClose,
  position,
  departmentId,
  departmentName,
}) => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && position) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobTitle(position.title ?? position.job_title ?? "");
      setError("");
    }
  }, [open, position]);

  const targetDeptId = departmentId ?? position?.department_id;

  const { mutate, isPending } = useMutation({
    mutationFn: updateJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", targetDeptId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });

      toast.success(t("settings.modal.posUpdated"));

      handleClose();
    },
    onError: (err) => {
      console.error("Edit position error:", err);
      toast.error(t("settings.modal.posUpdatedErr"));
    },
  });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!jobTitle.trim()) {
      setError(t("settings.modal.posTitleReq"));
      return;
    }

    mutate({
      id: String(position?.id),
      department_id: targetDeptId,
      job_title: jobTitle.trim(),
    });
  };

  const handleClose = () => {
    setJobTitle("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 672,
          height: 340,
          borderRadius: "12px",
          boxShadow: (theme) => theme.palette.mode === 'dark' ? "0px 25px 50px -12px rgba(0,0,0,0.7)" : "0px 25px 50px -12px rgba(0,0,0,0.25)",
          p: 0,
        },
      }}
    >
      {/* Header */}
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
          {t("settings.modal.editPos")}
        </Typography>

        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Box component="form" onSubmit={handleSubmit}>
        {/* Content */}
        <DialogContent sx={{ px: 3, py: 1 }}>
          {/* Department */}
          <Box
            mb={3}
            sx={{
              minHeight: 67,
              borderRadius: "8px",
              bgcolor: "action.hover",
              mt: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography fontSize="12px" color="text.secondary" mb={0.5}>
              {t("common.department")}
            </Typography>

            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
              {departmentName ?? "—"}
            </Typography>
          </Box>

          {/* Position title */}
          <Box>
            <Typography fontSize="13px" mb={1}>
              {t("settings.modal.posTitle")}
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                if (error) setError("");
              }}
              error={!!error}
              helperText={error}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "42px",
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* Actions */}
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
            onClick={handleClose}
            disabled={isPending}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              height: "36px",
              color: "text.primary",
              borderColor: "divider",
            }}
          >
            {t("common.cancel")}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={14} color="inherit" /> : null
            }
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              height: "36px",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isPending ? t("common.deleting").replace('...', '') + '...' : t("common.save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditPositionModal;
