import { ReactNode } from "react";
import Nav from "./Nav";
import TopBar from "./TopBar";
import PullToRefresh from "pull-to-refresh-react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const handleRefresh = async () => window.location.reload();
  return (
    <PullToRefresh
      options={{ pullDownHeight: 100 }}
      onRefresh={handleRefresh}
      textReady={"Refresh"}
      textRefresh={"Refreshing..."}
    >
      <div className="h-svh pt-[55px] dark:bg-black">
        <TopBar />
        <div className="pb-16">{children}</div>
        <Nav />
      </div>
    </PullToRefresh>
  );
};

export default Layout;
