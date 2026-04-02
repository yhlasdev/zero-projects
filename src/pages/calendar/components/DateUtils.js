export const getEventStyles = (t) => ({
  public_holiday: {
    bg: "#fce4ec",
    color: "#c62828",
    dot: "#e53935",
    label: t("calendar.types.public_holiday"),
  },
  company_event: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: t("calendar.types.company_event"),
  },
  department_event: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: t("calendar.types.department_event"),
  },
  note: { bg: "#fffde7", color: "#f57f17", dot: "#fdd835", label: t("calendar.types.note") },
  engineering_team: {
    bg: "#e3f2fd",
    color: "#1565c0",
    dot: "#1e88e5",
    label: t("calendar.types.engineering_team"),
  },
  all_hands: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    dot: "#43a047",
    label: t("calendar.types.all_hands"),
  },
  default: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: t("calendar.types.event") },
});

export const LEGEND_STATIC = [
  "public_holiday",
  "company_event",
  "department_event",
  "note",
];

export const getStyle = (event_type = "", styles) =>
  styles[event_type.toLowerCase()] ?? styles.default;

export const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
export const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
export const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const getThemeColors = (isDark) => ({
  borderColor: isDark ? "#2a3441" : "#e5e7eb",
  cellBg: isDark ? "#18212F" : "#ffffff",
  cellBgOther: isDark ? "#121821" : "#fafafa",
  cellBgSel: isDark ? "#1f3a44" : "#e8f6f5",
  cellBgSelHov: isDark ? "#274a55" : "#d5eeec",
  cellBgHov: isDark ? "#1f2937" : "#f5f5f5",
  tealAccent: "#4db6ac",
});
