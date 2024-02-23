import React from "react";
import { CountUp } from "use-count-up";
// import { IoPeopleOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { COLORS } from "@/theme/colors";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";

export interface ITeamAttendanceSummary {
  leadersAttendance?: number;
  workersAttendance?: number;
  workerUsers?: number;
  leaderUsers?: number;
  isLoading?: boolean;
}

export const CampusAttendanceSummary: React.FC<ITeamAttendanceSummary> = (props) => {
  const {
    // leaderUsers, leadersAttendance,
    workerUsers,
    workersAttendance
  } = props;
  const { goto } = useNavigation();

  const gotoAttendancePage = () => goto(ROUTES.ATTENDANCE.path);

  //   const handleNavigation = (role: ROLES[] | ROLES) => () => {
  //     return navigate("Attendance", { role });
  //   };

  return (
    <div className="flex justify-center mb-3">
      <div className="flex justify-center items-center gap-10">
        {/* <button onClick={gotoAttendancePage}>
          <span className="flex flex-col items-center">
            <span className="flex items-baseline">
              <p className="font-semibold text-brandColor-600 text-3xl ml-1">
                <CountUp isCounting duration={2} end={leadersAttendance || 7} />
              </p>
              <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">{`/${leaderUsers || 10}`}</p>
            </span>
            <span className="flex items-center">
              <IoPeopleOutline color={COLORS.primary} size={18} />
              <p className=" text-gray-600 dark:text-gray-400 text-sm ml-2">Leaders present</p>
            </span>
          </span>
        </button> */}
        <button onClick={gotoAttendancePage}>
          <span className="flex flex-col items-center">
            <span className="flex items-baseline">
              <p className="font-semibold text-brandColor-600 text-3xl ml-1">
                <CountUp isCounting duration={2} end={workersAttendance ?? 0} />
              </p>
              <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">{`/${workerUsers ?? 0}`}</p>
            </span>
            <span className="flex items-center">
              <FaPeopleGroup color={COLORS.primary} size={18} />
              <p className=" text-gray-600 dark:text-gray-400 text-sm ml-2">Workers present</p>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};
