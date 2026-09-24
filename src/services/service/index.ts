import axiosClient from "@/services/client";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { Service } from "../../contexts/AppContext/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LIVE_DATA_REFETCH_INTERVAL } from "../constants";
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
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createService"],
    mutationFn: (body: CreateService) =>
      axiosClient.post(
        `${serviceUrl}/createService`,
        body
      ) as ServerResponse<Service>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLatestService"] });
      queryClient.invalidateQueries({ queryKey: ["getServices"] });
    },
  });
};
