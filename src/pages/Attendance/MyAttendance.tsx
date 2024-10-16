import { TableColumn } from "@/components/DataTable/types";
import { MyAttendance as MyAttendanceType } from "./types";
import DataTable from "@/components/DataTable";
// import { attendanceData } from "./utils";
import { useGetAttendance } from "@/services/attendance";
import useUserStore from "@/store/userStore";
import { useState } from "react";
import useFetchMoreData from "@/hooks/useFetchMoreData";
import InfiniteScroll from "react-infinite-scroll-component";
// import { Spinner } from "@/components/Loaders";
// import { COLORS } from "@/theme/colors";
import ReactIf from "@/components/ReactIf";
import EmptyData from "@/components/EmptyData";
import { FullPageSpinner } from "@/components/Loaders";

const MyAttendance = () => {
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);
  const columns: TableColumn<MyAttendanceType>[] = [
    {
      title: "Date",
      field: "clockIn",
      renderType: {
        datebox: (data) => data.createdAt,
      },
    },
    {
      title: "Clock In",
      field: "clockIn",
      renderType: {
        clockIn: (data) => data.clockIn,
      },
    },
    {
      title: "Clock Out",
      field: "clockOut",
      renderType: {
        clockOut: (data) => data.clockOut,
      },
    },
    {
      title: "Service Hrs",
      field: "clockOut",
      renderType: {
        hoursDiff: (data) => ({
          clockIn: data.clockIn,
          clockOut: data.clockOut,
        }),
      },
    },
    // {
    //   title: "Score",
    //   field: "score",
    //   renderType: {
    //     score: (data) => data.score
    //   }
    // }
  ];

  const { data, isLoading, isFetching, isSuccess, refetch } = useGetAttendance({
    userId: user?.userId,
    limit: 100,
    page,
  });

  const { data: moreData } = useFetchMoreData<MyAttendanceType>({
    dataSet: data?.data,
    isSuccess,
    uniqKey: "_id",
  });

  const fetchMoreData = () => {
    if (!isFetching && !isLoading) {
      if (data?.data?.length) {
        setPage((prev) => prev + 1);
      } else {
        setPage((prev) => prev - 1);
      }
    }
  };

  // const data = attendanceData?.sort((a, b) => {
  //   if (a.createdAt > b.createdAt) return -1;
  //   else if (a.createdAt < b.createdAt) return 1;
  //   else return 0;
  // });
  if (isLoading) return <FullPageSpinner />;
  return (
    <div>
      <ReactIf
        condition={!!data?.data && !!data?.data[0]}
        component={
          <InfiniteScroll
            dataLength={moreData?.length} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={false}
            // loader={<Spinner color={COLORS.brandColor[600]} />}
            loader={<span>...</span>}
            // endMessage={
            //   <p style={{ textAlign: 'center' }}>
            //     <b>Yay! You have seen it all</b>
            //   </p>
            // }
            // below props only if you need pull down functionality
            refreshFunction={refetch}
            // pullDownToRefresh
            // pullDownToRefreshThreshold={50}
            // pullDownToRefreshContent={
            //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
            // }
            // releaseToRefreshContent={
            //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
            // }
          >
            <DataTable
              columns={columns}
              isLoading={isLoading}
              data={moreData}
            />
          </InfiniteScroll>
        }
        fallback={<EmptyData />}
      />
    </div>
  );
};

export default MyAttendance;
