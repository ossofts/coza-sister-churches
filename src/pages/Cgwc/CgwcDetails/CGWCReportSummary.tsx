import { Spinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import SelectComponent from "@/components/SelectComponent";
import useNavigation from "@/hooks/useNavigation";
import useRole from "@/hooks/useRoles";
import ROUTES from "@/routes";
import {
  useGetDepartmentCGWCAttendanceReport,
  useGetWorkersCGWCAttendanceReport,
} from "@/services/attendance";
import { Service } from "@/store/types";
import { COLORS } from "@/theme/colors";
import moment from "moment";
import { useEffect, useState } from "react";
import { IoPeopleOutline } from "react-icons/io5";
import { LuTicket } from "react-icons/lu";
import { CountUp } from "use-count-up";

type Props = {
  latestService?: Service;
  title: string;
  sessions: Service[];
  CGWCId: string;
};

const CGWCReportSummary = ({ title, sessions, CGWCId }: Props) => {
  const {
    isHOD,
    isSuperAdmin,
    user: { department, campus },
  } = useRole();
  const [serviceId, setServiceId] = useState<Service["_id"]>();

  const setService = (value: Service["_id"]) => {
    setServiceId(value);
  };

  const { data: attendanceReport, isLoading: attendanceReportLoading } =
    useGetDepartmentCGWCAttendanceReport(
      {
        CGWCId,
        isCGWC: true,
        departmentId: department?._id as string,
        serviceId: serviceId as string,
      },
      { enabled: isHOD && serviceId !== undefined, refetchOnMount: true }
    );

  const { data: workersAttendance, isLoading: workersAttendanceLoading } =
    useGetWorkersCGWCAttendanceReport(
      {
        CGWCId,
        isCGWC: true,
        campusId: campus?._id as string,
        serviceId: serviceId as string,
      },
      { enabled: isSuperAdmin && serviceId !== undefined, refetchOnMount: true }
    );

  const navigation = useNavigation();

  const goToAttendance = () => {
    navigation.goto(ROUTES.ATTENDANCE.path);
  };

  // const goToTickets = () => {
  //   // navigation.goto("Tickets" as never);
  // };

  useEffect(() => {
    if (sessions?.length) {
      return setServiceId(sessions[0]?._id);
    }
  }, [sessions]);
  return (
    <div className="w-full pb-8">
      <div className="px-2 flex justify-around items-baseline pt-6">
        <p className="text-center text-md font-bold pt-3 pb-4">{title}</p>
        <SelectComponent
          selectItemClass="text-xs"
          triggerExtraClass="dark:bg-neutral-700"
          onChange={setService}
          placeholder="Select Service"
          options={sessions?.map((session) => ({
            label: `${session?.name} - ${moment(session?.serviceTime)}.format("Do MMM YYYY")}`,
            value: session?._id,
          }))}
        />
      </div>
      <div className="py-6 flex  px-3">
        <div className="px-0 flex items-center justify-around gap-5 w-full">
          <ReactIf
            condition={isSuperAdmin}
            component={
              <ReactIf
                condition={!workersAttendanceLoading}
                fallback={<Spinner />}
                component={
                  <div onClick={goToAttendance} style={{ width: "50%" }}>
                    <div className="w-full flex flex-col items-center">
                      <div className="flex items-baseline">
                        <p className="font-semibold text-brandColor-500 text-3xl ml-1">
                          <CountUp
                            isCounting
                            duration={2}
                            end={workersAttendance?.data?.attendance || 0}
                          />
                        </p>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          /
                          <CountUp
                            isCounting
                            duration={2}
                            end={workersAttendance?.data?.workerUsers || 0}
                          />
                        </p>
                      </div>
                      <div className="flex items-center">
                        <IoPeopleOutline
                          color={COLORS.primaryLight}
                          name="people-outline"
                          size={18}
                        />
                        <p className="ml-2 text-md text-gray-600 dark:text-gray-400">
                          Workers
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            }
          />

          <ReactIf
            condition={isHOD}
            component={
              <ReactIf
                condition={!attendanceReportLoading}
                fallback={<Spinner />}
                component={
                  <div className="w-[50%]" onClick={goToAttendance}>
                    <div className="flex flex-col items-center mx-auto justify-center w-full">
                      <div className="flex items-baseline w-fit sm:w-auto">
                        <p className="font-semibold text-brandColor-500 text-3xl ml-1">
                          <CountUp
                            isCounting
                            duration={2}
                            end={attendanceReport?.data?.attendance || 0}
                          />
                        </p>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          /
                          <CountUp
                            isCounting
                            duration={2}
                            end={attendanceReport?.data?.departmentUsers || 0}
                          />
                        </p>
                      </div>
                      <div className="flex items-center">
                        <IoPeopleOutline
                          color={COLORS.primaryLight}
                          name="people-outline"
                          size={18}
                        />
                        <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Members clocked in
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            }
          />

          <ReactIf
            condition={!attendanceReportLoading}
            fallback={<Spinner />}
            component={
              <div className="w-auto">
                <div
                // onClick={goToTickets}
                >
                  <div className="flex flex-col items-center mx-auto w-[180px]">
                    <p className="text-3xl font-semibold text-gray-400 ml-1">
                      <CountUp
                        isCounting
                        duration={2}
                        end={attendanceReport?.data?.tickets || 0}
                      />
                    </p>
                    <div className="flex items-center">
                      <LuTicket color={COLORS.rose} size={18} />
                      <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Tickets
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CGWCReportSummary;
