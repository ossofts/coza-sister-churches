 
import { ReactNode } from "react";
import { TableColumn } from "./types";
import { timeDifference, timeFormatDifference } from "@/utils";
import { isEmpty } from "lodash";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { COLORS } from "@/theme/colors";
import AvatarComponent from "../AvatarComponent";
import { capitalizeFirstLetter } from "@/utils/textFormatters";
import BadgeComponent from "../BadgeComponent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

export default function CustomTableRender(props: {
  column: TableColumn<any>;
  rowItem: Record<string, any>;
}) {
  const { column, rowItem } = props;

  if (column.render) {
    return <div className="text-xs text-left">{column.render(rowItem)}</div>;
  }

  if (column.renderType) {
    // const element = ColumnRender(...arguments);
    const element = ColumnRender(props);
    if (element) return element;
  }

  return rowItem[column.field];
}

function ColumnRender(
  props: Parameters<typeof CustomTableRender>[number]
): ReactNode {
  const { column, rowItem } = props;

  if (column.renderType?.date) {
    const date = column.renderType?.date(rowItem);
    if (isEmpty(date)) return "-";

    return timeFormatDifference(date);
  }

  if (column.renderType?.datebox) {
    const date = column.renderType?.datebox(rowItem);

    return (
      <div
        className={twMerge(
          "pb-1 w-[52px] h-[52px] border border-gray-700 dark:border-gray-500"
        )}
      >
        <div
          className={
            "flex flex-col items-center font-bold text-gray-700 dark:text-gray-300 text-xs p-[2px]"
          }
        >
          <span className="font-bold text-[14px] text-gray-700 dark:text-gray-300">
            {moment(date).format("ll").substring(4, 6).split(",").join("")}
          </span>
          <span className="text-[10px]">
            {moment(date).format("dddd").substring(0, 3).toUpperCase()}
          </span>
          <p className="text-[10px]">
            {moment(date).format("MMMM").substring(0, 3)} /{" "}
            {moment(date).format("YY")}
          </p>
        </div>
      </div>
    );
  }

  if (column.renderType?.clockIn) {
    const time = column.renderType?.clockIn(rowItem);

    return (
      <div className="flex items-center min-w-[88px] text-xs font-semibold">
        <FiArrowDownRight color={COLORS.primaryLight} size={18} />
        <p
          className={twMerge(
            time
              ? "text-green-500 dark:text-green-300"
              : "text-red-300 dark:text-red-500"
          )}
        >
          {time ? moment(time).format("LT") : "--:--"}
        </p>
      </div>
    );
  }

  if (column.renderType?.clockOut) {
    const time = column.renderType?.clockOut(rowItem);

    return (
      <div className="flex items-center min-w-[88px] text-xs font-semibold">
        <FiArrowUpRight color={COLORS.primaryLight} size={18} />
        <p className={twMerge("text-gray-500 dark:text-gray-300")}>
          {time ? moment(time).format("LT") : "--:--"}
        </p>
      </div>
    );
  }

  if (column.renderType?.hoursDiff) {
    const { clockIn, clockOut } = column.renderType.hoursDiff(rowItem);

    return (
      <p className="text-center text-gray-500 dark:text-gray-100 text-xs font-semibold">
        {clockOut
          ? timeDifference(clockOut || "", clockIn || "").hrsMins
          : "--:--"}
      </p>
    );
  }

  if (column.renderType?.name) {
    const name = column.renderType?.name(rowItem);

    return (
      <div className="flex items-center flex-1 text-left w-full min-w-[45px] truncate max-w-[90px] sm:max-w-none">
        {name.avatar && (
          <AvatarComponent
            extraClass="w-4 h-4 text-xs"
            src={name?.pictureUrl ?? ""}
            fallback={name.firstName[0] + name.lastName[0]}
          />
        )}
        <span className="flex fle-col justify-center text-gray-800 dark:text-gray-100 text-xs">
          {`${capitalizeFirstLetter(name.firstName)} ${capitalizeFirstLetter(name.lastName)}`}
        </span>
      </div>
    );
  }

  if (column.renderType?.score) {
    const score = column.renderType?.score(rowItem);

    return (
      <div className="flex flex-1 text-left w-full text-gray-500 text-xs dark:text-gray-300">
        <span>{score ?? 0}</span>
      </div>
    );
  }

  if (column.renderType?.present) {
    const present = column.renderType?.present(rowItem);

    return (
      <div className="flex items-center text-xs">
        <FiArrowDownRight color={COLORS.primaryLight} size={18} />
        <span
          className={twMerge(
            present.clockIn
              ? "text-green-500 dark:text-green-300"
              : "text-red-500 dark:text-red-300"
          )}
        >
          {present.clockIn ? moment(present.clockIn).format("LT") : "--:--"}
        </span>
      </div>
    );
  }

  if (column.renderType?.late) {
    const late = column.renderType?.late(rowItem);

    return (
      <div className="flex items-center text-xs">
        <FiArrowDownRight color={COLORS.primaryLight} size={18} />
        <span className={twMerge("text-gray-500 dark:text-gray-300")}>
          {late.clockOut ? moment(late.clockOut).format("LT") : "--:--"}
        </span>
      </div>
    );
  }

  if (column.renderType?.absent) {
    const absent = column.renderType?.absent(rowItem);

    return (
      <div className="flex items-center text-xs">
        <span className={twMerge("text-gray-500 dark:text-gray-100")}>
          {`${!absent.clockOut ? "--:--" : `${timeDifference(absent.clockIn, absent.clockOut).minutes}mins`}`}
        </span>
      </div>
    );
  }

  if (column.renderType?.user) {
    const user = column.renderType?.user(rowItem);

    const fullName = `${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`;

    return (
      <div className="flex items-center flex-1 text-left w-full min-w-[45px] text-xs">
        <AvatarComponent
          src={user?.pictureUrl ?? ""}
          extraClass="mr-2 w-8 h-8"
          fallback={user.firstName[0] + user.lastName[0]}
        />
        <div className="flex flex-col justify-center items-start text-gray-800 dark:text-gray-100 [&>span]:ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    fullName?.length > 20 && "inline-block max-w-32 truncate"
                  )}
                >
                  {fullName}
                </span>
              </TooltipTrigger>
              <TooltipContent>{fullName}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="truncate text-neutral-400">
            {capitalizeFirstLetter(
              user?.departmentName
                ? user?.departmentName
                : user?.email
                  ? user?.email
                  : ""
            )}
          </span>
        </div>
      </div>
    );
  }

  if (column.renderType?.badge) {
    const badge = column.renderType?.badge(rowItem);

    return (
      <BadgeComponent status={badge.status}>{badge.children}</BadgeComponent>
    );
  }

  return undefined;
}
