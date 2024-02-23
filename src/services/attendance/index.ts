import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { Attendance, ClockInPayload, DefaultQueryParams } from "@/store/types";
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
        params: { ...params }
      }) as ServerResponse<Attendance[]>,
    retry: false,
    ..._options
  });
};

export const useClockIn = () => {
  return useMutation({
    mutationKey: ["clockIn"],
    mutationFn: (body: ClockInPayload) =>
      axiosClient.post(`${serviceUrl}/clockin`, body) as ServerResponse<Attendance>
  });
};

export const useClockOut = () => {
  return useMutation({
    mutationKey: ["clockIn"],
    mutationFn: (attendanceId: string) =>
      axiosClient.put(`${serviceUrl}/clock-out/${attendanceId}`) as ServerResponse<Attendance>
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
    ..._options
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
    retry: false,
    ..._options
  });
};
