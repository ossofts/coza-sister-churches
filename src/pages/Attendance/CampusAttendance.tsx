import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import EmptyData from "@/components/EmptyData";
import { OptionsType } from "@/components/Inputs/SelectInput";
import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import SelectComponent from "@/components/SelectComponent";
import useRole from "@/hooks/useRoles";
import { useGetAttendance } from "@/services/attendance";
import { useGetServices } from "@/services/service";
import { Attendance, Service } from "@/store/types";
import { sortByDate } from "@/utils";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

const CampusAttendance = () => {
  const { user } = useRole();
  // const [page, setPage] = React.useState<number>(1);

  const columns: TableColumn<Attendance>[] = [
    {
      title: "Name",
      field: "user",
      renderType: {
        name: (data) => ({
          firstName: data.user?.firstName,
          lastName: data.user?.lastName,
          pictureUrl: "",
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
    {
      title: "Dept",
      width: 50,
      field: "departmentName",
      render: (data) => data?.departmentName,
    },
  ];

  const {
    data: services,
    // isLoading: serviceIsLoading,
    isSuccess: servicesIsSuccess,
  } = useGetServices({});

  const [serviceId, setServiceId] = useState<Service["_id"]>();

  const setService = (value: Service["_id"]) => {
    setServiceId(value);
  };

  const filteredServices = useMemo<Service[] | undefined>(
    () =>
      services?.data &&
      services?.data.filter(
        (service) => moment().unix() > moment(service.clockInStartTime).unix()
      ),
    [services, servicesIsSuccess]
  );

  const sortedServices = useMemo<Service[] | undefined>(
    () => filteredServices && sortByDate(filteredServices, "serviceTime"),
    [filteredServices]
  );

  useEffect(() => {
    if (sortedServices) {
      setServiceId(sortedServices[0]?._id);
    }
  }, [sortedServices]);

  const {
    data,
    // refetch,
    isLoading,
    // isSuccess,
    isFetching,
  } = useGetAttendance(
    {
      // page,
      // limit: 20,
      serviceId: serviceId,
      campusId: user?.campus?._id,
    },
    {
      enabled: serviceId !== undefined,
      refetchOnMount: true,
    }
  );

  // const handleRefetch = () => {
  //   refetch();
  // };

  if (isLoading || isFetching) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex justify-center my-3">
        <SelectComponent
          label="Services"
          placeholder="Select a service"
          onChange={setService}
          options={
            sortedServices?.map((service) => ({
              ...service,
              value: service._id,
              label: `${service.name} - ${moment(service.clockInStartTime).format("Do MMM YYYY")}`,
            })) as OptionsType[]
          }
        />
      </div>

      <ReactIf
        condition={!!data?.data?.length}
        component={
          <DataTable
            columns={columns}
            isLoading={false}
            data={data?.data as Attendance[]}
          />
        }
        fallback={<EmptyData />}
      />
    </div>
  );
};

export default CampusAttendance;
