import { CGWC, CGWCInstantMessage, DefaultQueryParams } from "@/store/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { ServerResponse } from "@/types/global.type";
import { CreateCgwcInputs } from "@/pages/Cgwc/CreateCgwc";
import { CGWCInstantMessagePayload } from "@/pages/Cgwc/CgwcDetails/CreateInstantMessage";

const serviceUrl = "/api/cgwc";

export const useGetCGWCs = (params: DefaultQueryParams) => {
  return useQuery({
    queryKey: ["getCGWCs", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getAllCGWC`, {
        params: { ...params },
      }) as ServerResponse<CGWC[]>,
  });
};

export const useGetCGWCById = (id: string) => {
  return useQuery({
    queryKey: ["getCGWCs", id],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/getCGWCByID/${id}`
      ) as ServerResponse<CGWC>,
  });
};

export const useGetCGWCInstantMessages = (params: DefaultQueryParams) => {
  return useQuery({
    queryKey: ["getCGWCs", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getInstantMessage`, {
        params: { ...params },
      }) as ServerResponse<CGWCInstantMessage[]>,
  });
};

export const useCreateCGWCMutation = () => {
  return useMutation({
    mutationKey: ["createCGWC"],
    mutationFn: (body: CreateCgwcInputs) =>
      axiosClient.post(
        `${serviceUrl}/createCGWC`,
        body
      ) as ServerResponse<CGWC>,
  });
};

export const useCreateInstantMessageMutation = () => {
  return useMutation({
    mutationKey: ["createInstantMessage"],
    mutationFn: (body: CGWCInstantMessagePayload) =>
      axiosClient.post(
        `${serviceUrl}/createInstantMessage`,
        body
      ) as ServerResponse<CGWCInstantMessage>,
  });
};
