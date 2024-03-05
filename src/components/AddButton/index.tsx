import { LuPlus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = React.ComponentProps<"button">;
const AddButton = (props: Props) => {
  const { className } = props;
  return (
    <button
      {...props}
      className={twMerge(
        "flex justify-center items-center absolute rounded-full right-6 bottom-24 w-14 h-14 shadow-md bg-appColors-primary",
        className
      )}
    >
      <LuPlus size={42} color="white" />
    </button>
  );
};

export default AddButton;
