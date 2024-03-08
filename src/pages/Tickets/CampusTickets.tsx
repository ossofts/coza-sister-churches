import { TableColumn } from "@/components/DataTable/types";
import { Ticket } from "./types";
import { capitalizeFirstLetter, truncateString } from "@/utils/textFormatters";
import BadgeComponent from "@/components/BadgeComponent";
import useRole from "@/hooks/useRoles";
import {
  useMemo,
  // useState
} from "react";
import { useGetTickets } from "@/services/tickets";
import { sortByDate, timeFormat } from "@/utils";
import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import DataTable from "@/components/DataTable";
import EmptyData from "@/components/EmptyData";
// import TicketDetails from "./TicketDetails";

const CampusTickets = () => {
  // const [open, setOpen] = useState(false);

  const {
    user: { campus },
    // isCampusPastor,
    // isGlobalPastor,
  } = useRole();
  const columns: TableColumn<Ticket>[] = [
    {
      title: "",
      field: "createdAt",
      render: (data) => {
        return (
          <div>
            <p className="font-semibold mb-3">
              {timeFormat(data?.createdAt, "MMMM Do, YYYY")}
            </p>
            <div className="flex justify-between items-center gap-3">
              <div className="flex flex-col justify-around">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
                  {`${capitalizeFirstLetter(
                    data?.user?.firstName
                  )} ${capitalizeFirstLetter(data?.user?.lastName)}`}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {truncateString(data?.departmentName)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {capitalizeFirstLetter(data?.category?.categoryName)}
                </p>
              </div>
              <BadgeComponent status={data?.status}>
                {data?.status}
              </BadgeComponent>
            </div>
          </div>
        );
      },
    },
  ];

  const { data, isLoading, isFetching } = useGetTickets({
    campusId: campus?._id,
    limit: 100,
    page: 1,
  });

  const preparedForSortData = useMemo(
    () =>
      data?.map((data: Ticket) => {
        return { ...data, sortDateKey: data?.updatedAt || data?.createdAt };
      }),
    [data]
  );

  const sortedData = useMemo(
    () => sortByDate(preparedForSortData || [], "sortDateKey"),
    [preparedForSortData]
  );

  const onRowClick = () => {
    // setOpen(true);
  };

  if (isLoading || isFetching) return <FullPageSpinner />;
  return (
    <>
      <ReactIf
        condition={!!data && data?.length > 0}
        component={
          <DataTable
            data={sortedData ?? []}
            columns={columns}
            onRowClick={onRowClick}
            showHeader={false}
          />
        }
        fallback={
          <EmptyData message="Nothing here, lets keep it that way 😇" />
        }
      />

      {/* <TicketDetails {...{ open, setOpen }} /> */}
    </>
  );
};

export default CampusTickets;
