import { AiFillHome } from "react-icons/ai";
import { GoChecklist } from "react-icons/go";
import { FaCrown } from "react-icons/fa6";
import { ReactNode } from "react";
import ROUTES from ".";

const navList: {
  title: string;
  path: string;
  icon: ReactNode;
}[] = [
  {
    title: ROUTES.HOME.title,
    path: ROUTES.HOME.path,
    icon: <AiFillHome />
  },
  {
    title: ROUTES.ATTENDANCE.title,
    path: ROUTES.ATTENDANCE.path,
    icon: <GoChecklist />
  },
  {
    title: ROUTES.CGWC.title,
    path: ROUTES.CGWC.path,
    icon: <FaCrown />
  }
];

export default navList;
