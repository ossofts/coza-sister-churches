import DropDownMenuComponent from "@/components/DropDownMenuComponent";
import { useCurrentPath } from "@/hooks/useCurrentPath";
import navList from "@/routes/navList";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { IoMenu } from "react-icons/io5";
import { IoMdStopwatch } from "react-icons/io";
// import { MdOutlineChurch } from "react-icons/md";
// import { BiSolidFileExport } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { TbDatabaseCog } from "react-icons/tb";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import useRole from "@/hooks/useRoles";
import ReactIf from "@/components/ReactIf";

const Nav = () => {
  const { pathname } = useCurrentPath();
  const { goto } = useNavigation();
  const {
    isQC,
    isCampusPastor,
    isAdmin,
    isHOD,
    isGlobalPastor,
    isQcHOD,
    isSuperAdmin,
    isInternshipHOD,
    isCGWCApproved,
    isInternship,
  } = useRole();
  const allowMoreOptions =
    isQC ||
    isCampusPastor ||
    isAdmin ||
    isGlobalPastor ||
    isHOD ||
    isQcHOD ||
    isSuperAdmin ||
    isInternshipHOD ||
    isInternship;

  const moreOptions = [
    {
      label: (
        <button className="flex gap-2 items-center py-2 text-md">
          <FiUserPlus size={16} /> <span>Create User</span>
        </button>
      ),
      onClick: () => goto(ROUTES.CREATE_USER.path),
      roles: [isAdmin, isGlobalPastor, isSuperAdmin, isInternshipHOD],
    },
    {
      label: (
        <button className="flex gap-2 items-center py-2 text-md">
          <LuUsers size={16} /> <span>Create Department</span>
        </button>
      ),
      onClick: () => goto(ROUTES.CREATE_DEPARTMENT.path),
      roles: [isAdmin, isGlobalPastor, isSuperAdmin],
    },
    // {
    //   label: (
    //     <button className="flex gap-2 items-center py-2 text-md">
    //       <MdOutlineChurch size={16} /> <span>Service Management</span>
    //     </button>
    //   ),
    //   onClick: () => goto(ROUTES.SERVICE_MANAGEMENT.path),
    //   roles: [isAdmin, isGlobalPastor, isSuperAdmin]
    // },
    {
      label: (
        <button className="flex gap-2 items-center py-2 text-md">
          <IoMdStopwatch size={16} /> <span>Manual Clock In</span>
        </button>
      ),
      onClick: () => goto(ROUTES.MANUAL_CLOCK_IN.path),
      roles: [isQC, isQcHOD, isSuperAdmin, isInternship, isInternshipHOD],
    },
    {
      label: (
        <button className="flex gap-2 items-center py-2 text-md">
          <TbDatabaseCog size={16} /> <span>Workforce Summary</span>
        </button>
      ),
      onClick: () => goto(ROUTES.WORKFORCE_SUMMARY.path),
      roles: [isHOD, isSuperAdmin],
    },
    // {
    //   label: (
    //     <button className="flex gap-2 items-center py-2 text-md">
    //       <BiSolidFileExport size={16} /> <span>Export Data</span>
    //     </button>
    //   ),
    //   onClick: () => goto(ROUTES.EXPORT_DATA.path),
    //   roles: [isQC, isCampusPastor, isAdmin, isGlobalPastor, isQcHOD, isSuperAdmin, isInternshipHOD]
    // }
  ];

  const approvedNav = () => {
    if (!isCGWCApproved)
      return navList.filter((nav) => nav.title !== ROUTES.CGWC.title);

    return navList;
  };
  return (
    <nav
      className={twMerge(
        "fixed bottom-0 z-10 bg-white dark:bg-black pb-3 pt-2 border-t border-t-gray-200 dark:border-t-gray-500 grid items-center w-svw",
        allowMoreOptions && isCGWCApproved
          ? "grid-cols-4"
          : !allowMoreOptions && !isCGWCApproved
            ? "grid-cols-2"
            : "grid-cols-3"
      )}
    >
      {approvedNav().map((item, idx) => (
        <Link
          className={twMerge(
            "flex flex-col items-center gap-[5px]",
            pathname === item.path
              ? "text-brandColor-600 dark:text-brandColor-500"
              : ""
          )}
          key={idx}
          to={item.path}
        >
          <span className="text-[22px]">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.title}</span>
        </Link>
      ))}

      <ReactIf
        condition={allowMoreOptions}
        component={
          <DropDownMenuComponent
            trigger={
              <button
                className={twMerge("flex flex-col items-center gap-[5px]")}
              >
                <span className="text-[22px]">
                  <IoMenu />
                </span>
                <span className="text-[10px] font-semibold">More</span>
              </button>
            }
            menuItems={moreOptions?.filter((item) =>
              item?.roles?.includes(true)
            )}
          />
        }
      />
    </nav>
  );
};

export default Nav;
