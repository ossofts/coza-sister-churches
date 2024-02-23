import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";

const Welcome = () => {
  const { goto } = useNavigation();
  return (
    <div className="flex flex-col h-full justify-center gap-5 mt-20">
      <PrimaryButton onClick={() => goto(ROUTES.LOGIN.path)}>Login</PrimaryButton>
      <SecondaryButton onClick={() => goto(ROUTES.REGISTER.path)}>Register</SecondaryButton>
    </div>
  );
};

export default Welcome;
