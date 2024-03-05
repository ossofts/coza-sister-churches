import { PrimaryButton } from "@/components/Buttons";
import { TextInputWithIcon } from "@/components/Inputs";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import SelectInput from "@/components/Inputs/SelectInput";
import { Spinner } from "@/components/Loaders";
import PageHeader from "@/components/PageHeader";
import { Form } from "@/components/ui/form";
import showAlert from "@/hooks/useAlert";
import { useCreateServiceMutation } from "@/services/service";
import { CGWC_SESSION_TAGS } from "@/store/types";
import { CREATE_SERVICE_ENUM, customError } from "@/types/global.type";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CreateServicePayload } from "../types";
import TimePickerInput from "@/components/Inputs/TimePickerInput";
import { createCGWCSessionSchema } from "../validation";
import { concatDateTimeToEpoc } from "@/utils";
import ROUTES from "@/routes";
import useNavigation from "@/hooks/useNavigation";

const CreateCGWCSession = () => {
  const { id } = useParams();
  const navigation = useNavigation();
  const mutation = useCreateServiceMutation();

  const form = useForm<CreateServicePayload>({
    resolver: createCGWCSessionSchema,
    defaultValues: {
      serviceType: "global",
      name: "",
      serviceTag: "",
      serviceTime: "",
      serviceDate: "",
      endTime: "",
      isCGWC: true,
      CGWCId: id,
      clockinTime: "",
      leaderLateTime: "",
      workerLateTime: "",
      isGlobalService: true,
    },
  });
  const { register, handleSubmit, control, formState } = form;

  const onSubmit = (data: CreateServicePayload) => {
    const clockInStartTime = concatDateTimeToEpoc(
      data.serviceDate,
      data.clockinTime
    );
    const coordinates = {
      long: CREATE_SERVICE_ENUM.LONG,
      lat: CREATE_SERVICE_ENUM.LAT,
    };
    const name = data.name;
    const isGlobalService = data.serviceType === "global";
    const leadersLateStartTime = concatDateTimeToEpoc(
      data.serviceDate,
      data.leaderLateTime
    );
    const rangeToClockIn = CREATE_SERVICE_ENUM.RANGE_TO_CLOCKIN;
    const serviceEndTime = concatDateTimeToEpoc(data.serviceDate, data.endTime);
    const serviceTime = concatDateTimeToEpoc(
      data.serviceDate,
      data.serviceTime
    );
    const workersLateStartTime = concatDateTimeToEpoc(
      data.serviceDate,
      data.workerLateTime
    );

    const body = {
      CGWCId: id,
      name,
      isCGWC: !!id,
      clockInStartTime,
      coordinates,
      isGlobalService,
      rangeToClockIn,
      serviceEndTime,
      serviceTime,
      leadersLateStartTime,
      tag: [data.serviceTag],
      workersLateStartTime,
    };

    mutation.mutate(body);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Message created successfully");
      navigation.goto(`${ROUTES.CGWC.path}/${id}`);
    }
    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ??
          "Oops! Something went wrong."
      );
    }
  }, [mutation.data, mutation.error]);

  return (
    <div className="px-5">
      <PageHeader title="Create CGWC Session" />

      <Form {...form}>
        <form
          className="flex flex-col gap-2 pt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputWithIcon
            label="Session Name"
            name="name"
            placeholder="Enter session name"
            type="text"
            register={register}
            error={formState.errors.name}
            inputProps={{ autoComplete: "off", type: "text", required: true }}
          />

          <SelectInput
            control={control}
            name="serviceTag"
            placeholder="Select Session Tag"
            label="Session Tag"
            required
            options={CGWC_SESSION_TAGS?.map((item) => ({
              label: item.value,
              value: item.id,
            }))}
          />

          <div className="flex justify-between items-center gap-5">
            <DatePickerInput
              control={control}
              name="serviceDate"
              placeholder="Pick a date"
              label="Date"
              required
              disabledPeriod={() => false}
              error={formState.errors.serviceDate}
            />

            <TimePickerInput
              control={control}
              name="serviceTime"
              label="Service Start Time"
              required
              error={formState.errors.serviceTime}
            />
          </div>

          <div className="flex justify-between items-center gap-5">
            <TimePickerInput
              control={control}
              name="clockinTime"
              label="Clock-in Time"
              required
              error={formState.errors.clockinTime}
            />

            <TimePickerInput
              control={control}
              name="leaderLateTime"
              label="Leaders Late Time"
              required
              error={formState.errors.leaderLateTime}
            />
          </div>

          <div className="flex justify-between items-center gap-5">
            <TimePickerInput
              control={control}
              name="workerLateTime"
              label="Workers Late Time"
              required
              error={formState.errors.workerLateTime}
            />

            <TimePickerInput
              control={control}
              name="endTime"
              label="Service End Time"
              required
              error={formState.errors.endTime}
            />
          </div>

          <PrimaryButton className="mt-2" type="submit">
            {mutation.isPending ? <Spinner /> : "Create Session"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateCGWCSession;
