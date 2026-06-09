import { Box, Typography, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CustomTimePicker = ({ control, name, label, errors, marginTop = 2 }) => {
  const errorMessage = name
    .split(".")
    .reduce((acc, key) => acc?.[key], errors)?.message;

  return (
    <Box mt={marginTop}>
      <Typography fontSize={14} mb={0.5}>
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TimePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                error: !!errorMessage,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#F5F5F5",
                    height: "56px",
                    fontSize: "18px",
                  },
                },
              },
            }}
          />
        )}
      />
    </Box>

  );
};

export default CustomTimePicker;
