import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
}

export const QueueListIcon: FC<Props> = ({ className, hoverEffects }) => {
    return (
        <svg
            className={twMerge(
                "size-5",
                hoverEffects &&
                    "text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                className,
            )}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
                stroke="currentColor"
                d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11a2.5 2.5 0 0 1 0 5h-11A2.5 2.5 0 0 1 2 4.5ZM2.75 9.083a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 12.663a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2.75 16.25a.75.75 0 0 0 0 1.5h14.5a.75.75 0 1 0 0-1.5H2.75Z"></path>
        </svg>
    );
};
