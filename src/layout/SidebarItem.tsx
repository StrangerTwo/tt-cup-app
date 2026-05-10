import { Link, useMatchRoute } from "@tanstack/react-router";
import { FC, ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

import { ColorLayerContext, useColorLayer } from "../components/ui/layout";
import { FileRoutesByTo } from "../routeTree.gen";
import { MainLayoutCtx } from "./MainLayoutContext";

interface Props {
    className?: string;
    route: keyof FileRoutesByTo;
    closeSidebar: () => void;
    children: ReactNode;
    text: string;
    pip?: ReactNode;
}

const SidebarItem: FC<Props> = ({ children, text, pip, className, route, closeSidebar }) => {
    const { layer, bgColor, textColor, hoverBgColor } = useColorLayer(0);
    const { bgColor: selectedBgColor, textHighlightColor, hoverTextHighlightColor } = useColorLayer(1);

    const { sidebarExpanded } = useContext(MainLayoutCtx);

    const match = useMatchRoute();

    const isSelected = match({ to: route, fuzzy: true });
    const itemOnClick = () => {
        if (window.innerWidth <= 768) closeSidebar();
    };

    return (
        <ColorLayerContext.Provider value={{ layer }}>
            <Link
                to={route}
                className={twMerge(
                    "group flex cursor-pointer items-center rounded-lg p-2",
                    bgColor,
                    hoverBgColor,
                    textColor,
                    hoverTextHighlightColor,
                    isSelected && selectedBgColor,
                    isSelected && textHighlightColor,
                    pip && "relative",
                    "w-full justify-center self-center",
                    className,
                )}
                onClick={itemOnClick}>
                {children}
                <span
                    className={twMerge(
                        "inline-block flex-1 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300",
                        sidebarExpanded ? "ms-3 max-w-72 grow" : "ms-0 max-w-0",
                    )}>
                    {text}
                </span>

                {pip && (
                    <span
                        className={twMerge(
                            "inline-flex grow items-center justify-center rounded-full bg-blue-100 font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                            "absolute transition-all duration-300",
                            sidebarExpanded
                                ? "right-1 top-1/2 size-3 -translate-y-1/2 p-3 text-sm ease-in"
                                : "right-1/2 top-0 size-1 translate-x-[calc(50%+12px)] p-2 text-xs ease-out",
                        )}>
                        {pip}
                    </span>
                )}
            </Link>
        </ColorLayerContext.Provider>
    );
};

export default SidebarItem;
