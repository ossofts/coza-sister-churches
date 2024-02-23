import BadgeComponent from "@/components/BadgeComponent";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import { CGWC, UserStatus } from "@/store/types";
import { assertCGWCActive } from "@/utils";
import { toSentenceCase } from "@/utils/textFormatters";
import moment from "moment";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

const CgwcListItem = ({ cgwc }: { cgwc: CGWC }) => {
  const status = useMemo(
    () => (assertCGWCActive(cgwc) ? "ACTIVE" : "INACTIVE"),
    [cgwc]
  ) as UserStatus;

  const { goto } = useNavigation();

  return (
    <div
      className={twMerge("w-full border-b border-b-neutral-700 cursor-pointer")}
      onClick={() => goto(`${ROUTES.CGWC.path}/${cgwc?._id}`)}
      aria-roledescription="button"
    >
      <div className="p-4 flex flex-1 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col justify-between">
            <p className="font-bold text-xs">{cgwc?.name}</p>
            <p className="text-xs text-gray-400">
              {`${moment(cgwc?.startDate).format("DD MMM, YYYY")} - ${moment(cgwc?.endDate).format(
                "DD MMM, YYYY"
              )}`}
            </p>
          </div>
        </div>
        <BadgeComponent status={status?.toLowerCase() as UserStatus}>
          {toSentenceCase(status)}
        </BadgeComponent>
      </div>
    </div>
  );
};

export default CgwcListItem;
