import TabsComponent from "@/components/TabsComponent";
import MyAttendance from "./MyAttendance";
import TeamAttendance from "./TeamAttendance";
import ReactIf from "@/components/ReactIf";
import useRoles from "@/hooks/useRoles";

const Attendance = () => {
  const { isCampusPastor } = useRoles();

  const tabs = [
    {
      id: 1,
      title: "My Attendance",
      component: <MyAttendance />
    },
    {
      id: 2,
      title: "Team Attendance",
      component: <TeamAttendance />
    }
  ];
  return (
    <ReactIf
      condition={isCampusPastor}
      component={<TabsComponent tabs={tabs} />}
      fallback={<TabsComponent tabs={tabs?.filter((item) => item.id === 1)} />}
    />
  );
};

export default Attendance;
