import { FC } from "react";
import { twMerge } from "tailwind-merge";

type SkeletonComponents = "Card" | "Title" | "Text";

interface Props {
    className?: string;
}

export const Skeleton: {
    [component in SkeletonComponents]: FC<Props>;
} = {
    Card: ({ className }) => (
        <div
            className={twMerge(
                "h-48 animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800",
                className,
            )}>
            <Skeleton.Title className="mb-4" />
            <Skeleton.Text className="mb-2" />
            <Skeleton.Text className="mb-2" />
            <Skeleton.Text />
        </div>
    ),
    Title: ({ className }) => (
        <div
            className={twMerge(
                "h-2.5 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700",
                className,
            )}></div>
    ),
    Text: ({ className }) => (
        <div className={twMerge("h-2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700", className)}></div>
    ),
};
