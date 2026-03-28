import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
    fill?: boolean;
}

export const StarIcon: FC<Props> = ({ className, hoverEffects, fill }) => {
    return (
        <svg
            className={twMerge(
                "h-5 transition-[transform,color,fill]",
                hoverEffects &&
                    "text-gray-500 duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                fill && "fill-yellow-500 group-hover:fill-yellow-600 dark:fill-red-800 dark:group-hover:fill-red-700",
                className,
            )}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24">
            <path
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
