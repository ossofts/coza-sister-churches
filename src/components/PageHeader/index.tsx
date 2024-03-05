import useNavigation from "@/hooks/useNavigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const PageHeader = ({ title }: { title: string }) => {
  const { goBack } = useNavigation();

  return (
    <div
      className={twMerge(
        "fixed top-0 left-0 z-50 w-svw bg-white border-b border-b-gray-200 dark:bg-black dark:border-none flex justify-center items-center py-4"
      )}
    >
      <FaArrowLeftLong onClick={goBack} className="absolute left-3 text-lg" />
      <h2 className="font-medium text-gray-400">{title}</h2>
    </div>
  );
};

export default PageHeader;
