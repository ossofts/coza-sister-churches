import ReactIf from "@/components/ReactIf";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type AttendanceContainerProps = {
  title: ReactNode;
  showTitle?: boolean;
  score?: number | string;
  scoreType: "percent" | "count";
  children: ReactNode;
};

export const AttendanceContainer = ({
  children,
  title,
  score,
  scoreType,
  showTitle = true,
}: AttendanceContainerProps) => {
  return (
    <div className="flex w-full flex-col">
      <ReactIf
        condition={showTitle}
        component={
          <div className="px-3 w-full border-y border-y-neutral-100 dark:border-y-neutral-900 flex justify-between items-baseline">
            <p className="text-center text-lg font-bold pt-3 pb-4">{title}</p>
            {score && (
              <p
                className={twMerge(
                  "font-bold pb-4 pt-3 text-lg text-center",
                  +score < 31
                    ? "text-red-600"
                    : +score > 69
                      ? "text-green-600"
                      : "text-yellow-400"
                )}
              >
                {score || 0}
                {scoreType === "percent" && "%"}
              </p>
            )}
          </div>
        }
      />
      {children}
    </div>
  );
};
