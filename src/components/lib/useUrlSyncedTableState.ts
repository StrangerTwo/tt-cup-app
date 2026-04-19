import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { sortingForRequest } from "../../lib/sortingForRequest";
import { isDefined, isNil } from "../../lib/utils";
import { SortMode } from "../icons/SortIcon";
import { Sort } from "./Table";

export type Updater<T> = T | ((old: T) => T);

type SearchRecord = Record<string, unknown>;

type TableState<TFilters extends object, T> = {
    filters: TFilters;
    sort: Sort<T> | undefined;
};

type Options<TFilters extends object, T> = {
    tableId: string;
    defaultFilters?: TFilters;
    defaultSorting?: Sort<T>;
    serializeFilters?: (filters: TFilters) => Record<string, unknown>;
    parseFilters?: (raw: unknown, defaults: TFilters) => TFilters;
};

// TanStack setters accept either the next value directly or an updater function `(prev) => next`.
// This normalizes both variants into the final resolved value.
const resolveUpdater = <T>(updater: Updater<T>, prev: T): T => {
    if (typeof updater === "function") {
        const next = updater as (prevState: T) => T;
        return next(prev);
    }

    return updater;
};

type TableUrlKeys = {
    filterPrefix: string;
    sorting: string;
    page: string;
    pageSize: string;
};

const createTableUrlKeys = (tableId: string): TableUrlKeys => ({
    filterPrefix: `t_${tableId}_f_`,
    sorting: `t_${tableId}_sort`,
    page: `t_${tableId}_page`,
    pageSize: `t_${tableId}_pageSize`,
});

const toStableValue = (value: unknown): unknown => {
    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(toStableValue);
    }

    if (isDefined(value) && typeof value === "object") {
        const record = value as Record<string, unknown>;
        const sortedRecord: Record<string, unknown> = {};

        Object.keys(record)
            .sort()
            .forEach((key) => {
                sortedRecord[key] = toStableValue(record[key]);
            });

        return sortedRecord;
    }

    return value;
};

const stableStringify = (value: unknown): string => JSON.stringify(toStableValue(value));

const isTableKey = (key: string, tableKeys: TableUrlKeys): boolean => {
    return (
        key === tableKeys.sorting ||
        key === tableKeys.page ||
        key === tableKeys.pageSize ||
        key.startsWith(tableKeys.filterPrefix)
    );
};

const pickTableParams = (record: SearchRecord, tableKeys: TableUrlKeys): SearchRecord => {
    const tableParams: SearchRecord = {};

    Object.entries(record).forEach(([key, value]) => {
        if (isTableKey(key, tableKeys)) {
            tableParams[key] = value;
        }
    });

    return tableParams;
};

const areTableParamsEqual = (
    currentSearch: SearchRecord,
    nextSearch: SearchRecord,
    tableKeys: TableUrlKeys,
): boolean => {
    const currentTableParams = pickTableParams(currentSearch, tableKeys);
    const nextTableParams = pickTableParams(nextSearch, tableKeys);

    return stableStringify(currentTableParams) === stableStringify(nextTableParams);
};

const isSortingState = <T>(value: unknown): value is Sort<T> => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const row = value as Record<string, unknown>;
    return typeof row.id === "string" && typeof row.desc === "boolean";
};

const parseSorting = <T>(raw: unknown): Sort<T> | undefined => {
    if (isSortingState(raw)) {
        return raw;
    }

    if (typeof raw !== "string" || raw.trim().length === 0) {
        return undefined;
    }

    const entry = raw.trim();
    const [key, _mode] = entry.split(":");
    if (!key) return undefined;
    const mode = _mode === "asc" || _mode === "desc" ? (_mode as SortMode) : undefined;
    if (!mode) return undefined;

    return { key: key as keyof T, mode };
};

const defaultSerializeFilters = <TFilters extends object>(filters: TFilters) => filters as Record<string, unknown>;

