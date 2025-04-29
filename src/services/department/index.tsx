import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useDeleteDepartmentById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axiosClient.delete(`${serviceUrl}/deleteDepartment/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDepartmentsByCampusId"],
      });
    },
  });
};
