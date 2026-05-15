import { createFileRoute } from "@tanstack/react-router";

import { useGetTopMatches } from "../../api/api";
import { EQueryKey } from "../../api/EQueryKey";
import { Match } from "../../api/model";
import { SortMode } from "../../components/icons/SortIcon";
import { useUrlSyncedTableState } from "../../components/lib/useUrlSyncedTableState";
import { TopMatchesFilter } from "../../components/match/top/TopMatchesFilter";
import { TopMatchesFilterType } from "../../components/match/top/topMatchesFilterSchema";
import { usePaginatedQuery } from "../../lib/usePaginatedQuery";

export const Route = createFileRoute("/top/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { sort, setSort, filters, setFilters } = useUrlSyncedTableState<TopMatchesFilterType, Match>({
        tableId: "tournaments",
        defaultSorting: [
            {
                key: "time",
                mode: SortMode.DESC,
            },
        ],
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
        <>
            <TopMatchesFilter filters={filters} isFetching={isFetching} setFilters={setFilters} />
        </>
    );
}
