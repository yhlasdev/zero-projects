import * as yup from "yup";
import { useValidSchmsConsts } from "./useValidSchmsConsts";


export const useValidSchema = () => {

  const {
    nameReqValidSchema,
    descOptValidSchema,
    guidReqValidSchema,
    contOptValidSchema,
    numWithDotOptValidSchema,
    numReqValidSchema,
    numrequired,
  } = useValidSchmsConsts();


  const AttendanceValid = yup.object({
    // attendance_id: numReqValidSchema
  });



  const registerValidationSchema = yup.object({
    company_name: yup
      .string()
      .required("Company name is required"),

    country_code: yup
      .string()
      .required("Country code is required"),

    fcm_token: yup
      .string()
      .required("Fcm token is required"),

    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),

    phone_number: yup.string()
      .required("Phone number is required"),
  });


  const LeaveValid = yup.object({
    // leaves_id: numReqValidSchema
  });



  return {
    AttendanceValid,
    LeaveValid,
    registerValidationSchema
  }

}