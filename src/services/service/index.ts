import axiosClient from "@/services/client";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { Service } from "../../contexts/AppContext/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DefaultQueryParams } from "@/store/types";
import { CreateService } from "@/pages/Cgwc/types";

const serviceUrl = "/api/service";

export const getLastestService = (
  campusId: string
): ServerResponse<Service> => {
  return axiosClient.get(
    `${serviceUrl}/getLatestServiceByCampusId/${campusId}`
  );
};

export const useGetLatestService = (campusId: string) => {
  return useQuery({
    queryKey: ["getLatestService"],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/getLatestServiceByCampusId/${campusId}`
      ) as ServerResponse<Service>,
    retry: false,
  });
};

export const useGetServices = (
  params: DefaultQueryParams = {},
  _options: QueryOptions<Service[]> = {}
) => {
  return useQuery({
    queryKey: ["getServices", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getServices`, {
        params: { ...params },
      }) as ServerResponse<Service[]>,
    retry: false,
    ..._options,
  });
};

export const useCreateServiceMutation = () => {
  return useMutation({
    mutationKey: ["createService"],
    mutationFn: (body: CreateService) =>
      axiosClient.post(
        `${serviceUrl}/createService`,
        body
      ) as ServerResponse<Service>,
  });
};
