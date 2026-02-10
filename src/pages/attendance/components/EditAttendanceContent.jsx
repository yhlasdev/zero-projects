import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Avatar,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const EditAttendance = ({ data, onClose }) => {
  const [form, setForm] = useState({
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    status: data.status,
    reason: "",
  });

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  return (
    <Box p={3}>
      <Box
        sx={{
          px: 0,
          pb: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
          Edit Attendance Record
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        sx={{ backgroundColor: "#aaa7a7", borderRadius: 3, padding: 2, my: 2 }}
        gap={2}
        mb={3}
      >
        <Avatar src={data.avatar} />
        <Box>
          <Typography fontWeight={600}>{data.name}</Typography>
          <Typography fontSize={13} color="text.secondary">
            {data.position}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography fontSize={13} mb={0.5}>
            Check In Time
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={form.checkIn}
            onChange={handleChange("checkIn")}
          />
        </Grid>

        <Grid size={6}>
          <Typography fontSize={13} mb={0.5}>
            Check Out Time
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={form.checkOut}
            onChange={handleChange("checkOut")}
          />
        </Grid>

        <Grid size={12}>
          <Typography fontSize={13} mb={0.5}>
            Status
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={form.status}
            onChange={handleChange("status")}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </TextField>
        </Grid>

        <Grid size={12}>
          <Typography fontSize={13} mb={0.5}>
            Edit Reason
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={form.reason}
            onChange={handleChange("reason")}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </Box>
  );
};

export default EditAttendance;
