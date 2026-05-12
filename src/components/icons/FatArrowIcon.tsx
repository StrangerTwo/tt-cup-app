import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
    direction?: "left" | "up" | "right" | "down";
}

export const FatArrowIcon: FC<Props> = ({ className, hoverEffects, direction = "left" }) => {
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
            strokeWidth={2.5}
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
