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

export default function EditEmployeeContent({ onClose }) {
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
        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>Add New Employee</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box p={3}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box sx={{ height: 200 }}>
              <Typography fontSize={14} mb={1}>
                Upload photo
              </Typography>

              <Box
                sx={{
                  border: "2px dashed #d0d0d0",
                  borderRadius: 2,
                  height: 150,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777",
                  cursor: "pointer",
                }}
              >
                <CloudUploadOutlinedIcon fontSize="large" />
                <Typography fontSize={13}>
                  Click to upload or drag and drop
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  jpg, png (max. 10MB)
                </Typography>
              </Box>
            </Box>
            <FieldLabel label="Department" />

            <FieldLabel label="Employee ID" />

            <FieldLabel label="Nationality" />

            <FieldLabel label="Hiring date" />

            <FieldLabel label="Reports to" />
          </Grid>

          <Grid size={6}>
            <Box sx={{ height: 200 }}>
              <Typography fontSize={14} mb={1}>
                Status
              </Typography>
              <RadioGroup row defaultValue="inactive">
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="inactive"
                  control={<Radio />}
                  label="Inactive"
                />
              </RadioGroup>
            </Box>
            {/* Title */}
            <FieldLabel label="Title" />

            <FieldLabel label="Probation end date" />

            <FieldLabel label="Working timing" />

            <FieldLabel label="Office" />
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
        <Button variant="contained">Add Employee</Button>
      </Box>
    </Box>
  );
}
