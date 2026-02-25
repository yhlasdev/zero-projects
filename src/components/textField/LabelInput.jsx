import { Box, TextField, Typography } from "@mui/material";

const FieldLabel = ({ label, maxRows = 1, icon, ...props }) => (
  <Box sx={{ marginTop: 1 }}>
    <Typography fontSize={14} mb={0.5}>
      {label}
    </Typography>
    <TextField
      rows={maxRows}
      fullWidth
      slotProps={{
        input: {
          endAdornment: icon ? icon : undefined,
        },
      }}
      size="large"
      multiline={maxRows > 1}
      {...props}
    />
  </Box>
);

export default FieldLabel;
