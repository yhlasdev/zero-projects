import { Box, TextField, Typography, InputAdornment } from "@mui/material";

const FieldLabel = ({
  label,
  maxRows = 1,
  icon,
  startIcon,
  height,
  ...props
}) => (
  <Box sx={{ marginTop: 1 }}>
    <Typography fontSize={14} mb={0.5}>
      {label}
    </Typography>
    <TextField
      rows={maxRows}
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
        ...(height && {
          "& .MuiInputBase-root": { height, borderRadius: "10px" },
          "& .MuiInputBase-input": {
            height: "100%",
            boxSizing: "border-box",
            borderRadius: "10px",
          },
        }),
      }}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,
          endAdornment: icon ? (
            <InputAdornment position="end">{icon}</InputAdornment>
          ) : null,
        },
      }}
      size="large"
      multiline={maxRows > 1}
      {...props}
    />
  </Box>
);

export default FieldLabel;
