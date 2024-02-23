import { useForm } from "react-hook-form";
import { RegisterInputs, UpdatePasswordType } from "./types";
import { updatePasswordSchema } from "./validation";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../services/account";
import showAlert from "@/hooks/useAlert";
import { useEffect } from "react";
import { customError } from "@/types/global.type";
import { PasswordInput } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import { Spinner } from "@/components/Loaders";
import ROUTES from "@/routes";
import useNavigation from "@/hooks/useNavigation";
import BackButton from "@/components/PageHeader/BackButton";

type Props = { email: string; onBackClick: () => void; otp: string };

const UpdatePassword = ({ email = "", onBackClick, otp }: Props) => {
  const { goto } = useNavigation();
  const form = useForm<UpdatePasswordType>({
    resolver: updatePasswordSchema
  });
  const { register, handleSubmit, formState } = form;

  const mutation = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (body: Pick<RegisterInputs, "email" | "password">) => forgotPassword(otp, body)
  });

  const onSubmit = (data: UpdatePasswordType) => {
    const body = {
      email,
      password: data.password
    };
    mutation.mutate(body);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Password updated successfully");
      goto(ROUTES.LOGIN.path);
    }

    if (mutation.error) {
      showAlert(
        "error",
        customError(mutation.error)?.response?.data?.message ?? "An error occurred"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.data, mutation.error]);
  return (
    <form className="flex flex-col gap-2 pt-10" onSubmit={handleSubmit(onSubmit)}>
      <BackButton onBackClick={onBackClick} />
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
      <PrimaryButton type="submit">{mutation.isPending ? <Spinner /> : "Update"}</PrimaryButton>
    </form>
  );
};

export default UpdatePassword;
