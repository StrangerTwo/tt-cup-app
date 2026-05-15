import { Link, useRouter } from "@tanstack/react-router";
import { FC } from "react";

import { NavCrawlIconButton } from "../components/crawl/NavCrawlIconButton";
import { SidebarIcon } from "../components/icons";
import ColorThemeSwitcher from "../components/lib/ColorThemeSwitcher";
import NavUserIcon from "../components/lib/NavUserIcon";
import { IconButton } from "../components/ui/IconButton";
import { Navbar } from "../components/ui/layout/Navbar";
import { auth } from "../firebase/firebase";

interface Props {
    onHeightChange?: (height: number) => void;
    onSidebarToggle?: () => void;
}

const AdminNavbar: FC<Props> = ({ onHeightChange, onSidebarToggle }) => {
    const router = useRouter();

    const logoClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
        router.navigate({ to: "/" });
    };

    return (
        <Navbar
            onHeightChange={onHeightChange}
            startChildren={
                <>
                    {onSidebarToggle && (
                        <IconButton onClick={onSidebarToggle} className="shrink-0 xl:hidden">
                            <SidebarIcon />
                        </IconButton>
                    )}
                    <Link to="/" className="flex items-center" onClick={logoClick}>
                        <img src="/vite.svg" className="h-8" alt="Bet tips Logo" />
                        <h1 className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">TT Cup</h1>
                    </Link>
                </>
            }
            endChildren={
                <>
                    <NavCrawlIconButton />
                    <ColorThemeSwitcher />
                    <NavUserIcon auth={auth} menuItems={[]} />
                </>
            }></Navbar>
    );
};

export default AdminNavbar;
