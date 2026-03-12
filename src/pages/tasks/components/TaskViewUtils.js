export const STATUS_CONFIG = {
  "TO DO": { bg: "#f0f0f0", color: "#666", dot: "#9e9e9e" },
  "IN PROGRESS": { bg: "#E3F2FD", color: "#1976D2", dot: "#1976D2" },
  COMPLETE: { bg: "#E8F5E9", color: "#388E3C", dot: "#4CAF50" },
  DONE: { bg: "#E8F5E9", color: "#388E3C", dot: "#4CAF50" },
  PENDING: { bg: "#FFF3E0", color: "#F57C00", dot: "#F57C00" },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG["TO DO"];

export const getBorderColor = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETE":
      return "#4CAF50";
    case "IN PROGRESS":
      return "#1976D2";
    case "PENDING":
      return "#F57C00";
    case "DONE":
      return "#4CAF50";
    default:
      return "#e0e0e0";
  }
};

// Normalize API status value → display label
export const normalizeStatus = (raw = "") => {
  const map = {
    todo: "To Do",
    in_progress: "In Progress",
    complete: "Complete",
    completed: "Complete",
    pending: "Pending",
  };
  return map[raw?.toLowerCase().replace(" ", "_")] ?? raw;
};

// Format ISO date → "DD.MM.YYYY"
export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

// Format ISO date → { day, month, year } for DateBlock
export const parseDateBlock = (iso) => {
  if (!iso) return { day: "", month: "", year: "" };
  const d = new Date(iso);
  if (isNaN(d)) return { day: "", month: "", year: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
};

// Map API task → internal task shape
export const mapApiTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: normalizeStatus(task.status),
  date: task.created_at,
  startDate: formatDate(task.start_date),
  endDate: formatDate(task.end_date),
  assignee: task?.owner ?? "",
  team: (task.participants ?? [])?.map(
    (p) =>
      p.preferred_name ?? `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`,
  ),
  priority: task.priority,
});
