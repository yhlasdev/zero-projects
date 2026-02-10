import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FieldLabel from "../../../components/textField/LabelInput";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventIcon from "@mui/icons-material/Event";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

const CreateTask = ({ onClose }) => {
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
          Create task
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <FieldLabel label="Task title" />
      <FieldLabel maxRows={5} label="Description" />
      <FieldLabel label="Comment" />

      <Box mt={4} display={'flex'} gap={2}>
        <Button variant="outlined">TO DO</Button>
        <Button variant="outlined" startIcon={<PeopleOutlineIcon />}>
          Assignee
        </Button>
        <Button variant="outlined" startIcon={<EventIcon />}>
          Due date
        </Button>
        <Button variant="outlined" startIcon={<OutlinedFlagIcon />}>
          Priroty
        </Button>
      </Box>

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

export default CreateTask;
