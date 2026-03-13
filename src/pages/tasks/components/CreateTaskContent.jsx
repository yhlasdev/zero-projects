import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Popover,
  Avatar,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useRef, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllEmployeeForTask } from "../../../api/queries/getters";
import { createDocument } from "../../../api/queries/post";

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  {
    value: "todo",
    label: "TO DO",
    icon: <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />,
    section: "Not started",
  },
  {
    value: "in_progress",
    label: "IN PROGRESS",
    icon: (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: "#3b82f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
      </Box>
    ),
    section: "Active",
  },
  {
    value: "done",
    label: "COMPLETE",
    icon: (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          bgcolor: "#22c55e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />
      </Box>
    ),
    section: "Active",
  },
];
const STATUS_STYLE = {
  todo: { bgcolor: "action.selected", color: "text.secondary" },
  in_progress: { bgcolor: "primary.light", color: "primary.contrastText" },
  done: { bgcolor: "success.light", color: "success.contrastText" },
};

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", color: "#ef4444", flagColor: "#ef4444" },
  { value: "high", label: "High", color: "#f59e0b", flagColor: "#f59e0b" },
  { value: "normal", label: "Normal", color: "#3b82f6", flagColor: "#3b82f6" },
  { value: "low", label: "Low", color: "#94a3b8", flagColor: "#94a3b8" },
  {
    value: "clear",
    label: "Clear",
    color: "#94a3b8",
    flagColor: "#94a3b8",
    isIcon: true,
  },
];

const DATE_SHORTCUTS = [
  { label: "Today", days: 0 },
  { label: "Later", days: 1, note: () => dayjs().format("HH:mm") },
  {
    label: "Tomorrow",
    days: 1,
    note: () => dayjs().add(1, "day").format("ddd"),
  },
  {
    label: "This weekend",
    days: null,
    note: () => "Sat",
    fn: () => dayjs().day(6),
  },
  {
    label: "Next week",
    days: null,
    note: () => "Mon",
    fn: () => dayjs().add(1, "week").startOf("week").add(1, "day"),
  },
  {
    label: "Next weekend",
    days: null,
    note: () => dayjs().add(1, "week").day(6).format("D MMM"),
    fn: () => dayjs().add(1, "week").day(6),
  },
  {
    label: "2 weeks",
    days: 14,
    note: () => dayjs().add(14, "day").format("D MMM"),
  },
  {
    label: "4 weeks",
    days: 28,
    note: () => dayjs().add(28, "day").format("D MMM"),
  },
];

const AVATAR_COLORS = [
  "#4f8ef7",
  "#f7904f",
  "#4fc9a4",
  "#f74f6a",
  "#a04ff7",
  "#f7c94f",
  "#4fe0f7",
  "#f74fbd",
];
const avatarColor = (id) =>
  AVATAR_COLORS[Number(String(id || 0).slice(-1)) % AVATAR_COLORS.length];
