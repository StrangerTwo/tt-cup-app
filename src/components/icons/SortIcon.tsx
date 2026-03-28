import { FC } from "react";
import { twMerge } from "tailwind-merge";

export enum SortMode {
    ASC = -1,
    DESC = 1,
}

interface Props {
    className?: string;
    mode?: SortMode;
}

export const SortIcon: FC<Props> = ({ className, mode }) => {
    return (
        <svg
            className={twMerge("size-3", (mode === SortMode.ASC || mode === SortMode.DESC) && "h-1.5", className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox={mode === SortMode.ASC ? "0 0 24 12" : mode === SortMode.DESC ? "0 12 24 12" : "0 0 24 24"}>
            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
        </svg>
    );
};
