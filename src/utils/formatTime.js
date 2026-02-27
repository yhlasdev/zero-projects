import dayjs from "dayjs";

export function formatTime(time) {
  if (!time) return "-";
  const t = dayjs(time);
  if (!t.isValid()) return "-";
  return t.format("HH:mm");
}

export function formatTimeYear(time) {
  if (!time) return "-";
  const t = dayjs(time);
  if (!t.isValid()) return "-";
  return t.format("YYYY-MM-DD");
}