import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
}

export const RefreshIcon: FC<Props> = ({ className, hoverEffects }) => {
    return (
        <svg
            className={twMerge(
                "size-5 shrink-0",
                hoverEffects &&
                    "text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                className,
            )}
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={2}
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none">
            <path
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