const getInitials = (first = "", last = "") =>
  `${first[0] || ""}${last[0] || ""}`.toUpperCase();

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateTaskModal({ onClose, onSuccess }) {
  const queryClient = useQueryClient();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(null);
  const [assignees, setAssignees] = useState([]); // array of employee objects
  const [startDate, setStartDate] = useState(null); // dayjs or null
  const [endDate, setEndDate] = useState(null); // dayjs or null
  const [pickingDate, setPickingDate] = useState("start"); // 'start' | 'end'
  const [file, setFile] = useState(null);

  // popover anchors
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [assigneeAnchor, setAssigneeAnchor] = useState(null);
  const [priorityAnchor, setPriorityAnchor] = useState(null);
  const [dateAnchor, setDateAnchor] = useState(null);

  // assignee search
  const [empSearch, setEmpSearch] = useState("");

  // calendar state
  const [calView, setCalView] = useState(dayjs());

  const fileRef = useRef();

  // ── employees query ─────────────────────────────────────────────────────
  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ["task-employees", empSearch],
    queryFn: () => getAllEmployeeForTask({ search: empSearch }),
    enabled: Boolean(assigneeAnchor),
    staleTime: 30_000,
  });
  const employees = empData?.data?.data?.length ? empData?.data?.data : [];

  // ── mutation ─────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (payload) => createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      handleClose();
      if (onSuccess) onSuccess();
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
    setPickingDate("start");
    setFile(null);
    setEmpSearch("");
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
      participant_ids: assignees.map((a) => a.employee_id),
      file: file ? file.name : undefined,
    };
    mutation.mutate(payload);
  };

  const toggleAssignee = (emp) => {
    setAssignees((prev) =>
      prev.find((a) => a.employee_id === emp.employee_id)
        ? prev.filter((a) => a.employee_id !== emp.employee_id)
        : [...prev, emp],
    );
  };

  const st = STATUS_STYLE[status];
  // const statusOpt = STATUS_OPTIONS.find((s) => s.value === status);
  const priorityOpt = PRIORITY_OPTIONS.find((p) => p.value === priority);

  // ── Calendar helpers ─────────────────────────────────────────────────────
  const calDays = useMemo(() => {
    const start = calView.startOf("month");
    const offset = (start.day() + 6) % 7; // Mon=0
    const total = start.daysInMonth();
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [calView]);

  const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <>
      {/* Header */}
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
          Create New Task
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "#94a3b8" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        {/* Task Title */}
        <Typography sx={labelSx}>Task Title</Typography>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={fieldSx}
        />

        {/* Description */}
        <Typography sx={{ ...labelSx, mt: 2 }}>Description</Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={fieldSx}
        />

        {/* Comment */}
        <Typography sx={{ ...labelSx, mt: 2 }}>Comment</Typography>
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

        {/* Pill row */}
        <Stack
          direction="row"
          spacing={1}
          mt={2.5}
          mb={1}
          flexWrap="wrap"
          useFlexGap
        >
          {/* Status */}
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

          {/* Assignee */}
          <PillButton
            icon={
              assignees.length > 0 ? (
                <Stack direction="row" spacing={-0.5}>
                  {assignees.slice(0, 2).map((a) => (
                    <Avatar
                      key={a.employee_id}
                      sx={{
                        width: 18,
                        height: 18,
                        fontSize: 9,
                        fontWeight: 700,
                        bgcolor: avatarColor(a.employee_id),
                        color: "#fff",
                      }}
                    >
                      {getInitials(a.user?.first_name, a.user?.last_name)}
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
                  ? `${assignees[0].user?.first_name} ${assignees[0].user?.last_name}`
                  : `${assignees.length} assignees`
                : "Assignee"
            }
            active={assignees.length > 0}
            onClick={(e) => {
              setAssigneeAnchor(e.currentTarget);
              setEmpSearch("");
            }}
          />

          {/* Due date */}
          <PillButton
            icon={<CalendarTodayIcon sx={{ fontSize: 13 }} />}
            label={
              startDate && endDate
                ? startDate.format("DD MMM") +
                  " → " +
                  endDate.format("DD MMM YYYY")
                : startDate
                  ? startDate.format("DD MMM YYYY")
                  : "Due date"
            }
            active={!!(startDate || endDate)}
            onClick={(e) => {
              setDateAnchor(e.currentTarget);
              setPickingDate("start");
              setCalView(startDate || dayjs());
            }}
          />

          {/* Priority */}
          <PillButton
            icon={
              <FlagOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: priorityOpt?.flagColor || "#64748b",
                }}
              />
            }
            label={priorityOpt?.label || "Priority"}
            active={!!priority}
            color={priorityOpt?.color}
            onClick={(e) => setPriorityAnchor(e.currentTarget)}
          />
        </Stack>
      </DialogContent>

      {/* Footer */}
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || mutation.isPending}
          variant="contained"
          sx={{
            bgcolor: "primary.main",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
          }}
        >
          {mutation.isPending ? "Creating…" : "Create Task"}
        </Button>
      </Box>
      {mutation.isError && (
        <Typography sx={{ color: "#ef4444", fontSize: 12, px: 3, pb: 2 }}>
          Failed to create task. Please try again.
        </Typography>
      )}

      {/* ── STATUS POPOVER ───────────────────────────────────────────────────── */}
      <Popover
        open={Boolean(statusAnchor)}
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 0.5,
            boxShadow: (theme) => theme.shadows[8],
            minWidth: 180,
            p: 1,
          },
        }}
      >
        {/* Not started section */}
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: 0.5,
            px: 1,
            pt: 0.5,
            pb: 0.3,
          }}
        >
          Not started
        </Typography>
        <StatusItem
          opt={STATUS_OPTIONS[0]}
          selected={status === "todo"}
          onClick={() => {
            setStatus("todo");
            setStatusAnchor(null);
          }}
        />

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: 0.5,
            px: 1,
            pt: 1,
            pb: 0.3,
          }}
        >
          Active
        </Typography>
        <StatusItem
          opt={STATUS_OPTIONS[1]}
          selected={status === "in_progress"}
          onClick={() => {
            setStatus("in_progress");
            setStatusAnchor(null);
          }}
        />
        <StatusItem
          opt={STATUS_OPTIONS[2]}
          selected={status === "done"}
          onClick={() => {
            setStatus("done");
            setStatusAnchor(null);
          }}
        />
      </Popover>

      {/* ── ASSIGNEE POPOVER ─────────────────────────────────────────────────── */}
      <Popover
        open={Boolean(assigneeAnchor)}
        anchorEl={assigneeAnchor}
        onClose={() => setAssigneeAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 0.5,
            boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
            width: 280,
          },
        }}
      >
        {/* Search */}
        <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search or enter email..."
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: 13,
                "& fieldset": { borderColor: "divider" },
              },
            }}
          />
        </Box>

        {/* Employee list */}
        <Box sx={{ maxHeight: 260, overflowY: "auto", pb: 1 }}>
          {empLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={20} />
            </Box>
          ) : employees.length === 0 ? (
            <Typography
              sx={{
                fontSize: 13,
                color: "#94a3b8",
                textAlign: "center",
                py: 2,
              }}
            >
              No employees found
            </Typography>
          ) : (
            employees.map((emp) => {
              const isSelected = assignees.some(
                (a) => a.employee_id === emp.employee_id,
              );
              const name =
                `${emp.user?.first_name || ""} ${emp.user?.last_name || ""}`.trim();
              return (
                <Box
                  key={emp.employee_id}
                  onClick={() => toggleAssignee(emp)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 0.9,
                    cursor: "pointer",
                    bgcolor: isSelected ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background 0.1s",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: avatarColor(emp.employee_id),
                      color: "#fff",
                    }}
                  >
                    {getInitials(emp.user?.first_name, emp.user?.last_name)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      color: "text.primary",
                      flex: 1,
                    }}
                  >
                    {name}
                  </Typography>
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Popover>

      {/* ── PRIORITY POPOVER ─────────────────────────────────────────────────── */}
      <Popover
        open={Boolean(priorityAnchor)}
        anchorEl={priorityAnchor}
        onClose={() => setPriorityAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 0.5,
            boxShadow: (theme) => theme.shadows[8],
            minWidth: 160,
            p: 1,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: 0.5,
            px: 1,
            pt: 0.5,
            pb: 0.5,
          }}
        >
          Task Priority
        </Typography>
        {PRIORITY_OPTIONS.map((p) => (
          <Box
            key={p.value}
            onClick={() => {
              setPriority(p.value === "clear" ? null : p.value);
              setPriorityAnchor(null);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 1,
              py: 0.8,
              borderRadius: "6px",
              cursor: "pointer",
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            {p.value === "clear" ? (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <FlagOutlinedIcon sx={{ fontSize: 16, color: p.flagColor }} />
            )}
            <Typography
              sx={{
                fontSize: 13,
                color: p.value === "clear" ? "text.secondary" : "text.primary",
                fontWeight: priority === p.value ? 600 : 400,
              }}
            >
              {p.label}
            </Typography>
            {priority === p.value && (
              <CheckIcon sx={{ fontSize: 14, color: "#3b82f6", ml: "auto" }} />
            )}
          </Box>
        ))}
      </Popover>

      {/* ── DATE POPOVER ─────────────────────────────────────────────────────── */}
      <Popover
        open={Boolean(dateAnchor)}
        anchorEl={dateAnchor}
        onClose={() => setDateAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            mt: 0.5,
            boxShadow: (theme) => theme.shadows[10],
            overflow: "hidden",
            width: 580,
          },
        }}
      >
        {/* Top: two Due date inputs — left filled grey, right outlined */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            px: 2.5,
            pt: 2.5,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Left — start date, filled grey, active border when picking start */}
          <Box
            onClick={() => setPickingDate("start")}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              bgcolor: "action.hover",
              border:
                pickingDate === "start"
                  ? "2px solid var(--mui-palette-primary-main)"
                  : "2px solid transparent",
              borderRadius: "10px",
              px: 1.5,
              py: 1.2,
              transition: "border 0.15s",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                bgcolor: "#e0e0e0",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 15, color: "#555" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                color: startDate ? "#0f172a" : "#777",
                fontWeight: startDate ? 500 : 400,
              }}
            >
              {startDate ? startDate.format("DD MMM YYYY") : "Due date"}
            </Typography>
          </Box>

          {/* Right — end date, outlined, active border when picking end */}
          <Box
            onClick={() => setPickingDate("end")}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              bgcolor: "background.paper",
              border:
                pickingDate === "end"
                  ? "2px solid var(--mui-palette-primary-main)"
                  : "2px solid var(--mui-palette-divider)",
              borderRadius: "10px",
              px: 1.5,
              py: 1.2,
              transition: "border 0.15s",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                border: "1.5px solid #ccc",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 15, color: "#aaa" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                color: endDate ? "#0f172a" : "#aaa",
                fontWeight: endDate ? 500 : 400,
              }}
            >
              {endDate ? endDate.format("DD MMM YYYY") : "Due date"}
            </Typography>
          </Box>
        </Box>

        {/* Bottom: shortcuts + calendar */}
        <Box sx={{ display: "flex" }}>
          {/* Left: shortcuts */}
          <Box sx={{ width: 210, borderRight: "1px solid #f0f3f8", py: 1 }}>
            {DATE_SHORTCUTS.map((s) => {
              const targetDate = s.fn
                ? s.fn()
                : s.days !== null
                  ? s.days === 0
                    ? dayjs()
                    : dayjs().add(s.days, "day")
                  : null;
              const note = s.note ? s.note() : null;
              const activeDate = pickingDate === "start" ? startDate : endDate;
              const isSelected =
                activeDate &&
                targetDate &&
                activeDate.isSame(targetDate, "day");
              return (
                <Box
                  key={s.label}
                  onClick={() => {
                    if (!targetDate) return;
                    if (pickingDate === "start") {
                      setStartDate(targetDate);
                      setCalView(targetDate);
                      setPickingDate("end");
                    } else {
                      setEndDate(targetDate);
                      setCalView(targetDate);
                      setDateAnchor(null);
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 1.1,
                    cursor: "pointer",
                    bgcolor: isSelected ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background 0.1s",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "text.primary",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {s.label}
                  </Typography>
                  {note && (
                    <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
                      {note}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Right: calendar */}
          <Box sx={{ flex: 1, px: 2.5, py: 2 }}>
            {/* Month nav */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: 0.5,
                }}
              >
                {calView.format("MMMM YYYY").toUpperCase()}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <IconButton
                  size="small"
                  onClick={() => setCalView((v) => v.subtract(1, "month"))}
                  sx={{
                    p: 0.4,
                    color: "#9ca3af",
                    "&:hover": { bgcolor: "#f0f4ff" },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setCalView((v) => v.add(1, "month"))}
                  sx={{
                    p: 0.4,
                    color: "#9ca3af",
                    "&:hover": { bgcolor: "#f0f4ff" },
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Weekday headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                mb: 0.5,
              }}
            >
              {WEEK_DAYS.map((d) => (
                <Typography
                  key={d}
                  sx={{
                    fontSize: 12,
                    color: "#9ca3af",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {d}
                </Typography>
              ))}
            </Box>

            {/* Days grid — two independent dots, no range strip */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                rowGap: 0.2,
              }}
            >
              {calDays.map((d, i) => {
                if (!d) return <Box key={i} sx={{ height: 38 }} />;
                const thisDay = calView.date(d);
                const isToday = thisDay.isSame(dayjs(), "day");
                const isStart = startDate && thisDay.isSame(startDate, "day");
                const isEnd = endDate && thisDay.isSame(endDate, "day");
                const isMarked = isStart || isEnd;
                return (
                  <Box
                    key={i}
                    onClick={() => {
                      if (pickingDate === "start") {
                        setStartDate(thisDay);
                        setPickingDate("end");
                      } else {
                        setEndDate(thisDay);
                        setDateAnchor(null); // close after end selected
                      }
                    }}
                    sx={{
                      height: 38,
                      width: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      mx: "auto",
                      bgcolor: isMarked ? "primary.main" : "transparent",
                      color: isMarked ? "primary.contrastText" : "text.primary",
                      fontWeight: isMarked || isToday ? 700 : 400,
                      fontSize: 14,
                      outline:
                        isToday && !isMarked ? (theme) => `2px solid ${theme.palette.primary.main}` : "none",
                      outlineOffset: "-2px",
                      "&:hover": { bgcolor: isMarked ? "primary.dark" : "action.hover" },
                      transition: "all 0.1s",
                    }}
                  >
                    {d}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusItem({ opt, selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 0.8,
        borderRadius: "6px",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {opt.icon}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: selected ? 700 : 400,
            color: "text.primary",
          }}
        >
          {opt.label}
        </Typography>
      </Stack>
      {selected && <CheckIcon sx={{ fontSize: 14, color: "#3b82f6" }} />}
    </Box>
  );
}

function PillButton({ icon, label, active, color, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.5,
        py: 0.6,
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        color: color || (active ? "primary.main" : "text.secondary"),
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        bgcolor: active ? "action.selected" : "background.paper",
        "&:hover": { bgcolor: "action.hover", borderColor: "primary.light" },
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const labelSx = { fontSize: 13, fontWeight: 500, color: "text.primary", mb: 0.8 };
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "background.default",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "primary.light" },
    "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1.5 },
  },
  "& .MuiInputBase-input": { fontSize: 14, color: "text.primary" },
};
