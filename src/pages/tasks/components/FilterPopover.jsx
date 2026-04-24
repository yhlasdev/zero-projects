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
    { id: "is_closed", label: t('tasks.dateClosed', { defaultValue: 'Date closed' }) },
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
          {t('tasks.filters', { defaultValue: 'Filters' })}
        </Typography>

        <List sx={{ p: 0 }}>
          <ListItem sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {t("common.status")}
            </Typography>
            <Select
              size="small"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              displayEmpty
              fullWidth
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value=""><em>{t('common.none', { defaultValue: 'None' })}</em></MenuItem>
              <MenuItem value="todo">{t('tasks.todo')}</MenuItem>
              <MenuItem value="in_progress">{t('tasks.inProgress')}</MenuItem>
              <MenuItem value="done">{t('tasks.done')}</MenuItem>
            </Select>
          </ListItem>

          <ListItem sx={{ flexDirection: "column", alignItems: "stretch", py: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {t("tasks.priority")}
            </Typography>
            <Select
              size="small"
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              displayEmpty
              fullWidth
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value=""><em>{t('common.none', { defaultValue: 'None' })}</em></MenuItem>
              <MenuItem value="low">{t('tasks.priorityLevels.low')}</MenuItem>
              <MenuItem value="normal">{t('tasks.priorityLevels.normal')}</MenuItem>
              <MenuItem value="high">{t('tasks.priorityLevels.high')}</MenuItem>
              <MenuItem value="urgent">{t('tasks.priorityLevels.urgent')}</MenuItem>
            </Select>
          </ListItem>

          <ListItem sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!filters.task_name}
                  onChange={(e) => handleFilterChange("task_name", e.target.checked)}
                  size="small"
                  sx={{ color: "primary.main" }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("tasks.taskTitle")}
                </Typography>
              }
            />
          </ListItem>

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
                  {t('tasks.dateClosed', { defaultValue: 'Date closed' })}
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
