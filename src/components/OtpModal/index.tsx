import { twMerge } from "tailwind-merge";
import Modal from "../Modal";
import OtpInput from "react-otp-input";
import ReactIf from "../ReactIf";
import { Spinner } from "../Loaders";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
};

const OtpModal = ({ open, setOpen, value, onChange, isLoading }: Props) => {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Verification"
      titleClass="text-2xl mb-3"
      description="Please enter the OTP code we sent to your email address"
      descriptionClass="text-center max-w-[300px] text-xs"
      headerProps={{
        className: twMerge("flex flex-col items-center mb-5")
      }}
    >
      <ReactIf
        condition={!isLoading}
        component={
          <OtpInput
            value={value}
            onChange={onChange}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            containerStyle={twMerge("flex gap-2 justify-center")}
            inputStyle={twMerge(
              "text-4xl sm:text-5xl md:text-6xl bg-neutral-100 dark:bg-neutral-700 p-1 px-2 rounded"
            )}
            renderInput={(props) => <input {...props} />}
          />
        }
        fallback={<Spinner size={45} />}
      />
    </Modal>
  );
};

export default OtpModal;
