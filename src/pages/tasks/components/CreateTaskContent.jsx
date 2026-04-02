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
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { createDocument } from "../../../api/queries/post";
import { useLocale } from "../../../hooks/useLocale";
import toast from "react-hot-toast";

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

export default function CreateTaskModal({ onClose }) {
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [file, setFile] = useState(null);

  const [statusAnchor, setStatusAnchor] = useState(null);
  const [assigneeAnchor, setAssigneeAnchor] = useState(null);
  const [priorityAnchor, setPriorityAnchor] = useState(null);
  const [dateAnchor, setDateAnchor] = useState(null);

  const fileRef = useRef();

  const mutation = useMutation({
    mutationFn: (payload) => createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Successfuly created task");
      handleClose();
    },
  });

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setComment("");
    setStatus("todo");
    setPriority(null);
    setAssignees([]);
    setStartDate(null);
    setEndDate(null);
    setFile(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority: priority || "clear",
      start_date: startDate
        ? startDate.startOf("day").toISOString()
        : dayjs().startOf("day").toISOString(),
      end_date: endDate
        ? endDate.endOf("day").toISOString()
        : startDate
          ? startDate.add(7, "day").endOf("day").toISOString()
          : dayjs().add(7, "day").endOf("day").toISOString(),
      participant_ids: assignees.map((a) => a.user_id),
      file: file ? file.name : undefined,
    };
    mutation.mutate(payload);
  };

  const st = STATUS_STYLE[status];
  const priorityOpt = PRIORITY_OPTIONS.find((p) => p.value === priority);

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
        <Typography
          sx={{ fontWeight: 700, fontSize: 18, color: "text.primary" }}
        >
          {t("tasks.createTask")}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "#94a3b8" }}
        >
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

        <Typography sx={{ ...labelSx, mt: 2 }}>
          {t("tasks.description")}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={fieldSx}
        />

        <Typography sx={{ ...labelSx, mt: 2 }}>{t("tasks.comment")}</Typography>
        <TextField
          fullWidth
          size="small"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => fileRef.current?.click()}
                  sx={{ color: "#94a3b8" }}
                >
                  <AttachFileIcon
                    sx={{ fontSize: 18, transform: "rotate(45deg)" }}
                  />
                </IconButton>
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />
        {file && (
          <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
            📎 {file.name}
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          mt={2.5}
          mb={1}
          flexWrap="wrap"
          useFlexGap
        >
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
            {STATUS_OPTIONS.find((s) => s.value === status)?.label}
          </Box>

          <PillButton
            icon={
              assignees.length > 0 ? (
                <Stack direction="row" spacing={-0.5}>
                  {assignees.slice(0, 2).map((a) => (
                    <Avatar
                      key={a.user_id}
                      sx={{
                        width: 18,
                        height: 18,
                        fontSize: 9,
                        fontWeight: 700,
                        bgcolor: avatarColor(a.user_id),
                        color: "#fff",
                      }}
                    >
                      {getInitials(a?.first_name, a?.last_name)}
                    </Avatar>
                  ))}
                </Stack>
              ) : (
                <PersonOutlineIcon sx={{ fontSize: 15 }} />
              )
            }
            label={
              assignees.length > 0
                ? assignees.length === 1
                  ? `${assignees[0]?.first_name} ${assignees[0]?.last_name}`
                  : t("tasks.multipleAssignees", {
                      count: assignees.length,
                      defaultValue: `${assignees.length} assignees`,
                    })
                : t("tasks.assignee")
            }
            active={assignees.length > 0}
            onClick={(e) => setAssigneeAnchor(e.currentTarget)}
          />

          <PillButton
            icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />}
            label={
              startDate && endDate
                ? startDate.format("DD MMM") +
                  " → " +
                  endDate.format("DD MMM YYYY")
                : startDate
                  ? startDate.format("DD MMM YYYY")
                  : t("tasks.dueDate")
            }
            active={!!(startDate || endDate)}
            onClick={(e) => setDateAnchor(e.currentTarget)}
          />

          <PillButton
            icon={
              <FlagOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: priorityOpt?.flagColor || "#64748b",
                }}
              />
            }
            label={
              priorityOpt?.label
                ? t(`tasks.priorityLevels.${priorityOpt.value}`)
                : t("tasks.priority")
            }
            active={!!priority}
            color={priorityOpt?.color}
            onClick={(e) => setPriorityAnchor(e.currentTarget)}
          />
        </Stack>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 3,
          py: 2.5,
        }}
      >
        <Button
          onClick={handleClose}
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
          {mutation.isPending
            ? t("tasks.creating", { defaultValue: "Creating…" })
            : t("tasks.createTask")}
        </Button>
      </Box>
      {mutation.isError && (
        <Typography sx={{ color: "#ef4444", fontSize: 12, px: 3, pb: 2 }}>
          Failed to create task. Please try again.
        </Typography>
      )}

      {statusAnchor && (
        <StatusPopover
          anchorEl={statusAnchor}
          onClose={() => setStatusAnchor(null)}
          status={status}
          setStatus={setStatus}
          t={t}
        />
      )}

      {assigneeAnchor && (
        <AssigneePopover
          anchorEl={assigneeAnchor}
          onClose={() => setAssigneeAnchor(null)}
          assignees={assignees}
          setAssignees={setAssignees}
          t={t}
        />
      )}

      {priorityAnchor && (
        <PriorityPopover
          anchorEl={priorityAnchor}
          onClose={() => setPriorityAnchor(null)}
          priority={priority}
          setPriority={setPriority}
        />
      )}

      {dateAnchor && (
        <DatePopover
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          t={t}
        />
      )}
    </>
  );
}
