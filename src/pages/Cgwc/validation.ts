import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateCgwcInputs } from "./CreateCgwc";
import { CGWCInstantMessage } from "@/store/types";
import { CreateServicePayload } from "./types";

export const createCgwcSchema = yupResolver<CreateCgwcInputs>(
  yup.object().shape({
    name: yup.string().required("Name is required"),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("Start date is required"),
    registrationStartDate: yup
      .date()
      .required("Registration start date is required"),
    registrationEndDate: yup
      .date()
      .required("Registration end date is required"),
  })
);

export const createInstantMessageSchema = yupResolver<
  Pick<CGWCInstantMessage, "title" | "message" | "messageLink" | "imageUrl">
>(
  yup.object().shape({
    message: yup.string().required("Message is required"),
    title: yup.string().required("Title  is required"),
    messageLink: yup
      .string()
      .url("Message link must be a url")
      .required("Message link is required"),
    imageUrl: yup
      .string()
      .url("Image url is invalid")
      .required("Message link is required"),
  })
);

export const createCGWCSessionSchema = yupResolver<CreateServicePayload>(
  yup.object().shape({
    name: yup.string().required("Name is required"),
    serviceType: yup.string().required("Service type is required"),
    serviceTag: yup.string().required("Service tag is required"),
    serviceTime: yup.string().required("Service time is required"),
    serviceDate: yup.string().required("Service date is required"),
    endTime: yup.string().required("Service end time is required"),
    isCGWC: yup.bool(),
    CGWCId: yup.string(),
    clockinTime: yup.string().required("Clock in time is required"),
    leaderLateTime: yup.string().required("Leaders late time is required"),
    workerLateTime: yup.string().required("Workers late time is required"),
    isGlobalService: yup.bool().required(),
  })
);
