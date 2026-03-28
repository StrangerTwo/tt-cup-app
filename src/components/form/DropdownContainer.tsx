import { ReactNode, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ArrowIcon } from "../icons";

export interface DropdownContainerProps<T> {
    className?: string;
    options: Array<{
        label: string;
        value: T;
    }>;
    onChange: (x: T) => void;
}

interface Props<T> extends DropdownContainerProps<T> {
    children: (x: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        icon: React.JSX.Element;
    }) => ReactNode;
    iconClassName?: string;
    optionListClassname?: string;
}

export const DropdownContainer = <T,>({
    className,
    options,
    iconClassName,
    optionListClassname,
    onChange,
    children,
}: Props<T>) => {
    const [open, setOpen] = useState(false);

    const icon = useMemo(
        () => <ArrowIcon className={twMerge(iconClassName)} direction={open ? "up" : "down"} />,
        [iconClassName, open],
    );
    const controller = useMemo(() => children({ open, setOpen, icon }), [icon, setOpen, open, children]);

    return (
        <div className={twMerge("relative inline-block", className)}>
            {controller}
            <div
                className={twMerge(
                    "absolute top-full z-20 min-w-full divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-700",
                    !open && "hidden",
                )}>
                <ul className={twMerge("text-sm text-gray-700 dark:text-gray-200", optionListClassname)}>
                    {options.map((o, i) => (
                        <li
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!open) return;
                                setOpen(false);
                                onChange(o.value);
                            }}>
                            <a className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                {o.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
