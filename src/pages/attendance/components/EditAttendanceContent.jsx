import { useState } from "react";
import { Box, Button, Grid, Typography, Avatar, MenuItem, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomForm } from "../../../components/form/CustomForm";
import CustomFormTextField from '../../../components/textField/CustomTextField';
import { useValidSchema } from "../../../hooks/useValidShema";
import { updateAttendance } from "../../../api/queries/put";
import { useAppMutation } from "../../../hooks/useMutation";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

const EditAttendance = ({ data, onClose }) => {
  const { AttendanceValid } = useValidSchema();
  const [avatar] = useState(data.avatar);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      attendance_id: data.attendance_id,
      check_in: data.checkInRaw ? dayjs(data.checkInRaw) : null,
      check_out: data.checkOutRaw ? dayjs(data.checkOutRaw) : null,
      status: data.status,
      reason: data.reason || "",
    },
    resolver: yupResolver(AttendanceValid),
    mode: 'onSubmit',
  });

  // const getEmployeeImage = async (attendance_id) => {
  //   try {
  //     const response = await axios.get(`http://194.156.117.223:8004/yerinde/storage-service/attendances/${attendance_id}`);
  //     // response.data.image veya response.data.imageUrl API response'una göre ayarla
  //     return response.data.image || response.data.imageUrl || data.avatar;
  //   } catch (err) {
  //     console.error("Employee image fetch error:", err);
  //     return data.avatar; // hata olursa default avatar kullan
  //   }
  // };

  // useEffect(() => {
  //   getEmployeeImage(data.id).then(setAvatar);
  // }, [data.id]);


  const mutation = useAppMutation({
    mutationFn: updateAttendance,
    queryKey: ["attendances"],
    onSuccess: () => {
      onClose();
    },
  });


  const submitHandler = async (formData) => {
    await mutation.mutateAsync({
      attendance_id: Number(formData.attendance_id),
      check_in: formData.check_in,
      check_out: formData.check_out,
      status: formData.status,
      reason: formData.reason,
    });
  };

  return (
    <Box p={3}>
      <CustomForm handleSubmit={handleSubmit(submitHandler)}>
        {/* Header */}
        <Box sx={{ px: 0, pb: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>Edit Attendance Record</Typography>
          <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* Employee Info */}
        <Box display="flex" alignItems="center" sx={{ backgroundColor: "#dee1ec", borderRadius: 1, padding: 2, my: 2 }} gap={2}>
          <Avatar src={avatar} />
          <Box>
            <Typography fontWeight={600}>{data.name}</Typography>
            <Typography fontSize={13} color="text.secondary">{data.position}</Typography>
          </Box>
        </Box>

        {/* Form Fields */}
        <Grid container spacing={2}>
          <Grid size={6}>
            <Controller
              name="check_in"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Check In"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.check_in,
                        helperText: errors.check_in?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="check_out"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Check Out"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.check_out,
                        helperText: errors.check_out?.message,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Typography fontSize={13} mb={0.5}>Status</Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select fullWidth size="small" {...field}>
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Typography fontSize={13} mb={0.5}>Reason</Typography>
            <CustomFormTextField
              control={control}
              errors={errors}
              name='reason'
              rowNum={3}
              className="w-full"
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </CustomForm>
    </Box>
  );
};

export default EditAttendance;