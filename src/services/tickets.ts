import { ReportDownloadPayload } from "@/store/types";
import { QueryOptions, ServerResponse } from "@/types/global.type";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "./client";

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
