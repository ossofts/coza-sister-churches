import { ReactNode } from "react";
import Nav from "./Nav";
import TopBar from "./TopBar";
import { PullToRefresh } from "react-js-pull-to-refresh";
import { Spinner } from "@/components/Loaders";
import useColorScheme from "@/hooks/useColorScheme";
import { COLORS } from "@/theme/colors";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const isDarkMode = useColorScheme();
  const handleRefresh = async () => window.location.reload();
  return (
    <PullToRefresh
      pullDownContent={<Spinner color={COLORS.primary} />}
      releaseContent={<Spinner color={COLORS.primary} />}
      refreshContent={<Spinner color={COLORS.primary} />}
      pullDownThreshold={200}
      onRefresh={handleRefresh}
      triggerHeight={300}
      backgroundColor={isDarkMode ? "black" : "white"}
      startInvisible={false}
    >
      <div className="h-svh overflow-auto pt-[55px] dark:bg-black">
        <TopBar />
        <div className="pb-16">{children}</div>
        <Nav />
      </div>
    </PullToRefresh>
  );
};

export default Layout;
