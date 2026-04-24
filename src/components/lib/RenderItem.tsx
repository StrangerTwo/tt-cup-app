import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "../ui/layout";

interface Props {
    className?: string;
    title: ReactNode;
    children: ReactNode;
    column?: boolean;
}

export const RenderItem = ({ className, title, children, column }: Props) => {
    const { textHighlightColor } = useColorLayer();

    return (
        <div
            className={twMerge(
                "flex gap-2 whitespace-pre md:gap-4",
                !column && "items-center",
                column && "flex-col",
                className,
            )}>
            <dt className={twMerge("whitespace-nowrap font-semibold leading-none", textHighlightColor)}>{title}</dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
};
