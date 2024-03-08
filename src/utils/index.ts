/* eslint-disable @typescript-eslint/no-explicit-any */
import { CGWC } from "@/store/types";
import { findIndex, forEach, groupBy, merge } from "lodash";
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
  return [...arrObject]?.sort(
    (a, b) => moment(b[key]).unix() - moment(a[key]).unix()
  );
};

export function mergeDuplicatesByKey<T>(
  array: any[],
  key: keyof T = "_id" as keyof T
) {
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
  if (arrObject && key)
    return [...arrObject].sort((a, b) => (a[key] > b[key] ? 1 : -1));
  return [];
};

export const concatDateTimeToEpoc = (
  date: string | Date,
  time: string | Date
) => {
  const concatedTime = `${moment(date).format("YYYY-MM-DD")}T${time + ":00"}.000Z`;

  return date && !time
    ? moment(date).subtract(1, "hour").unix()
    : time && !date
      ? moment(time).subtract(1, "hour").unix()
      : time && date
        ? moment(concatedTime).subtract(1, "hour").unix()
        : null;
};

export const groupListByKey = (
  array: any[] = [],
  key: string,
  returnType: "entries" | "values" = "entries"
) => {
  const map: any = {};

  if (!array?.length || !array) {
    return [];
  }

  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] === "undefined" || !array[i]) continue;
    let keyInMap = array[i][key];

    if (
      key === "createdAt" ||
      key === "dateCreated" ||
      key === "updatedAt" ||
      key === "sortDateKey"
    ) {
      keyInMap = moment(array[i][key]).format("MMMM Do, YYYY");
    }

    if (map[keyInMap]) {
      map[keyInMap] = [...map[keyInMap], array[i]];
    } else {
      map[keyInMap] = [array[i]];
    }
  }
  return Object[returnType](map);
};

export const replaceArrayItemByNestedKey = (
  array: any[],
  newObject: any,
  keyValue: any[]
) => {
  if (!array || !array.length) return [];

  const originalList = array;
  const index = findIndex(originalList, keyValue);

  // Push if index doesn't exist
  if (index === -1) {
    return [newObject, ...originalList];
  }

  // Replace item at index
  originalList[index] = newObject;

  return originalList;
};
