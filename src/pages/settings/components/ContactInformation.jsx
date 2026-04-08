import { useEffect } from "react";
import { Box, Button, Grid, CircularProgress, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FieldLabel from "../../../components/textField/LabelInput";
import { getSettingsContact } from "../../../api/queries/getters";
import { updateContactCompanies } from "../../../api/queries/post";
import { useLocale } from "../../../hooks/useLocale";
import { toast } from "react-toastify";

const FIELDS = () => {
  const { t } = useLocale();
  return [
    { name: "web_site", label: t("settings.contact.website"), size: 12 },
    { name: "email", label: t("settings.contact.email"), size: 6 },
    { name: "phone", label: t("settings.contact.phone"), size: 6 },
    { name: "address", label: t("settings.contact.address"), size: 12, maxRows: 3 },
  ];
};

const SOCIAL_FIELDS = [
  { name: "linked_in", label: "LinkedIn" },
  { name: "twitter", label: "Twitter" },
  { name: "facebook", label: "Facebook" },
  { name: "tiktok", label: "TikTok" },
  { name: "instagram", label: "Instagram" },
  { name: "whatsapp", label: "WhatsApp" },
];

const NAVY = "#0F3254";

const DEFAULT_VALUES = {
  address: "",
  email: "",
  facebook: "",
  instagram: "",
  linked_in: "",
  phone: "",
  tiktok: "",
  twitter: "",
  web_site: "",
  whatsapp: "",
};

const ContactInformation = () => {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const fields = FIELDS();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact-info"],
    queryFn: getSettingsContact,
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
          address: data.address ?? "",
          email: data.email ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          linked_in: data.linked_in ?? "",
          phone: data.phone ?? "",
          tiktok: data.tiktok ?? "",
          twitter: data.twitter ?? "",
          web_site: data.web_site ?? "",
          whatsapp: data.whatsapp ?? "",
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateContactCompanies,
    onSuccess: (_, variables) => {
      reset(variables, { keepDefaultValues: false });
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
      toast.success(t("settings.contact.success"));
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
    toast.error(t("settings.contact.loadFail"));
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2.5} mb={3}>
        {fields.map(({ name, label, size, maxRows = 1 }) => (
          <Grid key={name} size={size}>
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <FieldLabel
                  {...field}
                  label={label}
                  maxRows={maxRows}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        ))}

        <Grid size={12}>
          <Typography fontSize={14} fontWeight={600} color="#374151" mt={1}>
            {t("settings.contact.social")}
          </Typography>
        </Grid>

        {SOCIAL_FIELDS.map(({ name, label }) => (
          <Grid key={name} size={4}>
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <FieldLabel
                  {...field}
                  label={label}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        ))}
      </Grid>

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
            t("common.save")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactInformation;
