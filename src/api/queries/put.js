/* ";


export const updateComplexApi = async (objectData) => {
  const response = await api.putPrivate(`/complex-of-buildings/update-complex-of-buildings`, objectData);
  return response;
};
 */
import { api } from "../service/apiHelper";

export const updateAttendance = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/attendances/update`,
    objectData,
  );
  return response;
};

export const updateLeaves = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/leaves/update`,
    objectData,
  );
  return response;
};

export const updateAnnouncement = async ({ id, objectData }) => {
  const response = await api.putPrivate(
    `/company-service/announcements/update/${id}`,
    objectData,
  );
  return response;
};

export const updateDepartments = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/departments/update`,
    objectData,
  );
  return response;
};

export const updateNewRequest = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/employees/join-requests/update-status`,
    objectData,
  );
  return response;
};

export const updateEmployee = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/employees/update`,
    objectData,
  );
  return response;
};

export const updateSchedule = async (objectData) => {
  const response = await api.putPrivate(
    `/company-service/schedules/update-weekly`,
    objectData,
  );
  return response;
};
