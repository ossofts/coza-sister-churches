import { Spinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import useAppContext from "@/contexts/AppContext";
import { COLORS } from "@/theme/colors";
import { IoLocationSharp } from "react-icons/io5";

const CampusLocation = () => {
  const {
    latestService: { data, isError, isLoading }
  } = useAppContext();

  return (
    <div className="flex justify-center">
      {isLoading ? (
        <Spinner />
      ) : (
        <ReactIf
          condition={data?.data !== undefined}
          component={
            <div className="flex items-center">
              <IoLocationSharp color={COLORS.gray} size={15} />
              <p className="font-semibold text-gray-600 text-sm ml-1">
                {!isError ? data?.data?.campus?.campusName : ""}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default CampusLocation;
