import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function GlobalDateSelect({
  value,
  onChange,
  placeholder,
  disabled,
  ...props
}) {
  return (
    <Box sx={{ borderRadius: "8px" }}>
      <DatePicker
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            placeholder,
          },
        }}
        {...props}
      />
    </Box>
  );
}
