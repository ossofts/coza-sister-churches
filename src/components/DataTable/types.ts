import { RequireOnlyOne } from "@/types/global.type";
import { ReactNode } from "react";

export type TableColumn<T> = {
  title: string;
  field: Extract<keyof T, string | number>;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: number;
  render?: (data: T) => ReactNode;
  columnCSSClass?: string;
  renderType?: RequireOnlyOne<{
    copy?: (data: T) => string;
    image?: (data: T) => { src: string; extraClass?: string; alt?: string };
    date?: (data: T) => string;
    datebox?: (data: T) => string;
    clockIn?: (data: T) => string;
    clockOut?: (data: T) => string;
    hoursDiff?: (data: T) => {
      clockIn: string;
      clockOut: string;
    };
    name?: (data: T) => {
      avatar?: boolean;
      pictureUrl?: string;
      firstName: string;
      lastName: string;
      fallback?: string;
    };
    score?: (data: T) => number;
    present?: (data: T) => { clockIn: string };
    late?: (data: T) => { clockOut: string };
    absent?: (data: T) => { clockIn: string; clockOut: string };
    user?: (data: T) => {
      pictureUrl?: string;
      firstName: string;
      lastName: string;
      departmentName: string;
    };
  }>;
};

// export type TableColumns<T> = TableColumn<T>[];

export type SortDirection = "ASC" | "DESC";
