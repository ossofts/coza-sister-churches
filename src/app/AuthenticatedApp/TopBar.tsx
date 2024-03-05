import ReactIf from "@/components/ReactIf";
import { useCurrentPath } from "@/hooks/useCurrentPath";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";
import { FaArrowLeftLong } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { IoMdHelp } from "react-icons/io";
import { Link } from "react-router-dom";
import AvatarComponent from "@/components/AvatarComponent";
import useUserStore from "@/store/userStore";
import { getFirstLetterCaps } from "@/utils/textFormatters";
// import useAppContext from "@/contexts/AppContext";
import { useGetLatestService } from "@/services/service";

const email = import.meta.env.VITE_SUPPORT_EMAIL;
const TopBar = () => {
  const user = useUserStore((state) => state.user);
  const { goBack } = useNavigation();
  const { pathname } = useCurrentPath();
  const currentRoute = Object.values(ROUTES).filter((item) =>
    item.path.includes(":")
      ? item.path == `/${pathname?.split("/")[1]}`
      : item.path === pathname
  )[0];

  const {
    data: latestService,
    isLoading,
    error,
  } = useGetLatestService(user!.campus?._id);

  return (
    <div
      className={twMerge(
        "fixed top-0 z-20 w-svw bg-white border-b border-b-gray-200 dark:bg-black dark:border-none flex justify-center items-center py-4"
      )}
    >
      <ReactIf
        condition={pathname === ROUTES.HOME.path}
        component={
          <div
            className={twMerge("px-3 flex items-center w-full justify-between")}
          >
            <Link to={ROUTES.PROFILE.path}>
              <AvatarComponent
                src={String(user?.pictureUrl)}
                fallback={`${getFirstLetterCaps(user!.firstName)}${getFirstLetterCaps(user!.lastName)}`}
                extraClass="justify-self-start w-8 h-8 text-sm font-semibold"
              />
            </Link>

            <p className="text-gray-600 dark:text-gray-400 text-md font-light">
              {isLoading
                ? "Seaching for service..."
                : !error
                  ? latestService?.data?.name
                  : "No service today"}
            </p>

            <a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400 rounded-full h-7 w-7 text-2xl text-white dark:text-black flex justify-center items-center"
            >
              <IoMdHelp />
            </a>
          </div>
        }
        fallback={
          <>
            <FaArrowLeftLong
              onClick={goBack}
              className="absolute left-3 cursor-pointer text-lg"
            />
            <h2 className="font-medium text-gray-400">{currentRoute?.title}</h2>
          </>
        }
      />
    </div>
  );
};

export default TopBar;
