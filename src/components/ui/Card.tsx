import { FC, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { ColorLayerContext, useColorLayer } from "../ui/layout/ColorLayer";

interface Props {
    className?: string;
    style?: HTMLAttributes<HTMLDivElement>["style"];
    children?: ReactNode;
    hoverEffects?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
    layerStep?: number;
}

export const Card: FC<Props> = ({ className, style, children, hoverEffects, onClick, layerStep }) => {
    const { layer, bgColor, borderColor, hoverBgColor, textColor } = useColorLayer(layerStep);
    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <div
                className={twMerge(
                    bgColor,
                    borderColor,
                    textColor,
                    "rounded-lg border p-4 shadow-sm",
                    hoverEffects && hoverBgColor,
                    onClick && "cursor-pointer",
                    className,
                )}
                style={style}
                onClick={onClick}>
                {children}
            </div>
        </ColorLayerContext.Provider>
    );
};
