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