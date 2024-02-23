import useRole from "@/hooks/useRoles";
import { useGetCampuses } from "@/services/campus";
import { useCreateDepartment } from "@/services/department";
import { useEffect } from "react";
import { CreateDepartmentPayload } from "./types";
import { useForm } from "react-hook-form";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import { FullPageSpinner, Spinner } from "@/components/Loaders";
import { Form } from "@/components/ui/form";
import SelectInput from "@/components/Inputs/SelectInput";
import { OptionsType } from "node_modules/embla-carousel-autoplay/esm/components/Options";
import ReactIf from "@/components/ReactIf";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDescription } from "react-icons/md";
import { TextInputWithIcon } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";

const CreateDepartment = () => {
  const {
    user: { campus },
    isSuperAdmin,
    isGlobalPastor
  } = useRole();

  const {
    data: campuses,
    // refetch: refetchCampuses,
    isLoading: campusLoading,
    isFetching: campusIsFetching
  } = useGetCampuses();

  const mutation = useCreateDepartment();

  const INITIAL_VALUES: CreateDepartmentPayload = {
    name: "",
    description: "",
    campusId: String(campus?._id) || ""
  };

  const form = useForm<CreateDepartmentPayload>({
    defaultValues: INITIAL_VALUES
  });
  const { register, handleSubmit, control, formState } = form;

  const onSubmit = (data: CreateDepartmentPayload) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Department created successfully");
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

  if (campusLoading || campusIsFetching) return <FullPageSpinner />;

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col gap-2 pt-10 px-5" onSubmit={handleSubmit(onSubmit)}>
          <ReactIf
            condition={isGlobalPastor || isSuperAdmin}
            component={
              <SelectInput
                name="campusId"
                placeholder="Select a campus"
                label="Campus"
                required
                control={control}
                options={
                  campuses?.data?.map((campus) => ({
                    label: campus?.campusName,
                    value: campus?._id
                  })) as OptionsType
                }
                error={formState.errors.campusId}
              />
            }
          />
          <TextInputWithIcon
            label="Name"
            name="name"
            placeholder="Enter department name"
            type="text"
            register={register}
            error={formState.errors.name}
            inputProps={{ autoComplete: "off", type: "text" }}
            leftIcon={<LuUsers />}
          />
          <TextInputWithIcon
            label="Description"
            name="description"
            placeholder="Enter description"
            type="text"
            register={register}
            error={formState.errors.description}
            inputProps={{ autoComplete: "off", type: "text" }}
            leftIcon={<MdOutlineDescription />}
          />

          <PrimaryButton className="mt-5" type="submit">
            {mutation.isPending ? <Spinner /> : "Submit"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateDepartment;
