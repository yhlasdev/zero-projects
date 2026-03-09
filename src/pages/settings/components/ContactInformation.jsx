import { useEffect } from "react";
import { Box, Button, Grid, CircularProgress, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FieldLabel from "../../../components/textField/LabelInput";
import { getSettingsContact } from "../../../api/queries/getters";
import { updateContactCompanies } from "../../../api/queries/post";
import toast from "react-hot-toast";

const FIELDS = [
  { name: "web_site", label: "Website", size: 12 },
  { name: "email", label: "Email", size: 6 },
  { name: "phone", label: "Phone", size: 6 },
  { name: "address", label: "Address", size: 12, maxRows: 3 },
];

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
  const queryClient = useQueryClient();

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
      toast.success("Contact information saved successfully.");
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
    toast.error("Failed to load contact information. Please refresh the page.");
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2.5} mb={3}>
        {FIELDS.map(({ name, label, size, maxRows = 1 }) => (
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
            Social media links
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
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactInformation;
