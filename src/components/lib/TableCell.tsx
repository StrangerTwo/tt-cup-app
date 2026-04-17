import { TdHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = (props: Props) => {
    return <td {...props} className={twMerge("whitespace-nowrap px-2 py-1.5 md:px-6 md:py-3", props.className)} />;
};
