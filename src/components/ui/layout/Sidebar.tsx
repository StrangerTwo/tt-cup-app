import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { Divider } from "../Divider";
import { ColorLayerContext, useColorLayer } from "./ColorLayer";

interface Props {
    className?: string;
    sidebarOpen: boolean;
    children?: ReactNode;
    footer?: ReactNode;
    navbarHeight?: number;
    absolute?: boolean;
}

const Sidebar: FC<Props> = ({ className, sidebarOpen, children, footer, absolute, navbarHeight = 0 }) => {
    const { layer, bgColor, textColor } = useColorLayer();
    const { borderColor } = useColorLayer(2);

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
                    className,
                )}>
                <nav
                    className="sticky flex grow flex-col"
                    style={{
                        top: navbarHeight,
                        maxHeight: `calc(100vh - ${navbarHeight}px)`,
                        minHeight: `calc(100vh - ${navbarHeight}px)`,
                    }}>
                    <ColorLayerContext.Provider value={{ layer }}>
                        <div className="grow overflow-y-auto px-3 py-4">{children}</div>
                        {footer && (
                            <div className="px-3 pb-4">
                                <Divider className="mb-4" />
                                {footer}
                            </div>
                        )}
                    </ColorLayerContext.Provider>
                </nav>
            </aside>
        </ColorLayerContext.Provider>
    );
};

export default Sidebar;
