import moment from "moment";
import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import { timeDifference } from "@/utils";
import { BsHourglassSplit } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { COLORS } from "@/theme/colors";
import useAppContext from "@/contexts/AppContext";

const ClockStatistics = () => {
   
  const {
    lastestAttendance: { data: latestAttendanceData }
  } = useAppContext();
  return (
    <div className="grid grid-cols-3 w-full">
      <Stat
        time={latestAttendanceData?.data?.length ? latestAttendanceData?.data[0]?.clockIn : ""}
        icon={FiCheckCircle}
        label="Clock in"
      />
      <Stat
        time={latestAttendanceData?.data?.length ? latestAttendanceData?.data[0]?.clockOut : ""}
        label="Clock out"
        icon={AiOutlineLogout}
      />
      <Stat
        difference={
          timeDifference(
            latestAttendanceData?.data?.length
              ? latestAttendanceData?.data[0]?.clockOut
              : ("" as string),
            latestAttendanceData?.data?.length
              ? latestAttendanceData?.data[0]?.clockIn
              : ("" as string)
          ).hrsMins
        }
        label="Time spent"
        icon={BsHourglassSplit}
      />
    </div>
  );
};

export default ClockStatistics;

type StatProps = {
  time?: string;
  label: string;
  icon: IconType;
  difference?: number | string;
};

const Stat = ({ time, label, icon, difference }: StatProps) => {
  return (
    <div className="flex flex-col items-center">
      {React.createElement(icon, {
        size: 25,
        color:
          label === "Clock out"
            ? COLORS.rose
            : label === "Service hrs"
              ? COLORS.gray
              : COLORS.primaryLight
      })}

      {difference ? (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
          {difference ? difference : "--:--"}
        </p>
      ) : (
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
          {time ? moment(time).format("LT") : "--:--"}
        </p>
      )}
      <p className="text-[10px] text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
};
