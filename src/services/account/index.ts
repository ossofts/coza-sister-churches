import axiosClient from "@/services/client";
import { REFERENCE_DATA_STALE_TIME } from "@/services/constants";
import { LoginResponse, RegisterInputs } from "../../pages/AuthForms/types";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { DefaultQueryParams, Department, User } from "@/store/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserInputs } from "@/pages/WorkforceManagement/types";
import { useEffect } from "react";

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

export const resetPasswordByEmail = (body: {
  email: string;
  newPassword: string;
}) => {
  return axiosClient.post(`${serviceUrl}/resetPasswordByEmail`, body);
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
    staleTime: REFERENCE_DATA_STALE_TIME,
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

// shared so a prefetch lands on exactly the key useGetUsers reads back
const usersQuery = (params: DefaultQueryParams) => ({
  queryKey: ["getUsers", params],
  queryFn: () =>
    axiosClient.get(`${userServiceUrl}/getUsers`, {
      params: { ...params },
    }) as ServerResponse<User[]>,
  staleTime: REFERENCE_DATA_STALE_TIME,
});

export const useGetUsers = (
  params: DefaultQueryParams = {},
  _options: QueryOptions<User[]> = {}
) => {
  return useQuery({
    ...usersQuery(params),
    ..._options,
  });
};

/**
 * Warms the cache for a campus roster this session will probably need, so the
 * page that reads it does not open on a spinner. Waits for the browser to go
 * idle first: the roster runs to thousands of people, and on a phone it should
 * not compete with the requests the current screen actually needs.
 */
export const usePrefetchUsersByCampus = (campusId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!campusId) return;
    const prefetch = () => queryClient.prefetchQuery(usersQuery({ campusId }));

    if (typeof window.requestIdleCallback !== "function") {
      const timeout = window.setTimeout(prefetch, 2000);
      return () => window.clearTimeout(timeout);
    }

    const handle = window.requestIdleCallback(prefetch, { timeout: 5000 });
    return () => window.cancelIdleCallback(handle);
  }, [campusId, queryClient]);
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