const defaultParseFilters = <TFilters extends object>(raw: unknown, defaults: TFilters): TFilters => {
    if (isNil(raw) || typeof raw !== "object") {
        return defaults;
    }

    const rawRecord = raw as Record<string, unknown>;
    const knownKeys = Object.keys(defaults) as Array<keyof TFilters>;

    // When defaults has no keys (e.g. `{} as T`), accept all raw params — the caller
    // has no known key set to filter against, so we preserve backward-compatible behaviour.
    if (knownKeys.length === 0) {
        return { ...rawRecord } as TFilters;
    }

    return knownKeys.reduce<TFilters>(
        (acc, key) => (Object.hasOwn(rawRecord, key as string) ? { ...acc, [key]: rawRecord[key as string] } : acc),
        { ...defaults },
    );
};

export const useUrlSyncedTableState = <TFilters extends object, T>({
    tableId,
    defaultFilters,
    defaultSorting,
    serializeFilters = defaultSerializeFilters,
    parseFilters,
}: Options<TFilters, T>) => {
    const search = useSearch({ strict: false });
    const navigate = useNavigate();

    const filters = defaultFilters ?? ({} as TFilters);
    const keys = createTableUrlKeys(tableId);
    const filterParser = parseFilters ?? defaultParseFilters;
    const defaultSerializedFilters = serializeFilters(filters);
    const defaultSerializedFiltersKey = stableStringify(defaultSerializedFilters);
    const defaultSortingKey = stableStringify(defaultSorting);

    const readState = (record: SearchRecord): TableState<TFilters, T> => {
        const flatFilters: Record<string, unknown> = {};

        Object.entries(record).forEach(([key, value]) => {
            if (key.startsWith(keys.filterPrefix)) {
                flatFilters[key.slice(keys.filterPrefix.length)] = value;
            }
        });

        const parsedFilters = filterParser(flatFilters, filters);

        const sorting = parseSorting(record[keys.sorting]) ?? defaultSorting;

        return {
            filters: parsedFilters,
            sort: sorting,
        };
    };

    const writeState = (prev: SearchRecord, nextState: TableState<TFilters, T>): SearchRecord => {
        const next = { ...prev };
        const serializedFilters = serializeFilters(nextState.filters);
        const serializedFiltersKey = stableStringify(serializedFilters);
        const shouldStoreFilters = serializedFiltersKey !== defaultSerializedFiltersKey;

        Object.keys(next).forEach((key) => {
            if (key.startsWith(keys.filterPrefix)) {
                delete next[key];
            }
        });

        if (shouldStoreFilters) {
            Object.entries(serializedFilters).forEach(([key, value]) => {
                if (!isDefined(value) || value === "") {
                    return;
                }

                next[`${keys.filterPrefix}${key}`] = value;
            });
        }

        const shouldStoreSorting = stableStringify(nextState.sort) !== defaultSortingKey;
        if (shouldStoreSorting) {
            next[keys.sorting] = sortingForRequest(nextState.sort ? [nextState.sort] : [])[0];
        } else {
            delete next[keys.sorting];
        }

        return next;
    };

    const updateState = (updater: (current: TableState<TFilters, T>) => TableState<TFilters, T>) => {
        navigate({
            replace: true,
            resetScroll: false,
            search: (prev) => {
                const prevRecord = prev as SearchRecord;
                const current = readState(prevRecord);
                const nextState = updater(current);
                return writeState(prevRecord, nextState) as never;
            },
        });
    };

    const setFilters = (updater: Updater<TFilters>, resetPageIndex?: boolean) => {
        updateState((current) => ({
            ...current,
            filters: resolveUpdater(updater, current.filters),
        }));
    };

    const setSort = (updater: Updater<Sort<T> | undefined>, resetPageIndex?: boolean) => {
        updateState((current) => ({
            ...current,
            sort: resolveUpdater(updater, current.sort),
        }));
    };

    const resetTableState = () => {
        updateState(() => ({
            filters,
            sort: defaultSorting,
        }));
    };

    const state = readState(search);
    const normalizedSearch = writeState(search, state);

    useEffect(() => {
        if (areTableParamsEqual(search, normalizedSearch, keys)) {
            return;
        }

        navigate({
            replace: true,
            resetScroll: false,
            search: () => normalizedSearch as never,
        });
    }, [navigate, normalizedSearch, search, keys]);

    return {
        filters: state.filters,
        sort: state.sort,
        setFilters,
        setSort,
        resetTableState,
    };
};
