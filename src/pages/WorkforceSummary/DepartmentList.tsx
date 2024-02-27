import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import EmptyData from "@/components/EmptyData";
import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import useRole from "@/hooks/useRoles";
import { useGetUsers } from "@/services/account";
import { User } from "@/store/types";
import { useParams } from "react-router-dom";

const DepartmentList = () => {
  const { department_id } = useParams();
  const {
    user: { department },
  } = useRole();
  const columns: TableColumn<User>[] = [
    {
      title: "User",
      field: "firstName",
      renderType: {
        user: (data) => ({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }),
      },
    },
    {
      title: "Status",
      field: "status",
      renderType: {
        badge: (data) => ({
          children: data.status || "ACTIVE",
          status: data.status || "active",
        }),
      },
    },
  ];

  const { data, isLoading, isFetching } = useGetUsers(
    { departmentId: department_id ?? department?._id },
    {}
  );
  if (isLoading) return <FullPageSpinner />;
  return (
    <div>
      <ReactIf
        condition={data?.data !== undefined && data?.data?.length > 0}
        component={
          <DataTable
            columns={columns}
            data={data?.data as User[]}
            isLoading={isLoading || isFetching}
            showHeader={false}
          />
        }
        fallback={<EmptyData />}
      />
    </div>
  );
};

export default DepartmentList;
