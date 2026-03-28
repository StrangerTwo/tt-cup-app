import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
    direction?: "left" | "up" | "right" | "down";
}

export const ArrowIcon: FC<Props> = ({ className, hoverEffects, direction = "left" }) => {
    return (
        <svg
            className={twMerge(
                "size-5 transition-[transform,color]",
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
            viewBox="0 0 24 24">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.75 19.5 8.25 12l7.5-7.5"
            />
        </svg>
    );
};
