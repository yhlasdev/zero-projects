import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import FieldLabel from "../../../components/textField/LabelInput";

const OfficeMap = ({ location = "San Francisco" }) => (
  <Box
    sx={{
      width: "100%",
      height: 200,
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid",
      borderColor: "divider",
      position: "relative",
    }}
  >
    <iframe
      title="Office Location Map"
      width="100%"
      height="100%"
      style={{ border: 0, display: "block" }}
      loading="lazy"
      src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
    />
  </Box>
);

const CompanyOverview = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [officeLocation, _setOfficeLocation] = useState("San Francisco");
  const [mapQuery, setMapQuery] = useState("San Francisco");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setMapQuery(officeLocation || "San Francisco");
    // Add your save logic here
  };

  return (
    <Box width={'full'} bgcolor={'#fff'}>
      {/* ── Logo Section ── */}
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 3, borderRadius: 2, display: "flex", alignItems: "center", gap: 3, width: 'full', maxWidth: 'full' }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            bgcolor: "grey.50",
            flexShrink: 0,
          }}
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Company Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Avatar
              src="/yerinde-logo.png"
              sx={{ width: 56, height: 56, bgcolor: "primary.light" }}
            >
              <LocationOnIcon />
            </Avatar>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Company Logo
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Upload your company logo (PNG, JPG, max 2MB)
          </Typography>
          <Button
            component="label"
            variant="outlined"
            size="small"
            startIcon={<UploadIcon />}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            Change Logo
            <input type="file" accept="image/png,image/jpeg" hidden onChange={handleLogoChange} />
          </Button>
        </Box>
      </Paper>

      {/* ── Form Fields ── */}
      <Grid container spacing={2.5} mb={3}>
        <Grid size={6}>
          <FieldLabel label="Company ID" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Company Name" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Manager Name" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Working Years" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Manager Phone Number" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Manager Email" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Manager birth date" />
        </Grid>
        <Grid size={6}>
          <FieldLabel label="Office location" />
        </Grid>
      </Grid>

      {/* ── Map Section ── */}
      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Office Location on Map
        </Typography>
        <OfficeMap location={mapQuery} />
      </Box>

      {/* ── Save Button ── */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="medium"
          // startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 3,
            fontWeight: 600,
            bgcolor: "#1a2b4a",
            "&:hover": { bgcolor: "#243560" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyOverview;