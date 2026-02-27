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

export const getAllEmployee = ({ page, limit, department_id, job_id, search }) =>
  api.getPrivate("/company-service/employees/get-all", {
    page, limit, department_id, job_id, search
  });

export const getAllDepartment = async () => {
  return await api.getPrivate('/company-service/departments/get-all');
};

export const getAllJobs = async (department_id) => {
  return await api.getPrivate('/company-service/jobs/get-all', {
    department_id
  });
};

export const getAllAttendance = async ({ date, department_ids, status, search }) => {
  return await api.getPrivate("/company-service/attendances/get-by-date", {
    date, department_ids, status, search
  })
};

export const getEmployeeImage = async (employee_id) => {
  return await api.getPrivate(`/storage-service/attendances/${employee_id}`)
};

export const getEmployeeDetail = async ({ employee_id, start_date, end_date }) => {
  return api.getPrivate(`/company-service/attendances/by-employee/${employee_id}`, { start_date, end_date })
};

export const getLeavesAll = async ({ page, limit, status, type }) => {
  return await api.getPrivate(`/company-service/leaves/get-all`, { page, limit, status, type })
};

export const getLeavesById = async (id) => {
  return await api.getPrivate(`/company-service/leaves/get/${id}`)
};