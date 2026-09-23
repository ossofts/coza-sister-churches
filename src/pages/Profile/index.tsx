import AvatarComponent from "@/components/AvatarComponent";
import { useGetUserById } from "@/services/account";
import useUserStore, { useLogout } from "@/store/userStore";
import { getFirstLetterCaps } from "@/utils/textFormatters";
import { useEffect } from "react";
import { MdLogout } from "react-icons/md";
import { version } from "package.json";
import BadgeComponent from "@/components/BadgeComponent";
import useRole from "@/hooks/useRoles";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { isHOD, isInternshipHOD } = useRole();

  const { data: refreshedUser } = useGetUserById(user!.userId, {
    refetchOnMount: true,
  });

  const logout = useLogout();

  useEffect(() => {
    if (refreshedUser?.data) {
      setUser(refreshedUser?.data);
    }
     
  }, [refreshedUser?.data]);

  return (
    <div className="flex flex-col pt-4 pb-8 items-center px-3">
      <AvatarComponent
        src={user?.pictureUrl ?? ""}
        fallback={`${getFirstLetterCaps(user!.firstName)}${getFirstLetterCaps(user!.lastName)}`}
        extraClass="w-20 h-20 font-semibold text-4xl"
        badge={user?.isCGWCApproved}
      />
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-center text-md font-bold">{`${user?.firstName} ${user?.lastName}`}</p>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-200 ">
          {user?.email}
        </p>
        <p className="text-center text-sm font-semibold">
          {user?.campus?.campusName}
        </p>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-200 ">
          {user?.department?.departmentName}
        </p>
        <BadgeComponent status="info">
          {!isInternshipHOD && isHOD ? "Pastor" : user?.role.name}
        </BadgeComponent>
      </div>

      <div></div>
      <button
        onClick={logout}
        className="flex justify-center gap-2 items-center py-4 w-full mt-5 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded-md font-medium text-sm"
      >
        <MdLogout size={18} /> <span>Logout</span>
      </button>

      <p className="mt-5 text-center text-gray-300 text-xs">
        Version {version}
      </p>
    </div>
  );
};

export default Profile;
