import { FC, ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

import { MainLayoutCtx } from "../../../layout/MainLayoutContext";
import { ColorLayerContext, useColorLayer } from "./ColorLayer";

interface Props {
    className?: string;
    sidebarOpen: boolean;
    children?: ReactNode;
    navbarHeight?: number;
    absolute?: boolean;
}

const Sidebar: FC<Props> = ({ className, sidebarOpen, children, absolute, navbarHeight = 0 }) => {
    const { layer, bgColor, textColor } = useColorLayer();
    const { borderColor } = useColorLayer(2);
    const { sidebarExpanded } = useContext(MainLayoutCtx);

    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <aside
                className={twMerge(
                    "fixed right-full z-40 flex w-80 shrink-0 flex-col transition-[transform,width] duration-300",
                    "border-r xl:border-l",
                    "translate-x-0",
                    bgColor,
                    borderColor,
                    textColor,
                    !absolute && "md:static md:-translate-x-full",
                    sidebarOpen && "translate-x-full",
                    !absolute && sidebarOpen && " md:translate-x-0",
                    sidebarExpanded ? "w-64" : "w-20",
                    className,
                )}>
                <nav
                    className="sticky flex grow flex-col overflow-y-auto px-1.5 py-2 md:px-3 md:py-4"
                    style={{
                        top: navbarHeight,
                        maxHeight: `calc(100vh - ${navbarHeight}px)`,
                        minHeight: `calc(100vh - ${navbarHeight}px)`,
                    }}>
                    {children}
                </nav>
            </aside>
        </ColorLayerContext.Provider>
    );
};

export default Sidebar;
