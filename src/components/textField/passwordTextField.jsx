import { Box, TextField, Typography } from "@mui/material";

const FieldLabelPasswordInput = ({
  label,
  maxRows = 1,
  icon,
  pasType,
  height,
  ...props
}) => (
  <Box sx={{ marginTop: 1, borderRadius: '10px' }}>
    <Typography fontSize={14} mb={0.5}>
      {label}
    </Typography>
    <TextField
      rows={maxRows}
      type={pasType === "text" ? "text" : "password"}
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
          endAdornment: icon ? icon : undefined,
        },
      }}
      size="large"
      maxRows={maxRows}
      {...props}
    />
  </Box>
);

export default FieldLabelPasswordInput;
