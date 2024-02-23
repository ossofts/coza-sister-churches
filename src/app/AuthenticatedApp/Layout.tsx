import { ReactNode } from "react";
import Nav from "./Nav";
import TopBar from "./TopBar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="h-svh pt-[55px] dark:bg-black">
      <TopBar />
      <div className="pb-16">{children}</div>
      <Nav />
    </div>
  );
};

export default Layout;
