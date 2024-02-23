import { UndefinedInitialDataOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type ErrorType = Error & {
  response: {
    data: {
      data: null | unknown;
      isError: boolean;
      isSuccessful: boolean;
      message: string;
      status: number;
    };
  };
};

export const customError = (error: Error) => {
  return error as ErrorType;
};

// type Response<T> = {
//   data: T;
//   isError: boolean;
//   isSuccessful: boolean;
//   message: string;
//   status: number;
// };

export type ServerResponse<T> = Promise<AxiosResponse<T>>;

export type QueryOptions<T> = Omit<
  UndefinedInitialDataOptions<AxiosResponse<T, unknown>>,
  "queryKey" | "queryFn"
>;
