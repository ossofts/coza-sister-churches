import { PrimaryButton } from "@/components/Buttons";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import SelectInput from "@/components/Inputs/SelectInput";
import { Form } from "@/components/ui/form";
import useRole from "@/hooks/useRoles";
import { useGetAttendanceReportForDownload } from "@/services/attendance";
// import { useGetCampuses } from "@/services/campus";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { useGetServices } from "@/services/service";
import { useGetTicketsReportForDownload } from "@/services/tickets";
import { ReportDownloadPayload } from "@/store/types";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ExportSchema } from "./validation";
import { Spinner } from "@/components/Loaders";
import { CSVLink } from "react-csv";
import { attendanceHeaders, ticketsHeaders } from "./utils";
import ReactIf from "@/components/ReactIf";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import showAlert from "@/hooks/useAlert";

export type ExportType = "attendance" | "tickets";

export enum ReportTypes {
  TICKETS = "tickets",
  ATTENDANCE = "attendance",
  PERMISSIONS = "permissions",
}
export type FormInputs = {
  dataType: string;
  service: string;
  startDate?: Date | string;
  endDate?: Date | string;
  department?: string;
};

const ExportData = () => {
  const {
    // isCampusPastor, isQC,
    user,
  } = useRole();
  // const cannotSwitchCampus = isCampusPastor || isQC;

  // const [campusId, setCampusId] = useState(
  //   cannotSwitchCampus ? user?.campus?._id : ("" as string)
  // );
  const [departmentId, setDepartmentId] = useState<string>();
  const [serviceId, setServiceId] = useState<string>("all-services");
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [dataType, setDataType] = useState<ExportType>();
  const [startDate, setStartDate] =
    useState<ReportDownloadPayload["startDate"]>();
  const [endDate, setEndDate] = useState<ReportDownloadPayload["endDate"]>();

  const {
    data: campusDepartments,
    // refetch: refetchDepartments,
    // isFetching: isFetchingDepartments,
    // isLoading: campusDepartmentsLoading,
  } = useGetDepartmentsByCampusId(String(user?.campus?._id), {
    enabled: user?.campus?._id !== undefined,
  });

  // const {
  //   data: allCampuses,
  //   refetch: refetchAllCampuses,
  //   isFetching: isFetchingAllCampuses,
  //   isLoading: allCampusesLoading,
  // } = useGetCampuses();

  const {
    data: services,
    // refetch: refetchServices,
    // isLoading: servicesLoading,
  } = useGetServices({});

  const pastServices = useMemo(
    () =>
      services?.data?.filter(
        (service) => moment(service.clockInStartTime).unix() < moment().unix()
      ),
    [services]
  );

  const {
    data: attendance,
    isSuccess: attendanceIsSuccess,
    isLoading: attendanceIsLoading,
    isFetching: attendanceIsFetching,
  } = useGetAttendanceReportForDownload(
    {
      endDate,
      startDate,
      campusId: user?.campus?._id,
      serviceId,
      departmentId,
    },
    { enabled: triggerFetch && dataType === "attendance" }
  );
  // const {
  //   data: permissions,
  //   isSuccess: permissionsIsSuccess,
  //   isLoading: permissionsIsLoading,
  //   isFetching: permissionIsFetching,
  // } = useGetPermissionsReportForDownloadQuery(
  //   {
  //     endDate,
  //     campusId,
  //     startDate,
  //     departmentId,
  //   },
  //   { skip: !triggerFetch, refetchOnMountOrArgChange: true }
  // );
  const {
    data: tickets,
    isSuccess: ticketsIsSuccess,
    isLoading: ticketsIsLoading,
    isFetching: ticketsIsFetching,
  } = useGetTicketsReportForDownload(
    {
      endDate,
      startDate,
      campusId: user?.campus?._id,
      serviceId,
      departmentId,
    },
    { enabled: triggerFetch && dataType === "tickets" }
  );

  const form = useForm<FormInputs>({
    resolver: ExportSchema,
  });
  const { handleSubmit, control, formState } = form;

  const onSubmit = () => {
    handlePress();
  };

  const handleDataType = (value: ExportType) => {
    setDataType(value);
  };

  // const handleCampus = (value: string) => {
  //   setCampusId(value);
  // };

  const handleDepartment = (value: string) => {
    setDepartmentId(value);
  };

  const handleService = (value: string) => {
    setServiceId(value);
  };

  const handlePress = () => {
    if (!triggerFetch) {
      return setTriggerFetch(true);
    }
    if (readyForDownload && triggerFetch) {
      handleDownload();
    }
  };

  const handleDownload = () => {
    setTriggerFetch(false);
  };

  const reportData = {
    tickets: tickets?.data,
    // permissions,
    attendance: attendance?.data,
  };

  const isLoading =
    ticketsIsLoading ||
    ticketsIsFetching ||
    attendanceIsLoading ||
    attendanceIsFetching;
  // permissionsIsLoading ||
  // permissionIsFetching;

  const dataTypes = [
    {
      name: "Attendance",
      value: ReportTypes.ATTENDANCE,
    },
    {
      name: "Tickets",
      value: ReportTypes.TICKETS,
    },
    // {
    //   name: "Permissions",
    //   value: ReportTypes.PERMISSIONS,
    // },
  ];

  const readyForDownload = attendanceIsSuccess || ticketsIsSuccess;
  // const isPermission = dataType === "permissions";

  const handleStartDate = (value?: Date | string) => {
    setStartDate(moment(value).unix());
  };

  const handleEndDate = (value?: Date | string) => {
    setEndDate(moment(value).unix());
  };

  useEffect(() => {
    if (attendance?.data) {
      setTriggerFetch(false);
    }
    if (attendance?.data && attendance?.data?.length < 1) {
      showAlert(
        "warning",
        "The data you fetched is empty. There are no records in the file.",
        {
          seconds: 10,
        }
      );
    }
  }, [attendance?.data]);
  return (
    <div className="pt-4">
      <div className="flex flex-col gap-5 w-full items-start px-4">
        <div className="w-full flex items-center">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex-col flex gap-3"
            >
              <SelectInput
                control={control}
                name="dataType"
                label="Data Type"
                options={dataTypes?.map((item) => ({
                  label: item.name,
                  value: item.value,
                }))}
                onChange={handleDataType as (value: string) => void}
                placeholder="Choose data type"
                required
                error={formState.errors.dataType}
              />
              <SelectInput
                control={control}
                name="service"
                label="Service"
                options={
                  pastServices?.map((item) => ({
                    label: `${item.name} - ${item.serviceTime ? moment(item.serviceTime).format("DD-MM-YYYY") : ""}`,
                    value: item._id,
                  })) as { label: string; value: string }[]
                }
                onChange={handleService as (value: string) => void}
                placeholder="Choose data type"
                required
                error={formState.errors.service}
              />

              <div className="flex justify-between">
                <DatePickerInput
                  control={control}
                  label="Start date"
                  name="startDate"
                  onChange={handleStartDate}
                  error={formState.errors.startDate}
                />

                <DatePickerInput
                  control={control}
                  label="End date"
                  name="endDate"
                  onChange={handleEndDate}
                  error={formState.errors.endDate}
                />
              </div>
              <SelectInput
                control={control}
                name="department"
                label="Department"
                options={
                  campusDepartments?.data?.map((item) => ({
                    label: item.departmentName,
                    value: item._id,
                  })) as { label: string; value: string }[]
                }
                onChange={handleDepartment as (value: string) => void}
                placeholder="Choose department"
                error={formState.errors.department}
              />

              <div className="flex mt-5 gap-1">
                <ReactIf
                  condition={
                    !isLoading &&
                    !!dataType &&
                    reportData[dataType] !== undefined
                  }
                  component={
                    <span className="font-normal text-green-600 dark:text-green-500">
                      <IoIosCheckmarkCircleOutline size={15} />
                    </span>
                  }
                  fallback={
                    <span className="font-normal text-red-600 dark:text-red-500">
                      <IoIosCloseCircleOutline size={15} />
                    </span>
                  }
                />

                <ReactIf
                  condition={
                    !isLoading &&
                    !!dataType &&
                    reportData[dataType] !== undefined
                  }
                  component={
                    <span className="font-normal text-xs text-green-600 dark:text-green-500">
                      Data fetched and ready for download
                    </span>
                  }
                  fallback={
                    <span className="font-normal text-xs text-red-600 dark:text-red-500">
                      No data has been fetched yet. Fetch data for download.
                    </span>
                  }
                />
              </div>
              <PrimaryButton
                disabled={isLoading}
                type="submit"
                className="mt-1"
              >
                {isLoading ? (
                  <Spinner color="white" />
                ) : dataType && reportData[dataType] !== undefined ? (
                  <CSVLink
                    headers={
                      dataType === "attendance"
                        ? attendanceHeaders
                        : ticketsHeaders
                    }
                    data={(reportData[dataType] as any[]) ?? []}
                    filename={`${dataType}.csv`}
                    className=""
                    target="_blank"
                  >
                    Download File
                  </CSVLink>
                ) : (
                  "Fetch Data"
                )}
              </PrimaryButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
