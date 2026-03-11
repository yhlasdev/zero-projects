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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartments } from "../../../api/queries/put";

const EditDepartmentModal = ({ open, onClose, department }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", head_of_departments: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: department.name ?? "",
        head_of_departments: department.head_of_departments ?? "",
      });
      setErrors({});
    }
  }, [department]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      handleClose();
    },
    onError: (err) => {
      console.error("Update department error:", err);
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Department name is required";
    if (!form.head_of_departments.trim())
      newErrors.head_of_departments = "Head of department is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    mutate({
      id: department.id.toString(),
      name: form.name.trim(),
      head_of_departments: form.head_of_departments.trim(),
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: 38,
      fontSize: "0.875rem",
      "& fieldset": { borderWidth: "1px" },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 672,
          minHeight: 309,
          borderRadius: "12px",
          p: 0,
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
          Edit Department
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 0 }}>
        <Box mb={2.5}>
          <Typography variant="body2" fontWeight={500} mb="10px">
            Department Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={form.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={inputSx}
          />
        </Box>

        <Box mb={1}>
          <Typography variant="body2" fontWeight={500} mb="10px">
            Head of Department
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={form.head_of_departments}
            onChange={handleChange("head_of_departments")}
            error={!!errors.head_of_departments}
            helperText={errors.head_of_departments}
            sx={inputSx}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, py: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={isPending}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 2.5,
            fontWeight: 500,
            color: "text.primary",
            borderColor: "grey.300",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          startIcon={
            isPending ? <CircularProgress size={14} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 2.5,
            fontWeight: 600,
            bgcolor: "#1a2e44",
            "&:hover": { bgcolor: "#243d58" },
          }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartmentModal;
