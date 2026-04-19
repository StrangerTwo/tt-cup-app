import { FC, MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "./layout";

interface Props {
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    noEffects?: boolean;
}

export const IconButton: FC<Props> = ({ className, onClick, children, noEffects }) => {
    const { hoverBgColor } = useColorLayer();
    return (
        <button
            type="button"
            onClick={onClick}
            className={twMerge(
                "text-control-action inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm",
                !noEffects && hoverBgColor,
                className,
            )}>
            {children}
        </button>
    );
};
