import SelectInput from "@/components/Inputs/SelectInput";
import { Form } from "@/components/ui/form";
import { useGetUsers } from "@/services/account";
import { useGetCampuses } from "@/services/campus";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { User } from "@/store/types";
import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import SelectInputWithSearch from "@/components/Inputs/SelectInputWithSearch";
import { assertCGWCActive, sortArrayByKeyAscending } from "@/utils";
import MyAttendance from "./Attendance";
import { useGetCGWCs } from "@/services/cgwc";
import { useGetServices } from "@/services/service";

type Option = {
  label: string;
  value: string;
};

const AttendanceConfirmation = () => {
  const [thirdPartyUser, setThirdPartyUserId] = React.useState<User>();
  const [CGWCId, setCGWCId] = React.useState("");

  const form = useForm<{
    campusId: string;
    departmentId: string;
    userId: string;
    cgwcId: string;
  }>({
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

  const { data: sessions } = useGetServices(
    {
      CGWCId,
      page: 1,
      limit: 30,
    },
    {
      enabled: CGWCId !== "",
    }
  );

  const { data: CGWCList, isLoading: CGWCLoading } = useGetCGWCs({});

  const activeCGWCs = useMemo(() => {
    if (CGWCList?.data) {
      const activeList = CGWCList?.data?.filter((cgwc) =>
        assertCGWCActive(cgwc)
      );
      return activeList;
    }
    return [];
  }, [CGWCList?.data]);

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
  const onChangeCgwc = (e: string) => {
    setCGWCId(e);
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

        <SelectInput
          name="cgwcId"
          placeholder="Select CGWC"
          label="CGWC"
          required
          control={control}
          onChange={onChangeCgwc}
          options={
            activeCGWCs?.map((item) => ({
              label: item.name,
              value: item._id,
            })) as Option[]
          }
          isLoading={CGWCLoading}
          error={formState.errors.cgwcId}
        />

        {thirdPartyUser && CGWCId !== "" ? (
          <div className="mt-7 w-full">
            <MyAttendance
              title={
                <>
                  Attendance for{" "}
                  <span className="text-brandColor-600 dark:text-brandColor-400">{`${thirdPartyUser?.firstName} ${thirdPartyUser?.lastName}`}</span>{" "}
                </>
              }
              userId={thirdPartyUser?._id}
              CGWCId={CGWCId}
              sessions={sessions?.data ?? []}
            />
          </div>
        ) : null}
      </form>
    </Form>
  );
};

export default AttendanceConfirmation;
