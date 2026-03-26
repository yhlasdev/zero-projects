import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { CustomForm } from "../../../components/form/CustomForm";
import { useAppMutation } from "../../../hooks/useMutation";
import { announcementAdd } from "../../../api/queries/post";
import { updateAnnouncement } from "../../../api/queries/put";
import CustomFormTextField from "../../../components/textField/CustomTextField";
import CustomFormSelect from "../../../components/select/CustomFormSelect";
import { useLocale } from "../../../hooks/useLocale";

const AnnouncementContent = ({ onClose, data }) => {
  const { t } = useLocale();
  const isEdit = Boolean(data);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department_ids: [0],
      position_ids: [0],
      status: data?.Status || "",
      target_audience: data?.TargetAudience || "",
      text: data?.Text || "",
    },
    // resolver: yupResolver(AnnouncementValid),
    mode: "onSubmit",
  });

  const mutation = useAppMutation({
    mutationFn: isEdit ? updateAnnouncement : announcementAdd,
    queryKey: ["announcements"],
    onSuccess: () => {
      onClose();
    },
  });

  const submitHandler = async (formData) => {
    if (isEdit) {
      await mutation.mutateAsync({
        id: data.ID || data.id,
        objectData: formData,
      });
    } else {
      await mutation.mutateAsync(formData);
    }
  };

  const statusOptions = [
    { value: "publish", label: t("announcements.publishedStatus") },
    { value: "draft", label: t("announcements.draftStatus") },
  ];

  const targetOptions = [{ value: "all_employees", label: t("announcements.allEmployees") }];

  return (
    <Box>
      <CustomForm handleSubmit={handleSubmit(submitHandler)}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={3}
          pt={1.5}
        >
          <Typography fontSize={18} fontWeight={600}>
            {isEdit ? t("announcements.editAnnouncement") : t("announcements.newAnnouncement")}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box px={3} pb={3}>
          <CustomFormTextField
            control={control}
            errors={errors}
            name="text"
            rowNum={4}
            className="w-full"
            label={t("announcements.announcementText")}
            closeIcon={false}
          />

          <Grid container mt={3} spacing={3}>
            <Grid size={6}>
              <CustomFormSelect
                name="target_audience"
                label={t("announcements.targetAudience")}
                control={control}
                errors={errors}
                options={targetOptions}
              />
            </Grid>
            <Grid size={6}>
              <CustomFormSelect
                name="status"
                label={t("announcements.status")}
                control={control}
                errors={errors}
                options={statusOptions}
              />
            </Grid>
            <Grid size={6}>
              <CustomFormSelect
                name="section"
                label={t("announcements.sections")}
                control={control}
                errors={errors}
                options={statusOptions}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              pt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "8px" }}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="contained"
              type="submit"
              sx={{ borderRadius: "8px" }}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t("announcements.saving")
                : isEdit
                  ? t("common.save")
                  : t("announcements.createAnnouncement")}
            </Button>
          </Box>
        </Box>
      </CustomForm>
    </Box>
  );
};

export default AnnouncementContent;
