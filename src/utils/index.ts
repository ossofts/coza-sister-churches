/* eslint-disable @typescript-eslint/no-explicit-any */
import { CGWC } from "@/store/types";
import { forEach, groupBy, merge } from "lodash";
import moment from "moment-timezone";

export { moment as momentJs };

export const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function timeDifference(date_1: string, date_2: string) {
  if (!date_1 || !date_2) {
    return { hours: "--:--", minutes: "--:--" };
  }

  const date1 = moment(date_1);
  const date2 = moment(date_2);

  const diff = Math.abs(date2.diff(date1));

  const hours = moment(diff).hours();
  const minutes = moment(diff).minutes();

  const hrsMins = `${moment.utc(diff).format("HH:mm")} Hr(s)`;

  return { hours, minutes, hrsMins };
}

export function timeFormat(time?: string | Date, format = "MMM Do YYYY") {
  if (!time) return "";
  return moment(time).tz(deviceTimezone)?.format(format);
}

export function timeFormatDifference(date: string) {
  if (isThisYear(date)) {
    return timeFormat(date, "MMM D, hh:mm A");
  }

  return timeFormat(date, "MMM D, YYYY hh:mm A");
}

export function isThisYear(date: string) {
  return moment(date)?.format("YY") === moment(new Date())?.format("YY");
}

export const sortByDate = (arrObject: any[] | [], key: string) => {
  return [...arrObject]?.sort((a, b) => moment(b[key]).unix() - moment(a[key]).unix());
};

export function mergeDuplicatesByKey<T>(array: any[], key: keyof T = "_id" as keyof T) {
  const grouped = groupBy(array, key);

  const merged: any[] = [];

  forEach(grouped, (group) => {
    const obj = merge({}, ...group);
    merged.push(obj);
  });

  return merged;
}

export const assertCGWCActive = (cgwc: CGWC) => {
  return moment(moment(cgwc?.endDate)).diff(moment()) > 0;
};

export const sortStringAscending = (arrObject?: any[], key?: string) => {
  if (arrObject && key) return [...arrObject].sort((a, b) => (a[key] > b[key] ? 1 : -1));
  return [];
};
