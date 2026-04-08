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
import { updateDepartments } from "../../../api/queries/post";
import { useLocale } from "../../../hooks/useLocale";
import { toast } from "react-toastify";

const AddDepartmentModal = ({ open, onClose }) => {
  const { t } = useLocale();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    head_of_department: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ name: "", head_of_department: "" });
      setErrors({});
    }
  }, [open]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });

      toast.success(t("settings.modal.deptAdded"));

      handleClose();
    },
    onError: (err) => {
      console.error("Add department error:", err);
      toast.error(t("settings.modal.deptAddedErr"));
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = t("settings.modal.deptNameReq");
    }

    if (!form.head_of_department.trim()) {
      newErrors.head_of_department = t("settings.modal.deptHeadReq");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    mutate({
      name: form.name.trim(),
      head_of_department: form.head_of_department.trim(),
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 672,
          minHeight: 337,
          borderRadius: "12px",
          boxShadow: "0px 25px 50px -12px #00000040",
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
          {t("settings.modal.addDept")}
        </Typography>

        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Box component="form" onSubmit={handleSubmit}>
        {/* Content */}
        <DialogContent sx={{ px: 3, py: 1, mt: 2 }}>
          {/* Department Name */}
          <Box mb={3}>
            <Typography fontSize="13px" mb={1}>
              {t("settings.modal.deptName")}
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={form.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "42px",
                },
              }}
            />
          </Box>

          {/* Head */}
          <Box>
            <Typography fontSize="13px" mb={1}>
              {t("settings.modal.deptHead")}
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={form.head_of_department}
              onChange={handleChange("head_of_department")}
              error={!!errors.head_of_department}
              helperText={errors.head_of_department}
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
              color: "#111827",
              borderColor: "#D1D5DB",
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
              bgcolor: "#1E3A5F",
              "&:hover": { bgcolor: "#2A4A73" },
            }}
          >
            {isPending ? t("common.deleting").replace('...', '') + '...' : t("settings.modal.addDept")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddDepartmentModal;
