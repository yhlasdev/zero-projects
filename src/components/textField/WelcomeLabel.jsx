import { Box, TextField, Typography } from "@mui/material";

const FieldLabelWelcome = ({ label, maxRows = 1, icon, ...props }) => (
  <Box sx={{ marginTop: 3.5 }}>
    {/* Label Alanı */}
    <Typography
      sx={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: "15px",
        fontWeight: 600,
        color: "#0F3254",
        mb: 1,
      }}
    >
      {label}
    </Typography>

    <TextField
      fullWidth
      rows={maxRows}
      multiline={maxRows > 1}
      sx={{
        width: "800px",
        "& .MuiInputBase-root": {
          minHeight: "60px",
          height: maxRows > 1 ? "" : "60px",
          background: "#FFFFFFE5",
          borderRadius: "15px",
          backdropFilter: "blur(10px)", 
          fontFamily: "'Poppins', sans-serif",
          transition: "all 0.3s ease",

          "& fieldset": {
            borderWidth: "2px",
            borderColor: "#0F32541A", 
          },
          "&:hover fieldset": {
            borderColor: "#0F325433", 
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0F3254",
          },
        },
        "& .MuiInputBase-input": {
          padding: "12px 16px",
          color: "#0F3254",
          fontSize: "16px",
        },
      }}
      slotProps={{
        input: {
          endAdornment: icon ? icon : undefined,
        },
      }}
      {...props}
    />
  </Box>
);

export default FieldLabelWelcome;
