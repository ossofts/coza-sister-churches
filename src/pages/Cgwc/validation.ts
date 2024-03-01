import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateCgwcInputs } from "./CreateCgwc";
import { CGWCInstantMessage } from "@/store/types";

export const createCgwcSchema = yupResolver<CreateCgwcInputs>(
  yup.object().shape({
    name: yup.string().required("Name is required"),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("Start date is required"),
  })
);

export const createInstantMessageSchema = yupResolver<
  Pick<CGWCInstantMessage, "title" | "message">
>(
  yup.object().shape({
    message: yup.string().required("Message is required"),
    title: yup.string().required("Title  is required"),
  })
);
