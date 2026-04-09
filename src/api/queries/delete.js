/*

 export const deleteComplexApi = async (id) => {
  const response = await api.deletePrivate('/complex-of-buildings/delete-complex-of-buildings', complexOfBuilding);
  return response;
};
 */
import { api } from "../service/apiHelper";

export const deleteDepartment = async (id) => {
  const response = await api.deletePrivate(
    "/company-service/departments/delete",
    id,
  );
  return response;
};

export const deleteSchedule = async ({ schedule_id }) => {
  const response = await api.deletePrivate(
    "/company-service/schedules/delete-weekly",
    { schedule_id },
  );
  return response;
};

export const deleteAnnouncement = async (id) => {
  const response = await api.deletePrivate(`/company-service/announcements/delete/${id}`);
  return response;
};

export const deleteJobs = async (id) => {
  const response = await api.deletePrivate('/company-service/jobs/delete', {id});
  return response;
};

export const deleteDocument = async (id) => {
  const response = await api.deletePrivate(`/company-service/documents/delete/${id}`);
  return response;
};

export const deleteCalendar = async (id) => {
  const response = await api.deletePrivate(`/company-service/calendars/delete/${id}`);
  return response;
};
