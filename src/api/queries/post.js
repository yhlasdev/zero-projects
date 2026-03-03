import { api } from "../service/apiHelper";
/*
export const addComplexApi = async (objectData) => {
  const response = await api.postPrivate('/complex-of-buildings/add-complex-of-buildings', objectData);
  return response;
};
 */

export const loginEmail = async (objectData) => {
  const response = await api.postPrivate('/companies/login-mail', objectData);
  return response;
};

export const loginPhone = async (objectData) => {
  const response = await api.postPrivate('/companies/login-phone', objectData);
  return response;
};

export const documentAdd = async (objectData) => {
  const response = await api.postPrivate('company-service/documents/add', objectData);
  return response;
};

export const announcementAdd = async (objectData) => {
  const response = await api.postPrivate('company-service/announcements/send', objectData);
  return response;
};

export const calendarAdd = async (objectData) => {
  const response = await api.postPrivate('company-service/calendars/add', objectData);
  return response;
};

export const registerPhone = async (objectData) => {
  const response = await api.post('company-service/sms/send', objectData);
  return response;
};


export const registerEmail = async (objectData) => {
  const response = await api.post('company-service/mail/send', objectData);
  return response;
};

export const registerVerify = async (objectData, token, url) => {
  const response = await api.postVerify(url, objectData, token)
  return response;
}