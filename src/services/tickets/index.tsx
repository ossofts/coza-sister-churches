import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import {
  CreateTicketPayload,
  Ticket,
  TicketCategory,
} from "@/pages/Tickets/types";
import { DefaultQueryParams, ReportDownloadPayload } from "@/store/types";

const serviceUrl = "/api/ticket";

export const useGetTicketsReportForDownload = (
  params: ReportDownloadPayload,
  _options: QueryOptions<any[]>
) => {
  return useQuery({
    queryKey: ["getAttendanceReportForDownload", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/download`, {
        params,
      }) as ServerResponse<any[]>,
    ..._options,
  });
};

export const useGetTicketCategories = () => {
  return useQuery({
    queryKey: ["getTicketCategories"],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/category/getCategories`) as ServerResponse<
        TicketCategory[]
      >,
    select: (data) => data.data,
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationKey: ["createTicket"],
    mutationFn: (body: CreateTicketPayload) =>
      axiosClient.post(`${serviceUrl}`, body) as ServerResponse<Ticket>,
  });
};

export const useGetTickets = (
  params: DefaultQueryParams,
  _options: Omit<QueryOptions<Ticket[]>, "select"> = {}
) => {
  return useQuery({
    queryKey: ["getTickets", params],
    queryFn: () =>
      axiosClient.get(`${serviceUrl}/filter`, {
        params,
      }) as ServerResponse<Ticket[]>,
    select: (data) => data.data,
    ..._options,
  });
};
