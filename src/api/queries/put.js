/* ";


export const updateComplexApi = async (objectData) => {
  const response = await api.putPrivate(`/complex-of-buildings/update-complex-of-buildings`, objectData);
  return response;
};
 */
import { api } from "../service/apiHelper";

export const updateAttendance = async (objectData) => {
  const response = await api.putPrivate(`/company-service/attendances/update`, objectData);
  return response;
};

export const updateLeaves = async (objectData) => {
  const response = await api.putPrivate(`/company-service/leaves/update`, objectData);
  return response;
};