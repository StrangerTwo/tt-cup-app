import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ColorLayerContext, useColorLayer } from "../layout";

interface Props {
    className?: string;
    size?: "lg" | "sm";
    isOpen: boolean;
    children: ReactNode;
}

export const AccordionContent: FC<Props> = ({ className, size, isOpen, children }) => {
    const [fullHeight, setFullHeight] = useState(200);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { bgColor: cardBgColor } = useColorLayer(0);
    const { layer, bgColor, textColor } = useColorLayer(-1);

    const updateHeight = useCallback(() => {
        if (!containerRef.current) return;
        setFullHeight(containerRef.current.scrollHeight);
    }, []);

    useEffect(() => {
        const x = setTimeout(updateHeight, 10);
        const y = setTimeout(updateHeight, 150);
        return () => {
            clearTimeout(x);
            clearTimeout(y);
        };
    }, [children, isOpen, updateHeight]);

    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <div
                className={twMerge(
                    isOpen ? bgColor : cardBgColor,
                    textColor,
                    "box-content overflow-hidden transition-[max-height,background-color] duration-300 will-change-[max-height]",
                    className,
                )}
                style={{ maxHeight: isOpen ? fullHeight : 0 }}
                ref={containerRef}>
                <div
                    className={twMerge(
                        "transition-[margin] duration-300",
                        size === "sm" ? "mx-3 mb-2" : "m-4",
                        !isOpen && "mx-0",
                    )}>
                    {children}
                </div>
            </div>
        </ColorLayerContext.Provider>
    );
};
