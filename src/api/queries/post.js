import { api } from "../service/apiHelper";
import { mediaApi } from "../service/mediaHelper";
/*
export const addComplexApi = async (objectData) => {
  const response = await api.postPrivate('/complex-of-buildings/add-complex-of-buildings', objectData);
  return response;
};
 */

export const loginEmail = async (objectData) => {
  const response = await api.postPrivate("/companies/login-mail", objectData);
  return response;
};

export const loginPhone = async (objectData) => {
  const response = await api.postPrivate("/companies/login-phone", objectData);
  return response;
};

export const documentAdd = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/documents/add",
    objectData,
  );
  return response;
};

export const createDocument = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/tasks/add",
    objectData,
  );
  return response;
};

export const announcementAdd = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/announcements/send",
    objectData,
  );
  return response;
};

export const calendarAdd = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/calendars/add",
    objectData,
  );
  return response;
};

export const registerPhone = async (objectData) => {
  const response = await api.post("company-service/sms/send", objectData);
  return response;
};

export const registerEmail = async (objectData) => {
  const response = await api.post("company-service/mail/send", objectData);
  return response;
};

export const registerVerify = async (objectData, token, url) => {
  const response = await api.postVerify(url, objectData, token);
  return response;
};
export const uploadFileDocument = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/tasks/upload-file",
    objectData,
  );
  return response;
};

export const uploadFileDocumentTask = async (objectData) => {
  const response = await mediaApi(
    "company-service/tasks/upload-file",
    objectData,
  );
  return response;
};

export const updateContactCompanies = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/companies/update-contact",
    objectData,
  );
  return response;
};

export const updateContactOverview = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/companies/update-profile",
    objectData,
  );
  return response;
};

export const updateDepartments = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/departments/add",
    objectData,
  );
  return response;
};

export const createWeaklySchedule = async (objectData) => {
  const response = await api.postPrivate(
    "company-service/schedules/create-weekly",
    objectData,
  );
  return response;
};

export const sendContactMessage = async (objectData) => {
  const response = await api.postPrivate("company-service/settings/send-message", objectData);
  return response;
};

export const addJobs = async (objectData) => {
  const response = await api.postPrivate(
    `/company-service/jobs/add`,
    objectData,
  );
  return response;
};

export const uploadCompanyLogo = async ({ id, formData }) => {
  const response = await mediaApi.postPrivate(
    `/logo/${id}/upload-images`,
    formData
  );
  return response;
};

