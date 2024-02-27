import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import useNavigation from "@/hooks/useNavigation";
import useRole from "@/hooks/useRoles";
import ROUTES from "@/routes";
import { useGetDepartmentsByCampusId } from "@/services/department";
import { Department } from "@/store/types";
import { timeFormat } from "@/utils";

const CampusList = () => {
  const {
    user: { campus },
  } = useRole();
  const navigation = useNavigation();
  const columns: TableColumn<Department>[] = [
    {
      title: "Department",
      field: "departmentName",
      render: (data) => data.departmentName,
    },
    {
      title: "Created At",
      field: "createdAt",
      render: (data) => timeFormat(data.createdAt),
    },
  ];

  const { data, isLoading, isFetching } = useGetDepartmentsByCampusId(
    campus!._id,
    {}
  );

  const onRowClick = (data: Department) => {
    navigation.goto(`${ROUTES.WORKFORCE_SUMMARY.path}/${data?._id}`);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data?.data as Department[]}
        isLoading={isLoading || isFetching}
        showHeader={true}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default CampusList;
