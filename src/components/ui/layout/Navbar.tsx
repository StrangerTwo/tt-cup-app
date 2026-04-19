import { FC, ReactNode, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

import { ColorLayerContext, useColorLayer } from "./ColorLayer";

interface Props {
    onHeightChange?: (height: number) => void;
    startChildren?: ReactNode;
    endChildren?: ReactNode;
    children?: ReactNode;
}

export const Navbar: FC<Props> = ({ onHeightChange, startChildren, children, endChildren }) => {
    const { layer, bgColor, textColor } = useColorLayer();
    const { borderColor } = useColorLayer(2);

    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav || !onHeightChange) return;
        const fn = () => {
            onHeightChange(nav.scrollHeight);
        };
        fn();
        nav.addEventListener("resize", fn);
        return () => {
            nav.removeEventListener("resize", fn);
        };
    }, [onHeightChange]);

    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <nav
                ref={navRef}
                className={twMerge(
                    "fixed start-0 top-0 z-50 w-full border-b  bg-white  dark:bg-slate-800",
                    borderColor,
                    bgColor,
                    textColor,
                )}>
                <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-1.5 md:p-4 2xl:max-w-screen-2xl">
                    <div className="flex w-32 justify-start gap-2 md:w-48">{startChildren}</div>
                    {children}
                    <div className="flex w-32 justify-end gap-2 md:order-2 md:w-48">{endChildren}</div>
                </div>
            </nav>
        </ColorLayerContext.Provider>
    );
};
