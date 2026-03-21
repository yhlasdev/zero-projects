import { Box, Typography, IconButton, Grid, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomFormSelect from "../../../components/select/CustomFormSelect";
import { useForm } from "react-hook-form";
import { CustomForm } from "../../../components/form/CustomForm";
import CustomFormTextField from "../../../components/textField/CustomTextField";
import { calendarAdd } from "../../../api/queries/post";
import { useAppMutation } from "../../../hooks/useMutation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Controller } from "react-hook-form";
import dayjs from "dayjs";

export default function AddEvent({ onClose }) {
  const typeOptions = [
    { value: "public_holiday", label: "Public holiday" },
    { value: "company_event", label: "Company event" },
    { value: "department_event", label: "Department event" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: null,
      description: "",
      title: "",
      type: "",
    },
    mode: "onSubmit",
  });

  const mutation = useAppMutation({
    mutationFn: calendarAdd,
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
            Add Event
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <CustomFormTextField
            control={control}
            errors={errors}
            name="title"
            label="Event title"
            className="w-full"
          />
          <CustomFormTextField
            control={control}
            errors={errors}
            name="description"
            label="Description"
            className="w-full"
            rowNum={3}
          />
          <Grid container spacing={2} alignItems="center" mt={3}>
            <Grid size={6}>
              <Box>Date</Box>
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
                label="Type"
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
          <Button variant="outlined" onClick={onClose} disabled={mutation.isLoading}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" loading={mutation.isLoading}>
            Add Event
          </Button>
        </Box>
      </CustomForm>
    </Box>
  );
}
