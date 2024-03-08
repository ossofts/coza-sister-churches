import useRole from "@/hooks/useRoles";
import CampusTickets from "./CampusTickets";
import MyTickets from "./MyTickets";
import TeamTickets from "./TeamTickets";
import TabsComponent from "@/components/TabsComponent";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import { IoPersonOutline } from "react-icons/io5";
import ReactIf from "@/components/ReactIf";
import UniversalAddButton from "@/components/UniversalAddButton";

const Tickets = () => {
  const { isSuperAdmin, isHOD, isQC } = useRole();
  const navigation = useNavigation();
  const tabs = [
    {
      id: 1,
      title: "My Tickets",
      component: <MyTickets />,
    },
    {
      id: 2,
      title: "Team Tickets",
      component: <TeamTickets />,
    },
    {
      id: 3,
      title: "Campus Tickets",
      component: <CampusTickets />,
    },
  ];

  const returnTabs = () => {
    if (isSuperAdmin) return tabs;
    // if (isSuperAdmin) return tabs?.filter((tab) => tab.id === 3);
    if (isHOD) return tabs?.filter((tab) => tab.id === 1 || tab.id === 2);
    return tabs?.filter((tab) => tab.id === 1);
  };

  const allButtons = [
    {
      color: "bg-blue-400",
      icon: <IoPersonOutline size={28} color="white" />,
      handleClick: () => navigation.goto(`${ROUTES.ISSUE_TICKETS.path}`),
    },
    //     {
    //       color: "bg-blue-600",
    //       icon: <BiCalendarPlus size={28} color="white" />,
    //       handleClick: () =>
    //         navigation.goto(`${ROUTES.CGWC.path}/${CGWCId}/create-cgwc-session`),
    //     },
  ];
  return (
    <>
      <TabsComponent tabs={returnTabs()} />
      <ReactIf
        condition={isSuperAdmin || isQC}
        component={<UniversalAddButton options={allButtons} />}
      />
    </>
  );
};

export default Tickets;
