import ReactIf from "@/components/ReactIf";
import useRole from "@/hooks/useRoles";
import DepartmentList from "./DepartmentList";
import CampusList from "./CampusList";

const WorkforceSummary = () => {
  const { isHOD, isSuperAdmin } = useRole();

  return (
    <div>
      <ReactIf condition={isHOD} component={<DepartmentList />} />
      <ReactIf condition={isSuperAdmin} component={<CampusList />} />
    </div>
  );
};

export default WorkforceSummary;
