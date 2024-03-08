import { TableColumn } from "@/components/DataTable/types";
import { Ticket } from "./types";
import { capitalizeFirstLetter, truncateString } from "@/utils/textFormatters";
import useRole from "@/hooks/useRoles";
import { useEffect, useMemo, useState } from "react";
import { useGetTickets } from "@/services/tickets";
import {
  // groupListByKey,
  // replaceArrayItemByNestedKey,
  sortByDate,
  timeFormat,
} from "@/utils";
import { FullPageSpinner } from "@/components/Loaders";
import DataTable from "@/components/DataTable";
import ReactIf from "@/components/ReactIf";
import EmptyData from "@/components/EmptyData";
import BadgeComponent from "@/components/BadgeComponent";
import TicketDetails from "./TicketDetails";

const MyTickets = () => {
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>();

  const {
    user: { userId },
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
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {capitalizeFirstLetter(data?.category?.categoryName)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {truncateString(data?.departmentName)}
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

  const { data, isLoading, isFetching, refetch } = useGetTickets({
    userId,
    limit: 100,
    page: 1,
  });

  const sortedData = useMemo(() => sortByDate(data || [], "createdAt"), [data]);
  // const groupedData = useMemo(
  //   () =>
  //     groupListByKey(
  //       replaceArrayItemByNestedKey(sortedData || [], updatedListItem, [
  //         "_id",
  //         updatedListItem?._id,
  //       ]),
  //       "createdAt"
  //     ),
  //   [updatedListItem?._id, sortedData]
  // );

  const onRowClick = (rowData: Ticket) => {
    setSelectedTicket(rowData);
    setOpen(true);
  };

  useEffect(() => {
    if (selectedTicket !== undefined) setOpen(true);
    else setOpen(false);
  }, [selectedTicket]);

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

      <TicketDetails {...{ open, setOpen, ticket: selectedTicket, refetch }} />
    </>
  );
};

export default MyTickets;
