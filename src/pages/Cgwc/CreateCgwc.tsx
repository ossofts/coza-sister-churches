import { useForm } from "react-hook-form";
import { createCgwcSchema } from "./validation";
import { Form } from "@/components/ui/form";
import { TextInputWithIcon } from "@/components/Inputs";
import DatePickerInput from "@/components/Inputs/DatePickerInput";
import { PrimaryButton } from "@/components/Buttons";
import { Spinner } from "@/components/Loaders";
import moment from "moment";
import { useCreateCGWCMutation } from "@/services/cgwc";
import { useEffect } from "react";
import showAlert from "@/hooks/useAlert";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import { customError } from "@/types/global.type";

export type CreateCgwcInputs = {
  name: string;
  endDate: Date | number;
  startDate: Date | number;
};

const CreateCgwc = () => {
  const navigation = useNavigation();
  const form = useForm<CreateCgwcInputs>({
    resolver: createCgwcSchema,
    defaultValues: {
      name: "",
      //   startDate: new Date(),
      //   endDate: new Date(),
    },
  });
  const { register, handleSubmit, control, formState } = form;

  const mutation = useCreateCGWCMutation();

  const onSubmit = (data: CreateCgwcInputs) => {
    const body = {
      name: data.name,
      startDate: moment(data.startDate).unix(),
      endDate: moment(data.endDate).unix(),
    };

    mutation.mutate(body);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "CGWC created succesfuly");
      navigation.goto(`${ROUTES.CGWC.path}/${mutation.data?.data?._id}`);
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
      <Form {...form}>
        <form
          className="flex flex-col gap-2 pt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputWithIcon
            label="Name"
            name="name"
            placeholder="CGWC Name"
            type="text"
            register={register}
            error={formState.errors.name}
            inputProps={{ autoComplete: "off", type: "text", required: true }}
          />

          <div className="flex items-center justify-between overflow-auto gap-3">
            <DatePickerInput
              control={control}
              name="startDate"
              placeholder="Pick a date"
              label="Start Date"
              required
              disabledPeriod={(date) => date < new Date()}
              error={formState.errors.startDate}
            />
            <DatePickerInput
              control={control}
              name="endDate"
              placeholder="Pick a date"
              label="End Date"
              required
              disabledPeriod={(date) => date < new Date()}
              error={formState.errors.endDate}
            />
          </div>

          <PrimaryButton className="mt-2" type="submit">
            {mutation.isPending ? <Spinner /> : "Create CGWC"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateCgwc;
