import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "./layout";

interface Props {
    isOpen?: boolean;
    once?: boolean;
    layerStep?: number;
    className?: string;
    thick?: boolean;
}

export const Divider = ({ isOpen, once, layerStep = 1, className, thick }: Props) => {
    const [mounted, setMounted] = useState(!once);
    const { borderColor } = useColorLayer(layerStep - 1);
    const { bgColor } = useColorLayer(layerStep);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isFilled = isOpen === undefined ? (once ? mounted : true) : isOpen;

    return (
        <hr
            className={twMerge(
                borderColor,
                "mx-auto h-0 opacity-100 transition-[opacity,width] duration-500",
                isFilled ? "w-full delay-200" : "w-1/6 border-0 opacity-0",
                thick && "h-1 rounded-sm border-0",
                thick && bgColor,
                className,
            )}
        />
    );
};
