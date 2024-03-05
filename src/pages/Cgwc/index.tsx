import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import { useGetCGWCs } from "@/services/cgwc";
import CgwcListItem from "./CgwcListItem";
import EmptyData from "@/components/EmptyData";
import AddButton from "@/components/AddButton";
import useRole from "@/hooks/useRoles";
import useNavigation from "@/hooks/useNavigation";
import ROUTES from "@/routes";

const Cgwc = () => {
  const { isSuperAdmin } = useRole();
  const navigation = useNavigation();
  const { data, isLoading } = useGetCGWCs({});

  const handleClick = () => {
    navigation.goto(ROUTES.CREATE_CGWC.path);
  };
  return (
    <>
      <ReactIf
        condition={!isLoading}
        component={
          <ReactIf
            condition={data?.data !== undefined && data?.data?.length > 0}
            component={data?.data?.map((cgwc, idx) => (
              <CgwcListItem key={idx} cgwc={cgwc} />
            ))}
            fallback={<EmptyData />}
          />
        }
        fallback={<FullPageSpinner />}
      />

      <ReactIf
        condition={isSuperAdmin}
        component={<AddButton onClick={handleClick} />}
      />
    </>
  );
};

export default Cgwc;
