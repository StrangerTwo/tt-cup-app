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
    const { sidebarExpanded } = useContext(MainLayoutCtx);

    const { layer } = useColorLayer();
    return (
        <aside
            className={twMerge(
                "fixed right-full z-40 flex w-80 shrink-0 flex-col bg-slate-50 transition-[transform,width] duration-300 dark:bg-slate-800",
                "border-r border-slate-200 dark:border-slate-600 xl:border-l",
                "translate-x-0",
                !absolute && "md:static md:-translate-x-full",
                sidebarOpen && "translate-x-full border-t",
                !absolute && sidebarOpen && " md:translate-x-0",
                sidebarExpanded ? "w-64" : "w-20",
                className,
            )}>
            <nav
                className="sticky flex grow flex-col overflow-y-auto px-3 py-4"
                style={{
                    top: navbarHeight,
                    maxHeight: `calc(100vh - ${navbarHeight}px)`,
                    minHeight: `calc(100vh - ${navbarHeight}px)`,
                }}>
                <ColorLayerContext.Provider value={{ layer }}>{children}</ColorLayerContext.Provider>
            </nav>
        </aside>
    );
};

export default Sidebar;
