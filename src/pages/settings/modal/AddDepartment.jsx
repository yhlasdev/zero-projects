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
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartments } from "../../../api/queries/post";

const AddDepartmentModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", head_of_department: "" });
  const [errors, setErrors] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: updateDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      handleClose();
    },
    onError: (err) => {
      console.error("Add department error:", err);
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Department name is required";
    if (!form.head_of_department.trim())
      newErrors.head_of_department = "Head of department is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    mutate({
      name: form.name.trim(),
      head_of_department: form.head_of_department.trim(),
    });
  };

  const handleClose = () => {
    setForm({ name: "", head_of_department: "" });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
          Add Department
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
        {/* Department Name */}
        <Box mb={2.5}>
          <Typography variant="body2" fontWeight={500} mb="10px">
            Department Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder=""
            value={form.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              sx: { borderRadius: "8px", height: 38, fontSize: "0.875rem" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderWidth: "1px" },
              },
            }}
          />
        </Box>

        {/* Head of Department */}
        <Box mb={1}>
          <Typography variant="body2" fontWeight={500} mb="10px">
            Head of Department
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder=""
            value={form.head_of_department}
            onChange={handleChange("head_of_department")}
            error={!!errors.head_of_department}
            helperText={errors.head_of_department}
            InputProps={{
              sx: { borderRadius: "8px", height: 38, fontSize: "0.875rem" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderWidth: "1px" },
              },
            }}
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
          {isPending ? "Adding..." : "Add Department"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepartmentModal;
