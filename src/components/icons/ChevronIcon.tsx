import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
    direction?: "left" | "up" | "right" | "down";
}

export const ChevronIcon: FC<Props> = ({ className, hoverEffects, direction = "left" }) => {
    return (
        <svg
            className={twMerge(
                "h-5 transition-[transform,color]",
                hoverEffects &&
                    "text-gray-500 duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
                direction == "up" && "rotate-90",
                direction == "right" && "rotate-180",
                direction == "down" && "-rotate-90",
                className,
            )}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 12 24">
            <path d="M3 6l6 6l-6 6" />
        </svg>
    );
};
