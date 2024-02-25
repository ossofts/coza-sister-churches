import { CountUp } from "use-count-up";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import { Spinner } from "@/components/Loaders";
import { IoPeopleOutline } from "react-icons/io5";
import { COLORS } from "@/theme/colors";

export type TeamAttendanceSummary = {
  departmentUsers?: number;
  attendance?: number;
  tickets?: number;
  isLoading?: boolean;
};

const TeamAttendanceSummary = (props: TeamAttendanceSummary) => {
  const { departmentUsers, attendance, isLoading } = props;
  const { goto } = useNavigation();

  const handlePress = () => {
    goto(ROUTES.ATTENDANCE.path);
  };

  return (
    <div className="flex justify-center">
      {isLoading ? (
        <Spinner />
      ) : (
        <div onClick={handlePress}>
          <div className="flex items-baseline">
            <div className="flex items-center">
              <IoPeopleOutline color={COLORS.primaryLight} size={18} />
              <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Members clocked in:
              </p>
            </div>

            <div className="flex items-baseline">
              <p className="font-semibold text-brandColor-500 text-3xl ml-1">
                <CountUp isCounting duration={2} end={attendance || 0} />
              </p>
              <p className="ml-2 text-md text-gray-600 dark:text-gray-400 font-semibold">
                /<CountUp isCounting duration={2} end={departmentUsers || 0} />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAttendanceSummary;
