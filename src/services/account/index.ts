import axiosClient from "@/services/client";
import { LoginResponse, RegisterInputs } from "../../pages/AuthForms/types";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { DefaultQueryParams, Department, User } from "@/store/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserInputs } from "@/pages/WorkforceManagement/types";

const serviceUrl = "/api/account";
const userServiceUrl = "/api/users";

export const loginUser = (body: {
  email: string;
  password: string;
}): ServerResponse<LoginResponse> => {
  return axiosClient.post(`${serviceUrl}/login`, body);
};

export const sentOtp = (email: string) => {
  return axiosClient.get(`${serviceUrl}/send-otp/${email}`);
};
export const sendPasswordOtp = (email: string) => {
  return axiosClient.get(`${serviceUrl}/forget-password/otp/${email}`);
};

export const validateOtp = (body: { email: string; otp: number }) => {
  return axiosClient.patch(`${serviceUrl}/validate-otp`, body);
};
export const validatePasswordOtp = (body: { email: string; otp: number }) => {
  return axiosClient.patch(`${serviceUrl}/forget-password/validate`, body);
};

export const registerUser = (
  body:
    | (Omit<RegisterInputs, "confirmPassword"> & {
        departmentId: string;
        roleId: string;
        campusId: string;
        isCGWCApproved: boolean;
      })
    | Pick<RegisterInputs, "email" | "password">
): ServerResponse<User> => {
  return axiosClient.post(`${serviceUrl}/register`, body);
};

export const forgotPassword = (
  otp: string,
  body: {
    email: string;
    password: string;
  }
) => {
  return axiosClient.post(`${serviceUrl}/forget-password/${otp}`, body);
};

export const useGetUsersByDepartmentId = (
  departmentId: Department["_id"],
  _options: QueryOptions<User[]> = {}
) => {
  return useQuery({
    queryKey: ["getUsersByDepartmentId", departmentId],
    queryFn: () =>
      axiosClient.get(`${userServiceUrl}/getUsers`, {
        params: { departmentId },
      }) as ServerResponse<User[]>,
    ..._options,
  });
};

export const useGetUserById = (
  id: string,
  _options: QueryOptions<User> = {}
) => {
  return useQuery({
    queryKey: ["getUsers", id],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/user/${id}`) as ServerResponse<User>,
    ..._options,
  });
};
export const useGetUsers = (
  params: DefaultQueryParams = {},
  _options: QueryOptions<User[]> = {}
) => {
  return useQuery({
    queryKey: ["getUsers", params],
    queryFn: () =>
      axiosClient.get(`${userServiceUrl}/getUsers`, {
        params: { ...params },
      }) as ServerResponse<User[]>,
    ..._options,
  });
};

export const useUploadUser = () => {
  return useMutation({
    mutationKey: ["uploadUser"],
    mutationFn: (body: CreateUserInputs) =>
      axiosClient.post(
        `${serviceUrl}/createUploadedUSer`,
        body
      ) as ServerResponse<User>,
  });
};

export const useDeleteUserByEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) =>
      axiosClient.delete(`${serviceUrl}/delete/${email}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getUsers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUsersByDepartmentId"],
      });
    },
  });
};
