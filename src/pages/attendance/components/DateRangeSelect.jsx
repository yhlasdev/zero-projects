import { useState } from "react";
import { TextField, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function DateRangeSelect({ value, onChange }) {
  const defaultStart = dayjs().subtract(1, "day");
  const defaultEnd = dayjs();

  const [start, setStart] = useState(value?.[0] || defaultStart);
  const [end, setEnd] = useState(value?.[1] || defaultEnd);

  const handleChange = (newStart, newEnd) => {
    setStart(newStart);
    setEnd(newEnd);
    if (onChange) onChange([newStart, newEnd]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <DatePicker
          label="Start"
          value={start}
          maxDate={end}
          onChange={(newValue) => handleChange(newValue, end)}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
        <DatePicker
          label="End"
          value={end}
          minDate={start}
          onChange={(newValue) => handleChange(start, newValue)}
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      </Box>
    </LocalizationProvider>
  );
}