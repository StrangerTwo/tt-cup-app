import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { FC, ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

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
    const { sidebarExpanded } = useContext(MainLayoutCtx);

    const navigate = useNavigate();
    const match = useMatchRoute();

    const isSelected = match({ to: route, fuzzy: true });
    const itemOnClick = () => {
        navigate({ to: route });
        if (window.innerWidth <= 768) closeSidebar();
    };

    return (
        <div
            className={twMerge(
                "group flex cursor-pointer items-center rounded-lg p-2 text-gray-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700",
                isSelected && "bg-slate-100 dark:bg-slate-700",
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
        </div>
    );
};

export default SidebarItem;
