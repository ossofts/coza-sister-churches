import SelectInput from "@/components/Inputs/SelectInput";
import PageHeader from "@/components/PageHeader";
import { Form } from "@/components/ui/form";
import useRole from "@/hooks/useRoles";
import { useCreateTicket, useGetTicketCategories } from "@/services/tickets";
import { useGetUsersByDepartmentId } from "@/services/account";
import { useGetCampuses } from "@/services/campus";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { useGetLatestService } from "@/services/service";
import { Campus, Department, SelectOptions } from "@/store/types";
import { sortStringAscending } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateTicketPayload } from "./types";
import { TextboxInput } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import { createTicketSchema } from "./validation";
import { Spinner } from "@/components/Loaders";
import { useQueryClient } from "@tanstack/react-query";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";

const IssueTicket = () => {
  const {
    user: { campus, userId },
  } = useRole();
  const navigation = useNavigation();

  const [campusId, _setCampusId] = useState<Campus["_id"]>(String(campus?._id));
  const [departmentId, setDepartmentId] = useState<Department["_id"]>(); //Just for 3P testing

  const {
    data: campuses,
    // isLoading: campusesIsLoading,
    // isFetching: campusesIsFetching,
  } = useGetCampuses();

  const {
    data: campusDepartments,
    isLoading: campusDepartmentsLoading,
    isFetching: campusDepartmentsIsFetching,
  } = useGetDepartmentsByCampusId(campusId, {
    enabled: !!campuses?.data?.length,
  });

  const {
    data: workers,
    isLoading: workersLoading,
    isFetching: workersIsFetching,
  } = useGetUsersByDepartmentId(departmentId as string, {
    enabled: !!departmentId,
  });

  const { data: latestService, refetch: _refetchLatestService } =
    useGetLatestService(campus?._id as string);
  const { data: ticketCategories } = useGetTicketCategories();
  const mutation = useCreateTicket();

  const sortedCampusDepartments = useMemo(
    () =>
      sortStringAscending(
        campusDepartments?.data,
        "departmentName"
      ) as Department[],
    [campusDepartmentsLoading, campusDepartmentsIsFetching]
  );

  const form = useForm<CreateTicketPayload>({
    resolver: createTicketSchema,
    defaultValues: {
      departmentId,
      campusId,
      userId: "",
      categoryId: "",
      isDepartment: false,
      isIndividual: true,
      isCampus: false,
      isRetracted: false,
      serviceId: latestService?.data._id,
      ticketSummary: "",
      issuedBy: userId,
    },
  });
  const { handleSubmit, control, formState, register } = form;

  const onSubmit = (data: CreateTicketPayload) => {
    if (latestService?.data) {
      const body = {
        ...data,
        serviceId: latestService?.data?._id,
      };
      mutation.mutate(body);
    } else {
      showAlert("info", "You cannot issue tickets outside an active service.");
    }
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Ticket issued successfully.");
      queryClient.invalidateQueries({
        queryKey: ["getTickets"],
      });
      navigation.goto(ROUTES.TICKETS.path);
    }
    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ??
          "Oops! Something went wrong."
      );
    }
  });
  return (
    <div className="px-5">
      <PageHeader title="Individual Ticket" />
      <Form {...form}>
        <form
          className="flex flex-col gap-2 pt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <SelectInput
            control={control}
            name="departmentId"
            label="Department"
            onChange={setDepartmentId}
            placeholder="Select department"
            options={sortedCampusDepartments?.map((dept) => ({
              value: dept?._id,
              label: dept?.departmentName,
            }))}
            required
            error={formState.errors.departmentId}
          />

          <SelectInput
            control={control}
            name="userId"
            label="Worker"
            placeholder="Select worker"
            isLoading={workersLoading || workersIsFetching}
            options={
              workers?.data?.map((worker) => ({
                value: worker?._id,
                label: `${worker.firstName} ${worker.lastName}`,
              })) as SelectOptions
            }
            required
            error={formState.errors.userId}
          />
          <SelectInput
            control={control}
            name="categoryId"
            label="Category"
            placeholder="Select category"
            options={
              ticketCategories?.map((category) => ({
                value: category?._id,
                label: category?.categoryName,
              })) as SelectOptions
            }
            required
            error={formState.errors.categoryId}
          />
          <TextboxInput
            name="ticketSummary"
            error={formState.errors.ticketSummary}
            label="Description"
            placeholder="Enter description"
            register={register}
          />

          <PrimaryButton className="mt-2" type="submit">
            {mutation.isPending ? <Spinner /> : "Submit"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default IssueTicket;
