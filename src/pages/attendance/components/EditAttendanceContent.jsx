import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  MenuItem,
  IconButton,
  TextField,
  Divider,
  useColorScheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomForm } from "../../../components/form/CustomForm";
import CustomFormTextField from "../../../components/textField/CustomTextField";
import { useValidSchema } from "../../../hooks/useValidShema";
import { updateAttendance } from "../../../api/queries/put";
import { useAppMutation } from "../../../hooks/useMutation";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CustomTimePicker from "./CustomDateSelect";
import { useLocale } from "../../../hooks/useLocale";

const EditAttendance = ({ data, onClose }) => {
  const { t } = useLocale();
  const { AttendanceValid } = useValidSchema();
  const { mode } = useColorScheme();
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes("T")) return dayjs(timeStr);
    return dayjs(`${dayjs().format("YYYY-MM-DD")}T${timeStr}`);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      attendance_id: data.attendance_id,
      check_in: parseTime(data.checkInRaw),
      check_out: parseTime(data.checkOutRaw),
      status: data.status,
      reason: data.reason || "",
    },
    resolver: yupResolver(AttendanceValid),
    mode: "onSubmit",
  });

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
      check_in: formData.check_in ? dayjs(formData.check_in).format("HH:mm") : null,
      check_out: formData.check_out ? dayjs(formData.check_out).format("HH:mm") : null,
      status: formData.status,
      reason: formData.reason,
    });
  };

  return (
    <Box>
      <CustomForm handleSubmit={handleSubmit(submitHandler)}>
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "28px",
              verticalAlign: "middle",
            }}
          >
            {t("attendance.editTitle")}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ width: "21px", height: "21px" }} />
          </IconButton>
        </Box>
        <Divider />
        <Box px={3} pb={3}>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: mode == "dark" ? "#1F2937" : "#F4F4F4",
              borderRadius: "8px",
              padding: 2,
              my: 2,
            }}
            gap={2}
          >
            <Avatar
              src={`http://194.156.117.223:8004/yerinde/storage-service/attendances/${data?.employee_id}`}
              alt={data?.employee_id}
            />
            <Box>
              <Typography fontWeight={600}>{data.name}</Typography>
              <Typography fontSize={13} color="text.secondary">
                {data.position}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={6}>
              <CustomTimePicker
                control={control}
                name="check_in"
                label={t("common.checkInTime")}
                errors={errors}
                marginTop={0}
              />
            </Grid>

            <Grid size={6}>
              <CustomTimePicker
                control={control}
                name="check_out"
                label={t("common.checkOutTime")}
                errors={errors}
                marginTop={0}
              />
            </Grid>
            <Grid size={12}>
              <Typography fontSize={14} mb={0.5}>
                {t("common.status")}
              </Typography>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    {...field}
                    SelectProps={{
                      IconComponent: KeyboardArrowDownIcon,
                    }}
                    sx={{
                      ".css-15exkk5-MuiInputBase-root-MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="present">{t("attendance.present")}</MenuItem>
                    <MenuItem value="absent">{t("attendance.absent")}</MenuItem>
                    <MenuItem value="on_leave">{t("attendance.onLeave")}</MenuItem>
                    <MenuItem value="day_off">{t("attendance.dayOff")}</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={12}>
              <CustomFormTextField
                control={control}
                label={t("attendance.reason")}
                errors={errors}
                marginTop={0}
                name="reason"
                rowNum={3}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
            <Button variant="outlined" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </Box>
        </Box>
      </CustomForm>
    </Box>
  );
};

export default EditAttendance;
