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
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import ClockButton from "./ClockButton";

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
    isFetching: campusIsFetching
  } = useGetCampuses();

  const {
    data: departments,
    isLoading: departmentsLoading,
    isFetching: departmentsIsFetching
  } = useGetDepartmentsByCampusId(useWatch({ control, name: "campusId" }) as string, {
    enabled: useWatch({ control, name: "campusId" }) !== undefined
  });

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: usersIsFetching
  } = useGetUsers(
    { departmentId: useWatch({ control, name: "departmentId" }) },
    {
      enabled: useWatch({ control, name: "departmentId" }) !== undefined
    }
  );

  const {
    data: latestService
    // refetch: latestServiceRefetch,
    // isFetching
  } = useGetLatestService(campus._id);

  const { data: campusData } = useGetCampusById(campus?._id);

  const selectCoordinateRef = React.useMemo(() => {
    if (latestService?.data?.isGlobalService) return latestService?.data?.coordinates;

    return campusData?.data?.coordinates;
  }, [latestService, campusData]);

  const campusCoordinates = {
    latitude: selectCoordinateRef?.lat,
    longitude: selectCoordinateRef?.long
  };

  const { isInRange, deviceCoordinates } = useGeolocation({
    rangeToClockIn: latestService?.data?.rangeToClockIn as number,
    campusCoordinates: campusCoordinates as Coordinates
  });

  // useWatch(({name: "campusId"}) => set)

  // const onCampusChange = (value: string) => {
  //   refresh();
  //   setCampusId(value);
  //   setDepartmentId(undefined);
  //   setThirdPartyUserId(undefined);
  //   // handleChange('campusId');
  // };

  // const onDepartmentChange = (value: string) => {
  //   refresh();
  //   setDepartmentId(value);
  //   setThirdPartyUserId(undefined);
  //   // handleChange('departmentId');
  // };

  // const onUserChange = (value: string) => {
  //   // refresh();
  //   setThirdPartyUserId(users?.data?.find((user) => user._id === value));
  // };

  const selectedUserId = useWatch({ control, name: "userId" });
  useEffect(() => {
    setThirdPartyUserId(users?.data?.find((user) => user._id === selectedUserId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2 pt-10 px-3" onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          name="campusId"
          placeholder="Select a campus"
          label="Campus"
          // onChange={onCampusChange}
          required
          control={control}
          options={
            campuses?.data?.map((campus) => ({
              label: campus.campusName,
              value: campus._id
            })) as Option[]
          }
          isLoading={campusLoading || campusIsFetching}
          error={formState.errors.campusId}
        />

        <SelectInput
          name="departmentId"
          placeholder="Select a department"
          label="Department"
          // onChange={onDepartmentChange}
          required
          control={control}
          options={
            departments?.data?.map((department) => ({
              label: department.departmentName,
              value: department._id
            })) as Option[]
          }
          isLoading={departmentsLoading || departmentsIsFetching}
          error={formState.errors.departmentId}
          disabled={!useWatch({ control, name: "campusId" })}
        />

        <SelectInput
          name="userId"
          placeholder="Select a user"
          label="User"
          // onChange={onUserChange}
          required
          control={control}
          options={
            users?.data?.map((user) => ({
              label: `${user.firstName} ${user.lastName}`,
              value: user._id
            })) as Option[]
          }
          isLoading={usersLoading || usersIsFetching}
          error={formState.errors.userId}
          disabled={!useWatch({ control, name: "departmentId" })}
        />

        <div className="flex flex-col items-center mt-10 h-72 w-full">
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
