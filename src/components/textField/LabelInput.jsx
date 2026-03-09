import { Box, TextField, Typography } from "@mui/material";

const FieldLabel = ({ label, maxRows = 1, icon, height, ...props }) => (
  <Box sx={{ marginTop: 1}}>
    <Typography fontSize={14} mb={0.5}>
      {label}
    </Typography>
    <TextField
      rows={maxRows}
      fullWidth
      sx={{
        ".css-15exkk5-MuiInputBase-root-MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
        ...(height && {
          "& .MuiInputBase-root": { height, borderRadius: "10px" },
          "& .MuiInputBase-input": { height: "100%", boxSizing: "border-box" , borderRadius: "10px" },
        }),
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

export default FieldLabel;
