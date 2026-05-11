import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    children: ReactNode;
    win?: boolean;
    lose?: boolean;
}

export const ScoreItem = ({ children, win, lose }: Props) => {
    return (
        <div
            className={twMerge(
                "inline-flex min-w-[1em] items-center justify-center",
                win && "bg-green-500 text-white dark:bg-green-800",
                lose && "bg-red-500 text-white dark:bg-red-800",
            )}>
            {children}
        </div>
    );
};
