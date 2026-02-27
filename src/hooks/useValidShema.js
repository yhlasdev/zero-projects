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
    attendance_id: numReqValidSchema
  });

  const LeaveValid = yup.object({
    // leaves_id: numReqValidSchema
  });
  return {
    AttendanceValid,
    LeaveValid
  }

}