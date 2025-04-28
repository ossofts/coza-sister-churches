import ConfirmationModal from "@/components/ConfirmationModal";
import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import EmptyData from "@/components/EmptyData";
import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import showAlert from "@/hooks/useAlert";
import useRole from "@/hooks/useRoles";
import { useDeleteUserByEmail, useGetUsers } from "@/services/account";
import { User } from "@/store/types";
import { customError } from "@/types/global.type";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

type DUser = User & { departmentName: string };

const DepartmentList = () => {
  const { department_id } = useParams();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DUser>();
  const deleteMutation = useDeleteUserByEmail();

  const handleDelete = async (email: string | undefined) => {
    try {
      await deleteMutation.mutateAsync(String(email));
      showAlert("success", "Account deleted successfully");
      setOpen(false);
      setSelected(undefined);
    } catch (error) {
      showAlert(
        "error",
        customError(error as Error)?.response?.data?.message ??
          "Oops! Something went wrong."
      );
    }
  };

  const openConfirmationModal = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: DUser
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelected(user);
    setOpen(true);
  };
  const {
    user: { department },
  } = useRole();
  const columns: TableColumn<DUser>[] = [
    {
      title: "User",
      field: "firstName",
      renderType: department_id
        ? {
            user: (data) => ({
              firstName: data.firstName,
              lastName: data.lastName,
              departmentName: data?.departmentName,
            }),
          }
        : {
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
    {
      title: "",
      field: "email",
      render: (data) => (
        <button
          onClick={(e) => openConfirmationModal(e, data)}
          className="text-red-500 min-h-8 grid place-content-center"
        >
          <Trash2 size={18} />
        </button>
      ),
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
            data={data?.data as DUser[]}
            isLoading={isLoading || isFetching}
            showHeader={false}
          />
        }
        fallback={<EmptyData />}
      />
      {open && (
        <ConfirmationModal
          {...{
            open,
            setOpen,
            description: (
              <span>
                Are you sure you want to delete{" "}
                {<span className="text-red-500">{selected?.email}</span>}?
              </span>
            ),
            confirmationText: "Yes, delete",
            title: `Delete User`,
            onConfirmationClick: () => handleDelete(selected?.email),
          }}
        />
      )}
    </div>
  );
};

export default DepartmentList;
