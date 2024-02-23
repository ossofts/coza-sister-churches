import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMailOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { PasswordInput, TextInputWithIcon } from "@/components/Inputs";
import { PrimaryButton } from "@/components/Buttons";
import ROUTES from "@/routes";
import useUserStore from "@/store/userStore";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/account";
import showAlert from "@/hooks/useAlert";
import { customError } from "@/types/global.type";
import { Spinner } from "@/components/Loaders";
import { setToken } from "@/services/authToken";
import { AuthInputs } from "./types";
import { loginSchema } from "./validation";

const Login = () => {
  const setUser = useUserStore((state) => state.setUser);
  // const { goto } = useNavigation();

  const mutation = useMutation({
    mutationKey: ["loginUser"],
    mutationFn: (body: AuthInputs) => loginUser(body)
  });
  const {
    register,
    handleSubmit,
    // watch,
    formState
  } = useForm<AuthInputs>({
    resolver: loginSchema
  });
  const onSubmit: SubmitHandler<AuthInputs> = (data: AuthInputs) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (mutation.data) {
      showAlert("success", "Logged in successfully");
      document.cookie = `test = one;`;
      setToken(mutation.data?.data?.token?.token, mutation.data?.data?.token?.refreshToken);
      setUser(mutation.data?.data?.profile);
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
    <div>
      <h2 className="mb-5 text-lg font-bold text-center">Welcome back</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextInputWithIcon
          label="Email"
          name="email"
          placeholder="jondoe@gmail.com"
          type="email"
          register={register}
          error={formState.errors.email}
          inputProps={{ autoComplete: "off", type: "email" }}
          leftIcon={<IoMailOutline />}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Password"
          register={register}
          error={formState.errors.password}
          inputProps={{ autoComplete: "off" }}
        />

        <PrimaryButton onClick={() => null} type="submit">
          {mutation.isPending ? <Spinner /> : "Login"}
        </PrimaryButton>
      </form>

      <p className="text-brandColor-500 text-sm text-center mt-10">
        <Link to={ROUTES.FORGOT_PASSWORD.path}>Forgot password?</Link>
      </p>

      <p className="text-gray-400 text-sm text-center mt-5">
        Not yet registered?{" "}
        <Link className="text-brandColor-500" to={ROUTES.REGISTER.path}>
          Register
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
