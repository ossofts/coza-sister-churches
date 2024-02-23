import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateUserInputs } from "./types";

export const createUserSchema = yupResolver<CreateUserInputs>(
  yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid email"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    departmentId: yup.string(),
    campusId: yup.string(),
    roleId: yup.string(),
    isRegistered: yup.boolean(),
    registeredBy: yup.string()
  })
);
