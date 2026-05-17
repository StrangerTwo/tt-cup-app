import { createFileRoute } from "@tanstack/react-router";

import { useGetMatchFilters, useGetTopMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Match } from "../../api/model";
import { SortMode } from "../../components/icons/SortIcon";
import { useUrlSyncedTableState } from "../../components/lib/useUrlSyncedTableState";
import { TopMatchesFilter } from "../../components/match/top/TopMatchesFilter";
import {
    fromMatchFilters,
    topMatchesFilterDefaultValues,
    TopMatchesFilterType,
} from "../../components/match/top/topMatchesFilterSchema";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";

export const Route = createFileRoute("/top/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: defaultFilters } = useGetMatchFilters();
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<TopMatchesFilterType, Match>({
        tableId: "tournaments",
        defaultSorting: [
            {
                key: "time",
                mode: SortMode.DESC,
            },
        ],
        defaultFilters: defaultFilters ? fromMatchFilters(defaultFilters) : topMatchesFilterDefaultValues,
    });
    const { mutateAsync } = useGetTopMatches();
    const { data, isFetching } = usePaginatedQuery({
        mutateAsync,
        paramFn: (pageInfo) => ({
            data: {
                // ...filter,
                filters: [
                    {
                        type: "ELO" as const,
                        value: 5,
                    },
                ],
                pageInfo: {
                    ...pageInfo,
                    // sort: sort ? sortingForRequest([sort]) : undefined,
                },
            },
        }),
        dataFn: (x) => x.results,
        totalPagesFn: ({ pageInfo }) => pageInfo.totalPages,
        queryKey: [EQueryKey.getTopMatches],
    });

    return (
        <>{defaultFilters && <TopMatchesFilter filters={filters} isFetching={isFetching} setFilters={setFilters} />}</>
    );
}
