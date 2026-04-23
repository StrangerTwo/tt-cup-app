import { Fragment, MouseEventHandler, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { SortMode } from "../icons/SortIcon";
import { ColorLayerContext, useColorLayer } from "../ui/layout/ColorLayer";
import { Skeleton } from "./Skeleton";
import { TableCell } from "./TableCell";
import { TableHeadingCell } from "./TableHeadingCell";
import { useLoadMoreSentinel } from "./useLoadMoreSentinel";

export interface TableRowProps<T> {
    item: T;
    i: number;
}

export interface TableHeading<T> {
    label: string;
    key?: NestedKeys<T>;
    className?: string;
}

export type TableProps<T> = {
    className?: string;
    caption?: ReactNode;
    heading?: Array<TableHeading<T>>;
    sorting?: {
        [key in NestedKeys<T>]?: (a: T, B: T) => number;
    };
    sort?: Sort<T>;
    onSort?: {
        [key in NestedKeys<T>]?: (sortMode: SortMode | null) => unknown;
    };
    layerStep?: number;
    data: Array<T>;
    isPending?: boolean;
    onLoadMore?: () => unknown;
    filter?: (x: T) => boolean;
    keyFn?: (x: T) => React.Key | undefined;
    expandRow?: (x: T) => ReactNode;
    onRowClick?: (x: T) => void;
    children: (x: T, i: number, selected: boolean) => ReactNode;
};

type NestedKeys<T> = {
    [K in Extract<keyof T, string>]: T[K] extends Array<any> // Arrays → allow the key itself
        ? K
        : // Objects (but not arrays) → expand one level deep
          NonNullable<T[K]> extends object
          ? NonNullable<T[K]> extends Array<any>
              ? K
              : `${K}.${Extract<keyof NonNullable<T[K]>, string>}`
          : // Primitives → allow key itself
            K;
}[Extract<keyof T, string>];

export type Sort<T> = {
    key: NestedKeys<T>;
    mode: SortMode;
};

type OnHeadingClickMap<T> = { [key in NestedKeys<T>]?: MouseEventHandler<HTMLDivElement> };

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
    expandRow,
    onRowClick,
    isPending,
    onLoadMore,
}: TableProps<T>) => {
    const { layer, bgColor, borderColor, textColor } = useColorLayer(layerStep);
    const {
        bgColor: highlightBgColor,
        borderColor: highlightBorderColor,
        hoverBgColor,
        textColor: highlightTextColor,
    } = useColorLayer(layerStep + 1);
    const [sort, setSort] = useState<Sort<T> | undefined>(_sort);
    const [selected, setSelected] = useState<React.Key | null>(null);
    const { sentinelRef } = useLoadMoreSentinel<HTMLTableRowElement>(data, onLoadMore, isPending);

    useEffect(() => setSort(sort), [sort]);

    const getKey = (x: T, i: number) => keyFn?.(x) ?? i;

    const rowClick = (x: T, i: number) => () => {
        onRowClick && onRowClick(x);
        expandRow && setSelected((prev) => (prev === getKey(x, i) ? null : getKey(x, i)));
    };

    const sortHandler = useCallback(
        (key: NestedKeys<T>) => {
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
                                    (onRowClick || expandRow) && "cursor-pointer",
                                    expandRow &&
                                        selected === getKey(x, i) &&
                                        highlightBorderColor + " border-b " + highlightBgColor,
                                )}
                                onClick={rowClick(x, i)}>
                                <ColorLayerContext.Provider
                                    value={{ layer: selected === getKey(x, i) ? layer + 1 : layer }}>
                                    {children(x, i, selected === getKey(x, i))}
                                </ColorLayerContext.Provider>
                            </tr>
                            {expandRow && selected === getKey(x, i) && (
                                <tr className={twMerge(highlightBgColor, borderColor, "border-b last:border-b-0")}>
                                    <ColorLayerContext.Provider value={{ layer: layer + 1 }}>
                                        <TableCell colSpan={heading?.length || 42}>{expandRow(x)}</TableCell>
                                    </ColorLayerContext.Provider>
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
