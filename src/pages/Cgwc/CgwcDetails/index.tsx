import CarouselComponent from "@/components/CarouselComponent";
import { FullPageSpinner } from "@/components/Loaders";
import { useCurrentPath } from "@/hooks/useCurrentPath";
import { useGetCGWCById, useGetCGWCInstantMessages } from "@/services/cgwc";
import { useGetLatestService, useGetServices } from "@/services/service";
import { CGWCInstantMessage } from "@/store/types";
import useUserStore from "@/store/userStore";
import Item from "./Item";
import MyAttendance from "./MyAttendance";
import CGWCReportSummary from "./CGWCReportSummary";
import useRole from "@/hooks/useRoles";
import ReactIf from "@/components/ReactIf";
import { FaRegCalendarPlus } from "react-icons/fa";
import { BiMessageEdit } from "react-icons/bi";
import UniversalAddButton from "@/components/UniversalAddButton";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import PageHeader from "@/components/PageHeader";

const CgwcDetails = () => {
  const { params } = useCurrentPath();
  const navigation = useNavigation();
  const CGWCId = params?.id;

  const user = useUserStore((state) => state.user);
  const { isHOD, isSuperAdmin } = useRole();

  const { data: latestService } = useGetLatestService(
    user!.campus?._id as string
  );

  const { data: sessions } = useGetServices({
    CGWCId,
    page: 1,
    limit: 30,
  });

  const {
    data: cgwc,
    isLoading,
    isFetching,
  } = useGetCGWCById(CGWCId as string);

  const {
    data: messages,
    // refetch: refetchMessages,
    isLoading: messagesIsLoading,
  } = useGetCGWCInstantMessages({ cgwcId: CGWCId });
  // console.log({ messages: messages?.data });

  const allButtons = [
    {
      color: "bg-blue-400",
      icon: <BiMessageEdit size={28} color="white" />,
      handleClick: () =>
        navigation.goto(`${ROUTES.CGWC.path}/${CGWCId}/create-instant-message`),
    },
    {
      color: "bg-blue-600",
      icon: <FaRegCalendarPlus size={28} color="white" />,
      handleClick: () =>
        navigation.goto(`${ROUTES.CGWC.path}/${CGWCId}/create-cgwc-session`),
    },
  ];

  const handleClick = () => {};

  if (isLoading || isFetching || messagesIsLoading) return <FullPageSpinner />;

  return (
    <div>
      <PageHeader title={String(cgwc?.data?.name)} />
      {/* <h2 className="text-center text-lg font-bold">{cgwc?.data?.name}</h2> */}

      <div className="my-5 flex justify-center">
        <CarouselComponent
          data={messages?.data as CGWCInstantMessage[]}
          carouselItem={Item}
        />
      </div>
      <div>
        <MyAttendance
          sessions={sessions?.data || []}
          CGWCId={CGWCId}
          userId={user?.userId}
        />

        <ReactIf
          condition={isHOD || isSuperAdmin}
          component={
            <CGWCReportSummary
              CGWCId={CGWCId as string}
              sessions={sessions?.data || []}
              latestService={latestService?.data}
              title={"Team Report"}
            />
          }
        />
      </div>

      <ReactIf
        condition={isSuperAdmin}
        component={<UniversalAddButton options={allButtons} />}
      />
    </div>
  );
};

export default CgwcDetails;
