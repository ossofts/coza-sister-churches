import { AiFillHome } from "react-icons/ai";
import { GoChecklist } from "react-icons/go";
import { FaCrown } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";

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
    icon: <AiFillHome />,
  },
  {
    title: ROUTES.ATTENDANCE.title,
    path: ROUTES.ATTENDANCE.path,
    icon: <GoChecklist />,
  },
  {
    title: ROUTES.TICKETS.title,
    path: ROUTES.TICKETS.path,
    icon: <LuTicket />,
  },
  {
    title: ROUTES.CGWC.title,
    path: ROUTES.CGWC.path,
    icon: <FaCrown />,
  },
];

export default navList;
