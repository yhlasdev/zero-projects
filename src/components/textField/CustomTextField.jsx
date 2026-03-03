import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { memo } from "react";
import CloseIcon from "@mui/icons-material/Close";

const getErrorMessage = (errors, name) => {
  return name.split(".").reduce((acc, key) => acc?.[key], errors)?.message;
};

const CustomFormTextField = ({
  control,
  errors,
  name,
  label,
  errorTitle = false,
  marginTop = 2,
  rowNum = 1,
  closeIcon = true,
  ...rest
}) => {
  const errorMessage = getErrorMessage(errors, name);

  return (
    <Box className="relative" mt={marginTop}>
      <Typography fontSize={14} mb={0.5}>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            {...rest}
            variant="outlined"
            fullWidth
            multiline={rowNum > 1}
            sx={{
              ".css-15exkk5-MuiInputBase-root-MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              ".css-1d5mxy5-MuiInputBase-root-MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              ".css-h72nk5-MuiInputBase-root-MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            //.css-1d5mxy5-MuiInputBase-root-MuiOutlinedInput-root
            rows={rowNum}
            // label={<Box className="flex items-center gap-1">{label || ''} {required && <span className="text-red-500 text-[30px]">*</span>}</Box>}
            id={`input-${name}`}
            autoComplete="off"
            size="small"
            autoFocus={false}
            error={!!errorMessage}
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: field.value && closeIcon ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => field.onChange("")}
                    edge="end"
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        )}
      />

      {getErrorMessage(errors, name) && errorTitle && (
        <Typography
          component="p"
          className="error-text absolute top-full left-0 text-sm text-red-600 mt-0.5"
        >
          {getErrorMessage(errors, name)}
        </Typography>
      )}
    </Box>
  );
};

export default memo(CustomFormTextField);
