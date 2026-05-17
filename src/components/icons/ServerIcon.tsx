import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
}

export const ServerIcon: FC<Props> = ({ className, hoverEffects }) => {
    return (
        <svg
            className={twMerge(
                "size-5 shrink-0",
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
                d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
