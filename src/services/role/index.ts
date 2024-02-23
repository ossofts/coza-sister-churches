import { useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { ServerResponse } from "@/types/global.type";
import { Role } from "@/store/types";

const serviceUrl = "/api/role";
export const useGetRoles = () => {
  return useQuery({
    queryKey: ["getRoles"],
    queryFn: () => axiosClient.get(`${serviceUrl}/getRoles`) as ServerResponse<Role[]>,
    retry: false
  });
};

export const useGetRolesById = (id: Role["_id"]) => {
  return useQuery({
    queryKey: ["getRoleById", id],
    queryFn: () => axiosClient.get(`${serviceUrl}/getRoles/${id}`) as ServerResponse<Role>,
    retry: false
  });
};
