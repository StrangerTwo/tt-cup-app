import { FC, useEffect, useState } from "react";

import { MoonIcon } from "../icons/MoonIcon";
import { SunIcon } from "../icons/SunIcon";
import { IconButton } from "../ui/IconButton";

export const ColorThemeSwitcher: FC = () => {
    const [theme, setTheme] = useState("light");
    const isDark = theme === "dark";

    useEffect(() => {
        setTheme(
            localStorage.getItem("theme") ??
                (globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
        );
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const changeTheme = () => {
        setTheme((prev) => {
            const theme = prev === "dark" ? "light" : "dark";
            localStorage.setItem("theme", theme);
            return theme;
        });
    };

    return (
        <IconButton onClick={changeTheme}>
            {!isDark && <SunIcon />}
            {isDark && <MoonIcon />}
        </IconButton>
    );
};

export default ColorThemeSwitcher;
