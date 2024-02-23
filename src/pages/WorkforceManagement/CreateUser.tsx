import useRole from "@/hooks/useRoles";
import { useUploadUser } from "@/services/account";
import { useEffect, useMemo } from "react";
import showAlert from "@/hooks/useAlert";
import { useForm } from "react-hook-form";
import { customError } from "@/types/global.type";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { sortStringAscending } from "@/utils";
import { Department } from "@/store/types";
import SelectInput from "@/components/Inputs/SelectInput";
import { OptionsType } from "node_modules/embla-carousel-autoplay/esm/components/Options";
import { TextInputWithIcon } from "@/components/Inputs";
import { IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { PrimaryButton } from "@/components/Buttons";
import { FullPageSpinner, Spinner } from "@/components/Loaders";
import { Form } from "@/components/ui/form";
import { createUserSchema } from "./validation";
import { CreateUserInputs } from "./types";

const CreateUser = () => {
  const {
    user: { campus, userId },
    rolesPermittedToCreate
  } = useRole();

  const {
    data: campusDepartments,
    // refetch: refetchDepartments,
    isFetching: isFetchingDepartments,
    isLoading: campusDepartmentsLoading
  } = useGetDepartmentsByCampusId(campus?._id as string);

  const INITIAL_VALUES = {
    firstName: "",
    lastName: "",
    email: "",
    departmentId: "",
    roleId: "",
    campusId: campus?._id,
    registeredBy: userId,
    isRegistered: false
  } as CreateUserInputs;

  const form = useForm<CreateUserInputs>({
    resolver: createUserSchema,
    defaultValues: INITIAL_VALUES
  });
  const { register, handleSubmit, control, formState } = form;

  const mutation = useUploadUser();

  const onSubmit = (data: CreateUserInputs) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "User created successfully");
      form.reset();
    }
    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ?? "Oops! Something went wrong"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.data, mutation.error]);

  // const refresh = () => {
  //   refetchDepartments();
  //   // refetchRoles();
  // };

  const sortedCampusDepartments: Department[] = useMemo(
    () => sortStringAscending(campusDepartments?.data, "departmentName"),
    [campusDepartments]
  );

  if (isFetchingDepartments || campusDepartmentsLoading) return <FullPageSpinner />;
  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col gap-2 pt-10 px-5" onSubmit={handleSubmit(onSubmit)}>
          <SelectInput
            name="departmentId"
            placeholder="Select a department"
            label="Department"
            required
            control={control}
            options={sortedCampusDepartments?.map((department) => ({
              label: department?.departmentName,
              value: department?._id
            }))}
            error={formState.errors.departmentId}
          />
          <SelectInput
            name="roleId"
            placeholder="Select a role"
            label="Role"
            required
            control={control}
            options={
              rolesPermittedToCreate()?.map((role) => ({
                label: role?.name,
                value: role?._id
              })) as OptionsType[]
            }
            error={formState.errors.departmentId}
          />
          <TextInputWithIcon
            label="First Name"
            name="firstName"
            placeholder="John"
            type="text"
            register={register}
            error={formState.errors.firstName}
            inputProps={{ autoComplete: "off", type: "text" }}
            leftIcon={<IoPersonOutline />}
          />
          <TextInputWithIcon
            label="Last Name"
            name="lastName"
            placeholder="Brown"
            type="text"
            register={register}
            error={formState.errors.lastName}
            inputProps={{ autoComplete: "off", type: "text" }}
            leftIcon={<IoPersonOutline />}
          />
          <TextInputWithIcon
            label="Email"
            name="email"
            placeholder="jondoe@gmail.com"
            type="email"
            register={register}
            error={formState.errors.email}
            inputProps={{
              autoComplete: "off",
              type: "email"
            }}
            leftIcon={<IoMailOutline />}
          />

          <PrimaryButton className="mt-5" type="submit">
            {mutation.isPending ? <Spinner /> : "Submit"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateUser;
