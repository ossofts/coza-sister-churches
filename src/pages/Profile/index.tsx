import AvatarComponent from "@/components/AvatarComponent";
import useUserStore, { useLogout } from "@/store/userStore";
import { getFirstLetterCaps } from "@/utils/textFormatters";
import { MdLogout } from "react-icons/md";

const Profile = () => {
  const user = useUserStore((state) => state.user);

  const logout = useLogout();
  return (
    <div className="flex flex-col pt-4 pb-8 items-center px-3">
      <AvatarComponent
        src={user?.pictureUrl ?? ""}
        fallback={`${getFirstLetterCaps(user!.firstName)}${getFirstLetterCaps(user!.lastName)}`}
        extraClass="w-20 h-20"
      />
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-center text-md font-bold">{`${user?.firstName} ${user?.lastName}`}</p>
        <p className="text-center text-sm font-semibold">{user?.campus?.campusName}</p>
        <p className="text-center text-xs text-neutral-500 dark:text-neutral-200 ">
          {user?.department?.departmentName}
        </p>
      </div>

      <div></div>
      <button
        onClick={logout}
        className="flex justify-center gap-2 items-center py-4 w-full mt-5 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded-md font-medium text-sm"
      >
        <MdLogout size={18} /> <span>Logout</span>
      </button>
    </div>
  );
};

export default Profile;
