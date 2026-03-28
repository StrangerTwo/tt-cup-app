import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
}

export const NewspaperIcon: FC<Props> = ({ className, hoverEffects }) => {
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
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
