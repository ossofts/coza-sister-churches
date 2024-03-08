import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../client";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import {
  CreateTicketPayload,
  Ticket,
  TicketCategory,
  TicketUpdatePayload,
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
      axiosClient.post(
        `${serviceUrl}/createTicket`,
        body
      ) as ServerResponse<Ticket>,
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

export const useContestTicket = (ticket_id: string) => {
  return useMutation({
    mutationKey: ["contestTicket"],
    mutationFn: (body: TicketUpdatePayload) =>
      axiosClient.patch(
        `${serviceUrl}/replyTicketByUser/${ticket_id}`,
        body
      ) as ServerResponse<Ticket>,
  });
};

export const useReplyContestTicket = (ticket_id: string) => {
  return useMutation({
    mutationKey: ["contestTicket"],
    mutationFn: (body: TicketUpdatePayload) =>
      axiosClient.patch(
        `${serviceUrl}/replyTicketByQCTeam/${ticket_id}`,
        body
      ) as ServerResponse<Ticket>,
  });
};

export const useRetractTicket = (ticket_id: string) => {
  return useMutation({
    mutationKey: ["contestTicket"],
    mutationFn: () =>
      axiosClient.patch(
        `${serviceUrl}/retractTicket/${ticket_id}`
      ) as ServerResponse<Ticket>,
  });
};

export const useUpdateTicket = (ticket_id: string) => {
  return useMutation({
    mutationKey: ["contestTicket"],
    mutationFn: (body: Partial<Ticket>) =>
      axiosClient.patch(
        `${serviceUrl}/updateTicket/${ticket_id}`,
        body
      ) as ServerResponse<Ticket>,
  });
};

export const useGetTicketById = (
  ticket_id: string,
  _options: Omit<QueryOptions<Ticket>, "select"> = {}
) => {
  return useQuery({
    queryKey: ["getTicketById", ticket_id],
    queryFn: () =>
      axiosClient.get(
        `${serviceUrl}/getTicket/${ticket_id}`
      ) as ServerResponse<Ticket>,
    select: (data) => data?.data,
    ..._options,
  });
};
