import { ButtonHTMLAttributes, DOMAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { LoadingIcon } from "../icons";

interface Props {
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    children?: ReactNode;
}

export const SubmitButton: FC<Props> = ({ type = "submit", onClick, className, disabled, loading, children }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={twMerge(
                "flex items-center gap-2 self-end rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium focus:outline-none",
                disabled &&
                    "border-gray-200 bg-white  text-gray-900 hover:bg-slate-100 hover:text-blue-700 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-400  dark:hover:bg-slate-700 dark:hover:text-white",
                !disabled && "bg-blue-700 text-white hover:bg-blue-800  dark:bg-blue-600 dark:hover:bg-blue-700",
                loading && "cursor-progress",
                className,
            )}
            disabled={disabled}>
            {loading && <LoadingIcon className="size-[1em]" />}
            {children}
        </button>
    );
};
