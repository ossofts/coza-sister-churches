import { ReactNode } from "react";
import Nav from "./Nav";
import TopBar from "./TopBar";
import ReactPullToRefresh from "react-pull-to-refresh";
import { Spinner } from "@/components/Loaders";
import { COLORS } from "@/theme/colors";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const handleRefresh = async () => window.location.reload();
  return (
    <ReactPullToRefresh
      onRefresh={handleRefresh}
      loading={
        <span className="flex justify-center">
          <Spinner color={COLORS.primary} />{" "}
        </span>
      }
    >
      <div className="h-svh pt-[55px] dark:bg-black">
        <TopBar />
        <div className="pb-16">{children}</div>
        <Nav />
      </div>
    </ReactPullToRefresh>
  );
};

export default Layout;
