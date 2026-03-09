import { Box, TextField, Typography } from "@mui/material";

const FieldLabelWelcome = ({ label, maxRows = 1, icon, ...props }) => (
  <Box sx={{ marginTop: 3.5 }}>
    <Typography fontSize={15} fontWeight={600} color="#0F3254" mb={0.5}>
      {label}
    </Typography>
    <TextField
      rows={maxRows}
      sx={{
        width: "800px",
        height: "60px",
        ".css-6ou73t-MuiInputBase-root-MuiOutlinedInput-root": {
          borderRadius: "15px",
        },
        ".css-1vy5iro-MuiInputBase-root-MuiOutlinedInput-root": {
          borderRadius: "15px",
        },
      }}
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

export default FieldLabelWelcome;
