import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { LIVE_DATA_REFETCH_INTERVAL } from "../constants";
import axiosClient from "../client";
import {
  Attendance,
  ClockInPayload,
  DefaultQueryParams,
  ReportDownloadPayload,
} from "@/store/types";
import { QueryOptions, ServerResponse } from "@/types/global.type";

const serviceUrl = "/api/attendance";
export const useGetAttendance = (
  params: DefaultQueryParams,
  _options: QueryOptions<Attendance[]> = {}
) => {
  return useQuery({
    queryKey: ["getAttendance", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/getAttendance`, {
        params: { ...params },
      }) as ServerResponse<Attendance[]>,
    retry: false,
    ..._options,
  });
};

const invalidateAttendance = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["getAttendance"] });
  queryClient.invalidateQueries({ queryKey: ["getDepartmentAttendanceReport"] });
  queryClient.invalidateQueries({
    queryKey: ["getDepartmentCGWCAttendanceReport"],
  });
};

export const useClockIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clockIn"],
    mutationFn: (body: ClockInPayload) =>
      axiosClient.post(
        `${serviceUrl}/clockin`,
        body
      ) as ServerResponse<Attendance>,
    onSuccess: () => invalidateAttendance(queryClient),
  });
};

export const useClockOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clockIn"],
    mutationFn: (attendanceId: string) =>
      axiosClient.put(
        `${serviceUrl}/clock-out/${attendanceId}`
      ) as ServerResponse<Attendance>,
    onSuccess: () => invalidateAttendance(queryClient),
  });
};

export const useGetLeadersAttendanceReport = (
  { serviceId, campusId }: { serviceId: string; campusId: string },
  _options: QueryOptions<{
    attendance: number;
    leaderUsers: number;
  }>
) => {
  return useQuery({
    queryKey: ["getAttendance", serviceId, campusId],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/leaderAttendanceReport/${serviceId}/${campusId}`
      ) as ServerResponse<{
        attendance: number;
        leaderUsers: number;
      }>,
    retry: false,
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    ..._options,
  });
};

export const useGetWorkersAttendanceReport = (
  { serviceId, campusId }: { serviceId: string; campusId: string },
  _options: QueryOptions<{
    attendance: number;
    workerUsers: number;
  }>
) => {
  return useQuery({
    queryKey: ["getAttendance", serviceId, campusId],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/workersAttendanceReport/${serviceId}/${campusId}`
      ) as ServerResponse<{
        attendance: number;
        workerUsers: number;
      }>,
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    ..._options,
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
    queryKey: ["getDepartmentAttendanceReport", serviceId, departmentId],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/departmentReport/${serviceId}/${departmentId}`
      ) as ServerResponse<{
        attendance: number;
        departmentUsers: number;
      }>,
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    ..._options,
  });
};

export const useGetDepartmentCGWCAttendanceReport = (
  {
    serviceId,
    departmentId,
    isCGWC,
    CGWCId,
  }: {
    serviceId: string;
    departmentId: string;
    isCGWC: boolean;
    CGWCId: string;
  },
  _options: QueryOptions<{
    tickets?: number;
    attendance: number;
    departmentUsers: number;
  }>
) => {
  return useQuery({
    queryKey: [
      "getDepartmentCGWCAttendanceReport",
      { serviceId, departmentId, isCGWC, CGWCId },
    ],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/departmentReport/${serviceId}/${departmentId}/${isCGWC}/${CGWCId}`
      ) as ServerResponse<{
        tickets?: number;
        attendance: number;
        departmentUsers: number;
      }>,
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    ..._options,
  });
};

export const useGetWorkersCGWCAttendanceReport = (
  {
    serviceId,
    campusId,
    isCGWC,
    CGWCId,
  }: {
    serviceId: string;
    campusId: string;
    isCGWC: boolean;
    CGWCId: string;
  },
  _options: QueryOptions<{
    attendance: number;
    workerUsers: number;
  }>
) => {
  return useQuery({
    queryKey: [
      "getDepartmentCGWCAttendanceReport",
      serviceId,
      campusId,
      isCGWC,
      CGWCId,
    ],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/workersAttendanceReport/${serviceId}/${campusId}/${isCGWC}/${CGWCId}`
      ) as ServerResponse<{
        attendance: number;
        workerUsers: number;
      }>,
    refetchInterval: LIVE_DATA_REFETCH_INTERVAL,
    ..._options,
  });
};

export const useGetAttendanceReportForDownload = (
  params: ReportDownloadPayload,
  _options: QueryOptions<any[]>
) => {
  return useQuery({
    queryKey: ["getAttendanceReportForDownload", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/downloadServiceAttendance`, {
        params,
      }) as ServerResponse<any[]>,
    ..._options,
  });
};
