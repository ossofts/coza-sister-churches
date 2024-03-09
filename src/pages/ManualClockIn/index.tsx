import SelectInput from "@/components/Inputs/SelectInput";
import { Form } from "@/components/ui/form";
import useGeolocation from "@/hooks/useGeolocation";
import { useGetUsers } from "@/services/account";
import { useGetCampusById, useGetCampuses } from "@/services/campus";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { useGetLatestService } from "@/services/service";
import { ClockInPayload, User } from "@/store/types";
import useUserStore from "@/store/userStore";
import { Coordinates } from "@/types/global.type";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import ClockButton from "./ClockButton";
import SelectInputWithSearch from "@/components/Inputs/SelectInputWithSearch";
import { sortArrayByKeyAscending } from "@/utils";

type Option = {
  label: string;
  value: string;
};

const ManualClockIn = () => {
  // const [campusId, setCampusId] = React.useState<string>();
  // const [departmentId, setDepartmentId] = React.useState<string>();
  const [thirdPartyUser, setThirdPartyUserId] = React.useState<User>();

  const user = useUserStore((state) => state.user);
  const campus = user!.campus;

  const form = useForm<ClockInPayload>({
    // resolver: updateAccountSchema,
  });
  const { handleSubmit, control, formState } = form;

  const {
    data: campuses,
    isLoading: campusLoading,
    isFetching: campusIsFetching,
  } = useGetCampuses();

  const {
    data: departments,
    isLoading: departmentsLoading,
    isFetching: departmentsIsFetching,
  } = useGetDepartmentsByCampusId(
    useWatch({ control, name: "campusId" }) as string,
    {
      enabled: useWatch({ control, name: "campusId" }) !== undefined,
    }
  );

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: usersIsFetching,
  } = useGetUsers(
    { departmentId: useWatch({ control, name: "departmentId" }) },
    {
      enabled: useWatch({ control, name: "departmentId" }) !== undefined,
    }
  );

  const {
    data: latestService,
    // refetch: latestServiceRefetch,
    // isFetching
  } = useGetLatestService(campus._id);

  const { data: campusData } = useGetCampusById(campus?._id);

  const selectCoordinateRef = React.useMemo(() => {
    if (latestService?.data?.isGlobalService)
      return latestService?.data?.coordinates;

    return campusData?.data?.coordinates;
  }, [latestService, campusData]);

  const campusCoordinates = {
    latitude: selectCoordinateRef?.lat,
    longitude: selectCoordinateRef?.long,
  };

  const { isInRange, deviceCoordinates } = useGeolocation({
    rangeToClockIn: latestService?.data?.rangeToClockIn as number,
    campusCoordinates: campusCoordinates as Coordinates,
  });

  const onSubmit = () => {};

  const onChangeCampus = () => {
    form.resetField("departmentId");
    form.resetField("userId");
    setThirdPartyUserId(undefined);
  };
  const onChangeDepartment = () => {
    form.resetField("userId");
    setThirdPartyUserId(undefined);
  };
  const onChangeUser = (e: string) => {
    setThirdPartyUserId(users?.data?.find((user) => user._id === e));
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 pt-5 px-3 pb-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SelectInput
          name="campusId"
          placeholder="Select a campus"
          label="Campus"
          required
          control={control}
          onChange={onChangeCampus}
          options={
            campuses?.data?.map((campus) => ({
              label: campus.campusName,
              value: campus._id,
            })) as Option[]
          }
          isLoading={campusLoading || campusIsFetching}
          error={formState.errors.campusId}
        />

        <SelectInput
          name="departmentId"
          placeholder="Select a department"
          label="Department"
          required
          control={control}
          onChange={onChangeDepartment}
          options={
            departments?.data?.map((department) => ({
              label: department.departmentName,
              value: department._id,
            })) as Option[]
          }
          isLoading={departmentsLoading || departmentsIsFetching}
          error={formState.errors.departmentId}
          disabled={!useWatch({ control, name: "campusId" })}
        />

        <SelectInputWithSearch
          name="userId"
          placeholder="Select a user"
          label="User"
          onChange={onChangeUser}
          required
          control={control}
          options={
            sortArrayByKeyAscending(users?.data, "firstName")?.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user._id,
            })) as Option[]
          }
          isLoading={usersLoading || usersIsFetching}
          error={formState.errors.userId}
          disabled={!useWatch({ control, name: "departmentId" })}
        />

        <div className="flex flex-col items-center mt-10 h-fit w-full">
          <ClockButton
            isInRangeProp={isInRange}
            campusId={useWatch({ control, name: "campusId" }) as string}
            deviceCoordinates={deviceCoordinates}
            departmentId={useWatch({ control, name: "campusId" }) as string}
            userId={thirdPartyUser?._id as string}
            roleId={thirdPartyUser?.roleId as string}
            campusCoordinates={campusCoordinates as Coordinates}
          />
        </div>
      </form>
    </Form>
  );
};

export default ManualClockIn;
