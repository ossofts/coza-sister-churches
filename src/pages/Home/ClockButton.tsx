/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactIf from "@/components/ReactIf";
import Lottie from "lottie-react";
import { twMerge } from "tailwind-merge";
import { PiHandTap } from "react-icons/pi";
import { Spinner } from "@/components/Loaders";
import animationData from "@/assets/json/clock-button-animation.json";
import showAlert from "@/hooks/useAlert";
import { Coordinates, customError } from "@/types/global.type";
import { MouseEvent, useEffect, useState } from "react";
import useAppContext from "@/contexts/AppContext";
import { useClockIn, useClockOut } from "@/services/attendance";
import useUserStore from "@/store/userStore";
import moment from "moment";
import ConfirmationModal from "@/components/ConfirmationModal";

type Props = {
  isInRange: boolean;
  deviceCoordinates: Coordinates;
  verifyRangeBeforeAction: (
    successCallback: () => any,
    errorCallback: () => any
  ) => void;
};

const ClockButton = ({
  isInRange,
  deviceCoordinates,
  verifyRangeBeforeAction,
}: Props) => {
  const [clockedOut, setClockedOut] = useState(false);
  const [openClockOutConfirmation, setOpenClockOutConfirmation] =
    useState(false);
  const user = useUserStore((state) => state.user);

  const {
    latestService: {
      data: latestServiceData,
      isError: isLatestServiceError,
      isLoading: latestServiceLoading,
    },
    lastestAttendance: {
      data: latestAttendanceData,
      refetch: refetchAttendance,
      isLoading: latestAttendanceLoading,
    },
  } = useAppContext();

  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();

  const handleClockIn = () => {
    clockInMutation.mutate({
      userId: user!.userId as string,
      clockIn: `${moment().unix()}`,
      clockOut: null,
      serviceId: latestServiceData?.data?._id as string,
      coordinates: {
        lat: `${deviceCoordinates.latitude}`,
        long: `${deviceCoordinates.longitude}`,
      },
      campusId: user!.campus._id,
      departmentId: user!.department._id,
      roleId: user!.role._id,
    });
  };

  const handleClockOut = () => {
    if (latestAttendanceData?.data?.length) {
      clockOutMutation.mutate(latestAttendanceData?.data[0]?._id);
    }
  };

  useEffect(() => {
    if (clockInMutation.data) {
      showAlert("success", `You clocked in at ${moment().format("LT")}`);
      refetchAttendance();
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
      setClockedOut(true);
      showAlert(
        `${isInRange ? "success" : "warning"}`,
        `You clocked out at ${moment().format("LT")}`
      );
      refetchAttendance();
    }

    if (clockOutMutation.error) {
      showAlert(
        "warning",
        customError(clockOutMutation.error)?.response?.data?.message ??
          "Oops! Something went wrong"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockOutMutation.data, clockOutMutation.error]);

  const assertClockinStartTime =
    latestServiceData?.data === undefined
      ? true
      : !!latestServiceData?.data !== undefined &&
        moment().diff(moment(latestServiceData?.data?.clockInStartTime)) > 0;
  const disabled =
    isLatestServiceError ||
    latestServiceLoading ||
    clockedOut ||
    latestAttendanceLoading;
  const clockedIn = latestAttendanceData?.data?.length
    ? (!!clockInMutation.data?.data?.clockIn ||
        !!latestAttendanceData?.data?.[0].clockIn) &&
      latestServiceData?.data
    : false && !!latestServiceData?.data; // Truthiness should only be resolved from latest Attendance clock in record
  const canClockIn = isInRange && assertClockinStartTime && !clockedIn;
  const canClockOut =
    latestAttendanceData?.data?.length &&
    latestAttendanceData?.data[0].clockIn &&
    !latestAttendanceData?.data[0].clockOut &&
    isInRange;

  useEffect(() => {
    if (latestAttendanceData?.data && !latestAttendanceData?.data[0]?.clockIn) {
      setClockedOut(false);
    }
  }, [latestAttendanceData?.data]);

  const handleVerifyBeforeClockout = () => {
    if (canClockOut) {
      verifyRangeBeforeAction(
        () => {
          handleClockOut();
          setOpenClockOutConfirmation(false);
        },
        () => showAlert("warning", "You are not within range of any campus!")
      );
      return;
    }
  };

  const handlePress = async () => {
    console.log("here");
    if (!assertClockinStartTime) {
      showAlert(
        "info",
        `Clock in for this ${latestServiceData?.data?.CGWCId ? "session" : "service"} has not yet started. Kindly try again by ${moment(latestServiceData?.data?.clockInStartTime).format("LT")}.`
      );
      return;
    }
    // refreshLocation();

    if (!isInRange) {
      showAlert("warning", "You are not within range of any campus!");
      return;
    }

    if (canClockIn) {
      return handleClockIn();
    }

    if (canClockOut && latestAttendanceData) {
      setOpenClockOutConfirmation(true);
      // Alert.alert("Confirm clock out", "Are you sure you want to clock out now?", [
      //   {
      //     text: "No",
      //     style: "destructive"
      //   },
      //   {
      //     text: "Yes",
      //     style: "default",
      //     onPress: handleVerifyBeforeClockout
      //   }
      // ]);
      return;
    }
  };

  return (
    <>
      <div className="relative" onClick={handlePress}>
        {canClockIn && (
          <Lottie
            animationData={animationData}
            // resizeMode="cover"
            style={{
              left: -40,
              top: -40,
              position: "absolute",
              width: 320,
              // zIndex: 0
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
                      <span className="font-light text-md text-white select-none">
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
        onConfirmationClick={handleVerifyBeforeClockout}
        title="Confirm clock out"
        description="Are you sure you want to clock out now?"
      ></ConfirmationModal>
    </>
  );
};

export default ClockButton;
