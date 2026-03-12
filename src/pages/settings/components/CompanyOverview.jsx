import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FieldLabel from "../../../components/textField/LabelInput";
import { getSettingsOverview } from "../../../api/queries/getters";
import { updateContactOverview } from "../../../api/queries/post";
import toast from "react-hot-toast";

const OfficeMap = ({ latitude, longitude }) => {
  if (!latitude || !longitude) return null;
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  return (
    <Box
      sx={{
        width: "100%",
        height: 200,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <iframe
        title="Office Location"
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        src={src}
      />
    </Box>
  );
};

const NAVY = "#0F3254";

const DEFAULT_VALUES = {
  company_name: "",
  manager_name: "",
  manager_phone_number: "",
  manager_mail: "",
  manager_birth_date: "",
  open_year: "",
};

const CompanyOverview = () => {
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["overview-info"],
    queryFn: getSettingsOverview,
    select: (res) => res?.data?.data ?? res?.data ?? {},
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (data) {
      reset(
        {
          company_name: data.company_name ?? "",
          manager_name: data.manager_name ?? "",
          manager_phone_number: data.manager_phone_number ?? "",
          manager_mail: data.manager_mail ?? "",
          manager_birth_date: data.manager_birth_date ?? "",
          open_year: data.open_year ?? "",
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateContactOverview,
    onSuccess: (_, variables) => {
      reset(variables, { keepDefaultValues: false });
      queryClient.invalidateQueries({ queryKey: ["overview-info"] });
      toast.success("Company overview saved successfully.");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to save. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress sx={{ color: NAVY }} />
      </Box>
    );
  }

  if (isError) {
    toast.error("Failed to load company overview.");
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* ── Logo ── */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
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
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Avatar sx={{ width: 56, height: 56 }}>
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
            <input
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handleLogoChange}
            />
          </Button>
        </Box>
      </Paper>

      {/* ── Form Fields ── */}
      <Grid container spacing={2.5} mb={3}>
        {/* Read-only: ID */}
        <Grid size={6}>
          <FieldLabel
            label="Company ID"
            value={data?.id ?? ""}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#6b7280",
              },
            }}
          />
        </Grid>

        {/* Editable fields */}
        <Grid size={6}>
          <Controller
            name="company_name"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Company Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="manager_name"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Manager Name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="open_year"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Working Years"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="manager_phone_number"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Manager Phone Number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="manager_mail"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Manager Email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="manager_birth_date"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label="Manager Birth Date"
                placeholder="YYYY-MM-DD"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Read-only: location coords */}
        {(() => {
          const lat = data?.location?.latitude;
          const lng = data?.location?.longitude;
          const hasLocation = lat && lng && !(lat === 0 && lng === 0);
          return (
            <Grid size={6}>
              <FieldLabel
                label="Office Location (lat, lng)"
                value={hasLocation ? `${lat}, ${lng}` : ""}
                placeholder="Not set yet"
                disabled
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: hasLocation ? "#6b7280" : "#9b9b9b",
                  },
                }}
              />
            </Grid>
          );
        })()}
      </Grid>

      {/* ── Map — only shown when real coords exist ── */}
      {(() => {
        const lat = data?.location?.latitude;
        const lng = data?.location?.longitude;
        const hasLocation = lat && lng && !(lat === 0 && lng === 0);
        if (!hasLocation)
          return (
            <Box
              mb={3}
              sx={{
                width: "100%",
                height: 200,
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <LocationOnIcon sx={{ color: "text.disabled", fontSize: 36 }} />
              <Typography variant="body2" color="text.disabled">
                Office location not set yet
              </Typography>
            </Box>
          );
        return (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Office Location on Map
            </Typography>
            <OfficeMap latitude={lat} longitude={lng} />
          </Box>
        );
      })()}

      {/* ── Save ── */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          size="medium"
          disabled={mutation.isPending || !isDirty}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            px: 3,
            fontWeight: 600,
            backgroundColor: NAVY,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0a2540", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#c8d5e0", color: "#fff" },
          }}
        >
          {mutation.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyOverview;
