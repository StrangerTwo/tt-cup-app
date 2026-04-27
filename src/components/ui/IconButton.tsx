import { FC, MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "./layout";

interface Props {
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    noEffects?: boolean;
    layerStep?: number;
    border?: boolean;
    type?: "submit" | "reset" | "button";
}

export const IconButton: FC<Props> = ({
    className,
    onClick,
    children,
    noEffects,
    layerStep = 0,
    border,
    type = "button",
}) => {
    const { hoverBgColor, borderColor } = useColorLayer(layerStep);
    return (
        <button
            type={type}
            onClick={onClick}
            className={twMerge(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm",
                !noEffects && hoverBgColor,
                border && "border",
                border && borderColor,
                className,
            )}>
            {children}
        </button>
    );
};
