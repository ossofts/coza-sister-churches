import { useForm } from "react-hook-form";
import { RegisterInputs } from "../types";
import { updateAccountSchema } from "../validation";
import { PasswordInput, TextInputWithIcon } from "@/components/Inputs";
import { IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { SlPhone } from "react-icons/sl";
import SelectInput from "@/components/Inputs/SelectInput";
import { Form } from "@/components/ui/form";
import { PrimaryButton } from "@/components/Buttons";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../../services/account";
import { useEffect } from "react";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import { Spinner } from "@/components/Loaders";
import { User } from "@/store/types";
import ROUTES from "@/routes";
import useNavigation from "@/hooks/useNavigation";

const genderOptions = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

type Props = { email: string; user: User };

const UpdateAccount = ({ email = "", user }: Props) => {
  const { goto } = useNavigation();
  const form = useForm<RegisterInputs>({
    resolver: updateAccountSchema,
    defaultValues: {
      email: email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });

  const mutation = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (body: Omit<RegisterInputs, "confirmPassword">) =>
      registerUser(body),
  });

  const { register, handleSubmit, control, formState } = form;

  const onSubmit = (data: RegisterInputs) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = {
      email: data.email?.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      password: data.password,
      campusId: user?.department?.campusId,
      departmentId: user?.department?._id,
      roleId: user?.roleId,
      isCGWCApproved: true,
    };
    mutation.mutate(body);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Account updated successfully");
      goto(ROUTES.LOGIN.path);
    }

    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ??
          "An error occurred"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.data, mutation.error]);
  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-2 pt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputWithIcon
            label="Email"
            name="email"
            placeholder="jondoe@gmail.com"
            type="email"
            register={register}
            error={formState.errors.email}
            inputProps={{
              autoComplete: "off",
              type: "email",
              disabled: email !== "" ? true : false,
            }}
            leftIcon={<IoMailOutline />}
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
            label="Phone Number"
            name="phoneNumber"
            placeholder="E.g 07057483762"
            type="tel"
            register={register}
            error={formState.errors.phoneNumber}
            inputProps={{ autoComplete: "off", type: "tel" }}
            leftIcon={<SlPhone />}
          />
          <SelectInput
            name="gender"
            placeholder="Select a gender"
            label="Gender"
            required
            control={control}
            options={genderOptions}
            error={formState.errors.gender}
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Password"
            // type={"password"}
            register={register}
            error={formState.errors.password}
            inputProps={{ autoComplete: "off" }}
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm Password"
            // type={"password"}
            register={register}
            error={formState.errors.confirmPassword}
            inputProps={{ autoComplete: "off" }}
          />
          <PrimaryButton className="mt-2" type="submit">
            {mutation.isPending ? <Spinner /> : "Continue"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default UpdateAccount;
