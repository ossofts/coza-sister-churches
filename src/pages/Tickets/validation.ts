import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateTicketPayload } from "./types";

export const createTicketSchema = yupResolver<CreateTicketPayload>(
  yup.object().shape({
    serviceId: yup.string(),
    departmentId: yup.string().required("Department is required"),
    campusId: yup.string().required(""),
    userId: yup.string(),
    categoryId: yup.string().required("Category is required"),
    isCampus: yup.bool().required(""),
    isDepartment: yup.bool().required(""),
    isIndividual: yup.bool().required(""),
    isRetracted: yup.bool().required(""),
    ticketSummary: yup.string().required("Description is required"),
    status: yup.mixed<"ISSUED" | "CONTESTED" | "RETRACTED" | "ACKNOWLEDGED">(),
    issuedBy: yup.string().required(""),
    _id: yup.string(),
  })
);
