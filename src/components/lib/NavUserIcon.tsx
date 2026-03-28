import { useNavigate } from "@tanstack/react-router";
import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FC, useMemo, useState } from "react";

import { useAuth } from "../../lib/useAuth";
import { FileRoutesByFullPath } from "../../routeTree.gen";
import { IconButton } from "../ui/IconButton";

type MenuItem = {
    label: string;
} & (
    | {
          link?: keyof FileRoutesByFullPath;
          onClick?: undefined;
      }
    | {
          link?: undefined;
          onClick?: () => void;
      }
);

interface Props {
    auth: Auth;
    menuItems?: Array<MenuItem>;
}

const authProvider = new GoogleAuthProvider();
authProvider.setCustomParameters({
    prompt: "select_account",
});

const NavUserIcon: FC<Props> = ({ auth, menuItems }) => {
    const user = useAuth(auth);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const signOutMenuItem = useMemo<MenuItem>(
        () => ({
            label: "Sign out",
            onClick() {
                signOut(auth);
            },
        }),
        [auth],
    );

    const onClick = () => {
        if (!user) {
            signInWithPopup(auth, authProvider);
            return;
        }
        setMenuOpen((x) => !x);
    };

    const itemClick = (item: MenuItem) => () => {
        item.onClick && item.onClick();
        item.link && navigate({ to: item.link });
        setMenuOpen(false);
    };

    return (
        <div className="relative size-10">
            <IconButton onClick={onClick} className="size-full overflow-hidden rounded-full p-0">
                {user ? (
                    <img
                        src={user.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${user.displayName}`}
                        referrerPolicy="no-referrer"
                        alt="avatar"
                    />
                ) : (
                    <div className="relative size-10 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-600">
                        <svg
                            className="absolute -left-1 size-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"></path>
                        </svg>
                    </div>
                )}
            </IconButton>

            {user && (
                <div
                    className={`absolute right-0 top-[calc(100%+0.5rem)] ${menuOpen ? "" : "hidden"} z-50 min-w-32 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow-sm dark:divide-gray-600 dark:bg-slate-700`}
                    id="user-dropdown">
                    <div className="px-4 py-3">
                        <span className="block w-max text-sm text-gray-900 dark:text-white">{user.displayName}</span>
                    </div>
                    <ul className="py-2">
                        {[...(menuItems ?? []), signOutMenuItem].map((x, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={itemClick(x)}
                                    className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-slate-600 dark:hover:text-white">
                                    {x.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NavUserIcon;
