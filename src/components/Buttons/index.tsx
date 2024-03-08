import { ClassNameValue, twMerge } from "tailwind-merge";
import { Spinner } from "../Loaders";
import { COLORS } from "@/theme/colors";

type Props = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "reset" | "submit" | "button";
  fullWidth?: boolean;
  className?: ClassNameValue;
  disabled?: boolean;
  isLoading?: boolean;
};

const PrimaryButton = (props: Props) => {
  const {
    children,
    onClick,
    type,
    fullWidth = true,
    className,
    disabled = false,
    isLoading = false,
  } = props;
  return (
    <button
      disabled={disabled}
      className={twMerge(
        `bg-brandColor-600 dark:bg-brandColor-600 text-white grid items-center h-12 font-medium text-md rounded-lg disabled:cursor-not-allowed disabled:bg-opacity-50 ${fullWidth ? "w-full" : "px-5"}`,
        className
      )}
      type={type ? type : "button"}
      onClick={onClick}
    >
      {isLoading ? <Spinner color="white" /> : children}
    </button>
  );
};

const SecondaryButton = (props: Props) => {
  const {
    children,
    onClick,
    type,
    fullWidth = true,
    className,
    disabled = false,
    isLoading = false,
  } = props;
  return (
    <button
      disabled={disabled}
      className={twMerge(
        `text-brandColor-600 dark:text-brandColor-500 bg-white border border-gray-400 grid items-center h-12 font-medium text-md rounded-lg ${fullWidth ? "w-full" : "px-5"}`,
        disabled && "bg-transparent opacity-55 cursor-not-allowed",
        className
      )}
      type={type ? type : "button"}
      onClick={onClick}
    >
      {isLoading ? <Spinner color={COLORS.brandColor[600]} /> : children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };
