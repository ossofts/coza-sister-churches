import { useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { ServerResponse } from "@/types/global.type";
import { Campus } from "@/store/types";

const serviceUrl = "/api/campus";

export const useGetCampusById = (campusId: string) => {
  return useQuery({
    queryKey: ["getCampusById", campusId],
    queryFn: () => axiosClient.get(`${serviceUrl}/getCampus/${campusId}`) as ServerResponse<Campus>
  });
};

export const useGetCampuses = () => {
  return useQuery({
    queryKey: ["getCampuses"],
    queryFn: () => axiosClient.get(`${serviceUrl}/getCampuses`) as ServerResponse<Campus[]>
  });
};
