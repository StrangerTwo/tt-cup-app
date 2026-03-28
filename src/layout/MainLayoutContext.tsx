import { createContext } from "react";

interface MainLayoutContext {
    hasSidebar: boolean;
    hasNavbar: boolean;
    sidebarExpanded: boolean;
    setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MainLayoutCtx = createContext({} as MainLayoutContext);
