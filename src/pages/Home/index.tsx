 
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Timer from "./Timer";
import ClockButton from "./ClockButton";
import ClockStatistics from "./ClockStatistics";
import CampusLocation from "./CampusLocation";
import { CampusAttendanceSummary } from "./AttendanceSummary";
import ReactIf from "@/components/ReactIf";
import useRoles from "@/hooks/useRoles";

// import { useGetCampusById } from "@/services/campus";
import { useMemo } from "react";
import { useGetLatestService } from "@/services/service";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/types/global.type";
import {
  useGetDepartmentAttendanceReport,
  // useGetLeadersAttendanceReport,
  useGetWorkersAttendanceReport,
} from "@/services/attendance";
import useUserStore from "@/store/userStore";
import TeamAttendanceSummary from "./TeamAttendanceSummary";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const { isSuperAdmin, isHOD } = useRoles();

  const { data: latestService } = useGetLatestService(user!.campus?._id);

  const selectCoordinateRef = useMemo(() => {
    if (latestService?.data?.isGlobalService)
      return latestService?.data?.coordinates;

    return user?.campus?.location;
  }, [latestService?.data, user?.campus?.location]);

  const campusCoordinates = {
    latitude: selectCoordinateRef?.lat,
    longitude: selectCoordinateRef?.long,
  };

  const { height } = useWindowDimensions();
  const vh = Number(height);
  const one = isSuperAdmin ? 420 : 380;
  const two = isSuperAdmin ? 400 : 360;
  const three = isSuperAdmin ? 340 : 300;

  const heightOffset = vh > 835 ? vh - one : vh > 800 ? vh - two : vh - three;

  const { isInRange, deviceCoordinates, verifyRangeBeforeAction } =
    useGeolocation({
      rangeToClockIn: latestService?.data?.rangeToClockIn as number,
      campusCoordinates: campusCoordinates as Coordinates,
    });

  // const { data: leadersAttendance, isLoading: leadersIsLoading } =
  //   useGetLeadersAttendanceReport(
  //     {
  //       serviceId: latestService?.data?._id as string,
  //       campusId: user!.campus?._id,
  //     },
  //     { enabled: !!latestService?.data?._id }
  //   );

  const { data: workersAttendance, isLoading: workersIsLoading } =
    useGetWorkersAttendanceReport(
      {
        serviceId: latestService?.data?._id as string,
        campusId: user!.campus?._id,
      },
      { enabled: isSuperAdmin && latestService?.data !== undefined }
    );

  const {
    data: attendanceReport,
    isLoading: attendanceReportLoading,
    // refetch: attendanceReportRefetch,
  } = useGetDepartmentAttendanceReport(
    {
      serviceId: latestService?.data?._id as string,
      departmentId: String(user?.department?._id),
    },
    {
      enabled: isHOD,
    }
  );

  return (
    <div className="flex flex-col items-center pt-6">
      <Timer />
      <ReactIf
        condition={isSuperAdmin}
        component={
          <CampusAttendanceSummary
            isLoading={workersIsLoading}
            // leadersAttendance={leadersAttendance?.data?.attendance}
            workersAttendance={workersAttendance?.data?.attendance}
            // leaderUsers={leadersAttendance?.data?.leaderUsers}
            workerUsers={workersAttendance?.data?.workerUsers}
          />
        }
      />
      <div
        style={{ height: `${heightOffset}px` }}
        className="flex flex-col items-center justify-between w-full mt-3"
      >
        <ClockButton
          isInRange={!!isInRange}
          deviceCoordinates={deviceCoordinates}
          verifyRangeBeforeAction={verifyRangeBeforeAction}
        />
        <CampusLocation />

        <ReactIf
          condition={isHOD}
          component={
            <TeamAttendanceSummary
              isLoading={attendanceReportLoading}
              attendance={attendanceReport?.data?.attendance}
              departmentUsers={attendanceReport?.data?.departmentUsers}
            />
          }
        />

        <ClockStatistics />
      </div>
    </div>
  );
};

export default Home;
