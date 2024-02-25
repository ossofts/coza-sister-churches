/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactIf from "@/components/ReactIf";
import Lottie from "lottie-react";
import { twMerge } from "tailwind-merge";
import { PiHandTap } from "react-icons/pi";
import { Spinner } from "@/components/Loaders";
import animationData from "@/assets/json/clock-button-animation.json";
import showAlert from "@/hooks/useAlert";
import { Coordinates, customError } from "@/types/global.type";
import { useEffect, useState } from "react";
// import useAppContext from "@/contexts/AppContext";
import {
  useClockIn,
  useClockOut,
  useGetAttendance,
} from "@/services/attendance";
import useUserStore from "@/store/userStore";
import moment from "moment";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useGetLatestService } from "@/services/service";
import useGeolocation from "@/hooks/useGeolocation";

type Props = {
  isInRangeProp: boolean;
  deviceCoordinates: Coordinates;
  userId: string;
  roleId: string;
  campusId: string;
  departmentId: string;
  campusCoordinates: Coordinates;
};

const ClockButton = ({
  userId,
  roleId,
  campusId,
  departmentId,
  deviceCoordinates,
  campusCoordinates,
  isInRangeProp: isInRange,
}: Props) => {
  const [openClockOutConfirmation, setOpenClockOutConfirmation] =
    useState(false);
  const user = useUserStore((state) => state.user);

  const { data: latestService } = useGetLatestService(user!.campus._id);

  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();

  const { verifyRangeBeforeAction } = useGeolocation({
    rangeToClockIn: latestService?.data?.rangeToClockIn as number,
    campusCoordinates: campusCoordinates as Coordinates,
  });

  const { data: latestAttendanceData, refetch: refetchLatestAttendance } =
    useGetAttendance(
      {
        userId,
        serviceId: latestService?.data?._id,
      },
      {
        enabled: userId !== undefined,
        refetchOnMount: true,
      }
    );

  const handleClockOut = () => {
    if (canClockOut) {
      verifyRangeBeforeAction(
        () => {
          clockOutMutation.mutate(latestAttendanceData?.data[0]?._id as string);
          setOpenClockOutConfirmation(false);
        },
        () => showAlert("warning", "You are not within range of any campus!")
      );
      return;
    }
  };
  const handlePress = () => {
    if (!isInRange) {
      showAlert("warning", "You are not within range of any campus!");
      return;
    }
    if (canClockIn) {
      clockInMutation.mutate({
        userId: userId,
        clockIn: `${moment().unix()}`,
        clockOut: null,
        serviceId: latestService?.data?._id as string,
        coordinates: {
          lat: `${deviceCoordinates.latitude}`,
          long: `${deviceCoordinates.longitude}`,
        },
        campusId: campusId,
        departmentId: departmentId,
        roleId,
      });
      return;
    }
    if (canClockOut && latestAttendanceData) {
      setOpenClockOutConfirmation(true);
      return;
    }
  };

  useEffect(() => {
    if (clockInMutation.data) {
      showAlert("success", `You clocked in at ${moment().format("LT")}`);
      refetchLatestAttendance();
    }

    if (clockInMutation.error) {
      showAlert(
        "warning",
        customError(clockInMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockInMutation.data, clockInMutation.error]);

  useEffect(() => {
    if (clockOutMutation.data) {
      // setClockedOut(true);
      showAlert(
        `${isInRange ? "success" : "warning"}`,
        `You clocked out at ${moment().format("LT")}`
      );
    }

    if (clockOutMutation.error) {
      showAlert(
        "warning",
        customError(clockOutMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
      refetchLatestAttendance;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockOutMutation.data, clockOutMutation.error]);

  useEffect(() => {
    if (latestAttendanceData?.data && !latestAttendanceData?.data[0]?.clockIn) {
      // setClockedOut(false);
    }
  }, [latestAttendanceData?.data]);

  useEffect(() => {
    refetchLatestAttendance();
  }, [campusId, departmentId, userId]);

  const clockedIn =
    latestAttendanceData?.data?.length && latestAttendanceData?.data[0].clockIn
      ? true
      : false;

  const canClockIn = isInRange && latestService && userId && !clockedIn;

  const canClockOut =
    latestAttendanceData?.data?.length &&
    latestAttendanceData?.data[0].clockIn &&
    !latestAttendanceData?.data[0].clockOut &&
    isInRange &&
    userId;

  const disabled = !userId || !latestService;

  return (
    <>
      <div className="relative" onClick={disabled ? () => null : handlePress}>
        {canClockIn && (
          <Lottie
            animationData={animationData}
            // resizeMode="cover"
            style={{
              left: -40,
              top: -40,
              position: "absolute",
              width: 320,
            }}
            autoPlay
            loop
          />
        )}

        <div className="flex justify-center items-center">
          <button
            className={twMerge(
              "w-[200px] h-[200px] rounded-full shadow-lg",
              canClockIn && !disabled
                ? "bg-brandColor-600"
                : canClockOut
                  ? "bg-rose-400"
                  : disabled
                    ? "bg-gray-400"
                    : "bg-gray-400"
            )}
          >
            <span>
              <span className="flex flex-col items-center">
                <ReactIf
                  condition={
                    clockInMutation.isPending || clockOutMutation.isPending
                  }
                  component={<Spinner color="white" size={60} />}
                  fallback={
                    <span className="flex flex-col items-center gap-4">
                      <PiHandTap color="white" size={110} />
                      <span className="font-light text-md text-white">
                        {disabled
                          ? ""
                          : canClockIn
                            ? "CLOCK IN"
                            : canClockOut
                              ? "CLOCK OUT"
                              : ""}
                      </span>
                    </span>
                  }
                />
              </span>
            </span>
          </button>
        </div>
      </div>
      <ConfirmationModal
        open={openClockOutConfirmation}
        setOpen={setOpenClockOutConfirmation}
        onConfirmationClick={handleClockOut}
        title="Confirm clock out"
        description="Are you sure you want to clock out now?"
      ></ConfirmationModal>
    </>
  );
};

export default ClockButton;
