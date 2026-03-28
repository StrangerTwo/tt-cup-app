import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ColorLayerContext, useColorLayer } from "../layout";

interface Props {
    className?: string;
    isOpen: boolean;
    children: ReactNode;
}

export const AccordionContent: FC<Props> = ({ className, isOpen, children }) => {
    const [fullHeight, setFullHeight] = useState(200);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { layer, bgColor, textColor } = useColorLayer(-1);

    useEffect(() => {
        if (containerRef.current) {
            setFullHeight(containerRef.current.scrollHeight);
        }
    }, [children]);
    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <div
                className={twMerge(
                    bgColor,
                    textColor,
                    "box-content overflow-hidden transition-[max-height,background,padding]",
                    className,
                )}
                style={{ maxHeight: isOpen ? fullHeight : 0 }}
                ref={containerRef}>
                {children}
            </div>
        </ColorLayerContext.Provider>
    );
};
