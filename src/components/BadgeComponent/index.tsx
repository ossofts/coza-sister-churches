import { TicketStatus } from "@/pages/Tickets/types";
import { UserStatus } from "@/store/types";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  status:
    | UserStatus
    | "approved"
    | "unapproved"
    | "active"
    | "inactive"
    | "info"
    | TicketStatus;
  extraClass?: string;
  children: React.ReactNode;
};
const BadgeComponent = ({ status, extraClass, children }: Props) => {
  const green =
    status?.toLowerCase() === "approved" ||
    status?.toLowerCase() === "active" ||
    status?.toLowerCase() === "acknowledged";
  const gray =
    status?.toLowerCase() === "pending" ||
    status?.toLowerCase() === "issued" ||
    status?.toLowerCase() === "dormant";
  const amber =
    status?.toLowerCase() === "review_requested" ||
    status?.toLowerCase() === "retracted";
  const purple = status?.toLowerCase() === "info";
  const red =
    status?.toLowerCase() === "unapproved" ||
    status?.toLowerCase() === "inactive" ||
    status?.toLowerCase() === "contested" ||
    status?.toLowerCase() === "rejected";
  return (
    <span
      className={twMerge(
        "p-1 px-2 text-xs rounded-md font-semibold",
        green &&
          "bg-green-600 text-green-50 dark:bg-green-200 dark:text-green-600",
        red && "bg-red-600 text-red-50 dark:bg-red-200 dark:text-red-600",
        amber &&
          "bg-amber-600 text-amber-50 dark:bg-amber-200 dark:text-amber-600",
        gray && "bg-gray-200 text-gray-700 dark:bg-gray-300 dark:text-gray-700",
        purple &&
          "bg-brandColor-600 text-brandColor-50 dark:bg-brandColor-200 dark:text-brandColor-600",
        extraClass
      )}
    >
      {children}
    </span>
  );
};

export default BadgeComponent;
