import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  title: string;
  value: ReactNode;
  align?: "horizontal" | "vertical";
  isLoading?: boolean;
  divider?: boolean;
};
const DetailItem = (props: Props) => {
  const { align = "horizontal", isLoading = false, divider = true } = props;
  return (
    <div
      className={twMerge(
        "w-full pt-5 pb-3 flex ",
        divider && "border-b border-b-neutral-200 dark:border-b-neutral-700",
        align === "horizontal" && "flex-row justify-between items-center",
        align === "vertical" && "flex-col items-start gap-3"
      )}
    >
      <span
        className={twMerge(
          "font-bold text-xs",
          isLoading && "w-20 h-5 bg-neutral-400 animate-pulse rounded"
        )}
      >
        {isLoading ? "" : props.title}
      </span>
      <span
        className={twMerge(
          "text-xs text-wrap",
          isLoading && "w-20 h-5 bg-neutral-400 animate-pulse rounded",
          align === "vertical" && "w-full"
        )}
      >
        {isLoading ? "" : props.value}
      </span>
    </div>
  );
};

export default DetailItem;
