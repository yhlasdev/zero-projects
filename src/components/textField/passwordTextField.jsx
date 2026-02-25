import { Box, TextField, Typography } from "@mui/material";

const FieldLabelPasswordInput = ({ label, maxRows = 1, icon, pasType, ...props }) => (
    <Box sx={{ marginTop: 1 }}>
        <Typography fontSize={14} mb={0.5}>
            {label}
        </Typography>
        <TextField
            rows={maxRows}
            type={pasType === 'text' ? 'text' : 'password'}
            fullWidth
            slotProps={{
                input: {
                    endAdornment: icon ? icon : undefined,
                },
            }}
            maxRows={maxRows}
            size="large"
            {...props}
        />
    </Box>
);

export default FieldLabelPasswordInput;
