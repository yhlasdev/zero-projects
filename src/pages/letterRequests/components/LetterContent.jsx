import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const statusColors = {
  Pending: { bg: "#FEF3C7", color: "#D97706" },
  Accepted: { bg: "#DCFCE7", color: "#15803D" },
  Rejected: { bg: "#FEE2E2", color: "#B91C1C" }
};

const typeColors = {
  Salary: { bg: "#DBEAFE", color: "#2563EB" },
  Complaint: { bg: "#FEF3C7", color: "#CA8A04" },
  Transfer: { bg: "#E5E7EB", color: "#374151" }
};

const LetterContent = ({ data, onClose }) => {
  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={600}>
          Letter Request Details
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Chips */}
      <Box display="flex" gap={1} mb={3}>
        <Chip
          label={data.type}
          size="small"
          sx={{
            backgroundColor: typeColors[data.type]?.bg,
            color: typeColors[data.type]?.color
          }}
        />

        <Chip
          label={data.status}
          size="small"
          sx={{
            backgroundColor: statusColors[data.status]?.bg,
            color: statusColors[data.status]?.color
          }}
        />
      </Box>
      <Divider sx={{ marginBottom: 2 }} />
      {/* Title */}
      <Typography fontWeight={600}>
        {data.title}
      </Typography>

      {/* Info Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 3,
          mb: 3
        }}
      >
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          <Box>
            <Typography fontSize={13} color="text.secondary">
              Employee
            </Typography>
            <Typography fontWeight={600}>{data.name}</Typography>

            <Typography mt={2} fontSize={13} color="text.secondary">
              Submitted Date
            </Typography>
            <Typography>{data.date}</Typography>
          </Box>

          <Box>
            <Typography fontSize={13} color="text.secondary">
              Department
            </Typography>
            <Typography fontWeight={600}>{data.department}</Typography>

            <Typography mt={2} fontSize={13} color="text.secondary">
              Attachment
            </Typography>
            <Typography>{data.hasAttachment ? "Yes" : "No"}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Message */}
      <Box mb={3}>
        <Typography fontSize={13} color="text.secondary" mb={1}>
          Message
        </Typography>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#F3F4F6",
            p: 2,
            borderRadius: 2
          }}
        >
          <Typography>{data.description}</Typography>
        </Paper>
      </Box>

      {/* Admin Notes */}
      <Box mb={3}>
        <Typography fontSize={13} color="text.secondary" mb={1}>
          Admin Notes (Internal)
        </Typography>

        <Paper
          elevation={0}
          sx={{
            height: 90,
            borderRadius: 2,
            border: "1px solid #E5E7EB",
          }}
        />
      </Box>

      {/* Footer Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#DC2626" }}
          onClick={onClose}
        >
          Reject
        </Button>

        <Button variant="contained" sx={{ backgroundColor: "#16A34A" }}>
          Accept
        </Button>
      </Box>
    </Box>
  );
};

export default LetterContent;
