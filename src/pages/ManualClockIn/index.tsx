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
import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import ClockButton from "./ClockButton";
import { sortArrayByKeyAscending } from "@/utils";
import SearchCampusUsers from "@/pages/ManualClockIn/SearchCampusUsers";

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
    },
  );

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: usersIsFetching,
  } = useGetUsers(
    { departmentId: useWatch({ control, name: "departmentId" }) },
    {
      enabled: useWatch({ control, name: "departmentId" }) !== undefined,
    },
  );

  const { data: usersByCampus, isLoading: usersByCampusLoading } = useGetUsers(
    { campusId: useWatch({ control, name: "campusId" }) },
    {
      enabled: useWatch({ control, name: "campusId" }) !== undefined,
    },
  );

  const usersByCampusMap = useMemo(() => {
    const map = new Map<string, User>();
    if (!usersByCampus?.data) return map;

    for (const user of usersByCampus.data) {
      map.set(user._id, user);
    }
    return map;
  }, [usersByCampus?.data]);

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
    // the selected user may only exist in the campus list, e.g. when they were
    // picked through SearchCampusUsers and this department's list omits them
    setThirdPartyUserId(
      users?.data?.find((user) => user._id === e) ?? usersByCampusMap.get(e),
    );
  };

  const onSelectCampusUser = (userId: string, departmentId: string) => {
    form.setValue("departmentId", departmentId);
    form.setValue("userId", userId);
    setThirdPartyUserId(usersByCampusMap.get(userId));
  };

  const campusList = useMemo(
    () =>
      campuses?.data?.map((campus) => ({
        label: campus.campusName,
        value: campus._id,
      })) || ([] as Option[]),
    [campuses?.data],
  );

  const departmentList = useMemo(
    () =>
      departments?.data?.map((department) => ({
        label: department.departmentName,
        value: department._id,
      })) || ([] as Option[]),
    [departments?.data],
  );

  const usersByDepartmentList = useMemo(() => {
    const list =
      sortArrayByKeyAscending(users?.data, "firstName")?.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id,
      })) || ([] as Option[]);

    // a user picked through SearchCampusUsers skips the department step, so
    // this list may still be loading (or may not contain them at all) by the
    // time userId is set — keep an option around for them either way
    if (
      thirdPartyUser &&
      !list.some((item) => item.value === thirdPartyUser._id)
    )
      list.unshift({
        label: `${thirdPartyUser.firstName} ${thirdPartyUser.lastName}`,
        value: thirdPartyUser._id,
      });

    return list;
  }, [users?.data, thirdPartyUser]);

  // useEffect(() => {
  //   if (!campuses?.data) return;
  //   form.setValue("campusId", campuses?.data[0]?._id);
  //   form.resetField("departmentId");
  //   form.resetField("userId");
  //   setThirdPartyUserId(undefined);
  // }, [campuses?.data]);

  return (
    <>
      <SearchCampusUsers
        disabled={!usersByCampus?.data?.length}
        usersByCampus={usersByCampus?.data || []}
        onSelectCampusUser={onSelectCampusUser}
        isLoading={usersByCampusLoading}
      />
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
            options={campusList}
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
            options={departmentList}
            isLoading={departmentsLoading || departmentsIsFetching}
            error={formState.errors.departmentId}
            disabled={!useWatch({ control, name: "campusId" })}
          />

          <SelectInput
            name="userId"
            placeholder="Select a user"
            label="User"
            required
            control={control}
            onChange={onChangeUser}
            options={usersByDepartmentList}
            isLoading={usersLoading || usersIsFetching}
            error={formState.errors.userId}
            selectedLabel={
              thirdPartyUser
                ? `${thirdPartyUser.firstName} ${thirdPartyUser.lastName}`
                : undefined
            }
            disabled={!useWatch({ control, name: "campusId" })}
          />

          <div className="flex flex-col items-center mt-10 h-fit w-full">
            <ClockButton
              isInRangeProp={isInRange}
              campusId={useWatch({ control, name: "campusId" }) as string}
              deviceCoordinates={deviceCoordinates}
              departmentId={
                useWatch({ control, name: "departmentId" }) as string
              }
              userId={thirdPartyUser?._id as string}
              roleId={thirdPartyUser?.roleId as string}
              campusCoordinates={campusCoordinates as Coordinates}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default ManualClockIn;
