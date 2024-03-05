import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LuPlus, LuMinus } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = {
  options: {
    icon: JSX.Element;
    color: string;
    handleClick: () => void;
  }[];
};

const UniversalAddButton = ({ options }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex justify-center items-center absolute rounded-full right-6 bottom-24 w-14 h-14 shadow-md bg-appColors-primary outline-none border-none duration-75">
        {open ? (
          <LuMinus size={42} color="white" />
        ) : (
          <LuPlus size={42} color="white" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          background: "none",
          boxShadow: "0 0 0 0",
          border: "none",
          width: "fit-content",
        }}
        className="bg-none dark:bg-none flex flex-col gap-5 items-center py-5 w-fit -mr-[10px] animate-in animate-out"
      >
        {options?.map(({ icon, ...others }, idx) => (
          <button
            onClick={others.handleClick}
            key={idx}
            className={twMerge(
              "flex justify-center items-center rounded-full w-14 h-14 shadow-md",
              others.color
            )}
          >
            {icon}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UniversalAddButton;
