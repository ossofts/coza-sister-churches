import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInputs } from ".";

export const ExportSchema = yupResolver<FormInputs>(
  yup.object().shape({
    dataType: yup.string().required("Data type is required"),
    service: yup.string().required("Service is required"),
    department: yup.string(),
    startDate: yup.date(),
    endDate: yup.date(),
  })
);
