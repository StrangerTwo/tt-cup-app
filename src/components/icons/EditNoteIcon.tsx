import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
    hoverEffects?: boolean;
    direction?: "left" | "up" | "right" | "down";
}

export const EditNoteIcon: FC<Props> = ({ className, hoverEffects, direction = "left" }) => {
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
            viewBox="0 0 24 24">
            <path
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
