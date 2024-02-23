import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthInputs, RegisterInputs, UpdatePasswordType } from "./types";

export const loginSchema = yupResolver<AuthInputs>(
  yup.object().shape({
    email: yup.string().required("Your email is required").email("Invalid email"),
    password: yup.string().min(6).required("Password is required")
  })
);

export const emailOnlySchema = yupResolver<Pick<AuthInputs, "email">>(
  yup.object().shape({
    email: yup.string().required("Your email is required").email("Invalid email")
  })
);

export const updateAccountSchema = yupResolver<RegisterInputs>(
  yup.object().shape({
    email: yup.string().required("Your email is required").email("Invalid email"),
    firstName: yup.string().required("Your first name is required"),
    lastName: yup.string().required("Your last name is required"),
    phoneNumber: yup.string().required("Your phone number is required").min(11).max(11),
    gender: yup.string().required("Your gender is required"),
    password: yup.string().required("Your password is required"),
    confirmPassword: yup
      .string()
      .label("confirm password")
      .required()
      .oneOf([yup.ref("password")], "Passwords must match")
  })
);

export const updatePasswordSchema = yupResolver<UpdatePasswordType>(
  yup.object().shape({
    password: yup.string().required("Your password is required"),
    confirmPassword: yup
      .string()
      .label("confirm password")
      .required()
      .oneOf([yup.ref("password")], "Passwords must match")
  })
);
