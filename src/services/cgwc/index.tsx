import { CGWC, CGWCInstantMessage, DefaultQueryParams } from "@/store/types";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { ServerResponse } from "@/types/global.type";

const serviceUrl = "/api/cgwc";

export const useGetCGWCs = (params: DefaultQueryParams) => {
  return useQuery({
    queryKey: ["getCGWCs", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getAllCGWC`, {
        params: { ...params }
      }) as ServerResponse<CGWC[]>
  });
};

export const useGetCGWCById = (id: string) => {
  return useQuery({
    queryKey: ["getCGWCs", id],
    queryFn: () => axiosClient.get(`${serviceUrl}/getCGWCByID/${id}`) as ServerResponse<CGWC>
  });
};

export const useGetCGWCInstantMessages = (params: DefaultQueryParams) => {
  return useQuery({
    queryKey: ["getCGWCs", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getInstantMessage`, {
        params: { ...params }
      }) as ServerResponse<CGWCInstantMessage[]>
  });
};
