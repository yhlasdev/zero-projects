import {
  Box,
  Typography,
  TextField,
  Button,
  DialogContent,
  IconButton,
  Stack,
  Avatar,
  InputAdornment,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { updateTask } from "../../../api/queries/put";
import { useLocale } from "../../../hooks/useLocale";
import { toast } from "react-toastify";

import {
  STATUS_OPTIONS,
  STATUS_STYLE,
  PRIORITY_OPTIONS,
  avatarColor,
  getInitials,
  PillButton,
  labelSx,
  fieldSx,
} from "./CreateTaskUtils";

import StatusPopover from "./StatusPopover";
import PriorityPopover from "./PriorityPopover";
import AssigneePopover from "./AssigneePopover";
import DatePopover from "./DatePopover";

export default function EditTaskContent({ task, onClose }) {
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("todo");
  const [date, setDate] = useState(null);

  const [statusAnchor, setStatusAnchor] = useState(null);
  const [dateAnchor, setDateAnchor] = useState(null);

  // Pre-fill form with existing task data
  useEffect(() => {
    if (task) {
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setType(task.type ?? task.status ?? "todo");
      setDate(task.date ? dayjs(task.date) : (task.start_date ? dayjs(task.start_date) : null));
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: (payload) => updateTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskCalendar"] });
      toast.success(t("tasks.editSuccess") || "Task updated successfully");
      onClose();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update task"
      );
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return;
    const payload = {
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      date: date ? date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      type: type,
    };
    mutation.mutate(payload);
  };

  const st = STATUS_STYLE[type] ?? STATUS_STYLE.todo;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "text.primary" }}>
          {t("tasks.editTask") || "Edit Task"}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography sx={labelSx}>{t("tasks.taskTitle")}</Typography>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={fieldSx}
        />

        <Typography sx={{ ...labelSx, mt: 2 }}>{t("tasks.description")}</Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={fieldSx}
        />

        <Stack direction="row" spacing={1} mt={2.5} mb={1} flexWrap="wrap" useFlexGap>
          {/* Type (formerly Status) pill */}
          <Box
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{
              px: 1.5,
              py: 0.6,
              borderRadius: "6px",
              cursor: "pointer",
              bgcolor: st.bgcolor,
              color: st.color,
              fontWeight: 700,
              fontSize: 12,
              "&:hover": { opacity: 0.85 },
            }}
          >
            {STATUS_OPTIONS.find((s) => s.value === type)?.label || type}
          </Box>

          {/* Date pill */}
          <PillButton
            icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />}
            label={date ? date.format("DD MMM YYYY") : t("tasks.dueDate")}
            active={!!date}
            onClick={(e) => setDateAnchor(e.currentTarget)}
          />
        </Stack>
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "divider",
            color: "text.secondary",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          variant="contained"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
          }}
        >
          {mutation.isPending ? "Saving…" : t("common.save")}
        </Button>
      </Box>

      {statusAnchor && (
        <StatusPopover
          anchorEl={statusAnchor}
          onClose={() => setStatusAnchor(null)}
          status={type}
          setStatus={setType}
          t={t}
        />
      )}
      {dateAnchor && (
        <DatePopover
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          startDate={date}
          setStartDate={setDate}
          t={t}
          isSingleDate={true}
        />
      )}
    </>
  );
}
