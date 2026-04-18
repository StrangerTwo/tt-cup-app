import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useColorLayer } from "../ui/layout";

interface Props {
    className?: string;
    title: ReactNode;
    children: ReactNode;
}

export const RenderItem = ({ className, title, children }: Props) => {
    const { textHighlightColor } = useColorLayer();

    return (
        <div className={twMerge("flex items-center gap-2 md:gap-4", className)}>
            <dt className={twMerge("font-semibold leading-none", textHighlightColor)}>{title}</dt>
            <dd>{children}</dd>
        </div>
    );
};
