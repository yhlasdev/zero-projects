import { Box, Typography, Divider, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { CustomForm } from "../../../components/form/CustomForm";
import { useAppMutation } from "../../../hooks/useMutation";
import { announcementAdd } from "../../../api/queries/post";
import { updateAnnouncement } from "../../../api/queries/put";
import CustomFormTextField from "../../../components/textField/CustomTextField";
import CustomFormSelect from "../../../components/select/CustomFormSelect";

const AnnouncementContent = ({ onClose, data }) => {
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
    { value: "publish", label: "Publish" },
    { value: "draft", label: "Draft" },
  ];

  const targetOptions = [{ value: "all_employees", label: "all_employees" }];

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
            {isEdit ? "Edit Announcement" : "New Announcement"}
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
            label={"Text"}
            closeIcon={false}
          />

          <Box display={"flex"} gap={4} mt={3}>
            <CustomFormSelect
              name="target_audience"
              label="Target Audience"
              control={control}
              errors={errors}
              options={targetOptions}
            />
            <CustomFormSelect
              name="status"
              label="Status"
              control={control}
              errors={errors}
              options={statusOptions}
            />
          </Box>
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
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              sx={{ borderRadius: "8px" }}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create Announcement"}
            </Button>
          </Box>
        </Box>
      </CustomForm>
    </Box>
  );
};

export default AnnouncementContent;
