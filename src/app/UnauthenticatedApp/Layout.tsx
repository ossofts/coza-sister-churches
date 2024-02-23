import { ReactNode } from "react";
import Logo from "@/components/Logo";
import { useCurrentPath } from "@/hooks/useCurrentPath";
import ReactIf from "@/components/ReactIf";

const APP_NAME = import.meta.env.VITE_APP_NAME;
const APP_SLOGAN = import.meta.env.VITE_APP_SLOGAN;

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  const { pathname } = useCurrentPath();
  const welcomePage = pathname === "/";
  return (
    <div className="py-10 flex flex-col items-center gap-5 max-w-[560px] mx-auto rounded-3xl min-h-svh">
      <Logo />
      <ReactIf
        condition={welcomePage}
        component={
          <>
            <h1 className="text-xl font-bold text-center">{APP_NAME}</h1>
            <p className="text-gray-400 text-sm text-center">{APP_SLOGAN}</p>
          </>
        }
        fallback={null}
      />

      <div className="flex-1 w-full h-full px-5">{children}</div>
    </div>
  );
};

export default Layout;
