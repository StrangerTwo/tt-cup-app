import { Fragment, MouseEventHandler, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { SortMode } from "../icons/SortIcon";
import { useColorLayer } from "../ui/layout/ColorLayer";
import { Skeleton } from "./Skeleton";
import { TableCell } from "./TableCell";
import { TableHeadingCell } from "./TableHeadingCell";

export interface TableRowProps<T> {
    item: T;
    i: number;
}

export interface TableHeading<T> {
    label: string;
    key?: Extract<keyof T, string>;
    className?: string;
}

export type TableProps<T> = {
    className?: string;
    caption?: ReactNode;
    heading?: Array<TableHeading<T>>;
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
    children: (x: T, i: number) => ReactNode;
};

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
    }, [data, isPending, onLoadMore]);

    return (
        <table className={twMerge("w-full text-left text-sm rtl:text-right", className)}>
            {caption && <caption className="p-2 pt-1 text-left md:p-5 md:pt-4 rtl:text-right">{caption}</caption>}
            {heading && (
                <thead className={twMerge("text-xs uppercase", highlightBgColor, highlightTextColor)}>
                    <tr>
                        {heading.map((h, i) => (
                            <TableHeadingCell<T>
                                key={h.key ?? i}
                                heading={h}
                                onClick={onHeadingClick[h.key]}
                                setSort={setSort}
                                sort={sort}
                            />
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
                                {children(x, i)}
                            </tr>
                            {expandRowFn && selected === getKey(x, i) && (
                                <tr className={twMerge(highlightBgColor, borderColor, "border-b last:border-b-0")}>
                                    <TableCell colSpan={heading?.length || 42}>{expandRowFn(x)}</TableCell>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                {(isPending || onLoadMore) && (
                    <tr
                        ref={sentinelRef}
                        className={twMerge(bgColor, textColor, borderColor, "border-t", heading && "first:border-t-0")}>
                        {isPending && (
                            <TableCell colSpan={heading?.length || 42}>
                                <Skeleton.Text className="m-4" />
                            </TableCell>
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
