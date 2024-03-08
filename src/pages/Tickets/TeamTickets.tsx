import { TableColumn } from "@/components/DataTable/types";
import { Ticket } from "./types";
import { capitalizeFirstLetter } from "@/utils/textFormatters";
import { useMemo } from "react";
import useRole from "@/hooks/useRoles";
import { useGetTickets } from "@/services/tickets";
import { sortByDate, timeFormat } from "@/utils";
import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import DataTable from "@/components/DataTable";
import EmptyData from "@/components/EmptyData";
import BadgeComponent from "@/components/BadgeComponent";

const TeamTickets = () => {
  const {
    user: { department },
    // isCampusPastor,
    // isGlobalPastor,
  } = useRole();

  // const [page, setPage] = useState<number>(1);

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
              <div className="flex flex-col justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
                  {`${capitalizeFirstLetter(
                    data?.user?.firstName
                  )} ${capitalizeFirstLetter(data?.user?.lastName)}`}
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
    departmentId: department?._id,
    limit: 100,
    page: 1,
  });

  const preparedForSortData = useMemo(
    () =>
      data?.map((ticket: Ticket) => {
        return {
          ...ticket,
          sortDateKey: ticket?.updatedAt || ticket?.createdAt,
        };
      }),
    [data]
  );

  const sortedData = useMemo(
    () => sortByDate(preparedForSortData || [], "sortDateKey"),
    [preparedForSortData]
  );

  const onRowClick = () => {};

  if (isLoading || isFetching) return <FullPageSpinner />;
  return (
    <ReactIf
      condition={!!data && data?.length > 0}
      component={
        <DataTable
          data={sortedData ?? []}
          columns={columns}
          onRowClick={onRowClick}
          // showHeader={false}
        />
      }
      fallback={<EmptyData message="Nothing here, lets keep it that way 😇" />}
    />
  );
};

export default TeamTickets;
