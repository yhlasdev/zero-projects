import {
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { useLocale } from "../../../hooks/useLocale";

const FilterPopover = ({ anchorEl, open, onClose, filters, setFilters }) => {
  const { t } = useLocale();
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const menuItems = [
    { id: "status", label: t("common.status") || "Status" },
    { id: "priority", label: t("tasks.priority") || "Priority" },
    { id: "task_name", label: t("tasks.taskTitle") || "Task name" },
    { id: "is_closed", label: "Date closed" }, // User specifically asked for this
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        setActiveSubMenu(null);
        onClose();
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          width: 280,
          borderRadius: "16px",
          mt: 1,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
          p: 1,
        },
      }}
    >
      <Box sx={{ p: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 600, px: 2, mb: 1, display: "block" }}
        >
          Filters
        </Typography>

        <List sx={{ p: 0 }}>
          {/* Status Filter */}
          <ListItem sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {t("common.status") || "Status"}
            </Typography>
            <Select
              size="small"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              displayEmpty
              fullWidth
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </ListItem>

          {/* Priority Filter */}
          <ListItem sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {t("tasks.priority") || "Priority"}
            </Typography>
            <Select
              size="small"
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              displayEmpty
              fullWidth
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </ListItem>

          {/* Task Name Search */}
          <ListItem sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {t("tasks.taskTitle") || "Task name"}
            </Typography>
            <TextField
              size="small"
              placeholder="Search title..."
              value={filters.task_name || ""}
              onChange={(e) => handleFilterChange("task_name", e.target.value)}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            />
          </ListItem>

          {/* Date Closed (Boolean for now based on image/request) */}
          <ListItem sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!filters.is_closed}
                  onChange={(e) => handleFilterChange("is_closed", e.target.checked)}
                  size="small"
                  sx={{ color: "primary.main" }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Date closed
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Popover>
  );
};

export default FilterPopover;
