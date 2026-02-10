import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
const TaskTable = () => {
  // Mock data - gerçek verilerinizle değiştirebilirsiniz
  const tasks = [
    {
      id: 1,
      title: "Implement User Authentication Module",
      description:
        "Develop secure authentication system with JWT tokens and refresh token mechanism",
      status: "In Progress",
      priority: "High",
      date: "2024-01-28",
      assignee: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Code Review - Payment Gateway Integration",
      description:
        "Review and approve pull request for Stripe payment integration",
      status: "Pending",
      priority: "Medium",
      date: "2024-01-25",
      assignee: "Sarah Johnson",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return { bg: "#E3F2FD", color: "#1976D2" };
      case "Pending":
        return { bg: "#FFF3E0", color: "#F57C00" };
      default:
        return { bg: "#E0E0E0", color: "#424242" };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return { bg: "#FFEBEE", color: "#D32F2F" };
      case "Medium":
        return { bg: "#FFF8E1", color: "#F57F17" };
      case "Low":
        return { bg: "#E8F5E9", color: "#388E3C" };
      default:
        return { bg: "#E0E0E0", color: "#424242" };
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", padding: 2.5, mt: 2, borderRadius: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "23px" }}>
              {tasks[0]?.assignee || "Sarah Johnson"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: "14px" }}
            >
              {tasks.length} tasks
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tasks.map((task) => (
          <Card
            key={task.id}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: "18px",
                      mb: 1,
                      color: "#1a1a1a",
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {task.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={task.status}
                      sx={{
                        backgroundColor: getStatusColor(task.status).bg,
                        color: getStatusColor(task.status).color,
                        fontWeight: 500,
                        fontSize: "13px",
                        height: "28px",
                        borderRadius: "6px",
                      }}
                    />
                    <Chip
                      label={task.priority}
                      sx={{
                        backgroundColor: getPriorityColor(task.priority).bg,
                        color: getPriorityColor(task.priority).color,
                        fontWeight: 500,
                        fontSize: "13px",
                        height: "28px",
                        borderRadius: "6px",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#666",
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: "16px" }} />
                      <Typography variant="body2" sx={{ fontSize: "13px" }}>
                        {task.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#666",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        color: "#1976D2",
                      },
                    }}
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#666",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        color: "#1976D2",
                      },
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#666",
                      "&:hover": {
                        backgroundColor: "#ffebee",
                        color: "#d32f2f",
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TaskTable;
