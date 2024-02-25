import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { Department } from "@/store/types";
import { CreateDepartmentPayload } from "@/pages/WorkforceManagement/types";

const serviceUrl = "/api/department";

export const useGetDepartmentsByCampusId = (
  campusId: string,
  _options: QueryOptions<Department[]> = {}
) => {
  return useQuery({
    queryKey: ["getDepartmentsByCampusId", campusId],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/getDepartmentByCampus/${campusId}`
      ) as ServerResponse<Department[]>,
    ..._options,
  });
};

export const useCreateDepartment = () => {
  return useMutation({
    mutationKey: ["createDepartment"],
    mutationFn: (body: CreateDepartmentPayload) =>
      axiosClient.post(
        `${serviceUrl}/createDepartment`,
        body
      ) as ServerResponse<Department>,
  });
};

export const useGetDepartmentAttendanceReport = (
  {
    serviceId,
    departmentId,
  }: {
    serviceId: string;
    departmentId: string;
  },
  _options: QueryOptions<{
    attendance: number;
    departmentUsers: number;
  }>
) => {
  return useQuery({
    queryKey: ["getDepartmentAttendanceReport"],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/departmentReport/${serviceId}/${departmentId}`
      ) as ServerResponse<{
        attendance: number;
        departmentUsers: number;
      }>,
    ..._options,
  });
};
