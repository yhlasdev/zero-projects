import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../api/queries/getters";

export const useEmployeeWeekSchedule = (employee_id, week_start) => {
  return useQuery({
    queryKey: ["weekly-schedule", employee_id, week_start],
    queryFn: async () => {
      const res = await getSchedule({ employee_id, week_start });

      const mainData = res.data?.data; 
      const schedule = mainData?.schedule; 
      const daysArray = schedule?.days || [];

      return {
        work_day: mainData?.work_day,
        day_off: mainData?.day_off,
        total_hours: mainData?.total_hours,

        id: schedule?.id,
        employeeId: schedule?.employee_id,
        weekStart: schedule?.week_start,
        weekEnd: schedule?.week_end,

        days: daysArray.map((d) => ({
          id: d.id,
          weeklyScheduleID: d.weekly_schedule_id,
          dayOfWeek: d.day_of_week,
          date: d.date,
          shiftType: d.shift_type,
          startTime: d.start_time,
          endTime: d.end_time,
          hours: d.hours,
          crossesMidnight: d.crosses_midnight,
        })),
      };
    },
    enabled: !!employee_id && !!week_start,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
};
