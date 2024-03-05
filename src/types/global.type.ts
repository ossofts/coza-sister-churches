import { UndefinedInitialDataOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type Coordinates = {
  longitude: number;
  latitude: number;
};

export enum CREATE_SERVICE_ENUM {
  LONG = 7.505862981744857,
  LAT = 9.005452823370131,
  RANGE_TO_CLOCKIN = 100,
}

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
