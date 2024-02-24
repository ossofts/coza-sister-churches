import TabsComponent from "@/components/TabsComponent";
import MyAttendance from "./MyAttendance";
import TeamAttendance from "./TeamAttendance";
import useRoles from "@/hooks/useRoles";
import CampusAttendance from "./CampusAttendance";

const Attendance = () => {
  const { isSuperAdmin, isHOD } = useRoles();

  const tabs = [
    {
      id: 1,
      title: "My Attendance",
      component: <MyAttendance />,
    },
    {
      id: 2,
      title: "Team Attendance",
      component: <TeamAttendance />,
    },
    {
      id: 3,
      title: "Campus Attendance",
      component: <CampusAttendance />,
    },
  ];

  const returnTabs = () => {
    if (isSuperAdmin) return tabs?.filter((tab) => tab.id === 3);
    if (isHOD) return tabs?.filter((tab) => tab.id === 1 || tab.id === 2);
    return tabs?.filter((tab) => tab.id === 1);
  };
  return <TabsComponent tabs={returnTabs()} />;
};

export default Attendance;
