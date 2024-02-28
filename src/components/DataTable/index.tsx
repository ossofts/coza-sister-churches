import React from "react";
import { twMerge } from "tailwind-merge";
import { TableColumn } from "./types";
import CustomTableRender from "./CustomRender";
import { FullPageSpinner } from "../Loaders";

type Props<T> = {
  data: Array<T>;
  columns: Array<TableColumn<T>>;
  onRowClick?: (data: T) => void;
  totalItems?: number;
  extraClass?: string;
  extraRowClass?: string;
  rowRenderExtraClass?: { [k in number]: string };
  isLoading?: boolean;
  showPagination?: boolean;
  showHeader?: boolean;
  showSN?: boolean;
};

export default function DataTable<T = object>(props: Props<T>) {
  const { data, columns } = props;
  const { extraClass = "", isLoading } = props;
  const { showHeader = true, showSN = false } = props;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  // const tableWidth = window.innerWidth - 32;
  // const dashboardContent = _domById("dashboardContent");

  return (
    <div
    // className="overflow-x-auto h-full"
    // style={{ maxWidth: dashboardContent?.offsetWidth! - 32 }}
    >
      <table className={twMerge(`w-full`, extraClass)}>
        {showHeader ? (
          <React.Fragment>
            <colgroup>
              {/* Serial No.  */}
              {showSN && <col style={{ width: 40, textAlign: "center" }}></col>}

              {columns.map((column, i) => {
                if (column.width) {
                  return (
                    <col
                      key={i}
                      style={{ width: column.width, padding: 20 }}
                    ></col>
                  );
                }
                return <col key={i}></col>;
              })}
            </colgroup>
            <thead className="sticky -top-2 border-b border-neutral-400 dark:border-neutral-400 bg-white pt-3 dark:bg-black z-[2]">
              {/* <thead className="bg-white border-b border-gray-200"> */}
              <tr className="px-4">
                {/* Serial No.  */}
                {showSN && <th style={{ textAlign: "center" }}>#</th>}

                {columns.map((column, i) => {
                  const {
                    align = "left",
                    columnCSSClass = "",
                    // field
                  } = column;

                  return (
                    <th
                      key={i}
                      className={`${columnCSSClass} text-xs font-medium py-4 px-2 text-center`}
                      style={{ textAlign: align }}
                      // onClick={() => onSortColumnChange?.(String(field), "ASC")}
                    >
                      {column.title}
                    </th>
                  );
                })}
              </tr>
            </thead>
          </React.Fragment>
        ) : null}

        <tbody>
          <TableRows
            data={data}
            columns={columns}
            showSN={showSN}
            onRowClick={props.onRowClick}
            extraRowClass={props.extraRowClass}
            rowRenderExtraClass={props.rowRenderExtraClass}
          />
        </tbody>
      </table>
    </div>
  );
}

export function TableRows(
  props: Pick<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Props<any>,
    | "columns"
    | "data"
    | "showSN"
    | "extraRowClass"
    | "onRowClick"
    | "rowRenderExtraClass"
  >
) {
  const { data: items, columns, showSN } = props;

  if (!items.length) {
    return (
      <tr>
        <td
          colSpan={columns.length}
          className="font-medium text-base text-gray-700 px-2 py-4"
        >
          Sorry, No matching records found
        </td>
      </tr>
    );
  }

  return (
    <React.Fragment>
      {items.map((rowItem, i) => {
        const renderClass = props.rowRenderExtraClass?.[i];

        return (
          <tr
            key={`row-${i}`}
            className={twMerge(
              "border-b border-neutral-100 dark:border-neutral-900",
              props.onRowClick && "cursor-pointer",
              props.extraRowClass,
              renderClass
            )}
            onClick={() => props.onRowClick?.(rowItem)}
          >
            {/* Serial No.  */}
            {showSN && <td style={{ textAlign: "center" }}>{i + 1}</td>}

            {columns.map((column, j) => {
              const { align = "center", columnCSSClass = "" } = column;

              return (
                <td
                  key={`col-${j}`}
                  className={twMerge(`py-4 px-2`, columnCSSClass)}
                  style={{ textAlign: align }}
                >
                  {/* {column.render ? column.render(rowItem) : rowItem[column.field]} */}
                  <CustomTableRender column={column} rowItem={rowItem} />
                </td>
              );
            })}
          </tr>
        );
      })}
    </React.Fragment>
  );
}
