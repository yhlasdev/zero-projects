import { Controller } from "react-hook-form";
import { TextField, MenuItem, Box, Typography } from "@mui/material";
import { memo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const getErrorMessage = (errors, name) => {
  return name.split(".").reduce((acc, key) => acc?.[key], errors)?.message;
};

const CustomFormSelect = ({
  name,
  control,
  errors,
  label,
  options = [],
  required = false,
  errorTitle = true,
  ...rest
}) => {
  const errorMessage = getErrorMessage(errors, name);

  return (
    <Box className="relative w-full">
      {label && (
        <Typography
          fontSize={13}
          mb={0.5}
          fontWeight={500}
          color="text.secondary"
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            {...rest}
            select
            fullWidth
            size="small"
            variant="outlined"
            error={!!errorMessage}
            sx={{
              ".css-15exkk5-MuiInputBase-root-MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            label=""
            SelectProps={{
              IconComponent: KeyboardArrowDownIcon,
            }}
            InputLabelProps={{ shrink: false }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {errorMessage && errorTitle && (
        <Typography
          component="p"
          sx={{ fontSize: "12px", color: "#d32f2f", mt: 0.5 }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default memo(CustomFormSelect);
