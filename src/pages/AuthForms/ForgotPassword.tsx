import { SubmitHandler, useForm } from "react-hook-form";
import { AuthInputs } from "./types";
import { IoMailOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { emailOnlySchema } from "./validation";
import { TextInputWithIcon } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import ROUTES from "@/routes";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendPasswordOtp, validatePasswordOtp } from "../../services/account";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import OtpModal from "@/components/OtpModal";
import ReactIf from "@/components/ReactIf";
import UpdatePassword from "./UpdatePassword";
import { Spinner } from "@/components/Loaders";

type Inputs = Pick<AuthInputs, "email">;
const ForgotPassword = () => {
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    // watch,
    formState,
  } = useForm<Inputs>({
    resolver: emailOnlySchema,
  });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["sentOtp"],
    queryFn: () => sendPasswordOtp(email?.toLowerCase()),
    enabled: false,
    retry: false,
  });

  const mutation = useMutation({
    mutationKey: ["validateOtp"],
    mutationFn: () =>
      validatePasswordOtp({ email: email?.toLowerCase(), otp: parseInt(otp) }),
  });
  const onSubmit: SubmitHandler<Inputs> = () => {
    refetch();
  };

  useEffect(() => {
    if (data) {
      setOpenOtpModal(true);
    }

    if (error) {
      showAlert("error", customError(error)?.response?.data?.message);
    }
  }, [data, error]);

  useEffect(() => {
    if (otp?.length === 6) {
      mutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Verification successful");
      setOpenOtpModal(false);
      setValidated(true);
    }
    if (mutation.error) {
      showAlert("error", customError(mutation.error)?.response?.data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.data, mutation.error]);
  return (
    <div>
      <h2 className="mb-5 text-lg font-bold text-center">{`${validated ? "Update" : "Forgot"} Password`}</h2>

      <ReactIf
        condition={validated}
        component={
          <UpdatePassword
            email={email}
            otp={otp}
            onBackClick={() => setValidated(false)}
          />
        }
        fallback={
          <>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInputWithIcon
                label="Email"
                name="email"
                onChange={(e) => setEmail(e.target?.value)}
                placeholder="jondoe@gmail.com"
                type="email"
                register={register}
                error={formState.errors.email}
                inputProps={{ autoComplete: "off", type: "email" }}
                leftIcon={<IoMailOutline />}
              />

              <PrimaryButton onClick={() => null} type="submit">
                {isLoading ? <Spinner /> : "Continue"}
              </PrimaryButton>
            </form>

            <p className="text-gray-400 text-sm text-center mt-5">
              Remember your password?{" "}
              <Link className="text-brandColor-500" to={ROUTES.LOGIN.path}>
                Login
              </Link>{" "}
            </p>
          </>
        }
      />

      <OtpModal
        isLoading={mutation.isPending}
        open={openOtpModal}
        setOpen={setOpenOtpModal}
        value={otp}
        onChange={setOtp}
      />
    </div>
  );
};

export default ForgotPassword;
