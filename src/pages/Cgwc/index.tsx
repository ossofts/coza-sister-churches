import { FullPageSpinner } from "@/components/Loaders";
import ReactIf from "@/components/ReactIf";
import { useGetCGWCs } from "@/services/cgwc";
import CgwcListItem from "./CgwcListItem";
import EmptyData from "@/components/EmptyData";

const Cgwc = () => {
  const { data, isLoading } = useGetCGWCs({});
  return (
    <ReactIf
      condition={!isLoading}
      component={
        <ReactIf
          condition={data?.data !== undefined}
          component={data?.data?.map((cgwc, idx) => <CgwcListItem key={idx} cgwc={cgwc} />)}
          fallback={<EmptyData />}
        />
      }
      fallback={<FullPageSpinner />}
    />
  );
};

export default Cgwc;
