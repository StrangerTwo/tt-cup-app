import { TdHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import { cellClass } from "./TableHeadingCell";

type Props = TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = (props: Props) => {
    return <td {...props} className={twMerge("whitespace-nowrap align-middle", cellClass, props.className)} />;
};
