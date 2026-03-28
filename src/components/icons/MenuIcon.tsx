import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    className?: string;
}

export const MenuIcon: FC<Props> = ({ className }) => {
    return (
        <svg
            className={twMerge("size-5", className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
            />
        </svg>
    );
};
