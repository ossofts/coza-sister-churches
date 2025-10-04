import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import { FullPageSpinner } from "@/components/Loaders";
import { useGetAttendance } from "@/services/attendance";
import { Attendance, Service } from "@/store/types";
import { mergeDuplicatesByKey } from "@/utils";
import React, { ReactNode } from "react";
import { AttendanceContainer } from "../Cgwc/CgwcDetails/AttendanceHeader";

type Props = Partial<Attendance> & {
  sessions?: Service[];
  title?: ReactNode;
};
type Columns = Attendance & Service;

const MyAttendance = React.memo(
  ({ CGWCId, userId, sessions, title }: Props) => {
    //   const [page, setPage] = React.useState(1);
    const columns: TableColumn<Columns>[] = [
      {
        title: "Session",
        field: "name",
        render: (data) => data?.name,
      },
      {
        title: "Clock In",
        field: "clockIn",
        renderType: {
          clockIn: (data) => data.clockIn,
        },
      },
      {
        title: "Clock Out",
        field: "clockOut",
        renderType: {
          clockOut: (data) => data.clockOut,
        },
      },
      {
        title: "Score",
        field: "score",
        renderType: {
          score: (data) => data.score,
        },
      },
    ];
    const {
      data,
      isLoading,
      // refetch: refetchAttendance,
    } = useGetAttendance({
      CGWCId,
      userId,
    });

    const minifiedAttendance = React.useMemo(
      () =>
        data?.data?.map((attendance) => {
          return {
            ...attendance,
            serviceId: attendance?.service?._id || attendance?.serviceId,
          };
        }) || [],
      [data]
    );

    // Check If
    const isNinetyPercent = React.useMemo(() => {
      const numberOfSessions = sessions?.length ?? 0;
      const numberOfClockIns = minifiedAttendance.reduce(
        (total, attendance) => {
          if (attendance.clockIn) total += 1;
          return total;
        },
        0
      );

      return numberOfClockIns === numberOfSessions - 1;
    }, [sessions, minifiedAttendance]);

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

    const TOTAL_ATTAINABLE_SCORE =
      (sessions?.length && sessions?.length > 0 ? sessions?.length : 0) * 25;

    const cumulativeAttendance = React.useMemo(() => {
      if (data?.data?.length) {
        return data?.data?.map((data) => data.score)?.reduce((a, b) => a + b);
      }
      return 0;
    }, [data]);

    const percantageAttendance =
      Math.round((cumulativeAttendance / TOTAL_ATTAINABLE_SCORE) * 100) || 0;

    const totalAttendance = (() => {
      switch (true) {
        case isNinetyPercent && percantageAttendance < 90:
          return 90;
        case cumulativeAttendance === 0 || TOTAL_ATTAINABLE_SCORE === 0:
          return 0;
        default:
          return percantageAttendance;
      }
    })();

    if (isLoading) return <FullPageSpinner />;

    return (
      <div>
        <AttendanceContainer
          title={title ?? "My Attendance"}
          score={totalAttendance}
          scoreType="percent"
        >
          <DataTable
            columns={columns}
            isLoading={false}
            data={mergedSessionsWithAttendance}
          />
        </AttendanceContainer>
      </div>
    );
  }
);

export default MyAttendance;
