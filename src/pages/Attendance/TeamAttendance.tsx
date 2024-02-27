import { TableColumn } from "@/components/DataTable/types";
import { TeamAttendance } from "./types";
// import { teamAttendanceData } from "./utils";
import DataTable from "@/components/DataTable";
import SelectComponent from "@/components/SelectComponent";
import { useGetServices } from "@/services/service";
import { useEffect, useMemo, useState } from "react";
import { Attendance, Service } from "@/store/types";
import moment from "moment";
import { mergeDuplicatesByKey, sortByDate } from "@/utils";
import useUserStore from "@/store/userStore";
import { useGetAttendance } from "@/services/attendance";
import { useGetUsersByDepartmentId } from "@/services/account";
import ReactIf from "@/components/ReactIf";
import EmptyData from "@/components/EmptyData";
import { FullPageSpinner } from "@/components/Loaders";

type Options = {
  label: string;
  value: string;
};

const TeamAttendance = () => {
  const columns: TableColumn<TeamAttendance>[] = [
    {
      title: "Name",
      field: "firstName",
      renderType: {
        name: (data) => ({
          firstName: data.firstName,
          lastName: data.lastName,
          pictureUrl: data?.pictureUrl,
        }),
      },
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
    // {
    //   title: "Score",
    //   field: "score",
    //   renderType: {
    //     score: (data) => data.score,
    //   },
    // },
  ];

  const user = useUserStore((state) => state.user);
  const { data: services } = useGetServices();

  const [serviceId, setServiceId] = useState<Service["_id"]>();

  const setService = (value: Service["_id"]) => {
    setServiceId(value);
  };

  const filteredServices = useMemo<Service[] | undefined>(
    () =>
      services?.data &&
      services?.data?.filter(
        (service) => moment().unix() > moment(service.clockInStartTime).unix()
      ),
    [services?.data]
  );

  const sortedServices = useMemo<Service[] | undefined>(
    () => filteredServices && sortByDate(filteredServices, "serviceTime"),
    [filteredServices]
  );

  useEffect(() => {
    sortedServices && setServiceId(sortedServices[0]._id);
  }, [sortedServices]);

  const { data: membersClockedIn } = useGetAttendance({
    serviceId: serviceId,
    departmentId: user?.department?._id,
  });

  const { data: members, isLoading } = useGetUsersByDepartmentId(
    user!.department?._id
  );

  const allMembers = useMemo(() => {
    if (!members?.data?.length) return [];

    return members?.data?.map((member) => {
      return {
        ...member,
        userId: member._id,
      };
    });
  }, [members?.data]);

  const membersClockedInValid = useMemo(() => {
    if (!membersClockedIn?.data?.length) return [];

    return membersClockedIn?.data?.map((member) => {
      return {
        ...member,
        userId: member?.user?._id,
      };
    });
  }, [membersClockedIn?.data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedUsers = [...membersClockedInValid, ...allMembers] as any;

  const mergedAttendanceWithMemberList = useMemo(
    () => mergeDuplicatesByKey<Attendance>(mergedUsers, "userId"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [membersClockedIn, mergedUsers]
  );

  // const data = teamAttendanceData?.sort((a, b) => {
  //   if (a.clockIn > b.clockIn) return 1;
  //   else if (a.clockIn < b.clockIn) return -1;
  //   else return 0;
  // });
  if (isLoading) return <FullPageSpinner />;
  return (
    <div>
      <div className="flex justify-center my-3">
        <SelectComponent
          label="Services"
          placeholder="Select a service"
          onChange={setService}
          triggerExtraClass="w-full py-3 text-center dark:bg-neutral-800 mx-3"
          options={
            sortedServices?.map((service) => ({
              ...service,
              value: service._id,
              label: `${service.name} - ${moment(service.clockInStartTime).format("Do MMM YYYY")}`,
            })) as Options[]
          }
        />
      </div>

      <ReactIf
        condition={!!mergedAttendanceWithMemberList?.length}
        component={
          <DataTable
            columns={columns}
            isLoading={false}
            data={mergedAttendanceWithMemberList}
          />
        }
        fallback={<EmptyData />}
      />
    </div>
  );
};

export default TeamAttendance;
