import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import { FullPageSpinner } from "@/components/Loaders";
import { useGetAttendance } from "@/services/attendance";
import { Attendance, Service } from "@/store/types";
import { mergeDuplicatesByKey } from "@/utils";
import React from "react";
import { AttendanceContainer } from "./AttendanceHeader";

type Props = Partial<Attendance> & {
  sessions?: Service[];
};
type Columns = Attendance & Service;

const MyAttendance = React.memo(({ CGWCId, userId, sessions }: Props) => {
  //   const [page, setPage] = React.useState(1);
  const columns: TableColumn<Columns>[] = [
    {
      title: "Session",
      field: "name",
      render: (data) => data?.name
    },
    {
      title: "Clock In",
      field: "clockIn",
      renderType: {
        clockIn: (data) => data.clockIn
      }
    },
    {
      title: "Clock Out",
      field: "clockOut",
      renderType: {
        clockOut: (data) => data.clockOut
      }
    },
    {
      title: "Score",
      field: "score",
      renderType: {
        score: (data) => data.score
      }
    }
  ];
  const {
    data,
    isLoading
    // refetch: refetchAttendance,
  } = useGetAttendance({
    CGWCId,
    userId
  });

  const minifiedAttendance = React.useMemo(
    () =>
      data?.data?.map((attendance) => {
        return { ...attendance, serviceId: attendance?.service?._id || attendance?.serviceId };
      }) || [],
    [data]
  );

  const minifiedSessions = React.useMemo(
    () =>
      sessions?.map((session) => {
        return { serviceId: session._id, name: session.name };
      }) || [],
    [sessions]
  );

  const mergedSessionsWithAttendance = React.useMemo(() => {
    if (minifiedAttendance?.length) {
      return mergeDuplicatesByKey<Attendance>(
        [...minifiedSessions, ...minifiedAttendance],
        "serviceId"
      );
    }
    return mergeDuplicatesByKey<Attendance>(minifiedSessions, "serviceId");
  }, [minifiedSessions, minifiedAttendance]);

  const TOTAL_ATTAINABLE_SCORE = (sessions?.length || 0) * 25;

  const cumulativeAttendance = React.useMemo(() => {
    if (data?.data?.length) {
      return data?.data?.map((data) => data.score)?.reduce((a, b) => a + b);
    }
    return 0;
  }, [data]);

  const totalAttendance = Math.round((cumulativeAttendance / TOTAL_ATTAINABLE_SCORE) * 100);

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <AttendanceContainer title="My Attendance" score={totalAttendance} scoreType="percent">
        <DataTable columns={columns} isLoading={false} data={mergedSessionsWithAttendance} />
      </AttendanceContainer>
    </div>
  );
});

export default MyAttendance;
