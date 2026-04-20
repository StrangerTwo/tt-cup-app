import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
}

export const CheckCircleIcon: FC<Props> = ({ className, hoverEffects }) => {
    return (
        <svg
            className={twMerge(
                "size-5 shrink-0",
                hoverEffects &&
                    "text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                className,
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="2 2 20 20">
            <path
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
