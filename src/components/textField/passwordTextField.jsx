import { Box, TextField, Typography } from "@mui/material";

const FieldLabelPasswordInput = ({
  label,
  maxRows = 1,
  icon,
  pasType,
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
      sx={{ ".css-pu6re7-MuiInputBase-root-MuiOutlinedInput-root": { borderRadius: "10px", height: "46px" } }}
      slotProps={{
        input: {
          endAdornment: icon ? icon : undefined,
        },
      }}
      maxRows={maxRows}
      {...props}
    />
  </Box>
);

export default FieldLabelPasswordInput;
