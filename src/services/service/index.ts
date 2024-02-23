import axiosClient from "@/services/client";
import { ServerResponse } from "@/types/global.type";
import { Service } from "../../contexts/AppContext/types";
import { useQuery } from "@tanstack/react-query";
import { DefaultQueryParams } from "@/store/types";

const serviceUrl = "/api/service";

export const getLastestService = (campusId: string): ServerResponse<Service> => {
  return axiosClient.get(`${serviceUrl}/getLatestServiceByCampusId/${campusId}`);
};

export const useGetLatestService = (campusId: string) => {
  return useQuery({
    queryKey: ["getLatestService"],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/getLatestServiceByCampusId/${campusId}`
      ) as ServerResponse<Service>,
    retry: false
  });
};

export const useGetServices = (params: DefaultQueryParams = {}) => {
  return useQuery({
    queryKey: ["getServices", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getServices`, {
        params: { ...params }
      }) as ServerResponse<Service[]>,
    retry: false
  });
};
