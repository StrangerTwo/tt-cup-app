import { FC, MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import UnAuthTemplate from "../auth/UnAuthTemplate";
import { TableIcon, UsersIcon } from "../components/icons";
import Sidebar from "../components/ui/layout/Sidebar";
import { AuthProvider } from "../firebase/AuthProvider";
import { auth } from "../firebase/firebase";
import AdminNavbar from "./AdminNavbar";
import { MainLayoutCtx } from "./MainLayoutContext";
import SidebarItem from "./SidebarItem";

interface Props {
    children: ReactNode;
    hasSidebar?: boolean;
    hasNavbar?: boolean;
}

const MainLayout: FC<Props> = ({ children, hasSidebar = false, hasNavbar = false }) => {
    const [navbarHeight, setNavbarHeight] = useState(hasNavbar ? 72 : 0);
    const [sidebarOpen, setSidebarOpen] = useState(hasSidebar && window.innerWidth > 768);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const onMainClick: MouseEventHandler<HTMLElement> = (e) => {
        if (window.innerWidth > 768) return;
        if (sidebarOpen) {
            setSidebarOpen(false);
            e.preventDefault();
        }
    };

    useEffect(() => {
        const resizeFn = () => {
            if (!hasSidebar) return;
            if (window.innerWidth > 1280) setSidebarOpen(true);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
                setSidebarExpanded(true);
            }
        };
        window.addEventListener("resize", resizeFn);
        return () => window.removeEventListener("resize", resizeFn);
    }, [hasSidebar]);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <MainLayoutCtx.Provider
            value={{
                hasSidebar,
                hasNavbar,
                sidebarExpanded,
                setSidebarExpanded,
            }}>
            <AuthProvider auth={auth} unAuthTemp={<UnAuthTemplate />}>
                {hasNavbar && (
                    <AdminNavbar
                        onHeightChange={hasSidebar ? (h) => setNavbarHeight(h) : undefined}
                        onSidebarToggle={hasSidebar ? () => setSidebarOpen((x) => !x) : undefined}
                    />
                )}
                <div
                    className={twMerge(
                        "mx-auto flex w-full max-w-screen-xl justify-center md:justify-start 2xl:max-w-screen-2xl",
                        !hasSidebar && "md:justify-center",
                    )}
                    style={{ paddingTop: navbarHeight }}>
                    {hasSidebar && (
                        <Sidebar sidebarOpen={sidebarOpen} navbarHeight={navbarHeight} className="font-medium">
                            <div className={"flex flex-col space-y-2"}>
                                <SidebarItem route="/" closeSidebar={closeSidebar} text="Tipy na sázení">
                                    <TableIcon hoverEffects />
                                </SidebarItem>
                                <SidebarItem route="/players" closeSidebar={closeSidebar} text="Hráči">
                                    <UsersIcon hoverEffects />
                                </SidebarItem>
                            </div>
                        </Sidebar>
                    )}
                    <main
                        className={twMerge(
                            "h-full grow border-slate-200 p-1.5 text-gray-700 dark:text-gray-400 md:p-4",
                            hasSidebar && "ms-0 transition-[margin] duration-300",
                            hasSidebar && (sidebarExpanded ? "md:-ms-64" : "md:-ms-20"),
                            hasSidebar && sidebarOpen && "md:ms-0 md:after:hidden",
                        )}
                        style={{
                            maxHeight:
                                sidebarOpen && window.innerWidth <= 768 ? `calc(100vh - ${navbarHeight}px)` : undefined,
                            minHeight: `calc(100vh - ${navbarHeight}px)`,
                        }}
                        onClick={onMainClick}>
                        {children}
                    </main>
                </div>
            </AuthProvider>
        </MainLayoutCtx.Provider>
    );
};

export default MainLayout;
