import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ArrowIcon } from "../../icons";
import { Card } from "../Card";
import { IconButton } from "../IconButton";
import { useColorLayer } from "../layout";
import { AccordionContent } from "./AccordionContent";

interface Props {
    isOpen?: boolean;
    className?: string;
    children: ReactNode;
    sneakPeak?: ReactNode;
    title: ReactNode;
    size?: "lg" | "sm";
    layerStep?: number;
}

export const Accordion: FC<Props> = ({
    isOpen: initialIsOpen = false,
    className,
    children,
    title,
    sneakPeak,
    size,
    layerStep,
}) => {
    const [isOpen, setOpen] = useState(initialIsOpen);
    const [fullSkeakPeak, setFullSneakPeak] = useState(200);
    const sneakPeekRef = useRef<HTMLDivElement | null>(null);
    const { bgColor, borderColor } = useColorLayer(layerStep);

    useEffect(() => {
        setOpen(initialIsOpen);
    }, [initialIsOpen]);

    useEffect(() => {
        if (sneakPeekRef.current) {
            setFullSneakPeak(sneakPeekRef.current.scrollWidth);
        }
    }, [sneakPeak]);

    return (
        <Card className={twMerge("overflow-hidden p-0 md:p-0", className)} layerStep={layerStep}>
            <div
                className={twMerge(
                    "flex items-center justify-between transition-[margin]",
                    size === "sm" ? "px-2 pt-2" : "p-4 pb-0",
                    isOpen && "mb-4",
                    isOpen && size === "sm" && "mb-2",
                )}>
                {title}
                <div className="flex items-center gap-2">
                    <div
                        className="flex overflow-hidden transition-[max-width]"
                        style={{ maxWidth: isOpen ? 0 : fullSkeakPeak }}
                        ref={sneakPeekRef}>
                        {sneakPeak}
                    </div>
                    <IconButton className={twMerge(size === "sm" && "size-8")} onClick={() => setOpen((x) => !x)}>
                        <ArrowIcon direction={isOpen ? "up" : "down"} />
                    </IconButton>
                </div>
            </div>
            <hr
                className={twMerge(
                    borderColor,
                    "h-0 transition-[opacity,border-width] duration-100",
                    !isOpen && "border-0 opacity-0 duration-150",
                )}
            />
            <AccordionContent
                isOpen={isOpen}
                className={twMerge(
                    !isOpen && bgColor,
                    isOpen ? (size === "sm" ? "px-3 py-2" : "p-4") : size === "sm" ? "pt-2" : "pt-4",
                )}>
                {children}
            </AccordionContent>
        </Card>
    );
};
