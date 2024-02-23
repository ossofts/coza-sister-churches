import CarouselComponent from "@/components/CarouselComponent";
import { FullPageSpinner } from "@/components/Loaders";
import { useCurrentPath } from "@/hooks/useCurrentPath";
import { useGetCGWCById, useGetCGWCInstantMessages } from "@/services/cgwc";
import {
  // useGetLatestService,
  useGetServices
} from "@/services/service";
import { CGWCInstantMessage } from "@/store/types";
import useUserStore from "@/store/userStore";
import Item from "./Item";
import MyAttendance from "./MyAttendance";

const CgwcDetails = () => {
  const { params } = useCurrentPath();
  const CGWCId = params?.id;

  const user = useUserStore((state) => state.user);

  // const { data: latestService } = useGetLatestService(user!.campus?._id as string);

  const { data: sessions } = useGetServices({
    CGWCId,
    page: 1,
    limit: 30
  });

  const { data: cgwc, isLoading, isFetching } = useGetCGWCById(CGWCId as string);

  const {
    data: messages,
    // refetch: refetchMessages,
    isLoading: messagesIsLoading
  } = useGetCGWCInstantMessages({ cgwcId: CGWCId });
  // console.log({ messages: messages?.data });

  if (isLoading || isFetching || messagesIsLoading) return <FullPageSpinner />;

  return (
    <div>
      <h2 className="text-center text-lg font-bold">{cgwc?.data?.name}</h2>

      <div className="my-5 flex justify-center">
        <CarouselComponent data={messages?.data as CGWCInstantMessage[]} carouselItem={Item} />
      </div>
      <div>
        <MyAttendance sessions={sessions?.data || []} CGWCId={CGWCId} userId={user?.userId} />
      </div>
    </div>
  );
};

export default CgwcDetails;
