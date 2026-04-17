import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

import { SortIcon } from "../icons/SortIcon";
import { Sort, TableHeading } from "./Table";

interface TableCellProps<T> {
    heading: TableHeading<T>;
    setSort: React.Dispatch<React.SetStateAction<Sort<T> | undefined>>;
    sort: Sort<T> | undefined;
    onClick?: MouseEventHandler<HTMLDivElement>;
}
export const cellClass = "px-1 py-1.5 first:pl-2 last:pr-2 md:px-6 md:py-3 md:first:pl-6 md:first:pr-6";

export const TableHeadingCell = <T,>({ heading, setSort, sort, onClick }: TableCellProps<T>) => {
    return (
        <th scope="col" className={cellClass}>
            <div
                className={twMerge(
                    "inline-flex items-center justify-center gap-1.5",
                    heading.key && onClick && "cursor-pointer",
                    sort?.key === heading.key && "text-gray-900 dark:text-gray-50",
                    heading.className,
                )}
                onClick={onClick}>
                {heading.label}
                {heading.key && onClick && (
                    <SortIcon className="min-w-max" mode={sort?.key === heading.key ? sort.mode : undefined} />
                )}
            </div>
        </th>
    );
};
