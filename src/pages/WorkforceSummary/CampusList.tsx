import ConfirmationModal from "@/components/ConfirmationModal";
import DataTable from "@/components/DataTable";
import { TableColumn } from "@/components/DataTable/types";
import showAlert from "@/hooks/useAlert";
import useNavigation from "@/hooks/useNavigation";
import useRole from "@/hooks/useRoles";
import ROUTES from "@/routes";
import {
  useDeleteDepartmentById,
  useGetDepartmentsByCampusId,
} from "@/services/department";
import { Department } from "@/store/types";
import { customError } from "@/types/global.type";
import { timeFormat } from "@/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const CampusList = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Department>();
  const deleteMutation = useDeleteDepartmentById();

  const handleDelete = async (id: string | undefined) => {
    try {
      await deleteMutation.mutateAsync(String(id));
      showAlert("success", "Department deleted successfully");
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
    department: Department
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setSelected(department);
    setOpen(true);
  };

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
    {
      title: "",
      field: "_id",
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

      {open && (
        <ConfirmationModal
          {...{
            open,
            setOpen,
            description: (
              <span>
                Are you sure you want to delete{" "}
                {
                  <span className="text-red-500">
                    {selected?.departmentName}
                  </span>
                }
                ?
              </span>
            ),
            confirmationText: "Yes, delete",
            title: `Delete User`,
            onConfirmationClick: () => handleDelete(selected?._id),
          }}
        />
      )}
    </div>
  );
};

export default CampusList;
