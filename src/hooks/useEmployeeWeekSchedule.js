import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../api/queries/getters";

export const useEmployeeWeekSchedule = (employee_id, week_start) => {
  return useQuery({
    queryKey: ["weekly-schedule", employee_id, week_start],
    queryFn: async () => {
      const res = await getSchedule({ employee_id, week_start });

      const raw = res.data?.data?.schedule;
      const raw2 = res.data?.data;
      return {
        id: raw.ID,
        employeeId: raw.EmployeeId,
        weekStart: raw.WeekStart,
        weekEnd: raw.WeekEnd,
        work_day: raw2?.work_day,
        day_off: raw2?.day_off,
        total_hours: raw2?.total_hours,
        days: raw.Days?.map((d) => ({
          id: d.ID,
          weeklyScheduleID: d.WeeklyScheduleID,
          dayOfWeek: d.DayOfWeek,
          date: d.Date,
          shiftType: d.ShiftType,
          startTime: d.StartTime,
          endTime: d.EndTime,
          hours: d.Hours,
          crossesMidnight: d.CrossesMidnight,
        })),
      };
    },
    enabled: !!employee_id && !!week_start,
    keepPreviousData: true,
  });
};
