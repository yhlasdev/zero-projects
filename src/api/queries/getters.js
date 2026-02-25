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

export const getAllEmployee = ({ page, limit, department_id, status, search }) =>
  api.getPrivate("/employees/get-all", {
    page, limit, department_id, status, search
  });

export const getAllDepartment = async () => {
  return await api.getPrivate('/departments/get-all');
};
