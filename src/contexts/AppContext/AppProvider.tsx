/* eslint-disable @typescript-eslint/no-explicit-any */
import useUserStore from "@/store/userStore";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
import { useGetLatestService } from "../../services/service";
import { AxiosResponse } from "axios";
import { Service } from "./types";
import { useGetAttendance } from "@/services/attendance";
import { Attendance } from "@/store/types";

type Props = {
  children: React.ReactNode;
};

type AppContextType = {
  latestService: UseQueryResult<AxiosResponse<Service, any>, Error>;
  lastestAttendance: UseQueryResult<AxiosResponse<Attendance[], any>, Error>;
};

export const AppContext = createContext<AppContextType>({
  latestService: {} as UseQueryResult<AxiosResponse<Service, any>, Error>,
  lastestAttendance: {} as UseQueryResult<AxiosResponse<Attendance[], any>, Error>
});

const AppProvider = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);
  const latestService = useGetLatestService(user!.campus._id);
  const lastestAttendance = useGetAttendance(
    {
      userId: latestService.data?.data && (user?.userId as string), // Passing the userId an undefined value negates the call
      serviceId: latestService.data?.data?._id
    },
    {
      enabled: latestService.data?.data !== undefined
    }
  );
  const values = {
    latestService,
    lastestAttendance
  };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
