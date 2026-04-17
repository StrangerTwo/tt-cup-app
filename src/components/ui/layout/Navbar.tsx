import { FC, ReactNode, useEffect, useRef } from "react";

interface Props {
    onHeightChange?: (height: number) => void;
    startChildren?: ReactNode;
    endChildren?: ReactNode;
    children?: ReactNode;
}

export const Navbar: FC<Props> = ({ onHeightChange, startChildren, children, endChildren }) => {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav || !onHeightChange) return;
        const fn = () => {
            onHeightChange(nav.scrollHeight);
        };
        fn();
        nav.addEventListener("resize", fn);
        return () => {
            nav.removeEventListener("resize", fn);
        };
    }, [onHeightChange]);

    return (
        <nav
            ref={navRef}
            className="fixed start-0 top-0 z-50 w-full border-b border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800">
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-1.5 md:p-4 2xl:max-w-screen-2xl">
                <div className="flex w-32 justify-start gap-2 md:w-48">{startChildren}</div>
                {children}
                <div className="flex w-32 justify-end gap-2 md:order-2 md:w-48">{endChildren}</div>
            </div>
        </nav>
    );
};
