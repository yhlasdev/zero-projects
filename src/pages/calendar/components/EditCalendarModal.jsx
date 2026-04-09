import { Box, Typography, IconButton, Grid, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect } from "react";

import CustomFormTextField from "../../../components/textField/CustomTextField";
import CustomFormSelect from "../../../components/select/CustomFormSelect";
import { CustomForm } from "../../../components/form/CustomForm";
import { updateCalendar } from "../../../api/queries/put";
import { useAppMutation } from "../../../hooks/useMutation";
import { useLocale } from "../../../hooks/useLocale";

export default function EditCalendarModal({ event, onClose }) {
  const { t } = useLocale();
  const typeOptions = [
    { value: "public_holiday", label: t("calendar.types.public_holiday") },
    { value: "company_event", label: t("calendar.types.company_event") },
    { value: "department_event", label: t("calendar.types.department_event") },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: null,
      description: "",
      id: 0,
      title: "",
      type: "",
    },
    mode: "onSubmit",
  });

  // Pre-fill form when event changes
  useEffect(() => {
    if (event) {
      reset({
        title: event.event_title ?? event.title ?? "",
        description: event.description ?? "",
        id: event.id ?? 0,
        type: event.event_type ?? event.type ?? "",
        date: event.date
          ? dayjs(event.date)
          : event.event_date
            ? dayjs(event.event_date)
            : null,
      });
    }
  }, [event, reset]);

  const mutation = useAppMutation({
    mutationFn: updateCalendar,
    queryKey: ["mainCalendar"],
    onSuccess: () => {
      onClose();
    },
  });

  const submitHandler = async (data) => {
    const formattedData = {
      ...data,
      date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : null,
    };
    await mutation.mutateAsync(formattedData);
  };

  return (
    <Box>
      <CustomForm handleSubmit={handleSubmit(submitHandler)}>
        <Box
          sx={{
            px: 3,
            py: 1,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
            {t("calendar.editEvent")}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 3, pt: 1 }}>
          <CustomFormTextField
            control={control}
            errors={errors}
            name="title"
            label={t("calendar.eventTitle")}
            className="w-full"
          />
          <CustomFormTextField
            control={control}
            errors={errors}
            name="description"
            label={t("tasks.description")}
            className="w-full"
            rowNum={3}
          />
          <Grid container spacing={2} alignItems="center" mt={3}>
            <Grid size={6}>
              <Typography
                fontSize={14}
                mb={0.5}
                fontWeight={500}
                color="text.secondary"
              >
                {t("announcements.date")}
              </Typography>

              <Controller
                name="date"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        size: "small",
                        variant: "outlined",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <CustomFormSelect
                name="type"
                label={t("calendar.type")}
                control={control}
                errors={errors}
                options={typeOptions}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            type="submit"
            loading={mutation.isPending}
          >
            {t("common.save")}
          </Button>
        </Box>
      </CustomForm>
    </Box>
  );
}
