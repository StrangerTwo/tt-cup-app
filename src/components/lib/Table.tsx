import { FC, Fragment, MouseEventHandler, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { SortIcon, SortMode } from "../icons/SortIcon";
import { useColorLayer } from "../ui/layout/ColorLayer";
import { Skeleton } from "./Skeleton";

export interface TableRowProps<T> {
    item: T;
    i: number;
}

export type TableProps<T> = {
    className?: string;
    caption?: ReactNode;
    heading?: Array<{
        label: string;
        key?: Extract<keyof T, string>;
        className?: string;
    }>;
    sorting?: {
        [key in keyof T]?: (a: T, B: T) => number;
    };
    sort?: Sort<T>;
    onSort?: {
        [key in keyof T]?: (sortMode: SortMode | null) => unknown;
    };
    layerStep?: number;
    data: Array<T>;
    isPending?: boolean;
    onLoadMore?: () => unknown;
    filter?: (x: T) => boolean;
    keyFn?: (x: T) => React.Key | undefined;
    expandRowFn?: (x: T) => ReactNode;
    onRowClick?: (x: T) => void;
} & (
    | {
          children: (x: T, i: number) => ReactNode;
          RowFc?: never;
      }
    | {
          children?: never;
          RowFc: FC<TableRowProps<T>>;
      }
);

export type Sort<T> = {
    key: keyof T;
    mode: SortMode;
};

type OnHeadingClickMap<T> = { [key in keyof T]?: MouseEventHandler<HTMLDivElement> };

export const Table = <T,>({
    layerStep = 0,
    className,
    caption,
    heading,
    sorting,
    sort: _sort,
    onSort,
    data,
    filter,
    keyFn,
    children,
    RowFc,
    expandRowFn,
    onRowClick,
    isPending,
    onLoadMore,
}: TableProps<T>) => {
    const { bgColor, borderColor, textColor } = useColorLayer(layerStep);
    const { bgColor: highlightBgColor, hoverBgColor, textColor: highlightTextColor } = useColorLayer(layerStep + 1);
    const [sort, setSort] = useState<Sort<T> | undefined>(_sort);
    const [selected, setSelected] = useState<React.Key | null>(null);
    const sentinelRef = useRef<HTMLTableRowElement>(null);
    const sentinelIdRef = useRef<number>(data.length);

    useEffect(() => setSort(sort), [sort]);

    const getKey = (x: T, i: number) => keyFn?.(x) ?? i;

    const rowClick = (x: T, i: number) => () => {
        onRowClick && onRowClick(x);
        expandRowFn && setSelected((prev) => (prev === getKey(x, i) ? null : getKey(x, i)));
    };

    const sortHandler = useCallback(
        (key: keyof T) => {
            return () => {
                const mode = sort?.key === key ? (sort.mode == SortMode.ASC ? SortMode.DESC : null) : SortMode.ASC;
                onSort?.[key] && onSort[key](mode);
                setSort(mode ? { key, mode } : undefined);
            };
        },
        [onSort, sort],
    );

    const onHeadingClick = useMemo((): OnHeadingClickMap<T> => {
        return (
            heading?.reduce((prev, h) => {
                if (!h.key) return prev;

                if (onSort?.[h.key] || sorting?.[h.key]) {
                    prev[h.key] = sortHandler(h.key);
                }

                return prev;
            }, {} as OnHeadingClickMap<T>) ?? {}
        );
    }, [heading, onSort, sortHandler, sorting]);

    useEffect(() => {
        if (!onLoadMore) return;
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isPending) {
                    if (data.length != sentinelIdRef.current) {
                        onLoadMore();
                    }
                    sentinelIdRef.current = data.length;
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [data.length, isPending, onLoadMore]);

    return (
        <table className={twMerge("w-full text-left text-sm rtl:text-right", className)}>
            {caption && <caption className="p-5 pt-4 text-left rtl:text-right">{caption}</caption>}
            {heading && (
                <thead className={twMerge("text-xs uppercase", highlightBgColor, highlightTextColor)}>
                    <tr>
                        {heading.map((h, i) => (
                            <th scope="col" className="px-6 py-3" key={h.key ?? i}>
                                <div
                                    className={twMerge(
                                        "inline-flex items-center justify-center gap-1.5",
                                        h.key && onHeadingClick[h.key] && "cursor-pointer",
                                        sort?.key === h.key && "text-gray-900 dark:text-gray-50",
                                        h.className,
                                    )}
                                    onClick={onHeadingClick[h.key]}>
                                    {h.label}
                                    {h.key && onHeadingClick[h.key] && (
                                        <SortIcon
                                            className="min-w-max"
                                            mode={sort?.key === h.key ? sort.mode : undefined}
                                        />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
            )}
            <tbody>
                {data
                    .filter((x) => (filter ? filter(x) : true))
                    .sort((a, b) =>
                        sort && sorting?.[sort.key]
                            ? sorting[sort.key]!(a, b) * (sort.mode === SortMode.ASC ? 1 : -1)
                            : 0,
                    )
                    .map((x, i) => (
                        <Fragment key={getKey(x, i)}>
                            <tr
                                className={twMerge(
                                    bgColor,
                                    hoverBgColor,
                                    textColor,
                                    borderColor,
                                    "border-t",
                                    heading && "first:border-t-0",
                                    (onRowClick || expandRowFn) && "cursor-pointer",
                                    expandRowFn && selected === getKey(x, i) && "border-b-0 " + highlightBgColor,
                                )}
                                onClick={rowClick(x, i)}>
                                {children ? (
                                    children(x, i)
                                ) : (
                                    <>
                                        <RowFc item={x} i={i} />
                                    </>
                                )}
                            </tr>
                            {expandRowFn && selected === getKey(x, i) && (
                                <tr className={twMerge(highlightBgColor, borderColor, "border-b last:border-b-0")}>
                                    <td colSpan={heading?.length || 42} className="px-6 py-4">
                                        {expandRowFn(x)}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                {(isPending || onLoadMore) && (
                    <tr
                        ref={sentinelRef}
                        className={twMerge(bgColor, textColor, borderColor, "border-t", heading && "first:border-t-0")}>
                        {isPending && (
                            <td colSpan={heading?.length || 42}>
                                <Skeleton.Text className="m-4" />
                            </td>
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
