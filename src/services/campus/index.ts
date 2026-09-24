import { useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { ServerResponse } from "@/types/global.type";
import { Campus } from "@/store/types";
import { REFERENCE_DATA_STALE_TIME } from "../constants";

const serviceUrl = "/api/campus";

export const useGetCampusById = (campusId: string) => {
  return useQuery({
    queryKey: ["getCampusById", campusId],
    queryFn: () => axiosClient.get(`${serviceUrl}/getCampus/${campusId}`) as ServerResponse<Campus>,
    staleTime: REFERENCE_DATA_STALE_TIME
  });
};

export const useGetCampuses = () => {
  return useQuery({
    queryKey: ["getCampuses"],
    queryFn: () => axiosClient.get(`${serviceUrl}/getCampuses`) as ServerResponse<Campus[]>,
    staleTime: REFERENCE_DATA_STALE_TIME
  });
};
