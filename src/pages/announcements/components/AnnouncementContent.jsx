import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FieldLabel from "../../../components/textField/LabelInput";
import { useEffect, useState } from "react";

const AnnouncementContent = ({ onClose, data }) => {
  const isEdit = Boolean(data);

  const [form, setForm] = useState({
    title: "",
    audience: "",
    publish: "",
    employees: "",
    sections: "",
    tasks: "",
  });

  // ✅ Edit mode'da form doldur
  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        audience: data.audience || "",
        publish: data.publish || "",
        employees: data.employees || "",
        sections: data.sections || "",
        tasks: data.tasks || "",
      });
    } else {
      // Add mode reset
      setForm({
        title: "",
        audience: "",
        publish: "",
        employees: "",
        sections: "",
        tasks: "",
      });
    }
  }, [data]);

  // ✅ Controlled input handler
  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (isEdit) {
      console.log("UPDATE:", form);
    } else {
      console.log("CREATE:", form);
    }

    onClose();
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={600}>
          {isEdit ? "Edit Announcement" : "New Announcement"}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Form */}
      <Grid container spacing={2}>
        <Grid size={6}>
          <FieldLabel
            label="Title"
            value={form.title}
            onChange={handleChange("title")}
          />
        </Grid>

        <Grid size={6}>
          <FieldLabel
            label="Target Audience"
            value={form.audience}
            onChange={handleChange("audience")}
          />
        </Grid>

        <Grid size={6}>
          <FieldLabel
            label="Publish"
            value={form.publish}
            onChange={handleChange("publish")}
          />
        </Grid>

        <Grid size={6}>
          <FieldLabel
            label="All Employees"
            value={form.employees}
            onChange={handleChange("employees")}
          />
        </Grid>

        <Grid size={6}>
          <FieldLabel
            label="Sections"
            value={form.sections}
            onChange={handleChange("sections")}
          />
        </Grid>

        <Grid size={6}>
          <FieldLabel
            label="Tasks"
            value={form.tasks}
            onChange={handleChange("tasks")}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        sx={{
          pt: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Update" : "Add Announcement"}
        </Button>
      </Box>
    </Box>
  );
};

export default AnnouncementContent;
