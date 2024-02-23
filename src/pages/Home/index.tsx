/* eslint-disable @typescript-eslint/no-explicit-any */
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Timer from "./Timer";
import ClockButton from "./ClockButton";
import ClockStatistics from "./ClockStatistics";
import CampusLocation from "./CampusLocation";
import { CampusAttendanceSummary } from "./AttendanceSummary";
import ReactIf from "@/components/ReactIf";
import useRoles from "@/hooks/useRoles";

// import { useGetCampusById } from "@/services/campus";
import { useEffect, useMemo } from "react";
import { useGetLatestService } from "@/services/service";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/types/global.type";
import {
  useGetLeadersAttendanceReport,
  useGetWorkersAttendanceReport
} from "@/services/attendance";
import useUserStore from "@/store/userStore";
import { useGetUserById } from "@/services/account";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isCampusPastor } = useRoles();

  const { data: refreshedUser } = useGetUserById(user!.userId, {
    retry: false,
    refetchOnMount: false
  });

  const { data: latestService } = useGetLatestService(user!.campus?._id);

  const selectCoordinateRef = useMemo(() => {
    if (latestService?.data?.isGlobalService) return latestService?.data?.coordinates;

    return user?.campus?.location;
  }, [latestService?.data, user?.campus?.location]);

  const campusCoordinates = {
    latitude: selectCoordinateRef?.lat,
    longitude: selectCoordinateRef?.long
  };

  const { height } = useWindowDimensions();
  const vh = Number(height);
  const one = isCampusPastor ? 420 : 380;
  const two = isCampusPastor ? 400 : 360;
  const three = isCampusPastor ? 340 : 300;

  const heightOffset = vh > 835 ? vh - one : vh > 800 ? vh - two : vh - three;

  const { isInRange, deviceCoordinates, verifyRangeBeforeAction } = useGeolocation({
    rangeToClockIn: latestService?.data?.rangeToClockIn as number,
    campusCoordinates: campusCoordinates as Coordinates
  });

  const { data: leadersAttendance, isLoading: leadersIsLoading } = useGetLeadersAttendanceReport(
    {
      serviceId: latestService?.data?._id as string,
      campusId: user!.campus?._id
    },
    { enabled: !!latestService?.data?._id }
  );

  const { data: workersAttendance, isLoading: workersIsLoading } = useGetWorkersAttendanceReport(
    {
      serviceId: latestService?.data?._id as string,
      campusId: user!.campus?._id
    },
    { enabled: !!latestService?.data?._id }
  );

  useEffect(() => {
    if (refreshedUser) {
      setUser(refreshedUser?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshedUser]);

  return (
    <div className="flex flex-col items-center pt-6">
      <Timer />
      <ReactIf
        condition={isCampusPastor}
        component={
          <CampusAttendanceSummary
            isLoading={leadersIsLoading || workersIsLoading}
            leadersAttendance={leadersAttendance?.data?.attendance}
            workersAttendance={workersAttendance?.data?.attendance}
            leaderUsers={leadersAttendance?.data?.leaderUsers}
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
        <ClockStatistics />
      </div>
    </div>
  );
};

export default Home;
