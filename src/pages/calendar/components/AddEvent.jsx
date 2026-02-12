import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FieldLabel from "../../../components/textField/LabelInput";

export default function AddEvent({ onClose }) {
  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>Add Event</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box p={3}>
        <FieldLabel label="Event title" />
        <FieldLabel label="Description" maxRows={3} />
        <Grid container spacing={2}>
          <Grid size={6}>
            <FieldLabel label="Date" />
          </Grid>
          <Grid size={6}>
            <FieldLabel label="Event type" />
          </Grid>
        </Grid>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained">Add Event</Button>
      </Box>
    </Box>
  );
}
