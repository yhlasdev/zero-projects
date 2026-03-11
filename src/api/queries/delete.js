/*

 export const deleteComplexApi = async (id) => {
  const response = await api.deletePrivate('/complex-of-buildings/delete-complex-of-buildings', complexOfBuilding);
  return response;
};
 */
import { api } from "../service/apiHelper";


 export const deleteDepartment = async (id) => {
  const response = await api.deletePrivate('/company-service/departments/delete', id);
  return response;
};