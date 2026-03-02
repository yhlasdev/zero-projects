
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export const getWeekStart = (date) =>
  dayjs(date).startOf("isoWeek");