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
import { getAllDepartment, getAllJobs } from "../../../api/queries/getters";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

const AnnouncementContent = ({ onClose, data }) => {

  const { t } = useLocale();
  const isEdit = Boolean(data);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: data?.Status || "",
      target_audience: (data?.DepartmentIDs?.[0] || data?.DepartmentIds?.[0] || data?.department_ids?.[0]) ? String(data?.DepartmentIDs?.[0] || data?.DepartmentIds?.[0] || data?.department_ids?.[0]) : "",
      section: (data?.PositionIDs?.[0] || data?.PositionIds?.[0] || data?.position_ids?.[0]) ? String(data?.PositionIDs?.[0] || data?.PositionIds?.[0] || data?.position_ids?.[0]) : "",
      text: data?.Text || data?.text || "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (data) {
      reset({
        status: data?.Status || "",
        target_audience: (data?.DepartmentIDs?.[0] || data?.DepartmentIds?.[0] || data?.department_ids?.[0]) ? String(data?.DepartmentIDs?.[0] || data?.DepartmentIds?.[0] || data?.department_ids?.[0]) : "",
        section: (data?.PositionIDs?.[0] || data?.PositionIds?.[0] || data?.position_ids?.[0]) ? String(data?.PositionIDs?.[0] || data?.PositionIds?.[0] || data?.position_ids?.[0]) : "",
        text: data?.Text || data?.text || "",
      });
    }
  }, [data, reset]);

  const selectedDepartment = useWatch({
    control,
    name: "target_audience",
  });

  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getAllDepartment();
        const deptOptions = res?.data?.data?.map((dept) => ({
          value: String(dept.id),
          label: dept.name,
        })) || [];
        setDepartments(deptOptions);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (selectedDepartment) {
        try {
          const res = await getAllJobs(selectedDepartment);
          const jobOptions = res?.data?.data?.map((job) => ({
            value: String(job.id),
            label: job.title,
          })) || [];
          setJobs(jobOptions);
        } catch (error) {
          console.error("Failed to fetch jobs", error);
        }
      } else {
        setJobs([]);
      }
    };
    fetchJobs();
  }, [selectedDepartment]);

  const mutation = useAppMutation({
    mutationFn: isEdit ? updateAnnouncement : announcementAdd,
    queryKey: ["announcements"],
    onSuccess: () => {
      onClose();
    },
  });

  const submitHandler = async (formData) => {
    let targetAudience = "all_employees";
    if (formData.target_audience) {
      targetAudience = "departments";
    }

    const payload = {
      text: formData.text,
      status: formData.status,
      target_audience: targetAudience,
      department_ids: formData.target_audience
        ? [Number(formData.target_audience)]
        : [0],
      position_ids: formData.section ? [Number(formData.section)] : [0],
    };

    console.log('this-payload-++__++---------', payload);

    if (isEdit) {
      await mutation.mutateAsync({
        id: data.ID || data.id,
        objectData: payload,
      });
    } else {
      await mutation.mutateAsync(payload);
    }
  };

  const statusOptions = [
    { value: "publish", label: t("announcements.publishedStatus") },
    { value: "draft", label: t("announcements.draftStatus") },
  ];

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
                label={t("announcements.targetAudience") || "Department"}
                control={control}
                errors={errors}
                options={departments}
              />
            </Grid>
            <Grid size={6}>
              <CustomFormSelect
                name="section"
                label={t("announcements.sections") || "Jobs"}
                control={control}
                errors={errors}
                options={jobs}
                disabled={!selectedDepartment}
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
