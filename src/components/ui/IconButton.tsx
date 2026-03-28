import { FC, MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    noEffects?: boolean;
}

export const IconButton: FC<Props> = ({ className, onClick, children, noEffects }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={twMerge(
                "text-control-action inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm",
                !noEffects && "hover:bg-slate-300 dark:hover:bg-slate-600",
                className,
            )}>
            {children}
        </button>
    );
};
