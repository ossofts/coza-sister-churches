import { UserStatus } from "@/store/types";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  status: UserStatus | "approved" | "unapproved" | "active" | "inactive";
  extraClass?: string;
  children: React.ReactNode;
};
const BadgeComponent = ({ status, extraClass, children }: Props) => {
  const green =
    status?.toLowerCase() === "approved" || status?.toLowerCase() === "active";
  const red =
    status?.toLowerCase() === "unapproved" ||
    status?.toLowerCase() === "inactive";
  return (
    <span
      className={twMerge(
        "p-1 px-2 text-xs rounded-md font-semibold",
        green &&
          "bg-green-600 text-gray-50 dark:bg-green-200 dark:text-green-600",
        red && "bg-red-600 text-gray-50 dark:bg-red-200 dark:text-red-600",
        extraClass
      )}
    >
      {children}
    </span>
  );
};

export default BadgeComponent;
