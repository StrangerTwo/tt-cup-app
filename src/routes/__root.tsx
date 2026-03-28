import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

import MainLayout from "../layout/MainLayout";

const RootComponent = () => {
    return (
        <>
            <MainLayout hasNavbar hasSidebar>
                <Outlet />
            </MainLayout>
            <Toaster />
            {/* <TanStackRouterDevtools /> */}
        </>
    );
};

export const Route = createRootRoute({
    component: RootComponent,
});
