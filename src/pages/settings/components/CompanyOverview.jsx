import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  useColorScheme,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FieldLabel from "../../../components/textField/LabelInput";
import { getSettingsOverview } from "../../../api/queries/getters";
import { updateContactOverview, uploadCompanyLogo } from "../../../api/queries/post";
import { toast } from "react-toastify";
import { useLocale } from "../../../hooks/useLocale";
import CustomCarto from "../../../components/customCarto/CustomCarto";

const NAVY = "#0F3254";

const DEFAULT_VALUES = {
  company_name: "",
  manager_name: "",
  manager_phone_number: "",
  manager_mail: "",
  manager_birth_date: "",
  open_year: "",
  latitude: 0,
  longitude: 0,
  radius: 5,
};

const CompanyOverview = () => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { mode } = useColorScheme()
  const [logoKey, setLogoKey] = useState(Date.now());
  const { data, isLoading, isError } = useQuery({
    queryKey: ["overview-info"],
    queryFn: getSettingsOverview,
    select: (res) => res?.data?.data ?? res?.data ?? {},
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
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
          latitude: data?.location?.latitude ?? 0,
          longitude: data?.location?.longitude ?? 0,
          radius: data?.location?.radius ?? 100,
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateContactOverview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overview-info"] });
      toast.success(t("settings.overview.success"));
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to save. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (formData) => {
    const { latitude, longitude, radius, ...rest } = formData;
    const payload = {
      ...rest,
      location: {
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        radius: Number(radius) || 0,
      },
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        reset(formData, { keepDefaultValues: false });
      }
    });
  };

  const logoMutation = useMutation({
    mutationFn: uploadCompanyLogo,
    onSuccess: () => {
      setLogoKey(Date.now());
      queryClient.invalidateQueries({ queryKey: ["overview-info"] });
      toast.success(t("settings.overview.logoSuccess") || "Logo updated successfully");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to upload logo. Please try again.";
      toast.error(message);
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && data?.id) {
      const formData = new FormData();
      formData.append("images", file);

      logoMutation.mutate({
        id: data.id,
        formData
      });
    }
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
    toast.error(t("settings.overview.loadFail"));
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
          {data?.id ? (
            <img
              src={`http://194.156.117.223:8004/yerinde/storage-service/logo/${data?.id}/100x100?t=${logoKey}`}
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
            {t('settings.companyLogo')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            {t('settings.logoHint')}
          </Typography>
          <Button
            component="label"
            variant="outlined"
            size="small"
            disabled={logoMutation.isPending}
            startIcon={logoMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
            sx={{ textTransform: "none", borderRadius: 1.5, bgcolor: mode == 'dark' ? 'action.hover' : '', color: mode == 'dark' ? '#fff' : '' }}
          >
            {logoMutation.isPending ? t('common.loading', 'Loading...') : t('settings.changeLogo')}
            <input
              type="file"
              accept="image/png,image/jpeg"
              hidden
              onChange={handleLogoChange}
            />
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2.5} mb={3}>
        <Grid size={6}>
          <FieldLabel
            label={t('settings.companyId')}
            value={data?.id ?? ""}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#6b7280",
              },
            }}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="company_name"
            control={control}
            render={({ field, fieldState }) => (
              <FieldLabel
                {...field}
                label={t('settings.companyName')}
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
                label={t('settings.managerName')}
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
                label={t('settings.workingYears')}
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
                label={t('settings.managerPhone')}
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
                label={t('settings.managerEmail')}
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
                label={t("settings.overview.birthDate")}
                placeholder="YYYY-MM-DD"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {(() => {
          const lat = watch("latitude");
          const lng = watch("longitude");
          const hasLocation = lat && lng && !(lat === 0 && lng === 0);
          return (
            <Grid size={6}>
              <FieldLabel
                label={t('settings.officeLocation')}
                value={hasLocation ? `${lat}, ${lng}` : ""}
                placeholder={t('settings.notSet')}
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

      <Box mb={3}>
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          {t('settings.mapTitle')}
        </Typography>
        <CustomCarto
          latitude={watch('latitude')}
          longitude={watch('longitude')}
          radius={watch('radius')}
          onChange={(val) => {
            setValue('latitude', val.latitude, { shouldDirty: true });
            setValue('longitude', val.longitude, { shouldDirty: true });
            setValue('radius', val.radius, { shouldDirty: true });
          }}
        />
      </Box>

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
            t('common.save')
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyOverview;
