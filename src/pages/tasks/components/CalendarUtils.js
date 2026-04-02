export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
export const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

export const STATUS_CONFIG = {
  in_progress: {
    label: "In progress",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#2563eb",
  },
  to_do: { label: "To do", color: "#6b7280", bg: "#f9fafb", border: "#9ca3af" },
  done: {
    label: "Complete",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#16a34a",
  },
};

export const normalizeStatus = (s = "") => s.toLowerCase().replace(/\s+/g, "_");
export const getStatusCfg = (s) =>
  STATUS_CONFIG[normalizeStatus(s)] ?? STATUS_CONFIG.to_do;

export const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const getInitials = (p) => {
  const name = p.preferred_name || `${p.first_name} ${p.last_name}`;
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
