/* 
import { axiosInstance } from "../axiosInstance";
import Cookies from 'js-cookie';
 */
/* export const renewAccessTokenApi = async () => {
  const refreshToken = Cookies.get('refreshToken')
  const bearer = 'Bearer ' + refreshToken
  return axiosInstance.get('/auth/renew-access-token', {
    headers: {
      Authorization: bearer,
    },
  });
};

export const getAllComplexApi = async () => {
  return await api.getPrivate('/complex-of-buildings/get-all-complex-of-buildings');
};
 */
import { api } from "../service/apiHelper";

export const getAllEmployee = async ({
  page,
  limit,
  department_id,
  job_id,
  search,
}) => {
  const params = {
    page,
    limit,
    ...(department_id && { department_id }),
    ...(job_id && { job_id }),
    ...(search && { search }),
  };

  return await api.getPrivate("/company-service/employees/get-all", params);
};

export const getAllDepartment = async () => {
  return await api.getPrivate("/company-service/departments/get-all");
};

export const getAllJobs = async (department_id) => {
  return await api.getPrivate("/company-service/jobs/get-all", {
    department_id,
  });
};

export const getAllAttendance = async ({
  page,
  limit,
  date,
  department_ids,
  status,
  search,
}) => {
  return await api.getPrivate("/company-service/attendances/get-by-date", {
    page,
    limit,
    date,
    department_ids: department_ids?.join(","),
    status: status?.join(","),
    search,
  });
};

export const getEmployeeImage = async (employee_id) => {
  return await api.getPrivate(`/storage-service/attendances/${employee_id}`);
};

export const getEmployeeDetail = async ({
  employee_id,
  start_date,
  end_date,
}) => {
  return api.getPrivate(
    `/company-service/attendances/by-employee/${employee_id}`,
    { start_date, end_date },
  );
};

export const getLeavesAll = async ({ page, limit, status, type }) => {
  return await api.getPrivate(`/company-service/leaves/get-all`, {
    page,
    limit,
    status,
    type,
  });
};

export const getLeavesById = async (id) => {
  return await api.getPrivate(`/company-service/leaves/get/${id}`);
};

export const getAllDocuments = async ({ page, limit, search, file_types }) => {
  return await api.getPrivate("/company-service/documents/get-all", {
    page,
    limit,
    search,
    file_types: file_types?.length > 0 ? file_types?.join() : null,
  });
};

export const getAllEmployeeForTask = async ({ search }) => {
  return await api.getPrivate("/company-service/tasks/employees", {
    search,
  });
};

export const getEmployeeById = async (employee_id) => {
  return await api.getPrivate(`/company-service/employees/get/${employee_id}`);
};

export const getAllAnnouncement = async ({ page, limit, status }) => {
  return await api.getPrivate("/company-service/announcements/get-all", {
    page,
    limit,
    status,
  });
};

export const getAllBoardTask = async ({ page, limit }) => {
  return await api.getPrivate("/company-service/tasks/board", {
    page,
    limit,
  });
};

export const getTaskCalendar = async ({ month, year }) => {
  return await api.getPrivate(
    `/company-service/tasks/by-month?month=${month}&year=${year}`,
  );
};

export const getMainCalendar = async ({ month, year }) => {
  return await api.getPrivate(
    `/company-service/calendars/my?month=${month}&year=${year}`,
  );
};

export const getSettingsContact = async () => {
  return await api.getPrivate("/company-service/companies/get-contact");
};

export const getSettingsOverview = async () => {
  return await api.getPrivate("/company-service/companies/get-profile");
};

export const getAnnouncementById = async (id) => {
  return await api.getPrivate("/company-service/announcements/get/" + id);
};

export const getSchedule = async ({ employee_id, week_start }) => {
  return await api.getPrivate("/company-service/schedules/get-by-week", {
    employee_id,
    week_start,
  });
};

export const getCalendar = async ({ employee_id, week_start }) => {
  return await api.getPrivate("/company-service/schedules/get-by-week", {
    employee_id,
    week_start,
  });
};

export const getAttendanceStatistic = async () => {
  const response = await api.getPrivate(
    "/company-service/dashboard/attendance-stats",
  );
  return response;
};

export const getAttendanceDetailHour = async () => {
  const response = await api.getPrivate(
    "/company-service/dashboard/base-stats",
  );
  return response;
};

export const getDahsboardDayHour = async () => {
  const response = await api.getPrivate("/company-service/dashboard/day-hours");
  return response;
};

export const getDahsboardHourStat = async (id) => {
  const response = await api.getPrivate(
    `/company-service/dashboard/hours-statistics?departmentId=${isNaN(id) ? "" : id}`,
  );
  return response;
};

export const getAllTopPerformers = async () => {
  const response = await api.getPrivate(
    "/company-service/dashboard/top5-employees",
  );
  return response;
};

export const getAllDepartments = async () => {
  const response = await api.getPrivate("/company-service/departments/get-all");
  return response;
};

export const getNewRequest = async (status) => {
  const response = await api.getPrivate(
    "/company-service/employees/join-requests",
    status,
  );
  return response;
};

export const getTaskList = async ({ status, page, limit }) => {
  const response = await api.getPrivate("/company-service/tasks/get-all", {
    status,
    page,
    limit,
  });
  return response;
};

export const getProfile = async () => {
  const response = await api.getPrivate('');
  return response;
}